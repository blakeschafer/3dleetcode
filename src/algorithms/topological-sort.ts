import { Algorithm, Step, GraphPresetData } from "./types";

const topologicalSort: Algorithm = {
  name: "Topological Sort (Kahn's)",
  slug: "topological-sort",
  category: "Graphs",
  description:
    "Kahn's algorithm: repeatedly remove nodes with in-degree 0 to produce a valid topological ordering of a DAG.",
  complexity: { time: "O(V+E)", space: "O(V)" },
  code: [
    "function topologicalSort(nodes, edges) {",
    "  const inDegree = {}, adj = {};",
    "  // Initialize",
    "  for (const n of nodes) { inDegree[n] = 0; adj[n] = []; }",
    "  for (const [u, v] of edges) {",
    "    adj[u].push(v); inDegree[v]++;",
    "  }",
    "  const queue = nodes.filter(n => inDegree[n] === 0);",
    "  const order = [];",
    "  while (queue.length > 0) {",
    "    const node = queue.shift();",
    "    order.push(node);",
    "    for (const neighbor of adj[node]) {",
    "      inDegree[neighbor]--;",
    "      if (inDegree[neighbor] === 0) queue.push(neighbor);",
    "    }",
    "  }",
    "  return order;",
    "}",
  ],
  presets: [
    {
      name: "Course Schedule (6 nodes)",
      data: {
        nodes: ["A", "B", "C", "D", "E", "F"],
        edges: [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"], ["D", "E"], ["E", "F"]] as [string, string][],
        startNode: "A",
      },
    },
    {
      name: "Linear Chain",
      data: {
        nodes: ["A", "B", "C", "D"],
        edges: [["A", "B"], ["B", "C"], ["C", "D"]] as [string, string][],
        startNode: "A",
      },
    },
    {
      name: "Diamond",
      data: {
        nodes: ["A", "B", "C", "D"],
        edges: [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"]] as [string, string][],
        startNode: "A",
      },
    },
  ],
  leetcodeProblems: ["#207 Course Schedule", "#210 Course Schedule II"],
  generateSteps: (data: unknown): Step[] => {
    const { nodes, edges } = data as GraphPresetData;
    const steps: Step[] = [];

    const inDegree: Record<string, number> = {};
    const adj: Record<string, string[]> = {};
    for (const n of nodes) {
      inDegree[n] = 0;
      adj[n] = [];
    }
    for (const [u, v] of edges) {
      adj[u].push(v);
      inDegree[v]++;
    }

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start topological sort (Kahn's algorithm)",
    });

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 3,
      label: `In-degrees: ${nodes.map((n) => `${n}=${inDegree[n]}`).join(", ")}`,
    });

    const queue = nodes.filter((n) => inDegree[n] === 0);
    const order: string[] = [];
    const visited: string[] = [];

    steps.push({
      highlights: queue.map((n) => `node-${n}`),
      visited: [],
      activeCodeLine: 7,
      label: `Initial queue (in-degree 0): [${queue.join(", ")}]`,
    });

    while (queue.length > 0) {
      const node = queue.shift()!;
      order.push(node);
      visited.push(`node-${node}`);

      steps.push({
        highlights: [`node-${node}`],
        visited: [...visited],
        activeCodeLine: 10,
        label: `Dequeue ${node}, add to order: [${order.join(", ")}]`,
      });

      for (const neighbor of adj[node]) {
        inDegree[neighbor]--;

        steps.push({
          highlights: [`node-${node}`, `node-${neighbor}`],
          visited: [...visited],
          activeCodeLine: 13,
          label: `Decrement in-degree of ${neighbor} to ${inDegree[neighbor]}`,
        });

        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
          steps.push({
            highlights: [`node-${neighbor}`],
            visited: [...visited],
            activeCodeLine: 14,
            label: `${neighbor} has in-degree 0, add to queue`,
          });
        }
      }
    }

    steps.push({
      highlights: [],
      visited: nodes.map((n) => `node-${n}`),
      activeCodeLine: 17,
      label: `Topological order: ${order.join(" → ")}`,
    });

    return steps;
  },
};

export default topologicalSort;
