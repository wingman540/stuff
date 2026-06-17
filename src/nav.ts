export type Tab = "home" | "jobs" | "explore" | "mentors" | "network";

export type View =
  | { name: "tab"; tab: Tab }
  | { name: "career"; id: string }
  | { name: "mentor"; id: string }
  | { name: "thread"; id: string }
  | { name: "contact"; id: string }
  | { name: "search" }
  | { name: "saved" }
  | { name: "notifications" }
  | { name: "resume" }
  | { name: "guardian" }
  | { name: "profile" };

export interface Nav {
  view: View;
  go: (view: View) => void;
  goTab: (tab: Tab) => void;
  back: () => void;
  toast: (msg: string) => void;
}
