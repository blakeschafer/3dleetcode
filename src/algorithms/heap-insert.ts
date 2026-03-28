import { Algorithm, Step, ArrayPresetData } from "./types";

const heapInsert: Algorithm = {
  name: "Heap Insert (Min-Heap)",
  slug: "heap-insert",
  category: "Trees",
  description: "Insert elements into a min-heap, bubbling up each new element to maintain heap order.",
  longDescription: "A min-heap is a complete binary tree where every parent is smaller than its children. To insert, place the new element at the bottom, then 'bubble up' by swapping with its parent while it's smaller. Watch new nodes appear at the bottom and float upward to their correct position. Heaps power priority queues — O(log n) insert and O(1) access to the minimum.",
  complexity: { time: "O(log n) per insert", space: "O(n)" },
  code: [
    "function heapInsert(heap, val) {",
    "  heap.push(val);",
    "  let i = heap.length - 1;",
    "  while (i > 0) {",
    "    const parent = Math.floor((i-1)/2);",
    "    if (heap[parent] <= heap[i]) break;",
    "    [heap[parent], heap[i]] = [heap[i], heap[parent]];",
    "    i = parent;",
    "  }",
    "}",
  ],
  presets: [
    { name: "Sequence 1", data: { array: [4, 2, 7, 1, 5, 3] } },
    { name: "Increasing", data: { array: [10, 20, 30, 40, 50] } },
    { name: "Small", data: { array: [5, 3, 8] } },
  ],
  leetcodeProblems: ["#703 Kth Largest Element in a Stream", "#215 Kth Largest"],
  generateSteps: (data: unknown): Step[] => {
    const { array } = data as ArrayPresetData;
    const steps: Step[] = [];
    const heap: number[] = [];

    // Map heap index to tree node ID
    function heapIdxToNodeId(idx: number): string {
      if (idx === 0) return "root";
      const path: string[] = [];
      let i = idx;
      while (i > 0) {
        const parent = Math.floor((i - 1) / 2);
        path.unshift(i === 2 * parent + 1 ? "L" : "R");
        i = parent;
      }
      return `root-${path.join("-")}`;
    }

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: `Build min-heap by inserting [${array.join(", ")}]`,
    });

    const visited: string[] = [];

    for (const val of array) {
      heap.push(val);
      let i = heap.length - 1;
      const nodeId = heapIdxToNodeId(i);

      steps.push({
        highlights: [nodeId],
        visited: [...visited],
        activeCodeLine: 1,
        label: `Insert ${val} at index ${i}`,
      });

      while (i > 0) {
        const parent = Math.floor((i - 1) / 2);
        const parentId = heapIdxToNodeId(parent);
        const currentId = heapIdxToNodeId(i);

        steps.push({
          highlights: [currentId, parentId],
          visited: [...visited],
          activeCodeLine: 5,
          label: `Compare ${heap[i]} with parent ${heap[parent]}`,
        });

        if (heap[parent] <= heap[i]) {
          steps.push({
            highlights: [currentId],
            visited: [...visited],
            activeCodeLine: 5,
            label: `${heap[parent]} <= ${heap[i]}, heap property satisfied`,
          });
          break;
        }

        [heap[parent], heap[i]] = [heap[i], heap[parent]];
        steps.push({
          highlights: [currentId, parentId],
          visited: [...visited],
          activeCodeLine: 6,
          label: `Swap ${heap[i]} and ${heap[parent]} (bubble up)`,
        });

        i = parent;
      }

      visited.push(heapIdxToNodeId(i));
    }

    steps.push({
      highlights: [],
      visited: heap.map((_, i) => heapIdxToNodeId(i)),
      activeCodeLine: 9,
      label: `Min-heap built! Root = ${heap[0]}`,
    });

    return steps;
  },
};

export default heapInsert;
