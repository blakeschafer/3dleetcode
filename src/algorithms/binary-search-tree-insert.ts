import { Algorithm, Step, TreeNode, TreePresetData } from "./types";

function collectNodeIds(node: TreeNode | undefined, prefix: string): string[] {
  if (!node) return [];
  return [prefix, ...collectNodeIds(node.left, `${prefix}-L`), ...collectNodeIds(node.right, `${prefix}-R`)];
}

function buildBST(values: number[]): TreeNode {
  let root: TreeNode = { value: values[0] };
  for (let i = 1; i < values.length; i++) {
    insertNode(root, values[i]);
  }
  return root;
}

function insertNode(root: TreeNode, val: number): void {
  if (val < root.value) {
    if (root.left) insertNode(root.left, val);
    else root.left = { value: val };
  } else {
    if (root.right) insertNode(root.right, val);
    else root.right = { value: val };
  }
}

function generateInsertSteps(
  root: TreeNode | undefined,
  prefix: string,
  val: number,
  steps: Step[],
  visited: string[],
): void {
  if (!root) return;

  steps.push({
    highlights: [prefix],
    visited: [...visited],
    activeCodeLine: 2,
    label: `Compare ${val} with node ${root.value}`,
  });

  if (val < root.value) {
    if (root.left) {
      steps.push({
        highlights: [prefix],
        visited: [...visited],
        activeCodeLine: 3,
        label: `${val} < ${root.value}, go left`,
      });
      generateInsertSteps(root.left, `${prefix}-L`, val, steps, visited);
    } else {
      steps.push({
        highlights: [prefix],
        visited: [...visited],
        activeCodeLine: 4,
        label: `Insert ${val} as left child of ${root.value}`,
      });
      visited.push(`${prefix}-L`);
    }
  } else {
    if (root.right) {
      steps.push({
        highlights: [prefix],
        visited: [...visited],
        activeCodeLine: 6,
        label: `${val} >= ${root.value}, go right`,
      });
      generateInsertSteps(root.right, `${prefix}-R`, val, steps, visited);
    } else {
      steps.push({
        highlights: [prefix],
        visited: [...visited],
        activeCodeLine: 7,
        label: `Insert ${val} as right child of ${root.value}`,
      });
      visited.push(`${prefix}-R`);
    }
  }
}

const binarySearchTreeInsert: Algorithm = {
  name: "BST Insert",
  slug: "binary-search-tree-insert",
  category: "Trees",
  description:
    "Insert values into a Binary Search Tree by traversing left for smaller values and right for larger ones.",
  complexity: { time: "O(h)", space: "O(1)" },
  code: [
    "function insert(root, val) {",
    "  if (!root) return { val };",
    "  if (val < root.val) {",
    "    root.left = insert(root.left, val);",
    "  } else {",
    "    root.right = insert(root.right, val);",
    "  }",
    "  return root;",
    "}",
  ],
  presets: [
    {
      name: "Balanced BST",
      data: {
        root: buildBST([5, 3, 7, 1, 4, 6, 8]),
      },
    },
    {
      name: "Left Skewed",
      data: {
        root: buildBST([3, 2, 1]),
      },
    },
    {
      name: "Right Skewed",
      data: {
        root: buildBST([1, 2, 3]),
      },
    },
  ],
  leetcodeProblems: ["#701 Insert into a BST"],
  generateSteps: (data: unknown): Step[] => {
    const { root } = data as TreePresetData;
    const steps: Step[] = [];
    const visited: string[] = [];

    steps.push({
      highlights: [],
      visited: [],
      activeCodeLine: 0,
      label: "BST insertion visualization",
    });

    // Show the tree being built step by step by tracing insert paths
    // We'll collect all values and show insertion of the last one
    const allValues: number[] = [];
    function collectValues(node: TreeNode | undefined) {
      if (!node) return;
      allValues.push(node.value);
      collectValues(node.left);
      collectValues(node.right);
    }
    collectValues(root);

    if (allValues.length <= 1) {
      steps.push({
        highlights: ["root"],
        visited: ["root"],
        activeCodeLine: 1,
        label: `Tree has single node ${allValues[0] ?? "empty"}`,
      });
    } else {
      // Build tree incrementally and show each insertion
      const insertOrder = allValues;
      let currentTree: TreeNode = { value: insertOrder[0] };
      visited.push("root");

      steps.push({
        highlights: ["root"],
        visited: [...visited],
        activeCodeLine: 1,
        label: `Start with root = ${insertOrder[0]}`,
      });

      for (let i = 1; i < insertOrder.length; i++) {
        const val = insertOrder[i];
        steps.push({
          highlights: [],
          visited: [...visited],
          activeCodeLine: 0,
          label: `Insert ${val} into BST`,
        });

        generateInsertSteps(currentTree, "root", val, steps, visited);
        insertNode(currentTree, val);
      }
    }

    const allNodes = collectNodeIds(root, "root");
    steps.push({
      highlights: [],
      visited: allNodes,
      activeCodeLine: 7,
      label: `BST complete with ${allValues.length} nodes`,
    });

    return steps;
  },
};

export default binarySearchTreeInsert;
