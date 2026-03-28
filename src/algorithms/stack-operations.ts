import { Algorithm, Step } from "./types";

interface StackPresetData {
  array: string[];
}

const stackOperations: Algorithm = {
  name: "Stack Operations",
  slug: "stack-operations",
  category: "Arrays",
  description: "Validate parentheses using a stack — push opening brackets, pop on matching closers.",
  longDescription: "A stack follows Last-In-First-Out (LIFO) — the most recent element added is the first removed. For parentheses validation, push each opening bracket onto the stack, and when you see a closing bracket, pop and check if it matches. Watch the stack grow with opening brackets and shrink with valid matches. If the stack is empty at the end, the string is valid.",
  complexity: { time: "O(n)", space: "O(n)" },
  code: [
    "function isValid(s) {",
    "  const stack = [];",
    "  const map = {')':'(', '}':'{', ']':'['};",
    "  for (const c of s) {",
    "    if ('({['.includes(c)) {",
    "      stack.push(c);",
    "    } else {",
    "      if (stack.pop() !== map[c]) return false;",
    "    }",
    "  }",
    "  return stack.length === 0;",
    "}",
  ],
  presets: [
    { name: "Valid Nested", data: { array: ["(", "(", ")", ")"] } },
    { name: "Valid Mixed", data: { array: ["(", "{", "[", "]", "}", ")"] } },
    { name: "Invalid", data: { array: ["(", "(", ")"] } },
  ],
  leetcodeProblems: ["#20 Valid Parentheses", "#155 Min Stack"],
  generateSteps: (data: unknown): Step[] => {
    const { array: chars } = data as StackPresetData;
    const steps: Step[] = [];
    const stack: string[] = [];
    const matchMap: Record<string, string> = { ")": "(", "}": "{", "]": "[" };
    const visited: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: `Validate: ${chars.join("")}`,
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const nodeId = `node-${i}`;

      steps.push({
        highlights: [nodeId],
        visited: [...visited],
        activeCodeLine: 3,
        label: `Read character '${c}'`,
      });

      if ("({[".includes(c)) {
        stack.push(c);
        // Highlight all current stack elements
        const stackHighlights = stack.map((_, si) => `node-${si}`);
        steps.push({
          highlights: [nodeId],
          visited: [...visited],
          activeCodeLine: 5,
          label: `Push '${c}' onto stack. Stack: [${stack.join(", ")}]`,
        });
      } else {
        const top = stack.pop();
        if (top !== matchMap[c]) {
          steps.push({
            highlights: [nodeId],
            visited: [...visited],
            activeCodeLine: 7,
            label: `Pop '${top ?? "empty"}' !== expected '${matchMap[c]}'. Invalid!`,
          });
          return steps;
        }

        visited.push(nodeId);
        steps.push({
          highlights: [nodeId],
          visited: [...visited],
          activeCodeLine: 7,
          label: `Pop '${top}' matches '${c}'. Stack: [${stack.join(", ")}]`,
        });
      }
    }

    const isValid = stack.length === 0;
    steps.push({
      highlights: [],
      visited: chars.map((_, i) => `node-${i}`),
      activeCodeLine: 10,
      label: isValid ? "Valid! Stack is empty." : `Invalid! Stack not empty: [${stack.join(", ")}]`,
    });

    return steps;
  },
};

export default stackOperations;
