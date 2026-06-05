import type { Nav } from "../nav";
import { mentors } from "../data/content";
import { careerById } from "../data/careers";
import { Avatar, Badge, SafetyBanner, VerifiedName } from "../components/ui";

export function MentorsScreen({ nav }: { nav: Nav }) {
  return (
    <main className="screen">
      <div className="screen-head">
        <h1>Find a mentor</h1>
        <p>Real professionals who volunteer to guide students. Connect for free.</p>
      </div>

      <SafetyBanner>
        Every mentor is <b>identity-verified and background-checked</b>. Conversations
        are filtered for safety and a guardian can review them. Mentors can never ask
        to meet in person or move you off LinkedUp.
      </SafetyBanner>

      {mentors.map((m) => {
        const career = careerById(m.careerId);
        return (
          <article key={m.id} className="card card-pad">
            <div className="row">
              <Avatar name={m.name} color={m.avatarColor} />
              <div style={{ flex: 1 }}>
                <VerifiedName name={m.name} verified={m.verified} />
                <div className="subtle">{m.role} · {m.org}</div>
              </div>
            </div>
            <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
              <Badge kind="verified">✓ Verified mentor</Badge>
              {career && <Badge kind="tag">{career.emoji} {career.title}</Badge>}
              <Badge kind="safe">{m.format}</Badge>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: "10px 0 0", color: "var(--ink)" }}>
              {m.bio}
            </p>
            <div className="row spread" style={{ marginTop: 12 }}>
              <span className="subtle">⏱ {m.responseTime}</span>
              <button className="btn primary sm" onClick={() => nav.go({ name: "mentor", id: m.id })}>
                View &amp; connect
              </button>
            </div>
          </article>
        );
      })}
    </main>
  );
}
