import { Algorithm, Step, GraphPresetData } from "./types";

const dijkstra: Algorithm = {
  name: "Dijkstra's Algorithm",
  slug: "dijkstra",
  category: "Graphs",
  description: "Find the shortest path from a source to all other nodes in a weighted graph.",
  longDescription: "Dijkstra's Algorithm greedily picks the unvisited node with the smallest known distance, then updates distances to its neighbors. It builds a shortest-path tree outward from the source. Watch distances get updated as cheaper paths are discovered through newly visited nodes. It works only with non-negative edge weights — for negative weights, use Bellman-Ford instead.",
  complexity: { time: "O((V+E) log V)", space: "O(V)" },
  code: [
    "function dijkstra(graph, start) {",
    "  const dist = { [start]: 0 };",
    "  const pq = [[0, start]];",
    "  while (pq.length > 0) {",
    "    pq.sort((a,b) => a[0]-b[0]);",
    "    const [d, u] = pq.shift();",
    "    if (d > (dist[u] ?? Infinity)) continue;",
    "    for (const [v, w] of graph[u]) {",
    "      const nd = d + w;",
    "      if (nd < (dist[v] ?? Infinity)) {",
    "        dist[v] = nd;",
    "        pq.push([nd, v]);",
    "      }",
    "    }",
    "  }",
    "  return dist;",
    "}",
  ],
  presets: [
    {
      name: "Weighted Graph",
      data: {
        nodes: ["A", "B", "C", "D", "E"],
        edges: [["A", "B"], ["A", "C"], ["B", "C"], ["B", "D"], ["C", "D"], ["C", "E"], ["D", "E"]] as [string, string][],
        startNode: "A",
        weights: { "A-B": 4, "A-C": 2, "B-C": 1, "B-D": 5, "C-D": 8, "C-E": 10, "D-E": 2 },
      },
    },
    {
      name: "Linear Path",
      data: {
        nodes: ["A", "B", "C", "D", "E"],
        edges: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"]] as [string, string][],
        startNode: "A",
        weights: { "A-B": 1, "B-C": 2, "C-D": 3, "D-E": 4 },
      },
    },
    {
      name: "Star Graph",
      data: {
        nodes: ["A", "B", "C", "D", "E", "F"],
        edges: [["A", "B"], ["A", "C"], ["A", "D"], ["A", "E"], ["A", "F"]] as [string, string][],
        startNode: "A",
        weights: { "A-B": 3, "A-C": 1, "A-D": 7, "A-E": 2, "A-F": 5 },
      },
    },
  ],
  leetcodeProblems: ["#743 Network Delay Time", "#787 Cheapest Flights Within K Stops"],
  generateSteps: (data: unknown): Step[] => {
    const { nodes, edges, startNode } = data as GraphPresetData;
    const presetData = data as GraphPresetData & { weights?: Record<string, number> };
    const weights = presetData.weights ?? {};
    const steps: Step[] = [];

    // Build weighted adjacency list
    const adjacency: Record<string, { node: string; weight: number }[]> = {};
    for (const node of nodes) adjacency[node] = [];
    for (const [a, b] of edges) {
      const key1 = `${a}-${b}`;
      const key2 = `${b}-${a}`;
      const w = weights[key1] ?? weights[key2] ?? 1;
      adjacency[a].push({ node: b, weight: w });
      adjacency[b].push({ node: a, weight: w });
    }

    const dist: Record<string, number> = {};
    for (const node of nodes) dist[node] = Infinity;
    dist[startNode] = 0;

    const pq: [number, string][] = [[0, startNode]];
    const visitedList: string[] = [];
    const visited = new Set<string>();

    steps.push({
      highlights: [`node-${startNode}`],
      visited: [],
      activeCodeLine: 1,
      label: `Initialize distances. dist[${startNode}] = 0, all others = Infinity`,
    });

    while (pq.length > 0) {
      pq.sort((a, b) => a[0] - b[0]);
      const [d, u] = pq.shift()!;

      if (visited.has(u)) continue;
      visited.add(u);
      visitedList.push(u);

      steps.push({
        highlights: [`node-${u}`],
        visited: visitedList.map((n) => `node-${n}`),
        activeCodeLine: 5,
        label: `Process node ${u} (dist = ${d})`,
      });

      for (const { node: v, weight: w } of adjacency[u]) {
        const nd = d + w;

        steps.push({
          highlights: [`node-${u}`, `node-${v}`],
          visited: visitedList.map((n) => `node-${n}`),
          activeCodeLine: 8,
          label: `Edge ${u}-${v} (weight ${w}): new dist = ${d} + ${w} = ${nd}`,
        });

        if (nd < dist[v]) {
          dist[v] = nd;
          pq.push([nd, v]);

          steps.push({
            highlights: [`node-${v}`],
            visited: visitedList.map((n) => `node-${n}`),
            activeCodeLine: 10,
            label: `Update dist[${v}] = ${nd} (shorter path found)`,
          });
        } else {
          steps.push({
            highlights: [`node-${v}`],
            visited: visitedList.map((n) => `node-${n}`),
            activeCodeLine: 9,
            label: `dist[${v}] = ${dist[v]} <= ${nd}, no update`,
          });
        }
      }
    }

    const distStr = nodes.map((n) => `${n}:${dist[n] === Infinity ? "unreachable" : dist[n]}`).join(", ");
    steps.push({
      highlights: [],
      visited: nodes.map((n) => `node-${n}`),
      activeCodeLine: 16,
      label: `Dijkstra complete! Distances: ${distStr}`,
    });

    return steps;
  },
};

export default dijkstra;
