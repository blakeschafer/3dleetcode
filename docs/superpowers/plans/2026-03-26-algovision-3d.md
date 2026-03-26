# AlgoVision 3D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 3D data structures & algorithms visualizer with 6 algorithm modules, step-through playback, code panel, and dark neon UI.

**Architecture:** Next.js App Router with two routes (home grid + fullscreen visualizer). React Three Fiber for 3D scenes. Each algorithm is a self-contained module implementing a shared interface. Playback managed by a central hook.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, React Three Fiber, Three.js, @react-three/drei, Framer Motion

---

## File Structure

```
src/
  app/
    layout.tsx                  — root layout, fonts, global styles
    page.tsx                    — home: category tabs + card grid
    visualizer/[slug]/
      page.tsx                  — fullscreen viewer (client component)
  components/
    top-bar.tsx                 — logo + playback controls + speed slider
    algorithm-card.tsx          — card with mini 3D preview
    visualizer-view.tsx         — split layout: 3D canvas + code panel
    code-panel.tsx              — code with line highlighting
    playback-controls.tsx       — play/pause/step/reset buttons + speed
    preset-selector.tsx         — dropdown to pick preset input
    scene-wrapper.tsx           — R3F Canvas + lights + OrbitControls
    category-tabs.tsx           — pill-style tab row for filtering
  algorithms/
    types.ts                    — Algorithm, Step, Preset interfaces
    registry.ts                 — map of slug → algorithm module
    bubble-sort.ts
    binary-tree-dfs.ts
    linked-list-reversal.ts
    graph-bfs.ts
    binary-search.ts
    sliding-window.ts
  three/
    cube-node.tsx               — animated cube for array elements
    sphere-node.tsx             — animated sphere for tree/graph nodes
    edge-line.tsx               — line/arrow between nodes
    array-scene.tsx             — scene layout for array algorithms
    tree-scene.tsx              — scene layout for tree algorithms
    linked-list-scene.tsx       — scene layout for linked list
    graph-scene.tsx             — scene layout for graph algorithms
  hooks/
    use-playback.ts             — playback state machine
    use-algorithm.ts            — load algorithm + steps from preset
  lib/
    constants.ts                — colors, speeds, sizes
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/lib/constants.ts`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/blakeschafer/Desktop/projects/3dleetcode
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

- [ ] **Step 2: Install dependencies**

```bash
npm install three @react-three/fiber @react-three/drei framer-motion
npm install -D @types/three
```

- [ ] **Step 3: Create constants file**

Create `src/lib/constants.ts`:

```ts
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
```

- [ ] **Step 4: Update root layout with dark theme**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlgoVision 3D",
  description: "See algorithms in 3D. Step through every operation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-[#0B0F1A] text-white min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Update globals.css**

Replace `src/app/globals.css`:

```css
@import "tailwindcss";

body {
  background: #0B0F1A;
  color: #ffffff;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #131A2B;
}

::-webkit-scrollbar-thumb {
  background: #1E2A3F;
  border-radius: 3px;
}
```

- [ ] **Step 6: Create placeholder home page**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-[#00D4FF]">AlgoVision 3D</h1>
    </main>
  );
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: App runs on localhost:3000, shows "AlgoVision 3D" in cyan on dark background.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind, R3F, and dark theme"
```

---

### Task 2: Algorithm Types & Registry

**Files:**
- Create: `src/algorithms/types.ts`, `src/algorithms/registry.ts`

- [ ] **Step 1: Define core types**

Create `src/algorithms/types.ts`:

```ts
export type Category = "Arrays" | "Trees" | "Linked Lists" | "Graphs";

export interface Preset {
  name: string;
  data: unknown;
}

export interface Step {
  highlights: string[];
  visited: string[];
  positions?: Record<string, [number, number, number]>;
  activeCodeLine: number;
  label: string;
}

export interface Algorithm {
  name: string;
  slug: string;
  category: Category;
  description: string;
  complexity: { time: string; space: string };
  code: string[];
  presets: Preset[];
  leetcodeProblems: string[];
  generateSteps: (data: unknown) => Step[];
}

export interface ArrayPresetData {
  array: number[];
  target?: number;
  windowSize?: number;
}

export interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

export interface TreePresetData {
  root: TreeNode;
}

export interface LinkedListPresetData {
  values: number[];
}

export interface GraphPresetData {
  nodes: string[];
  edges: [string, string][];
  startNode: string;
}
```

- [ ] **Step 2: Create registry**

Create `src/algorithms/registry.ts`:

```ts
import { Algorithm } from "./types";

const algorithmModules: Record<string, () => Promise<{ default: Algorithm }>> = {
  "bubble-sort": () => import("./bubble-sort"),
  "binary-tree-dfs": () => import("./binary-tree-dfs"),
  "linked-list-reversal": () => import("./linked-list-reversal"),
  "graph-bfs": () => import("./graph-bfs"),
  "binary-search": () => import("./binary-search"),
  "sliding-window": () => import("./sliding-window"),
};

export async function getAlgorithm(slug: string): Promise<Algorithm | null> {
  const loader = algorithmModules[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

export function getAllSlugs(): string[] {
  return Object.keys(algorithmModules);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/algorithms/types.ts src/algorithms/registry.ts
git commit -m "feat: add algorithm types and lazy-loading registry"
```

---

### Task 3: Bubble Sort Algorithm

**Files:**
- Create: `src/algorithms/bubble-sort.ts`

- [ ] **Step 1: Implement bubble sort module**

Create `src/algorithms/bubble-sort.ts`:

```ts
import { Algorithm, Step, ArrayPresetData } from "./types";

const bubbleSort: Algorithm = {
  name: "Bubble Sort",
  slug: "bubble-sort",
  category: "Arrays",
  description: "Repeatedly swap adjacent elements if they are in the wrong order.",
  complexity: { time: "O(n²)", space: "O(1)" },
  code: [
    "function bubbleSort(arr) {",
    "  for (let i = 0; i < arr.length; i++) {",
    "    for (let j = 0; j < arr.length - i - 1; j++) {",
    "      if (arr[j] > arr[j + 1]) {",
    "        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];",
    "      }",
    "    }",
    "  }",
    "  return arr;",
    "}",
  ],
  presets: [
    { name: "Random", data: { array: [5, 3, 8, 1, 9, 2] } },
    { name: "Reversed", data: { array: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] } },
    { name: "Already Sorted", data: { array: [1, 2, 3, 4, 5] } },
  ],
  leetcodeProblems: ["#912 Sort an Array", "#75 Sort Colors"],
  generateSteps: (data: unknown): Step[] => {
    const { array } = data as ArrayPresetData;
    const arr = [...array];
    const steps: Step[] = [];
    const visited: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start bubble sort",
    });

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        const idJ = `node-${j}`;
        const idJ1 = `node-${j + 1}`;

        steps.push({
          highlights: [idJ, idJ1],
          visited: [...visited],
          activeCodeLine: 3,
          label: `Compare ${arr[j]} and ${arr[j + 1]}`,
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            highlights: [idJ, idJ1],
            visited: [...visited],
            activeCodeLine: 4,
            label: `Swap ${arr[j + 1]} and ${arr[j]}`,
          });
        }
      }
      visited.push(`node-${arr.length - 1 - i}`);
    }

    steps.push({
      highlights: [],
      visited: arr.map((_, i) => `node-${i}`),
      activeCodeLine: 8,
      label: "Array sorted!",
    });

    return steps;
  },
};

