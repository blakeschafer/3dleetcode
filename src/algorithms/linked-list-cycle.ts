import { Algorithm, Step, LinkedListPresetData } from "./types";

interface CyclePresetData extends LinkedListPresetData {
  cyclePos: number; // -1 means no cycle
}

const linkedListCycle: Algorithm = {
  name: "Linked List Cycle Detection",
  slug: "linked-list-cycle",
  category: "Linked Lists",
  description: "Detect a cycle using Floyd's tortoise and hare algorithm with slow and fast pointers.",
  complexity: { time: "O(n)", space: "O(1)" },
  code: [
    "function hasCycle(head) {",
    "  let slow = head, fast = head;",
    "  while (fast && fast.next) {",
    "    slow = slow.next;",
    "    fast = fast.next.next;",
    "    if (slow === fast) return true;",
    "  }",
    "  return false;",
    "}",
  ],
  presets: [
    { name: "Cycle at pos 1", data: { values: [3, 2, 0, -4], cyclePos: 1 } },
    { name: "Cycle at pos 0", data: { values: [1, 2, 3], cyclePos: 0 } },
    { name: "No Cycle", data: { values: [1, 2, 3, 4, 5], cyclePos: -1 } },
  ],
  leetcodeProblems: ["#141 Linked List Cycle", "#142 Linked List Cycle II"],
  generateSteps: (data: unknown): Step[] => {
    const { values, cyclePos } = data as CyclePresetData;
    const steps: Step[] = [];
    const visited: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: `Detect cycle in [${values.join(" -> ")}]${cyclePos >= 0 ? ` (cycle at position ${cyclePos})` : ""}`,
    });

    steps.push({
      highlights: [`node-0`],
      visited: [],
      activeCodeLine: 1,
      label: "Initialize slow=head, fast=head",
    });

    let slow = 0;
    let fast = 0;
    let iteration = 0;
    const maxIterations = values.length * 3; // Safety limit

    while (iteration < maxIterations) {
      iteration++;

      // Check fast and fast.next exist
      const fastNext = cyclePos >= 0 && fast === values.length - 1
        ? cyclePos
        : fast + 1;
      const fastCanMove = fast < values.length && fastNext < values.length;

      if (!fastCanMove && cyclePos < 0) {
        // No cycle case: fast reached end
        steps.push({
          highlights: [`node-${fast}`],
          visited: [...visited],
          activeCodeLine: 2,
          label: "Fast pointer reached end - no cycle!",
        });
        break;
      }

      // Move slow one step
      const slowNext = cyclePos >= 0 && slow === values.length - 1
        ? cyclePos
        : slow + 1;
      slow = slowNext;

      // Move fast two steps
      const fastStep1 = cyclePos >= 0 && fast === values.length - 1
        ? cyclePos
        : fast + 1;
      const fastStep2 = cyclePos >= 0 && fastStep1 === values.length - 1
        ? cyclePos
        : fastStep1 + 1;
      fast = fastStep2;

      visited.push(`node-${slow}`);

      steps.push({
        highlights: [`node-${slow}`, `node-${fast}`],
        visited: [...visited],
        activeCodeLine: 3,
        label: `Move slow to node ${values[slow]} (idx ${slow}), fast to node ${values[fast]} (idx ${fast})`,
      });

      // Check if fast went out of bounds (no cycle)
      if (fast >= values.length && cyclePos < 0) {
        steps.push({
          highlights: [],
          visited: [...visited],
          activeCodeLine: 7,
          label: "Fast pointer out of bounds - no cycle!",
        });
        break;
      }

      // Check if they meet
      if (slow === fast) {
        steps.push({
          highlights: [`node-${slow}`],
          visited: [...visited],
          activeCodeLine: 5,
          label: `Slow and fast meet at node ${values[slow]} (idx ${slow}) - cycle detected!`,
        });
        return steps;
      }
    }

    steps.push({
      highlights: [],
      visited: values.map((_, i) => `node-${i}`),
      activeCodeLine: 7,
      label: "No cycle detected",
    });

    return steps;
  },
};

export default linkedListCycle;
