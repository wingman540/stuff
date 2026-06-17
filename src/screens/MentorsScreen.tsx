import { useState } from "react";
import type { Nav } from "../nav";
import { mentors } from "../data/content";
import { groupSessions } from "../data/community";
import { careerById } from "../data/careers";
import { Avatar, Badge, SafetyBanner, VerifiedName } from "../components/ui";
import { useUser } from "../user";

export function MentorsScreen({ nav }: { nav: Nav }) {
  const [seg, setSeg] = useState<"mentors" | "sessions">("mentors");

  return (
    <main className="screen">
      <div className="screen-head">
        <h1>Mentors &amp; sessions</h1>
        <p>Real professionals who volunteer to guide students. Connect for free.</p>
      </div>

      <div className="chips">
        <button className={`chip ${seg === "mentors" ? "active" : ""}`} onClick={() => setSeg("mentors")}>
          🧑‍🏫 Mentors
        </button>
        <button className={`chip ${seg === "sessions" ? "active" : ""}`} onClick={() => setSeg("sessions")}>
          📅 Group sessions
        </button>
      </div>

      {seg === "mentors" ? <MentorList nav={nav} /> : <SessionList nav={nav} />}
    </main>
  );
}

function MentorList({ nav }: { nav: Nav }) {
  return (
    <>
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
    </>
  );
}

function SessionList({ nav }: { nav: Nav }) {
  const { user, toggleRsvp } = useUser();

  return (
    <>
      <SafetyBanner>
        Sessions are always <b>group</b> and monitored — never one-on-one video.
        {user.isMinor ? " RSVPs for students under 18 are confirmed by a guardian." : ""}
      </SafetyBanner>

      {groupSessions.map((s) => {
        const mentor = mentors.find((m) => m.id === s.mentorId);
        const career = careerById(mentor?.careerId ?? "");
        const going = user.rsvpSessions.includes(s.id);
        const seatsLeft = Math.max(0, s.seatsLeft - (going ? 1 : 0));
        const almostFull = seatsLeft <= 5;
        return (
          <article key={s.id} className="card card-pad">
            <div className="row spread">
              <div className="row">
                <div className="avatar" style={{ background: career?.video.accent ?? "#0a66c2" }}>
                  {career?.emoji ?? "📅"}
                </div>
                <div>
                  <div className="name" style={{ fontSize: 14.5 }}>{s.title}</div>
                  <div className="subtle">with {mentor?.name ?? "a mentor"} · {mentor?.role}</div>
                </div>
              </div>
            </div>

            <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
              <Badge kind="verified">🗓 {s.dateLabel} · {s.time}</Badge>
              <Badge kind="tag">{s.format}</Badge>
              <Badge kind={almostFull ? "warn" : "safe"}>
                {seatsLeft === 0 ? "Full" : `${seatsLeft} seats left`}
              </Badge>
            </div>

            <div className="row spread" style={{ marginTop: 12 }}>
              <button className="btn subtle sm" onClick={() => mentor && nav.go({ name: "mentor", id: mentor.id })}>
                About host
              </button>
              <button
                className={going ? "btn ghost sm" : "btn primary sm"}
                onClick={() => {
                  toggleRsvp(s.id);
                  nav.toast(
                    going
                      ? "RSVP cancelled"
                      : user.isMinor
                        ? "✅ RSVP sent for guardian approval"
                        : "✅ You're on the list!",
                  );
                }}
              >
                {going ? "✓ Going · Cancel" : "RSVP"}
              </button>
            </div>
          </article>
        );
      })}
    </>
  );
}
