import { useMemo, useState } from "react";
import type { Nav } from "../nav";
import { careers, careerById } from "../data/careers";
import { jobs, mentors } from "../data/content";
import { Avatar, Badge, VerifiedName, money } from "../components/ui";

export function SearchScreen({ nav }: { nav: Nav }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return null;
    const has = (s: string) => s.toLowerCase().includes(query);
    return {
      careers: careers.filter(
        (c) => has(c.title) || has(c.category) || has(c.blurb),
      ),
      jobs: jobs.filter(
        (j) => has(j.title) || has(j.org) || has(j.type) || j.tags.some(has),
      ),
      mentors: mentors.filter(
        (m) => has(m.name) || has(m.role) || has(m.org) || m.helpsWith.some(has),
      ),
    };
  }, [query]);

  const suggestions = ["Nurse", "Trades", "Remote", "Design", "Apprenticeship", "Tech"];
  const empty =
    results &&
    results.careers.length === 0 &&
    results.jobs.length === 0 &&
    results.mentors.length === 0;

  return (
    <main className="screen" style={{ padding: 0 }}>
      <div className="subhead">
        <button className="back-btn" onClick={nav.back} aria-label="Back">‹</button>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search careers, jobs, mentors…"
          style={{
            flex: 1,
            border: "1px solid var(--line)",
            borderRadius: 999,
            padding: "10px 14px",
            fontSize: 14,
            outline: "none",
          }}
        />
        {q && (
          <button className="back-btn" onClick={() => setQ("")} aria-label="Clear">✕</button>
        )}
      </div>

      {!results && (
        <div className="card-pad">
          <div className="section-title" style={{ padding: "4px 0" }}>Try searching</div>
          <div className="row wrap" style={{ gap: 8 }}>
            {suggestions.map((s) => (
              <button key={s} className="chip" onClick={() => setQ(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {empty && <p className="empty">No matches for “{q}”. Try another word.</p>}

      {results && results.careers.length > 0 && (
        <>
          <div className="section-title">Careers</div>
          {results.careers.map((c) => (
            <button
              key={c.id}
              className="list-row"
              style={{ width: "100%", textAlign: "left", border: "none", borderBottom: "1px solid var(--line)" }}
              onClick={() => nav.go({ name: "career", id: c.id })}
            >
              <span className="ico" style={{ fontSize: 22 }}>{c.emoji}</span>
              <div style={{ flex: 1 }}>
                <div className="name" style={{ fontSize: 14 }}>{c.title}</div>
                <div className="subtle">{c.category}</div>
              </div>
              <Badge kind="safe">{money(c.salary.median)}/yr</Badge>
            </button>
          ))}
        </>
      )}

      {results && results.jobs.length > 0 && (
        <>
          <div className="section-title">Jobs</div>
          {results.jobs.map((j) => (
            <button
              key={j.id}
              className="list-row"
              style={{ width: "100%", textAlign: "left", border: "none", borderBottom: "1px solid var(--line)" }}
              onClick={() => nav.goTab("jobs")}
            >
              <span className="ico" style={{ fontSize: 20 }}>{careerById(j.careerId)?.emoji ?? "💼"}</span>
              <div style={{ flex: 1 }}>
                <div className="name" style={{ fontSize: 14 }}>{j.title}</div>
                <div className="subtle">{j.org} · {j.type}</div>
              </div>
              <span className="chev">›</span>
            </button>
          ))}
        </>
      )}

      {results && results.mentors.length > 0 && (
        <>
          <div className="section-title">Mentors</div>
          {results.mentors.map((m) => (
            <button
              key={m.id}
              className="list-row"
              style={{ width: "100%", textAlign: "left", border: "none", borderBottom: "1px solid var(--line)" }}
              onClick={() => nav.go({ name: "mentor", id: m.id })}
            >
              <Avatar name={m.name} color={m.avatarColor} size="sm" />
              <div style={{ flex: 1 }}>
                <VerifiedName name={m.name} verified={m.verified} />
                <div className="subtle">{m.role} · {m.org}</div>
              </div>
              <span className="chev">›</span>
            </button>
          ))}
        </>
      )}
    </main>
  );
}
