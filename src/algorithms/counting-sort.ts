import { Algorithm, Step, ArrayPresetData } from "./types";

const countingSort: Algorithm = {
  name: "Counting Sort",
  slug: "counting-sort",
  category: "Arrays",
  description: "Count occurrences of each value, then reconstruct the sorted array from counts.",
  longDescription: "Counting Sort works by counting how many times each value appears, then using those counts to place elements in order. Unlike comparison sorts, it doesn't compare elements to each other. Watch as elements are counted (tallied) and then placed back into the array in sorted order. It runs in O(n+k) time where k is the range of values — incredibly fast when k is small.",
  complexity: { time: "O(n+k)", space: "O(k)" },
  code: [
    "function countingSort(arr) {",
    "  const max = Math.max(...arr);",
    "  const count = new Array(max + 1).fill(0);",
    "  for (const num of arr) count[num]++;",
    "  let idx = 0;",
    "  for (let val = 0; val <= max; val++) {",
    "    while (count[val] > 0) {",
    "      arr[idx++] = val;",
    "      count[val]--;",
    "    }",
    "  }",
    "  return arr;",
    "}",
  ],
  presets: [
    { name: "Duplicates", data: { array: [4, 2, 2, 8, 3, 3, 1] } },
    { name: "Many Dupes", data: { array: [1, 1, 1, 2, 2, 3] } },
    { name: "Distinct", data: { array: [5, 3, 1, 4, 2] } },
  ],
  leetcodeProblems: ["#75 Sort Colors"],
  generateSteps: (data: unknown): Step[] => {
    const { array } = data as ArrayPresetData;
    const arr = [...array];
    const steps: Step[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start counting sort",
    });

    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 2,
      label: `Create count array of size ${max + 1}`,
    });

    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
      count[arr[i]]++;
      steps.push({
        highlights: [`node-${i}`],
        visited: [],
        activeCodeLine: 3,
        label: `Count ${arr[i]}: count[${arr[i]}] = ${count[arr[i]]}`,
      });
    }

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 4,
      label: `Counts: [${count.join(", ")}]. Reconstruct sorted array.`,
    });

    // Reconstruct
    let idx = 0;
    const placed: string[] = [];
    for (let val = 0; val <= max; val++) {
      while (count[val] > 0) {
        steps.push({
          highlights: [`node-${idx}`],
          visited: [...placed],
          activeCodeLine: 7,
          label: `Place ${val} at index ${idx}`,
        });
        arr[idx] = val;
        placed.push(`node-${idx}`);
        idx++;
        count[val]--;
      }
    }

    steps.push({
      highlights: [],
      visited: arr.map((_, i) => `node-${i}`),
      activeCodeLine: 11,
      label: `Array sorted: [${arr.join(", ")}]`,
    });

    return steps;
  },
};

export default countingSort;
