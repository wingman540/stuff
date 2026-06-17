import type { Nav } from "../nav";
import { careerById } from "../data/careers";
import { Avatar, Badge } from "../components/ui";
import { useUser } from "../user";

export function ProfileScreen({ nav }: { nav: Nav }) {
  const { user, reset } = useUser();
  const interests = user.interests.map(careerById).filter(Boolean);

  return (
    <main className="screen" style={{ padding: 0, paddingBottom: 14 }}>
      <div className="subhead">
        <button className="back-btn" onClick={nav.back} aria-label="Back">‹</button>
        <b>Your profile</b>
      </div>

      <div className="profile-cover" />
      <div className="profile-card">
        <Avatar name={user.name} color={user.avatarColor} size="lg" />
        <h1 style={{ margin: "8px 0 0", fontSize: 20 }}>{user.name}</h1>
        <div className="subtle">{user.grade} · {user.school}</div>
        <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
          <Badge kind="safe">
            🛡️ {user.isMinor ? "Student" : "Adult"} account · Age {user.ageBand}
          </Badge>
          <Badge kind="verified">✓ School-verified</Badge>
        </div>
      </div>

      <div className="section-title">Interested in</div>
      <div className="card card-pad">
        <div className="row wrap" style={{ gap: 8 }}>
          {interests.map(
            (c) =>
              c && (
                <button
                  key={c.id}
                  className="pill"
                  style={{ border: "none", cursor: "pointer" }}
                  onClick={() => nav.go({ name: "career", id: c.id })}
                >
                  {c.emoji} {c.title}
                </button>
              ),
          )}
        </div>
      </div>

      <div className="section-title">Safety &amp; guardian controls</div>
      <div className="card" style={{ overflow: "hidden" }}>
        {user.isMinor && (
          <Row icon="👁️" title="Guardian oversight" sub={`${user.guardianName} reviews chats & approvals`} value="On" onClick={nav} />
        )}
        <Row icon="🔒" title="Safe-message filter" sub="Blocks personal info, money & meet-ups" value="On" onClick={nav} />
        <Row icon="✅" title="Verified-only contacts" sub="Only background-checked adults can reach you" value="On" onClick={nav} />
        <Row icon="🚫" title="Blocked & reported" sub="Manage who can't contact you" value="0" onClick={nav} />
        <Row icon="🕓" title="Quiet hours" sub="No messages 9pm–7am on school nights" value="On" onClick={nav} />
      </div>

      <div className="section-title">Your activity</div>
      <div className="card" style={{ overflow: "hidden" }}>
        <Row
          icon="🔖"
          title="Saved"
          sub="Careers & jobs you bookmarked"
          value={String(user.savedCareers.length + user.savedJobs.length)}
          onClick={nav}
          go={() => nav.go({ name: "saved" })}
        />
        <Row icon="💼" title="Applications" sub="Jobs you've applied to" value="3" onClick={nav} go={() => nav.goTab("jobs")} />
        <Row icon="🧑‍🏫" title="Mentor connections" sub="Mentors you're chatting with" value="1" onClick={nav} go={() => nav.goTab("network")} />
        <Row icon="🎬" title="Careers explored" sub="Day-in-the-life videos watched" value="7" onClick={nav} go={() => nav.goTab("explore")} />
      </div>

      <div style={{ padding: 12 }}>
        <button className="btn subtle full" onClick={reset}>
          Log out &amp; restart onboarding
        </button>
      </div>
      <p className="empty" style={{ paddingTop: 6 }}>
        LinkedUp · Careers start here · Built for students
      </p>
    </main>
  );
}

function Row({
  icon,
  title,
  sub,
  value,
  onClick,
  go,
}: {
  icon: string;
  title: string;
  sub: string;
  value: string;
  onClick: Nav;
  go?: () => void;
}) {
  return (
    <button
      className="list-row"
      style={{ width: "100%", textAlign: "left", border: "none", borderBottom: "1px solid var(--line)" }}
      onClick={() => (go ? go() : onClick.toast(`${title}: ${value}`))}
    >
      <span className="ico">{icon}</span>
      <div style={{ flex: 1 }}>
        <div className="name" style={{ fontSize: 14 }}>{title}</div>
        <div className="subtle">{sub}</div>
      </div>
      <Badge kind={value === "On" ? "safe" : "tag"}>{value}</Badge>
      <span className="chev">›</span>
    </button>
  );
}
