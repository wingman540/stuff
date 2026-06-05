import { useState } from "react";
import type { Nav } from "../nav";
import { careers } from "../data/careers";
import { Badge, duration, fullMoney, money } from "../components/ui";
import type { Career } from "../data/types";

type Segment = "careers" | "watch" | "earnings";

export function ExploreScreen({ nav }: { nav: Nav }) {
  const [seg, setSeg] = useState<Segment>("careers");

  return (
    <main className="screen">
      <div className="screen-head">
        <h1>Explore careers</h1>
        <p>See what a job is really like, what it pays for life, and what it costs to get there.</p>
      </div>

      <div className="chips">
        <SegBtn id="careers" label="🧭 Careers" seg={seg} setSeg={setSeg} />
        <SegBtn id="watch" label="🎬 Day in the Life" seg={seg} setSeg={setSeg} />
        <SegBtn id="earnings" label="📊 Earnings" seg={seg} setSeg={setSeg} />
      </div>

      {seg === "careers" && <CareersGrid nav={nav} />}
      {seg === "watch" && <WatchFeed nav={nav} />}
      {seg === "earnings" && <EarningsDashboard nav={nav} />}
    </main>
  );
}

function SegBtn({
  id,
  label,
  seg,
  setSeg,
}: {
  id: Segment;
  label: string;
  seg: Segment;
  setSeg: (s: Segment) => void;
}) {
  return (
    <button className={`chip ${seg === id ? "active" : ""}`} onClick={() => setSeg(id)}>
      {label}
    </button>
  );
}

function CareersGrid({ nav }: { nav: Nav }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "4px 12px 12px" }}>
      {careers.map((c) => (
        <button
          key={c.id}
          className="card"
          style={{ margin: 0, padding: 14, textAlign: "left", border: "none" }}
          onClick={() => nav.go({ name: "career", id: c.id })}
        >
          <div style={{ fontSize: 30 }}>{c.emoji}</div>
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 6 }}>{c.title}</div>
          <div className="subtle" style={{ marginTop: 2 }}>{c.category}</div>
          <div style={{ marginTop: 8 }}>
            <Badge kind="safe">{money(c.salary.median)}/yr</Badge>
          </div>
        </button>
      ))}
    </div>
  );
}

function WatchFeed({ nav }: { nav: Nav }) {
  return (
    <>
      <p className="subtle" style={{ padding: "4px 16px 0", lineHeight: 1.4 }}>
        Real people share an honest look at their workday. All videos are reviewed
        by our Trust &amp; Safety team. 🎬
      </p>
      {careers.map((c) => (
        <article key={c.id} className="card" style={{ marginBottom: 12 }}>
          <button
            className="video-thumb"
            style={{
              width: "100%",
              border: "none",
              background: `linear-gradient(135deg, ${c.video.accent}, ${c.video.accent}bb)`,
            }}
            onClick={() => nav.go({ name: "career", id: c.id })}
          >
            <span className="vcareer">{c.emoji}</span>
            <span className="play" />
            <span className="duration">{duration(c.video.durationSec)}</span>
          </button>
          <div className="card-pad">
            <div className="name">A Day in the Life: {c.title}</div>
            <div className="subtle" style={{ marginTop: 3 }}>
              {c.video.creator} · {c.video.creatorRole}
            </div>
            <div className="row spread" style={{ marginTop: 10 }}>
              <span className="subtle">❤️ {c.video.likes.toLocaleString()} likes</span>
              <button
                className="btn ghost sm"
                onClick={() => nav.go({ name: "career", id: c.id })}
              >
                Watch &amp; learn
              </button>
            </div>
          </div>
        </article>
      ))}
    </>
  );
}

/** Earnings dashboard: compare lifetime earnings vs. training cost across careers. */
function EarningsDashboard({ nav }: { nav: Nav }) {
  const [sortBy, setSortBy] = useState<"earnings" | "cost" | "roi">("earnings");

  const ranked = [...careers].sort((a, b) => {
    if (sortBy === "earnings") return b.lifetimeEarnings - a.lifetimeEarnings;
    if (sortBy === "cost") return a.trainingCost - b.trainingCost;
    return roi(b) - roi(a);
  });

  const maxEarn = Math.max(...careers.map((c) => c.lifetimeEarnings));
  const maxCost = Math.max(...careers.map((c) => c.trainingCost));
  const avgEarn = Math.round(careers.reduce((s, c) => s + c.lifetimeEarnings, 0) / careers.length);
  const avgCost = Math.round(careers.reduce((s, c) => s + c.trainingCost, 0) / careers.length);

  return (
    <>
      <div className="metric-grid">
        <div className="metric">
          <div className="val">{money(avgEarn)}</div>
          <div className="lbl">Avg. lifetime earnings (~40 yrs)</div>
        </div>
        <div className="metric">
          <div className="val">{money(avgCost)}</div>
          <div className="lbl">Avg. cost to get trained</div>
        </div>
      </div>

      <div className="card card-pad">
        <div className="row spread">
          <b style={{ fontSize: 14 }}>Compare careers</b>
        </div>
        <div className="chips" style={{ padding: "10px 0 2px" }}>
          {(["earnings", "cost", "roi"] as const).map((s) => (
            <button
              key={s}
              className={`chip ${sortBy === s ? "active" : ""}`}
              onClick={() => setSortBy(s)}
            >
              {s === "earnings" ? "💰 Earnings" : s === "cost" ? "🎓 Lowest cost" : "📈 Best value"}
            </button>
          ))}
        </div>

        {ranked.map((c) => {
          const widthEarn = (c.lifetimeEarnings / maxEarn) * 100;
          const widthCost = (c.trainingCost / maxCost) * 100;
          return (
            <button
              key={c.id}
              onClick={() => nav.go({ name: "career", id: c.id })}
              style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "10px 0", borderTop: "1px solid var(--line)" }}
            >
              <div className="row spread">
                <span className="name" style={{ fontSize: 14 }}>
                  {c.emoji} {c.title}
                </span>
                <Badge kind="safe">{money(c.lifetimeEarnings)}</Badge>
              </div>
              <div className="bar-row" style={{ margin: "8px 0 0" }}>
                <div className="bar-top">
                  <span className="subtle">Lifetime earnings</span>
                  <b>{money(c.lifetimeEarnings)}</b>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${widthEarn}%` }} />
                </div>
              </div>
              <div className="bar-row" style={{ margin: "6px 0 0" }}>
                <div className="bar-top">
                  <span className="subtle">Training cost</span>
                  <b>{money(c.trainingCost)}</b>
                </div>
                <div className="bar-track">
                  <div className="bar-fill cost" style={{ width: `${widthCost}%` }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="subtle" style={{ padding: "4px 16px 16px", lineHeight: 1.5 }}>
        💡 Figures are rounded U.S. estimates for exploration, not guarantees.
        “Best value” compares a career’s lifetime earnings to its training cost.
        The highest-paying path isn’t always the best value — a{" "}
        {money(careers.find((c) => c.id === "welder")!.trainingCost)} welding
        certificate can out-earn a {fullMoney(95000)} degree per dollar spent.
      </p>
    </>
  );
}

function roi(c: Career): number {
  return c.lifetimeEarnings / Math.max(c.trainingCost, 1);
}
