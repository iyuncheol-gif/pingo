/* ============================================================
   레슨 생성기
   난이도(tier)가 문제 구성을 바꾼다 — 듀오링고의 섹션별 난이도 상승을 재현.
     tier 1 기초 : 보기 3개, 미끼 2개, 타이핑 없음, 짧은 문장
     tier 2 초급 : 보기 4개, 미끼 3개, 타이핑 소량
     tier 3 중급 : 보기 4개, 미끼 4개, 타이핑/듣기 비중 증가
     tier 4 상급 : 보기 5개, 미끼 5개, 타이핑 중심, 긴 문장
   유닛 복습 노드는 한 단계 더 어렵게 취급한다.
   ============================================================ */

import { ALL_UNITS, type Sentence, type Tier, type Word } from "../data/course";
import { hasArt } from "../art/pictograms";
import { josa } from "../lib/ko";
import { hashString, mulberry32, pick, sample, shuffle } from "./rng";
import type { Exercise, LessonSpec } from "./types";

interface TierRule {
  choices: number;
  distractors: number;
  /** 0~1, 문장 문제 중 직접 입력 비율 */
  typeRate: number;
  /** 0~1, 문장 문제 중 듣기 비율 */
  listenRate: number;
}

const TIER_RULES: Record<Tier, TierRule> = {
  1: { choices: 3, distractors: 2, typeRate: 0, listenRate: 0.2 },
  2: { choices: 4, distractors: 3, typeRate: 0.15, listenRate: 0.25 },
  3: { choices: 4, distractors: 4, typeRate: 0.35, listenRate: 0.3 },
  4: { choices: 5, distractors: 5, typeRate: 0.5, listenRate: 0.3 },
};

export const tierRule = (tier: Tier) => TIER_RULES[tier];

const NORMAL_LENGTH = 11;
const REVIEW_LENGTH = 15;

const tokenize = (sentence: Sentence) =>
  sentence.tokens ?? sentence.en.replace(/[.,?!]/g, "").split(/\s+/).filter(Boolean);

const koTokenize = (sentence: Sentence) =>
  sentence.koTokens ?? sentence.ko.replace(/[.,?!]/g, "").split(/\s+/).filter(Boolean);

/** 유닛의 재료를 레슨 수만큼 겹치지 않게 균등 분할한다.
    (이전 구현은 마지막 레슨들이 같은 구간을 다시 받아 문장이 그대로 반복됐다) */
function partition<T>(items: T[], lessonIndex: number, lessonCount: number): { own: T[]; earlier: T[] } {
  if (items.length === 0) return { own: [], earlier: [] };
  const per = Math.max(1, Math.floor(items.length / lessonCount));
  const extra = items.length % lessonCount;
  const start = lessonIndex * per + Math.min(lessonIndex, extra);
  const size = per + (lessonIndex < extra ? 1 : 0);
  return { own: items.slice(start, start + size), earlier: items.slice(0, start) };
}

/** 미끼 단어는 아직 안 배운 상위 난이도에서 끌어오지 않는다 — 초반 레슨이 억지스러워지지 않게. */
function distractorPool(exclude: Word[], tier: Tier): Word[] {
  const names = new Set(exclude.map((w) => w.en));
  const within = ALL_UNITS.filter((ref) => ref.section.tier <= tier).flatMap((ref) => ref.unit.words);
  const pool = within.filter((w) => !names.has(w.en));
  if (pool.length >= 8) return pool;
  return ALL_UNITS.flatMap((ref) => ref.unit.words).filter((w) => !names.has(w.en));
}

function buildBank(tokens: string[], distractorPool: string[], rule: TierRule, rand: () => number) {
  const used = new Set(tokens.map((t) => t.toLowerCase()));
  const extras = sample(
    distractorPool.filter((t) => !used.has(t.toLowerCase())),
    rule.distractors,
    rand,
  );
  return shuffle([...tokens, ...extras], rand);
}

