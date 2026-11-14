/** 브라우저 음성 합성으로 듣기 문제를 재생한다. (외부 오디오 자산 없음) */

/* macOS에 기본 탑재된 장난/효과음 음성들.
   영어 음성 목록의 맨 앞을 차지해서, 음성을 고르지 않으면 이것들이 선택된다.
   Albert로 영어 문장을 읽으면 학습이 불가능하므로 반드시 걸러낸다. */
const NOVELTY =
  /^(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox)/i;

/** 선호 순서 — 또렷하고 표준 발음에 가까운 음성부터 */
const PREFERRED = [
  /^samantha/i,
  /^alex$/i,
  /google us english/i,
  /microsoft (aria|jenny|guy|michelle)/i,
  /^(ava|allison|susan|nicky|tom)/i,
  /^(karen|daniel|moira|tessa)/i,
];

let picked: SpeechSynthesisVoice | null = null;
let pickedFor = "";

/** 음성 목록은 비동기로 채워진다. 비어 있는 채로 재생하면 기본 음성이 잘못 잡힌다. */
function voicesReady(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length) return Promise.resolve(now);
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(synth.getVoices());
    };
    synth.addEventListener("voiceschanged", finish, { once: true });
    window.setTimeout(finish, 1500);
  });
}

function chooseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const signature = voices.length + ":" + (voices[0]?.name ?? "");
  if (picked && pickedFor === signature) return picked;

  const english = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const usable = english.filter((voice) => !NOVELTY.test(voice.name));

  let found: SpeechSynthesisVoice | undefined;
  for (const pattern of PREFERRED) {
    found = usable.find((voice) => pattern.test(voice.name));
    if (found) break;
  }
  found ??= usable.find((voice) => voice.lang.toLowerCase() === "en-us");
  found ??= usable[0];
  found ??= english[0];

  picked = found ?? null;
  pickedFor = signature;
  return picked;
}

export async function speak(text: string, { slow = false }: { slow?: boolean } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  const voices = await voicesReady();
  const voice = chooseVoice(voices);

  if (synth.speaking || synth.pending) synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  } else {
    utter.lang = "en-US";
  }
  utter.rate = slow ? 0.55 : 0.92;
  utter.pitch = 1;
  utter.onerror = (event) => {
    if (event.error !== "interrupted" && event.error !== "canceled") {
      console.warn("[speech] 재생 실패:", event.error);
    }
  };

  // cancel() 직후 speak()를 호출하면 발화가 씹히는 브라우저가 있어 한 틱 띄운다
  window.setTimeout(() => synth.speak(utter), 60);
}

export const canSpeak = () => typeof window !== "undefined" && !!window.speechSynthesis;

/** 설정 화면에서 현재 선택된 음성을 보여주기 위해 */
export async function currentVoiceName(): Promise<string | null> {
  if (!canSpeak()) return null;
  return chooseVoice(await voicesReady())?.name ?? null;
}

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
