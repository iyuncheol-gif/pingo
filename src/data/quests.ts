/** 일일 퀘스트 정의 — 화면과 리듀서가 같은 정의를 공유해야 보상이 어긋나지 않는다. */
import type { QuestProgress } from "../state/store";

export interface QuestDef {
  id: keyof QuestProgress | "xp" | "lessons" | "perfect" | "listen";
  label: (goalXp: number) => string;
  target: (goalXp: number) => number;
  reward: number;
  read: (progress: QuestProgress) => number;
}

export const QUESTS: QuestDef[] = [
  {
    id: "xp",
    label: (goal) => `${goal} XP 획득하기`,
    target: (goal) => goal,
    reward: 10,
    read: (p) => p.xp,
  },
  {
    id: "lessons",
    label: () => "레슨 3개 완료하기",
    target: () => 3,
    reward: 15,
    read: (p) => p.lessons,
  },
  {
    id: "perfect",
    label: () => "만점 레슨 1개",
    target: () => 1,
    reward: 20,
    read: (p) => p.perfect,
  },
  {
    id: "listen",
    label: () => "듣기 문제 5개 맞히기",
    target: () => 5,
    reward: 15,
    read: (p) => p.listen,
  },
];

/** 이번 레슨으로 새로 완료된 퀘스트의 보상 합계 */
export function questReward(before: QuestProgress, after: QuestProgress, goalXp: number): number {
  return QUESTS.reduce((sum, quest) => {
    const target = quest.target(goalXp);
    const was = quest.read(before) >= target;
    const now = quest.read(after) >= target;
    return sum + (!was && now ? quest.reward : 0);
  }, 0);
}