export function buildLesson(spec: LessonSpec, attempt = 0): Exercise[] {
  const ref = ALL_UNITS.find((entry) => entry.unit.id === spec.unitId);
  if (!ref) return [];
  const { unit } = ref;

  const effectiveTier = (spec.isReview ? Math.min(4, spec.tier + 1) : spec.tier) as Tier;
  const base = TIER_RULES[effectiveTier];
  const listening = spec.allowListening !== false;
  const rule: TierRule = listening
    ? base
    : { ...base, listenRate: 0, typeRate: Math.min(0.6, base.typeRate + base.listenRate) };
  const rand = mulberry32(hashString(`${spec.unitId}:${spec.lessonIndex}:${attempt}`));

  /* 이번 레슨에서 "새로 배우는" 재료와, 같은 유닛에서 이미 지나온 복습 재료를 나눈다.
     복습 재료까지 풀에 넣어야 한 레슨 안에서 같은 문장이 반복되지 않는다. */
  const wordSplit = partition(unit.words, spec.lessonIndex, unit.lessonCount);
  const sentenceSplit = partition(unit.sentences, spec.lessonIndex, unit.lessonCount);

  const words = spec.isReview ? unit.words : wordSplit.own;
  const reviewWords = spec.isReview ? [] : wordSplit.earlier;
  const newSentences = spec.isReview ? unit.sentences : sentenceSplit.own;
  const reviewSentences = spec.isReview ? [] : sentenceSplit.earlier;
  const sentences = [...newSentences, ...reviewSentences];

  const outsideWords = distractorPool([...words, ...reviewWords], effectiveTier);
  const sentencePool = ALL_UNITS.filter((entry) => entry.section.tier <= effectiveTier).flatMap(
    (entry) => entry.unit.sentences,
  );
  const tokenPool = sentencePool.flatMap((s) => tokenize(s));
  const koTokenPool = sentencePool.flatMap((s) => koTokenize(s));

  const items: Exercise[] = [];
  let seq = 0;
  const nextId = () => `${spec.unitId}-${spec.lessonIndex}-${seq++}`;

  /* --- 1) 단어 익히기 --- */
  const artWords = words.filter((w) => hasArt(w.en));
  const artPool = outsideWords.filter((w) => hasArt(w.en));

  artWords.forEach((word, index) => {
    const decoys = sample(artPool, rule.choices - 1, rand);
    items.push({
      kind: "pick-image",
      id: nextId(),
      prompt: `다음 중 '${word.ko}'${josa(word.ko, "은는")} 어느 것인가요?`,
      answer: word,
      choices: shuffle([word, ...decoys], rand),
      isNew: index < 2 && !spec.isReview && spec.lessonIndex === 0,
    });
  });

  /** 뜻 고르기 — 방향(영→한 / 한→영)을 따로 출제해 인지 문제 수를 확보한다 */
  const pushPickWord = (word: Word, askKorean: boolean, isNew: boolean) => {
    const decoys = sample(outsideWords, rule.choices - 1, rand);
    items.push({
      kind: "pick-word",
      id: nextId(),
      prompt: askKorean
        ? `'${word.en}'의 뜻으로 알맞은 것은?`
        : `'${word.ko}'${josa(word.ko, "을를")} 영어로 어떻게 쓸까요?`,
      promptEn: askKorean ? word.en : undefined,
      answer: askKorean ? word.ko : word.en,
      choices: shuffle(
        [askKorean ? word.ko : word.en, ...decoys.map((d) => (askKorean ? d.ko : d.en))],
        rand,
      ),
      isNew,
    });
  };

  // 새로 배우는 단어는 양방향으로, 이미 지나온 단어는 한 방향으로
  words.forEach((word, index) => {
    const markNew = index < 2 && !spec.isReview && spec.lessonIndex === 0 && artWords.length === 0;
    pushPickWord(word, true, markNew);
    pushPickWord(word, false, false);
  });
  reviewWords.forEach((word) => pushPickWord(word, rand() > 0.5, false));

  /* --- 2) 문장 다루기 — 문장 하나당 문제 하나. 같은 문장이 여러 번 나오지 않게 한다 --- */
  sentences.forEach((sentence) => {
    const roll = rand();
    const enTokens = tokenize(sentence);
    const koTokens = koTokenize(sentence);

    if (roll < rule.listenRate) {
      items.push({
        kind: "listen",
        id: nextId(),
        tokens: enTokens,
        bank: buildBank(enTokens, tokenPool, rule, rand),
        sentence,
        isNew: false,
      });
      return;
    }
    if (roll < rule.listenRate + rule.typeRate) {
      items.push({
        kind: "type-in",
        id: nextId(),
        direction: "ko->en",
        prompt: sentence.ko,
        accept: [sentence.en],
        sentence,
        isNew: false,
      });
      return;
    }
    const toEnglish = rand() > 0.4;
    items.push({
      kind: "word-bank",
      id: nextId(),
      direction: toEnglish ? "ko->en" : "en->ko",
      prompt: toEnglish ? sentence.ko : sentence.en,
      tokens: toEnglish ? enTokens : koTokens,
      bank: buildBank(toEnglish ? enTokens : koTokens, toEnglish ? tokenPool : koTokenPool, rule, rand),
      sentence,
      isNew: false,
    });
  });

  /* --- 3) 짝 맞추기 (복습/중급 이상에서만) --- */
  if (words.length >= 4 && (spec.isReview || effectiveTier >= 2)) {
    items.push({
      kind: "match",
      id: nextId(),
      pairs: sample(words, Math.min(5, words.length), rand),
      isNew: false,
    });
  }

  /* --- 4) 길이·구성 맞추기 ---
     단순히 앞에서 잘라내면 단어 문제만 남고 문장/듣기 문제가 사라진다.
     인지(고르기) / 산출(쓰기·듣기) / 짝맞추기에 각각 몫을 배정한다. --- */
  const target = spec.isReview ? REVIEW_LENGTH : NORMAL_LENGTH;

  const recognition = items.filter(
    (item) => item.kind === "pick-image" || item.kind === "pick-word",
  );
  const production = items.filter(
    (item) => item.kind === "word-bank" || item.kind === "listen" || item.kind === "type-in",
  );
  const matching = items.filter((item) => item.kind === "match");

  const wantMatch = Math.min(matching.length, 1);
  const wantProduction = Math.min(
    production.length,
    Math.max(3, Math.round(target * (spec.isReview ? 0.5 : 0.45))),
  );
  const wantRecognition = Math.max(2, target - wantProduction - wantMatch);

  // 새 단어(뱃지)는 반드시 남기고, 그림 문제를 글자 문제보다 앞에 둔다
  const recogSorted = [...recognition].sort((x, y) => {
    const score = (item: Exercise) => (item.isNew ? 0 : item.kind === "pick-image" ? 1 : 2);
    return score(x) - score(y);
  });
  const chosenRecognition = recogSorted.slice(0, wantRecognition);

  // 이번 레슨에서 새로 배우는 문장을 먼저, 그다음 복습 문장을 담는다
  const freshKeys = new Set(newSentences.map((item) => item.en));
  const sentenceOf = (item: Exercise) =>
    "sentence" in item && item.sentence ? item.sentence.en : "";
  const fresh = shuffle(
    production.filter((item) => freshKeys.has(sentenceOf(item))),
    rand,
  );
  const revisit = shuffle(
    production.filter((item) => !freshKeys.has(sentenceOf(item))),
    rand,
  );
  const chosenProduction: Exercise[] = [...fresh, ...revisit].slice(0, wantProduction);

  /* 문장이 모자라 칸을 못 채우면 같은 문장을 또 내지 말고
     인지 문제를 더 넣는다 — 같은 문장 반복이 가장 큰 불만이었다 */
  let spare = wantRecognition;
  while (
    chosenRecognition.length + chosenProduction.length + wantMatch < target &&
    spare < recogSorted.length
  ) {
    chosenRecognition.push(recogSorted[spare]);
    spare += 1;
  }

  /* 듣기는 레슨마다 최소 1개 보장 — 확률만으로는 한 레슨 내내 안 나오는 경우가 잦다 */
  if (listening && !chosenProduction.some((item) => item.kind === "listen")) {
    const swapAt = chosenProduction.findIndex((item) => item.kind === "word-bank");
    const source = swapAt >= 0 ? chosenProduction[swapAt] : null;
    if (source && source.kind === "word-bank") {
      const enTokens = tokenize(source.sentence);
      chosenProduction[swapAt] = {
        kind: "listen",
        id: source.id,
        tokens: enTokens,
        bank: buildBank(enTokens, tokenPool, rule, rand),
        sentence: source.sentence,
        isNew: false,
      };
    } else if (sentences.length > 0 && chosenProduction.length > 0) {
      const sentence = pick(sentences, rand);
      const enTokens = tokenize(sentence);
      chosenProduction[0] = {
        kind: "listen",
        id: nextId(),
        tokens: enTokens,
        bank: buildBank(enTokens, tokenPool, rule, rand),
        sentence,
        isNew: false,
      };
    }
  }

  // 배치: 앞쪽은 인지 문제로 워밍업 → 짝맞추기 → 이후 산출 문제를 섞어 배치
  const warmup = chosenRecognition.slice(0, Math.ceil(chosenRecognition.length / 2));
  const rest = chosenRecognition.slice(warmup.length);
  const mixed: Exercise[] = [];
  const queueA = [...rest];
  const queueB = [...chosenProduction];
  while (queueA.length || queueB.length) {
    if (queueB.length) mixed.push(queueB.shift()!);
    if (queueB.length) mixed.push(queueB.shift()!);
    if (queueA.length) mixed.push(queueA.shift()!);
  }

  return [...warmup, ...matching.slice(0, wantMatch), ...mixed].slice(0, target);
}

