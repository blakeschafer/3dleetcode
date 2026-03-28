import { Algorithm, Step, ArrayPresetData } from "./types";

const kadane: Algorithm = {
  name: "Kadane's Algorithm",
  slug: "kadane",
  category: "Arrays",
  description: "Find the contiguous subarray with the largest sum using a running maximum.",
  longDescription: "Kadane's Algorithm scans through the array maintaining two values: the maximum sum ending at the current position, and the global maximum sum seen so far. At each step, decide whether to extend the current subarray or start fresh. Watch the current subarray expand when adding helps, and reset when starting over is better. This elegant O(n) solution solves a problem that seems to need O(n\u00B2).",
  complexity: { time: "O(n)", space: "O(1)" },
  code: [
    "function maxSubArray(nums) {",
    "  let maxSum = nums[0];",
    "  let currentSum = nums[0];",
    "  for (let i = 1; i < nums.length; i++) {",
    "    currentSum = Math.max(nums[i], currentSum + nums[i]);",
    "    maxSum = Math.max(maxSum, currentSum);",
    "  }",
    "  return maxSum;",
    "}",
  ],
  presets: [
    { name: "Classic", data: { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4] } },
    { name: "All Positive", data: { array: [1, 2, 3, 4, 5] } },
    { name: "All Negative", data: { array: [-1, -2, -3, -4] } },
  ],
  leetcodeProblems: ["#53 Maximum Subarray"],
  generateSteps: (data: unknown): Step[] => {
    const { array } = data as ArrayPresetData;
    const steps: Step[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start Kadane's algorithm",
    });

    let maxSum = array[0];
    let currentSum = array[0];
    let maxStart = 0;
    let maxEnd = 0;
    let currentStart = 0;

    steps.push({
      highlights: [`node-0`],
      visited: [`node-0`],
      activeCodeLine: 2,
      label: `Initialize: maxSum = ${maxSum}, currentSum = ${currentSum}`,
    });

    for (let i = 1; i < array.length; i++) {
      const extendSum = currentSum + array[i];
      const restartSum = array[i];

      // Highlight current subarray range
      const subarrayNodes: string[] = [];
      for (let k = currentStart; k <= i; k++) {
        subarrayNodes.push(`node-${k}`);
      }

      if (restartSum > extendSum) {
        currentSum = restartSum;
        currentStart = i;
        steps.push({
          highlights: [`node-${i}`],
          visited: subarrayNodes,
          activeCodeLine: 4,
          label: `Reset subarray at index ${i} (${array[i]} > ${extendSum}). currentSum = ${currentSum}`,
        });
      } else {
        currentSum = extendSum;
        steps.push({
          highlights: [`node-${i}`],
          visited: subarrayNodes,
          activeCodeLine: 4,
          label: `Extend subarray to index ${i}. currentSum = ${currentSum}`,
        });
      }

      if (currentSum > maxSum) {
        maxSum = currentSum;
        maxStart = currentStart;
        maxEnd = i;
        steps.push({
          highlights: [`node-${i}`],
          visited: subarrayNodes,
          activeCodeLine: 5,
          label: `New max found! maxSum = ${maxSum} (indices ${maxStart}-${maxEnd})`,
        });
      }
    }

    // Highlight the max subarray
    const maxSubarrayNodes: string[] = [];
    for (let k = maxStart; k <= maxEnd; k++) {
      maxSubarrayNodes.push(`node-${k}`);
    }

    steps.push({
      highlights: maxSubarrayNodes,
      visited: array.map((_, i) => `node-${i}`),
      activeCodeLine: 7,
      label: `Maximum subarray sum = ${maxSum} (indices ${maxStart} to ${maxEnd})`,
    });

    return steps;
  },
};

export default kadane;
