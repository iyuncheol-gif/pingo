import { useCallback, useState } from "react";
import { Shell } from "./components/shell/Shell";
import { InAppNotice } from "./components/shell/InAppNotice";
import { LessonPlayer, type LessonResult } from "./components/lesson/LessonPlayer";
import { Learn } from "./screens/Learn";
import { Quests } from "./screens/Quests";
import { League } from "./screens/League";
import { Shop } from "./screens/Shop";
import { Profile } from "./screens/Profile";
import { Onboarding } from "./screens/Onboarding";
import { Result } from "./screens/Result";
import { Button, Modal } from "./components/ui";
import { Mascot, IconGem, Logo } from "./art/brand";
import {
  HEART_REFILL_COST,
  formatCountdown,
  heartsReadyIn,
  useActions,
  useStore,
  type Screen,
} from "./state/store";

interface Active {
  unitId: string;
  lessonIndex: number;
  practice: boolean;
}

export default function App() {
  const { state } = useStore();
  const actions = useActions();
  const [tab, setTab] = useState<Screen["name"]>("learn");
  const [active, setActive] = useState<Active | null>(null);
  const [result, setResult] = useState<LessonResult | null>(null);
  const [blocked, setBlocked] = useState(false);

  const start = useCallback(
    (unitId: string, lessonIndex: number, practice: boolean) => {
      if (!practice && state.hearts <= 0) {
        setBlocked(true);
        return;
      }
      setResult(null);
      setActive({ unitId, lessonIndex, practice });
    },
    [state.hearts],
  );

  if (!state.ready) {
    return (
      <div className="splash">
        <Logo />
      </div>
    );
  }

  if (!state.onboarded)
    return (
      <>
        <InAppNotice />
        <Onboarding />
      </>
    );

  if (result && active) {
    return (
      <Result
        result={result}
        onContinue={() => {
          setResult(null);
          setActive(null);
        }}
      />
    );
  }

  if (active) {
    return (
      <LessonPlayer
        unitId={active.unitId}
        lessonIndex={active.lessonIndex}
        practice={active.practice}
        onExit={() => setActive(null)}
        onDone={(lessonResult) => {
          actions.finishLesson({
            unitId: active.unitId,
            lessonIndex: active.lessonIndex,
            xp: lessonResult.xp,
            perfect: lessonResult.perfect,
            listens: lessonResult.listens,
            practice: active.practice,
          });
          setResult(lessonResult);
        }}
      />
    );
  }

  return (
    <>
      <InAppNotice />
      <Shell screen={tab} onNavigate={setTab}>
        {tab === "learn" && <Learn onStart={start} />}
        {tab === "quests" && <Quests />}
        {tab === "league" && <League />}
        {tab === "shop" && <Shop />}
        {tab === "profile" && <Profile />}
      </Shell>

      <Modal open={blocked} onClose={() => setBlocked(false)}>
        <Mascot size={180} mood="sad" />
        <h2 className="t-title" style={{ marginTop: 10 }}>하트가 없어요</h2>
        <p className="t-body" style={{ color: "var(--ink-2)", marginTop: 8 }}>
          {formatCountdown(heartsReadyIn(state))} 뒤에 하나 회복돼요. 완료한 레슨은 하트 없이 복습할 수 있어요.
        </p>
        <div className="stack" style={{ gap: 10, marginTop: 20 }}>
          <Button
            block
            tone="gold"
            disabled={state.gems < HEART_REFILL_COST}
            onClick={() => {
              actions.buyHearts();
              setBlocked(false);
            }}
          >
            <IconGem size={18} /> {HEART_REFILL_COST}으로 채우기
          </Button>
          <Button block tone="ghost" onClick={() => setBlocked(false)}>
            닫기
          </Button>
        </div>
      </Modal>
    </>
  );
}
