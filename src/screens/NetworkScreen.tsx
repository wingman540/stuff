import { useState } from "react";
import type { Nav } from "../nav";
import { conversations, safeContacts } from "../data/content";
import { Avatar, Badge, SafetyBanner, VerifiedName } from "../components/ui";

type Seg = "messages" | "contacts";

export function NetworkScreen({ nav }: { nav: Nav }) {
  const [seg, setSeg] = useState<Seg>("messages");

  return (
    <main className="screen">
      <div className="screen-head">
        <h1>Safe network</h1>
        <p>Message verified mentors and company HR teams — with safeguards built in.</p>
      </div>

      <div className="chips">
        <button className={`chip ${seg === "messages" ? "active" : ""}`} onClick={() => setSeg("messages")}>
          💬 Messages
        </button>
        <button className={`chip ${seg === "contacts" ? "active" : ""}`} onClick={() => setSeg("contacts")}>
          🏢 Safe contacts
        </button>
      </div>

      {seg === "messages" ? <Messages nav={nav} /> : <Contacts nav={nav} />}
    </main>
  );
}

function Messages({ nav }: { nav: Nav }) {
  return (
    <>
      <SafetyBanner>
        Chats with anyone under 18 are <b>monitored by a guardian</b> and scanned for
        unsafe content (personal info, requests to meet, money). You can block or
        report anyone instantly.
      </SafetyBanner>
      {conversations.map((c) => {
        const last = c.messages[c.messages.length - 1];
        return (
          <button
            key={c.id}
            className="conv-item"
            onClick={() => nav.go({ name: "thread", id: c.id })}
          >
            <Avatar name={c.withName} color={c.avatarColor} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row spread">
                <VerifiedName name={c.withName} verified={c.verified} />
                <span className="subtle" style={{ flexShrink: 0 }}>{c.lastActive}</span>
              </div>
              <div className="subtle">{c.withRole}</div>
              <div
                className="subtle"
                style={{
                  marginTop: 4,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "var(--ink)",
                }}
              >
                {last.fromMe ? "You: " : ""}
                {last.text}
              </div>
            </div>
          </button>
        );
      })}
    </>
  );
}

function Contacts({ nav }: { nav: Nav }) {
  return (
    <>
      <SafetyBanner>
        These are official <b>company team inboxes</b> (HR, recruiting, apprenticeship
        offices) — never a stranger's personal number. They've agreed to mentor
        students and follow LinkedUp's youth-safety rules.
      </SafetyBanner>
      {safeContacts.map((c) => (
        <article key={c.id} className="card card-pad">
          <div className="row">
            <Avatar name={c.org} color={c.avatarColor} />
            <div style={{ flex: 1 }}>
              <VerifiedName name={c.org} verified={c.verified} />
              <div className="subtle">{c.department}</div>
            </div>
          </div>
          <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
            <Badge kind="verified">✓ Verified org</Badge>
            {c.acceptsStudents && <Badge kind="safe">🎓 Welcomes students</Badge>}
            <Badge kind="tag">{c.contactRole}</Badge>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: "10px 0 0" }}>{c.about}</p>
          <div className="row spread" style={{ marginTop: 12 }}>
            <span className="subtle">{c.contactName}</span>
            <button className="btn primary sm" onClick={() => nav.go({ name: "contact", id: c.id })}>
              View &amp; message
            </button>
          </div>
        </article>
      ))}
    </>
  );
}
