import { useEffect, useRef, useState } from "react";
import type { Career } from "../data/types";
import { duration } from "./ui";

const CHAPTERS = [
  { at: 0, label: "Morning routine ☀️" },
  { at: 0.22, label: "Getting to work 🚗" },
  { at: 0.42, label: "The main job 🛠️" },
  { at: 0.68, label: "Teamwork & breaks 🤝" },
  { at: 0.86, label: "Wrapping up & pay 💵" },
];

/**
 * A self-contained, simulated "Day in the Life" player. There's no real video
 * file (this is a demo), so it animates a playback bar through labelled chapters
 * and shows a transcript line — conveying the feature without external media.
 */
export function VideoPlayer({ career, onClose }: { career: Career; onClose: () => void }) {
  const total = career.video.durationSec;
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const raf = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);

  useEffect(() => {
    const tick = (ts: number) => {
      if (lastTs.current != null) {
        const dt = (ts - lastTs.current) / 1000;
        // play at 8x so the demo finishes quickly
        setElapsed((e) => Math.min(total, e + dt * 8));
      }
      lastTs.current = ts;
      raf.current = requestAnimationFrame(tick);
    };
    if (playing) raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      lastTs.current = null;
    };
  }, [playing, total]);

  useEffect(() => {
    if (elapsed >= total) setPlaying(false);
  }, [elapsed, total]);

  const progress = total ? elapsed / total : 0;
  const chapter =
    [...CHAPTERS].reverse().find((c) => progress >= c.at) ?? CHAPTERS[0];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        color: "#fff",
      }}
    >
      <div className="row spread" style={{ padding: "14px 16px" }}>
        <span style={{ fontWeight: 700 }}>🎬 Day in the Life</span>
        <button
          onClick={onClose}
          style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "none", width: 34, height: 34, borderRadius: "50%", fontSize: 16 }}
          aria-label="Close player"
        >
          ✕
        </button>
      </div>

      {/* "video" stage */}
      <button
        onClick={() => (elapsed >= total ? (setElapsed(0), setPlaying(true)) : setPlaying((p) => !p))}
        style={{
          flex: 1,
          border: "none",
          background: `linear-gradient(135deg, ${career.video.accent}, ${career.video.accent}77)`,
          display: "grid",
          placeItems: "center",
          position: "relative",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 72 }}>{career.emoji}</div>
          <div style={{ fontWeight: 800, fontSize: 20, marginTop: 6 }}>{career.title}</div>
          <div style={{ opacity: 0.85, marginTop: 4 }}>{chapter.label}</div>
        </div>
        <div
          style={{
            position: "absolute",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.35)",
            display: "grid",
            placeItems: "center",
            fontSize: 26,
          }}
        >
          {elapsed >= total ? "↻" : playing ? "⏸" : "▶"}
        </div>
      </button>

      {/* controls */}
      <div style={{ padding: "14px 16px 18px" }}>
        <div style={{ height: 6, background: "rgba(255,255,255,0.25)", borderRadius: 999 }}>
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: "#fff",
              borderRadius: 999,
            }}
          />
        </div>
        <div className="row spread" style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>
          <span>{duration(Math.floor(elapsed))}</span>
          <span>{duration(total)}</span>
        </div>

        <div className="row" style={{ gap: 10, marginTop: 12 }}>
          <div className="avatar" style={{ background: career.video.accent }}>
            {career.video.creator.slice(0, 1)}
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{career.video.creator}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              {career.video.creatorRole} · ❤️ {career.video.likes.toLocaleString()}
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12.5, opacity: 0.85, lineHeight: 1.5, marginBottom: 0 }}>
          “{chapter.label.replace(/[^\w &]/g, "").trim()}” — {career.blurb}
        </p>
      </div>
    </div>
  );
}