export default bubbleSort;
```

- [ ] **Step 2: Commit**

```bash
git add src/algorithms/bubble-sort.ts
git commit -m "feat: add bubble sort algorithm module"
```

---

### Task 4: Binary Search Algorithm

**Files:**
- Create: `src/algorithms/binary-search.ts`

- [ ] **Step 1: Implement binary search module**

Create `src/algorithms/binary-search.ts`:

```ts
import { Algorithm, Step, ArrayPresetData } from "./types";

const binarySearch: Algorithm = {
  name: "Binary Search",
  slug: "binary-search",
  category: "Arrays",
  description: "Find a target value by repeatedly halving the search range.",
  complexity: { time: "O(log n)", space: "O(1)" },
  code: [
    "function binarySearch(arr, target) {",
    "  let left = 0, right = arr.length - 1;",
    "  while (left <= right) {",
    "    let mid = Math.floor((left + right) / 2);",
    "    if (arr[mid] === target) return mid;",
    "    if (arr[mid] < target) left = mid + 1;",
    "    else right = mid - 1;",
    "  }",
    "  return -1;",
    "}",
  ],
  presets: [
    { name: "Find 7", data: { array: [1, 3, 5, 7, 9, 11, 13], target: 7 } },
    { name: "Find 1", data: { array: [1, 3, 5, 7, 9, 11, 13], target: 1 } },
    { name: "Not Found", data: { array: [1, 3, 5, 7, 9, 11, 13], target: 14 } },
  ],
  leetcodeProblems: ["#704 Binary Search", "#35 Search Insert Position"],
  generateSteps: (data: unknown): Step[] => {
    const { array, target } = data as ArrayPresetData;
    const steps: Step[] = [];
    const visited: string[] = [];
    let left = 0;
    let right = array.length - 1;

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: `Search for ${target} in [${array.join(", ")}]`,
    });

    steps.push({
      highlights: [`node-${left}`, `node-${right}`],
      visited: [],
      activeCodeLine: 1,
      label: `Initialize left=${left}, right=${right}`,
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        highlights: [`node-${mid}`],
        visited: [...visited],
        activeCodeLine: 3,
        label: `Mid = ${mid}, arr[${mid}] = ${array[mid]}`,
      });

      if (array[mid] === target) {
        steps.push({
          highlights: [`node-${mid}`],
          visited: [...visited],
          activeCodeLine: 4,
          label: `Found ${target} at index ${mid}!`,
        });
        return steps;
      }

      if (array[mid] < target) {
        visited.push(...Array.from({ length: mid - left + 1 }, (_, i) => `node-${left + i}`));
        left = mid + 1;
        steps.push({
          highlights: [`node-${left}`],
          visited: [...visited],
          activeCodeLine: 5,
          label: `${array[mid]} < ${target}, move left to ${left}`,
        });
      } else {
        visited.push(...Array.from({ length: right - mid + 1 }, (_, i) => `node-${mid + i}`));
        right = mid - 1;
        steps.push({
          highlights: [`node-${right}`],
          visited: [...visited],
          activeCodeLine: 6,
          label: `${array[mid]} > ${target}, move right to ${right}`,
        });
      }
    }

    steps.push({
      highlights: [],
      visited: array.map((_, i) => `node-${i}`),
      activeCodeLine: 8,
      label: `${target} not found in array`,
    });

    return steps;
  },
};

export default binarySearch;
```

- [ ] **Step 2: Commit**

```bash
git add src/algorithms/binary-search.ts
git commit -m "feat: add binary search algorithm module"
```

---

### Task 5: Sliding Window Algorithm

**Files:**
- Create: `src/algorithms/sliding-window.ts`

- [ ] **Step 1: Implement sliding window module**

Create `src/algorithms/sliding-window.ts`:

```ts
import { Algorithm, Step, ArrayPresetData } from "./types";

const slidingWindow: Algorithm = {
  name: "Sliding Window",
  slug: "sliding-window",
  category: "Arrays",
  description: "Find the minimum size subarray with a sum >= target using a sliding window.",
  complexity: { time: "O(n)", space: "O(1)" },
  code: [
    "function minSubArrayLen(target, nums) {",
    "  let left = 0, sum = 0, minLen = Infinity;",
    "  for (let right = 0; right < nums.length; right++) {",
    "    sum += nums[right];",
    "    while (sum >= target) {",
    "      minLen = Math.min(minLen, right - left + 1);",
    "      sum -= nums[left];",
    "      left++;",
    "    }",
    "  }",
    "  return minLen === Infinity ? 0 : minLen;",
    "}",
  ],
  presets: [
    { name: "Target 7, Window 3", data: { array: [2, 1, 5, 1, 3, 2], target: 7 } },
    { name: "Target 4, Window 2", data: { array: [1, 2, 3, 4, 5], target: 4 } },
  ],
  leetcodeProblems: ["#209 Min Size Subarray Sum", "#3 Longest Substring Without Repeating"],
  generateSteps: (data: unknown): Step[] => {
    const { array, target } = data as ArrayPresetData;
    const steps: Step[] = [];
    let left = 0;
    let sum = 0;
    let minLen = Infinity;

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: `Find min subarray with sum >= ${target}`,
    });

    for (let right = 0; right < array.length; right++) {
      sum += array[right];
      const windowIds = Array.from({ length: right - left + 1 }, (_, i) => `node-${left + i}`);

      steps.push({
        highlights: [`node-${right}`],
        visited: [],
        activeCodeLine: 3,
        label: `Add nums[${right}]=${array[right]}, sum=${sum}`,
      });

      while (sum >= target!) {
        minLen = Math.min(minLen, right - left + 1);
        const currentWindow = Array.from({ length: right - left + 1 }, (_, i) => `node-${left + i}`);

        steps.push({
          highlights: currentWindow,
          visited: [],
          activeCodeLine: 5,
          label: `sum=${sum} >= ${target}, window size=${right - left + 1}, minLen=${minLen}`,
        });

        sum -= array[left];

        steps.push({
          highlights: [`node-${left}`],
          visited: [],
          activeCodeLine: 6,
          label: `Remove nums[${left}]=${array[left]}, sum=${sum}`,
        });

        left++;
      }
    }

    steps.push({
      highlights: [],
      visited: array.map((_, i) => `node-${i}`),
      activeCodeLine: 10,
      label: minLen === Infinity ? "No valid subarray found" : `Minimum length: ${minLen}`,
    });

    return steps;
  },
};

