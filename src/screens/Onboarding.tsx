import { useMemo, useState } from "react";
import { Mascot, IconCheck, IconChevron, IconX, Logo } from "../art/brand";
import { Button } from "../components/ui";
import { ExerciseView, type Response } from "../components/lesson/exercises";
import { SECTIONS } from "../data/course";
import { buildLesson, grade } from "../engine/generate";
import type { Exercise } from "../engine/types";
import { useActions } from "../state/store";

const REASONS = [
  { id: "career", label: "커리어와 이직" },
  { id: "travel", label: "여행에서 쓰려고" },
  { id: "study", label: "시험과 학업" },
  { id: "media", label: "영화·드라마 자막 없이" },
  { id: "brain", label: "꾸준한 두뇌 운동" },
  { id: "family", label: "가족·친구와 대화" },
];

const GOALS = [
  { xp: 10, label: "가볍게", detail: "하루 10 XP · 약 3분" },
  { xp: 20, label: "꾸준히", detail: "하루 20 XP · 약 6분" },
  { xp: 30, label: "진지하게", detail: "하루 30 XP · 약 10분" },
  { xp: 50, label: "몰입해서", detail: "하루 50 XP · 약 15분" },
];

const LEVELS = [
  { id: 0, label: "영어를 처음 배워요", bars: 1 },
  { id: 1, label: "단어 몇 개를 알아요", bars: 2 },
  { id: 2, label: "기본적인 대화를 할 수 있어요", bars: 3 },
  { id: 3, label: "다양한 주제로 이야기할 수 있어요", bars: 4 },
  { id: 4, label: "대부분의 주제를 깊이 다룰 수 있어요", bars: 5 },
];

/** 실력 선택만으로 추천되는 시작 유닛 수 */
const LEVEL_SKIP = [0, 1, 3, 6, 8];

type Step = "hello" | "reason" | "goal" | "level" | "entry" | "name" | "placement";

export function Onboarding() {
  const actions = useActions();
  const [step, setStep] = useState<Step>("hello");
  const [reason, setReason] = useState("");
  const [goal, setGoal] = useState(20);
  const [level, setLevel] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [skip, setSkip] = useState(0);

  const order: Step[] = ["hello", "reason", "goal", "level", "entry", "name"];
  const progress = ((order.indexOf(step) + 1) / order.length) * 100;

  const back = () => {
    const index = order.indexOf(step);
    if (index > 0) setStep(order[index - 1]);
  };

  if (step === "placement") {
    return (
      <Placement
        onDone={(unlocked) => {
          setSkip(unlocked);
          setStep("name");
        }}
        onCancel={() => setStep("entry")}
      />
    );
  }

  return (
    <div className="onb">
      <header className="onb__top">
        {step !== "hello" ? (
          <button type="button" className="onb__back" onClick={back} aria-label="이전 단계">
            <IconChevron size={22} />
          </button>
        ) : (
          <Logo compact />
        )}
        <div className="bar bar--thin">
          <div className="bar__fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="onb__body">
        {step === "hello" && (
          <div className="onb__hero">
            <Mascot size={150} mood="happy" />
            <h1 className="t-display">문장으로 쌓는 영어, Pingo</h1>
            <p className="t-body" style={{ color: "var(--ink-2)", maxWidth: 420 }}>
              하루 10분이면 충분해요. 몇 가지만 알려주시면 난이도를 맞춰 드릴게요.
            </p>
          </div>
        )}

        {step === "reason" && (
          <Question title="영어를 배우는 이유가 무엇인가요?">
            <ul className="choice-list choice-list--grid">
              {REASONS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`opt ${reason === item.id ? "is-on" : ""}`}
                    onClick={() => setReason(item.id)}
                  >
                    <span className="opt__text">{item.label}</span>
                    {reason === item.id && <IconCheck size={20} />}
                  </button>
                </li>
              ))}
            </ul>
          </Question>
        )}

        {step === "goal" && (
          <Question title="하루에 얼마나 학습할까요?">
            <ul className="choice-list">
              {GOALS.map((item) => (
                <li key={item.xp}>
                  <button
                    type="button"
                    className={`opt ${goal === item.xp ? "is-on" : ""}`}
                    onClick={() => setGoal(item.xp)}
                  >
                    <span className="opt__stack">
                      <strong>{item.label}</strong>
                      <span className="t-cap">{item.detail}</span>
                    </span>
                    {goal === item.xp && <IconCheck size={20} />}
                  </button>
                </li>
              ))}
            </ul>
          </Question>
        )}

        {step === "level" && (
          <Question title="지금 영어 실력은 어느 정도인가요?">
            <ul className="choice-list">
              {LEVELS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`opt ${level === item.id ? "is-on" : ""}`}
                    onClick={() => setLevel(item.id)}
                  >
                    <Bars count={item.bars} />
                    <span className="opt__text">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Question>
        )}

        {step === "entry" && (
          <Question title="어디서부터 시작할까요?">
            <ul className="choice-list">
              <li>
                <button
                  type="button"
                  className="opt"
                  onClick={() => {
                    setSkip(0);
                    setStep("name");
                  }}
                >
                  <span className="opt__stack">
                    <strong>기초부터 시작하기</strong>
                    <span className="t-cap">{SECTIONS[0].title} 유닛 1부터 차근차근</span>
                  </span>
                </button>
              </li>
              <li>
                <button type="button" className="opt" onClick={() => setStep("placement")}>
                  <span className="opt__stack">
                    <strong>배치 테스트 보기</strong>
                    <span className="t-cap">8문제로 시작 지점을 찾아 드려요 · 약 2분</span>
                  </span>
                </button>
              </li>
              {level !== null && level > 0 && (
                <li>
                  <button
                    type="button"
                    className="opt"
                    onClick={() => {
                      setSkip(LEVEL_SKIP[level]);
                      setStep("name");
                    }}
                  >
                    <span className="opt__stack">
                      <strong>선택한 실력에 맞춰 건너뛰기</strong>
                      <span className="t-cap">유닛 {LEVEL_SKIP[level]}개를 건너뛰고 시작</span>
                    </span>
                  </button>
                </li>
              )}
            </ul>
          </Question>
        )}

        {step === "name" && (
          <Question title="뭐라고 부를까요?">
            <input
              className="field"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="닉네임 (선택)"
              maxLength={12}
              aria-label="닉네임"
            />
            <div className="summary card card--flat">
              <h4 className="t-head">설정 요약</h4>
              <ul className="facts">
                <li>
                  <span>하루 목표</span>
                  <strong>{goal} XP</strong>
                </li>
                <li>
                  <span>시작 지점</span>
                  <strong>{skip === 0 ? "기초 유닛 1" : `유닛 ${skip + 1}`}</strong>
                </li>
                <li>
                  <span>학습 목적</span>
                  <strong>{REASONS.find((r) => r.id === reason)?.label ?? "미선택"}</strong>
                </li>
              </ul>
            </div>
          </Question>
        )}
      </main>

      <footer className="onb__foot">
        <Button
          size="lg"
          disabled={(step === "reason" && !reason) || (step === "level" && level === null)}
          onClick={() => {
            if (step === "name") {
              actions.onboard(name.trim(), reason, goal, skip);
              return;
            }
            const index = order.indexOf(step);
            setStep(order[index + 1]);
          }}
        >
          {step === "name" ? "학습 시작하기" : "계속하기"}
        </Button>
      </footer>
    </div>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="onb__q">
      <div className="source source--onb">
        <Mascot size={78} />
        <div className="source__bubble">
          <p className="source__text">{title}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Bars({ count }: { count: number }) {
  return (
    <span className="bars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= count ? "is-on" : ""} style={{ height: 6 + n * 3 }} />
      ))}
    </span>
  );
}

