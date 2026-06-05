import type { Nav } from "../nav";
import { safeContacts } from "../data/content";
import { Avatar, Badge, VerifiedName } from "../components/ui";

export function ContactDetail({ nav, id }: { nav: Nav; id: string }) {
  const c = safeContacts.find((x) => x.id === id);
  if (!c) return <main className="screen"><p className="empty">Contact not found.</p></main>;

  return (
    <main className="screen" style={{ padding: 0, paddingBottom: 14 }}>
      <div className="subhead">
        <button className="back-btn" onClick={nav.back} aria-label="Back">‹</button>
        <b>Verified contact</b>
      </div>

      <div className="card-pad" style={{ background: "#fff", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Avatar name={c.org} color={c.avatarColor} size="lg" />
        </div>
        <div className="row" style={{ marginTop: 10, justifyContent: "center" }}>
          <VerifiedName name={c.org} verified={c.verified} />
        </div>
        <div className="subtle" style={{ marginTop: 2 }}>{c.department}</div>
        <div className="row wrap" style={{ gap: 6, marginTop: 10, justifyContent: "center" }}>
          <Badge kind="verified">✓ Verified organization</Badge>
          <Badge kind="safe">🎓 Welcomes students</Badge>
        </div>
      </div>

      <div className="section-title">About this team</div>
      <div className="card card-pad">
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{c.about}</p>
        <div style={{ marginTop: 10 }}>
          <div className="subtle">You'll be messaging:</div>
          <div className="name" style={{ marginTop: 2 }}>{c.contactName}</div>
          <div className="subtle">{c.contactRole}</div>
        </div>
      </div>

      <div className="section-title">Good things to ask</div>
      <div className="card card-pad">
        {c.topics.map((t) => (
          <div key={t} className="roi-line"><span>💬 {t}</span></div>
        ))}
      </div>

      <div className="safety-banner" style={{ marginTop: 10 }}>
        <span className="ico">🛡️</span>
        <p>
          This is a monitored <b>team inbox</b>, not a personal contact. Keep your
          address, phone, and schedule private — you never need them to apply. A
          guardian sees these messages too.
        </p>
      </div>

      <div style={{ padding: "12px" }}>
        <button
          className="btn primary full"
          onClick={() => nav.toast("✉️ Safe message started — guardian notified")}
        >
          ✉️ Send a safe message
        </button>
      </div>
    </main>
  );
}
