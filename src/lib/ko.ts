/** 한국어 조사 자동 선택 — "'안녕하세요'을(를)" 같은 어색한 표기를 없앤다. */

const hasFinalConsonant = (word: string): boolean => {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0);
  if (Number.isNaN(code)) return false;
  if (code < 0xac00 || code > 0xd7a3) return false; // 한글 음절이 아니면 받침 없음으로 처리
  return (code - 0xac00) % 28 !== 0;
};

export function josa(word: string, pair: "을를" | "은는" | "이가" | "와과"): string {
  const withFinal = hasFinalConsonant(word);
  switch (pair) {
    case "을를":
      return withFinal ? "을" : "를";
    case "은는":
      return withFinal ? "은" : "는";
    case "이가":
      return withFinal ? "이" : "가";
    case "와과":
      return withFinal ? "과" : "와";
  }
}

export const withJosa = (word: string, pair: "을를" | "은는" | "이가" | "와과") =>
  `${word}${josa(word, pair)}`;
