import { useMemo, useState } from "react";
import type { Nav, Tab, View } from "./nav";
import { Avatar } from "./components/ui";
import { useUser } from "./user";
import { Onboarding } from "./screens/Onboarding";
import { SearchScreen } from "./screens/SearchScreen";
import { SavedScreen } from "./screens/SavedScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { JobsScreen } from "./screens/JobsScreen";
import { ExploreScreen } from "./screens/ExploreScreen";
import { MentorsScreen } from "./screens/MentorsScreen";
import { NetworkScreen } from "./screens/NetworkScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { CareerDetail } from "./screens/CareerDetail";
import { MentorDetail } from "./screens/MentorDetail";
import { ContactDetail } from "./screens/ContactDetail";
import { ThreadScreen } from "./screens/ThreadScreen";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "jobs", label: "Jobs", icon: "💼" },
  { id: "explore", label: "Explore", icon: "🧭" },
  { id: "mentors", label: "Mentors", icon: "🧑‍🏫" },
  { id: "network", label: "Network", icon: "🛡️" },
];

export default function App() {
  const { user } = useUser();
  const [view, setView] = useState<View>({ name: "tab", tab: "home" });
  const [, setHistory] = useState<View[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const nav: Nav = useMemo(
    () => ({
      view,
      go: (v) => {
        setHistory((h) => [...h, view]);
        setView(v);
      },
      goTab: (tab) => {
        setHistory([]);
        setView({ name: "tab", tab });
      },
      back: () => {
        setHistory((h) => {
          if (h.length === 0) {
            setView({ name: "tab", tab: "home" });
            return h;
          }
          const next = [...h];
          const prev = next.pop()!;
          setView(prev);
          return next;
        });
      },
      toast: (msg) => {
        setToastMsg(msg);
        window.clearTimeout((window as any).__t);
        (window as any).__t = window.setTimeout(() => setToastMsg(null), 2200);
      },
    }),
    [view],
  );

  const activeTab: Tab = view.name === "tab" ? view.tab : "home";

  if (!user.onboarded) {
    return (
      <div className="device-stage">
        <div className="device">
          <Onboarding />
        </div>
      </div>
    );
  }

  return (
    <div className="device-stage">
      <div className="device">
        <header className="appbar">
          <div className="wordmark">
            Linked<span>Up</span>
          </div>
          <button
            className="search"
            style={{ textAlign: "left", cursor: "pointer" }}
            onClick={() => nav.go({ name: "search" })}
          >
            Search careers, jobs, mentors…
          </button>
          <button
            className="avatar-btn"
            style={{
              border: "none",
              background: "none",
              padding: 0,
              borderRadius: "50%",
            }}
            onClick={() => nav.go({ name: "profile" })}
            aria-label="Your profile"
          >
            <Avatar name={user.name} color={user.avatarColor} size="sm" />
          </button>
        </header>

        <Screen nav={nav} />

        <nav className="tabbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab ${activeTab === t.id && view.name === "tab" ? "active" : ""}`}
              onClick={() => nav.goTab(t.id)}
            >
              <span className="tab-ico">{t.icon}</span>
              {t.label}
              {t.id === "network" && <span className="tab-dot">2</span>}
            </button>
          ))}
        </nav>

        {toastMsg && <div className="toast">{toastMsg}</div>}
      </div>
    </div>
  );
}

function Screen({ nav }: { nav: Nav }) {
  const { view } = nav;
  switch (view.name) {
    case "tab":
      switch (view.tab) {
        case "home":
          return <HomeScreen nav={nav} />;
        case "jobs":
          return <JobsScreen nav={nav} />;
        case "explore":
          return <ExploreScreen nav={nav} />;
        case "mentors":
          return <MentorsScreen nav={nav} />;
        case "network":
          return <NetworkScreen nav={nav} />;
      }
      break;
    case "career":
      return <CareerDetail nav={nav} id={view.id} />;
    case "mentor":
      return <MentorDetail nav={nav} id={view.id} />;
    case "contact":
      return <ContactDetail nav={nav} id={view.id} />;
    case "thread":
      return <ThreadScreen nav={nav} id={view.id} />;
    case "search":
      return <SearchScreen nav={nav} />;
    case "saved":
      return <SavedScreen nav={nav} />;
    case "profile":
      return <ProfileScreen nav={nav} />;
  }
  return null;
}
