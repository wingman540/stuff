import { useState } from "react";
import type { Nav } from "../nav";
import { Badge, SafetyBanner } from "../components/ui";
import { jobs } from "../data/content";
import { careerById } from "../data/careers";
import type { Job } from "../data/types";

const TYPES: (Job["type"] | "All")[] = [
  "All",
  "Internship",
  "Part-time",
  "Apprenticeship",
  "Summer",
  "Volunteer",
];

export function JobsScreen({ nav }: { nav: Nav }) {
  const [filter, setFilter] = useState<(typeof TYPES)[number]>("All");
  const shown = jobs.filter((j) => filter === "All" || j.type === filter);

  return (
    <main className="screen">
      <div className="screen-head">
        <h1>Jobs & opportunities</h1>
        <p>
          First jobs, internships, and paid apprenticeships from verified,
          youth-friendly employers.
        </p>
      </div>

      <SafetyBanner>
        Every employer is <b>background-checked &amp; verified</b>. Listings show a
        minimum age and never ask for payment. Apply with one tap — your contact
        info stays private until you choose to share it.
      </SafetyBanner>

      <div className="chips">
        {TYPES.map((t) => (
          <button
            key={t}
            className={`chip ${filter === t ? "active" : ""}`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {shown.map((j) => {
        const career = careerById(j.careerId);
        return (
          <article key={j.id} className="card card-pad">
            <div className="row spread">
              <div className="row">
                <div className="avatar" style={{ background: career?.video.accent ?? "#0a66c2" }}>
                  {career?.emoji ?? "💼"}
                </div>
                <div>
                  <div className="name">{j.title}</div>
                  <div className="subtle">
                    {j.org} · {j.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="row wrap" style={{ marginTop: 10, gap: 6 }}>
              <Badge kind="tag">{j.type}</Badge>
              <Badge kind="safe">💵 {j.payRange}</Badge>
              {j.verifiedEmployer && <Badge kind="verified">✓ Verified employer</Badge>}
              <Badge kind="warn">Ages {j.minAge}+</Badge>
            </div>

            <div style={{ marginTop: 8 }}>
              {j.tags.map((t) => (
                <span key={t} className="pill">
                  {t}
                </span>
              ))}
            </div>

            <div className="row spread" style={{ marginTop: 12 }}>
              <span className="subtle">Posted {j.postedDaysAgo}d ago</span>
              <div className="row" style={{ gap: 8 }}>
                <button
                  className="btn subtle sm"
                  onClick={() => career && nav.go({ name: "career", id: career.id })}
                >
                  About career
                </button>
                <button
                  className="btn primary sm"
                  onClick={() => nav.toast("✅ Application started — guardian notified")}
                >
                  Easy apply
                </button>
              </div>
            </div>
          </article>
        );
      })}

      {shown.length === 0 && <p className="empty">No {filter} roles right now.</p>}
    </main>
  );
}
