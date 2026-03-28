import { Algorithm, Step, ArrayPresetData } from "./types";

const insertionSort: Algorithm = {
  name: "Insertion Sort",
  slug: "insertion-sort",
  category: "Arrays",
  description: "Build a sorted portion one element at a time by inserting each into its correct position.",
  longDescription: "Insertion Sort works like sorting cards in your hand — take each new element and insert it into its correct position in the already-sorted portion. Watch elements shift right to make room for each insertion. It's O(n\u00B2) in general, but performs excellently on nearly-sorted data (O(n) best case), making it great for small arrays or as a final pass in hybrid sorts.",
  complexity: { time: "O(n^2)", space: "O(1)" },
  code: [
    "function insertionSort(arr) {",
    "  for (let i = 1; i < arr.length; i++) {",
    "    let key = arr[i];",
    "    let j = i - 1;",
    "    while (j >= 0 && arr[j] > key) {",
    "      arr[j + 1] = arr[j];",
    "      j--;",
    "    }",
    "    arr[j + 1] = key;",
    "  }",
    "  return arr;",
    "}",
  ],
  presets: [
    { name: "Random", data: { array: [5, 2, 4, 6, 1, 3] } },
    { name: "Reversed", data: { array: [9, 8, 7, 6, 5] } },
    { name: "Already Sorted", data: { array: [1, 2, 3, 4, 5] } },
  ],
  leetcodeProblems: ["#147 Insertion Sort List"],
  generateSteps: (data: unknown): Step[] => {
    const { array } = data as ArrayPresetData;
    const arr = [...array];
    const steps: Step[] = [];
    const sorted: string[] = [`node-0`];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start insertion sort",
    });

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];

      steps.push({
        highlights: [`node-${i}`],
        visited: [...sorted],
        activeCodeLine: 2,
        label: `Pick key = ${key} (index ${i})`,
      });

      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        steps.push({
          highlights: [`node-${j}`, `node-${j + 1}`],
          visited: [...sorted],
          activeCodeLine: 5,
          label: `Shift ${arr[j]} right (${arr[j]} > ${key})`,
        });
        arr[j + 1] = arr[j];
        j--;
      }

      arr[j + 1] = key;
      steps.push({
        highlights: [`node-${j + 1}`],
        visited: [...sorted],
        activeCodeLine: 8,
        label: `Insert ${key} at index ${j + 1}`,
      });

      sorted.push(`node-${i}`);
    }

    steps.push({
      highlights: [],
      visited: arr.map((_, i) => `node-${i}`),
      activeCodeLine: 10,
      label: "Array sorted!",
    });

    return steps;
  },
};

export default insertionSort;
