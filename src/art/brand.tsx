/* ============================================================
   브랜드 마크 · 마스코트 · UI 아이콘 — 전부 자체 제작 벡터
   마스코트 "핑고": 둥근 물방울 실루엣의 기하학적 새.
   캐리커처가 아니라 브랜드 심볼로 읽히도록 면 구성을 단순하게 유지한다.
   ============================================================ */

export type Mood = "idle" | "happy" | "sad" | "think";

export function Mascot({ size = 96, mood = "idle" }: { size?: number; mood?: Mood }) {
  const pupilX = mood === "think" ? 1.5 : 0;
  const pupilY = mood === "think" ? -2 : 0;
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} role="presentation" aria-hidden="true">
      <ellipse cx="48" cy="90" rx="25" ry="4" fill="var(--a-shadow)" />
      {/* 발 */}
      <path d="M33 78c5 0 8 3 8 7 0 2-2 3-5 3h-8c-3 0-4-2-2-4z" fill="var(--gold-deep)" />
      <path d="M63 78c-5 0-8 3-8 7 0 2 2 3 5 3h8c3 0 4-2 2-4z" fill="var(--gold-deep)" />
      {/* 몸통 */}
      <path
        d="M48 6c20 0 32 17 32 40 0 24-14 38-32 38S16 70 16 46C16 23 28 6 48 6z"
        fill="var(--brand)"
      />
      {/* 배 */}
      <ellipse cx="48" cy="60" rx="21" ry="22" fill="var(--a-paper)" />
      {/* 날개 */}
      <path d="M17 44c-3 9-2 20 2 26 3 4 7 3 7-1V45c0-4-7-6-9-1z" fill="var(--brand-deep)" />
      <path d="M79 44c3 9 2 20-2 26-3 4-7 3-7-1V45c0-4 7-6 9-1z" fill="var(--brand-deep)" />
      {/* 부리 */}
      <path d="M48 40l10 7-10 8-10-8z" fill="var(--gold)" />
      <path d="M48 47l10 0-10 8-10-8z" fill="var(--gold-deep)" />
      {/* 눈 */}
      {mood === "happy" ? (
        <>
          <path d="M31 31c3-4 9-4 12 0" stroke="var(--ink)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M53 31c3-4 9-4 12 0" stroke="var(--ink)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "sad" ? (
        <>
          <path d="M31 33c3 4 9 4 12 0" stroke="var(--ink)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M53 33c3 4 9 4 12 0" stroke="var(--ink)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="37" cy="32" r="8" fill="var(--a-paper)" />
          <circle cx="59" cy="32" r="8" fill="var(--a-paper)" />
          <circle cx={37 + pupilX} cy={32 + pupilY} r="3.9" fill="var(--ink)" />
          <circle cx={59 + pupilX} cy={32 + pupilY} r="3.9" fill="var(--ink)" />
        </>
      )}
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="logo" aria-label="Pingo">
      <svg viewBox="0 0 40 40" width="32" height="32" role="presentation" aria-hidden="true">
        <rect x="2" y="2" width="36" height="36" rx="11" fill="var(--brand)" />
        <path
          fillRule="evenodd"
          d="M13 9h9.5a7 7 0 0 1 0 14H18v8h-5V9zm5 4.4v5.2h4.5a2.6 2.6 0 0 0 0-5.2H18z"
          fill="#fff"
        />
      </svg>
      {!compact && <span className="logo__word">Pingo</span>}
    </span>
  );
}

/* ---------------- UI 아이콘 ---------------- */

type IconProps = { size?: number; className?: string };

