/* ============================================================
   앱 상태 — 진도 · 재화 · 스트릭 · 퀘스트 · 리그
   서버 없이 localStorage에 저장한다. 하트는 실시간 회복.
   ============================================================ */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { ALL_UNITS, nodeCount } from "../data/course";
import { questReward } from "../data/quests";
import { setPreferredVoice } from "../lib/speech";

export const MAX_HEARTS = 5;
export const HEART_REGEN_MS = 30 * 60 * 1000;
export const HEART_REFILL_COST = 350;
export const FREEZE_COST = 200;

export type Screen =
  | { name: "learn" }
  | { name: "quests" }
  | { name: "league" }
  | { name: "shop" }
  | { name: "profile" }
  | { name: "lesson"; unitId: string; lessonIndex: number; practice?: boolean }
  | { name: "placement" };

export interface Settings {
  theme: "light" | "dark" | "system";
  sound: boolean;
  autoSpeak: boolean;
  /** 듣기 문제 출제 여부 — 기기에 영어 음성이 없으면 끌 수 있다 */
  listening: boolean;
  /** 사용자가 직접 고른 음성 (voiceURI). 비우면 품질 순으로 자동 선택 */
  voiceURI: string | null;
}

export interface QuestProgress {
  xp: number;
  lessons: number;
  perfect: number;
  listen: number;
}

export interface State {
  ready: boolean;
  onboarded: boolean;
  name: string;
  reason: string;
  goalXp: number;
  /** unitId → 완료한 노드 수 */
  done: Record<string, number>;
  /** 배치 테스트로 건너뛴 유닛 수(코스 전체 순서 기준) */
  unlockedThrough: number;
  xp: number;
  gems: number;
  hearts: number;
  /** 마지막으로 하트가 깎인 시각 — 회복 계산 기준 */
  heartStamp: number;
  freezes: number;
  streak: number;
  lastStudyDay: string;
  todayDate: string;
  todayXp: number;
  totalLessons: number;
  perfectLessons: number;
  questDate: string;
  quests: QuestProgress;
  leagueWeek: string;
  leagueXp: number;
  settings: Settings;
}

const todayKey = () => new Date().toISOString().slice(0, 10);
const weekKey = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - first.getTime()) / 86400000 + first.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
};

const EMPTY_QUESTS: QuestProgress = { xp: 0, lessons: 0, perfect: 0, listen: 0 };

const initial: State = {
  ready: false,
  onboarded: false,
  name: "학습자",
  reason: "",
  goalXp: 20,
  done: {},
  unlockedThrough: 0,
  xp: 0,
  gems: 120,
  hearts: MAX_HEARTS,
  heartStamp: Date.now(),
  freezes: 0,
  streak: 0,
  lastStudyDay: "",
  todayDate: todayKey(),
  todayXp: 0,
  totalLessons: 0,
  perfectLessons: 0,
  questDate: todayKey(),
  quests: { ...EMPTY_QUESTS },
  leagueWeek: weekKey(),
  leagueXp: 0,
  settings: { theme: "system", sound: true, autoSpeak: true, listening: true, voiceURI: null },
};

type Action =
  | { type: "hydrate"; state: Partial<State> }
  | { type: "onboard"; name: string; reason: string; goalXp: number; unlockedThrough: number }
  | { type: "loseHeart" }
  | { type: "finishLesson"; unitId: string; lessonIndex: number; xp: number; perfect: boolean; listens: number; practice: boolean }
  | { type: "buyHearts" }
  | { type: "buyFreeze" }
  | { type: "settings"; patch: Partial<Settings> }
  | { type: "reset" };

/** 경과 시간만큼 하트를 회복시킨 상태를 돌려준다. */
export function withRegen(state: State, now = Date.now()): State {
  if (state.hearts >= MAX_HEARTS) return state;
  const gained = Math.floor((now - state.heartStamp) / HEART_REGEN_MS);
  if (gained <= 0) return state;
  const hearts = Math.min(MAX_HEARTS, state.hearts + gained);
  return {
    ...state,
    hearts,
    heartStamp: hearts >= MAX_HEARTS ? now : state.heartStamp + gained * HEART_REGEN_MS,
  };
}

