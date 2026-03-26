export type Category = "Arrays" | "Trees" | "Linked Lists" | "Graphs";

export interface Preset {
  name: string;
  data: unknown;
}

export interface Step {
  highlights: string[];
  visited: string[];
  positions?: Record<string, [number, number, number]>;
  activeCodeLine: number;
  label: string;
}

export interface Algorithm {
  name: string;
  slug: string;
  category: Category;
  description: string;
  complexity: { time: string; space: string };
  code: string[];
  presets: Preset[];
  leetcodeProblems: string[];
  generateSteps: (data: unknown) => Step[];
}

export interface ArrayPresetData {
  array: number[];
  target?: number;
  windowSize?: number;
}

export interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

export interface TreePresetData {
  root: TreeNode;
}

export interface LinkedListPresetData {
  values: number[];
}

export interface GraphPresetData {
  nodes: string[];
  edges: [string, string][];
  startNode: string;
}
