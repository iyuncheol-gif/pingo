import type { ReactNode } from "react";
import {
  IconFlame,
  IconGem,
  IconHeart,
  IconLeague,
  IconPath,
  IconQuest,
  IconShop,
  IconUser,
  Logo,
} from "../../art/brand";
import {
  MAX_HEARTS,
  formatCountdown,
  heartsReadyIn,
  useCourseProgress,
  useStore,
  type Screen,
} from "../../state/store";
import { Bar, Ring } from "../ui";
import { LEAGUES, leagueRank, leagueTier } from "../../data/league";

const NAV: { key: Screen["name"]; label: string; icon: (p: { size?: number }) => ReactNode }[] = [
  { key: "learn", label: "학습", icon: IconPath },
  { key: "quests", label: "퀘스트", icon: IconQuest },
  { key: "league", label: "리그", icon: IconLeague },
  { key: "shop", label: "상점", icon: IconShop },
  { key: "profile", label: "프로필", icon: IconUser },
];

export function Shell({
  screen,
  onNavigate,
  children,
}: {
  screen: Screen["name"];
  onNavigate: (name: Screen["name"]) => void;
  children: ReactNode;
}) {
  const { state } = useStore();
  const progress = useCourseProgress();
  const tier = leagueTier(state.leagueXp);
  const rank = leagueRank(state.leagueXp);

  return (
    <div className="shell">
      <aside className="rail">
        <div className="rail__brand">
          <Logo />
        </div>
        <nav className="rail__nav" aria-label="주요 메뉴">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                className={`rail__item ${screen === item.key ? "is-on" : ""}`}
                onClick={() => onNavigate(item.key)}
                aria-current={screen === item.key ? "page" : undefined}
              >
                <Icon size={24} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="rail__foot t-cap">
          코스 진도 {progress.percent}%
          <Bar value={progress.completedNodes} max={progress.totalNodes} thin />
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar__brand">
            <Logo compact />
          </div>
          <div className="topbar__stats">
            <StatChip icon={<IconFlame size={20} />} tone="var(--gold)" value={state.streak} label="연속 학습일" />
            <StatChip icon={<IconGem size={20} />} tone="var(--teal)" value={state.gems} label="크리스털" />
            <StatChip
              icon={<IconHeart size={20} />}
              tone="var(--no)"
              value={state.hearts}
              label={
                state.hearts < MAX_HEARTS
                  ? `하트 — ${formatCountdown(heartsReadyIn(state))} 후 회복`
                  : "하트"
              }
            />
          </div>
        </header>

        <div className="content">{children}</div>
      </div>

      <aside className="aside">
        <section className="card card--flat panel">
          <h3 className="panel__title">오늘의 목표</h3>
          <div className="goal">
            <Ring value={state.todayXp} max={state.goalXp} size={56} stroke={6}>
              {Math.min(state.todayXp, state.goalXp)}
            </Ring>
            <div>
              <p className="t-head">
                {state.todayXp >= state.goalXp ? "목표 달성!" : `${state.goalXp - state.todayXp} XP 남음`}
              </p>
              <p className="t-cap">하루 {state.goalXp} XP · 연속 {state.streak}일</p>
            </div>
          </div>
        </section>

        <section className="card card--flat panel">
          <h3 className="panel__title">{LEAGUES[tier].name} 리그</h3>
          <p className="t-cap" style={{ marginBottom: 10 }}>
            이번 주 {state.leagueXp} XP · 현재 {rank}위
          </p>
          <Bar value={state.leagueXp} max={LEAGUES[Math.min(tier + 1, LEAGUES.length - 1)].from || 1} tone="gold" thin />
          <p className="t-cap" style={{ marginTop: 10 }}>
            상위 10명은 다음 리그로 승급해요.
          </p>
        </section>

        <section className="card card--flat panel">
          <h3 className="panel__title">학습 요약</h3>
          <ul className="facts">
            <li>
              <span>누적 XP</span>
              <strong>{state.xp}</strong>
            </li>
            <li>
              <span>완료한 레슨</span>
              <strong>{state.totalLessons}</strong>
            </li>
            <li>
              <span>만점 레슨</span>
              <strong>{state.perfectLessons}</strong>
            </li>
          </ul>
        </section>
      </aside>

      <nav className="tabbar" aria-label="주요 메뉴">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              className={`tabbar__item ${screen === item.key ? "is-on" : ""}`}
              onClick={() => onNavigate(item.key)}
              aria-current={screen === item.key ? "page" : undefined}
            >
              <Icon size={23} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function StatChip({
  icon,
  tone,
  value,
  label,
}: {
  icon: ReactNode;
  tone: string;
  value: number;
  label: string;
}) {
  return (
    <span className="stat" title={label} aria-label={`${label} ${value}`}>
      <span style={{ color: tone, display: "grid" }}>{icon}</span>
      <span>{value}</span>
    </span>
  );
}
