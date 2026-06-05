import type { Nav } from "../nav";
import { mentors } from "../data/content";
import { careerById } from "../data/careers";
import { Avatar, Badge, VerifiedName } from "../components/ui";

export function MentorDetail({ nav, id }: { nav: Nav; id: string }) {
  const m = mentors.find((x) => x.id === id);
  if (!m) return <main className="screen"><p className="empty">Mentor not found.</p></main>;
  const career = careerById(m.careerId);

  return (
    <main className="screen" style={{ padding: 0, paddingBottom: 14 }}>
      <div className="subhead">
        <button className="back-btn" onClick={nav.back} aria-label="Back">‹</button>
        <b>Mentor profile</b>
      </div>

      <div className="card-pad" style={{ background: "#fff", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Avatar name={m.name} color={m.avatarColor} size="lg" />
        </div>
        <div style={{ marginTop: 10, justifyContent: "center" }} className="row">
          <VerifiedName name={m.name} verified={m.verified} />
        </div>
        <div className="subtle" style={{ marginTop: 2 }}>{m.role} · {m.org}</div>
        <div className="row wrap" style={{ gap: 6, marginTop: 10, justifyContent: "center" }}>
          <Badge kind="verified">✓ Verified &amp; background-checked</Badge>
          <Badge kind="safe">{m.yearsExperience} yrs experience</Badge>
        </div>
      </div>

      <div className="section-title">About</div>
      <div className="card card-pad">
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{m.bio}</p>
      </div>

      <div className="section-title">Can help you with</div>
      <div className="card card-pad">
        {m.helpsWith.map((h) => (
          <div key={h} className="roi-line">
            <span>✅ {h}</span>
          </div>
        ))}
      </div>

      <div className="section-title">How mentoring works here</div>
      <div className="card card-pad">
        <div className="roi-line"><span>Format</span><b>{m.format}</b></div>
        <div className="roi-line"><span>Typical response</span><b>{m.responseTime}</b></div>
        <div className="roi-line"><span>Field</span><b>{career?.title}</b></div>
      </div>

      <div className="safety-banner" style={{ marginTop: 10 }}>
        <span className="ico">🛡️</span>
        <p>
          Messages are filtered for safety and shared with your guardian. A mentor
          will <b>never</b> ask for your address, money, or to chat off-app. Tap
          <b> Report</b> in any chat if something feels off.
        </p>
      </div>

      <div style={{ padding: "12px", display: "flex", gap: 10 }}>
        <button
          className="btn primary full"
          onClick={() => {
            nav.toast("✅ Connection request sent — guardian notified");
            nav.goTab("network");
          }}
        >
          🤝 Request to connect
        </button>
        <button
          className="btn ghost"
          style={{ flexShrink: 0 }}
          onClick={() => nav.toast("🚩 Reported to Trust & Safety")}
        >
          🚩
        </button>
      </div>
    </main>
  );
}