export default slidingWindow;
```

- [ ] **Step 2: Commit**

```bash
git add src/algorithms/sliding-window.ts
git commit -m "feat: add sliding window algorithm module"
```

---

### Task 6: Binary Tree DFS Algorithm

**Files:**
- Create: `src/algorithms/binary-tree-dfs.ts`

- [ ] **Step 1: Implement binary tree DFS module**

Create `src/algorithms/binary-tree-dfs.ts`:

```ts
import { Algorithm, Step, TreeNode, TreePresetData } from "./types";

function assignTreePositions(
  node: TreeNode | undefined,
  depth: number,
  xOffset: number,
  spread: number,
  positions: Record<string, [number, number, number]>,
  prefix: string
): void {
  if (!node) return;
  positions[prefix] = [xOffset, -depth * 2, 0];
  assignTreePositions(node.left, depth + 1, xOffset - spread, spread / 2, positions, `${prefix}-L`);
  assignTreePositions(node.right, depth + 1, xOffset + spread, spread / 2, positions, `${prefix}-R`);
}

function collectNodeIds(node: TreeNode | undefined, prefix: string): string[] {
  if (!node) return [];
  return [prefix, ...collectNodeIds(node.left, `${prefix}-L`), ...collectNodeIds(node.right, `${prefix}-R`)];
}

function dfsInorder(node: TreeNode | undefined, prefix: string, steps: Step[], visited: string[]): void {
  if (!node) return;

  steps.push({
    highlights: [prefix],
    visited: [...visited],
    activeCodeLine: 2,
    label: `Visit node ${node.value}`,
  });

  dfsInorder(node.left, `${prefix}-L`, steps, visited);

  visited.push(prefix);
  steps.push({
    highlights: [prefix],
    visited: [...visited],
    activeCodeLine: 4,
    label: `Process node ${node.value}`,
  });

  dfsInorder(node.right, `${prefix}-R`, steps, visited);
}

const binaryTreeDfs: Algorithm = {
  name: "Binary Tree DFS",
  slug: "binary-tree-dfs",
  category: "Trees",
  description: "Traverse a binary tree depth-first using inorder traversal (left, root, right).",
  complexity: { time: "O(n)", space: "O(h)" },
  code: [
    "function inorderDFS(node) {",
    "  if (!node) return;",
    "  inorderDFS(node.left);",
    "  // process node",
    "  console.log(node.value);",
    "  inorderDFS(node.right);",
    "}",
  ],
  presets: [
    {
      name: "Balanced (depth 3)",
      data: {
        root: {
          value: 4,
          left: { value: 2, left: { value: 1 }, right: { value: 3 } },
          right: { value: 6, left: { value: 5 }, right: { value: 7 } },
        },
      },
    },
    {
      name: "Skewed Left",
      data: {
        root: {
          value: 5,
          left: { value: 4, left: { value: 3, left: { value: 2, left: { value: 1 } } } },
        },
      },
    },
    {
      name: "Single Node",
      data: { root: { value: 42 } },
    },
  ],
  leetcodeProblems: ["#94 Inorder Traversal", "#144 Preorder Traversal", "#104 Max Depth"],
  generateSteps: (data: unknown): Step[] => {
    const { root } = data as TreePresetData;
    const steps: Step[] = [];
    const visited: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start inorder DFS traversal",
    });

    dfsInorder(root, "root", steps, visited);

    const allNodes = collectNodeIds(root, "root");
    steps.push({
      highlights: [],
      visited: allNodes,
      activeCodeLine: 6,
      label: "Traversal complete!",
    });

    return steps;
  },
};

export default binaryTreeDfs;
```

- [ ] **Step 2: Commit**

```bash
git add src/algorithms/binary-tree-dfs.ts
git commit -m "feat: add binary tree DFS algorithm module"
```

---

### Task 7: Linked List Reversal Algorithm

**Files:**
- Create: `src/algorithms/linked-list-reversal.ts`

- [ ] **Step 1: Implement linked list reversal module**

Create `src/algorithms/linked-list-reversal.ts`:

```ts
import { Algorithm, Step, LinkedListPresetData } from "./types";

const linkedListReversal: Algorithm = {
  name: "Linked List Reversal",
  slug: "linked-list-reversal",
  category: "Linked Lists",
  description: "Reverse a singly linked list by re-pointing each node's next pointer.",
  complexity: { time: "O(n)", space: "O(1)" },
  code: [
    "function reverseList(head) {",
    "  let prev = null;",
    "  let curr = head;",
    "  while (curr !== null) {",
    "    let next = curr.next;",
    "    curr.next = prev;",
    "    prev = curr;",
    "    curr = next;",
    "  }",
    "  return prev;",
    "}",
  ],
  presets: [
    { name: "5 Nodes", data: { values: [1, 2, 3, 4, 5] } },
    { name: "8 Nodes", data: { values: [1, 2, 3, 4, 5, 6, 7, 8] } },
    { name: "2 Nodes", data: { values: [1, 2] } },
  ],
  leetcodeProblems: ["#206 Reverse Linked List", "#92 Reverse Linked List II"],
  generateSteps: (data: unknown): Step[] => {
    const { values } = data as LinkedListPresetData;
    const steps: Step[] = [];
    let prevIdx = -1;
    let currIdx = 0;

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: `Reverse list [${values.join(" → ")}]`,
    });

    steps.push({
      highlights: [`node-${currIdx}`],
      visited: [],
      activeCodeLine: 2,
      label: "Initialize prev=null, curr=head",
    });

    while (currIdx < values.length) {
      const nextIdx = currIdx + 1;

      steps.push({
        highlights: [`node-${currIdx}`],
        visited: prevIdx >= 0 ? Array.from({ length: prevIdx + 1 }, (_, i) => `node-${i}`) : [],
        activeCodeLine: 4,
        label: `Save next = node ${nextIdx < values.length ? values[nextIdx] : "null"}`,
      });

      steps.push({
        highlights: [`node-${currIdx}`],
        visited: prevIdx >= 0 ? Array.from({ length: prevIdx + 1 }, (_, i) => `node-${i}`) : [],
        activeCodeLine: 5,
        label: `Point node ${values[currIdx]}.next → ${prevIdx >= 0 ? values[prevIdx] : "null"}`,
      });

      prevIdx = currIdx;
      currIdx = nextIdx;

      steps.push({
        highlights: currIdx < values.length ? [`node-${currIdx}`] : [],
        visited: Array.from({ length: prevIdx + 1 }, (_, i) => `node-${i}`),
        activeCodeLine: 7,
        label: `Move prev=${values[prevIdx]}, curr=${currIdx < values.length ? values[currIdx] : "null"}`,
      });
    }

    steps.push({
      highlights: [],
      visited: values.map((_, i) => `node-${i}`),
      activeCodeLine: 9,
      label: `List reversed! [${[...values].reverse().join(" → ")}]`,
    });

    return steps;
  },
};

