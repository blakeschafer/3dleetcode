import { Algorithm, Step, GraphPresetData } from "./types";

const kruskal: Algorithm = {
  name: "Kruskal's Algorithm",
  slug: "kruskal",
  category: "Graphs",
  description: "Build a minimum spanning tree by greedily adding the cheapest edges.",
  longDescription: "Kruskal's Algorithm sorts all edges by weight, then greedily adds the cheapest edge that doesn't create a cycle (using Union-Find to detect cycles). Watch edges get considered from lightest to heaviest, with some rejected for forming cycles. The result connects all nodes with minimum total edge weight — used in network design, clustering, and approximation algorithms.",
  complexity: { time: "O(E log E)", space: "O(V)" },
  code: [
    "function kruskal(nodes, edges) {",
    "  edges.sort((a, b) => a.weight - b.weight);",
    "  const parent = {};",
    "  for (const n of nodes) parent[n] = n;",
    "  function find(x) {",
    "    if (parent[x] !== x) parent[x] = find(parent[x]);",
    "    return parent[x];",
    "  }",
    "  const mst = [];",
    "  for (const {u, v, w} of edges) {",
    "    if (find(u) !== find(v)) {",
    "      parent[find(u)] = find(v);",
    "      mst.push({u, v, w});",
    "    }",
    "  }",
    "  return mst;",
    "}",
  ],
  presets: [
    {
      name: "5-Node Graph",
      data: {
        nodes: ["A", "B", "C", "D", "E"],
        edges: [["A", "B"], ["A", "C"], ["B", "C"], ["B", "D"], ["C", "D"], ["C", "E"], ["D", "E"]] as [string, string][],
        startNode: "A",
      },
    },
    {
      name: "Triangle",
      data: {
        nodes: ["A", "B", "C"],
        edges: [["A", "B"], ["B", "C"], ["A", "C"]] as [string, string][],
        startNode: "A",
      },
    },
    {
      name: "4-Node Square",
      data: {
        nodes: ["A", "B", "C", "D"],
        edges: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"]] as [string, string][],
        startNode: "A",
      },
    },
  ],
  leetcodeProblems: ["#1584 Min Cost to Connect All Points"],
  generateSteps: (data: unknown): Step[] => {
    const { nodes, edges } = data as GraphPresetData;
    const steps: Step[] = [];

    // Assign pseudo-weights based on edge order for demonstration
    const weightedEdges = edges.map(([u, v], i) => ({ u, v, weight: i + 1 }));
    weightedEdges.sort((a, b) => a.weight - b.weight);

    const parent: Record<string, string> = {};
    for (const n of nodes) parent[n] = n;

    function find(x: string): string {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function union(x: string, y: string): boolean {
      const px = find(x);
      const py = find(y);
      if (px === py) return false;
      parent[px] = py;
      return true;
    }

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start Kruskal's algorithm",
    });

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 1,
      label: `Sorted edges by weight: ${weightedEdges.map((e) => `${e.u}-${e.v}(${e.weight})`).join(", ")}`,
    });

    const mstNodes: string[] = [];
    let mstEdgeCount = 0;

    for (const edge of weightedEdges) {
      steps.push({
        highlights: [`node-${edge.u}`, `node-${edge.v}`],
        visited: [...mstNodes],
        activeCodeLine: 10,
        label: `Consider edge ${edge.u}-${edge.v} (weight ${edge.weight})`,
      });

      if (union(edge.u, edge.v)) {
        if (!mstNodes.includes(`node-${edge.u}`)) mstNodes.push(`node-${edge.u}`);
        if (!mstNodes.includes(`node-${edge.v}`)) mstNodes.push(`node-${edge.v}`);
        mstEdgeCount++;

        steps.push({
          highlights: [`node-${edge.u}`, `node-${edge.v}`],
          visited: [...mstNodes],
          activeCodeLine: 12,
          label: `Add edge ${edge.u}-${edge.v} to MST (${mstEdgeCount} edges)`,
        });
      } else {
        steps.push({
          highlights: [`node-${edge.u}`, `node-${edge.v}`],
          visited: [...mstNodes],
          activeCodeLine: 10,
          label: `Skip ${edge.u}-${edge.v} (would form cycle)`,
        });
      }
    }

    steps.push({
      highlights: [],
      visited: nodes.map((n) => `node-${n}`),
      activeCodeLine: 15,
      label: `MST complete with ${mstEdgeCount} edges`,
    });

    return steps;
  },
};

export default kruskal;
