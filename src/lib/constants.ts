export const COLORS = {
  background: "#0B0F1A",
  surface: "#131A2B",
  surfaceBorder: "#1E2A3F",
  primary: "#00D4FF",
  active: "#FFB800",
  visited: "#1A3A5C",
  textPrimary: "#FFFFFF",
  textSecondary: "#8899AA",
} as const;

export const SPEEDS = [0.25, 0.5, 1, 2, 5] as const;

export const DEFAULT_SPEED = 1;

export const NODE_SIZE = 0.8;

export const SPACING = 1.5;

export const DIFFICULTY_COLORS = {
  Easy: "#00B8A3",
  Medium: "#FFC01E",
  Hard: "#FF375F",
} as const;

export const PATTERNS = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked Lists",
  "Trees",
  "Tries",
  "Heap / Priority Queue",
  "Backtracking",
  "Graphs",
  "Dynamic Programming (1D)",
  "Dynamic Programming (2D)",
  "Greedy",
  "Intervals",
  "Bit Manipulation",
  "Math & Geometry",
] as const;

export const PROBLEM_LISTS = [
  "Blind 75",
  "NeetCode 150",
  "Grind 75",
] as const;
