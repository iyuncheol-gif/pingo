/* ============================================================
   Pingo Pictogram System
   전부 직접 그린 플랫 벡터. 외부 아이콘/일러스트 라이브러리를 쓰지 않는다.
   규칙
     - 64x64 그리드, 여백 6
     - 면(fill) 위주, 선은 stroke-linecap="round" / width 3
     - 색은 --a-* 토큰만 사용해 라이트/다크 모두에서 성립
     - 바닥에 깔리는 그림자 타원으로 무게중심을 잡는다
   ============================================================ */


import type { ReactNode } from "react";

type Art = () => ReactNode;

const Ground = ({ cx = 32, cy = 54, rx = 19 }: { cx?: number; cy?: number; rx?: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry="3.4" fill="var(--a-shadow)" />
);

/* ---------------- 음료 · 음식 ---------------- */

const coffee: Art = () => (
  <>
    <Ground rx={18} />
    <path d="M14 20h28v14a13 13 0 0 1-13 13h-2a13 13 0 0 1-13-13V20z" fill="var(--a-paper)" />
    <path d="M14 20h28v5H14z" fill="var(--a-paper-2)" />
    <path d="M18 25h20v9a10 10 0 0 1-10 10 10 10 0 0 1-10-10v-9z" fill="var(--a-brown)" />
    <path
      d="M42 24h4a7 7 0 0 1 0 14h-2"
      fill="none"
      stroke="var(--a-paper-2)"
      strokeWidth="3.4"
      strokeLinecap="round"
    />
    <path
      d="M24 14c0-3 3-3 3-6M32 14c0-3 3-3 3-6"
      fill="none"
      stroke="var(--a-ink-2)"
      strokeWidth="2.6"
      strokeLinecap="round"
      opacity=".55"
    />
  </>
);

const tea: Art = () => (
  <>
    <Ground rx={18} />
    <path d="M13 22h26v12a13 13 0 0 1-26 0V22z" fill="var(--a-paper)" />
    <path d="M17 26h18v8a9 9 0 0 1-18 0v-8z" fill="var(--a-green)" opacity=".75" />
    <path
      d="M39 25h5a6 6 0 0 1 0 12h-3"
      fill="none"
      stroke="var(--a-paper-2)"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path d="M10 47h34a2.5 2.5 0 0 1 0 5H10a2.5 2.5 0 0 1 0-5z" fill="var(--a-paper-2)" />
    <path
      d="M22 15c0-3 3-3 3-6"
      fill="none"
      stroke="var(--a-ink-2)"
      strokeWidth="2.6"
      strokeLinecap="round"
      opacity=".55"
    />
  </>
);

const water: Art = () => (
  <>
    <Ground rx={16} />
    <path d="M32 8c9 11 14 17.5 14 24a14 14 0 0 1-28 0c0-6.5 5-13 14-24z" fill="var(--a-blue)" />
    <path
      d="M32 14c6.5 8.5 10 13.5 10 18.5a10 10 0 0 1-4 8"
      fill="none"
      stroke="var(--a-blue-l)"
      strokeWidth="3"
      strokeLinecap="round"
      opacity=".8"
    />
  </>
);

const milk: Art = () => (
  <>
    <Ground rx={16} />
    <path d="M17 24h30v24a5 5 0 0 1-5 5H22a5 5 0 0 1-5-5z" fill="var(--a-paper)" />
    <path d="M17 24l5-13h20l5 13z" fill="var(--a-paper-2)" />
    <path d="M22 11h20l2.2 5.5H19.8z" fill="var(--a-blue)" />
    <rect x="23" y="31" width="18" height="14" rx="2.5" fill="var(--a-blue)" />
    <path d="M27 36h10M27 41h6" stroke="var(--a-paper)" strokeWidth="2.2" strokeLinecap="round" />
  </>
);

const bread: Art = () => (
  <>
    <Ground rx={19} />
    <path d="M10 32a22 13 0 0 1 44 0v8a9 9 0 0 1-9 9H19a9 9 0 0 1-9-9z" fill="var(--a-gold)" />
    <path d="M10 32a22 13 0 0 1 44 0z" fill="var(--a-gold-d)" />
    <path d="M20 26l4-6M31 23l4-6M42 26l4-6" stroke="var(--a-cream)" strokeWidth="2.6" strokeLinecap="round" opacity=".75" />
    <path d="M19 40h26" stroke="var(--a-gold-d)" strokeWidth="2.6" strokeLinecap="round" opacity=".5" />
  </>
);

const sugar: Art = () => (
  <>
    <Ground rx={17} />
    <rect x="22" y="12" width="13" height="13" rx="3" fill="var(--a-paper)" stroke="var(--a-ink-2)" strokeWidth="2" />
    <rect x="34" y="18" width="11" height="11" rx="2.6" fill="var(--a-paper)" stroke="var(--a-ink-2)" strokeWidth="2" />
    <path d="M12 30h40l-3 14a6 6 0 0 1-6 5H21a6 6 0 0 1-6-5z" fill="var(--a-teal)" />
    <rect x="10" y="26" width="44" height="6" rx="3" fill="var(--a-blue)" />
    <path d="M22 38h20" stroke="var(--a-paper)" strokeWidth="2.6" strokeLinecap="round" opacity=".6" />
  </>
);

const cup: Art = () => (
  <>
    <Ground rx={15} />
    <path d="M18 18h28l-3.5 30a5 5 0 0 1-5 4.4H26.5a5 5 0 0 1-5-4.4L18 18z" fill="var(--a-paper)" />
    <path d="M18 18h28l-.9 8H18.9z" fill="var(--a-rose)" opacity=".85" />
    <path d="M20.6 30h22.8l-1.5 13H22.1z" fill="var(--a-blue-l)" opacity=".5" />
  </>
);

const hot: Art = () => (
  <>
    <Ground rx={14} />
    <path d="M32 10c7 8 11 13 11 20a11 11 0 0 1-22 0c0-7 4-12 11-20z" fill="var(--a-clay)" />
    <path d="M32 24c3.5 4.5 5.5 7 5.5 10.5A5.5 5.5 0 0 1 32 40a5.5 5.5 0 0 1-5.5-5.5c0-3.5 2-6 5.5-10.5z" fill="var(--a-gold)" />
  </>
);

const dinner: Art = () => (
  <>
    <Ground rx={19} />
    <circle cx="32" cy="34" r="17" fill="var(--a-paper)" />
    <circle cx="32" cy="34" r="11" fill="var(--a-paper-2)" />
    <path d="M12 18v10a3 3 0 0 0 6 0V18M15 18v-6" stroke="var(--a-ink-2)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <path d="M49 12c3 0 4 4 4 8s-1 6-4 6" stroke="var(--a-ink-2)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
  </>
);

/* ---------------- 사람 ---------------- */

const Person = ({
  x = 32,
  scale = 1,
  shirt,
  hair,
  hairShape = "short",
}: {
  x?: number;
  scale?: number;
  shirt: string;
  hair: string;
  hairShape?: "short" | "long" | "bun";
}) => (
  <g transform={`translate(${x} 0) scale(${scale}) translate(${-x} 0)`}>
    {/* 어깨 */}
    <path d={`M${x - 19} 52c0-10 8.5-15 19-15s19 5 19 15z`} fill={shirt} />
    {/* 목 */}
    <rect x={x - 4} y="28" width="8" height="12" rx="4" fill="var(--a-cream)" />
    {/* 머리 */}
    <circle cx={x} cy="22" r="11" fill="var(--a-cream)" />
    {hairShape === "long" && (
      <path
        d={`M${x - 13} 24c0-13 5-17 13-17s13 4 13 17c0 6-2 10-4 10 1-5 0-8-1-10-3 2-11 2-16 0-1 2-2 5-1 10-2 0-4-4-4-10z`}
        fill={hair}
      />
    )}
    {hairShape === "bun" && (
      <>
        <circle cx={x} cy="7" r="5" fill={hair} />
        <path d={`M${x - 11} 20c0-8 5-12 11-12s11 4 11 12c0-3-4-5-11-5s-11 2-11 5z`} fill={hair} />
      </>
    )}
    {hairShape === "short" && (
      <path d={`M${x - 11} 21a11 11 0 0 1 22 0c0-4-3-8-11-8s-11 4-11 8z`} fill={hair} />
    )}
  </g>
);

const man: Art = () => (
  <>
    <Ground rx={17} />
    <Person shirt="var(--a-blue)" hair="var(--a-ink)" hairShape="short" />
  </>
);

const woman: Art = () => (
  <>
    <Ground rx={17} />
    <Person shirt="var(--a-rose)" hair="var(--a-brown)" hairShape="long" />
  </>
);

const boy: Art = () => (
  <>
    <Ground rx={14} />
    <Person shirt="var(--a-teal)" hair="var(--a-ink)" hairShape="short" scale={0.82} />
  </>
);

const girl: Art = () => (
  <>
    <Ground rx={14} />
    <Person shirt="var(--a-violet)" hair="var(--a-gold-d)" hairShape="bun" scale={0.82} />
  </>
);

const friend: Art = () => (
  <>
    <Ground rx={21} />
    <Person x={19} scale={0.74} shirt="var(--a-blue)" hair="var(--a-ink)" hairShape="short" />
    <Person x={45} scale={0.74} shirt="var(--a-rose)" hair="var(--a-brown)" hairShape="long" />
  </>
);

const teacher: Art = () => (
  <>
    <Ground rx={20} />
    <rect x="33" y="6" width="27" height="21" rx="3" fill="var(--a-green)" />
    <rect x="36" y="9" width="21" height="15" rx="2" fill="var(--a-green)" opacity=".5" />
    <path d="M39 14h15M39 19h9" stroke="var(--a-paper)" strokeWidth="2.4" strokeLinecap="round" />
    <Person x={20} scale={0.78} shirt="var(--a-violet)" hair="var(--a-ink)" hairShape="short" />
  </>
);

const family: Art = () => (
  <>
    <Ground rx={22} />
    <Person x={16} scale={0.66} shirt="var(--a-blue)" hair="var(--a-ink)" hairShape="short" />
    <Person x={40} scale={0.66} shirt="var(--a-rose)" hair="var(--a-brown)" hairShape="long" />
    <Person x={56} scale={0.46} shirt="var(--a-gold)" hair="var(--a-brown)" hairShape="short" />
  </>
);

const book: Art = () => (
  <>
    <Ground rx={20} />
    <path d="M32 19c-5-4-12-6-21-6a2 2 0 0 0-2 2v26a2 2 0 0 0 2 2c9 0 16 2 21 6z" fill="var(--a-violet)" />
    <path d="M32 19c5-4 12-6 21-6a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2c-9 0-16 2-21 6z" fill="var(--a-violet-d)" />
    <path d="M30 19h4v30h-4z" fill="var(--a-ink)" opacity=".2" />
    <path d="M15 22h10M15 28h10M15 34h8" stroke="var(--a-paper)" strokeWidth="2.2" strokeLinecap="round" opacity=".6" />
    <path d="M39 22h10M39 28h10M39 34h8" stroke="var(--a-paper)" strokeWidth="2.2" strokeLinecap="round" opacity=".45" />
  </>
);

const house: Art = () => (
  <>
    <Ground rx={20} />
    <path d="M32 10l24 18H8z" fill="var(--a-rose)" />
    <rect x="14" y="28" width="36" height="22" rx="3" fill="var(--a-paper)" />
    <rect x="27" y="34" width="10" height="16" rx="2" fill="var(--a-violet)" />
    <rect x="17" y="33" width="7" height="7" rx="1.6" fill="var(--a-blue-l)" />
    <rect x="40" y="33" width="7" height="7" rx="1.6" fill="var(--a-blue-l)" />
  </>
);

const kitchen: Art = () => (
  <>
    <Ground rx={19} />
    <rect x="10" y="26" width="44" height="24" rx="4" fill="var(--a-paper)" />
    <rect x="10" y="26" width="44" height="6" rx="3" fill="var(--a-ink-2)" opacity=".3" />
    <circle cx="21" cy="40" r="5" fill="var(--a-ink-2)" opacity=".45" />
    <rect x="32" y="35" width="18" height="11" rx="2.5" fill="var(--a-blue-l)" />
    <path d="M18 24c0-5 4-8 9-8s9 3 9 8" fill="none" stroke="var(--a-clay)" strokeWidth="3.4" strokeLinecap="round" />
  </>
);

const room: Art = () => (
  <>
    <Ground rx={20} />
    <rect x="8" y="30" width="48" height="16" rx="4" fill="var(--a-violet)" />
    <rect x="8" y="22" width="16" height="12" rx="3" fill="var(--a-paper)" />
    <rect x="26" y="24" width="14" height="8" rx="3" fill="var(--a-paper-2)" />
    <rect x="10" y="46" width="4" height="6" rx="2" fill="var(--a-brown)" />
    <rect x="50" y="46" width="4" height="6" rx="2" fill="var(--a-brown)" />
  </>
);

const clean: Art = () => (
  <>
    <Ground rx={16} />
    <path d="M34 8l4 4-18 18-4-4z" fill="var(--a-brown)" />
    <path d="M18 28l6 6-8 16-8-8z" fill="var(--a-gold)" />
    <path d="M12 44l6 6-4 4-6-6z" fill="var(--a-gold-d)" />
    <circle cx="46" cy="18" r="3" fill="var(--a-blue-l)" />
    <circle cx="52" cy="28" r="2.2" fill="var(--a-blue-l)" />
    <circle cx="44" cy="30" r="1.8" fill="var(--a-blue-l)" />
  </>
);

const cook: Art = () => (
  <>
    <Ground rx={19} />
    <path d="M12 28h34v10a10 10 0 0 1-10 10H22a10 10 0 0 1-10-10V28z" fill="var(--a-ink-2)" />
    <rect x="46" y="29" width="12" height="5" rx="2.5" fill="var(--a-ink-2)" opacity=".7" />
    <path d="M10 28h38" stroke="var(--a-paper-2)" strokeWidth="3" strokeLinecap="round" />
    <path d="M22 20c0-4 3-4 3-8M31 20c0-4 3-4 3-8" fill="none" stroke="var(--a-ink-2)" strokeWidth="2.6" strokeLinecap="round" opacity=".5" />
  </>
);

/* ---------------- 시간 ---------------- */

const morning: Art = () => (
  <>
    <path d="M8 44h48" stroke="var(--a-ink-2)" strokeWidth="3" strokeLinecap="round" opacity=".35" />
    <circle cx="32" cy="44" r="14" fill="var(--a-gold)" />
    <path
      d="M32 16v-6M14 26l-4-4M50 26l4-4M10 38H4M60 38h-6"
      stroke="var(--a-gold-d)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </>
);

const tonight: Art = () => (
  <>
    <path d="M40 10a20 20 0 1 0 12 36A22 22 0 0 1 40 10z" fill="var(--a-violet)" />
    <circle cx="48" cy="16" r="2.6" fill="var(--a-gold)" />
    <circle cx="55" cy="26" r="2" fill="var(--a-gold)" />
    <circle cx="43" cy="24" r="1.6" fill="var(--a-gold)" opacity=".8" />
  </>
);

const weekend: Art = () => (
  <>
    <Ground rx={18} />
    <rect x="10" y="14" width="44" height="36" rx="5" fill="var(--a-paper)" />
    <rect x="10" y="14" width="44" height="10" rx="5" fill="var(--a-rose)" />
    <rect x="18" y="9" width="5" height="10" rx="2.5" fill="var(--a-ink-2)" />
    <rect x="41" y="9" width="5" height="10" rx="2.5" fill="var(--a-ink-2)" />
    <rect x="17" y="30" width="9" height="8" rx="2" fill="var(--a-paper-2)" />
    <rect x="29" y="30" width="9" height="8" rx="2" fill="var(--a-paper-2)" />
    <rect x="41" y="30" width="9" height="8" rx="2" fill="var(--a-green)" />
  </>
);

const late: Art = () => (
  <>
    <Ground rx={16} />
    <circle cx="32" cy="32" r="20" fill="var(--a-paper)" />
    <circle cx="32" cy="32" r="20" fill="none" stroke="var(--a-rose)" strokeWidth="4" />
    <path d="M32 20v12l9 6" stroke="var(--a-ink)" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const meet: Art = () => (
  <>
    <path d="M6 16a4 4 0 0 1 4-4h18a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H16l-6 5v-5a4 4 0 0 1-4-4V16z" fill="var(--a-violet)" />
    <path d="M58 30a4 4 0 0 0-4-4H38a4 4 0 0 0-4 4v9a4 4 0 0 0 4 4h12l6 5v-5a4 4 0 0 0 2-4v-9z" fill="var(--a-teal)" />
  </>
);

/* ---------------- 이동 ---------------- */

const station: Art = () => (
  <>
    <Ground rx={19} />
    <rect x="16" y="10" width="32" height="30" rx="6" fill="var(--a-violet)" />
    <rect x="21" y="16" width="22" height="12" rx="3" fill="var(--a-blue-l)" />
    <circle cx="24" cy="34" r="3" fill="var(--a-gold)" />
    <circle cx="40" cy="34" r="3" fill="var(--a-gold)" />
    <path d="M18 40l-5 10M46 40l5 10" stroke="var(--a-ink-2)" strokeWidth="3" strokeLinecap="round" />
    <path d="M10 50h44" stroke="var(--a-ink-2)" strokeWidth="3" strokeLinecap="round" opacity=".5" />
  </>
);

const ticket: Art = () => (
  <>
    <Ground rx={19} />
    <path d="M8 20h48v8a5 5 0 0 0 0 10v8H8v-8a5 5 0 0 0 0-10v-8z" fill="var(--a-gold)" />
    <path d="M34 20v26" stroke="var(--a-paper)" strokeWidth="2.6" strokeDasharray="4 4" strokeLinecap="round" />
    <path d="M14 29h14M14 36h9" stroke="var(--a-gold-d)" strokeWidth="2.6" strokeLinecap="round" />
  </>
);

const bus: Art = () => (
  <>
    <Ground rx={19} />
    <rect x="10" y="14" width="44" height="30" rx="6" fill="var(--a-gold)" />
    <rect x="15" y="19" width="14" height="11" rx="2.5" fill="var(--a-blue-l)" />
    <rect x="35" y="19" width="14" height="11" rx="2.5" fill="var(--a-blue-l)" />
    <circle cx="20" cy="46" r="5" fill="var(--a-ink)" />
    <circle cx="44" cy="46" r="5" fill="var(--a-ink)" />
    <path d="M10 36h44" stroke="var(--a-gold-d)" strokeWidth="3" />
  </>
);

const map: Art = () => (
  <>
    <path d="M6 16l16-6v38L6 54V16z" fill="var(--a-green-l)" />
    <path d="M22 10l20 6v38l-20-6V10z" fill="var(--a-green)" />
    <path d="M42 16l16-6v38l-16 6V16z" fill="var(--a-green-l)" />
    <circle cx="32" cy="27" r="6.5" fill="var(--a-rose)" />
    <path d="M32 33v9" stroke="var(--a-rose)" strokeWidth="3" strokeLinecap="round" />
  </>
);

const street: Art = () => (
  <>
    <path d="M18 54L26 10h12l8 44z" fill="var(--a-ink-2)" opacity=".75" />
    <path d="M32 14v6M32 26v6M32 38v6M32 50v4" stroke="var(--a-paper)" strokeWidth="3" strokeLinecap="round" />
    <rect x="4" y="22" width="10" height="20" rx="2" fill="var(--a-blue-l)" />
    <rect x="50" y="18" width="10" height="24" rx="2" fill="var(--a-violet-l)" />
  </>
);

const left: Art = () => (
  <>
    <circle cx="32" cy="32" r="22" fill="var(--a-violet-l)" />
    <path d="M38 20L26 32l12 12" stroke="var(--a-violet-d)" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const right: Art = () => (
  <>
    <circle cx="32" cy="32" r="22" fill="var(--a-violet-l)" />
    <path d="M26 20l12 12-12 12" stroke="var(--a-violet-d)" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

/* ---------------- 여행 ---------------- */

const flight: Art = () => (
  <>
    <path d="M6 34l50-20-14 22-4 14-6-11-10-1-16-4z" fill="var(--a-violet)" />
    <path d="M56 14L32 39l-1.5 7.5" fill="none" stroke="var(--a-violet-d)" strokeWidth="2.4" opacity=".6" />
  </>
);

const luggage: Art = () => (
  <>
    <Ground rx={17} />
    <path d="M26 14a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v6h-4v-5h-4v5h-4v-6z" fill="var(--a-ink-2)" />
    <rect x="14" y="20" width="36" height="30" rx="5" fill="var(--a-teal)" />
    <rect x="20" y="20" width="6" height="30" fill="var(--a-paper)" opacity=".25" />
    <rect x="38" y="20" width="6" height="30" fill="var(--a-paper)" opacity=".25" />
    <rect x="22" y="31" width="20" height="7" rx="2" fill="var(--a-gold)" />
  </>
);

const passport: Art = () => (
  <>
    <Ground rx={16} />
    <rect x="16" y="10" width="32" height="42" rx="4" fill="var(--a-violet-d)" />
    <rect x="20" y="10" width="28" height="42" rx="4" fill="var(--a-violet)" />
    <circle cx="34" cy="26" r="7" fill="none" stroke="var(--a-gold)" strokeWidth="2.4" />
    <path d="M27 26h14M34 19c3 4 3 10 0 14M34 19c-3 4-3 10 0 14" stroke="var(--a-gold)" strokeWidth="1.8" fill="none" />
    <path d="M27 40h14" stroke="var(--a-gold)" strokeWidth="2.4" strokeLinecap="round" />
  </>
);

const refund: Art = () => (
  <>
    <Ground rx={17} />
    <rect x="8" y="18" width="48" height="28" rx="5" fill="var(--a-green)" />
    <circle cx="32" cy="32" r="8" fill="var(--a-green-l)" />
    <path d="M32 27v10M29 30h5a2.5 2.5 0 0 1 0 5h-4a2.5 2.5 0 0 0 0 5h5" stroke="var(--a-green)" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M16 24h5M43 40h5" stroke="var(--a-green-l)" strokeWidth="3" strokeLinecap="round" />
  </>
);

/* ---------------- 일 · 자료 ---------------- */

const meeting: Art = () => (
  <>
    <Ground rx={20} />
    <rect x="6" y="38" width="52" height="7" rx="3.5" fill="var(--a-ink-2)" opacity=".55" />
    <circle cx="17" cy="22" r="6.5" fill="var(--a-blue)" />
    <path d="M7 38c0-6 4.5-9.5 10-9.5S27 32 27 38z" fill="var(--a-blue)" opacity=".8" />
    <circle cx="47" cy="22" r="6.5" fill="var(--a-rose)" />
    <path d="M37 38c0-6 4.5-9.5 10-9.5S57 32 57 38z" fill="var(--a-rose)" opacity=".8" />
    <rect x="26" y="16" width="12" height="16" rx="2.5" fill="var(--a-paper)" />
    <path d="M29 21h6M29 25h6" stroke="var(--a-ink-2)" strokeWidth="1.8" strokeLinecap="round" />
  </>
);

const report: Art = () => (
  <>
    <Ground rx={16} />
    <path d="M14 10h24l12 12v28a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" fill="var(--a-paper)" />
    <path d="M38 10l12 12H38z" fill="var(--a-paper-2)" />
    <path d="M18 28h22M18 35h22M18 42h14" stroke="var(--a-ink-2)" strokeWidth="2.6" strokeLinecap="round" opacity=".6" />
  </>
);

const schedule: Art = () => (
  <>
    <Ground rx={18} />
    <rect x="10" y="14" width="44" height="36" rx="5" fill="var(--a-paper)" />
    <rect x="10" y="14" width="44" height="9" rx="5" fill="var(--a-violet)" />
    <rect x="17" y="29" width="8" height="7" rx="2" fill="var(--a-paper-2)" />
    <rect x="28" y="29" width="8" height="7" rx="2" fill="var(--a-violet-l)" />
    <rect x="39" y="29" width="8" height="7" rx="2" fill="var(--a-paper-2)" />
    <rect x="17" y="39" width="8" height="7" rx="2" fill="var(--a-paper-2)" />
    <rect x="28" y="39" width="8" height="7" rx="2" fill="var(--a-paper-2)" />
  </>
);

const deadline: Art = () => (
  <>
    <Ground rx={16} />
    <path d="M22 8h20v6l-10 10L22 14V8z" fill="var(--a-rose)" />
    <path d="M22 50h20v-6L32 34 22 44v6z" fill="var(--a-rose)" />
    <path d="M18 6h28M18 52h28" stroke="var(--a-ink-2)" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M26 44l6-6 6 6z" fill="var(--a-gold)" />
  </>
);

const research: Art = () => (
  <>
    <Ground rx={16} />
    <circle cx="28" cy="27" r="15" fill="none" stroke="var(--a-teal)" strokeWidth="5" />
    <circle cx="28" cy="27" r="11" fill="var(--a-blue-l)" opacity=".5" />
    <path d="M39 38l12 12" stroke="var(--a-ink-2)" strokeWidth="6" strokeLinecap="round" />
  </>
);

const increase: Art = () => (
  <>
    <path d="M8 52h48" stroke="var(--a-ink-2)" strokeWidth="3" strokeLinecap="round" opacity=".4" />
    <rect x="12" y="36" width="9" height="14" rx="2" fill="var(--a-green-l)" />
    <rect x="27" y="26" width="9" height="24" rx="2" fill="var(--a-green)" />
    <rect x="42" y="14" width="9" height="36" rx="2" fill="var(--a-green)" />
    <path d="M14 26l12-10 10 8 14-14" stroke="var(--a-gold)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const reduce: Art = () => (
  <>
    <path d="M8 52h48" stroke="var(--a-ink-2)" strokeWidth="3" strokeLinecap="round" opacity=".4" />
    <rect x="12" y="14" width="9" height="36" rx="2" fill="var(--a-rose)" opacity=".5" />
    <rect x="27" y="26" width="9" height="24" rx="2" fill="var(--a-rose)" opacity=".75" />
    <rect x="42" y="38" width="9" height="12" rx="2" fill="var(--a-rose)" />
    <path d="M14 16l12 12 10-8 14 14" stroke="var(--a-ink-2)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const survey: Art = () => (
  <>
    <Ground rx={16} />
    <rect x="14" y="8" width="36" height="44" rx="4" fill="var(--a-paper)" />
    <rect x="24" y="4" width="16" height="8" rx="3" fill="var(--a-ink-2)" />
    <path d="M21 22l3 3 6-6" stroke="var(--a-green)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 34l3 3 6-6" stroke="var(--a-green)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 23h10M34 35h10" stroke="var(--a-ink-2)" strokeWidth="2.6" strokeLinecap="round" opacity=".55" />
  </>
);

export const PICTOGRAMS: Record<string, Art> = {
  coffee, tea, water, milk, bread, sugar, cup, hot, dinner,
  man, woman, boy, girl, friend, teacher, family, book,
  house, kitchen, room, clean, cook,
  morning, tonight, weekend, late, meet,
  station, ticket, bus, map, street, left, right,
  flight, luggage, passport, refund,
  meeting, report, schedule, deadline,
  research, increase, reduce, survey,
};

export const hasArt = (key: string) => key in PICTOGRAMS;

export function Pictogram({ name, size = 72 }: { name: string; size?: number }) {
  const draw = PICTOGRAMS[name];
  if (!draw) return null;
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      {draw()}
    </svg>
  );
}
