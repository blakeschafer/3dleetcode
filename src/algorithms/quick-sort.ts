import { Algorithm, Step, ArrayPresetData } from "./types";

const quickSort: Algorithm = {
  name: "Quick Sort",
  slug: "quick-sort",
  category: "Arrays",
  description: "Select a pivot, partition elements around it, then recursively sort the partitions.",
  longDescription: "Quick Sort picks a pivot element and partitions the array so everything smaller goes left and everything larger goes right. Then it recursively sorts both sides. Watch the pivot get selected (highlighted) and elements rearrange around it. In practice, it's often faster than Merge Sort due to better cache locality, though its worst case is O(n\u00B2) with bad pivot choices.",
  complexity: { time: "O(n log n) avg, O(n^2) worst", space: "O(log n)" },
  code: [
    "function quickSort(arr, lo, hi) {",
    "  if (lo >= hi) return;",
    "  const pivot = arr[hi];",
    "  let i = lo;",
    "  for (let j = lo; j < hi; j++) {",
    "    if (arr[j] < pivot) {",
    "      [arr[i], arr[j]] = [arr[j], arr[i]];",
    "      i++;",
    "    }",
    "  }",
    "  [arr[i], arr[hi]] = [arr[hi], arr[i]];",
    "  quickSort(arr, lo, i - 1);",
    "  quickSort(arr, i + 1, hi);",
    "}",
  ],
  presets: [
    { name: "Random", data: { array: [10, 7, 8, 9, 1, 5] } },
    { name: "Mixed", data: { array: [3, 1, 4, 1, 5, 9, 2, 6] } },
    { name: "Reversed", data: { array: [5, 4, 3, 2, 1] } },
  ],
  leetcodeProblems: ["#912 Sort an Array", "#215 Kth Largest Element"],
  generateSteps: (data: unknown): Step[] => {
    const { array } = data as ArrayPresetData;
    const arr = [...array];
    const steps: Step[] = [];
    const sorted: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start quick sort",
    });

    function qs(lo: number, hi: number) {
      if (lo >= hi) {
        if (lo === hi) sorted.push(`node-${lo}`);
        return;
      }

      const pivot = arr[hi];
      steps.push({
        highlights: [`node-${hi}`],
        visited: [...sorted],
        activeCodeLine: 2,
        label: `Pivot = ${pivot} (index ${hi})`,
      });

      let i = lo;
      for (let j = lo; j < hi; j++) {
        steps.push({
          highlights: [`node-${j}`, `node-${hi}`],
          visited: [...sorted],
          activeCodeLine: 5,
          label: `Compare ${arr[j]} < ${pivot}?`,
        });

        if (arr[j] < pivot) {
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push({
              highlights: [`node-${i}`, `node-${j}`],
              visited: [...sorted],
              activeCodeLine: 6,
              label: `Swap ${arr[j]} and ${arr[i]}`,
            });
          }
          i++;
        }
      }

      [arr[i], arr[hi]] = [arr[hi], arr[i]];
      steps.push({
        highlights: [`node-${i}`],
        visited: [...sorted],
        activeCodeLine: 10,
        label: `Place pivot ${pivot} at index ${i}`,
      });
      sorted.push(`node-${i}`);

      qs(lo, i - 1);
      qs(i + 1, hi);
    }

    qs(0, arr.length - 1);

    steps.push({
      highlights: [],
      visited: arr.map((_, i) => `node-${i}`),
      activeCodeLine: 13,
      label: "Array sorted!",
    });

    return steps;
  },
};

export default quickSort;
