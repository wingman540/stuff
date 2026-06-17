import type { Nav } from "../nav";
import { useUser } from "../user";
import { activityFeed, pendingApprovals } from "../data/community";
import { Badge } from "../components/ui";

export function GuardianScreen({ nav }: { nav: Nav }) {
  const { user, setApproval } = useUser();

  const decided = pendingApprovals.filter((a) => user.approvals[a.id]);
  const pending = pendingApprovals.filter((a) => !user.approvals[a.id]);

  return (
    <main className="screen" style={{ padding: 0, paddingBottom: 14 }}>
      <div className="subhead">
        <button className="back-btn" onClick={nav.back} aria-label="Back">‹</button>
        <b>Guardian dashboard</b>
      </div>

      <div className="card-pad" style={{ background: "#fff" }}>
        <div className="row">
          <span style={{ fontSize: 30 }}>👁️</span>
          <div>
            <div className="name">{user.guardianName || "Guardian"}</div>
            <div className="subtle">Overseeing {user.name}'s account · Age {user.ageBand}</div>
          </div>
        </div>
        {!user.isMinor && (
          <div className="safety-banner" style={{ margin: "12px 0 0" }}>
            <span className="ico">ℹ️</span>
            <p>This account is 18+, so guardian oversight is optional and currently informational only.</p>
          </div>
        )}
      </div>

      <div className="section-title">
        Pending approvals {pending.length > 0 && `(${pending.length})`}
      </div>
      {pending.length === 0 && <p className="empty" style={{ padding: "20px" }}>Nothing waiting 🎉</p>}
      {pending.map((a) => (
        <div key={a.id} className="card card-pad">
          <div className="row spread">
            <Badge kind="tag">
              {a.kind === "connection" ? "🤝 Connection" : a.kind === "application" ? "💼 Application" : "📅 Session"}
            </Badge>
            <span className="subtle">{a.timeAgo}</span>
          </div>
          <div className="name" style={{ fontSize: 14, marginTop: 8 }}>{a.who}</div>
          <div className="subtle" style={{ marginTop: 2 }}>{a.detail}</div>
          <div className="row" style={{ gap: 8, marginTop: 12 }}>
            <button
              className="btn primary sm"
              style={{ flex: 1 }}
              onClick={() => {
                setApproval(a.id, "approved");
                nav.toast("✅ Approved");
              }}
            >
              Approve
            </button>
            <button
              className="btn subtle sm"
              style={{ flex: 1 }}
              onClick={() => {
                setApproval(a.id, "denied");
                nav.toast("Declined");
              }}
            >
              Decline
            </button>
          </div>
        </div>
      ))}

      {decided.length > 0 && (
        <>
          <div className="section-title">Recently decided</div>
          {decided.map((a) => (
            <div key={a.id} className="list-row">
              <span className="ico">{user.approvals[a.id] === "approved" ? "✅" : "🚫"}</span>
              <div style={{ flex: 1 }}>
                <div className="name" style={{ fontSize: 13.5 }}>{a.who}</div>
                <div className="subtle">{a.detail}</div>
              </div>
              <Badge kind={user.approvals[a.id] === "approved" ? "safe" : "warn"}>
                {user.approvals[a.id] === "approved" ? "Approved" : "Declined"}
              </Badge>
            </div>
          ))}
        </>
      )}

      <div className="section-title">What's shared with you</div>
      <div className="card" style={{ overflow: "hidden" }}>
        <SharedRow icon="💬" label="Copies of all conversations" value="On" />
        <SharedRow icon="🤝" label="New mentor connections need approval" value="On" />
        <SharedRow icon="💼" label="Job applications need approval" value="On" />
        <SharedRow icon="🕓" label="Quiet hours (9pm–7am school nights)" value="On" />
        <SharedRow icon="📍" label="Location & contact info sharing" value="Blocked" warn />
      </div>

      <div className="section-title">Recent activity</div>
      <div className="card" style={{ overflow: "hidden" }}>
        {activityFeed.map((a) => (
          <div key={a.id} className="list-row">
            <span className="ico">{a.icon}</span>
            <div style={{ flex: 1 }}>
              <div className="subtle" style={{ color: "var(--ink)", fontSize: 13.5 }}>{a.text}</div>
            </div>
            <span className="subtle" style={{ flexShrink: 0 }}>{a.timeAgo}</span>
          </div>
        ))}
      </div>

      <p className="empty" style={{ paddingTop: 16 }}>
        🛡️ LinkedUp keeps {user.name.split(" ")[0]} safe — together with you.
      </p>
    </main>
  );
}

function SharedRow({
  icon,
  label,
  value,
  warn,
}: {
  icon: string;
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="list-row">
      <span className="ico">{icon}</span>
      <div style={{ flex: 1 }}>
        <div className="subtle" style={{ color: "var(--ink)", fontSize: 13.5 }}>{label}</div>
      </div>
      <Badge kind={warn ? "warn" : "safe"}>{value}</Badge>
    </div>
  );
}
