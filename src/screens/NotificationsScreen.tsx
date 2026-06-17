import { useEffect } from "react";
import type { Nav } from "../nav";
import { notifications } from "../data/community";
import { useUser } from "../user";
import type { Notification } from "../data/types";

export function NotificationsScreen({ nav }: { nav: Nav }) {
  const { user, markNotificationsRead } = useUser();

  // Opening the screen marks everything read.
  useEffect(() => {
    const unread = notifications.filter((n) => !user.readNotifications.includes(n.id));
    if (unread.length) markNotificationsRead(unread.map((n) => n.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (n: Notification) => {
    if (n.kind === "mentor") nav.goTab("network");
    else if (n.kind === "job" || n.kind === "application") nav.goTab("jobs");
    else if (n.kind === "session") nav.goTab("mentors");
    else nav.toast("🛡️ Stay safe out there!");
  };

  return (
    <main className="screen" style={{ padding: 0, paddingBottom: 14 }}>
      <div className="subhead">
        <button className="back-btn" onClick={nav.back} aria-label="Back">‹</button>
        <b>Notifications</b>
      </div>

      {notifications.map((n) => {
        const wasUnread = !user.readNotifications.includes(n.id);
        return (
          <button
            key={n.id}
            className="list-row"
            style={{
              width: "100%",
              textAlign: "left",
              border: "none",
              borderBottom: "1px solid var(--line)",
              background: wasUnread ? "var(--brand-soft)" : "#fff",
            }}
            onClick={() => go(n)}
          >
            <span className="ico" style={{ fontSize: 20 }}>{n.icon}</span>
            <div style={{ flex: 1 }}>
              <div className="name" style={{ fontSize: 14 }}>{n.title}</div>
              <div className="subtle" style={{ marginTop: 2 }}>{n.body}</div>
            </div>
            <span className="subtle" style={{ flexShrink: 0 }}>{n.timeAgo}</span>
          </button>
        );
      })}

      <p className="empty">That's everything 🎉</p>
    </main>
  );
}
