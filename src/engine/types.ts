import type { Sentence, Tier, Word } from "../data/course";

export type Exercise =
  | {
      kind: "pick-image";
      id: string;
      prompt: string;
      answer: Word;
      choices: Word[];
      isNew: boolean;
    }
  | {
      kind: "pick-word";
      id: string;
      prompt: string;
      promptEn?: string;
      answer: string;
      choices: string[];
      isNew: boolean;
    }
  | {
      kind: "word-bank";
      id: string;
      direction: "en->ko" | "ko->en";
      prompt: string;
      tokens: string[];
      bank: string[];
      sentence: Sentence;
      isNew: boolean;
    }
  | {
      kind: "type-in";
      id: string;
      direction: "en->ko" | "ko->en";
      prompt: string;
      accept: string[];
      sentence: Sentence;
      isNew: boolean;
    }
  | {
      kind: "listen";
      id: string;
      tokens: string[];
      bank: string[];
      sentence: Sentence;
      isNew: boolean;
    }
  | {
      kind: "match";
      id: string;
      pairs: Word[];
      isNew: boolean;
    };

export type ExerciseKind = Exercise["kind"];

export interface LessonSpec {
  unitId: string;
  /** 0-based. unit.lessonCount와 같으면 유닛 복습(트로피) 노드 */
  lessonIndex: number;
  tier: Tier;
  isReview: boolean;
  title: string;
  /** 기기에 영어 음성이 없을 때 듣기 문제를 빼기 위한 스위치 */
  allowListening?: boolean;
}
