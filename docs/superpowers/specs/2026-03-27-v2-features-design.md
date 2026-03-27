# AlgoVision 3D V2 — Design Spec

## Overview

Expand AlgoVision 3D from a 6-algorithm visualizer into a full LeetCode study companion with a problem browser (~150-200 curated problems), pattern-based study guides, and a daily progress tracker with spaced repetition.

## New Features

1. **Problem Browser** — searchable/filterable table of ~150-200 curated LeetCode problems with metadata, approach summaries, pattern hints, and links to 3D visualizations where available
2. **Resources** — 15 study guides covering every major algorithm pattern, with explanations, code templates, related problems, and curated external links
3. **Daily Tracker** — progress dashboard with streak tracking, calendar heatmap, spaced repetition suggestions, difficulty breakdowns, stored in localStorage (designed for future Supabase swap)
4. **Top-level Navigation** — nav links in the top bar for Visualize, Problems, Resources, Tracker

## Navigation & Routing

### Top Bar Update

```
[AlgoVision 3D]    Visualize | Problems | Resources | Tracker
```

- "Visualize" links to `/` (home)
- Active route highlighted in cyan
- On mobile: hamburger menu or horizontal scroll

### New Routes

| Route | Purpose |
|---|---|
| `/problems` | Problem browser with search/filter/sort |
| `/resources` | Study guides index (sidebar + content) |
| `/resources/[slug]` | Individual study guide |
| `/tracker` | Progress dashboard |

Existing routes unchanged:
- `/` — home (hero + algorithm card grid)
- `/visualizer/[slug]` — algorithm visualizer

## Problems Page (`/problems`)

### Data Model

```ts
interface Problem {
  id: number;                // LeetCode problem number
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];            // e.g. ["Array", "Two Pointers"]
  pattern: string;           // primary pattern e.g. "Sliding Window"
  url: string;               // https://leetcode.com/problems/...
  summary: string;           // 1-2 sentence approach description (our words)
  hints: string[];           // 2-3 approach/pattern hints
  visualizerSlug?: string;   // links to our visualizer if available
  listMembership: string[];  // e.g. ["Blind 75", "NeetCode 150"]
}
```

### Layout

- **Search bar** at top — instant filter by title or number
- **Filter row** below — difficulty pills (Easy/Medium/Hard), pattern dropdown, list filter (Blind 75, NeetCode 150, Grind 75)
- **Sortable table** — columns: #, Title, Difficulty, Pattern, Tags, Actions
- **Expandable rows** — click to reveal summary + collapsible hints section
- **Actions per row:** "Visualize" button (if `visualizerSlug` exists), "LeetCode" external link, "Mark Solved" button

### Problem Count

~150-200 curated problems covering the union of Blind 75, NeetCode 150, and Grind 75 lists. Stored as a static TypeScript array in `src/data/problems.ts`.

### Patterns Covered

Arrays & Hashing, Two Pointers, Sliding Window, Stack, Binary Search, Linked Lists, Trees, Tries, Heap/Priority Queue, Backtracking, Graphs, Dynamic Programming (1D), Dynamic Programming (2D), Greedy, Intervals, Bit Manipulation, Math & Geometry

### Search & Filter Logic

- Search: case-insensitive match on title or `id.toString()`
- Difficulty filter: toggle Easy/Medium/Hard (multi-select, default all on)
- Pattern filter: dropdown with "All Patterns" default
- List filter: dropdown with "All Lists" default
- Sort: by number (default), title (alpha), difficulty (Easy→Hard)
- All filtering happens client-side in a `useProblems` hook

## Resources Page (`/resources`)

### Data Model

```ts
interface StudyGuide {
  slug: string;
  title: string;              // e.g. "Sliding Window Pattern"
  category: string;           // grouping: "Arrays", "Graphs", etc.
  icon: string;               // emoji for sidebar
  overview: string;           // 2-3 sentence intro
  whenToUse: string[];        // bullet points
  approach: string;           // detailed explanation
  codeTemplate: string;       // generic code template
  relatedProblems: number[];  // LeetCode problem IDs (link to /problems)
  externalLinks: ExternalLink[];
}

interface ExternalLink {
  title: string;
  url: string;
  type: "video" | "article" | "course";
}
```

### Layout

- **Index page (`/resources`):** Grid of guide cards grouped by category, or redirect to first guide
- **Guide page (`/resources/[slug]`):** Left sidebar listing all guides (grouped by category), main content area with the selected guide
- **Guide content sections:** Overview → When to Use → Approach → Code Template → Related Problems (linked) → External Resources

### 15 Study Guides

