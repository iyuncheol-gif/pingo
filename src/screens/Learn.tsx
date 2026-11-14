import { PathMap } from "../components/path/PathMap";
import { Button } from "../components/ui";
import { ALL_UNITS } from "../data/course";
import { useCourseProgress, useStore } from "../state/store";
import { IconChevron } from "../art/brand";

export function Learn({
  onStart,
}: {
  onStart: (unitId: string, lessonIndex: number, practice: boolean) => void;
}) {
  const { current } = useCourseProgress();
  const { state } = useStore();
  const ref = current ? ALL_UNITS.find((entry) => entry.unit.id === current.unitId) : undefined;

  return (
    <div className="learn">
      {ref && current && (
        <div className="resume card">
          <div className="grow">
            <span className="kicker">{ref.section.cefr} · {ref.section.title}</span>
            <h2 className="t-title" style={{ marginTop: 4 }}>
              {ref.unit.title}
            </h2>
            <p className="t-cap" style={{ marginTop: 4 }}>
              {current.isReview ? "유닛 복습이 남았어요" : `레슨 ${current.lessonIndex + 1}부터 이어서`}
              {state.hearts === 0 && " · 하트가 회복되면 시작할 수 있어요"}
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => onStart(current.unitId, current.lessonIndex, false)}
          >
            이어서 학습 <IconChevron size={18} />
          </Button>
        </div>
      )}
      <PathMap onStart={onStart} />
    </div>
  );
}
