import type { Nav } from "../nav";
import { Avatar, Badge, SafetyBanner, VerifiedName } from "../components/ui";
import { feedPosts } from "../data/content";
import { careers } from "../data/careers";
import { useUser } from "../user";

export function HomeScreen({ nav }: { nav: Nav }) {
  const { user } = useUser();
  const recommended = careers.filter((c) => user.interests.includes(c.id));

  return (
    <main className="screen">
      <SafetyBanner>
        <b>You're in a safe space.</b> Every mentor and employer here is
        identity-verified.{" "}
        {user.isMinor
          ? `${user.guardianName} (your guardian) can review your activity. `
          : ""}
        Tap anything to report it.
      </SafetyBanner>

      {/* Welcome + quick actions */}
      <div className="card card-pad">
        <div className="row">
          <Avatar name={user.name} color={user.avatarColor} />
          <div>
            <div className="name">Hi {user.name.split(" ")[0]} 👋</div>
            <div className="subtle">
              {user.grade} · Exploring {recommended.length} career
              {recommended.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
        <div className="row wrap" style={{ marginTop: 12, gap: 8 }}>
          <button className="btn primary sm" onClick={() => nav.goTab("jobs")}>
            💼 Find a job
          </button>
          <button className="btn ghost sm" onClick={() => nav.goTab("mentors")}>
            🧑‍🏫 Get a mentor
          </button>
          <button className="btn subtle sm" onClick={() => nav.goTab("explore")}>
            🧭 Explore careers
          </button>
        </div>
      </div>

      {/* Recommended careers carousel */}
      <div className="section-title">Careers you're exploring</div>
      <div className="chips" style={{ paddingBottom: 8 }}>
        {recommended.map((c) => (
          <button
            key={c.id}
            className="chip"
            style={{ minWidth: 150, textAlign: "left", padding: "10px 14px" }}
            onClick={() => nav.go({ name: "career", id: c.id })}
          >
            <div style={{ fontSize: 22 }}>{c.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>
              {c.title}
            </div>
            <div style={{ color: "var(--muted)", fontWeight: 500, marginTop: 2 }}>
              Median ${Math.round(c.salary.median / 1000)}K/yr
            </div>
          </button>
        ))}
      </div>

      <div className="divider" />

      {/* Feed */}
      <div className="section-title">Your feed</div>
      {feedPosts.map((p) => (
        <article key={p.id} className="card card-pad">
          <div className="row spread">
            <div className="row">
              <Avatar name={p.author} color={p.avatarColor} />
              <div>
                <VerifiedName name={p.author} verified={p.verified} />
                <div className="subtle">
                  {p.authorRole} · {p.timeAgo}
                </div>
              </div>
            </div>
            {p.tag && (
              <Badge kind={p.tag === "Safety" ? "safe" : "verified"}>{p.tag}</Badge>
            )}
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.5 }}>{p.body}</p>
          <div className="feed-actions">
            <button onClick={() => nav.toast("👍 Liked")}>👍 Like · {p.likes}</button>
            <button onClick={() => nav.toast("💬 Comments are moderated")}>
              💬 {p.comments}
            </button>
            <button onClick={() => nav.toast("🚩 Reported to Trust & Safety")}>
              🚩 Report
            </button>
          </div>
        </article>
      ))}

      <p className="empty">You're all caught up 🎉</p>
    </main>
  );
}
