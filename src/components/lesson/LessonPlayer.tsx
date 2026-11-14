import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ALL_UNITS, nodeCount } from "../../data/course";
import { answerText, buildLesson, grade, promptLabel } from "../../engine/generate";
import type { Exercise } from "../../engine/types";
import { MAX_HEARTS, formatCountdown, heartsReadyIn, useActions, useStore } from "../../state/store";
import { primeSpeech, sfx, speak } from "../../lib/speech";
import { Button, Modal } from "../ui";
import {
  IconCheck,
  IconGem,
  IconHeart,
  IconHeartOff,
  IconSpeaker,
  IconX,
  Mascot,
} from "../../art/brand";
import { ExerciseView, hotkeyChoices, type Response } from "./exercises";

export interface LessonResult {
  xp: number;
  perfect: boolean;
  accuracy: number;
  seconds: number;
  listens: number;
}

interface Props {
  unitId: string;
  lessonIndex: number;
  practice: boolean;
  onExit: () => void;
  onDone: (result: LessonResult) => void;
}

export function LessonPlayer({ unitId, lessonIndex, practice, onExit, onDone }: Props) {
  const { state } = useStore();
  const actions = useActions();

  const ref = ALL_UNITS.find((entry) => entry.unit.id === unitId);
  const isReview = !!ref && lessonIndex >= ref.unit.lessonCount;

  const queue0 = useMemo(() => {
    if (!ref) return [];
    return buildLesson(
      {
        unitId,
        lessonIndex,
        tier: ref.section.tier,
        isReview,
        title: ref.unit.title,
        allowListening: state.settings.listening,
      },
      practice ? Math.floor(Date.now() / 60000) % 7 : 0,
    );
  }, [ref, unitId, lessonIndex, isReview, practice, state.settings.listening]);

  const [queue, setQueue] = useState<Exercise[]>(queue0);
  const [cursor, setCursor] = useState(0);
  const [response, setResponse] = useState<Response>(null);
  const [verdict, setVerdict] = useState<"none" | "ok" | "no">("none");
  const [solved, setSolved] = useState(0);
  const [firstTryRight, setFirstTryRight] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [listens, setListens] = useState(0);
  const [retried, setRetried] = useState<Set<string>>(new Set());
  const [showQuit, setShowQuit] = useState(false);
  const [showHeartsIntro, setShowHeartsIntro] = useState(false);
  const [dead, setDead] = useState(false);
  const startedAt = useRef(Date.now());
  useEffect(() => {
    // 첫 진입 시 음성 엔진을 깨워둔다 (iOS는 제스처 안에서 한 번 울려야 열린다)
    primeSpeech();
  }, []);
  const mistakesRef = useRef(0);

  useEffect(() => {
    setQueue(queue0);
    setCursor(0);
    setSolved(0);
    setFirstTryRight(0);
    setAttempts(0);
    setRetried(new Set());
    startedAt.current = Date.now();
    mistakesRef.current = 0;
  }, [queue0]);

  const exercise = queue[cursor];
  const total = queue0.length;
  const locked = verdict !== "none";

  const ready = useMemo(() => {
    if (!exercise) return false;
    if (exercise.kind === "match") return response === true;
    if (exercise.kind === "type-in") return typeof response === "string" && response.trim().length > 0;
    if (exercise.kind === "word-bank" || exercise.kind === "listen")
      return Array.isArray(response) && response.length > 0;
    return typeof response === "string" && response.length > 0;
  }, [exercise, response]);

  const submit = useCallback(
    (forceWrong = false) => {
    if (!exercise || locked || (!ready && !forceWrong)) return;
    const correct = !forceWrong && grade(exercise, response);
    setAttempts((n) => n + 1);
    if (correct) {
      if (!retried.has(exercise.id)) setFirstTryRight((n) => n + 1);
      setSolved((n) => n + 1);
      setVerdict("ok");
      if (state.settings.sound) sfx.correct();
      if (exercise.kind === "listen") setListens((n) => n + 1);
    } else {
      setVerdict("no");
      if (state.settings.sound) sfx.wrong();
      mistakesRef.current += 1;
      if (!practice) {
        actions.loseHeart();
        if (mistakesRef.current === 1 && state.hearts === MAX_HEARTS) setShowHeartsIntro(true);
        if (state.hearts - 1 <= 0) setDead(true);
      }
      setRetried((prev) => new Set(prev).add(exercise.id));
      setQueue((prev) => [...prev, exercise]);
    }
    },
    [exercise, locked, ready, response, retried, state.settings.sound, state.hearts, practice, actions],
  );

  const advance = useCallback(() => {
    setVerdict("none");
    setResponse(null);
    if (cursor + 1 >= queue.length) {
      const seconds = Math.round((Date.now() - startedAt.current) / 1000);
      const perfect = mistakesRef.current === 0;
      const base = isReview ? 20 : 10;
      const xp = base + (perfect ? 5 : 0) + (practice ? -4 : 0);
      if (state.settings.sound) sfx.finish();
      onDone({
        xp: Math.max(4, xp),
        perfect,
        accuracy: Math.round((firstTryRight / Math.max(1, total)) * 100),
        seconds,
        listens,
      });
      return;
    }
    setCursor((n) => n + 1);
  }, [cursor, queue.length, isReview, practice, state.settings.sound, onDone, attempts, firstTryRight, total, listens]);

  /* 키보드만으로 레슨 전체를 진행할 수 있게 한다 (원본과 동일한 조작 모델) */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (showQuit || showHeartsIntro || dead) return;
      if (event.key === "Enter") {
        const target = event.target as HTMLElement | null;
        if (target?.tagName === "TEXTAREA") event.preventDefault();
        if (locked) advance();
        else submit(false);
        return;
      }
      if (!exercise || locked) return;
      const choices = hotkeyChoices(exercise);
      const digit = Number(event.key);
      if (choices.length && digit >= 1 && digit <= choices.length) {
        const active = document.activeElement as HTMLElement | null;
        if (active?.tagName === "TEXTAREA" || active?.tagName === "INPUT") return;
        setResponse(choices[digit - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, submit, locked, exercise, showQuit, showHeartsIntro, dead]);

  if (!ref || !exercise) return null;

  const progress = Math.round((solved / Math.max(1, total)) * 100);
  const unitTotalNodes = nodeCount(ref.unit);

  return (
    <div className="lesson">
      <header className="lesson__top">
        <button type="button" className="lesson__quit" onClick={() => setShowQuit(true)} aria-label="레슨 나가기">
          <IconX size={24} />
        </button>
        <div className="lesson__bar">
          <div className="bar">
            <div className="bar__fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className={`lesson__hearts ${practice ? "is-muted" : ""}`} aria-label={`하트 ${state.hearts}개`}>
          <IconHeart size={22} />
          <span>{practice ? "∞" : state.hearts}</span>
        </div>
      </header>

      <main className="lesson__body">
        <div className="lesson__kicker">
          {exercise.isNew && <span className="kicker kicker--new">새로운 단어</span>}
          <span className="kicker">{promptLabel(exercise)}</span>
          <span className="kicker kicker--dim">
            {ref.section.cefr} · {ref.unit.title} · {isReview ? "유닛 복습" : `레슨 ${lessonIndex + 1}/${unitTotalNodes - 1}`}
          </span>
        </div>

        <h1 className="lesson__q t-display">{questionFor(exercise)}</h1>

        {(exercise.kind === "word-bank" || exercise.kind === "type-in") && (
          <div className="source">
            <Mascot size={128} mood="think" />
            <div className="source__bubble">
              <p className={exercise.kind === "word-bank" && exercise.direction === "en->ko" ? "t-en source__text" : "source__text"}>
                {exercise.prompt}
              </p>
              {/* 출제문이 영어일 때만 들려준다 — 번역해야 할 정답을 미리 읽어주면 문제가 무의미해진다 */}
              {exercise.kind === "word-bank" && exercise.direction === "en->ko" && (
                <button
                  type="button"
                  className="source__say"
                  onClick={() => speak(exercise.sentence.en)}
                  aria-label="문장 듣기"
                >
                  <IconSpeaker size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        <ExerciseView
          exercise={exercise}
          response={response}
          onChange={setResponse}
          locked={locked}
          verdict={verdict}
        />
      </main>

      <footer className={`lesson__foot ${verdict === "ok" ? "is-ok" : verdict === "no" ? "is-no" : ""}`}>
        <div className="lesson__foot-inner">
          {verdict === "none" ? (
            <>
              <Button tone="quiet" onClick={() => submit(true)}>
                건너뛰기
              </Button>
              <Button onClick={() => submit(false)} disabled={!ready} size="lg">
                확인
              </Button>
            </>
          ) : (
            <>
              <div className="verdict">
                <span className={`verdict__badge ${verdict === "ok" ? "is-ok" : "is-no"}`}>
                  {verdict === "ok" ? <IconCheck size={26} /> : <IconX size={26} />}
                </span>
                <div className="verdict__text">
                  <strong>{verdict === "ok" ? "잘하셨어요!" : "정답:"}</strong>
                  {verdict === "no" && <span className="t-en">{answerText(exercise)}</span>}
                </div>
              </div>
              <Button tone={verdict === "ok" ? "ok" : "no"} onClick={advance} size="lg">
                계속하기
              </Button>
            </>
          )}
        </div>
      </footer>

      <Modal open={showQuit} onClose={() => setShowQuit(false)}>
        <Mascot size={180} mood="sad" />
        <h2 className="t-title" style={{ marginTop: 10 }}>지금 나가면 진도가 사라져요</h2>
        <p className="t-body" style={{ color: "var(--ink-2)", marginTop: 8 }}>
          이 레슨에서 푼 {solved}문제는 저장되지 않습니다.
        </p>
        <div className="stack" style={{ gap: 10, marginTop: 20 }}>
          <Button block onClick={() => setShowQuit(false)}>
            계속 학습하기
          </Button>
          <Button block tone="ghost" onClick={onExit}>
            나가기
          </Button>
        </div>
      </Modal>

      <Modal open={showHeartsIntro} onClose={() => setShowHeartsIntro(false)}>
        <div className="hearts-row">
          {Array.from({ length: MAX_HEARTS }).map((_, index) =>
            index < state.hearts ? (
              <span key={index} className="hearts-row__on">
                <IconHeart size={28} />
              </span>
            ) : (
              <span key={index} className="hearts-row__off">
                <IconHeartOff size={28} />
              </span>
            ),
          )}
        </div>
        <h2 className="t-title" style={{ marginTop: 14 }}>오답 한 개마다 하트를 하나 잃어요</h2>
        <p className="t-body" style={{ color: "var(--ink-2)", marginTop: 8 }}>
          하트를 다 쓰면 잠시 쉬었다 와야 해요. 천천히, 정확하게 풀어 보세요.
        </p>
        <Button block style={{ marginTop: 20 }} onClick={() => setShowHeartsIntro(false)}>
          계속 학습하기
        </Button>
      </Modal>

      <Modal open={dead && state.hearts <= 0}>
        <Mascot size={180} mood="sad" />
        <h2 className="t-title" style={{ marginTop: 10 }}>하트를 모두 썼어요</h2>
        <p className="t-body" style={{ color: "var(--ink-2)", marginTop: 8 }}>
          {formatCountdown(heartsReadyIn(state))} 뒤에 하트가 하나 회복돼요.
        </p>
        <div className="stack" style={{ gap: 10, marginTop: 20 }}>
          <Button
            block
            tone="gold"
            disabled={state.gems < 350}
            onClick={() => {
              actions.buyHearts();
              setDead(false);
            }}
          >
            <IconGem size={18} /> 350으로 하트 채우기
          </Button>
          <Button block tone="ghost" onClick={onExit}>
            학습 경로로 돌아가기
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function questionFor(exercise: Exercise): string {
  switch (exercise.kind) {
    case "pick-image":
    case "pick-word":
      return exercise.prompt;
    case "word-bank":
      return exercise.direction === "ko->en" ? "이 문장을 영어로 옮기세요" : "이 문장을 한국어로 옮기세요";
    case "type-in":
      return "이 문장을 영어로 입력하세요";
    case "listen":
      return "들은 문장을 그대로 적어 보세요";
    case "match":
      return "짝을 맞춰 보세요";
  }
}

