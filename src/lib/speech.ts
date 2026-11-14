/** 브라우저 음성 합성으로 듣기 문제를 재생한다. (외부 오디오 자산 없음)

    설계 원칙
    1. speak()는 반드시 "동기"로 synth.speak()까지 도달해야 한다.
       iOS Safari는 사용자 제스처 밖에서 시작된 음성을 조용히 버린다.
       await을 끼우면 클릭 컨텍스트가 끊겨 소리가 아예 안 난다.
    2. 음성은 품질 순으로 고른다. 같은 영어라도 기기마다 자연스러움 차이가 크다.
    3. 재생이 실패하면 호출부가 알 수 있게 Promise<boolean>으로 결과를 돌려준다.
*/

/* macOS 기본 탑재 장난/효과음 음성 — 영어 목록 맨 앞을 차지해 잘못 선택되기 쉽다 */
const NOVELTY =
  /^(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|kathy|fred|ralph|princess|deranged|hysterical|bruce|agnes)/i;

/** 높을수록 자연스러운 음성. 기기마다 있는 음성이 달라 점수제로 고른다. */
function quality(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;

  // 신경망 기반 / 프리미엄 표기
  if (/natural|neural/.test(name)) score += 60;
  if (/premium|enhanced/.test(name)) score += 50;
  if (/siri/.test(name)) score += 45;
  if (/online/.test(name)) score += 25;

  // 널리 쓰이는 고품질 음성
  if (/google (us|uk) english/.test(name)) score += 55;
  if (/microsoft (aria|jenny|guy|michelle|ana)/.test(name)) score += 45;
  if (/^(samantha|ava|allison|susan|tom|nicky|evan|joelle|zoe)/.test(name)) score += 35;
  if (/^(alex|daniel|karen|moira|tessa|serena|oliver|kate)/.test(name)) score += 20;

  // 네트워크 음성이 대체로 더 자연스럽다 (Chrome의 Google 음성)
  if (!voice.localService) score += 20;

  // 미국식 영어를 기본으로
  const lang = voice.lang.toLowerCase();
  if (lang === "en-us") score += 14;
  else if (lang === "en-gb") score += 8;
  else if (lang.startsWith("en")) score += 3;

  if (/compact/.test(name)) score -= 25;
  return score;
}

let cache: SpeechSynthesisVoice[] = [];
let manualURI: string | null = null;
let primed = false;

function refresh(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  const list = window.speechSynthesis.getVoices();
  if (list.length) cache = list;
  return cache;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  refresh();
  window.speechSynthesis.addEventListener("voiceschanged", refresh);
}

export function englishVoices(): SpeechSynthesisVoice[] {
  return refresh()
    .filter((voice) => voice.lang.toLowerCase().startsWith("en") && !NOVELTY.test(voice.name))
    .sort((a, b) => quality(b) - quality(a));
}

export function setPreferredVoice(uri: string | null) {
  manualURI = uri;
}

function chooseVoice(): SpeechSynthesisVoice | null {
  const list = refresh();
  if (manualURI) {
    const exact = list.find((voice) => voice.voiceURI === manualURI);
    if (exact) return exact;
  }
  return englishVoices()[0] ?? list.find((v) => v.lang.toLowerCase().startsWith("en")) ?? null;
}

export function currentVoice(): SpeechSynthesisVoice | null {
  return chooseVoice();
}

/** 첫 사용자 입력에서 엔진을 깨운다. iOS는 제스처 안에서 한 번 울려야 이후가 열린다. */
export function primeSpeech() {
  if (primed || typeof window === "undefined" || !window.speechSynthesis) return;
  primed = true;
  refresh();
  try {
    const warm = new SpeechSynthesisUtterance(" ");
    warm.volume = 0;
    window.speechSynthesis.speak(warm);
  } catch {
    /* 깨우기 실패는 무시 — 실제 재생에서 다시 시도한다 */
  }
}

/**
 * 문장을 읽는다. 재생이 시작되면 true.
 * 호출부는 반드시 사용자 입력 핸들러 "안에서" 동기로 호출해야 한다.
 */
export function speak(text: string, { slow = false }: { slow?: boolean } = {}): Promise<boolean> {
  if (typeof window === "undefined" || !window.speechSynthesis) return Promise.resolve(false);
  const synth = window.speechSynthesis;

  if (synth.speaking || synth.pending) synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  const voice = chooseVoice();
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  } else {
    utter.lang = "en-US";
  }
  utter.rate = slow ? 0.55 : 0.92;
  utter.pitch = 1;
  utter.volume = 1;

  return new Promise<boolean>((resolve) => {
    let settled = false;
    const done = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };
    utter.onstart = () => done(true);
    utter.onerror = (event) => {
      if (event.error !== "interrupted" && event.error !== "canceled") done(false);
    };

    // 제스처 컨텍스트를 유지하기 위해 동기로 바로 호출한다
    synth.speak(utter);

    // 일부 브라우저는 cancel() 직후 첫 발화를 삼킨다 — 한 번만 되살린다
    window.setTimeout(() => {
      if (settled) return;
      if (!synth.speaking && !synth.pending) {
        try {
          synth.speak(utter);
        } catch {
          done(false);
        }
      }
    }, 220);

    window.setTimeout(() => done(synth.speaking || synth.pending), 1400);
  });
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
