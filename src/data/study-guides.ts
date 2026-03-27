import { StudyGuide } from "./types";

export const studyGuides: StudyGuide[] = [
  {
    slug: "arrays-and-hashing",
    title: "Arrays & Hashing",
    category: "Arrays",
    icon: "🗃️",
    overview:
      "Arrays and hash tables are the most fundamental data structures in programming. Hash maps provide O(1) average-time lookups, making them ideal for counting frequencies, detecting duplicates, and grouping related data. Mastering these patterns is essential because they appear in nearly every other algorithm topic.",
    whenToUse: [
      "You need to count frequencies or occurrences of elements",
      "You need O(1) lookups to check if an element exists",
      "You need to group elements by some shared property",
      "You need to find pairs or complements that satisfy a condition",
      "You need to remove duplicates or detect them quickly",
    ],
    approach:
      "The core idea is to use a hash map (JavaScript object or Map) as an auxiliary data structure to store information as you iterate through the array. This trades space for time, turning O(n^2) brute-force solutions into O(n) single-pass algorithms.\n\nFor frequency counting, iterate through the array once, incrementing a counter in the map for each element. For complement/pair problems like Two Sum, store each element's index as you go and check if the needed complement already exists in the map. For grouping problems like Group Anagrams, derive a canonical key (e.g., sorted characters) and collect items sharing the same key.\n\nA common optimization is bucket sort by frequency: create an array where the index represents frequency, then collect elements from the highest-frequency buckets. This gives O(n) time for \"top K frequent\" style problems without needing a heap.",
    codeTemplate: `// Frequency counting pattern
function frequencyCount(arr) {
  const map = new Map();
  for (const item of arr) {
    map.set(item, (map.get(item) || 0) + 1);
  }
  return map;
}

// Two Sum / complement lookup pattern
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}

// Grouping by key pattern
function groupByKey(items, keyFn) {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.values()];
}`,
    relatedProblems: [1, 217, 242, 49, 347, 128, 238, 36, 271, 659],
    externalLinks: [
      {
        title: "NeetCode - Arrays & Hashing Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Arrays & Hashing (YouTube Playlist)",
        url: "https://www.youtube.com/watch?v=KLlXCFG5TnA&list=PLot-Xpze53letfIu9dMzIIO7na_sqvl0w",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Hashing Data Structure",
        url: "https://www.geeksforgeeks.org/hashing-data-structure/",
        type: "article",
      },
      {
        title: "Programiz - Hash Table",
        url: "https://www.programiz.com/dsa/hash-table",
        type: "article",
      },
    ],
  },
  {
    slug: "two-pointers",
    title: "Two Pointers",
    category: "Arrays",
    icon: "👆",
    overview:
      "The two-pointer technique uses two references that move through a data structure, typically an array, to solve problems efficiently. By moving pointers toward each other or in the same direction based on conditions, you avoid nested loops and reduce time complexity from O(n^2) to O(n). This pattern is especially powerful on sorted arrays.",
    whenToUse: [
      "The array is sorted or you can sort it first",
      "You need to find pairs that satisfy a sum or difference condition",
      "You need to compare elements from both ends of an array",
      "You need to remove duplicates in-place from a sorted array",
      "You need to partition an array based on some condition",
    ],
    approach:
      "The most common variant places one pointer at the beginning and one at the end of a sorted array. Based on the comparison (e.g., whether the sum of the two elements is too large or too small), you move one pointer inward. This guarantees you examine every meaningful pair exactly once.\n\nFor problems like 3Sum, you fix one element and apply two pointers on the rest. The key insight is that sorting enables you to skip duplicates and know which direction to move. If the current sum is too small, move the left pointer right to increase it; if too large, move the right pointer left.\n\nThe same-direction variant (often called slow/fast pointers) is useful for in-place operations. For example, to remove duplicates from a sorted array, the slow pointer marks the position of the last unique element while the fast pointer scans ahead.",
    codeTemplate: `// Opposite-direction two pointers (sorted array)
function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}

// Three sum using two pointers
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
    relatedProblems: [125, 167, 15, 11, 42],
    externalLinks: [
      {
        title: "NeetCode - Two Pointers Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Two Pointers (YouTube)",
        url: "https://www.youtube.com/watch?v=cQ1Oz4ckceM",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Two Pointer Technique",
        url: "https://www.geeksforgeeks.org/two-pointers-technique/",
        type: "article",
      },
      {
        title: "Programiz - Two Pointer Algorithm",
        url: "https://www.programiz.com/dsa/two-pointers-algorithm",
        type: "article",
      },
    ],
  },
  {
    slug: "sliding-window",
    title: "Sliding Window",
    category: "Arrays",
    icon: "🪟",
    overview:
      "The sliding window pattern maintains a window (subarray or substring) that expands or contracts to find optimal subarrays satisfying certain constraints. Instead of recalculating from scratch for each possible subarray, the window incrementally adds and removes elements, achieving O(n) time. This pattern is essential for substring and subarray optimization problems.",
    whenToUse: [
      "You need to find a subarray or substring with a specific property (longest, shortest, containing certain characters)",
      "The problem involves contiguous elements in an array or string",
      "You need to track a running sum, count, or frequency within a range",
      "A brute-force approach would check all O(n^2) subarrays",
    ],
    approach:
      "The sliding window uses two pointers (left and right) that define the current window. The right pointer expands the window by including new elements, and the left pointer contracts it when constraints are violated. You maintain a running state (sum, frequency map, count) that updates incrementally.\n\nFor fixed-size windows, advance both pointers together. For variable-size windows, expand right until the window becomes invalid, then shrink from the left until it's valid again. Track the best answer found during this process.\n\nThe hardest part is determining when to shrink. For \"minimum window substring\" problems, shrink whenever the window satisfies the constraint (to find the minimum). For \"longest substring without repeating\" problems, shrink whenever a constraint is violated (to maintain validity).",
    codeTemplate: `// Variable-size sliding window (find longest valid window)
function longestValidWindow(s) {
  const freq = new Map();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) || 0) + 1);
    // Shrink while window is invalid
    while (/* window is invalid */) {
      freq.set(s[left], freq.get(s[left]) - 1);
      if (freq.get(s[left]) === 0) freq.delete(s[left]);
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

// Minimum window containing all target characters
function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let have = 0, required = need.size;
  let left = 0, minLen = Infinity, minStart = 0;
  const window = new Map();
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window.set(c, (window.get(c) || 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) have++;
    while (have === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      const d = s[left];
      window.set(d, window.get(d) - 1);
      if (need.has(d) && window.get(d) < need.get(d)) have--;
      left++;
    }
  }
  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}`,
    relatedProblems: [121, 3, 424, 76, 567, 209, 239],
    externalLinks: [
      {
        title: "NeetCode - Sliding Window Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Sliding Window Algorithm (YouTube)",
        url: "https://www.youtube.com/watch?v=1pkOgXD63yU",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Window Sliding Technique",
        url: "https://www.geeksforgeeks.org/window-sliding-technique/",
        type: "article",
      },
    ],
  },
  {
    slug: "stack",
    title: "Stack",
    category: "Arrays",
    icon: "📚",
    overview:
      "A stack is a last-in-first-out (LIFO) data structure where elements are added and removed from the same end. Stacks are ideal for problems involving matching pairs (like parentheses), maintaining a monotonic sequence, or processing nested structures. The monotonic stack variant is particularly powerful for \"next greater/smaller element\" problems.",
    whenToUse: [
      "You need to match opening and closing brackets or tags",
      "You need to find the next greater or smaller element for each position",
      "You need to evaluate expressions or handle nested structures",
      "You need to maintain elements in increasing or decreasing order",
      "You need to process elements in reverse order of their arrival",
    ],
    approach:
      "For matching problems (valid parentheses), push opening symbols onto the stack and pop when you see a closing symbol. If the popped element doesn't match or the stack is empty when it shouldn't be, the input is invalid.\n\nThe monotonic stack pattern maintains elements in sorted order. For \"next greater element\" problems, iterate through the array and pop elements from the stack that are smaller than the current element — the current element is the answer for each popped element. This processes each element at most twice (once pushed, once popped) for O(n) total.\n\nFor histogram/area problems, use a monotonic increasing stack. When you encounter a bar shorter than the stack's top, pop and calculate the area using the popped bar's height and the width between the current position and the new stack top.",
    codeTemplate: `// Valid parentheses pattern