export default linkedListReversal;
```

- [ ] **Step 2: Commit**

```bash
git add src/algorithms/linked-list-reversal.ts
git commit -m "feat: add linked list reversal algorithm module"
```

---

### Task 8: Graph BFS Algorithm

**Files:**
- Create: `src/algorithms/graph-bfs.ts`

- [ ] **Step 1: Implement graph BFS module**

Create `src/algorithms/graph-bfs.ts`:

```ts
import { Algorithm, Step, GraphPresetData } from "./types";

const graphBfs: Algorithm = {
  name: "Graph BFS",
  slug: "graph-bfs",
  category: "Graphs",
  description: "Explore a graph level by level, visiting all neighbors before going deeper.",
  complexity: { time: "O(V+E)", space: "O(V)" },
  code: [
    "function bfs(graph, start) {",
    "  const visited = new Set([start]);",
    "  const queue = [start];",
    "  while (queue.length > 0) {",
    "    const node = queue.shift();",
    "    for (const neighbor of graph[node]) {",
    "      if (!visited.has(neighbor)) {",
    "        visited.add(neighbor);",
    "        queue.push(neighbor);",
    "      }",
    "    }",
    "  }",
    "}",
  ],
  presets: [
    {
      name: "Connected Graph",
      data: {
        nodes: ["A", "B", "C", "D", "E", "F"],
        edges: [["A", "B"], ["A", "C"], ["B", "D"], ["C", "E"], ["D", "F"], ["E", "F"]] as [string, string][],
        startNode: "A",
      },
    },
    {
      name: "Disconnected",
      data: {
        nodes: ["A", "B", "C", "D", "E"],
        edges: [["A", "B"], ["A", "C"], ["D", "E"]] as [string, string][],
        startNode: "A",
      },
    },
    {
      name: "Cyclic",
      data: {
        nodes: ["A", "B", "C", "D"],
        edges: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"]] as [string, string][],
        startNode: "A",
      },
    },
  ],
  leetcodeProblems: ["#200 Number of Islands", "#133 Clone Graph"],
  generateSteps: (data: unknown): Step[] => {
    const { nodes, edges, startNode } = data as GraphPresetData;
    const steps: Step[] = [];

    const adjacency: Record<string, string[]> = {};
    for (const node of nodes) adjacency[node] = [];
    for (const [a, b] of edges) {
      adjacency[a].push(b);
      adjacency[b].push(a);
    }

    const visited = new Set<string>([startNode]);
    const queue: string[] = [startNode];
    const visitedList: string[] = [];

    steps.push({
      highlights: [`node-${startNode}`],
      visited: [],
      activeCodeLine: 1,
      label: `Start BFS from node ${startNode}`,
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      visitedList.push(current);

      steps.push({
        highlights: [`node-${current}`],
        visited: visitedList.map((n) => `node-${n}`),
        activeCodeLine: 4,
        label: `Dequeue node ${current}`,
      });

      for (const neighbor of adjacency[current]) {
        steps.push({
          highlights: [`node-${current}`, `node-${neighbor}`],
          visited: visitedList.map((n) => `node-${n}`),
          activeCodeLine: 5,
          label: `Check neighbor ${neighbor} of ${current}`,
        });

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);

          steps.push({
            highlights: [`node-${neighbor}`],
            visited: visitedList.map((n) => `node-${n}`),
            activeCodeLine: 8,
            label: `Add ${neighbor} to queue`,
          });
        }
      }
    }

    steps.push({
      highlights: [],
      visited: nodes.map((n) => `node-${n}`),
      activeCodeLine: 12,
      label: `BFS complete! Visited: ${visitedList.join(" → ")}`,
    });

    return steps;
  },
};

export default graphBfs;
```

- [ ] **Step 2: Commit**

```bash
git add src/algorithms/graph-bfs.ts
git commit -m "feat: add graph BFS algorithm module"
```

---

### Task 9: Playback Hook

**Files:**
- Create: `src/hooks/use-playback.ts`, `src/hooks/use-algorithm.ts`

- [ ] **Step 1: Create playback hook**

Create `src/hooks/use-playback.ts`:

```ts
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Step } from "@/algorithms/types";
import { DEFAULT_SPEED } from "@/lib/constants";

interface PlaybackState {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  steps: Step[];
}

export function usePlayback(steps: Step[]) {
  const [state, setState] = useState<PlaybackState>({
    currentStep: 0,
    isPlaying: false,
    speed: DEFAULT_SPEED,
    steps,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setState((prev) => ({ ...prev, steps, currentStep: 0, isPlaying: false }));
  }, [steps]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep >= prev.steps.length - 1) return prev;
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  }, []);

  const stepBackward = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep <= 0) return prev;
      return { ...prev, currentStep: prev.currentStep - 1 };
    });
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, currentStep: 0, isPlaying: false }));
  }, [clearTimer]);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  useEffect(() => {
    clearTimer();
    if (state.isPlaying) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.currentStep >= prev.steps.length - 1) {
            return { ...prev, isPlaying: false };
          }
          return { ...prev, currentStep: prev.currentStep + 1 };
        });
      }, 1000 / state.speed);
    }
    return clearTimer;
  }, [state.isPlaying, state.speed, clearTimer]);

  const currentStepData = state.steps[state.currentStep] ?? null;

  return {
    currentStep: state.currentStep,
    totalSteps: state.steps.length,
    isPlaying: state.isPlaying,
    speed: state.speed,
    currentStepData,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    setSpeed,
  };
}
```

- [ ] **Step 2: Create algorithm hook**

Create `src/hooks/use-algorithm.ts`:

```ts
"use client";

import { useState, useEffect } from "react";
import { Algorithm, Step } from "@/algorithms/types";
import { getAlgorithm } from "@/algorithms/registry";

