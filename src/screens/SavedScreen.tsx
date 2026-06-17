import type { Nav } from "../nav";
import { useUser } from "../user";
import { careerById } from "../data/careers";
import { jobs } from "../data/content";
import { Badge, money } from "../components/ui";

export function SavedScreen({ nav }: { nav: Nav }) {
  const { user, toggleSaved } = useUser();
  const savedCareers = user.savedCareers.map(careerById).filter(Boolean);
  const savedJobs = jobs.filter((j) => user.savedJobs.includes(j.id));
  const nothing = savedCareers.length === 0 && savedJobs.length === 0;

  return (
    <main className="screen" style={{ padding: 0, paddingBottom: 14 }}>
      <div className="subhead">
        <button className="back-btn" onClick={nav.back} aria-label="Back">‹</button>
        <b>Saved</b>
      </div>

      {nothing && (
        <p className="empty">
          🔖 Nothing saved yet.
          <br />
          Tap the bookmark on a career or job to keep it here.
        </p>
      )}

      {savedCareers.length > 0 && (
        <>
          <div className="section-title">Saved careers</div>
          {savedCareers.map(
            (c) =>
              c && (
                <div key={c.id} className="list-row">
                  <button
                    onClick={() => nav.go({ name: "career", id: c.id })}
                    style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, border: "none", background: "none", textAlign: "left", padding: 0 }}
                  >
                    <span className="ico" style={{ fontSize: 22 }}>{c.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div className="name" style={{ fontSize: 14 }}>{c.title}</div>
                      <div className="subtle">{c.category}</div>
                    </div>
                    <Badge kind="safe">{money(c.salary.median)}/yr</Badge>
                  </button>
                  <button
                    className="back-btn"
                    style={{ marginLeft: 8 }}
                    onClick={() => toggleSaved("career", c.id)}
                    aria-label="Remove"
                  >
                    🔖
                  </button>
                </div>
              ),
          )}
        </>
      )}

      {savedJobs.length > 0 && (
        <>
          <div className="section-title">Saved jobs</div>
          {savedJobs.map((j) => (
            <div key={j.id} className="list-row">
              <button
                onClick={() => nav.goTab("jobs")}
                style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, border: "none", background: "none", textAlign: "left", padding: 0 }}
              >
                <span className="ico" style={{ fontSize: 20 }}>
                  {careerById(j.careerId)?.emoji ?? "💼"}
                </span>
                <div style={{ flex: 1 }}>
                  <div className="name" style={{ fontSize: 14 }}>{j.title}</div>
                  <div className="subtle">{j.org} · {j.payRange}</div>
                </div>
              </button>
              <button
                className="back-btn"
                style={{ marginLeft: 8 }}
                onClick={() => toggleSaved("job", j.id)}
                aria-label="Remove"
              >
                🔖
              </button>
            </div>
          ))}
        </>
      )}
    </main>
  );
}
