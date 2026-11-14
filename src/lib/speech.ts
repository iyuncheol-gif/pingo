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
let lastError: string | null = null;
let voiceCountAtLastPlay = 0;

/** 마지막 재생 시점에 인식된 영어 음성 개수 */
export const englishVoiceCount = () => voiceCountAtLastPlay;

/** 마지막 재생 실패 원인 — 설정 화면 진단에 쓴다 */
export const lastSpeechError = () => lastError;

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

/**
 * 앱 전역에서 "첫 사용자 입력"을 한 번 가로채 음성/오디오 엔진을 깨운다.
 * iOS Safari는 제스처 안에서 한 번 발화해야 이후의 프로그램 재생(자동 재생 포함)을 허용한다.
 * useEffect 안에서 깨우는 것만으로는 제스처가 아니어서 열리지 않는다.
 */
export function installAudioUnlock() {
  if (typeof window === "undefined") return;
  const unlock = () => {
    primeSpeech();
    const ac = audio();
    if (ac && ac.state === "suspended") void ac.resume();
  };
  // 이전 세션에서 큐가 멈춘 채 남아 있을 수 있어 한 번 비운다
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* 무시 */
  }
  const opts = { once: true, capture: true } as const;
  window.addEventListener("pointerdown", unlock, opts);
  window.addEventListener("touchend", unlock, opts);
  window.addEventListener("keydown", unlock, opts);
}

/**
 * 음성 목록만 미리 읽어 둔다.
 * 예전에는 무음 발화를 큐에 넣어 엔진을 깨웠는데, iOS Safari는 빈 문자열 발화에
 * end 이벤트를 주지 않아 speechSynthesis가 speaking 상태로 멈춰 버린다.
 * 그 뒤의 모든 재생이 조용히 무시되므로 프라이밍 발화는 하지 않는다.
 */
export function primeSpeech() {
  if (primed || typeof window === "undefined" || !window.speechSynthesis) return;
  primed = true;
  refresh();
}

/**
 * 문장을 읽는다. 재생이 시작되면 true.
 * 호출부는 반드시 사용자 입력 핸들러 "안에서" 동기로 호출해야 한다.
 */
export function speak(text: string, { slow = false }: { slow?: boolean } = {}): Promise<boolean> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    lastError = "unsupported";
    return Promise.resolve(false);
  }
  const synth = window.speechSynthesis;
  const voices = refresh();
  const voice = chooseVoice();

  const build = (withVoice = true) => {
    const utter = new SpeechSynthesisUtterance(text);
    // iOS는 현재 목록에 없는 음성 객체를 받으면 아무 소리 없이 무시한다
    if (withVoice && voice && voices.includes(voice)) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = "en-US";
    }
    utter.rate = slow ? 0.55 : 0.92;
    utter.pitch = 1;
    utter.volume = 1;
    return utter;
  };

  // 멈춰 있는 큐를 먼저 비운다 (iOS에서 흔하다)
  if (synth.speaking || synth.pending || synth.paused) {
    try {
      synth.resume();
      synth.cancel();
    } catch {
      /* 무시 */
    }
  }

  /** 기기가 인식한 영어 음성 개수 — 진단에 쓴다 */
  voiceCountAtLastPlay = voices.filter((v) => v.lang.toLowerCase().startsWith("en")).length;

  lastError = null;

  return new Promise<boolean>((resolve) => {
    let settled = false;
    let retried = false;
    const done = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };

    const fire = (withVoice: boolean) => {
      const utter = build(withVoice);
      utter.onstart = () => done(true);
      utter.onerror = (event) => {
        if (event.error === "interrupted" || event.error === "canceled") return;
        lastError = event.error;
        // 특정 음성 객체를 거부하는 엔진이 있다 — 음성 지정 없이 한 번 더
        if (withVoice && !retried) {
          retried = true;
          fire(false);
          return;
        }
        done(false);
      };
      try {
        synth.speak(utter);
      } catch {
        if (withVoice && !retried) {
          retried = true;
          fire(false);
          return;
        }
        done(false);
      }
    };

    // 제스처 컨텍스트를 유지하기 위해 동기로 바로 호출한다
    fire(true);

    // 큐에 들어가지도 않았다면 음성 지정 없이 한 번 더 시도한다
    window.setTimeout(() => {
      if (settled || retried) return;
      if (!synth.speaking && !synth.pending) {
        retried = true;
        fire(false);
      }
    }, 500);

    /* 안드로이드 TTS는 첫 발화에서 엔진을 띄우느라 2초 넘게 걸리기도 한다.
       너무 짧게 끊으면 실제로는 들리는데 실패로 표시된다. */
    window.setTimeout(() => {
      if (settled) return;
      const alive = synth.speaking || synth.pending;
      if (!alive) lastError = lastError ?? "no-start";
      done(alive);
    }, 3500);
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
