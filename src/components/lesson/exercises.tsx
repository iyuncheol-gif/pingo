import { useEffect, useMemo, useRef, useState } from "react";
import type { Exercise } from "../../engine/types";
import { Pictogram } from "../../art/pictograms";
import { IconSlow, IconSpeaker } from "../../art/brand";
import { speak } from "../../lib/speech";
import { useStore } from "../../state/store";

export type Response = string | string[] | boolean | null;

interface ExerciseProps {
  exercise: Exercise;
  response: Response;
  onChange: (value: Response) => void;
  /** 채점 후에는 입력을 잠근다 */
  locked: boolean;
  verdict: "none" | "ok" | "no";
}

const keyBadge = (index: number) => (index < 9 ? String(index + 1) : "");

/* ---------------- 그림 고르기 ---------------- */

function PickImage({ exercise, response, onChange, locked, verdict }: ExerciseProps) {
  if (exercise.kind !== "pick-image") return null;
  return (
    <div className="grid-pics" data-count={exercise.choices.length}>
      {exercise.choices.map((word, index) => {
        const selected = response === word.en;
        const state =
          locked && selected ? (verdict === "ok" ? "is-ok" : "is-no") : selected ? "is-on" : "";
        return (
          <button
            key={word.en}
            type="button"
            className={`pic-card ${state}`}
            onClick={() => !locked && onChange(word.en)}
            disabled={locked}
            aria-pressed={selected}
          >
            <span className="pic-card__art">
              <Pictogram name={word.en} size={84} />
            </span>
            <span className="pic-card__foot">
              <span className="pic-card__label t-en">{word.en}</span>
              <span className="pic-card__key">{keyBadge(index)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- 뜻 고르기 ---------------- */

function PickWord({ exercise, response, onChange, locked, verdict }: ExerciseProps) {
  if (exercise.kind !== "pick-word") return null;
  return (
    <ul className="choice-list">
      {exercise.choices.map((choice, index) => {
        const selected = response === choice;
        const state =
          locked && selected ? (verdict === "ok" ? "is-ok" : "is-no") : selected ? "is-on" : "";
        return (
          <li key={choice}>
            <button
              type="button"
              className={`opt ${state}`}
              onClick={() => !locked && onChange(choice)}
              disabled={locked}
              aria-pressed={selected}
            >
              <span className="opt__key">{keyBadge(index)}</span>
              <span className="opt__text">{choice}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------- 단어 은행 조립 ---------------- */

function WordBank({ exercise, response, onChange, locked, verdict }: ExerciseProps) {
  if (exercise.kind !== "word-bank" && exercise.kind !== "listen") return null;
  const picked = Array.isArray(response) ? response : [];

  // 같은 단어가 여러 번 나와도 각각 선택되도록 인덱스로 소비 상태를 관리
  const spent = useMemo(() => {
    const counts = new Map<string, number>();
    picked.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));
    const used: boolean[] = [];
    const seen = new Map<string, number>();
    exercise.bank.forEach((token, index) => {
      const soFar = seen.get(token) ?? 0;
      const need = counts.get(token) ?? 0;
      used[index] = soFar < need;
      seen.set(token, soFar + 1);
    });
    return used;
  }, [picked, exercise.bank]);

  const answerClass = locked ? (verdict === "ok" ? "is-ok" : "is-no") : "";

  return (
    <div className="bank">
      <div className={`bank__answer ${answerClass}`}>
        {picked.length === 0 && <span className="bank__hint">아래에서 단어를 골라 문장을 만드세요</span>}
        {picked.map((token, index) => (
          <button
            key={`${token}-${index}`}
            type="button"
            className="tile"
            disabled={locked}
            onClick={() => onChange(picked.filter((_, i) => i !== index))}
          >
            {token}
          </button>
        ))}
      </div>
      <div className="bank__rule" />
      <div className="bank__pool">
        {exercise.bank.map((token, index) => (
          <button
            key={`${token}-${index}`}
            type="button"
            className={`tile ${spent[index] ? "is-spent" : ""}`}
            disabled={locked || spent[index]}
            onClick={() => onChange([...picked, token])}
          >
            {token}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 직접 입력 ---------------- */

function TypeIn({ exercise, response, onChange, locked, verdict }: ExerciseProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!locked) ref.current?.focus();
  }, [locked, exercise.id]);
  if (exercise.kind !== "type-in") return null;
  return (
    <textarea
      ref={ref}
      className={`type-in ${locked ? (verdict === "ok" ? "is-ok" : "is-no") : ""}`}
      value={typeof response === "string" ? response : ""}
      onChange={(event) => onChange(event.target.value)}
      disabled={locked}
      rows={3}
      spellCheck={false}
      autoComplete="off"
      placeholder="영어로 입력하세요"
      aria-label="영문 번역 입력"
    />
  );
}

/* ---------------- 듣기 ---------------- */

function Listen(props: ExerciseProps) {
  const { exercise } = props;
  const { state } = useStore();
  const autoSpeak = state.settings.autoSpeak;
  const spoken = useRef<string | null>(null);
  useEffect(() => {
    if (exercise.kind !== "listen" || !autoSpeak) return;
    if (spoken.current === exercise.id) return;
    spoken.current = exercise.id;
    const timer = window.setTimeout(() => speak(exercise.sentence.en), 280);
    return () => window.clearTimeout(timer);
  }, [exercise, autoSpeak]);

  if (exercise.kind !== "listen") return null;
  return (
    <div className="listen">
      <div className="listen__players">
        <button
          type="button"
          className="play play--main"
          onClick={() => speak(exercise.sentence.en)}
          aria-label="문장 듣기"
        >
          <IconSpeaker size={34} />
        </button>
        <button
          type="button"
          className="play play--slow"
          onClick={() => speak(exercise.sentence.en, { slow: true })}
          aria-label="천천히 듣기"
        >
          <IconSlow size={22} />
        </button>
      </div>
      <WordBank {...props} />
    </div>
  );
}

/* ---------------- 짝 맞추기 ---------------- */

function Match({ exercise, onChange, locked }: ExerciseProps) {
  const [leftPick, setLeftPick] = useState<string | null>(null);
  const [rightPick, setRightPick] = useState<string | null>(null);
  const [cleared, setCleared] = useState<string[]>([]);
  const [missed, setMissed] = useState<string | null>(null);

  const shuffledRight = useMemo(() => {
    if (exercise.kind !== "match") return [];
    return exercise.pairs
      .map((pair) => pair.ko)
      .slice()
      .sort((a, b) => a.localeCompare(b, "ko"));
  }, [exercise]);

  useEffect(() => {
    setLeftPick(null);
    setRightPick(null);
    setCleared([]);
  }, [exercise.id]);

  useEffect(() => {
    if (exercise.kind !== "match") return;
    if (leftPick && rightPick) {
      const hit = exercise.pairs.find((pair) => pair.en === leftPick && pair.ko === rightPick);
      if (hit) {
        const next = [...cleared, hit.en];
        setCleared(next);
        if (next.length === exercise.pairs.length) onChange(true);
      } else {
        setMissed(`${leftPick}|${rightPick}`);
        window.setTimeout(() => setMissed(null), 420);
      }
      setLeftPick(null);
      setRightPick(null);
    }
  }, [leftPick, rightPick, exercise, cleared, onChange]);

  if (exercise.kind !== "match") return null;

  const cellClass = (value: string, side: "en" | "ko") => {
    const pair = exercise.pairs.find((p) => (side === "en" ? p.en : p.ko) === value);
    const done = pair ? cleared.includes(pair.en) : false;
    const active = side === "en" ? leftPick === value : rightPick === value;
    const bad = missed?.includes(value);
    return `match__cell ${done ? "is-done" : ""} ${active ? "is-on" : ""} ${bad ? "is-shaking is-no" : ""}`;
  };

  return (
    <div className="match">
      <ul className="match__col">
        {exercise.pairs.map((pair) => (
          <li key={pair.en}>
            <button
              type="button"
              className={`${cellClass(pair.en, "en")} t-en`}
              disabled={locked || cleared.includes(pair.en)}
              onClick={() => setLeftPick(pair.en)}
            >
              {pair.en}
            </button>
          </li>
        ))}
      </ul>
      <ul className="match__col">
        {shuffledRight.map((ko) => (
          <li key={ko}>
            <button
              type="button"
              className={cellClass(ko, "ko")}
              disabled={locked || cleared.includes(exercise.pairs.find((p) => p.ko === ko)?.en ?? "")}
              onClick={() => setRightPick(ko)}
            >
              {ko}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExerciseView(props: ExerciseProps) {
  switch (props.exercise.kind) {
    case "pick-image":
      return <PickImage {...props} />;
    case "pick-word":
      return <PickWord {...props} />;
    case "word-bank":
      return <WordBank {...props} />;
    case "type-in":
      return <TypeIn {...props} />;
    case "listen":
      return <Listen {...props} />;
    case "match":
      return <Match {...props} />;
    default:
      return null;
  }
}

/** 숫자 키로 고를 수 있는 보기 수 — 키보드만으로 진행 가능하게 한다. */
export function hotkeyChoices(exercise: Exercise): string[] {
  if (exercise.kind === "pick-image") return exercise.choices.map((c) => c.en);
  if (exercise.kind === "pick-word") return exercise.choices;
  return [];
}
