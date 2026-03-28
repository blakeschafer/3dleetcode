import { Algorithm, Step, GraphPresetData } from "./types";

const depthLimitedSearch: Algorithm = {
  name: "Depth-Limited Search",
  slug: "depth-limited-search",
  category: "Graphs",
  description:
    "Perform DFS but stop exploring once a specified depth limit is reached, preventing infinite descent in deep or cyclic graphs.",
  complexity: { time: "O(b^l)", space: "O(l)" },
  code: [
    "function dls(graph, node, goal, limit) {",
    "  if (node === goal) return true;",
    "  if (limit <= 0) return false;",
    "  for (const neighbor of graph[node]) {",
    "    if (dls(graph, neighbor, goal, limit - 1))",
    "      return true;",
    "  }",
    "  return false;",
    "}",
  ],
  presets: [
    {
      name: "Depth Limit 2",
      data: {
        nodes: ["A", "B", "C", "D", "E", "F"],
        edges: [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"]] as [string, string][],
        startNode: "A",
      },
    },
    {
      name: "Depth Limit 1",
      data: {
        nodes: ["A", "B", "C", "D"],
        edges: [["A", "B"], ["A", "C"], ["B", "D"]] as [string, string][],
        startNode: "A",
      },
    },
    {
      name: "Depth Limit 3",
      data: {
        nodes: ["A", "B", "C", "D", "E"],
        edges: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"]] as [string, string][],
        startNode: "A",
      },
    },
  ],
  leetcodeProblems: ["#200 Number of Islands"],
  generateSteps: (data: unknown): Step[] => {
    const { nodes, edges, startNode } = data as GraphPresetData;
    const steps: Step[] = [];

    // Determine depth limit from preset index (based on number of nodes)
    const depthLimit = nodes.length <= 4 ? 1 : nodes.length <= 5 ? 3 : 2;

    const adjacency: Record<string, string[]> = {};
    for (const node of nodes) adjacency[node] = [];
    for (const [a, b] of edges) {
      adjacency[a].push(b);
      adjacency[b].push(a);
    }

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: `Start depth-limited search from ${startNode} (limit = ${depthLimit})`,
    });

    const visitedSet = new Set<string>();
    const visitedList: string[] = [];

    function dls(node: string, depth: number): void {
      if (visitedSet.has(node)) return;
      visitedSet.add(node);
      visitedList.push(node);

      steps.push({
        highlights: [`node-${node}`],
        visited: visitedList.map((n) => `node-${n}`),
        activeCodeLine: 1,
        label: `Visit ${node} at depth ${depthLimit - depth}`,
      });

      if (depth <= 0) {
        steps.push({
          highlights: [`node-${node}`],
          visited: visitedList.map((n) => `node-${n}`),
          activeCodeLine: 2,
          label: `Depth limit reached at ${node} — backtrack`,
        });
        return;
      }

      for (const neighbor of adjacency[node]) {
        if (!visitedSet.has(neighbor)) {
          steps.push({
            highlights: [`node-${node}`, `node-${neighbor}`],
            visited: visitedList.map((n) => `node-${n}`),
            activeCodeLine: 3,
            label: `Explore neighbor ${neighbor} of ${node}`,
          });
          dls(neighbor, depth - 1);
        }
      }
    }

    dls(startNode, depthLimit);

    const unreached = nodes.filter((n) => !visitedSet.has(n));
    steps.push({
      highlights: [],
      visited: visitedList.map((n) => `node-${n}`),
      activeCodeLine: 7,
      label: unreached.length > 0
        ? `DLS complete. Visited: ${visitedList.join(", ")}. Not reached: ${unreached.join(", ")}`
        : `DLS complete. All nodes visited: ${visitedList.join(" → ")}`,
    });

    return steps;
  },
};

export default depthLimitedSearch;