/* ---------------- 배치 테스트 ---------------- */

const PLACEMENT_UNITS = ["u2", "u5", "u7", "u10"];

function Placement({
  onDone,
  onCancel,
}: {
  onDone: (unlockedUnits: number) => void;
  onCancel: () => void;
}) {
  const questions = useMemo<Exercise[]>(() => {
    return PLACEMENT_UNITS.flatMap((unitId, tierIndex) => {
      const section = SECTIONS.find((s) => s.units.some((unit) => unit.id === unitId));
      if (!section) return [];
      const built = buildLesson(
        { unitId, lessonIndex: 1, tier: section.tier, isReview: true, title: "" },
        tierIndex + 11,
      );
      return built.filter((item) => item.kind !== "match").slice(0, 2);
    });
  }, []);

  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<Response>(null);
  const [score, setScore] = useState(0);

  const exercise = questions[index];
  if (!exercise) {
    const unlocked = score <= 2 ? 0 : score <= 4 ? 3 : score <= 6 ? 6 : 8;
    return (
      <div className="onb">
        <main className="onb__body">
          <div className="onb__hero">
            <Mascot size={140} mood="happy" />
            <h1 className="t-display">
              {score}/{questions.length} 맞혔어요
            </h1>
            <p className="t-body" style={{ color: "var(--ink-2)" }}>
              {unlocked === 0
                ? "기초 유닛 1부터 시작하는 게 좋겠어요."
                : `유닛 ${unlocked}개를 건너뛰고 시작할 수 있어요.`}
            </p>
          </div>
        </main>
        <footer className="onb__foot">
          <Button size="lg" onClick={() => onDone(unlocked)}>
            이 지점에서 시작하기
          </Button>
        </footer>
      </div>
    );
  }

  const ready =
    exercise.kind === "type-in"
      ? typeof response === "string" && response.trim().length > 0
      : Array.isArray(response)
        ? response.length > 0
        : typeof response === "string" && response.length > 0;

  return (
    <div className="onb">
      <header className="onb__top">
        <button type="button" className="onb__back" onClick={onCancel} aria-label="배치 테스트 그만두기">
          <IconX size={22} />
        </button>
        <div className="bar bar--thin">
          <div className="bar__fill" style={{ width: `${(index / questions.length) * 100}%` }} />
        </div>
      </header>
      <main className="onb__body">
        <div className="onb__q">
          <span className="kicker">배치 테스트 {index + 1} / {questions.length}</span>
          <h1 className="t-title" style={{ margin: "6px 0 18px" }}>
            {exercise.kind === "pick-word" || exercise.kind === "pick-image"
              ? exercise.prompt
              : exercise.kind === "type-in"
                ? "이 문장을 영어로 입력하세요"
                : exercise.kind === "listen"
                  ? "들은 문장을 그대로 적어 보세요"
                  : "이 문장을 옮겨 보세요"}
          </h1>
          {(exercise.kind === "word-bank" || exercise.kind === "type-in") && (
            <p className="source__text" style={{ marginBottom: 16 }}>
              {exercise.prompt}
            </p>
          )}
          <ExerciseView
            exercise={exercise}
            response={response}
            onChange={setResponse}
            locked={false}
            verdict="none"
          />
        </div>
      </main>
      <footer className="onb__foot">
        <Button
          size="lg"
          disabled={!ready}
          onClick={() => {
            if (grade(exercise, response)) setScore((n) => n + 1);
            setResponse(null);
            setIndex((n) => n + 1);
          }}
        >
          확인
        </Button>
      </footer>
    </div>
  );
}
