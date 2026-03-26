import { Algorithm, Step, ArrayPresetData } from "./types";

const bubbleSort: Algorithm = {
  name: "Bubble Sort",
  slug: "bubble-sort",
  category: "Arrays",
  description: "Repeatedly swap adjacent elements if they are in the wrong order.",
  complexity: { time: "O(n²)", space: "O(1)" },
  code: [
    "function bubbleSort(arr) {",
    "  for (let i = 0; i < arr.length; i++) {",
    "    for (let j = 0; j < arr.length - i - 1; j++) {",
    "      if (arr[j] > arr[j + 1]) {",
    "        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];",
    "      }",
    "    }",
    "  }",
    "  return arr;",
    "}",
  ],
  presets: [
    { name: "Random", data: { array: [5, 3, 8, 1, 9, 2] } },
    { name: "Reversed", data: { array: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] } },
    { name: "Already Sorted", data: { array: [1, 2, 3, 4, 5] } },
  ],
  leetcodeProblems: ["#912 Sort an Array", "#75 Sort Colors"],
  generateSteps: (data: unknown): Step[] => {
    const { array } = data as ArrayPresetData;
    const arr = [...array];
    const steps: Step[] = [];
    const visited: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start bubble sort",
    });

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        const idJ = `node-${j}`;
        const idJ1 = `node-${j + 1}`;

        steps.push({
          highlights: [idJ, idJ1],
          visited: [...visited],
          activeCodeLine: 3,
          label: `Compare ${arr[j]} and ${arr[j + 1]}`,
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            highlights: [idJ, idJ1],
            visited: [...visited],
            activeCodeLine: 4,
            label: `Swap ${arr[j + 1]} and ${arr[j]}`,
          });
        }
      }
      visited.push(`node-${arr.length - 1 - i}`);
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

export default bubbleSort;
