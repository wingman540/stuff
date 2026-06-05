import type { ReactNode } from "react";

export function initials(name: string): string {
  const parts = name.replace(/[^a-zA-Z ]/g, "").trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  color,
  size = "",
  emoji,
}: {
  name: string;
  color: string;
  size?: "sm" | "lg" | "";
  emoji?: string;
}) {
  return (
    <div className={`avatar ${size}`} style={{ background: color }}>
      {emoji ?? initials(name)}
    </div>
  );
}

export function VerifiedName({
  name,
  verified,
}: {
  name: string;
  verified: boolean;
}) {
  return (
    <span className="name">
      {name}
      {verified && (
        <span className="verify-tick" title="Identity verified">
          ✓
        </span>
      )}
    </span>
  );
}

export function Badge({
  kind,
  children,
}: {
  kind: "verified" | "safe" | "warn" | "tag";
  children: ReactNode;
}) {
  return <span className={`badge ${kind}`}>{children}</span>;
}

export function SafetyBanner({ children }: { children: ReactNode }) {
  return (
    <div className="safety-banner">
      <span className="ico">🛡️</span>
      <p>{children}</p>
    </div>
  );
}

/** Compact money formatter: 3400000 -> "$3.4M", 45000 -> "$45K". */
export function money(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export function fullMoney(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export function duration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