export function useAlgorithm(slug: string) {
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [presetIndex, setPresetIndex] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAlgorithm(slug).then((algo) => {
      setAlgorithm(algo);
      if (algo) {
        const initialSteps = algo.generateSteps(algo.presets[0].data);
        setSteps(initialSteps);
      }
      setLoading(false);
    });
  }, [slug]);

  const selectPreset = (index: number) => {
    if (!algorithm) return;
    setPresetIndex(index);
    const newSteps = algorithm.generateSteps(algorithm.presets[index].data);
    setSteps(newSteps);
  };

  return { algorithm, steps, presetIndex, selectPreset, loading };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-playback.ts src/hooks/use-algorithm.ts
git commit -m "feat: add playback and algorithm hooks"
```

---

### Task 10: 3D Scene Components

**Files:**
- Create: `src/components/scene-wrapper.tsx`, `src/three/cube-node.tsx`, `src/three/sphere-node.tsx`, `src/three/edge-line.tsx`, `src/three/array-scene.tsx`, `src/three/tree-scene.tsx`, `src/three/linked-list-scene.tsx`, `src/three/graph-scene.tsx`

- [ ] **Step 1: Create scene wrapper**

Create `src/components/scene-wrapper.tsx`:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

export function SceneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#00D4FF" />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={30}
      />
      <Grid
        infiniteGrid
        fadeDistance={30}
        fadeStrength={2}
        cellSize={1}
        sectionSize={5}
        cellColor="#1E2A3F"
        sectionColor="#1E2A3F"
      />
      {children}
    </Canvas>
  );
}
```

- [ ] **Step 2: Create cube node**

Create `src/three/cube-node.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { COLORS, NODE_SIZE } from "@/lib/constants";

interface CubeNodeProps {
  position: [number, number, number];
  value: number | string;
  state: "default" | "active" | "visited";
}

export function CubeNode({ position, value, state }: CubeNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3(...position));

  targetPos.current.set(...position);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(targetPos.current, 0.1);
    }
  });

  const color =
    state === "active"
      ? COLORS.active
      : state === "visited"
        ? COLORS.visited
        : COLORS.primary;

  const emissiveIntensity = state === "active" ? 0.5 : state === "visited" ? 0.1 : 0.2;

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[NODE_SIZE, NODE_SIZE, NODE_SIZE]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Text
        position={[position[0], position[1] + NODE_SIZE * 0.8, position[2]]}
        fontSize={0.4}
        color={COLORS.textPrimary}
        anchorX="center"
        anchorY="middle"
      >
        {String(value)}
      </Text>
    </group>
  );
}
```

- [ ] **Step 3: Create sphere node**

Create `src/three/sphere-node.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { COLORS } from "@/lib/constants";

interface SphereNodeProps {
  position: [number, number, number];
  value: number | string;
  state: "default" | "active" | "visited";
}

export function SphereNode({ position, value, state }: SphereNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3(...position));

  targetPos.current.set(...position);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(targetPos.current, 0.1);
    }
  });

  const color =
    state === "active"
      ? COLORS.active
      : state === "visited"
        ? COLORS.visited
        : COLORS.primary;

  const emissiveIntensity = state === "active" ? 0.5 : state === "visited" ? 0.1 : 0.2;

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Text
        position={[position[0], position[1], position[2] + 0.6]}
        fontSize={0.35}
        color={COLORS.textPrimary}
        anchorX="center"
        anchorY="middle"
      >
        {String(value)}
      </Text>
    </group>
  );
}
```

- [ ] **Step 4: Create edge line**

Create `src/three/edge-line.tsx`:

```tsx
"use client";

import { Line } from "@react-three/drei";
import { COLORS } from "@/lib/constants";

interface EdgeLineProps {
  start: [number, number, number];
  end: [number, number, number];
  active?: boolean;
}

export function EdgeLine({ start, end, active = false }: EdgeLineProps) {
  return (
    <Line
      points={[start, end]}
      color={active ? COLORS.active : COLORS.surfaceBorder}
      lineWidth={active ? 2 : 1}
      opacity={active ? 1 : 0.5}
      transparent
    />
  );
}
```

- [ ] **Step 5: Create array scene**

Create `src/three/array-scene.tsx`:

```tsx
"use client";

import { Step } from "@/algorithms/types";
import { CubeNode } from "./cube-node";
import { SPACING } from "@/lib/constants";

interface ArraySceneProps {
  data: number[];
  step: Step | null;
}

export function ArrayScene({ data, step }: ArraySceneProps) {
  const offset = ((data.length - 1) * SPACING) / 2;

  return (
    <group>
      {data.map((value, i) => {
        const id = `node-${i}`;
        const isActive = step?.highlights.includes(id) ?? false;
        const isVisited = step?.visited.includes(id) ?? false;
        const state = isActive ? "active" : isVisited ? "visited" : "default";

        return (
          <CubeNode
            key={i}
            position={[i * SPACING - offset, 0, 0]}
            value={value}
            state={state}
          />
        );
      })}
    </group>
  );
}
```

- [ ] **Step 6: Create tree scene**

Create `src/three/tree-scene.tsx`:

```tsx
"use client";

import { Step, TreeNode } from "@/algorithms/types";
import { SphereNode } from "./sphere-node";
import { EdgeLine } from "./edge-line";

interface TreeSceneProps {
  root: TreeNode;
  step: Step | null;
}

interface FlatNode {
  id: string;
  value: number;
  position: [number, number, number];
  parentPosition?: [number, number, number];
}

function flattenTree(
  node: TreeNode | undefined,
  prefix: string,
  depth: number,
  xOffset: number,
  spread: number,
  result: FlatNode[],
  parentPos?: [number, number, number]
): void {
  if (!node) return;
  const pos: [number, number, number] = [xOffset, -depth * 2, 0];
  result.push({ id: prefix, value: node.value, position: pos, parentPosition: parentPos });
  flattenTree(node.left, `${prefix}-L`, depth + 1, xOffset - spread, spread / 2, result, pos);
  flattenTree(node.right, `${prefix}-R`, depth + 1, xOffset + spread, spread / 2, result, pos);
}

export function TreeScene({ root, step }: TreeSceneProps) {
  const nodes: FlatNode[] = [];
  flattenTree(root, "root", 0, 0, 3, nodes);

  return (
    <group>
      {nodes.map((node) => {
        if (node.parentPosition) {
          return (
            <EdgeLine
              key={`edge-${node.id}`}
              start={node.parentPosition}
              end={node.position}
              active={step?.highlights.includes(node.id)}
            />
          );
        }
        return null;
      })}
      {nodes.map((node) => {
        const isActive = step?.highlights.includes(node.id) ?? false;
        const isVisited = step?.visited.includes(node.id) ?? false;
        const state = isActive ? "active" : isVisited ? "visited" : "default";

        return (
          <SphereNode
            key={node.id}
            position={node.position}
            value={node.value}
            state={state}
          />
        );
      })}
    </group>
  );
}
```

