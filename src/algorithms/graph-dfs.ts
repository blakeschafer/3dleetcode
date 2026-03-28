import { Algorithm, Step, GraphPresetData } from "./types";

const graphDfs: Algorithm = {
  name: "Graph DFS",
  slug: "graph-dfs",
  category: "Graphs",
  description: "Explore a graph by going as deep as possible along each branch before backtracking.",
  complexity: { time: "O(V+E)", space: "O(V)" },
  code: [
    "function dfs(graph, start) {",
    "  const visited = new Set();",
    "  const stack = [start];",
    "  while (stack.length > 0) {",
    "    const node = stack.pop();",
    "    if (visited.has(node)) continue;",
    "    visited.add(node);",
    "    for (const neighbor of graph[node]) {",
    "      if (!visited.has(neighbor)) {",
    "        stack.push(neighbor);",
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
  leetcodeProblems: ["#200 Number of Islands", "#695 Max Area of Island"],
  generateSteps: (data: unknown): Step[] => {
    const { nodes, edges, startNode } = data as GraphPresetData;
    const steps: Step[] = [];

    const adjacency: Record<string, string[]> = {};
    for (const node of nodes) adjacency[node] = [];
    for (const [a, b] of edges) {
      adjacency[a].push(b);
      adjacency[b].push(a);
    }

    const visited = new Set<string>();
    const stack: string[] = [startNode];
    const visitedList: string[] = [];

    steps.push({
      highlights: [`node-${startNode}`],
      visited: [],
      activeCodeLine: 1,
      label: `Start DFS from node ${startNode}`,
    });

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (visited.has(current)) {
        steps.push({
          highlights: [`node-${current}`],
          visited: visitedList.map((n) => `node-${n}`),
          activeCodeLine: 5,
          label: `Node ${current} already visited, skip`,
        });
        continue;
      }

      visited.add(current);
      visitedList.push(current);

      steps.push({
        highlights: [`node-${current}`],
        visited: visitedList.map((n) => `node-${n}`),
        activeCodeLine: 6,
        label: `Visit node ${current}`,
      });

      for (const neighbor of adjacency[current]) {
        steps.push({
          highlights: [`node-${current}`, `node-${neighbor}`],
          visited: visitedList.map((n) => `node-${n}`),
          activeCodeLine: 7,
          label: `Check neighbor ${neighbor} of ${current}`,
        });

        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          steps.push({
            highlights: [`node-${neighbor}`],
            visited: visitedList.map((n) => `node-${n}`),
            activeCodeLine: 9,
            label: `Push ${neighbor} onto stack`,
          });
        }
      }
    }

    steps.push({
      highlights: [],
      visited: visitedList.map((n) => `node-${n}`),
      activeCodeLine: 13,
      label: `DFS complete! Visited: ${visitedList.join(" -> ")}`,
    });

    return steps;
  },
};

export default graphDfs;
