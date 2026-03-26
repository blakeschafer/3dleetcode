import { Algorithm, Step, ArrayPresetData } from "./types";

const slidingWindow: Algorithm = {
  name: "Sliding Window",
  slug: "sliding-window",
  category: "Arrays",
  description: "Find the minimum size subarray with a sum >= target using a sliding window.",
  complexity: { time: "O(n)", space: "O(1)" },
  code: [
    "function minSubArrayLen(target, nums) {",
    "  let left = 0, sum = 0, minLen = Infinity;",
    "  for (let right = 0; right < nums.length; right++) {",
    "    sum += nums[right];",
    "    while (sum >= target) {",
    "      minLen = Math.min(minLen, right - left + 1);",
    "      sum -= nums[left];",
    "      left++;",
    "    }",
    "  }",
    "  return minLen === Infinity ? 0 : minLen;",
    "}",
  ],
  presets: [
    { name: "Target 7, Window 3", data: { array: [2, 1, 5, 1, 3, 2], target: 7 } },
    { name: "Target 4, Window 2", data: { array: [1, 2, 3, 4, 5], target: 4 } },
  ],
  leetcodeProblems: ["#209 Min Size Subarray Sum", "#3 Longest Substring Without Repeating"],
  generateSteps: (data: unknown): Step[] => {
    const { array, target } = data as ArrayPresetData;
    const steps: Step[] = [];
    let left = 0;
    let sum = 0;
    let minLen = Infinity;

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: `Find min subarray with sum >= ${target}`,
    });

    for (let right = 0; right < array.length; right++) {
      sum += array[right];

      steps.push({
        highlights: [`node-${right}`],
        visited: [],
        activeCodeLine: 3,
        label: `Add nums[${right}]=${array[right]}, sum=${sum}`,
      });

      while (sum >= target!) {
        minLen = Math.min(minLen, right - left + 1);
        const currentWindow = Array.from({ length: right - left + 1 }, (_, i) => `node-${left + i}`);

        steps.push({
          highlights: currentWindow,
          visited: [],
          activeCodeLine: 5,
          label: `sum=${sum} >= ${target}, window size=${right - left + 1}, minLen=${minLen}`,
        });

        sum -= array[left];

        steps.push({
          highlights: [`node-${left}`],
          visited: [],
          activeCodeLine: 6,
          label: `Remove nums[${left}]=${array[left]}, sum=${sum}`,
        });

        left++;
      }
    }

    steps.push({
      highlights: [],
      visited: array.map((_, i) => `node-${i}`),
      activeCodeLine: 10,
      label: minLen === Infinity ? "No valid subarray found" : `Minimum length: ${minLen}`,
    });

    return steps;
  },
};

export default slidingWindow;
