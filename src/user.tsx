import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { currentUser as seed } from "./data/content";

export interface ResumeEntry {
  id: string;
  title: string;
  org: string;
  dates: string;
}

export interface Resume {
  headline: string;
  about: string;
  skills: string[];
  experience: ResumeEntry[];
  sharedWithEmployers: boolean;
}

export const emptyResume: Resume = {
  headline: "",
  about: "",
  skills: [],
  experience: [],
  sharedWithEmployers: false,
};

export interface User {
  onboarded: boolean;
  name: string;
  ageBand: string;
  isMinor: boolean;
  grade: string;
  school: string;
  interests: string[];
  guardianName: string;
  avatarColor: string;
  savedCareers: string[];
  savedJobs: string[];
  rsvpSessions: string[];
  readNotifications: string[];
  /** Guardian decisions on pending approvals, keyed by approval id. */
  approvals: Record<string, "approved" | "denied">;
  resume: Resume;
}

const KEY = "linkedup.user.v1";
const defaultUser: User = {
  onboarded: false,
  savedCareers: [],
  savedJobs: [],
  rsvpSessions: [],
  readNotifications: [],
  approvals: {},
  resume: emptyResume,
  ...seed,
};

type SaveKind = "career" | "job";

interface UserCtx {
  user: User;
  setUser: (patch: Partial<User>) => void;
  toggleSaved: (kind: SaveKind, id: string) => void;
  isSaved: (kind: SaveKind, id: string) => boolean;
  toggleRsvp: (sessionId: string) => void;
  markNotificationsRead: (ids: string[]) => void;
  setApproval: (id: string, decision: "approved" | "denied") => void;
  reset: () => void;
}

const Ctx = createContext<UserCtx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...defaultUser, ...(JSON.parse(raw) as Partial<User>) };
    } catch {
      /* ignore corrupt storage */
    }
    return defaultUser;
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(user));
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [user]);

  const setUser = (patch: Partial<User>) =>
    setUserState((u) => ({ ...u, ...patch }));

  const toggleSaved = (kind: SaveKind, id: string) =>
    setUserState((u) => {
      const key = kind === "career" ? "savedCareers" : "savedJobs";
      const list = u[key];
      const next = list.includes(id)
        ? list.filter((x) => x !== id)
        : [...list, id];
      return { ...u, [key]: next };
    });

  const isSaved = (kind: SaveKind, id: string) =>
    (kind === "career" ? user.savedCareers : user.savedJobs).includes(id);

  const toggleRsvp = (sessionId: string) =>
    setUserState((u) => ({
      ...u,
      rsvpSessions: u.rsvpSessions.includes(sessionId)
        ? u.rsvpSessions.filter((x) => x !== sessionId)
        : [...u.rsvpSessions, sessionId],
    }));

  const markNotificationsRead = (ids: string[]) =>
    setUserState((u) => ({
      ...u,
      readNotifications: Array.from(new Set([...u.readNotifications, ...ids])),
    }));

  const setApproval = (id: string, decision: "approved" | "denied") =>
    setUserState((u) => ({ ...u, approvals: { ...u.approvals, [id]: decision } }));

  const reset = () => setUserState(defaultUser);

  return (
    <Ctx.Provider
      value={{
        user,
        setUser,
        toggleSaved,
        isSaved,
        toggleRsvp,
        markNotificationsRead,
        setApproval,
        reset,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useUser(): UserCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUser must be used within <UserProvider>");
  return ctx;
}
