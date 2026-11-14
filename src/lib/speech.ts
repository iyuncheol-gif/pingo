/** 브라우저 음성 합성으로 듣기 문제를 재생한다. (외부 오디오 자산 없음) */

let cached: SpeechSynthesisVoice[] = [];

function voices(): SpeechSynthesisVoice[] {
  if (cached.length) return cached;
  cached = window.speechSynthesis?.getVoices() ?? [];
  return cached;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    cached = window.speechSynthesis.getVoices();
  });
}

export function speak(text: string, { slow = false }: { slow?: boolean } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const en = voices().filter((v) => v.lang.toLowerCase().startsWith("en"));
  const preferred =
    en.find((v) => /samantha|google us english|aria|jenny/i.test(v.name)) ?? en[0];
  if (preferred) utter.voice = preferred;
  utter.lang = preferred?.lang ?? "en-US";
  utter.rate = slow ? 0.6 : 0.94;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}

export const canSpeak = () => typeof window !== "undefined" && !!window.speechSynthesis;

/* ---- 간단한 효과음 (WebAudio로 합성, 음원 파일 없음) ---- */

let ctx: AudioContext | null = null;
const audio = () => {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = Ctor ? new Ctor() : null;
  }
  return ctx;
};

function tone(freq: number, start: number, duration: number, gainValue: number) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  gain.gain.setValueAtTime(0, ac.currentTime + start);
  gain.gain.linearRampToValueAtTime(gainValue, ac.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + duration + 0.02);
}

export const sfx = {
  correct() {
    tone(660, 0, 0.14, 0.12);
    tone(880, 0.09, 0.2, 0.1);
  },
  wrong() {
    tone(200, 0, 0.18, 0.1);
    tone(150, 0.1, 0.22, 0.09);
  },
  tap() {
    tone(520, 0, 0.05, 0.05);
  },
  finish() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.26, 0.1));
  },
};
