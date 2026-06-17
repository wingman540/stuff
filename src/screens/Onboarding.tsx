import { useState } from "react";
import { useUser } from "../user";
import { careers } from "../data/careers";
import { money } from "../components/ui";

const AGE_BANDS: { id: string; label: string; note: string; minor: boolean }[] = [
  { id: "13–15", label: "13–15", note: "Guardian approval + full chat monitoring", minor: true },
  { id: "16–17", label: "16–17", note: "Guardian monitoring + safe-message filter", minor: true },
  { id: "18+", label: "18 or older", note: "Standard safety filters", minor: false },
];

export function Onboarding() {
  const { setUser } = useUser();
  const [step, setStep] = useState(0);
  const [ageBand, setAgeBand] = useState<string | null>(null);
  const [guardianName, setGuardianName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const isMinor = AGE_BANDS.find((a) => a.id === ageBand)?.minor ?? false;
  const lastStep = isMinor ? 3 : 2;

  const toggle = (id: string) =>
    setInterests((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );

  const finish = () =>
    setUser({
      onboarded: true,
      ageBand: ageBand ?? "18+",
      isMinor,
      interests,
      guardianName: guardianName.trim() || (isMinor ? "Your guardian" : ""),
    });

  return (
    <main className="screen" style={{ paddingBottom: 0 }}>
      {/* progress dots */}
      <div className="row" style={{ justifyContent: "center", gap: 7, padding: "16px 0 4px" }}>
        {Array.from({ length: lastStep + 1 }).map((_, i) => (
          <span
            key={i}
            style={{
              width: i === step ? 22 : 8,
              height: 8,
              borderRadius: 999,
              background: i <= step ? "var(--brand)" : "var(--line)",
              transition: "all .2s",
            }}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="card-pad" style={{ textAlign: "center", paddingTop: 24 }}>
          <div style={{ fontSize: 60 }}>🪜</div>
          <h1 style={{ fontSize: 28, margin: "8px 0 0", letterSpacing: "-0.5px" }}>
            Welcome to Linked<span style={{ color: "var(--brand)" }}>Up</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.5, margin: "12px 8px 0" }}>
            The safe career network for students. Explore real careers, find first
            jobs, and connect with verified mentors — all with safeguards built for
            young people.
          </p>
          <div style={{ textAlign: "left", margin: "20px 6px 0", display: "grid", gap: 12 }}>
            <Feature emoji="🎬" title="See the real thing" sub="“Day in the Life” videos for every career" />
            <Feature emoji="📊" title="Know before you go" sub="Compare lifetime pay vs. cost of training" />
            <Feature emoji="🛡️" title="Stay safe" sub="Verified mentors and monitored, filtered chats" />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="card-pad">
          <h1 style={{ fontSize: 23, margin: "8px 0 4px" }}>How old are you?</h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 0 }}>
            This sets your safety protections. We keep it private.
          </p>
          <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
            {AGE_BANDS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAgeBand(a.id)}
                className="card"
                style={{
                  margin: 0,
                  padding: 16,
                  textAlign: "left",
                  border: `2px solid ${ageBand === a.id ? "var(--brand)" : "transparent"}`,
                }}
              >
                <div className="row spread">
                  <b style={{ fontSize: 16 }}>{a.label}</b>
                  <span style={{ fontSize: 18 }}>{ageBand === a.id ? "🔵" : "⚪"}</span>
                </div>
                <div className="subtle" style={{ marginTop: 4 }}>🛡️ {a.note}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && isMinor && (
        <div className="card-pad">
          <h1 style={{ fontSize: 23, margin: "8px 0 4px" }}>Add a guardian</h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 0, lineHeight: 1.5 }}>
            Because you're under 18, a parent or guardian can review your chats and
            approve new connections. Enter their name (a real app would email them to
            confirm).
          </p>
          <input
            className="composer-input"
            value={guardianName}
            onChange={(e) => setGuardianName(e.target.value)}
            placeholder="Guardian's name"
            style={{
              width: "100%",
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: "13px 14px",
              fontSize: 15,
              marginTop: 6,
              outline: "none",
            }}
          />
          <div className="safety-banner" style={{ margin: "16px 0 0" }}>
            <span className="ico">👁️</span>
            <p>
              Your guardian gets a copy of conversations and a heads-up when you
              apply to a job or connect with a mentor. You can see exactly what's
              shared anytime in Settings.
            </p>
          </div>
        </div>
      )}

      {step === lastStep && (
        <div className="card-pad">
          <h1 style={{ fontSize: 23, margin: "8px 0 4px" }}>What interests you?</h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 0 }}>
            Pick a few careers to explore. You can change these later.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
            {careers.map((c) => {
              const on = interests.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className="card"
                  style={{
                    margin: 0,
                    padding: 12,
                    textAlign: "left",
                    border: `2px solid ${on ? "var(--brand)" : "transparent"}`,
                    background: on ? "var(--brand-soft)" : "#fff",
                  }}
                >
                  <div className="row spread">
                    <span style={{ fontSize: 24 }}>{c.emoji}</span>
                    <span>{on ? "✅" : "➕"}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6 }}>{c.title}</div>
                  <div className="subtle">{money(c.salary.median)}/yr</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* sticky footer nav */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "var(--bg)",
          padding: "12px",
          display: "flex",
          gap: 10,
          borderTop: "1px solid var(--line)",
        }}
      >
        {step > 0 && (
          <button className="btn subtle" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        )}
        {step < lastStep ? (
          <button
            className="btn primary full"
            disabled={step === 1 && !ageBand}
            style={{ opacity: step === 1 && !ageBand ? 0.5 : 1 }}
            onClick={() => setStep((s) => s + 1)}
          >
            Continue
          </button>
        ) : (
          <button
            className="btn primary full"
            disabled={interests.length === 0}
            style={{ opacity: interests.length === 0 ? 0.5 : 1 }}
            onClick={finish}
          >
            {interests.length === 0
              ? "Pick at least one"
              : `Start exploring (${interests.length})`}
          </button>
        )}
      </div>
    </main>
  );
}

function Feature({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
  return (
    <div className="row" style={{ gap: 12 }}>
      <span style={{ fontSize: 24 }}>{emoji}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        <div className="subtle">{sub}</div>
      </div>
    </div>
  );
}
