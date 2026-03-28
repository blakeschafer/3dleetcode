import { Algorithm, Step, ArrayPresetData } from "./types";

const twoPointers: Algorithm = {
  name: "Two Pointers",
  slug: "two-pointers",
  category: "Arrays",
  description: "Use left and right pointers on a sorted array to find pairs that sum to a target.",
  complexity: { time: "O(n)", space: "O(1)" },
  code: [
    "function twoSum(nums, target) {",
    "  let left = 0, right = nums.length - 1;",
    "  while (left < right) {",
    "    const sum = nums[left] + nums[right];",
    "    if (sum === target) return [left, right];",
    "    if (sum < target) left++;",
    "    else right--;",
    "  }",
    "  return [];",
    "}",
  ],
  presets: [
    { name: "Target 9", data: { array: [2, 7, 11, 15], target: 9 } },
    { name: "Target 6", data: { array: [1, 2, 3, 4, 6], target: 6 } },
    { name: "3Sum-style", data: { array: [-4, -1, -1, 0, 1, 2], target: 0 } },
  ],
  leetcodeProblems: ["#167 Two Sum II", "#15 3Sum"],
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
      label: `Find two numbers that sum to ${target}`,
    });

    steps.push({
      highlights: [`node-${left}`, `node-${right}`],
      visited: [],
      activeCodeLine: 1,
      label: `Initialize left=0, right=${right}`,
    });

    while (left < right) {
      const sum = array[left] + array[right];

      steps.push({
        highlights: [`node-${left}`, `node-${right}`],
        visited: [...visited],
        activeCodeLine: 3,
        label: `Sum = ${array[left]} + ${array[right]} = ${sum}`,
      });

      if (sum === target!) {
        steps.push({
          highlights: [`node-${left}`, `node-${right}`],
          visited: [...visited],
          activeCodeLine: 4,
          label: `Found! ${array[left]} + ${array[right]} = ${target}`,
        });
        return steps;
      }

      if (sum < target!) {
        visited.push(`node-${left}`);
        left++;
        steps.push({
          highlights: [`node-${left}`, `node-${right}`],
          visited: [...visited],
          activeCodeLine: 5,
          label: `Sum too small, move left to ${left}`,
        });
      } else {
        visited.push(`node-${right}`);
        right--;
        steps.push({
          highlights: [`node-${left}`, `node-${right}`],
          visited: [...visited],
          activeCodeLine: 6,
          label: `Sum too large, move right to ${right}`,
        });
      }
    }

    steps.push({
      highlights: [],
      visited: array.map((_, i) => `node-${i}`),
      activeCodeLine: 8,
      label: "No pair found",
    });

    return steps;
  },
};

export default twoPointers;