const I = ({ size = 22, className, children }: IconProps & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    role="presentation"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const IconHeart = (p: IconProps) => (
  <I {...p}>
    <path
      d="M12 20.5S3.5 15.2 3.5 9.4A4.9 4.9 0 0 1 12 6.1a4.9 4.9 0 0 1 8.5 3.3c0 5.8-8.5 11.1-8.5 11.1z"
      fill="currentColor"
    />
  </I>
);

export const IconHeartOff = (p: IconProps) => (
  <I {...p}>
    <path
      d="M12 20.5S3.5 15.2 3.5 9.4A4.9 4.9 0 0 1 12 6.1a4.9 4.9 0 0 1 8.5 3.3c0 5.8-8.5 11.1-8.5 11.1z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      opacity=".5"
    />
  </I>
);

export const IconGem = (p: IconProps) => (
  <I {...p}>
    <path d="M7 3h10l4 6-9 12L3 9z" fill="currentColor" opacity=".35" />
    <path d="M7 3h10l-5 6zM3 9h18l-9 12z" fill="currentColor" />
  </I>
);

export const IconFlame = (p: IconProps) => (
  <I {...p}>
    <path
      d="M13 2c.6 3.4-1.2 4.6-2.8 6.2C8.3 10 6.5 11.8 6.5 14.6A5.5 5.5 0 0 0 12 20a5.5 5.5 0 0 0 5.5-5.4c0-4.4-3-6.3-4.5-12.6z"
      fill="currentColor"
    />
    <path d="M12 20a2.8 2.8 0 0 1-2.8-2.8c0-1.7 1.6-2.4 2.3-4 1.3 1.8 3.3 2.6 3.3 4A2.8 2.8 0 0 1 12 20z" fill="#fff" opacity=".45" />
  </I>
);

export const IconCheck = (p: IconProps) => (
  <I {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
  </I>
);

export const IconX = (p: IconProps) => (
  <I {...p}>
    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
  </I>
);

export const IconSpeaker = (p: IconProps) => (
  <I {...p}>
    <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill="currentColor" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </I>
);

export const IconSlow = (p: IconProps) => (
  <I {...p}>
    <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill="currentColor" />
    <path d="M15.5 9.5a3 3 0 0 1 0 5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    <path d="M17 18.5l4 2.5v-5z" fill="currentColor" opacity=".6" />
  </I>
);

export const IconPath = (p: IconProps) => (
  <I {...p}>
    <path d="M6 20c0-3 4-3 6-5s2-4-1-5-4-1-4-3 2-3 5-3h4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="4" r="2.6" fill="currentColor" />
    <circle cx="6" cy="20" r="2.6" fill="currentColor" />
  </I>
);

export const IconQuest = (p: IconProps) => (
  <I {...p}>
    <path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.3l6.6-.9z" fill="currentColor" />
  </I>
);

export const IconLeague = (p: IconProps) => (
  <I {...p}>
    <path d="M7 3h10v5a5 5 0 0 1-10 0z" fill="currentColor" />
    <path d="M17 4h3v2a4 4 0 0 1-4 4M7 4H4v2a4 4 0 0 0 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M10 13h4v3h3v3H7v-3h3z" fill="currentColor" />
  </I>
);

export const IconShop = (p: IconProps) => (
  <I {...p}>
    <path d="M4 8h16l-1.4 11.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8z" fill="currentColor" opacity=".35" />
    <path d="M4 8h16l-.4 3H4.4z" fill="currentColor" />
    <path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </I>
);

export const IconUser = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path d="M4 20c0-4.4 3.6-6.5 8-6.5s8 2.1 8 6.5z" fill="currentColor" />
  </I>
);

export const IconLock = (p: IconProps) => (
  <I {...p}>
    <rect x="5" y="10" width="14" height="10" rx="3" fill="currentColor" />
    <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </I>
);

export const IconCrown = (p: IconProps) => (
  <I {...p}>
    <path d="M3 7l4.5 4L12 4l4.5 7L21 7l-1.8 11H4.8z" fill="currentColor" />
  </I>
);

export const IconChevron = (p: IconProps) => (
  <I {...p}>
    <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </I>
);

export const IconBook = (p: IconProps) => (
  <I {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2z" fill="currentColor" opacity=".55" />
    <path d="M20 5a2 2 0 0 0-2-2h-5v18h5a2 2 0 0 0 2-2z" fill="currentColor" />
  </I>
);

export const IconMoon = (p: IconProps) => (
  <I {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor" />
  </I>
);

export const IconSun = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="4.4" fill="currentColor" />
    <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </I>
);
