export interface Career {
  id: string;
  title: string;
  emoji: string;
  category: string;
  /** One-line plain-language description aimed at students. */
  blurb: string;
  /** Typical entry, median, and experienced annual salary (USD). */
  salary: { entry: number; median: number; experienced: number };
  /** Estimated lifetime earnings over a ~40 year career (USD). */
  lifetimeEarnings: number;
  /** Typical cost of training/education to enter the field (USD). */
  trainingCost: number;
  /** Plain-language path to get into the career. */
  trainingPath: string;
  /** Years of training/education typically required. */
  yearsOfTraining: number;
  /** Projected job growth label. */
  outlook: "Growing fast" | "Growing" | "Stable" | "Competitive";
  /** Day-in-the-life video info (placeholder media). */
  video: {
    creator: string;
    creatorRole: string;
    durationSec: number;
    accent: string; // gradient accent for the thumbnail
    likes: number;
  };
}

export interface Job {
  id: string;
  title: string;
  org: string;
  location: string;
  type: "Internship" | "Part-time" | "Apprenticeship" | "Summer" | "Volunteer" | "Entry-level";
  payRange: string;
  minAge: number;
  postedDaysAgo: number;
  careerId: string;
  tags: string[];
  /** Whether this employer is verified & background-checked for youth safety. */
  verifiedEmployer: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  org: string;
  careerId: string;
  bio: string;
  yearsExperience: number;
  avatarColor: string;
  /** Mentors are identity-verified and background-checked before joining. */
  verified: boolean;
  /** Topics they can help with. */
  helpsWith: string[];
  /** How they prefer to mentor. */
  format: "Messages" | "Group sessions" | "Video calls (monitored)";
  responseTime: string;
}

export interface SafeContact {
  id: string;
  org: string;
  department: string;
  /** A role/team contact, never a personal cell number. */
  contactName: string;
  contactRole: string;
  about: string;
  avatarColor: string;
  verified: boolean;
  acceptsStudents: boolean;
  topics: string[];
}

export interface FeedPost {
  id: string;
  author: string;
  authorRole: string;
  avatarColor: string;
  verified: boolean;
  timeAgo: string;
  body: string;
  tag?: string;
  likes: number;
  comments: number;
}

export interface Message {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
  /** Flagged by the safety filter (shown to user + guardian). */
  flagged?: boolean;
}

export interface Conversation {
  id: string;
  withName: string;
  withRole: string;
  avatarColor: string;
  verified: boolean;
  /** Guardian receives copies of this conversation if user is under 18. */
  guardianMonitored: boolean;
  lastActive: string;
  messages: Message[];
}
