import { Algorithm, Step, LinkedListPresetData } from "./types";

const linkedListReversal: Algorithm = {
  name: "Linked List Reversal",
  slug: "linked-list-reversal",
  category: "Linked Lists",
  description: "Reverse a singly linked list by re-pointing each node's next pointer.",
  complexity: { time: "O(n)", space: "O(1)" },
  code: [
    "function reverseList(head) {",
    "  let prev = null;",
    "  let curr = head;",
    "  while (curr !== null) {",
    "    let next = curr.next;",
    "    curr.next = prev;",
    "    prev = curr;",
    "    curr = next;",
    "  }",
    "  return prev;",
    "}",
  ],
  presets: [
    { name: "5 Nodes", data: { values: [1, 2, 3, 4, 5] } },
    { name: "8 Nodes", data: { values: [1, 2, 3, 4, 5, 6, 7, 8] } },
    { name: "2 Nodes", data: { values: [1, 2] } },
  ],
  leetcodeProblems: ["#206 Reverse Linked List", "#92 Reverse Linked List II"],
  generateSteps: (data: unknown): Step[] => {
    const { values } = data as LinkedListPresetData;
    const steps: Step[] = [];
    let prevIdx = -1;
    let currIdx = 0;

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: `Reverse list [${values.join(" → ")}]`,
    });

    steps.push({
      highlights: [`node-${currIdx}`],
      visited: [],
      activeCodeLine: 2,
      label: "Initialize prev=null, curr=head",
    });

    while (currIdx < values.length) {
      const nextIdx = currIdx + 1;

      steps.push({
        highlights: [`node-${currIdx}`],
        visited: prevIdx >= 0 ? Array.from({ length: prevIdx + 1 }, (_, i) => `node-${i}`) : [],
        activeCodeLine: 4,
        label: `Save next = node ${nextIdx < values.length ? values[nextIdx] : "null"}`,
      });

      steps.push({
        highlights: [`node-${currIdx}`],
        visited: prevIdx >= 0 ? Array.from({ length: prevIdx + 1 }, (_, i) => `node-${i}`) : [],
        activeCodeLine: 5,
        label: `Point node ${values[currIdx]}.next → ${prevIdx >= 0 ? values[prevIdx] : "null"}`,
      });

      prevIdx = currIdx;
      currIdx = nextIdx;

      steps.push({
        highlights: currIdx < values.length ? [`node-${currIdx}`] : [],
        visited: Array.from({ length: prevIdx + 1 }, (_, i) => `node-${i}`),
        activeCodeLine: 7,
        label: `Move prev=${values[prevIdx]}, curr=${currIdx < values.length ? values[currIdx] : "null"}`,
      });
    }

    steps.push({
      highlights: [],
      visited: values.map((_, i) => `node-${i}`),
      activeCodeLine: 9,
      label: `List reversed! [${[...values].reverse().join(" → ")}]`,
    });

    return steps;
  },
};

export default linkedListReversal;
