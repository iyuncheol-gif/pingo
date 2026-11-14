import { IconFlame, IconGem, IconHeart } from "../art/brand";
import { Button } from "../components/ui";
import {
  FREEZE_COST,
  HEART_REFILL_COST,
  MAX_HEARTS,
  formatCountdown,
  heartsReadyIn,
  useActions,
  useStore,
} from "../state/store";

export function Shop() {
  const { state } = useStore();
  const actions = useActions();

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="t-display">상점</h1>
        <p className="t-cap">
          레슨을 완료하면 크리스털이 쌓여요 · 보유 {state.gems}개
        </p>
      </header>

      <section className="card panel">
        <h3 className="panel__title">하트</h3>
        <div className="shop-item">
          <span className="shop-item__art" style={{ color: "var(--no)" }}>
            <IconHeart size={40} />
          </span>
          <div className="grow">
            <strong className="t-head">하트 모두 채우기</strong>
            <p className="t-cap">
              현재 {state.hearts}/{MAX_HEARTS}
              {state.hearts < MAX_HEARTS && ` · 다음 회복까지 ${formatCountdown(heartsReadyIn(state))}`}
            </p>
          </div>
          <Button
            size="sm"
            tone={state.hearts >= MAX_HEARTS ? "ghost" : "brand"}
            disabled={state.hearts >= MAX_HEARTS || state.gems < HEART_REFILL_COST}
            onClick={actions.buyHearts}
          >
            {state.hearts >= MAX_HEARTS ? (
              "가득 참"
            ) : (
              <>
                <IconGem size={15} /> {HEART_REFILL_COST}
              </>
            )}
          </Button>
        </div>
      </section>

      <section className="card panel">
        <h3 className="panel__title">스트릭</h3>
        <div className="shop-item">
          <span className="shop-item__art" style={{ color: "var(--gold)" }}>
            <IconFlame size={40} />
          </span>
          <div className="grow">
            <strong className="t-head">스트릭 프리즈</strong>
            <p className="t-cap">하루를 건너뛰어도 연속 기록을 지켜 줘요 · 보유 {state.freezes}/2</p>
          </div>
          <Button
            size="sm"
            disabled={state.freezes >= 2 || state.gems < FREEZE_COST}
            onClick={actions.buyFreeze}
          >
            {state.freezes >= 2 ? (
              "최대"
            ) : (
              <>
                <IconGem size={15} /> {FREEZE_COST}
              </>
            )}
          </Button>
        </div>
      </section>

      <section className="card panel">
        <h3 className="panel__title">크리스털 모으는 법</h3>
        <ul className="facts">
          <li>
            <span>레슨 완료</span>
            <strong>
              <IconGem size={14} /> 4
            </strong>
          </li>
          <li>
            <span>만점 레슨</span>
            <strong>
              <IconGem size={14} /> 8
            </strong>
          </li>
          <li>
            <span>퀘스트 달성</span>
            <strong>
              <IconGem size={14} /> 10~20
            </strong>
          </li>
        </ul>
      </section>
    </div>
  );
}