/* ---------------- 채점 ---------------- */

export const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[.,?!'"’“”]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export function grade(exercise: Exercise, response: unknown): boolean {
  switch (exercise.kind) {
    case "pick-image":
      return typeof response === "string" && response === exercise.answer.en;
    case "pick-word":
      return typeof response === "string" && normalize(response) === normalize(exercise.answer);
    case "word-bank":
    case "listen": {
      if (!Array.isArray(response)) return false;
      return normalize(response.join(" ")) === normalize(exercise.tokens.join(" "));
    }
    case "type-in":
      return (
        typeof response === "string" &&
        exercise.accept.some((candidate) => normalize(candidate) === normalize(response))
      );
    case "match":
      return response === true;
    default:
      return false;
  }
}

export function answerText(exercise: Exercise): string {
  switch (exercise.kind) {
    case "pick-image":
      return exercise.answer.en;
    case "pick-word":
      return exercise.answer;
    case "word-bank":
    case "listen":
      return exercise.tokens.join(" ");
    case "type-in":
      return exercise.accept[0];
    case "match":
      return "";
  }
}

export function promptLabel(exercise: Exercise): string {
  switch (exercise.kind) {
    case "pick-image":
      return "그림 고르기";
    case "pick-word":
      return "뜻 고르기";
    case "word-bank":
      return exercise.direction === "ko->en" ? "영어로 옮기기" : "한국어로 옮기기";
    case "type-in":
      return "직접 입력하기";
    case "listen":
      return "듣고 받아쓰기";
    case "match":
      return "짝 맞추기";
  }
}
