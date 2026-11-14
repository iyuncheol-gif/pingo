import { IconCheck, IconFlame, IconGem, IconQuest, IconSpeaker, IconCrown } from "../art/brand";
import { Bar } from "../components/ui";
import { QUESTS } from "../data/quests";
import { useStore } from "../state/store";

const ICONS: Record<string, React.ReactNode> = {
  xp: <IconQuest size={22} />,
  lessons: <IconFlame size={22} />,
  perfect: <IconCrown size={22} />,
  listen: <IconSpeaker size={22} />,
};

export function Quests() {
  const { state } = useStore();
  const q = state.quests;

  const daily = QUESTS.map((quest) => ({
    icon: ICONS[quest.id],
    label: quest.label(state.goalXp),
    value: quest.read(q),
    max: quest.target(state.goalXp),
    reward: quest.reward,
  }));

  const cleared = daily.filter((item) => item.value >= item.max).length;

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="t-display">퀘스트</h1>
        <p className="t-cap">자정에 초기화돼요 · 오늘 {cleared}/{daily.length} 완료</p>
      </header>

      <section className="card panel">
        <div className="spread" style={{ marginBottom: 14 }}>
          <h3 className="panel__title" style={{ margin: 0 }}>오늘의 퀘스트</h3>
          <span className="chip" title="아직 받지 않은 크리스털">
            <IconGem size={16} /> 남은 보상 {daily.reduce((sum, item) => sum + (item.value >= item.max ? 0 : item.reward), 0)}
          </span>
        </div>
        <ul className="quests">
          {daily.map((item) => {
            const done = item.value >= item.max;
            return (
              <li key={item.label} className={`quest ${done ? "is-done" : ""}`}>
                <span className="quest__icon">{done ? <IconCheck size={22} /> : item.icon}</span>
                <div className="quest__body">
                  <div className="spread">
                    <strong className="t-head">{item.label}</strong>
                    <span className="t-cap">
                      {Math.min(item.value, item.max)}/{item.max}
                    </span>
                  </div>
                  <Bar value={Math.min(item.value, item.max)} max={item.max} tone={done ? "ok" : "gold"} thin />
                </div>
                <span className="quest__reward">
                  <IconGem size={16} /> {item.reward}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card panel">
        <h3 className="panel__title">꾸준함 지표</h3>
        <ul className="facts">
          <li>
            <span>연속 학습</span>
            <strong>{state.streak}일</strong>
          </li>
          <li>
            <span>스트릭 프리즈</span>
            <strong>{state.freezes}개 보유</strong>
          </li>
          <li>
            <span>오늘 획득 XP</span>
            <strong>{state.todayXp} XP</strong>
          </li>
        </ul>
      </section>
    </div>
  );
}