function rollDay(state: State): State {
  const today = todayKey();
  let next = state;
  if (state.todayDate !== today) {
    next = { ...next, todayDate: today, todayXp: 0 };
  }
  if (state.questDate !== today) {
    next = { ...next, questDate: today, quests: { ...EMPTY_QUESTS } };
  }
  if (state.leagueWeek !== weekKey()) {
    next = { ...next, leagueWeek: weekKey(), leagueXp: 0 };
  }
  return next;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return rollDay(withRegen({ ...state, ...action.state, ready: true }));

    case "onboard": {
      /* 건너뛴 유닛은 '통과'로 표시한다.
         열어두기만 하면 현재 노드 계산이 늘 유닛 1을 가리켜
         높은 난이도를 골라도 기초부터 시작하게 된다. */
      const done: Record<string, number> = { ...state.done };
      ALL_UNITS.slice(0, action.unlockedThrough).forEach((ref) => {
        done[ref.unit.id] = nodeCount(ref.unit);
      });
      return {
        ...state,
        onboarded: true,
        name: action.name || state.name,
        reason: action.reason,
        goalXp: action.goalXp,
        unlockedThrough: action.unlockedThrough,
        done,
      };
    }

    case "loseHeart": {
      const base = withRegen(state);
      if (base.hearts <= 0) return base;
      return {
        ...base,
        hearts: base.hearts - 1,
        heartStamp: base.hearts === MAX_HEARTS ? Date.now() : base.heartStamp,
      };
    }

    case "finishLesson": {
      const base = rollDay(withRegen(state));
      const key = action.unitId;
      const prior = base.done[key] ?? 0;
      const advanced = action.practice
        ? prior
        : Math.max(prior, Math.min(action.lessonIndex + 1, nodeCountOf(key)));
      const today = todayKey();
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const todayXp = base.todayXp + action.xp;
      const metGoalNow = todayXp >= base.goalXp && base.todayXp < base.goalXp;
      let streak = base.streak;
      if (metGoalNow) {
        streak = base.lastStudyDay === yesterday || base.lastStudyDay === "" ? streak + 1 : 1;
      }
      const quests: QuestProgress = {
        xp: base.quests.xp + action.xp,
        lessons: base.quests.lessons + 1,
        perfect: base.quests.perfect + (action.perfect ? 1 : 0),
        listen: base.quests.listen + action.listens,
      };
      const bonus = questReward(base.quests, quests, base.goalXp);
      return {
        ...base,
        done: { ...base.done, [key]: advanced },
        xp: base.xp + action.xp,
        todayXp,
        leagueXp: base.leagueXp + action.xp,
        gems: base.gems + (action.perfect ? 8 : 4) + bonus,
        streak,
        lastStudyDay: metGoalNow ? today : base.lastStudyDay,
        totalLessons: base.totalLessons + 1,
        perfectLessons: base.perfectLessons + (action.perfect ? 1 : 0),
        quests,
      };
    }

    case "buyHearts": {
      const base = withRegen(state);
      if (base.gems < HEART_REFILL_COST || base.hearts >= MAX_HEARTS) return base;
      return { ...base, gems: base.gems - HEART_REFILL_COST, hearts: MAX_HEARTS };
    }

    case "buyFreeze": {
      const base = withRegen(state);
      if (base.gems < FREEZE_COST || base.freezes >= 2) return base;
      return { ...base, gems: base.gems - FREEZE_COST, freezes: base.freezes + 1 };
    }

    case "settings":
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case "reset":
      return { ...initial, ready: true };

    default:
      return state;
  }
}

const nodeCountOf = (unitId: string) => {
  const ref = ALL_UNITS.find((entry) => entry.unit.id === unitId);
  return ref ? nodeCount(ref.unit) : 0;
};

const STORAGE_KEY = "pingo.v1";

interface Ctx {
  state: State;
  dispatch: (action: Action) => void;
}

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "hydrate", state: raw ? (JSON.parse(raw) as Partial<State>) : {} });
    } catch {
      dispatch({ type: "hydrate", state: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    try {
      const { ready: _ready, ...persisted } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      /* 저장 실패는 조용히 무시 — 학습 흐름을 막지 않는다 */
    }
  }, [state]);

  // 하트 회복 타이머
  useEffect(() => {
    if (!state.ready || state.hearts >= MAX_HEARTS) return;
    const timer = window.setInterval(() => dispatch({ type: "hydrate", state: {} }), 20000);
    return () => window.clearInterval(timer);
  }, [state.ready, state.hearts]);

  // 선택한 음성을 재생 모듈에 반영
  useEffect(() => {
    setPreferredVoice(state.settings.voiceURI);
  }, [state.settings.voiceURI]);

  // 테마 적용
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const pref = state.settings.theme;
      const dark =
        pref === "dark" ||
        (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.dataset.theme = dark ? "dark" : "light";
    };
    apply();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [state.settings.theme]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("StoreProvider 밖에서 useStore를 호출했습니다");
  return ctx;
}

export function useActions() {
  const { dispatch } = useStore();
  return useMemo(
    () => ({
      onboard: (name: string, reason: string, goalXp: number, unlockedThrough: number) =>
        dispatch({ type: "onboard", name, reason, goalXp, unlockedThrough }),
      loseHeart: () => dispatch({ type: "loseHeart" }),
      finishLesson: (payload: {
        unitId: string;
        lessonIndex: number;
        xp: number;
        perfect: boolean;
        listens: number;
        practice: boolean;
      }) => dispatch({ type: "finishLesson", ...payload }),
      buyHearts: () => dispatch({ type: "buyHearts" }),
      buyFreeze: () => dispatch({ type: "buyFreeze" }),
      setSettings: (patch: Partial<Settings>) => dispatch({ type: "settings", patch }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [dispatch],
  );
}

/* ---------------- 파생 셀렉터 ---------------- */

export interface NodeRef {
  unitId: string;
  lessonIndex: number;
  isReview: boolean;
}

export function useCourseProgress() {
  const { state } = useStore();
  return useMemo(() => {
    let firstOpen: NodeRef | null = null;
    let completedNodes = 0;
    let totalNodes = 0;

    const unitStatus = ALL_UNITS.map((ref) => {
      const total = nodeCount(ref.unit);
      const done = state.done[ref.unit.id] ?? 0;
      totalNodes += total;
      completedNodes += Math.min(done, total);

      const previousComplete = ALL_UNITS.slice(0, ref.order).every(
        (prev) => (state.done[prev.unit.id] ?? 0) >= nodeCount(prev.unit),
      );
      const unlocked = previousComplete || ref.order < state.unlockedThrough;
      if (unlocked && done < total && !firstOpen) {
        firstOpen = { unitId: ref.unit.id, lessonIndex: done, isReview: done === total - 1 };
      }
      return { ...ref, total, done, unlocked };
    });

    return {
      unitStatus,
      current: firstOpen as NodeRef | null,
      completedNodes,
      totalNodes,
      percent: totalNodes ? Math.round((completedNodes / totalNodes) * 100) : 0,
    };
  }, [state.done, state.unlockedThrough]);
}

export function heartsReadyIn(state: State): number {
  if (state.hearts >= MAX_HEARTS) return 0;
  return Math.max(0, state.heartStamp + HEART_REGEN_MS - Date.now());
}

export const formatCountdown = (ms: number) => {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};
