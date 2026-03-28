import { Algorithm, Step, ArrayPresetData } from "./types";

const mergeSort: Algorithm = {
  name: "Merge Sort",
  slug: "merge-sort",
  category: "Arrays",
  description: "Divide the array in half, recursively sort each half, then merge the sorted halves.",
  longDescription: "Merge Sort uses divide-and-conquer: split the array in half until you have single elements, then merge pairs back together in sorted order. The merge step compares elements from both halves, picking the smaller one each time. Watch elements get compared and placed into their sorted positions. It guarantees O(n log n) time regardless of input — no worst cases like Quick Sort.",
  complexity: { time: "O(n log n)", space: "O(n)" },
  code: [
    "function mergeSort(arr) {",
    "  if (arr.length <= 1) return arr;",
    "  const mid = Math.floor(arr.length / 2);",
    "  const left = mergeSort(arr.slice(0, mid));",
    "  const right = mergeSort(arr.slice(mid));",
    "  return merge(left, right);",
    "}",
    "function merge(left, right) {",
    "  const result = [];",
    "  while (left.length && right.length) {",
    "    result.push(left[0]<=right[0] ? left.shift() : right.shift());",
    "  }",
    "  return [...result, ...left, ...right];",
    "}",
  ],
  presets: [
    { name: "Random", data: { array: [38, 27, 43, 3, 9, 82, 10] } },
    { name: "Reversed", data: { array: [5, 4, 3, 2, 1] } },
    { name: "Already Sorted", data: { array: [1, 2, 3, 4, 5] } },
  ],
  leetcodeProblems: ["#912 Sort an Array", "#148 Sort List"],
  generateSteps: (data: unknown): Step[] => {
    const { array } = data as ArrayPresetData;
    const arr = [...array];
    const steps: Step[] = [];
    const visited: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start merge sort",
    });

    function mergeSortHelper(start: number, end: number): number[] {
      if (end - start <= 1) {
        return arr.slice(start, end);
      }

      const mid = Math.floor((start + end) / 2);
      const leftIds = Array.from({ length: mid - start }, (_, i) => `node-${start + i}`);
      const rightIds = Array.from({ length: end - mid }, (_, i) => `node-${mid + i}`);

      steps.push({
        highlights: leftIds,
        visited: [...visited],
        activeCodeLine: 2,
        label: `Divide: left [${start}..${mid - 1}], right [${mid}..${end - 1}]`,
      });

      const left = mergeSortHelper(start, mid);
      const right = mergeSortHelper(mid, end);

      // Merge phase
      const merged: number[] = [];
      let li = 0, ri = 0;
      while (li < left.length && ri < right.length) {
        const leftIdx = start + merged.length;
        steps.push({
          highlights: [`node-${leftIdx}`],
          visited: [...visited],
          activeCodeLine: 10,
          label: `Merge: compare ${left[li]} and ${right[ri]}`,
        });
        if (left[li] <= right[ri]) {
          merged.push(left[li++]);
        } else {
          merged.push(right[ri++]);
        }
      }
      while (li < left.length) merged.push(left[li++]);
      while (ri < right.length) merged.push(right[ri++]);

      // Write merged values back
      for (let i = 0; i < merged.length; i++) {
        arr[start + i] = merged[i];
      }

      const mergedIds = Array.from({ length: end - start }, (_, i) => `node-${start + i}`);
      steps.push({
        highlights: mergedIds,
        visited: [...visited],
        activeCodeLine: 12,
        label: `Merged [${start}..${end - 1}]: [${merged.join(", ")}]`,
      });

      return merged;
    }

    mergeSortHelper(0, arr.length);

    steps.push({
      highlights: [],
      visited: arr.map((_, i) => `node-${i}`),
      activeCodeLine: 13,
      label: "Array sorted!",
    });

    return steps;
  },
};

export default mergeSort;
