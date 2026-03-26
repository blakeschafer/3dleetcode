# AlgoVision 3D — Design Spec

## Overview

Interactive web app that visualizes data structures and algorithms in 3D. Users step through algorithms, manipulate data structures in real-time, and build intuition for LeetCode problems through spatial understanding.

Core value: "Don't just solve LeetCode — see it happen."

## Tech Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS v4, Framer Motion (UI)
- React Three Fiber / Three.js (3D)
- Deploy on Vercel, no backend

## Routes

| Route | Purpose |
|---|---|
| `/` | Home — category tabs + algorithm card grid |
| `/visualizer/[slug]` | Fullscreen algorithm viewer |

## Architecture

### Core Layers

1. **UI Shell** — Next.js App Router, Tailwind, dark theme, global controls bar
2. **3D Engine** — React Three Fiber scenes, reusable camera/lighting/controls
3. **Algorithm Engine** — Each algorithm defines: initial state, step generator, code-line mapping
4. **Playback System** — State machine: play/pause/step-forward/step-back

### Data Flow

```
User selects algorithm → Load algorithm module → Initialize 3D scene with preset data
→ Play → Playback iterates steps → Each step updates:
    - 3D node positions/colors/highlights
    - Code panel highlighted line
    - Complexity badge
→ Pause, step, or reset at any time
```

### Algorithm Module Interface

```ts
interface Algorithm {
  name: string
  slug: string
  category: "Arrays" | "Trees" | "Linked Lists" | "Graphs"
  description: string
  complexity: { time: string; space: string }
  code: string[]                // lines of algorithm code
  presets: Preset[]             // 2-3 curated inputs
  leetcodeProblems: string[]    // related problem names/numbers
  generateSteps(input: any): Step[]
}

interface Step {
  highlights: string[]          // node IDs to highlight (active)
  visited: string[]             // node IDs already visited
  positions?: Record<string, [number, number, number]>  // node moves
  activeCodeLine: number        // which code line is executing
  label: string                 // e.g. "Compare 5 > 3"
}

interface Preset {
  name: string
  data: any                     // algorithm-specific input shape
}
```

## Algorithm Modules (MVP — 6 total)

### 1. Bubble Sort
- **Category:** Arrays
- **Complexity:** O(n²) time, O(1) space
- **3D:** Row of floating cubes, swaps animate position
- **Presets:** `[5,3,8,1,9,2]`, `[10,9,8,7,6,5,4,3,2,1]`, `[1,2,3,4,5]`
- **LeetCode:** #912 Sort an Array, #75 Sort Colors

### 2. Binary Tree DFS
- **Category:** Trees
- **Complexity:** O(n) time, O(h) space
- **3D:** Hierarchical sphere tree with edge lines
- **Presets:** Balanced tree (depth 3), skewed tree, single node
- **LeetCode:** #94 Inorder Traversal, #144 Preorder Traversal, #104 Max Depth

### 3. Linked List Reversal
- **Category:** Linked Lists
- **Complexity:** O(n) time, O(1) space
- **3D:** Chain of spheres with arrow connectors, arrows flip during reversal
- **Presets:** 5 nodes, 8 nodes, 2 nodes
- **LeetCode:** #206 Reverse Linked List, #92 Reverse Linked List II

### 4. Graph BFS
- **Category:** Graphs
- **Complexity:** O(V+E) time, O(V) space
- **3D:** Node cluster in 3D space with edge lines
- **Presets:** Small connected graph, disconnected graph, cyclic graph
- **LeetCode:** #200 Number of Islands, #133 Clone Graph

### 5. Binary Search
- **Category:** Arrays
- **Complexity:** O(log n) time, O(1) space
- **3D:** Row of cubes, search window highlights narrow
- **Presets:** `[1,3,5,7,9,11,13]` target 7, target 1, target 14 (not found)
- **LeetCode:** #704 Binary Search, #35 Search Insert Position

### 6. Sliding Window
- **Category:** Arrays
- **Complexity:** O(n) time, O(1) space
- **3D:** Row of cubes with colored pointer indicators marking window bounds
- **Presets:** `[2,1,5,1,3,2]` window 3, `[1,2,3,4,5]` window 2
- **LeetCode:** #209 Min Size Subarray Sum, #3 Longest Substring Without Repeating

