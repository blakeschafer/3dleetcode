import { Algorithm, Step, TreeNode, TreePresetData } from "./types";

function collectNodeIds(node: TreeNode | undefined, prefix: string): string[] {
  if (!node) return [];
  return [prefix, ...collectNodeIds(node.left, `${prefix}-L`), ...collectNodeIds(node.right, `${prefix}-R`)];
}

function invertAndRecord(
  node: TreeNode | undefined,
  prefix: string,
  steps: Step[],
  visited: string[],
): void {
  if (!node) return;

  steps.push({
    highlights: [prefix],
    visited: [...visited],
    activeCodeLine: 1,
    label: `Visit node ${node.value}`,
  });

  // Swap children
  const temp = node.left;
  node.left = node.right;
  node.right = temp;

  visited.push(prefix);
  steps.push({
    highlights: [prefix],
    visited: [...visited],
    activeCodeLine: 2,
    label: `Swap children of node ${node.value}`,
  });

  invertAndRecord(node.left, `${prefix}-L`, steps, visited);
  invertAndRecord(node.right, `${prefix}-R`, steps, visited);
}

const binaryTreeInvert: Algorithm = {
  name: "Invert Binary Tree",
  slug: "binary-tree-invert",
  category: "Trees",
  description: "Recursively swap every node's left and right children to mirror the tree.",
  longDescription: "Inverting a binary tree means swapping every node's left and right subtrees, creating a mirror image. The algorithm recursively visits each node and swaps its children. Watch the tree transform as left and right branches swap at each level. This classic problem tests understanding of tree recursion — simple but elegant, and famously the question that inspired Homebrew's creator to quit Google interviews.",
  complexity: { time: "O(n)", space: "O(h)" },
  code: [
    "function invertTree(root) {",
    "  if (!root) return null;",
    "  [root.left, root.right] = [root.right, root.left];",
    "  invertTree(root.left);",
    "  invertTree(root.right);",
    "  return root;",
    "}",
  ],
  presets: [
    {
      name: "Balanced (depth 3)",
      data: {
        root: {
          value: 4,
          left: { value: 2, left: { value: 1 }, right: { value: 3 } },
          right: { value: 7, left: { value: 6 }, right: { value: 9 } },
        },
      },
    },
    {
      name: "Skewed Left",
      data: {
        root: {
          value: 1,
          left: { value: 2, left: { value: 3 } },
        },
      },
    },
    {
      name: "One Child",
      data: {
        root: {
          value: 1,
          left: { value: 2 },
          right: { value: 3, right: { value: 4 } },
        },
      },
    },
  ],
  leetcodeProblems: ["#226 Invert Binary Tree"],
  generateSteps: (data: unknown): Step[] => {
    const { root } = data as TreePresetData;
    const steps: Step[] = [];
    const visited: string[] = [];

    // Deep clone the tree so we can mutate
    const clone = JSON.parse(JSON.stringify(root)) as TreeNode;

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "Start inverting binary tree",
    });

    invertAndRecord(clone, "root", steps, visited);

    const allNodes = collectNodeIds(root, "root");
    steps.push({
      highlights: [],
      visited: allNodes,
      activeCodeLine: 5,
      label: "Tree inverted!",
    });

    return steps;
  },
};

export default binaryTreeInvert;
