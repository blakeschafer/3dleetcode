import { Algorithm, Step, ArrayPresetData } from "./types";

const heapSort: Algorithm = {
  name: "Heap Sort",
  slug: "heap-sort",
  category: "Arrays",
  description: "Build a max heap from the array, then repeatedly extract the maximum element.",
  longDescription: "Heap Sort first builds a max-heap from the array (parent always larger than children), then repeatedly extracts the maximum element from the root and places it at the end. Watch elements get compared and swapped as the heap property is enforced during build and extraction phases. It guarantees O(n log n) time with O(1) extra space — an in-place comparison sort.",
  complexity: { time: "O(n log n)", space: "O(1)" },
  code: [
    "function heapSort(arr) {",
    "  // Build max heap",
    "  for (let i = Math.floor(arr.length/2) - 1; i >= 0; i--)",
    "    heapify(arr, arr.length, i);",
    "  // Extract elements from heap",
    "  for (let i = arr.length - 1; i > 0; i--) {",
    "    [arr[0], arr[i]] = [arr[i], arr[0]];",
    "    heapify(arr, i, 0);",
    "  }",
    "}",
    "function heapify(arr, n, i) {",
    "  let largest = i;",
    "  let l = 2*i+1, r = 2*i+2;",
    "  if (l < n && arr[l] > arr[largest]) largest = l;",
    "  if (r < n && arr[r] > arr[largest]) largest = r;",
    "  if (largest !== i) {",
    "    [arr[i], arr[largest]] = [arr[largest], arr[i]];",
    "    heapify(arr, n, largest);",
    "  }",
    "}",
  ],
  presets: [
    { name: "Random", data: { array: [12, 11, 13, 5, 6, 7] } },
    { name: "Mixed", data: { array: [3, 1, 4, 1, 5, 9] } },
    { name: "Reversed", data: { array: [9, 8, 7, 6, 5, 4, 3, 2, 1] } },
  ],
  leetcodeProblems: ["#912 Sort an Array"],
  generateSteps: (data: unknown): Step[] => {
    const { array } = data as ArrayPresetData;
    const arr = [...array];
    const steps: Step[] = [];
    const sorted: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start heap sort",
    });

    function heapify(n: number, i: number) {
      let largest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;

      steps.push({
        highlights: [`node-${i}`],
        visited: [...sorted],
        activeCodeLine: 11,
        label: `Heapify at index ${i} (value ${arr[i]})`,
      });

      if (l < n && arr[l] > arr[largest]) largest = l;
      if (r < n && arr[r] > arr[largest]) largest = r;

      if (largest !== i) {
        steps.push({
          highlights: [`node-${i}`, `node-${largest}`],
          visited: [...sorted],
          activeCodeLine: 16,
          label: `Swap ${arr[i]} with larger child ${arr[largest]}`,
        });
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(n, largest);
      }
    }

    // Build max heap
    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 1,
      label: "Phase 1: Build max heap",
    });

    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      heapify(arr.length, i);
    }

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 4,
      label: `Max heap built: [${arr.join(", ")}]`,
    });

    // Extract elements
    for (let i = arr.length - 1; i > 0; i--) {
      steps.push({
        highlights: [`node-0`, `node-${i}`],
        visited: [...sorted],
        activeCodeLine: 6,
        label: `Swap max ${arr[0]} to position ${i}`,
      });
      [arr[0], arr[i]] = [arr[i], arr[0]];
      sorted.push(`node-${i}`);
      heapify(i, 0);
    }
    sorted.push("node-0");

    steps.push({
      highlights: [],
      visited: arr.map((_, i) => `node-${i}`),
      activeCodeLine: 9,
      label: "Array sorted!",
    });

    return steps;
  },
};

export default heapSort;
