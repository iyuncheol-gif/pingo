import { IconChevron, IconLeague } from "../art/brand";
import { LEAGUES, leagueBoard, leagueTier } from "../data/league";
import { useStore } from "../state/store";

export function League() {
  const { state } = useStore();
  const tier = leagueTier(state.leagueXp);
  const league = LEAGUES[tier];
  const board = leagueBoard(state.leagueWeek, state.leagueXp, state.name);

  return (
    <div className="page">
      <header className="page__head">
        <div className="league-crest" style={{ ["--hue" as string]: league.hue }}>
          <IconLeague size={32} />
        </div>
        <h1 className="t-display">{league.name} 리그</h1>
        <p className="t-cap">
          주간 XP로 경쟁해요 · 상위 10명 승급, 하위 5명 강등
        </p>
      </header>

      <ol className="board card">
        {board.map((entry, index) => {
          const zone = index < 10 ? "up" : index >= board.length - 5 ? "down" : "";
          return (
            <li key={`${entry.name}-${index}`} className={`board__row ${entry.you ? "is-you" : ""} ${zone}`}>
              <span className="board__rank">{index + 1}</span>
              <span className="ava" style={{ width: 34, height: 34, fontSize: 13 }}>
                {entry.name.slice(0, 1)}
              </span>
              <span className="board__name">
                {entry.name}
                {entry.you && <em>나</em>}
              </span>
              <span className="board__xp">{entry.xp} XP</span>
              {zone === "up" && <IconChevron size={16} className="board__arrow up" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
