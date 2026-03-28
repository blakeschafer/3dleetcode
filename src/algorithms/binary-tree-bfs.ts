import { Algorithm, Step, TreeNode, TreePresetData } from "./types";

function collectNodeIds(node: TreeNode | undefined, prefix: string): string[] {
  if (!node) return [];
  return [prefix, ...collectNodeIds(node.left, `${prefix}-L`), ...collectNodeIds(node.right, `${prefix}-R`)];
}

const binaryTreeBfs: Algorithm = {
  name: "Binary Tree BFS",
  slug: "binary-tree-bfs",
  category: "Trees",
  description: "Traverse a binary tree level by level using a queue (breadth-first).",
  longDescription: "Breadth-First Search visits all nodes at the current depth before moving to the next level. It uses a queue — process the front node, add its children to the back. Watch the tree light up level by level, left to right. This is how you solve problems like 'find the minimum depth' or 'right side view' — anything that needs level-order information.",
  complexity: { time: "O(n)", space: "O(n)" },
  code: [
    "function levelOrder(root) {",
    "  if (!root) return [];",
    "  const result = [];",
    "  const queue = [root];",
    "  while (queue.length > 0) {",
    "    const level = [];",
    "    const size = queue.length;",
    "    for (let i = 0; i < size; i++) {",
    "      const node = queue.shift();",
    "      level.push(node.val);",
    "      if (node.left) queue.push(node.left);",
    "      if (node.right) queue.push(node.right);",
    "    }",
    "    result.push(level);",
    "  }",
    "  return result;",
    "}",
  ],
  presets: [
    {
      name: "Balanced (depth 3)",
      data: {
        root: {
          value: 4,
          left: { value: 2, left: { value: 1 }, right: { value: 3 } },
          right: { value: 6, left: { value: 5 }, right: { value: 7 } },
        },
      },
    },
    {
      name: "Skewed Left",
      data: {
        root: {
          value: 5,
          left: { value: 4, left: { value: 3, left: { value: 2, left: { value: 1 } } } },
        },
      },
    },
    {
      name: "Single Node",
      data: { root: { value: 42 } },
    },
  ],
  leetcodeProblems: ["#102 Binary Tree Level Order Traversal", "#199 Right Side View"],
  generateSteps: (data: unknown): Step[] => {
    const { root } = data as TreePresetData;
    const steps: Step[] = [];
    const visited: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start level-order BFS traversal",
    });

    const queue: { node: TreeNode; prefix: string }[] = [{ node: root, prefix: "root" }];
    let level = 0;

    while (queue.length > 0) {
      const size = queue.length;
      const levelValues: number[] = [];

      steps.push({
        highlights: queue.map((q) => q.prefix),
        visited: [...visited],
        activeCodeLine: 6,
        label: `Process level ${level} (${size} node${size > 1 ? "s" : ""})`,
      });

      for (let i = 0; i < size; i++) {
        const { node, prefix } = queue.shift()!;
        levelValues.push(node.value);

        steps.push({
          highlights: [prefix],
          visited: [...visited],
          activeCodeLine: 8,
          label: `Dequeue node ${node.value}`,
        });

        visited.push(prefix);

        steps.push({
          highlights: [prefix],
          visited: [...visited],
          activeCodeLine: 9,
          label: `Visit node ${node.value}`,
        });

        if (node.left) {
          queue.push({ node: node.left, prefix: `${prefix}-L` });
          steps.push({
            highlights: [`${prefix}-L`],
            visited: [...visited],
            activeCodeLine: 10,
            label: `Enqueue left child ${node.left.value}`,
          });
        }

        if (node.right) {
          queue.push({ node: node.right, prefix: `${prefix}-R` });
          steps.push({
            highlights: [`${prefix}-R`],
            visited: [...visited],
            activeCodeLine: 11,
            label: `Enqueue right child ${node.right.value}`,
          });
        }
      }

      level++;
    }

    const allNodes = collectNodeIds(root, "root");
    steps.push({
      highlights: [],
      visited: allNodes,
      activeCodeLine: 15,
      label: "BFS traversal complete!",
    });

    return steps;
  },
};

export default binaryTreeBfs;
