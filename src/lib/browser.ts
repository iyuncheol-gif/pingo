/** 앱 내장 브라우저(인앱 웹뷰) 감지.
 *
 *  카카오톡·인스타그램 등에서 링크를 열면 각 앱의 웹뷰가 뜨는데,
 *  이 웹뷰들은 Web Speech API(speechSynthesis)를 제공하지 않는 경우가 많다.
 *  기기에 영어 음성이 깔려 있어도 재생 자체가 불가능하므로,
 *  기기 설정을 안내하는 대신 외부 브라우저로 열도록 유도해야 한다. */

const UA = typeof navigator === "undefined" ? "" : navigator.userAgent;

const APPS: { test: RegExp; name: string }[] = [
  { test: /KAKAOTALK/i, name: "카카오톡" },
  { test: /NAVER\(inapp/i, name: "네이버 앱" },
  { test: /Instagram/i, name: "인스타그램" },
  { test: /FBAN|FBAV/i, name: "페이스북" },
  { test: /Line\//i, name: "라인" },
  { test: /DaumApps/i, name: "다음 앱" },
  { test: /; wv\)/i, name: "앱 내장 브라우저" },
];

/** 앱 내장 브라우저면 앱 이름, 아니면 null */
export function inAppBrowser(): string | null {
  return APPS.find((app) => app.test.test(UA))?.name ?? null;
}

/** 사용 중인 브라우저 이름(버전 포함) — 음성 미지원 원인을 특정하는 데 쓴다 */
export function browserName(): string {
  const app = inAppBrowser();
  if (app) return app;
  const samsung = UA.match(/SamsungBrowser\/([\d.]+)/);
  if (samsung) return `삼성 인터넷 ${samsung[1]}`;
  const edge = UA.match(/Edg(?:A|iOS)?\/([\d.]+)/);
  if (edge) return `Edge ${edge[1]}`;
  const firefox = UA.match(/(?:Firefox|FxiOS)\/([\d.]+)/);
  if (firefox) return `Firefox ${firefox[1]}`;
  const whale = UA.match(/Whale\/([\d.]+)/);
  if (whale) return `웨일 ${whale[1]}`;
  const chrome = UA.match(/(?:Chrome|CriOS)\/([\d.]+)/);
  if (chrome) return `Chrome ${chrome[1].split(".")[0]}`;
  if (/Safari/i.test(UA)) return "Safari";
  return "알 수 없는 브라우저";
}

/** 지원 문의 때 붙일 짧은 환경 정보 */
export function envSummary(): string {
  const platform = isIOS() ? "iOS" : isAndroid() ? "Android" : "Desktop";
  return `${browserName()} · ${platform}`;
}

export const isAndroid = () => /Android/i.test(UA);
export const isIOS = () => /iPhone|iPad|iPod/i.test(UA);

/** 외부 브라우저로 넘길 수단이 있는지 — 카카오톡은 iOS에서도 전용 스킴이 통한다 */
export const canOpenExternally = () => /KAKAOTALK/i.test(UA) || isAndroid();

/** 기본(외부) 브라우저로 현재 주소를 다시 연다. 수단이 없으면 false. */
export function openExternally(): boolean {
  if (typeof window === "undefined") return false;
  const url = window.location.href;

  if (/KAKAOTALK/i.test(UA)) {
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
    return true;
  }
  if (isAndroid()) {
    const bare = url.replace(/^https?:\/\//, "");
    window.location.href = `intent://${bare}#Intent;scheme=https;package=com.android.chrome;end`;
    return true;
  }
  return false;
}

/** 주소를 클립보드에 복사 (iOS 웹뷰에서 직접 붙여넣어 열도록) */
export async function copyUrl(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(window.location.href);
    return true;
  } catch {
    return false;
  }
}
