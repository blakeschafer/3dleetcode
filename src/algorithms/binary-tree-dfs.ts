import { Algorithm, Step, TreeNode, TreePresetData } from "./types";

function collectNodeIds(node: TreeNode | undefined, prefix: string): string[] {
  if (!node) return [];
  return [prefix, ...collectNodeIds(node.left, `${prefix}-L`), ...collectNodeIds(node.right, `${prefix}-R`)];
}

function dfsInorder(node: TreeNode | undefined, prefix: string, steps: Step[], visited: string[]): void {
  if (!node) return;

  steps.push({
    highlights: [prefix],
    visited: [...visited],
    activeCodeLine: 2,
    label: `Visit node ${node.value}`,
  });

  dfsInorder(node.left, `${prefix}-L`, steps, visited);

  visited.push(prefix);
  steps.push({
    highlights: [prefix],
    visited: [...visited],
    activeCodeLine: 4,
    label: `Process node ${node.value}`,
  });

  dfsInorder(node.right, `${prefix}-R`, steps, visited);
}

const binaryTreeDfs: Algorithm = {
  name: "Binary Tree DFS",
  slug: "binary-tree-dfs",
  category: "Trees",
  description: "Traverse a binary tree depth-first using inorder traversal (left, root, right).",
  complexity: { time: "O(n)", space: "O(h)" },
  code: [
    "function inorderDFS(node) {",
    "  if (!node) return;",
    "  inorderDFS(node.left);",
    "  // process node",
    "  console.log(node.value);",
    "  inorderDFS(node.right);",
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
  leetcodeProblems: ["#94 Inorder Traversal", "#144 Preorder Traversal", "#104 Max Depth"],
  generateSteps: (data: unknown): Step[] => {
    const { root } = data as TreePresetData;
    const steps: Step[] = [];
    const visited: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start inorder DFS traversal",
    });

    dfsInorder(root, "root", steps, visited);

    const allNodes = collectNodeIds(root, "root");
    steps.push({
      highlights: [],
      visited: allNodes,
      activeCodeLine: 6,
      label: "Traversal complete!",
    });

    return steps;
  },
};

export default binaryTreeDfs;
