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