- [ ] **Step 7: Create linked list scene**

Create `src/three/linked-list-scene.tsx`:

```tsx
"use client";

import { Step } from "@/algorithms/types";
import { SphereNode } from "./sphere-node";
import { EdgeLine } from "./edge-line";
import { SPACING } from "@/lib/constants";

interface LinkedListSceneProps {
  values: number[];
  step: Step | null;
}

export function LinkedListScene({ values, step }: LinkedListSceneProps) {
  const offset = ((values.length - 1) * SPACING) / 2;

  return (
    <group>
      {values.map((_, i) => {
        if (i < values.length - 1) {
          const start: [number, number, number] = [i * SPACING - offset, 0, 0];
          const end: [number, number, number] = [(i + 1) * SPACING - offset, 0, 0];
          const isActive =
            step?.highlights.includes(`node-${i}`) &&
            step?.highlights.includes(`node-${i + 1}`);

          return (
            <EdgeLine
              key={`edge-${i}`}
              start={start}
              end={end}
              active={isActive}
            />
          );
        }
        return null;
      })}
      {values.map((value, i) => {
        const id = `node-${i}`;
        const isActive = step?.highlights.includes(id) ?? false;
        const isVisited = step?.visited.includes(id) ?? false;
        const state = isActive ? "active" : isVisited ? "visited" : "default";

        return (
          <SphereNode
            key={i}
            position={[i * SPACING - offset, 0, 0]}
            value={value}
            state={state}
          />
        );
      })}
    </group>
  );
}
```

- [ ] **Step 8: Create graph scene**

Create `src/three/graph-scene.tsx`:

```tsx
"use client";

import { Step } from "@/algorithms/types";
import { SphereNode } from "./sphere-node";
import { EdgeLine } from "./edge-line";

interface GraphSceneProps {
  nodes: string[];
  edges: [string, string][];
  step: Step | null;
}

function layoutGraphNodes(nodeNames: string[]): Record<string, [number, number, number]> {
  const positions: Record<string, [number, number, number]> = {};
  const count = nodeNames.length;
  const radius = Math.max(2, count * 0.8);

  nodeNames.forEach((name, i) => {
    const angle = (i / count) * Math.PI * 2;
    positions[name] = [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.5,
      Math.sin(angle) * radius * 0.3,
    ];
  });

  return positions;
}

export function GraphScene({ nodes, edges, step }: GraphSceneProps) {
  const positions = layoutGraphNodes(nodes);

  return (
    <group>
      {edges.map(([a, b], i) => {
        const active =
          step?.highlights.includes(`node-${a}`) &&
          step?.highlights.includes(`node-${b}`);

        return (
          <EdgeLine
            key={`edge-${i}`}
            start={positions[a]}
            end={positions[b]}
            active={active}
          />
        );
      })}
      {nodes.map((name) => {
        const id = `node-${name}`;
        const isActive = step?.highlights.includes(id) ?? false;
        const isVisited = step?.visited.includes(id) ?? false;
        const state = isActive ? "active" : isVisited ? "visited" : "default";

        return (
          <SphereNode
            key={name}
            position={positions[name]}
            value={name}
            state={state}
          />
        );
      })}
    </group>
  );
}
```

- [ ] **Step 9: Commit**

```bash
git add src/components/scene-wrapper.tsx src/three/
git commit -m "feat: add 3D scene components (cube, sphere, edge, array, tree, linked list, graph)"
```

---

### Task 11: UI Components

**Files:**
- Create: `src/components/playback-controls.tsx`, `src/components/code-panel.tsx`, `src/components/preset-selector.tsx`, `src/components/category-tabs.tsx`, `src/components/algorithm-card.tsx`, `src/components/top-bar.tsx`

- [ ] **Step 1: Create playback controls**

Create `src/components/playback-controls.tsx`:

```tsx
"use client";

import { SPEEDS } from "@/lib/constants";

interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export function PlaybackControls({
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onReset}
        className="px-3 py-1.5 rounded bg-[#131A2B] border border-[#1E2A3F] hover:border-[#00D4FF] text-sm transition-colors"
      >
        Reset
      </button>
      <button
        onClick={onStepBackward}
        disabled={currentStep <= 0}
        className="px-3 py-1.5 rounded bg-[#131A2B] border border-[#1E2A3F] hover:border-[#00D4FF] text-sm transition-colors disabled:opacity-30"
      >
        ⏮
      </button>
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="px-4 py-1.5 rounded bg-[#00D4FF] text-[#0B0F1A] font-semibold text-sm hover:bg-[#00B8E0] transition-colors"
      >
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>
      <button
        onClick={onStepForward}
        disabled={currentStep >= totalSteps - 1}
        className="px-3 py-1.5 rounded bg-[#131A2B] border border-[#1E2A3F] hover:border-[#00D4FF] text-sm transition-colors disabled:opacity-30"
      >
        ⏭
      </button>
      <span className="text-xs text-[#8899AA] ml-2">
        {currentStep + 1} / {totalSteps}
      </span>
      <div className="flex items-center gap-2 ml-4">
        <span className="text-xs text-[#8899AA]">Speed:</span>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="bg-[#131A2B] border border-[#1E2A3F] rounded px-2 py-1 text-xs text-white"
        >
          {SPEEDS.map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create code panel**

Create `src/components/code-panel.tsx`:

```tsx
"use client";

interface CodePanelProps {
  code: string[];
  activeCodeLine: number;
  stepLabel: string;
  complexity: { time: string; space: string };
  leetcodeProblems: string[];
}