1. Arrays & Hashing
2. Two Pointers
3. Sliding Window
4. Stack
5. Binary Search
6. Linked Lists
7. Trees (BFS & DFS)
8. Tries
9. Heap / Priority Queue
10. Backtracking
11. Graphs (BFS, DFS, Topological Sort)
12. Dynamic Programming — 1D
13. Dynamic Programming — 2D
14. Greedy
15. Intervals

Each includes: pattern explanation, recognition signals ("when to use"), pseudocode template, 5-10 related problem IDs, 3-5 curated external links.

## Tracker Page (`/tracker`)

### Data Model (localStorage)

```ts
interface SolvedEntry {
  solvedAt: string;           // ISO date string
  difficulty: "Easy" | "Medium" | "Hard";
  timeMinutes?: number;
  notes?: string;
}

interface TrackerData {
  solvedProblems: Record<number, SolvedEntry>;  // keyed by problem ID
  dailyGoal: number;          // problems per day target (default: 3)
}
```

### Layout

**Top stats row (4 cards):**
- Total problems solved
- Current streak (consecutive days with >= dailyGoal solved)
- Best streak
- Today's progress (X / dailyGoal)

**Calendar heatmap:**
- GitHub-style grid showing last 365 days
- Color intensity = problems solved that day (0=empty, 1-2=light, 3+=dark)
- Hover shows date + count

**Daily plan section:**
- "Review" list: problems solved 1, 3, 7, 14, 30 days ago (spaced repetition)
- "New problems" suggestion: random unsolved problems matching current weakest pattern
- Each item links to the problem on /problems page

**Difficulty breakdown:**
- Three progress bars (Easy/Medium/Hard) showing solved / total for each
- Percentage labels

**Daily goal setting:**
- Small input to change daily goal (persisted in localStorage)

### Mark Solved Flow

On the Problems page, each row has a "Mark Solved" button. Clicking it:
1. Opens a small inline form: time spent (optional), notes (optional)
2. Saves to localStorage via the storage abstraction
3. Updates the button to show a green checkmark + date
4. Already-solved problems show the green checkmark by default

## Storage Abstraction (`src/lib/storage.ts`)

Thin wrapper around localStorage designed for easy Supabase swap:

```ts
interface StorageProvider {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  subscribe(key: string, callback: () => void): () => void;
}
```

The `useTracker` hook consumes this provider. To swap to Supabase later, replace the provider implementation without changing any component code.

## File Structure

### New Routes
```
src/app/
  problems/page.tsx
  resources/page.tsx
  resources/[slug]/page.tsx
  tracker/page.tsx
```

### New Data Files
```
src/data/
  problems.ts                — Problem[] array (~150-200 entries)
  study-guides.ts            — StudyGuide[] array (15 entries)
  problem-lists.ts           — named list definitions (Blind 75, NeetCode 150, Grind 75)
```

### New Components
```
src/components/
  nav-links.tsx              — top bar navigation links (Visualize, Problems, Resources, Tracker)
  problem-table.tsx          — searchable/filterable/sortable problem table
  problem-row.tsx            — expandable row with summary + hints
  problem-filters.tsx        — search bar + difficulty pills + pattern/list dropdowns
  guide-sidebar.tsx          — sidebar listing all study guides by category
  guide-content.tsx          — rendered study guide content
  tracker-stats.tsx          — 4-card stats row
  calendar-heatmap.tsx       — GitHub-style 365-day grid
  daily-plan.tsx             — spaced repetition + new problem suggestions
  difficulty-breakdown.tsx   — Easy/Medium/Hard progress bars
  mark-solved-button.tsx     — inline form for logging solved problems
```

### New Hooks
```
src/hooks/
  use-tracker.ts             — CRUD operations on TrackerData via storage provider
  use-problems.ts            — search/filter/sort state machine for problems list
```

### New Lib
```
src/lib/
  storage.ts                 — localStorage wrapper with subscribe support
```

### Modified Files
- `src/components/top-bar.tsx` — add NavLinks component alongside logo

## Visual Design

Consistent with existing theme:
- Background: `#0B0F1A`, Surface: `#131A2B`, Border: `#1E2A3F`
- Primary: `#00D4FF` (cyan), Active: `#FFB800` (amber)
- Difficulty colors: Easy=`#00B8A3` (green), Medium=`#FFC01E` (yellow), Hard=`#FF375F` (red)
- Tables use surface background with border rows
- Expandable rows animate with Framer Motion
- Calendar heatmap uses cyan intensity scale
- All new pages follow the same max-w-7xl centered layout

## Out of Scope (V2)

- Supabase backend / user accounts (localStorage only, designed for swap)
- Code editor / submission
- Problem discussion / comments
- AI-generated explanations
- Importing progress from LeetCode
- Adding new 3D visualizations beyond the current 6
