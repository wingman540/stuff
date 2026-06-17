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
}

const KEY = "linkedup.user.v1";
const defaultUser: User = { onboarded: false, ...seed };

interface UserCtx {
  user: User;
  setUser: (patch: Partial<User>) => void;
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
  const reset = () => setUserState(defaultUser);

  return <Ctx.Provider value={{ user, setUser, reset }}>{children}</Ctx.Provider>;
}

export function useUser(): UserCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUser must be used within <UserProvider>");
  return ctx;
}
