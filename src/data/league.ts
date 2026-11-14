/** 주간 XP 리그 — 더미 경쟁자는 시드 기반으로 생성해 매주 같은 주에는 같은 순위표가 나온다. */
import { hashString, mulberry32 } from "../engine/rng";

export const LEAGUES = [
  { name: "브론즈", from: 0, hue: "#b07b4a" },
  { name: "실버", from: 150, hue: "#9aa3b5" },
  { name: "골드", from: 400, hue: "#d99a2b" },
  { name: "사파이어", from: 800, hue: "#3d87d9" },
  { name: "다이아", from: 1400, hue: "#56c8d8" },
];

export const leagueTier = (xp: number) => {
  let tier = 0;
  LEAGUES.forEach((league, index) => {
    if (xp >= league.from) tier = index;
  });
  return tier;
};

const NAMES = [
  "지우", "하람", "민서", "도윤", "서연", "준호", "나윤", "태경", "소정", "현우",
  "유나", "재민", "가은", "성호", "다인", "예진", "건우", "수아", "윤재", "채린",
  "보라", "정우", "하늘", "시우", "리아", "강민", "세아", "주원", "미르", "한결",
];

export interface Rival {
  name: string;
  xp: number;
  you?: boolean;
}

export function leagueBoard(week: string, myXp: number, myName: string): Rival[] {
  const rand = mulberry32(hashString(week));
  const rivals: Rival[] = NAMES.map((name) => ({
    name,
    xp: Math.round(rand() * 520 + rand() * 180),
  }));
  rivals.push({ name: myName, xp: myXp, you: true });
  return rivals.sort((a, b) => b.xp - a.xp);
}

export function leagueRank(myXp: number, week = "", myName = "나"): number {
  const board = leagueBoard(week, myXp, myName);
  return board.findIndex((entry) => entry.you) + 1;
}
