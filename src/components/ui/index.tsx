import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useEffect } from "react";

type Tone = "brand" | "ok" | "no" | "gold" | "ghost" | "quiet";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  block?: boolean;
  children: ReactNode;
}

const toneClass: Record<Tone, string> = {
  brand: "",
  ok: "btn--ok",
  no: "btn--no",
  gold: "btn--gold",
  ghost: "btn--ghost",
  quiet: "btn--quiet",
};

export function Button({
  tone = "brand",
  size = "md",
  block,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    "btn",
    toneClass[tone],
    size === "lg" ? "btn--lg" : size === "sm" ? "btn--sm" : "",
    block ? "btn--block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

export function Bar({
  value,
  max = 100,
  tone = "brand",
  thin,
  label,
}: {
  value: number;
  max?: number;
  tone?: "brand" | "gold" | "ok";
  thin?: boolean;
  label?: string;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div
      className={`bar ${tone === "gold" ? "bar--gold" : tone === "ok" ? "bar--ok" : ""} ${
        thin ? "bar--thin" : ""
      }`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="bar__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Chip({
  icon,
  children,
  tone,
  bare,
  title,
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: string;
  bare?: boolean;
  title?: string;
}) {
  return (
    <span className={`chip ${bare ? "chip--bare" : ""}`} style={{ color: tone }} title={title}>
      {icon}
      <span>{children}</span>
    </span>
  );
}

export function Modal({
  open,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  labelledBy?: string;
}) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="scrim" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function Ring({
  value,
  max,
  size = 44,
  stroke = 5,
  children,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <span className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--gold)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 400ms ease" }}
        />
      </svg>
      <span className="ring__label">{children}</span>
    </span>
  );
}
