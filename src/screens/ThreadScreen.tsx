import { useState } from "react";
import type { Nav } from "../nav";
import { conversations } from "../data/content";
import type { Message } from "../data/types";
import { Avatar, VerifiedName } from "../components/ui";

/**
 * A lightweight youth-safety filter. In a real app this runs server-side with
 * ML moderation; here it demonstrates the safeguard by catching the most common
 * unsafe patterns (contact info, requests to meet, money, moving off-platform).
 */
function safetyCheck(text: string): { blocked: boolean; reason?: string } {
  const t = text.toLowerCase();
  const phone = /(\+?\d[\d\s().-]{7,}\d)/;
  const address = /\b\d{1,5}\s+[a-z0-9.\s]+\b(st|street|ave|avenue|rd|road|blvd|lane|ln|dr|drive)\b/i;
  const email = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/;
  const offApp = /\b(whatsapp|snapchat|snap|instagram|insta|telegram|discord|text me|dm me|my number|my cell)\b/;
  const meet = /\b(meet up|meet in person|come over|my house|pick you up|address)\b/;
  const money = /\b(venmo|cashapp|cash app|zelle|paypal|gift card|wire( me)?|send money)\b/;

  if (phone.test(text)) return { blocked: true, reason: "phone numbers" };
  if (email.test(text)) return { blocked: true, reason: "email addresses" };
  if (address.test(text)) return { blocked: true, reason: "home addresses" };
  if (offApp.test(t)) return { blocked: true, reason: "moving the chat off LinkedUp" };
  if (meet.test(t)) return { blocked: true, reason: "meeting in person" };
  if (money.test(t)) return { blocked: true, reason: "money or payments" };
  return { blocked: false };
}

export function ThreadScreen({ nav, id }: { nav: Nav; id: string }) {
  const conv = conversations.find((c) => c.id === id);
  const [messages, setMessages] = useState<Message[]>(conv?.messages ?? []);
  const [draft, setDraft] = useState("");
  const [warning, setWarning] = useState<string | null>(null);

  if (!conv) return <main className="screen"><p className="empty">Conversation not found.</p></main>;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const check = safetyCheck(text);
    if (check.blocked) {
      setWarning(
        `🛡️ Held for your safety: messages can't include ${check.reason}. You never need to share that here.`,
      );
      return;
    }
    setWarning(null);
    setMessages((m) => [
      ...m,
      {
        id: `local-${Date.now()}`,
        fromMe: true,
        text,
        time: "Just now",
      },
    ]);
    setDraft("");
    nav.toast("Sent · copy shared with guardian");
  };

  return (
    <main className="screen" style={{ padding: 0, display: "flex", flexDirection: "column" }}>
      <div className="subhead">
        <button className="back-btn" onClick={nav.back} aria-label="Back">‹</button>
        <Avatar name={conv.withName} color={conv.avatarColor} size="sm" />
        <div style={{ flex: 1 }}>
          <VerifiedName name={conv.withName} verified={conv.verified} />
          <div className="subtle">{conv.withRole}</div>
        </div>
        <button className="back-btn" onClick={() => nav.toast("🚩 Reported · 🚫 Blocked")} aria-label="Report">
          🚩
        </button>
      </div>

      {conv.guardianMonitored && (
        <div className="guardian-bar">
          👁️ Guardian-monitored chat · {`a copy goes to your guardian`}
        </div>
      )}

      <div className="thread" style={{ flex: 1, overflowY: "auto" }}>
        <div className="flag-note">
          🔒 You're protected. Don't share your address, school, phone, or money.
        </div>
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.fromMe ? "me" : "them"}`}>
            {m.text}
            <span className="time">{m.time}</span>
          </div>
        ))}
        {warning && <div className="flag-note" style={{ alignSelf: "stretch" }}>{warning}</div>}
      </div>

      <div className="composer">
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (warning) setWarning(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Write a safe message…"
        />
        <button className="btn primary" onClick={send}>Send</button>
      </div>
    </main>
  );
}
