import { useEffect, useRef, useState } from "react";
import { ALL_UNITS, SECTIONS, TIER_LABEL, nodeCount, type Unit } from "../../data/course";
import { useCourseProgress, useStore } from "../../state/store";
import { Button } from "../ui";
import { IconCheck, IconCrown, IconLock, IconQuest } from "../../art/brand";

interface Props {
  onStart: (unitId: string, lessonIndex: number, practice: boolean) => void;
}

/** 좌우로 감기는 경로 — 유닛 경계에서 끊기지 않도록 코스 전체 노드 번호로 계산한다. */
const WAVE = [0, 46, 70, 46, 0, -46, -70, -46];
const waveOffset = (globalIndex: number) => WAVE[globalIndex % WAVE.length];

/** 유닛이 시작되는 전역 노드 번호 — 경로의 물결이 유닛을 넘어 이어지게 한다. */
function startIndexOf(unitId: string): number {
  let total = 0;
  for (const ref of ALL_UNITS) {
    if (ref.unit.id === unitId) return total;
    total += nodeCount(ref.unit);
  }
  return total;
}

export function PathMap({ onStart }: Props) {
  const { unitStatus, current } = useCourseProgress();
  const { state } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  return (
    <div className="path">
      {SECTIONS.map((section) => {
        const units = unitStatus.filter((entry) => entry.section.id === section.id);
        const sectionDone = units.every((entry) => entry.done >= entry.total);
        const sectionOpen = units.some((entry) => entry.unlocked);
        return (
          <section key={section.id} className="path__section">
            <header className="section-head" style={{ ["--hue" as string]: section.hue }}>
              <div>
                <span className="section-head__tier">
                  {TIER_LABEL[section.tier]} · {section.cefr}
                </span>
                <h2 className="t-title">{section.title}</h2>
                <p className="t-cap">{section.blurb}</p>
              </div>
              {(sectionDone || !sectionOpen) && (
                <span className={`section-head__state ${sectionDone ? "is-done" : "is-locked"}`}>
                  {sectionDone ? <IconCheck size={20} /> : <IconLock size={18} />}
                </span>
              )}
            </header>

            {units.map((entry) => (
              <UnitBlock
                key={entry.unit.id}
                startIndex={startIndexOf(entry.unit.id)}
                unit={entry.unit}
                hue={entry.unit.hue}
                done={entry.done}
                unlocked={entry.unlocked}
                currentUnitId={current?.unitId ?? null}
                currentIndex={current?.lessonIndex ?? -1}
                openId={open}
                setOpen={setOpen}
                onStart={onStart}
                currentRef={currentRef}
                gems={state.gems}
              />
            ))}
          </section>
        );
      })}
      <div className="path__end">
        <IconCrown size={30} />
        <p className="t-head">코스의 끝이에요</p>
        <p className="t-cap">복습 노드를 다시 풀면 기억이 오래 갑니다.</p>
      </div>
    </div>
  );
}

interface UnitProps {
  startIndex: number;
  unit: Unit;
  hue: string;
  done: number;
  unlocked: boolean;
  currentUnitId: string | null;
  currentIndex: number;
  openId: string | null;
  setOpen: (id: string | null) => void;
  onStart: Props["onStart"];
  currentRef: React.RefObject<HTMLDivElement>;
  gems: number;
}

function UnitBlock({
  startIndex,
  unit,
  hue,
  done,
  unlocked,
  currentUnitId,
  currentIndex,
  openId,
  setOpen,
  onStart,
  currentRef,
}: UnitProps) {
  const total = nodeCount(unit);
  return (
    <div className="unit" style={{ ["--hue" as string]: hue }}>
      <div className={`unit__banner ${unlocked ? "" : "is-locked"}`}>
        <div className="unit__meta">
          <span className="unit__eyebrow">{unit.title}</span>
          <p className="unit__blurb">{unit.blurb}</p>
        </div>
        <span className="unit__count">
          {Math.min(done, total)}/{total}
        </span>
      </div>

      <ol className="nodes">
        {Array.from({ length: total }).map((_, index) => {
          const isReview = index === total - 1;
          const complete = index < done;
          const isCurrent = unlocked && unit.id === currentUnitId && index === currentIndex;
          const locked = !unlocked || index > done;
          const id = `${unit.id}-${index}`;
          const offset = waveOffset(startIndex + index);

          const popped = openId === id && !locked;

          return (
            <li
              key={id}
              className="nodes__row"
              /* transform 대신 left — transform은 쌓임 맥락을 만들어
                 팝오버가 아래쪽 노드에 가려지고 fixed 스크림까지 깨진다 */
              style={{ left: offset, zIndex: popped ? 80 : undefined }}
            >
              <div className="node-wrap" ref={isCurrent ? currentRef : undefined}>
                {isCurrent && openId === null && <span className="node__flag">시작</span>}
                <button
                  type="button"
                  className={`node ${complete ? "is-done" : ""} ${isCurrent ? "is-current" : ""} ${
                    locked ? "is-locked" : ""
                  } ${isReview ? "is-review" : ""}`}
                  disabled={locked}
                  aria-label={`${unit.title} ${isReview ? "복습" : `레슨 ${index + 1}`}`}
                  onClick={() => setOpen(openId === id ? null : id)}
                >
                  <span className="node__face">
                    {locked ? (
                      <IconLock size={26} />
                    ) : complete ? (
                      <IconCheck size={28} />
                    ) : isReview ? (
                      <IconCrown size={28} />
                    ) : (
                      <IconQuest size={27} />
                    )}
                  </span>
                </button>

                {popped && (
                  <>
                    <button
                      type="button"
                      className="node-scrim"
                      aria-label="닫기"
                      onClick={() => setOpen(null)}
                    />
                  <div className="node-pop" role="dialog" aria-label="레슨 시작">
                    <span className="node-pop__kicker">
                      {isReview ? "유닛 복습" : `레슨 ${index + 1} / ${total - 1}`}
                    </span>
                    <h3 className="t-head">{unit.title}</h3>
                    <p className="t-cap">
                      {isReview ? "이 유닛의 모든 단어와 문장을 섞어서 확인해요." : unit.blurb}
                    </p>
                    <Button
                      block
                      size="sm"
                      style={{ marginTop: 12 }}
                      onClick={() => {
                        setOpen(null);
                        onStart(unit.id, index, complete);
                      }}
                    >
                      {complete ? "복습하기" : "시작하기"}
                    </Button>
                    {complete && <p className="node-pop__note">하트를 소모하지 않아요</p>}
                  </div>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {done >= total && (
        <div className="unit__clear">
          <IconQuest size={18} />
          <span className="t-cap">유닛 완료 — 복습으로 기억을 굳혀 보세요</span>
        </div>
      )}
    </div>
  );
}
