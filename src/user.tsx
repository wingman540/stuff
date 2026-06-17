import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { currentUser as seed } from "./data/content";

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
}

const KEY = "linkedup.user.v1";
const defaultUser: User = {
  onboarded: false,
  savedCareers: [],
  savedJobs: [],
  ...seed,
};

type SaveKind = "career" | "job";

interface UserCtx {
  user: User;
  setUser: (patch: Partial<User>) => void;
  toggleSaved: (kind: SaveKind, id: string) => void;
  isSaved: (kind: SaveKind, id: string) => boolean;
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

  const reset = () => setUserState(defaultUser);

  return (
    <Ctx.Provider value={{ user, setUser, toggleSaved, isSaved, reset }}>
      {children}
    </Ctx.Provider>
  );
}

export function useUser(): UserCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUser must be used within <UserProvider>");
  return ctx;
}