## Visual Design

### Theme
- Background: `#0B0F1A` (dark navy)
- Surface: `#131A2B` (card backgrounds)
- Primary accent: `#00D4FF` (cyan/neon blue)
- Active highlight: `#FFB800` (yellow-amber for active nodes)
- Visited: muted blue `#1A3A5C`
- Text: white `#FFFFFF`, secondary `#8899AA`
- Glow effects on borders, active elements

### Top Bar
- Left: "AlgoVision 3D" logo with subtle glow
- Center: Playback controls (play/pause, step back, step forward, reset)
- Right: Speed slider (0.25x–5x), animation style toggle (smooth/discrete)

### Home Page
- Tab row: Arrays | Trees | Linked Lists | Graphs (pill-style, cyan active)
- 2x3 responsive grid (single column on mobile)
- Each card:
  - Mini R3F canvas with slowly rotating data structure preview
  - Algorithm name + one-line description
  - Complexity badge
  - Hover: glow + scale animation
  - Click → `/visualizer/[slug]`

### Fullscreen Visualizer
- Two-panel split:
  - Left (70%): Full 3D canvas with orbit controls
  - Right (30%): Code panel with active line highlight + step description
- Bottom: Playback bar + preset selector dropdown
- Top-left: Back button
- Top-right: Algorithm name, complexity badge, LeetCode problem tags
- Mobile: panels stack vertically

### 3D Representations
| Algorithm | Shape |
|---|---|
| Bubble Sort | Row of cubes, swaps animate position |
| Binary Tree DFS | Hierarchical spheres with edge lines |
| Linked List Reversal | Chain of spheres with arrow connectors |
| Graph BFS | 3D node cluster with edge lines |
| Binary Search | Row of cubes, search window highlights |
| Sliding Window | Row of cubes with colored pointer markers |

### Animation Behaviors
- Active nodes: glow yellow-amber
- Visited nodes: dim to muted blue
- Swaps/moves: smooth lerp transitions
- Edge traversal: pulse effect
- Camera: auto-frames scene, user can override via orbit controls

## File Structure

```
src/
  app/
    layout.tsx                  — root layout, fonts, dark theme
    page.tsx                    — home: tabs + card grid
    visualizer/[slug]/
      page.tsx                  — fullscreen viewer
  components/
    top-bar.tsx                 — logo + global controls
    algorithm-card.tsx          — grid card with mini 3D preview
    visualizer-view.tsx         — split layout (3D + code panel)
    code-panel.tsx              — code display with line highlighting
    playback-controls.tsx       — play/pause/step/reset/speed
    scene-wrapper.tsx           — shared R3F Canvas + lights + orbit controls
  algorithms/
    types.ts                    — Algorithm, Step, Preset interfaces
    index.ts                    — registry of all algorithms
    bubble-sort.ts
    binary-tree-dfs.ts
    linked-list-reversal.ts
    graph-bfs.ts
    binary-search.ts
    sliding-window.ts
  three/
    nodes/
      cube-node.tsx             — animated cube (arrays)
      sphere-node.tsx           — animated sphere (trees/graphs)
      edge-line.tsx             — line/arrow between nodes
    camera-rig.tsx              — auto-framing camera logic
  hooks/
    use-playback.ts             — play/pause/step state machine
    use-algorithm.ts            — load algorithm + generate steps
  lib/
    constants.ts                — colors, speeds, sizes
```

## Key Technical Decisions

- All rendering client-side (`"use client"` on interactive components)
- No backend, no database — purely static
- Playback via `usePlayback` hook: manages current step index, playing/paused state, speed
- Each algorithm's `generateSteps()` is a pure function (input → Step[])
- Shared `SceneWrapper` with consistent lighting, orbit controls, subtle grid floor
- Framer Motion for UI transitions (card hover, page navigation)
- R3F for 3D animations (node movement, color transitions)
- Responsive: cards reflow single-column on mobile, visualizer stacks vertically

## Out of Scope (MVP)

- Custom input builder (presets only)
- Full LeetCode mode (light tags only)
- Live complexity counter (static badges only)
- Backend / user accounts
- AI explanations
- VR mode
- Multiplayer