function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const char of s) {
    if ('({['.includes(char)) {
      stack.push(char);
    } else {
      if (stack.pop() !== pairs[char]) return false;
    }
  }
  return stack.length === 0;
}

// Monotonic stack — next greater element
function nextGreaterElement(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // stores indices
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`,
    relatedProblems: [20, 155, 150, 739, 22, 84, 853],
    externalLinks: [
      {
        title: "NeetCode - Stack Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Stack Problems (YouTube)",
        url: "https://www.youtube.com/watch?v=WTzjTskDFMg",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Stack Data Structure",
        url: "https://www.geeksforgeeks.org/stack-data-structure/",
        type: "article",
      },
      {
        title: "Programiz - Stack Data Structure",
        url: "https://www.programiz.com/dsa/stack",
        type: "article",
      },
    ],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    category: "Arrays",
    icon: "🔍",
    overview:
      "Binary search eliminates half of the search space with each comparison, achieving O(log n) time on sorted data. Beyond simple element lookup, binary search can be applied to any problem where the search space is monotonic — meaning there's a clear boundary between valid and invalid answers. This generalization (binary search on answer) is a key technique for optimization problems.",
    whenToUse: [
      "The input array is sorted or can be treated as sorted",
      "You need to find an element or boundary in O(log n) time",
      "The search space has a monotonic property (all valid answers on one side, invalid on the other)",
      "You need to find the minimum or maximum value that satisfies a condition",
    ],
    approach:
      "Classic binary search maintains left and right bounds and repeatedly checks the middle element. If the target is smaller, search the left half; if larger, search the right half. The tricky part is handling boundaries correctly to avoid infinite loops and off-by-one errors.\n\nFor rotated sorted arrays, determine which half is properly sorted by comparing the middle element with the leftmost. Then check if the target falls within the sorted half. This approach works because at least one half of a rotated sorted array is always properly sorted.\n\nBinary search on answer applies when you can frame the problem as: \"What is the minimum/maximum value X such that condition(X) is true?\" You binary search over possible answer values, and for each candidate, check if it's feasible. The feasibility check itself might be O(n), making the total O(n log n).",
    codeTemplate: `// Standard binary search
function binarySearch(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// Binary search on answer (e.g., Koko eating bananas)
function minEatingSpeed(piles, h) {
  let left = 1, right = Math.max(...piles);
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    const hours = piles.reduce((sum, p) => sum + Math.ceil(p / mid), 0);
    if (hours <= h) right = mid;
    else left = mid + 1;
  }
  return left;
}

// Search in rotated sorted array
function searchRotated(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (target > nums[mid] && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
    relatedProblems: [704, 74, 35, 875, 33, 153, 981, 4],
    externalLinks: [
      {
        title: "NeetCode - Binary Search Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Binary Search (YouTube)",
        url: "https://www.youtube.com/watch?v=s4DPM8ct1pI",
        type: "video",
      },
      {
        title: "Abdul Bari - Binary Search (YouTube)",
        url: "https://www.youtube.com/watch?v=C2apEw9pgtw",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Binary Search",
        url: "https://www.geeksforgeeks.org/binary-search/",
        type: "article",
      },
    ],
  },
  {
    slug: "linked-lists",
    title: "Linked Lists",
    category: "Linked Lists",
    icon: "🔗",
    overview:
      "Linked lists store elements as nodes connected by pointers, allowing O(1) insertions and deletions at any position if you have a reference to it. Linked list problems test your ability to manipulate pointers carefully without losing references. The fast-and-slow pointer (Floyd's cycle detection) technique is a key pattern that extends beyond lists to any sequence with possible cycles.",
    whenToUse: [
      "You need to reverse, merge, or reorder a sequence of nodes",
      "You need to detect cycles in a linked structure",
      "You need to find the middle element or kth-from-end node efficiently",
      "You need to manipulate nodes in-place without extra space",
      "You need to merge multiple sorted sequences",
    ],
    approach:
      "For reversal problems, maintain three pointers: previous, current, and next. At each step, save the next node, point current's next to previous, then advance. This iterative approach is cleaner than recursion for full reversal.\n\nThe fast-and-slow pointer technique uses two pointers moving at different speeds. For cycle detection, the fast pointer moves two steps while the slow moves one — they'll meet inside the cycle if one exists. For finding the middle node, when the fast pointer reaches the end, the slow pointer is at the middle.\n\nFor merge problems (like merge k sorted lists), use a divide-and-conquer approach or a min-heap. Merge two lists by comparing their heads and appending the smaller one. Always use a dummy head node to simplify edge cases where the head of the result is unknown.",
    codeTemplate: `// Reverse a linked list
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

// Detect cycle (Floyd's algorithm)
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// Merge two sorted lists
function mergeTwoLists(l1, l2) {
  const dummy = { next: null };
  let tail = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  tail.next = l1 || l2;
  return dummy.next;
}`,
    relatedProblems: [206, 21, 141, 143, 19, 138, 2, 23, 25, 287],
    externalLinks: [
      {
        title: "NeetCode - Linked Lists Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Linked List (YouTube)",
        url: "https://www.youtube.com/watch?v=G0_I-ZF0S38",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Linked List Data Structure",
        url: "https://www.geeksforgeeks.org/data-structures/linked-list/",
        type: "article",
      },
      {
        title: "Programiz - Linked List",
        url: "https://www.programiz.com/dsa/linked-list",
        type: "article",
      },
    ],
  },
  {
    slug: "trees",
    title: "Trees",
    category: "Trees",
    icon: "🌳",
    overview:
      "Trees are hierarchical data structures where each node has zero or more children. Binary trees (at most two children per node) and binary search trees (left < root < right) are the most common. Tree problems naturally lend themselves to recursive solutions — the key insight is that a tree problem can often be decomposed into the same problem on the left and right subtrees.",
    whenToUse: [
      "You need to traverse or search hierarchical data",
      "The problem involves paths from root to leaf or between nodes",
      "You need to validate a BST property or find a specific node",
      "You need to serialize, deserialize, or construct a tree",
      "You need to compute properties like height, diameter, or balance",
    ],
    approach:
      "Most tree problems use one of two traversal strategies: DFS (depth-first search) or BFS (breadth-first search). DFS is naturally recursive — process the current node, then recurse on children. The three DFS orders are: preorder (root, left, right), inorder (left, root, right — gives sorted order for BSTs), and postorder (left, right, root — useful when you need children's results first).\n\nBFS uses a queue to process nodes level by level. This is ideal for level-order traversal, finding the minimum depth, or any problem that requires processing nodes in distance order from the root.\n\nFor many problems, define a recursive function that returns information from subtrees. For example, to find the diameter, each recursive call returns the height of its subtree while updating a global maximum for the longest path through any node. This \"return info upward while tracking global answer\" pattern is extremely common.",
    codeTemplate: `// DFS traversal patterns
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

// BFS level-order traversal
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}

// DFS with return value (max depth / height)
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    relatedProblems: [226, 104, 100, 572, 235, 102, 98, 230, 199, 105, 124, 297, 543, 110, 1448],
    externalLinks: [
      {
        title: "NeetCode - Trees Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Tree Problems (YouTube)",
        url: "https://www.youtube.com/watch?v=OnSn2XEQ4MY",
        type: "video",
      },
      {
        title: "Abdul Bari - Trees (YouTube)",
        url: "https://www.youtube.com/watch?v=EWCaGBCR8mE",
        type: "video",
      },
      {
        title: "Programiz - Binary Tree",
        url: "https://www.programiz.com/dsa/binary-tree",
        type: "article",
      },
    ],
  },
  {
    slug: "tries",
    title: "Tries",
    category: "Trees",
    icon: "🔤",
    overview:
      "A trie (prefix tree) is a tree-like data structure that stores strings character by character, where each node represents a prefix. Tries enable O(L) lookup, insertion, and prefix search where L is the string length — independent of how many strings are stored. They are the optimal choice for autocomplete, spell-checking, and prefix-matching problems.",
    whenToUse: [
      "You need to search for words or prefixes efficiently",
      "You need to implement autocomplete or word suggestion",
      "You need to find all words matching a pattern with wildcards",
      "You need to search a grid for words from a dictionary (word search)",
    ],
    approach:
      "A trie node contains a map of children (one per possible character) and a boolean flag indicating whether it marks the end of a complete word. To insert a word, traverse from the root, creating child nodes as needed, and mark the last node as a word end.\n\nTo search for a word, follow the character path from the root. If you reach a dead end (no child for the next character), the word doesn't exist. To search for a prefix, do the same but don't require the end-of-word flag.\n\nFor word search problems on grids, combine trie traversal with DFS/backtracking. Insert all dictionary words into a trie, then start DFS from each grid cell. At each step, check if the current path exists as a trie prefix — if not, prune that branch. This avoids checking words that can't possibly be formed from the current position.",
    codeTemplate: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEnd = true;
  }

  search(word) {
    const node = this._findNode(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix) {
    return this._findNode(prefix) !== null;
  }

  _findNode(s) {
    let node = this.root;
    for (const char of s) {
      if (!node.children[char]) return null;
      node = node.children[char];
    }
    return node;
  }
}`,
    relatedProblems: [208, 211, 212],
    externalLinks: [
      {
        title: "NeetCode - Tries Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Implement Trie (YouTube)",
        url: "https://www.youtube.com/watch?v=oobqoCJlHA0",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Trie Data Structure",
        url: "https://www.geeksforgeeks.org/trie-insert-and-search/",
        type: "article",
      },
      {
        title: "Programiz - Trie Data Structure",
        url: "https://www.programiz.com/dsa/trie",
        type: "article",
      },
    ],
  },
  {
    slug: "heap-priority-queue",
    title: "Heap / Priority Queue",
    category: "Trees",
    icon: "⛰️",
    overview:
      "A heap is a complete binary tree that maintains the heap property: the parent is always smaller (min-heap) or larger (max-heap) than its children. This allows O(1) access to the minimum/maximum element and O(log n) insertion and removal. Heaps are the backbone of priority queues and are essential for problems requiring repeated access to the extreme element.",
    whenToUse: [
      "You need repeated access to the minimum or maximum element",
      "You need to merge K sorted lists or streams",
      "You need to find the kth largest/smallest element efficiently",
      "You need to schedule tasks by priority or maintain a running median",
      "You need the top-K elements from a large dataset",
    ],
    approach:
      "JavaScript doesn't have a built-in heap, so you either implement one or use a sorted insertion approach for contest settings. A min-heap is an array where the parent at index i has children at 2i+1 and 2i+2. Insert by pushing to the end and bubbling up; remove the min by swapping root with the last element, popping, and bubbling down.\n\nFor kth largest problems, maintain a min-heap of size k. Every new element is compared with the heap's root (the smallest of the k largest). If it's bigger, remove the root and insert the new element. The root always holds the kth largest.\n\nFor running median, use two heaps: a max-heap for the lower half and a min-heap for the upper half. Balance their sizes so they differ by at most one. The median is the top of the larger heap (or the average of both tops if equal size).",
    codeTemplate: `// MinHeap implementation
class MinHeap {
  constructor() { this.data = []; }
  size() { return this.data.length; }
  peek() { return this.data[0]; }

  push(val) {
    this.data.push(val);
    this._bubbleUp(this.data.length - 1);
  }

  pop() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this._bubbleDown(0);
    }
    return top;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.data[parent] <= this.data[i]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  _bubbleDown(i) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1, right = 2 * i + 2;
      if (left < n && this.data[left] < this.data[smallest]) smallest = left;
      if (right < n && this.data[right] < this.data[smallest]) smallest = right;
      if (smallest === i) break;
      [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
      i = smallest;
    }
  }
}`,
    relatedProblems: [703, 1046, 973, 215, 621, 355, 295],
    externalLinks: [
      {
        title: "NeetCode - Heap / Priority Queue Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Heap Explained (YouTube)",
        url: "https://www.youtube.com/watch?v=t0Cq6tVNRBA",
        type: "video",
      },
      {
        title: "Abdul Bari - Heap (YouTube)",
        url: "https://www.youtube.com/watch?v=HqPJF2L5h9U",
        type: "video",
      },
      {
        title: "Programiz - Heap Data Structure",
        url: "https://www.programiz.com/dsa/heap-data-structure",
        type: "article",
      },
    ],
  },
  {
    slug: "backtracking",
    title: "Backtracking",
    category: "Advanced",
    icon: "🔙",
    overview:
      "Backtracking systematically explores all possible solutions by building candidates incrementally and abandoning (backtracking from) a candidate as soon as it's determined to be invalid. It's essentially a depth-first search through the solution space. Backtracking is the go-to approach for combinatorial problems like generating permutations, combinations, subsets, and solving constraint satisfaction problems.",
    whenToUse: [
      "You need to generate all permutations, combinations, or subsets",
      "You need to solve constraint satisfaction problems (Sudoku, N-Queens)",
      "You need to find all paths or configurations that satisfy certain conditions",
      "The problem asks for 'all possible' results or 'every valid' arrangement",
      "You can prune invalid branches early to avoid exponential blowup",
    ],
    approach:
      "The backtracking template has three key components: a base case (when a valid solution is found, add it to results), a loop that tries each possible choice at the current step, and a recursive call followed by undoing the choice (backtracking).\n\nFor subset/combination problems, use a start index to avoid revisiting earlier elements. For permutation problems, use a visited set or swap elements. For problems with duplicates, sort first and skip consecutive equal elements at the same decision level.\n\nPruning is what makes backtracking practical. Before making a choice, check if it can possibly lead to a valid solution. For example, in N-Queens, check column, diagonal, and anti-diagonal conflicts before placing each queen. Good pruning can reduce exponential time dramatically.",
    codeTemplate: `// Subsets (power set)
function subsets(nums) {
  const result = [];
  function backtrack(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop(); // backtrack
    }
  }
  backtrack(0, []);
  return result;
}

// Permutations
function permute(nums) {
  const result = [];
  function backtrack(current, remaining) {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      backtrack(current, [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
      current.pop();
    }
  }
  backtrack([], nums);
  return result;
}

// Combination sum with pruning
function combinationSum(candidates, target) {
  const result = [];
  candidates.sort((a, b) => a - b);
  function backtrack(start, remaining, current) {
    if (remaining === 0) { result.push([...current]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break; // pruning
      current.push(candidates[i]);
      backtrack(i, remaining - candidates[i], current);
      current.pop();
    }
  }
  backtrack(0, target, []);
  return result;
}`,
    relatedProblems: [78, 46, 39, 40, 79, 90, 17, 51, 131],
    externalLinks: [
      {
        title: "NeetCode - Backtracking Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Backtracking (YouTube)",
        url: "https://www.youtube.com/watch?v=REOH22Xwdkk",
        type: "video",
      },
      {
        title: "Abdul Bari - Backtracking (YouTube)",
        url: "https://www.youtube.com/watch?v=DKCbsiDBN6c",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Backtracking Algorithm",
        url: "https://www.geeksforgeeks.org/backtracking-algorithms/",
        type: "article",
      },
    ],
  },
  {
    slug: "graphs",
    title: "Graphs",
    category: "Graphs",
    icon: "🕸️",
    overview:
      "Graphs model relationships between entities using nodes (vertices) and edges. They can be directed or undirected, weighted or unweighted, and may contain cycles. Graph algorithms like BFS, DFS, topological sort, and shortest-path algorithms are essential for problems involving connectivity, shortest paths, dependency ordering, and network analysis.",
    whenToUse: [
      "The problem involves connections or relationships between entities",
      "You need to find connected components or check if nodes are reachable",
      "You need to find the shortest path between nodes",
      "You need to determine an ordering that respects dependencies (topological sort)",
      "You need to detect cycles in a directed or undirected structure",
    ],
    approach:
      "First, choose a representation: adjacency list (array of lists, best for sparse graphs) or adjacency matrix (2D array, best for dense graphs). Most interview problems use adjacency lists. Build the graph from the input, then apply the appropriate traversal.\n\nBFS explores nodes layer by layer, making it ideal for shortest-path problems in unweighted graphs. Use a queue and a visited set. DFS goes as deep as possible before backtracking, making it natural for detecting cycles, exploring all paths, and topological sorting.\n\nTopological sort orders nodes in a DAG so that for every edge u→v, u comes before v. Use Kahn's algorithm (BFS with in-degree tracking) or DFS with post-order recording. For weighted shortest paths, use Dijkstra's algorithm (priority queue) for non-negative weights or Bellman-Ford for graphs with negative weights.",
    codeTemplate: `// BFS shortest path in unweighted graph
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [[start, 0]];
  while (queue.length) {
    const [node, dist] = queue.shift();
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
}

// DFS on grid (e.g., number of islands)
function numIslands(grid) {
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0'; // mark visited
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { count++; dfs(r, c); }
    }
  }
  return count;
}

// Topological sort (Kahn's BFS)
function topologicalSort(numNodes, edges) {
  const graph = Array.from({ length: numNodes }, () => []);
  const inDegree = new Array(numNodes).fill(0);
  for (const [u, v] of edges) {
    graph[u].push(v);
    inDegree[v]++;
  }
  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node]) {
      if (--inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return order.length === numNodes ? order : []; // empty if cycle
}`,
    relatedProblems: [200, 133, 130, 695, 417, 207, 210, 323, 127, 743],
    externalLinks: [
      {
        title: "NeetCode - Graphs Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Graph Algorithms (YouTube)",
        url: "https://www.youtube.com/watch?v=EgI5nU9etnU",
        type: "video",
      },
      {
        title: "Abdul Bari - Graph Traversals BFS & DFS (YouTube)",
        url: "https://www.youtube.com/watch?v=pcKY4hjDrxk",
        type: "video",
      },
      {
        title: "Programiz - Graph Data Structure",
        url: "https://www.programiz.com/dsa/graph",
        type: "article",
      },
    ],
  },
  {
    slug: "dynamic-programming-1d",
    title: "Dynamic Programming (1D)",
    category: "Dynamic Programming",
    icon: "📊",
    overview:
      "Dynamic programming (DP) solves problems by breaking them into overlapping subproblems, solving each subproblem once, and storing results to avoid redundant computation. 1D DP uses a single array (or a few variables) to store subproblem results, where each state depends on a fixed number of previous states. This covers problems like climbing stairs, house robber, coin change, and longest increasing subsequence.",
    whenToUse: [
      "The problem has optimal substructure (optimal solution built from optimal sub-solutions)",
      "The problem has overlapping subproblems (same subproblem solved multiple times)",
      "You need to count the number of ways to reach a target",
      "You need to find the minimum/maximum cost, length, or count along a linear sequence",
      "A recursive solution has exponential time due to repeated work",
    ],
    approach:
      "Start by defining the state: what does dp[i] represent? For climbing stairs, dp[i] = number of ways to reach step i. For coin change, dp[i] = minimum coins to make amount i. For longest increasing subsequence, dp[i] = length of LIS ending at index i.\n\nNext, write the recurrence relation. For climbing stairs: dp[i] = dp[i-1] + dp[i-2]. For coin change: dp[i] = min(dp[i - coin] + 1) for each coin. Identify the base cases (dp[0], dp[1], etc.).\n\nOften you can optimize space from O(n) to O(1) by noting that each state depends on only a constant number of previous states. For house robber, you only need the previous two values, so two variables suffice instead of an array.",
    codeTemplate: `// Climbing stairs (Fibonacci pattern)
function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

// Coin change (minimize)
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Longest increasing subsequence
function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}`,
    relatedProblems: [70, 746, 198, 213, 5, 647, 322, 139, 300, 152, 91, 416],
    externalLinks: [
      {
        title: "NeetCode - 1D Dynamic Programming Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Dynamic Programming (YouTube)",
        url: "https://www.youtube.com/watch?v=73r3KWiEvyk",
        type: "video",
      },
      {
        title: "Abdul Bari - Dynamic Programming (YouTube)",
        url: "https://www.youtube.com/watch?v=5dRGRueKU3M",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Dynamic Programming",
        url: "https://www.geeksforgeeks.org/dynamic-programming/",
        type: "article",
      },
    ],
  },
  {
    slug: "dynamic-programming-2d",
    title: "Dynamic Programming (2D)",
    category: "Dynamic Programming",
    icon: "📈",
    overview:
      "2D dynamic programming extends the 1D concept by using a two-dimensional table where each cell dp[i][j] represents the solution to a subproblem defined by two parameters. This is necessary when the state depends on two changing variables, such as two string indices, a range of elements, or grid coordinates. Classic examples include edit distance, longest common subsequence, and grid path counting.",
    whenToUse: [
      "The problem involves two sequences that need to be compared or aligned",
      "You need to find paths or costs in a 2D grid",
      "The subproblem requires two indices to define its state (e.g., substring i..j)",
      "You need to compute optimal solutions over ranges (interval DP)",
    ],
    approach:
      "Define dp[i][j] clearly. For longest common subsequence: dp[i][j] = LCS length of first i characters and first j characters. For edit distance: dp[i][j] = minimum edits to convert first i chars of word1 to first j chars of word2. For grid paths: dp[i][j] = number of paths to reach cell (i,j).\n\nFill the table using nested loops, typically iterating i from 0 to m and j from 0 to n. Initialize base cases (first row, first column, or diagonal). The recurrence often involves looking at dp[i-1][j], dp[i][j-1], and dp[i-1][j-1].\n\nSpace optimization: if each row only depends on the previous row, you can reduce from O(mn) to O(n) space by using two 1D arrays (current and previous row) or even a single array with careful ordering.",
    codeTemplate: `// Longest common subsequence
function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// Unique paths in grid
function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}

// Edit distance (Levenshtein)
function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    new Array(n + 1).fill(0).map((_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
    relatedProblems: [62, 1143, 72, 97, 329, 115, 309, 494, 518, 312, 10],
    externalLinks: [
      {
        title: "NeetCode - 2D Dynamic Programming Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - 2D Dynamic Programming (YouTube)",
        url: "https://www.youtube.com/watch?v=Ua0GhsJSlWM",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Longest Common Subsequence",
        url: "https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/",
        type: "article",
      },
      {
        title: "Programiz - Longest Common Subsequence",
        url: "https://www.programiz.com/dsa/longest-common-subsequence",
        type: "article",
      },
    ],
  },
  {
    slug: "greedy",
    title: "Greedy",
    category: "Advanced",
    icon: "💰",
    overview:
      "Greedy algorithms make the locally optimal choice at each step, hoping to find the global optimum. Unlike dynamic programming, greedy doesn't reconsider past decisions. Greedy works when the problem has the greedy choice property (a locally optimal choice leads to a globally optimal solution) and optimal substructure. Proving a greedy approach is correct is often the hardest part.",
    whenToUse: [
      "You need to maximize or minimize a value by making sequential choices",
      "The locally optimal choice at each step leads to the global optimum",
      "The problem involves scheduling, interval selection, or activity selection",
      "A sorting step followed by a single scan can solve the problem",
      "You need to determine if a goal is achievable by greedy extension (like jump game)",
    ],
    approach:
      "Greedy problems often start with sorting the input by some criterion. For interval scheduling, sort by end time and greedily select non-overlapping intervals. For the jump game, track the farthest reachable position and check if you can reach the end.\n\nFor maximum subarray (Kadane's algorithm), the greedy choice is: at each position, either extend the current subarray or start a new one. If the running sum becomes negative, it's always better to start fresh. This is greedy because you never look back.\n\nThe hardest part of greedy problems is convincing yourself (or the interviewer) that the greedy strategy is correct. One approach: assume there exists an optimal solution that makes a different choice at some step, and show you can swap in the greedy choice without making things worse (exchange argument).",
    codeTemplate: `// Maximum subarray (Kadane's algorithm)
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}

// Jump game — can you reach the end?
function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}

// Jump game II — minimum jumps to reach end
function jump(nums) {
  let jumps = 0, currentEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;
    }
  }
  return jumps;
}`,
    relatedProblems: [53, 55, 45, 134, 678, 763, 846],
    externalLinks: [
      {
        title: "NeetCode - Greedy Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Greedy Algorithms (YouTube)",
        url: "https://www.youtube.com/watch?v=bC7o8P_Ste4",
        type: "video",
      },
      {
        title: "Abdul Bari - Greedy Algorithms (YouTube)",
        url: "https://www.youtube.com/watch?v=ARvQcqJ_-NY",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Greedy Algorithms",
        url: "https://www.geeksforgeeks.org/greedy-algorithms/",
        type: "article",
      },
    ],
  },
  {
    slug: "intervals",
    title: "Intervals",
    category: "Advanced",
    icon: "📏",
    overview:
      "Interval problems deal with ranges defined by a start and end point. The key technique is sorting intervals (usually by start time) and then scanning through them to merge, insert, or count overlaps. Interval problems appear frequently in scheduling, calendar, and resource allocation contexts. The sorting step transforms a complex problem into a simple linear scan.",
    whenToUse: [
      "You need to merge overlapping intervals",
      "You need to insert a new interval into a sorted list of non-overlapping intervals",
      "You need to find the minimum number of intervals to remove to eliminate all overlaps",
      "You need to determine the maximum number of concurrent/overlapping intervals",
      "You need to check if a person can attend all meetings (no overlaps)",
    ],
    approach:
      "Almost all interval problems start with sorting by start time (or sometimes end time). After sorting, scan left to right. For merging, compare each interval with the last one in the result: if they overlap (current start <= previous end), merge by extending the end; otherwise, add the current interval as a new entry.\n\nFor finding the minimum rooms (or maximum overlap), use the sweep line technique: create events for each start (+1) and end (-1), sort them, and scan through to find the maximum concurrent count. Alternatively, use two sorted arrays of start and end times with two pointers.\n\nFor minimum removals to eliminate overlaps (non-overlapping intervals), sort by end time and greedily keep intervals that don't conflict. This is equivalent to the classic activity selection problem where you maximize the number of non-overlapping intervals.",
    codeTemplate: `// Merge overlapping intervals
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged;
}

