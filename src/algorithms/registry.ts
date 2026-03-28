import { Algorithm } from "./types";

const algorithmModules: Record<string, () => Promise<{ default: Algorithm }>> = {
  "bubble-sort": () => import("./bubble-sort"),
  "binary-tree-dfs": () => import("./binary-tree-dfs"),
  "linked-list-reversal": () => import("./linked-list-reversal"),
  "graph-bfs": () => import("./graph-bfs"),
  "binary-search": () => import("./binary-search"),
  "sliding-window": () => import("./sliding-window"),
  "merge-sort": () => import("./merge-sort"),
  "quick-sort": () => import("./quick-sort"),
  "insertion-sort": () => import("./insertion-sort"),
  "two-pointers": () => import("./two-pointers"),
  "binary-tree-bfs": () => import("./binary-tree-bfs"),
  "heap-insert": () => import("./heap-insert"),
  "graph-dfs": () => import("./graph-dfs"),
  "dijkstra": () => import("./dijkstra"),
  "stack-operations": () => import("./stack-operations"),
  "linked-list-cycle": () => import("./linked-list-cycle"),
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
