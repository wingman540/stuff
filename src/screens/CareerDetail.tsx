import type { Nav } from "../nav";
import { careerById } from "../data/careers";
import { jobs, mentors } from "../data/content";
import { Avatar, Badge, VerifiedName, duration, fullMoney, money } from "../components/ui";

export function CareerDetail({ nav, id }: { nav: Nav; id: string }) {
  const c = careerById(id);
  if (!c) return <main className="screen"><p className="empty">Career not found.</p></main>;

  const relatedMentors = mentors.filter((m) => m.careerId === c.id);
  const relatedJobs = jobs.filter((j) => j.careerId === c.id);
  const netLifetime = c.lifetimeEarnings - c.trainingCost;

  return (
    <main className="screen" style={{ padding: 0, paddingBottom: 14 }}>
      <div className="subhead">
        <button className="back-btn" onClick={nav.back} aria-label="Back">‹</button>
        <b>Career profile</b>
      </div>

      {/* Day in the life video */}
      <div
        className="video-thumb"
        style={{
          height: 220,
          background: `linear-gradient(135deg, ${c.video.accent}, ${c.video.accent}aa)`,
        }}
      >
        <span className="vcareer" style={{ fontSize: 40 }}>{c.emoji}</span>
        <button
          className="play"
          onClick={() => nav.toast("▶️ Playing Day-in-the-Life (demo)")}
          style={{ border: "none" }}
          aria-label="Play video"
        />
        <span className="duration">{duration(c.video.durationSec)}</span>
      </div>

      <div className="card-pad" style={{ background: "#fff" }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>
          {c.emoji} {c.title}
        </h1>
        <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
          <Badge kind="tag">{c.category}</Badge>
          <Badge kind={c.outlook === "Competitive" ? "warn" : "safe"}>📈 {c.outlook}</Badge>
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.5, marginBottom: 0 }}>{c.blurb}</p>
        <div className="subtle" style={{ marginTop: 6 }}>
          🎬 “A Day in the Life” by {c.video.creator}, {c.video.creatorRole} ·
          ❤️ {c.video.likes.toLocaleString()}
        </div>
      </div>

      {/* Pay overview */}
      <div className="section-title">What it pays</div>
      <div className="metric-grid">
        <div className="metric">
          <div className="val">{money(c.salary.entry)}</div>
          <div className="lbl">Starting salary / yr</div>
        </div>
        <div className="metric">
          <div className="val">{money(c.salary.median)}</div>
          <div className="lbl">Median salary / yr</div>
        </div>
        <div className="metric">
          <div className="val">{money(c.salary.experienced)}</div>
          <div className="lbl">Experienced / yr</div>
        </div>
        <div className="metric">
          <div className="val">{money(c.lifetimeEarnings)}</div>
          <div className="lbl">Lifetime earnings (~40 yrs)</div>
        </div>
      </div>

      {/* Cost & ROI */}
      <div className="section-title">What it costs to get there</div>
      <div className="card card-pad">
        <div className="row spread">
          <div>
            <div className="name">{c.trainingPath}</div>
            <div className="subtle" style={{ marginTop: 4 }}>
              ⏳ ~{c.yearsOfTraining} year{c.yearsOfTraining === 1 ? "" : "s"} of training
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="roi-line">
            <span>Lifetime earnings</span>
            <b className="pos">+{fullMoney(c.lifetimeEarnings)}</b>
          </div>
          <div className="roi-line">
            <span>Training cost</span>
            <b style={{ color: "var(--warn)" }}>−{fullMoney(c.trainingCost)}</b>
          </div>
          <div className="roi-line">
            <span>
              <b>Net lifetime value</b>
            </span>
            <b className="pos">{fullMoney(netLifetime)}</b>
          </div>
        </div>
        <p className="subtle" style={{ marginTop: 10, marginBottom: 0, lineHeight: 1.45 }}>
          Every $1 spent on training returns about{" "}
          <b style={{ color: "var(--safe)" }}>
            ${Math.round(c.lifetimeEarnings / c.trainingCost)}
          </b>{" "}
          over a career. Estimates only.
        </p>
      </div>

      {/* Mentors */}
      {relatedMentors.length > 0 && (
        <>
          <div className="section-title">Mentors in this field</div>
          {relatedMentors.map((m) => (
            <button
              key={m.id}
              className="list-row"
              style={{ width: "100%", textAlign: "left", border: "none", borderBottom: "1px solid var(--line)" }}
              onClick={() => nav.go({ name: "mentor", id: m.id })}
            >
              <Avatar name={m.name} color={m.avatarColor} size="sm" />
              <div>
                <VerifiedName name={m.name} verified={m.verified} />
                <div className="subtle">{m.role} · {m.org}</div>
              </div>
              <span className="chev">›</span>
            </button>
          ))}
        </>
      )}

      {/* Jobs */}
      {relatedJobs.length > 0 && (
        <>
          <div className="section-title">Open opportunities</div>
          {relatedJobs.map((j) => (
            <div key={j.id} className="card card-pad">
              <div className="name">{j.title}</div>
              <div className="subtle">{j.org} · {j.location}</div>
              <div className="row spread" style={{ marginTop: 10 }}>
                <Badge kind="safe">💵 {j.payRange}</Badge>
                <button className="btn primary sm" onClick={() => nav.goTab("jobs")}>
                  View in Jobs
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <div style={{ padding: "16px 12px" }}>
        <button
          className="btn primary full"
          onClick={() =>
            relatedMentors[0]
              ? nav.go({ name: "mentor", id: relatedMentors[0].id })
              : nav.goTab("mentors")
          }
        >
          🧑‍🏫 Connect with a mentor in {c.title}
        </button>
      </div>
    </main>
  );
}
