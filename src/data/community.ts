import type {
  ActivityItem,
  Approval,
  GroupSession,
  Notification,
} from "./types";

export const groupSessions: GroupSession[] = [
  {
    id: "s1",
    mentorId: "m2",
    title: "Breaking into tech without a CS degree",
    topic: "Software Engineer",
    dateLabel: "Sat, Jun 21",
    time: "11:00 AM",
    seatsTotal: 25,
    seatsLeft: 6,
    format: "Group video (monitored)",
  },
  {
    id: "s2",
    mentorId: "m4",
    title: "Build your first design portfolio (live)",
    topic: "UX Designer",
    dateLabel: "Tue, Jun 24",
    time: "5:30 PM",
    seatsTotal: 20,
    seatsLeft: 11,
    format: "Group video (monitored)",
  },
  {
    id: "s3",
    mentorId: "m3",
    title: "How paid apprenticeships actually work",
    topic: "Skilled Trades",
    dateLabel: "Thu, Jun 26",
    time: "4:00 PM",
    seatsTotal: 30,
    seatsLeft: 18,
    format: "Group chat",
  },
  {
    id: "s4",
    mentorId: "m1",
    title: "Is nursing right for me? Ask an ER nurse",
    topic: "Registered Nurse",
    dateLabel: "Mon, Jun 30",
    time: "6:00 PM",
    seatsTotal: 25,
    seatsLeft: 3,
    format: "Group video (monitored)",
  },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    kind: "application",
    icon: "✅",
    title: "Application update",
    body: "BrightByte Studios viewed your application for Junior Web Dev Intern.",
    timeAgo: "1h",
  },
  {
    id: "n2",
    kind: "mentor",
    icon: "💬",
    title: "Maya R. replied",
    body: "“Yes please! Let me help you find a volunteer spot…”",
    timeAgo: "3h",
  },
  {
    id: "n3",
    kind: "session",
    icon: "📅",
    title: "Session starting soon",
    body: "“Breaking into tech without a CS degree” is this Saturday. 6 seats left.",
    timeAgo: "5h",
  },
  {
    id: "n4",
    kind: "job",
    icon: "💼",
    title: "New job match",
    body: "3 new internships match your interest in UX Design.",
    timeAgo: "1d",
  },
  {
    id: "n5",
    kind: "safety",
    icon: "🛡️",
    title: "Safety tip",
    body: "Remember: verified mentors will never ask to chat off LinkedUp.",
    timeAgo: "2d",
  },
];

/** Items a guardian must approve before they take effect (for minors). */
export const pendingApprovals: Approval[] = [
  {
    id: "a1",
    kind: "connection",
    who: "Carlos M. · Master Electrician",
    detail: "wants to connect as a mentor",
    timeAgo: "2h",
  },
  {
    id: "a2",
    kind: "application",
    who: "Northstar Creative",
    detail: "Design Studio Summer Apprentice — application ready to send",
    timeAgo: "6h",
  },
  {
    id: "a3",
    kind: "session",
    who: "“Is nursing right for me?” with Maya R.",
    detail: "RSVP needs guardian approval",
    timeAgo: "1d",
  },
];

export const activityFeed: ActivityItem[] = [
  { id: "ac1", icon: "💬", text: "Messaged Maya R. (ER Nurse) — chat shared with guardian", timeAgo: "1d" },
  { id: "ac2", icon: "💼", text: "Started application to BrightByte Studios", timeAgo: "1d" },
  { id: "ac3", icon: "🎬", text: "Watched “A Day in the Life: Software Engineer”", timeAgo: "2d" },
  { id: "ac4", icon: "🔖", text: "Saved Welder and UX Designer careers", timeAgo: "3d" },
];