export function CodePanel({
  code,
  activeCodeLine,
  stepLabel,
  complexity,
  leetcodeProblems,
}: CodePanelProps) {
  return (
    <div className="flex flex-col h-full bg-[#0D1117] rounded-lg border border-[#1E2A3F] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1E2A3F]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded bg-[#131A2B] border border-[#1E2A3F] text-[#00D4FF]">
            {complexity.time}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#131A2B] border border-[#1E2A3F] text-[#00D4FF]">
            {complexity.space}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {leetcodeProblems.map((p) => (
            <span
              key={p}
              className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A3A5C] text-[#8899AA]"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {code.map((line, i) => (
          <div
            key={i}
            className={`px-2 py-0.5 rounded transition-colors ${
              i === activeCodeLine
                ? "bg-[#FFB800]/20 text-[#FFB800]"
                : "text-[#8899AA]"
            }`}
          >
            <span className="inline-block w-6 text-right mr-3 text-[#3A4A5C]">
              {i + 1}
            </span>
            {line}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-[#1E2A3F] bg-[#131A2B]">
        <p className="text-sm text-[#00D4FF]">{stepLabel}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create preset selector**

Create `src/components/preset-selector.tsx`:

```tsx
"use client";

import { Preset } from "@/algorithms/types";

interface PresetSelectorProps {
  presets: Preset[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function PresetSelector({ presets, selectedIndex, onSelect }: PresetSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#8899AA]">Input:</span>
      <select
        value={selectedIndex}
        onChange={(e) => onSelect(Number(e.target.value))}
        className="bg-[#131A2B] border border-[#1E2A3F] rounded px-2 py-1 text-xs text-white"
      >
        {presets.map((p, i) => (
          <option key={i} value={i}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 4: Create category tabs**

Create `src/components/category-tabs.tsx`:

```tsx
"use client";

import { Category } from "@/algorithms/types";

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Arrays",
  "Trees",
  "Linked Lists",
  "Graphs",
];

interface CategoryTabsProps {
  selected: "All" | Category;
  onSelect: (category: "All" | Category) => void;
}

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === cat
              ? "bg-[#00D4FF] text-[#0B0F1A]"
              : "bg-[#131A2B] text-[#8899AA] border border-[#1E2A3F] hover:border-[#00D4FF]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create algorithm card**

Create `src/components/algorithm-card.tsx`:

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Algorithm } from "@/algorithms/types";

interface AlgorithmCardProps {
  algorithm: Algorithm;
}

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  return (
    <Link href={`/visualizer/${algorithm.slug}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative bg-[#131A2B] rounded-xl border border-[#1E2A3F] p-5 cursor-pointer transition-colors hover:border-[#00D4FF] group overflow-hidden"
      >
        <div className="h-40 rounded-lg bg-[#0B0F1A] mb-4 flex items-center justify-center border border-[#1E2A3F] group-hover:border-[#00D4FF]/30 transition-colors">
          <span className="text-[#1E2A3F] text-sm">3D Preview</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{algorithm.name}</h3>
        <p className="text-sm text-[#8899AA] mb-3">{algorithm.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-[#0B0F1A] border border-[#1E2A3F] text-[#00D4FF]">
            {algorithm.complexity.time}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#0B0F1A] border border-[#1E2A3F] text-[#00D4FF]">
            {algorithm.complexity.space}
          </span>
          <span className="text-xs text-[#3A4A5C] ml-auto">{algorithm.category}</span>
        </div>
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: "inset 0 0 30px rgba(0, 212, 255, 0.05), 0 0 15px rgba(0, 212, 255, 0.1)",
          }}
        />
      </motion.div>
    </Link>
  );
}
```

- [ ] **Step 6: Create top bar**

Create `src/components/top-bar.tsx`:

```tsx
"use client";

import Link from "next/link";

export function TopBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-[#1E2A3F]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="text-xl font-bold text-[#00D4FF]"
            style={{ textShadow: "0 0 20px rgba(0, 212, 255, 0.3)" }}
          >
            AlgoVision 3D
          </span>
        </Link>
        <div className="flex-1 flex items-center justify-center">
          {children}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/
git commit -m "feat: add UI components (playback, code panel, cards, tabs, top bar)"
```

---

### Task 12: Home Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build home page with tabs and card grid**

Replace `src/app/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/top-bar";
import { CategoryTabs } from "@/components/category-tabs";
import { AlgorithmCard } from "@/components/algorithm-card";
import { Algorithm, Category } from "@/algorithms/types";
import { getAllSlugs, getAlgorithm } from "@/algorithms/registry";

export default function Home() {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [category, setCategory] = useState<"All" | Category>("All");

  useEffect(() => {
    Promise.all(getAllSlugs().map((slug) => getAlgorithm(slug))).then((results) => {
      setAlgorithms(results.filter(Boolean) as Algorithm[]);
    });
  }, []);

  const filtered =
    category === "All"
      ? algorithms
      : algorithms.filter((a) => a.category === category);

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ textShadow: "0 0 30px rgba(0, 212, 255, 0.2)" }}
          >
            Visualize Algorithms in 3D
          </h1>
          <p className="text-[#8899AA]">
            Don&apos;t just solve LeetCode — <em>see</em> it happen.
          </p>
        </div>
        <CategoryTabs selected={category} onSelect={setCategory} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((algo) => (
            <AlgorithmCard key={algo.slug} algorithm={algo} />
          ))}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: build home page with category tabs and algorithm card grid"
```

---

### Task 13: Visualizer Page

**Files:**
- Create: `src/app/visualizer/[slug]/page.tsx`, `src/components/visualizer-view.tsx`

- [ ] **Step 1: Create visualizer view component**

Create `src/components/visualizer-view.tsx`:

```tsx
"use client";

import { Algorithm, Step, ArrayPresetData, TreePresetData, LinkedListPresetData, GraphPresetData } from "@/algorithms/types";
import { SceneWrapper } from "./scene-wrapper";
import { CodePanel } from "./code-panel";
import { ArrayScene } from "@/three/array-scene";
import { TreeScene } from "@/three/tree-scene";
import { LinkedListScene } from "@/three/linked-list-scene";
import { GraphScene } from "@/three/graph-scene";

interface VisualizerViewProps {
  algorithm: Algorithm;
  presetData: unknown;
  currentStep: Step | null;
}

function SceneForAlgorithm({
  algorithm,
  presetData,
  currentStep,
}: {
  algorithm: Algorithm;
  presetData: unknown;
  currentStep: Step | null;
}) {
  switch (algorithm.category) {
    case "Arrays": {
      const { array } = presetData as ArrayPresetData;
      return <ArrayScene data={array} step={currentStep} />;
    }
    case "Trees": {
      const { root } = presetData as TreePresetData;
      return <TreeScene root={root} step={currentStep} />;
    }
    case "Linked Lists": {
      const { values } = presetData as LinkedListPresetData;
      return <LinkedListScene values={values} step={currentStep} />;
    }
    case "Graphs": {
      const { nodes, edges } = presetData as GraphPresetData;
      return <GraphScene nodes={nodes} edges={edges} step={currentStep} />;
    }
  }
}

export function VisualizerView({ algorithm, presetData, currentStep }: VisualizerViewProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      <div className="flex-1 min-h-[400px] rounded-xl border border-[#1E2A3F] overflow-hidden bg-[#0B0F1A]">
        <SceneWrapper>
          <SceneForAlgorithm
            algorithm={algorithm}
            presetData={presetData}
            currentStep={currentStep}
          />
        </SceneWrapper>
      </div>
      <div className="w-full lg:w-[350px] min-h-[300px]">
        <CodePanel
          code={algorithm.code}
          activeCodeLine={currentStep?.activeCodeLine ?? -1}
          stepLabel={currentStep?.label ?? "Ready"}
          complexity={algorithm.complexity}
          leetcodeProblems={algorithm.leetcodeProblems}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create visualizer page**

Create `src/app/visualizer/[slug]/page.tsx`:

```tsx
"use client";

import { use } from "react";
import Link from "next/link";
import { useAlgorithm } from "@/hooks/use-algorithm";
import { usePlayback } from "@/hooks/use-playback";
import { TopBar } from "@/components/top-bar";
import { PlaybackControls } from "@/components/playback-controls";
import { PresetSelector } from "@/components/preset-selector";
import { VisualizerView } from "@/components/visualizer-view";

export default function VisualizerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { algorithm, steps, presetIndex, selectPreset, loading } = useAlgorithm(slug);
  const playback = usePlayback(steps);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-[#00D4FF] text-lg">Loading...</span>
      </div>
    );
  }

  if (!algorithm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8899AA] mb-4">Algorithm not found</p>
          <Link href="/" className="text-[#00D4FF] hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar>
        <PlaybackControls
          isPlaying={playback.isPlaying}
          speed={playback.speed}
          currentStep={playback.currentStep}
          totalSteps={playback.totalSteps}
          onPlay={playback.play}
          onPause={playback.pause}
          onStepForward={playback.stepForward}
          onStepBackward={playback.stepBackward}
          onReset={playback.reset}
          onSpeedChange={playback.setSpeed}
        />
      </TopBar>
      <main className="flex-1 flex flex-col p-6 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-[#8899AA] hover:text-[#00D4FF] transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-bold">{algorithm.name}</h1>
          </div>
          <PresetSelector
            presets={algorithm.presets}
            selectedIndex={presetIndex}
            onSelect={(i) => {
              selectPreset(i);
              playback.reset();
            }}
          />
        </div>
        <VisualizerView
          algorithm={algorithm}
          presetData={algorithm.presets[presetIndex].data}
          currentStep={playback.currentStepData}
        />
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/visualizer-view.tsx src/app/visualizer/
git commit -m "feat: build fullscreen visualizer page with 3D canvas and code panel"
```

---

### Task 14: Mini 3D Previews on Cards

**Files:**
- Modify: `src/components/algorithm-card.tsx`
- Create: `src/three/mini-preview.tsx`

- [ ] **Step 1: Create mini preview component**

Create `src/three/mini-preview.tsx`:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Algorithm, ArrayPresetData, TreePresetData, LinkedListPresetData, GraphPresetData } from "@/algorithms/types";
import { ArrayScene } from "./array-scene";
import { TreeScene } from "./tree-scene";
import { LinkedListScene } from "./linked-list-scene";
import { GraphScene } from "./graph-scene";

interface MiniPreviewProps {
  algorithm: Algorithm;
}

function PreviewScene({ algorithm }: { algorithm: Algorithm }) {
  const data = algorithm.presets[0].data;

  switch (algorithm.category) {
    case "Arrays": {
      const { array } = data as ArrayPresetData;
      return <ArrayScene data={array} step={null} />;
    }
    case "Trees": {
      const { root } = data as TreePresetData;
      return <TreeScene root={root} step={null} />;
    }
    case "Linked Lists": {
      const { values } = data as LinkedListPresetData;
      return <LinkedListScene values={values} step={null} />;
    }
    case "Graphs": {
      const { nodes, edges } = data as GraphPresetData;
      return <GraphScene nodes={nodes} edges={edges} step={null} />;
    }
  }
}

export function MiniPreview({ algorithm }: MiniPreviewProps) {
  return (
    <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, 5, -10]} intensity={0.2} color="#00D4FF" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      <PreviewScene algorithm={algorithm} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Update algorithm card to use mini preview**

Replace the placeholder div in `src/components/algorithm-card.tsx`:

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Algorithm } from "@/algorithms/types";
import { MiniPreview } from "@/three/mini-preview";

interface AlgorithmCardProps {
  algorithm: Algorithm;
}

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  return (
    <Link href={`/visualizer/${algorithm.slug}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative bg-[#131A2B] rounded-xl border border-[#1E2A3F] p-5 cursor-pointer transition-colors hover:border-[#00D4FF] group overflow-hidden"
      >
        <div className="h-40 rounded-lg bg-[#0B0F1A] mb-4 overflow-hidden border border-[#1E2A3F] group-hover:border-[#00D4FF]/30 transition-colors">
          <MiniPreview algorithm={algorithm} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{algorithm.name}</h3>
        <p className="text-sm text-[#8899AA] mb-3">{algorithm.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-[#0B0F1A] border border-[#1E2A3F] text-[#00D4FF]">
            {algorithm.complexity.time}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#0B0F1A] border border-[#1E2A3F] text-[#00D4FF]">
            {algorithm.complexity.space}
          </span>
          <span className="text-xs text-[#3A4A5C] ml-auto">{algorithm.category}</span>
        </div>
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: "inset 0 0 30px rgba(0, 212, 255, 0.05), 0 0 15px rgba(0, 212, 255, 0.1)",
          }}
        />
      </motion.div>
    </Link>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/three/mini-preview.tsx src/components/algorithm-card.tsx
git commit -m "feat: add live 3D mini previews on algorithm cards"
```

---

### Task 15: Integration Test & Polish

- [ ] **Step 1: Run dev server and verify home page loads**

```bash
npm run dev
```

Expected: Home page shows category tabs, 6 algorithm cards with 3D previews.

- [ ] **Step 2: Verify clicking a card navigates to visualizer**

Navigate to `/visualizer/bubble-sort`. Expected: 3D canvas with cubes, code panel on right, playback controls in top bar.

- [ ] **Step 3: Verify playback works**

Click Play. Expected: Steps animate, cubes highlight yellow, code line highlights, step label updates.

- [ ] **Step 4: Verify all 6 algorithms render**

Navigate to each: `bubble-sort`, `binary-search`, `sliding-window`, `binary-tree-dfs`, `linked-list-reversal`, `graph-bfs`. Each should render its 3D scene.

- [ ] **Step 5: Verify preset switching**

Change preset dropdown. Expected: Scene resets with new data.

- [ ] **Step 6: Fix any issues found**

- [ ] **Step 7: Build production bundle**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "feat: AlgoVision 3D MVP complete — 6 algorithms with 3D visualization and step-through playback"
```