// Insert interval into non-overlapping sorted list
function insert(intervals, newInterval) {
  const result = [];
  let i = 0;
  // Add all intervals that end before newInterval starts
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i++]);
  }
  // Merge overlapping intervals with newInterval
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  // Add remaining intervals
  while (i < intervals.length) result.push(intervals[i++]);
  return result;
}

// Minimum meeting rooms (max overlap count)
function minMeetingRooms(intervals) {
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
  let rooms = 0, maxRooms = 0, e = 0;
  for (let s = 0; s < starts.length; s++) {
    if (starts[s] < ends[e]) rooms++;
    else e++;
    maxRooms = Math.max(maxRooms, rooms);
  }
  return maxRooms;
}`,
    relatedProblems: [56, 57, 435, 252, 253, 1851],
    externalLinks: [
      {
        title: "NeetCode - Intervals Roadmap",
        url: "https://neetcode.io/roadmap",
        type: "course",
      },
      {
        title: "NeetCode - Merge Intervals (YouTube)",
        url: "https://www.youtube.com/watch?v=44H3cEC2fFM",
        type: "video",
      },
      {
        title: "GeeksForGeeks - Merge Overlapping Intervals",
        url: "https://www.geeksforgeeks.org/merging-intervals/",
        type: "article",
      },
      {
        title: "Programiz - Interval Scheduling",
        url: "https://www.programiz.com/dsa/greedy-algorithm",
        type: "article",
      },
    ],
  },
];
