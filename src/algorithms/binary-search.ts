import { Algorithm, Step, ArrayPresetData } from "./types";

const binarySearch: Algorithm = {
  name: "Binary Search",
  slug: "binary-search",
  category: "Arrays",
  description: "Find a target by repeatedly halving the search range.",
  longDescription: "Binary Search eliminates half the remaining elements with each comparison. It works only on sorted arrays — compare the target to the middle element, then search the left or right half. Watch the search window shrink with each step as eliminated elements dim out. This is why sorted data structures are so powerful — O(log n) vs O(n) linear search.",
  complexity: { time: "O(log n)", space: "O(1)" },
  code: [
    "function binarySearch(arr, target) {",
    "  let left = 0, right = arr.length - 1;",
    "  while (left <= right) {",
    "    let mid = Math.floor((left + right) / 2);",
    "    if (arr[mid] === target) return mid;",
    "    if (arr[mid] < target) left = mid + 1;",
    "    else right = mid - 1;",
    "  }",
    "  return -1;",
    "}",
  ],
  presets: [
    { name: "Find 7", data: { array: [1, 3, 5, 7, 9, 11, 13], target: 7 } },
    { name: "Find 1", data: { array: [1, 3, 5, 7, 9, 11, 13], target: 1 } },
    { name: "Not Found", data: { array: [1, 3, 5, 7, 9, 11, 13], target: 14 } },
  ],
  leetcodeProblems: ["#704 Binary Search", "#35 Search Insert Position"],
  generateSteps: (data: unknown): Step[] => {
    const { array, target } = data as ArrayPresetData;
    const steps: Step[] = [];
    const visited: string[] = [];
    let left = 0;
    let right = array.length - 1;

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: `Search for ${target} in [${array.join(", ")}]`,
    });

    steps.push({
      highlights: [`node-${left}`, `node-${right}`],
      visited: [],
      activeCodeLine: 1,
      label: `Initialize left=${left}, right=${right}`,
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        highlights: [`node-${mid}`],
        visited: [...visited],
        activeCodeLine: 3,
        label: `Mid = ${mid}, arr[${mid}] = ${array[mid]}`,
      });

      if (array[mid] === target) {
        steps.push({
          highlights: [`node-${mid}`],
          visited: [...visited],
          activeCodeLine: 4,
          label: `Found ${target} at index ${mid}!`,
        });
        return steps;
      }

      if (array[mid] < target!) {
        visited.push(...Array.from({ length: mid - left + 1 }, (_, i) => `node-${left + i}`));
        left = mid + 1;
        steps.push({
          highlights: [`node-${left}`],
          visited: [...visited],
          activeCodeLine: 5,
          label: `${array[mid]} < ${target}, move left to ${left}`,
        });
      } else {
        visited.push(...Array.from({ length: right - mid + 1 }, (_, i) => `node-${mid + i}`));
        right = mid - 1;
        steps.push({
          highlights: [`node-${right}`],
          visited: [...visited],
          activeCodeLine: 6,
          label: `${array[mid]} > ${target}, move right to ${right}`,
        });
      }
    }

    steps.push({
      highlights: [],
      visited: array.map((_, i) => `node-${i}`),
      activeCodeLine: 8,
      label: `${target} not found in array`,
    });

    return steps;
  },
};

export default binarySearch;
