import { Algorithm, Step, ArrayPresetData } from "./types";

const selectionSort: Algorithm = {
  name: "Selection Sort",
  slug: "selection-sort",
  category: "Arrays",
  description:
    "Find the minimum element from the unsorted portion and swap it to the front, repeating until sorted.",
  complexity: { time: "O(n²)", space: "O(1)" },
  code: [
    "function selectionSort(arr) {",
    "  for (let i = 0; i < arr.length; i++) {",
    "    let minIdx = i;",
    "    for (let j = i + 1; j < arr.length; j++) {",
    "      if (arr[j] < arr[minIdx]) minIdx = j;",
    "    }",
    "    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];",
    "  }",
    "  return arr;",
    "}",
  ],
  presets: [
    { name: "Random", data: { array: [64, 25, 12, 22, 11] } },
    { name: "Reversed", data: { array: [5, 4, 3, 2, 1] } },
    { name: "Already Sorted", data: { array: [1, 2, 3, 4, 5] } },
  ],
  leetcodeProblems: ["#912 Sort an Array"],
  generateSteps: (data: unknown): Step[] => {
    const { array } = data as ArrayPresetData;
    const arr = [...array];
    const steps: Step[] = [];
    const visited: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start selection sort",
    });

    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;

      steps.push({
        highlights: [`node-${i}`],
        visited: [...visited],
        activeCodeLine: 2,
        label: `Assume minimum is ${arr[i]} at index ${i}`,
      });

      for (let j = i + 1; j < arr.length; j++) {
        steps.push({
          highlights: [`node-${j}`, `node-${minIdx}`],
          visited: [...visited],
          activeCodeLine: 4,
          label: `Compare ${arr[j]} with current min ${arr[minIdx]}`,
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            highlights: [`node-${minIdx}`],
            visited: [...visited],
            activeCodeLine: 4,
            label: `New minimum found: ${arr[minIdx]} at index ${minIdx}`,
          });
        }
      }

      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push({
          highlights: [`node-${i}`, `node-${minIdx}`],
          visited: [...visited],
          activeCodeLine: 6,
          label: `Swap ${arr[minIdx]} and ${arr[i]}`,
        });
      }

      visited.push(`node-${i}`);
    }

    steps.push({
      highlights: [],
      visited: arr.map((_, i) => `node-${i}`),
      activeCodeLine: 8,
      label: "Array sorted!",
    });

    return steps;
  },
};

export default selectionSort;
