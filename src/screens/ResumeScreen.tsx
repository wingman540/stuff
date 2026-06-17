import { useState, type CSSProperties } from "react";
import type { Nav } from "../nav";
import { useUser, type Resume, type ResumeEntry } from "../user";
import { careerById } from "../data/careers";
import { Badge } from "../components/ui";

const field: CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "11px 12px",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
};

export function ResumeScreen({ nav }: { nav: Nav }) {
  const { user, setUser } = useUser();
  const [draft, setDraft] = useState<Resume>(user.resume);
  const [skillInput, setSkillInput] = useState("");

  const patch = (p: Partial<Resume>) => setDraft((d) => ({ ...d, ...p }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !draft.skills.includes(s)) patch({ skills: [...draft.skills, s] });
    setSkillInput("");
  };

  const addExperience = () =>
    patch({
      experience: [
        ...draft.experience,
        { id: `e-${Date.now()}`, title: "", org: "", dates: "" },
      ],
    });

  const updateExp = (id: string, p: Partial<ResumeEntry>) =>
    patch({
      experience: draft.experience.map((e) => (e.id === id ? { ...e, ...p } : e)),
    });

  const removeExp = (id: string) =>
    patch({ experience: draft.experience.filter((e) => e.id !== id) });

  const save = () => {
    setUser({ resume: draft });
    nav.toast("💾 Profile saved");
  };

  const suggestedSkills = user.interests
    .map((i) => careerById(i)?.title)
    .filter(Boolean) as string[];

  return (
    <main className="screen" style={{ padding: 0, paddingBottom: 90 }}>
      <div className="subhead">
        <button className="back-btn" onClick={nav.back} aria-label="Back">‹</button>
        <b style={{ flex: 1 }}>Profile / résumé builder</b>
      </div>

      <div className="card card-pad">
        <p className="subtle" style={{ margin: 0, lineHeight: 1.5 }}>
          Build a simple profile you can share with verified employers. No address or
          phone needed — keep it about your goals, skills, and experience. 📄
        </p>
      </div>

      <div className="section-title">Headline</div>
      <div className="card card-pad">
        <input
          style={field}
          value={draft.headline}
          onChange={(e) => patch({ headline: e.target.value })}
          placeholder="e.g. 11th grader exploring UX design & coding"
        />
      </div>

      <div className="section-title">About you</div>
      <div className="card card-pad">
        <textarea
          style={{ ...field, minHeight: 90, resize: "vertical" }}
          value={draft.about}
          onChange={(e) => patch({ about: e.target.value })}
          placeholder="A few sentences about what you're interested in and what you're looking for."
        />
      </div>

      <div className="section-title">Skills</div>
      <div className="card card-pad">
        <div className="row" style={{ gap: 8 }}>
          <input
            style={field}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            placeholder="Add a skill (e.g. Teamwork, Figma)"
          />
          <button className="btn primary sm" onClick={addSkill} style={{ flexShrink: 0 }}>
            Add
          </button>
        </div>
        {draft.skills.length > 0 && (
          <div style={{ marginTop: 10 }}>
            {draft.skills.map((s) => (
              <button
                key={s}
                className="pill"
                style={{ border: "none", cursor: "pointer" }}
                onClick={() => patch({ skills: draft.skills.filter((x) => x !== s) })}
                title="Tap to remove"
              >
                {s} ✕
              </button>
            ))}
          </div>
        )}
        {suggestedSkills.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div className="subtle" style={{ marginBottom: 4 }}>Suggested from your interests:</div>
            {suggestedSkills.map((s) => (
              <button
                key={s}
                className="chip"
                style={{ marginRight: 6, marginBottom: 6 }}
                onClick={() => !draft.skills.includes(s) && patch({ skills: [...draft.skills, s] })}
              >
                + {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="section-title">Experience &amp; activities</div>
      {draft.experience.map((e) => (
        <div key={e.id} className="card card-pad">
          <input
            style={{ ...field, marginBottom: 8 }}
            value={e.title}
            onChange={(ev) => updateExp(e.id, { title: ev.target.value })}
            placeholder="Role / activity (e.g. Volunteer, Club president)"
          />
          <input
            style={{ ...field, marginBottom: 8 }}
            value={e.org}
            onChange={(ev) => updateExp(e.id, { org: ev.target.value })}
            placeholder="Where (e.g. Animal shelter, Robotics club)"
          />
          <div className="row" style={{ gap: 8 }}>
            <input
              style={field}
              value={e.dates}
              onChange={(ev) => updateExp(e.id, { dates: ev.target.value })}
              placeholder="When (e.g. Summer 2025)"
            />
            <button className="btn subtle sm" onClick={() => removeExp(e.id)} style={{ flexShrink: 0 }}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <div style={{ padding: "0 12px" }}>
        <button className="btn ghost full" onClick={addExperience}>
          ＋ Add experience
        </button>
      </div>

      <div className="section-title">Sharing</div>
      <div className="card card-pad">
        <div className="row spread">
          <div style={{ flex: 1 }}>
            <div className="name" style={{ fontSize: 14 }}>Share with verified employers</div>
            <div className="subtle">Only background-checked, verified orgs can view it.</div>
          </div>
          <button
            className={draft.sharedWithEmployers ? "btn primary sm" : "btn subtle sm"}
            onClick={() => patch({ sharedWithEmployers: !draft.sharedWithEmployers })}
          >
            {draft.sharedWithEmployers ? "On" : "Off"}
          </button>
        </div>
        {draft.sharedWithEmployers && (
          <div style={{ marginTop: 8 }}>
            <Badge kind="safe">🛡️ Contact info stays hidden until you reply</Badge>
          </div>
        )}
      </div>

      {/* sticky save bar */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "var(--bg)",
          borderTop: "1px solid var(--line)",
          padding: 12,
        }}
      >
        <button className="btn primary full" onClick={save}>
          💾 Save profile
        </button>
      </div>
    </main>
  );
}
