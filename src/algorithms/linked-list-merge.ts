import { Algorithm, Step, LinkedListPresetData } from "./types";

const linkedListMerge: Algorithm = {
  name: "Merge Two Sorted Lists",
  slug: "linked-list-merge",
  category: "Linked Lists",
  description:
    "Merge two sorted linked lists by comparing heads and appending the smaller node each time.",
  complexity: { time: "O(n+m)", space: "O(1)" },
  code: [
    "function mergeTwoLists(l1, l2) {",
    "  const dummy = { next: null };",
    "  let tail = dummy;",
    "  while (l1 && l2) {",
    "    if (l1.val <= l2.val) {",
    "      tail.next = l1; l1 = l1.next;",
    "    } else {",
    "      tail.next = l2; l2 = l2.next;",
    "    }",
    "    tail = tail.next;",
    "  }",
    "  tail.next = l1 || l2;",
    "  return dummy.next;",
    "}",
  ],
  presets: [
    { name: "[1,3,5] + [2,4,6]", data: { values: [1, 2, 3, 4, 5, 6] } },
    { name: "[1,1,1] + [2,2,2]", data: { values: [1, 1, 1, 2, 2, 2] } },
    { name: "[1] + [2,3,4]", data: { values: [1, 2, 3, 4] } },
  ],
  leetcodeProblems: ["#21 Merge Two Sorted Lists"],
  generateSteps: (data: unknown): Step[] => {
    const { values } = data as LinkedListPresetData;
    const steps: Step[] = [];

    // Simulate merging two sorted lists that produce `values` as the result
    // We split values into two sorted sublists for the simulation
    const list1: number[] = [];
    const list2: number[] = [];
    for (let i = 0; i < values.length; i++) {
      if (i % 2 === 0) list1.push(values[i]);
      else list2.push(values[i]);
    }
    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: `Merge [${list1.join(" → ")}] and [${list2.join(" → ")}]`,
    });

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 1,
      label: "Create dummy head node",
    });

    let i = 0;
    let j = 0;
    let mergedIdx = 0;
    const placed: string[] = [];

    while (i < list1.length && j < list2.length) {
      steps.push({
        highlights: [`node-${mergedIdx}`],
        visited: [...placed],
        activeCodeLine: 4,
        label: `Compare ${list1[i]} (list1) vs ${list2[j]} (list2)`,
      });

      if (list1[i] <= list2[j]) {
        steps.push({
          highlights: [`node-${mergedIdx}`],
          visited: [...placed],
          activeCodeLine: 5,
          label: `Take ${list1[i]} from list1`,
        });
        i++;
      } else {
        steps.push({
          highlights: [`node-${mergedIdx}`],
          visited: [...placed],
          activeCodeLine: 7,
          label: `Take ${list2[j]} from list2`,
        });
        j++;
      }

      placed.push(`node-${mergedIdx}`);
      mergedIdx++;
    }

    // Append remaining
    while (i < list1.length) {
      steps.push({
        highlights: [`node-${mergedIdx}`],
        visited: [...placed],
        activeCodeLine: 11,
        label: `Append remaining ${list1[i]} from list1`,
      });
      placed.push(`node-${mergedIdx}`);
      i++;
      mergedIdx++;
    }

    while (j < list2.length) {
      steps.push({
        highlights: [`node-${mergedIdx}`],
        visited: [...placed],
        activeCodeLine: 11,
        label: `Append remaining ${list2[j]} from list2`,
      });
      placed.push(`node-${mergedIdx}`);
      j++;
      mergedIdx++;
    }

    steps.push({
      highlights: [],
      visited: values.map((_, idx) => `node-${idx}`),
      activeCodeLine: 12,
      label: `Merged list: [${values.join(" → ")}]`,
    });

    return steps;
  },
};

export default linkedListMerge;
