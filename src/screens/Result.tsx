import { IconCheck, IconCrown, IconGem, Mascot } from "../art/brand";
import { Button, Ring } from "../components/ui";
import type { LessonResult } from "../components/lesson/LessonPlayer";
import { useStore } from "../state/store";

export function Result({
  result,
  onContinue,
}: {
  result: LessonResult;
  onContinue: () => void;
}) {
  const { state } = useStore();
  const minutes = Math.floor(result.seconds / 60);
  const seconds = result.seconds % 60;

  return (
    <div className="result">
      <div className="result__hero">
        <Mascot size={150} mood={result.perfect ? "happy" : "idle"} />
        <h1 className="t-display">{result.perfect ? "완벽했어요!" : "레슨 완료!"}</h1>
        <p className="t-body" style={{ color: "var(--ink-2)" }}>
          {result.perfect
            ? "한 문제도 틀리지 않았어요. 보너스 XP를 받았습니다."
            : "틀린 문제는 다시 나와요. 반복이 기억을 만듭니다."}
        </p>
      </div>

      <div className="result__tiles">
        <div className="result__tile" style={{ ["--hue" as string]: "var(--gold)" }}>
          <span className="result__cap">획득 XP</span>
          <strong>{result.xp}</strong>
        </div>
        <div className="result__tile" style={{ ["--hue" as string]: "var(--ok)" }}>
          <span className="result__cap">정확도</span>
          <strong>{result.accuracy}%</strong>
        </div>
        <div className="result__tile" style={{ ["--hue" as string]: "var(--teal)" }}>
          <span className="result__cap">소요 시간</span>
          <strong>
            {minutes}:{String(seconds).padStart(2, "0")}
          </strong>
        </div>
      </div>

      <div className="result__goal card card--flat">
        <Ring value={state.todayXp} max={state.goalXp} size={54} stroke={6}>
          {Math.min(state.todayXp, state.goalXp)}
        </Ring>
        <div className="grow">
          <strong className="t-head">
            {state.todayXp >= state.goalXp ? "오늘 목표 달성!" : `오늘 목표까지 ${state.goalXp - state.todayXp} XP`}
          </strong>
          <p className="t-cap">
            {state.todayXp >= state.goalXp
              ? `연속 ${state.streak}일째 이어가는 중`
              : "조금만 더 하면 스트릭이 이어져요"}
          </p>
        </div>
        <span className="chip">
          <IconGem size={16} /> +{result.perfect ? 8 : 4}
        </span>
      </div>

      {result.perfect && (
        <p className="result__bonus">
          <IconCrown size={18} /> 만점 보너스 +5 XP
        </p>
      )}

      <Button size="lg" block onClick={onContinue}>
        <IconCheck size={20} /> 계속하기
      </Button>
    </div>
  );
}
