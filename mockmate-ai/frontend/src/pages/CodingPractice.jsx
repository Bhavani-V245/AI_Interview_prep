import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  BookOpen, 
  Terminal, 
  CheckCircle2, 
  ChevronLeft, 
  Loader2, 
  Award, 
  Zap, 
  Target, 
  Send,
  Sparkles,
  Search,
  Layers,
  Type,
  Link2,
  Cpu,
  ListCollapse,
  GitBranch,
  Network,
  Workflow,
  Repeat,
  ArrowUpDown,
  Binary,
  Database,
  Grid,
  Scale,
  Smile,
  Package,
  Play,
  RotateCcw,
  Trophy,
  Flame,
  HelpCircle,
  Clock,
  Maximize2,
  Minimize2,
  ListOrdered,
  BookOpenCheck,
  Layout,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

// Massive High-Quality Questions Pool (5 high-quality problems per topic = 85 problems!)
const PRACTICE_QUESTIONS = {
  "Arrays": [
    {
      id: "arr_1",
      title: "Two Sum",
      difficulty: "Easy",
      description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
        { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
      ],
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
      starterCode: {
        javascript: "function twoSum(nums, target) {\n  // Write your code here\n  \n}",
        python: "def twoSum(nums, target):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "arr_2",
      title: "Maximum Subarray",
      difficulty: "Medium",
      description: "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
      examples: [
        { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6 (subarray: [4,-1,2,1])" },
        { input: "nums = [1]", output: "1" }
      ],
      constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      starterCode: {
        javascript: "function maxSubArray(nums) {\n  // Write your code here\n  \n}",
        python: "def maxSubArray(nums):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "arr_3",
      title: "Container With Most Water",
      difficulty: "Hard",
      description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
      examples: [
        { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
        { input: "height = [1,1]", output: "1" }
      ],
      constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
      starterCode: {
        javascript: "function maxArea(height) {\n  // Write your code here\n  \n}",
        python: "def maxArea(height):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "arr_4",
      title: "Merge Sorted Array",
      difficulty: "Easy",
      description: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively. Merge `nums2` into `nums1` as one sorted array.",
      examples: [
        { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" }
      ],
      constraints: ["nums1.length == m + n", "nums2.length == n", "0 <= m, n <= 200"],
      starterCode: {
        javascript: "function merge(nums1, m, nums2, n) {\n  // Write your code here\n  \n}",
        python: "def merge(nums1, m, nums2, n):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "arr_5",
      title: "Product of Array Except Self",
      difficulty: "Medium",
      description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. You must write an algorithm that runs in `O(n)` time and without using the division operation.",
      examples: [
        { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }
      ],
      constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"],
      starterCode: {
        javascript: "function productExceptSelf(nums) {\n  // Write your code here\n  \n}",
        python: "def productExceptSelf(nums):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Strings": [
    {
      id: "str_1",
      title: "Valid Palindrome",
      difficulty: "Easy",
      description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
      examples: [
        { input: "s = \"A man, a plan, a canal: Panama\"", output: "true" },
        { input: "s = \"race a car\"", output: "false" }
      ],
      constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
      starterCode: {
        javascript: "function isPalindrome(s) {\n  // Write your code here\n  \n}",
        python: "def isPalindrome(s):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "str_2",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      description: "Given a string `s`, find the length of the longest substring without repeating characters.",
      examples: [
        { input: "s = \"abcabcbb\"", output: "3" },
        { input: "s = \"bbbbb\"", output: "1" }
      ],
      constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
      starterCode: {
        javascript: "function lengthOfLongestSubstring(s) {\n  // Write your code here\n  \n}",
        python: "def lengthOfLongestSubstring(s):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "str_3",
      title: "Group Anagrams",
      difficulty: "Medium",
      description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
      examples: [
        { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }
      ],
      constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
      starterCode: {
        javascript: "function groupAnagrams(strs) {\n  // Write your code here\n  \n}",
        python: "def groupAnagrams(strs):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "str_4",
      title: "Valid Anagram",
      difficulty: "Easy",
      description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.",
      examples: [
        { input: "s = \"anagram\", t = \"nagaram\"", output: "true" }
      ],
      constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
      starterCode: {
        javascript: "function isAnagram(s, t) {\n  // Write your code here\n  \n}",
        python: "def isAnagram(s, t):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "str_5",
      title: "Longest Common Prefix",
      difficulty: "Easy",
      description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string `\"\"`.",
      examples: [
        { input: "strs = [\"flower\",\"flow\",\"flight\"]", output: "\"fl\"" }
      ],
      constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] consists of only lowercase English letters."],
      starterCode: {
        javascript: "function longestCommonPrefix(strs) {\n  // Write your code here\n  \n}",
        python: "def longestCommonPrefix(strs):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Linked List": [
    {
      id: "ll_1",
      title: "Reverse Linked List",
      difficulty: "Easy",
      description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
      examples: [
        { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }
      ],
      constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
      starterCode: {
        javascript: "// Definition for singly-linked list:\n// function ListNode(val, next) { this.val = val; this.next = next; }\nfunction reverseList(head) {\n  // Write your code here\n  \n}",
        python: "# Definition for singly-linked list:\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef reverseList(head):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "ll_2",
      title: "Linked List Cycle",
      difficulty: "Easy",
      description: "Given `head`, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.",
      examples: [
        { input: "head = [3,2,0,-4], pos = 1", output: "true" }
      ],
      constraints: ["The number of nodes in the list is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5"],
      starterCode: {
        javascript: "function hasCycle(head) {\n  // Write your code here\n  \n}",
        python: "def hasCycle(head):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "ll_3",
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      description: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
      examples: [
        { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
      ],
      constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100"],
      starterCode: {
        javascript: "function mergeTwoLists(list1, list2) {\n  // Write your code here\n  \n}",
        python: "def mergeTwoLists(list1, list2):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "ll_4",
      title: "Remove Nth Node From End of List",
      difficulty: "Medium",
      description: "Given the `head` of a linked list, remove the `n`-th node from the end of the list and return its head.",
      examples: [
        { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" }
      ],
      constraints: ["The number of nodes in the list is sz.", "1 <= sz <= 30", "0 <= Node.val <= 100", "1 <= n <= sz"],
      starterCode: {
        javascript: "function removeNthFromEnd(head, n) {\n  // Write your code here\n  \n}",
        python: "def removeNthFromEnd(head, n):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "ll_5",
      title: "Middle of the Linked List",
      difficulty: "Easy",
      description: "Given the `head` of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.",
      examples: [
        { input: "head = [1,2,3,4,5]", output: "[3,4,5]" }
      ],
      constraints: ["The number of nodes in the list is in the range [1, 100]."],
      starterCode: {
        javascript: "function middleNode(head) {\n  // Write your code here\n  \n}",
        python: "def middleNode(head):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Stack": [
    {
      id: "stk_1",
      title: "Valid Parentheses",
      difficulty: "Easy",
      description: "Given a string `s` containing just the characters `'(''`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.",
      examples: [
        { input: "s = \"()\"", output: "true" },
        { input: "s = \"()[]{}\"", output: "true" }
      ],
      constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only."],
      starterCode: {
        javascript: "function isValid(s) {\n  // Write your code here\n  \n}",
        python: "def isValid(s):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "stk_2",
      title: "Min Stack",
      difficulty: "Medium",
      description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the `MinStack` class.",
      examples: [
        { input: "[\"MinStack\",\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"]", output: "[null,null,null,null,-3,null,2,-2]" }
      ],
      constraints: ["-2^31 <= val <= 2^31 - 1", "Methods will be called at most 3 * 10^4 times."],
      starterCode: {
        javascript: "class MinStack {\n  constructor() {\n    \n  }\n  push(val) {}\n  pop() {}\n  top() {}\n  getMin() {}\n}",
        python: "class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        pass\n    def getMin(self) -> int:\n        pass"
      }
    },
    {
      id: "stk_3",
      title: "Evaluate Reverse Polish Notation",
      difficulty: "Medium",
      description: "You are given an array of strings `tokens` that represents an arithmetic expression in a Reverse Polish Notation (Postfix). Evaluate the expression. Return an integer that represents the value of the expression.",
      examples: [
        { input: "tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]", output: "9 ((2 + 1) * 3)" }
      ],
      constraints: ["1 <= tokens.length <= 10^4", "tokens[i] is either an operator or an integer in range [-200, 200]."],
      starterCode: {
        javascript: "function evalRPN(tokens) {\n  // Write your code here\n  \n}",
        python: "def evalRPN(tokens):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "stk_4",
      title: "Implement Queue using Stacks",
      difficulty: "Easy",
      description: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (`push`, `peek`, `pop`, and `empty`).",
      examples: [
        { input: "[\"MyQueue\", \"push\", \"push\", \"peek\", \"pop\", \"empty\"]", output: "[null, null, null, 1, 1, false]" }
      ],
      constraints: ["1 <= x <= 9", "At most 100 calls will be made to push, pop, peek, and empty."],
      starterCode: {
        javascript: "class MyQueue {\n  constructor() {}\n  push(x) {}\n  pop() {}\n  peek() {}\n  empty() {}\n}",
        python: "class MyQueue:\n    def __init__(self):\n        pass\n    def push(self, x: int) -> None:\n        pass\n    def pop(self) -> int:\n        pass\n    def peek(self) -> int:\n        pass\n    def empty(self) -> bool:\n        pass"
      }
    },
    {
      id: "stk_5",
      title: "Daily Temperatures",
      difficulty: "Medium",
      description: "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`-th day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.",
      examples: [
        { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" }
      ],
      constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
      starterCode: {
        javascript: "function dailyTemperatures(temperatures) {\n  // Write your code here\n  \n}",
        python: "def dailyTemperatures(temperatures):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Queue": [
    {
      id: "q_1",
      title: "Number of Recent Calls",
      difficulty: "Easy",
      description: "You have a `RecentCounter` class which counts the number of recent requests within a certain time frame. Implement the class to count requests in the last 3000 milliseconds.",
      examples: [
        { input: "[\"RecentCounter\", \"ping\", \"ping\", \"ping\", \"ping\"]", output: "[null, 1, 2, 3, 3]" }
      ],
      constraints: ["1 <= t <= 10^9", "Each test case will call ping with strictly increasing values of t."],
      starterCode: {
        javascript: "class RecentCounter {\n  constructor() {}\n  ping(t) {}\n}",
        python: "class RecentCounter:\n    def __init__(self):\n        pass\n    def ping(self, t: int) -> int:\n        pass"
      }
    },
    {
      id: "q_2",
      title: "Design Circular Queue",
      difficulty: "Medium",
      description: "Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle and the last position is connected back to the first position to make a circle.",
      examples: [
        { input: "[\"MyCircularQueue\", \"enQueue\", \"enQueue\", \"Rear\", \"isFull\"]", output: "[null, true, true, 2, false]" }
      ],
      constraints: ["1 <= k <= 1000", "0 <= value <= 1000", "At most 3000 calls will be made to enqueue/dequeue methods."],
      starterCode: {
        javascript: "class MyCircularQueue {\n  constructor(k) {}\n  enQueue(value) {}\n  deQueue() {}\n  Front() {}\n  Rear() {}\n  isEmpty() {}\n  isFull() {}\n}",
        python: "class MyCircularQueue:\n    def __init__(self, k: int):\n        pass\n    def enQueue(self, value: int) -> bool:\n        pass\n    def deQueue(self) -> bool:\n        pass\n    def Front(self) -> int:\n        pass\n    def Rear(self) -> int:\n        pass\n    def isEmpty(self) -> bool:\n        pass\n    def isFull(self) -> bool:\n        pass"
      }
    },
    {
      id: "q_3",
      title: "Implement Stack using Queues",
      difficulty: "Easy",
      description: "Implement a last-in-first-out (LIFO) stack using only queues. The implemented stack should support all the normal stack operations (`push`, `top`, `pop`, and `empty`).",
      examples: [
        { input: "[\"MyStack\", \"push\", \"push\", \"top\", \"pop\", \"empty\"]", output: "[null, null, null, 2, 2, false]" }
      ],
      constraints: ["1 <= x <= 9", "At most 100 calls will be made to push, pop, top, and empty."],
      starterCode: {
        javascript: "class MyStack {\n  constructor() {}\n  push(x) {}\n  pop() {}\n  top() {}\n  empty() {}\n}",
        python: "class MyStack:\n    def __init__(self):\n        pass\n    def push(self, x: int) -> None:\n        pass\n    def pop(self) -> int:\n        pass\n    def top(self) -> int:\n        pass\n    def empty(self) -> bool:\n        pass"
      }
    },
    {
      id: "q_4",
      title: "Moving Average from Data Stream",
      difficulty: "Easy",
      description: "Given a stream of integers and a window size, calculate the moving average of all integers in the sliding window.",
      examples: [
        { input: "[\"MovingAverage\", \"next\", \"next\", \"next\"]", output: "[null, 1.0, 5.5, 4.66]" }
      ],
      constraints: ["1 <= size <= 1000", "-10^5 <= val <= 10^5"],
      starterCode: {
        javascript: "class MovingAverage {\n  constructor(size) {}\n  next(val) {}\n}",
        python: "class MovingAverage:\n    def __init__(self, size: int):\n        pass\n    def next(self, val: int) -> float:\n        pass"
      }
    },
    {
      id: "q_5",
      title: "Task Scheduler",
      difficulty: "Medium",
      description: "Given a characters array `tasks`, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle. However, there is a non-negative integer `n` that represents the cooldown period between two same tasks. Return the least number of units of times that the CPU will take to finish all the given tasks.",
      examples: [
        { input: "tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2", output: "8 (A -> B -> idle -> A -> B -> idle -> A -> B)" }
      ],
      constraints: ["1 <= tasks.length <= 10^4", "0 <= n <= 100", "tasks[i] consists of uppercase English letters."],
      starterCode: {
        javascript: "function leastInterval(tasks, n) {\n  // Write your code here\n  \n}",
        python: "def leastInterval(tasks, n):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Trees": [
    {
      id: "t_1",
      title: "Invert Binary Tree",
      difficulty: "Easy",
      description: "Given the `root` of a binary tree, invert the tree, and return its root.",
      examples: [
        { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }
      ],
      constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
      starterCode: {
        javascript: "function invertTree(root) {\n  // Write your code here\n  \n}",
        python: "def invertTree(root):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "t_2",
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      description: "Given the `root` of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "3" }
      ],
      constraints: ["The number of nodes in the tree is in the range [0, 10^4].", "-100 <= Node.val <= 100"],
      starterCode: {
        javascript: "function maxDepth(root) {\n  // Write your code here\n  \n}",
        python: "def maxDepth(root):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "t_3",
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      description: "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
      examples: [
        { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }
      ],
      constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"],
      starterCode: {
        javascript: "function levelOrder(root) {\n  // Write your code here\n  \n}",
        python: "def levelOrder(root):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "t_4",
      title: "Same Tree",
      difficulty: "Easy",
      description: "Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
      examples: [
        { input: "p = [1,2,3], q = [1,2,3]", output: "true" }
      ],
      constraints: ["The number of nodes in both trees is in range [0, 100]."],
      starterCode: {
        javascript: "function isSameTree(p, q) {\n  // Write your code here\n  \n}",
        python: "def isSameTree(p, q):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "t_5",
      title: "Path Sum",
      difficulty: "Easy",
      description: "Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`.",
      examples: [
        { input: "root = [5,4,8,11,null,13,4], targetSum = 22", output: "true" }
      ],
      constraints: ["The number of nodes in the tree is in range [0, 5000].", "-1000 <= Node.val <= 1000"],
      starterCode: {
        javascript: "function hasPathSum(root, targetSum) {\n  // Write your code here\n  \n}",
        python: "def hasPathSum(root, targetSum):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Graphs": [
    {
      id: "g_1",
      title: "Number of Islands",
      difficulty: "Medium",
      description: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
      examples: [
        { input: "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"]]", output: "2" }
      ],
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'."],
      starterCode: {
        javascript: "function numIslands(grid) {\n  // Write your code here\n  \n}",
        python: "def numIslands(grid):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "g_2",
      title: "Clone Graph",
      difficulty: "Medium",
      description: "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph. Each node in the graph contains a value (`int`) and a list of its neighbors (`List[Node]`).",
      examples: [
        { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]" }
      ],
      constraints: ["The number of nodes in the graph is between 0 and 100.", "1 <= Node.val <= 100", "Node.val is unique for each node."],
      starterCode: {
        javascript: "function cloneGraph(node) {\n  // Write your code here\n  \n}",
        python: "def cloneGraph(node):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "g_3",
      title: "Course Schedule",
      difficulty: "Medium",
      description: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`. Return `true` if you can finish all courses. Otherwise, return `false`.",
      examples: [
        { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
        { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" }
      ],
      constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000", "prerequisites[i].length == 2"],
      starterCode: {
        javascript: "function canFinish(numCourses, prerequisites) {\n  // Write your code here\n  \n}",
        python: "def canFinish(numCourses, prerequisites):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "g_4",
      title: "Flood Fill",
      difficulty: "Easy",
      description: "An image is represented by an `m x n` integer grid `image` where `image[i][j]` represents the pixel value of the image. You are also given three integers `sr`, `sc`, and `color`. You should perform a flood fill on the image starting from the pixel `image[sr][sc]`.",
      examples: [
        { input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2", output: "[[2,2,2],[2,2,0],[2,0,1]]" }
      ],
      constraints: ["m == image.length", "n == image[i].length", "1 <= m, n <= 50", "0 <= sr < m", "0 <= sc < n"],
      starterCode: {
        javascript: "function floodFill(image, sr, sc, color) {\n  // Write your code here\n  \n}",
        python: "def floodFill(image, sr, sc, color):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "g_5",
      title: "Pacific Atlantic Water Flow",
      difficulty: "Hard",
      description: "There is an `m x n` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges. Return a 2D list of grid coordinates where rainwater can flow to both oceans.",
      examples: [
        { input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1]]", output: "[[0,4],[1,3],[1,4],[2,2]]" }
      ],
      constraints: ["m == heights.length", "n == heights[r].length", "1 <= m, n <= 200"],
      starterCode: {
        javascript: "function pacificAtlantic(heights) {\n  // Write your code here\n  \n}",
        python: "def pacificAtlantic(heights):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Dynamic Programming": [
    {
      id: "dp_1",
      title: "Climbing Stairs",
      difficulty: "Easy",
      description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      examples: [
        { input: "n = 2", output: "2 (1+1, 2)" },
        { input: "n = 3", output: "3 (1+1+1, 1+2, 2+1)" }
      ],
      constraints: ["1 <= n <= 45"],
      starterCode: {
        javascript: "function climbStairs(n) {\n  // Write your code here\n  \n}",
        python: "def climbStairs(n):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "dp_2",
      title: "Coin Change",
      difficulty: "Medium",
      description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.",
      examples: [
        { input: "coins = [1,2,5], amount = 11", output: "3 (5 + 5 + 1)" }
      ],
      constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
      starterCode: {
        javascript: "function coinChange(coins, amount) {\n  // Write your code here\n  \n}",
        python: "def coinChange(coins, amount):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "dp_3",
      title: "Longest Common Subsequence",
      difficulty: "Hard",
      description: "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
      examples: [
        { input: "text1 = \"abcde\", text2 = \"ace\"", output: "3 (\"ace\")" }
      ],
      constraints: ["1 <= text1.length, text2.length <= 1000", "text1 and text2 consist of lowercase English characters only."],
      starterCode: {
        javascript: "function longestCommonSubsequence(text1, text2) {\n  // Write your code here\n  \n}",
        python: "def longestCommonSubsequence(text1, text2):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "dp_4",
      title: "House Robber",
      difficulty: "Medium",
      description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected. Return the maximum amount of money you can rob tonight without alerting the police.",
      examples: [
        { input: "nums = [1,2,3,1]", output: "4 (rob house 1 and 3)" }
      ],
      constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
      starterCode: {
        javascript: "function rob(nums) {\n  // Write your code here\n  \n}",
        python: "def rob(nums):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "dp_5",
      title: "Unique Paths",
      difficulty: "Medium",
      description: "There is a robot on an `m x n` grid. The robot is initially located at the top-left corner `(0, 0)`. The robot tries to move to the bottom-right corner `(m - 1, n - 1)`. The robot can only move either down or right at any point in time. Return the number of possible unique paths.",
      examples: [
        { input: "m = 3, n = 7", output: "28" }
      ],
      constraints: ["1 <= m, n <= 100"],
      starterCode: {
        javascript: "function uniquePaths(m, n) {\n  // Write your code here\n  \n}",
        python: "def uniquePaths(m, n):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Recursion": [
    {
      id: "rec_1",
      title: "Fibonacci Number",
      difficulty: "Easy",
      description: "The Fibonacci numbers, commonly denoted `F(n)` form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given `n`, calculate `F(n)` recursively.",
      examples: [
        { input: "n = 2", output: "1" },
        { input: "n = 4", output: "3" }
      ],
      constraints: ["0 <= n <= 30"],
      starterCode: {
        javascript: "function fib(n) {\n  // Write your code here recursively\n  \n}",
        python: "def fib(n):\n    # Write your code here recursively\n    pass"
      }
    },
    {
      id: "rec_2",
      title: "Power of Two",
      difficulty: "Easy",
      description: "Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`. An integer `n` is a power of two if there exists an integer `x` such that `n == 2^x`.",
      examples: [
        { input: "n = 16", output: "true" },
        { input: "n = 3", output: "false" }
      ],
      constraints: ["-2^31 <= n <= 2^31 - 1"],
      starterCode: {
        javascript: "function isPowerOfTwo(n) {\n  // Write your code here recursively\n  \n}",
        python: "def isPowerOfTwo(n):\n    # Write your code here recursively\n    pass"
      }
    },
    {
      id: "rec_3",
      title: "Permutations",
      difficulty: "Medium",
      description: "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
      examples: [
        { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }
      ],
      constraints: ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All the integers of nums are unique."],
      starterCode: {
        javascript: "function permute(nums) {\n  // Write your code here recursively\n  \n}",
        python: "def permute(nums):\n    # Write your code here recursively\n    pass"
      }
    },
    {
      id: "rec_4",
      title: "Subsets",
      difficulty: "Medium",
      description: "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
      examples: [
        { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }
      ],
      constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10", "All elements are unique."],
      starterCode: {
        javascript: "function subsets(nums) {\n  // Write your code here recursively\n  \n}",
        python: "def subsets(nums):\n    # Write your code here recursively\n    pass"
      }
    },
    {
      id: "rec_5",
      title: "Generate Parentheses",
      difficulty: "Medium",
      description: "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
      examples: [
        { input: "n = 3", output: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]" }
      ],
      constraints: ["1 <= n <= 8"],
      starterCode: {
        javascript: "function generateParenthesis(n) {\n  // Write your code here recursively\n  \n}",
        python: "def generateParenthesis(n):\n    # Write your code here recursively\n    pass"
      }
    }
  ],
  "Sorting": [
    {
      id: "sort_1",
      title: "Merge Sorted Array",
      difficulty: "Easy",
      description: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively. Merge `nums2` into `nums1` as one sorted array.",
      examples: [
        { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" }
      ],
      constraints: ["nums1.length == m + n", "nums2.length == n", "0 <= m, n <= 200"],
      starterCode: {
        javascript: "function merge(nums1, m, nums2, n) {\n  // Write your code here\n  \n}",
        python: "def merge(nums1, m, nums2, n):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "sort_2",
      title: "Kth Largest Element in an Array",
      difficulty: "Medium",
      description: "Given an integer array `nums` and an integer `k`, return the `k`-th largest element in the array. Note that it is the `k`-th largest element in the sorted order, not the `k`-th distinct element.",
      examples: [
        { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }
      ],
      constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      starterCode: {
        javascript: "function findKthLargest(nums, k) {\n  // Write your code here\n  \n}",
        python: "def findKthLargest(nums, k):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "sort_3",
      title: "Sort Colors",
      difficulty: "Medium",
      description: "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue (represented as 0, 1, and 2 respectively).",
      examples: [
        { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" }
      ],
      constraints: ["n == nums.length", "1 <= n <= 300", "nums[i] is either 0, 1, or 2."],
      starterCode: {
        javascript: "function sortColors(nums) {\n  // Write your code here in-place\n  \n}",
        python: "def sortColors(nums):\n    # Write your code here in-place\n    pass"
      }
    },
    {
      id: "sort_4",
      title: "Merge Intervals",
      difficulty: "Medium",
      description: "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      examples: [
        { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }
      ],
      constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2"],
      starterCode: {
        javascript: "function mergeIntervals(intervals) {\n  // Write your code here\n  \n}",
        python: "def mergeIntervals(intervals):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "sort_5",
      title: "Majority Element",
      difficulty: "Easy",
      description: "Given an array `nums` of size `n`, return the majority element. The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.",
      examples: [
        { input: "nums = [3,2,3]", output: "3" }
      ],
      constraints: ["n == nums.length", "1 <= n <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9"],
      starterCode: {
        javascript: "function majorityElement(nums) {\n  // Write your code here\n  \n}",
        python: "def majorityElement(nums):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Searching": [
    {
      id: "srch_1",
      title: "Binary Search",
      difficulty: "Easy",
      description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.",
      examples: [
        { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }
      ],
      constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All the integers in nums are unique.", "nums is sorted in ascending order."],
      starterCode: {
        javascript: "function search(nums, target) {\n  // Write your code here\n  \n}",
        python: "def search(nums, target):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "srch_2",
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      description: "There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index. Given the array `nums` after the rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.",
      examples: [
        { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }
      ],
      constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i], target <= 10^4", "All values of nums are unique.", "nums is an ascending array rotated."],
      starterCode: {
        javascript: "function searchRotated(nums, target) {\n  // Write your code here\n  \n}",
        python: "def searchRotated(nums, target):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "srch_3",
      title: "Find First and Last Position of Element in Sorted Array",
      difficulty: "Medium",
      description: "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. If `target` is not found in the array, return `[-1, -1]`. You must write an algorithm with `O(log n)` runtime complexity.",
      examples: [
        { input: "nums = [5,7,7,8,8,10], target = 8", output: "[3,4]" }
      ],
      constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i], target <= 10^9", "nums is a non-decreasing array."],
      starterCode: {
        javascript: "function searchRange(nums, target) {\n  // Write your code here\n  \n}",
        python: "def searchRange(nums, target):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "srch_4",
      title: "Search a 2D Matrix",
      difficulty: "Medium",
      description: "You are given an `m x n` integer matrix `matrix` with the following two properties:\n1. Each row is sorted in non-decreasing order.\n2. The first integer of each row is greater than the last integer of the previous row.\nGiven an integer `target`, return `true` if `target` is in the matrix or `false` otherwise.",
      examples: [
        { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true" }
      ],
      constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 100", "-10^4 <= matrix[i][j], target <= 10^4"],
      starterCode: {
        javascript: "function searchMatrix(matrix, target) {\n  // Write your code here\n  \n}",
        python: "def searchMatrix(matrix, target):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "srch_5",
      title: "First Bad Version",
      difficulty: "Easy",
      description: "You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad. Find the first bad version using a binary partition.",
      examples: [
        { input: "n = 5, bad = 4", output: "4" }
      ],
      constraints: ["1 <= bad <= n <= 2^31 - 1"],
      starterCode: {
        javascript: "function solution(isBadVersion) {\n  return function(n) {\n    // Write your search logic here\n  };\n}",
        python: "def firstBadVersion(n, isBadVersion):\n    # Write your search logic here\n    pass"
      }
    }
  ],
  "HashMap": [
    {
      id: "hm_1",
      title: "First Unique Character in a String",
      difficulty: "Easy",
      description: "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.",
      examples: [
        { input: "s = \"leetcode\"", output: "0 (character 'l')" },
        { input: "s = \"loveleetcode\"", output: "2 (character 'v')" }
      ],
      constraints: ["1 <= s.length <= 10^5", "s consists of lowercase English letters only."],
      starterCode: {
        javascript: "function firstUniqChar(s) {\n  // Write your code here\n  \n}",
        python: "def firstUniqChar(s):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "hm_2",
      title: "Subarray Sum Equals K",
      difficulty: "Medium",
      description: "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
      examples: [
        { input: "nums = [1,1,1], k = 2", output: "2" }
      ],
      constraints: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"],
      starterCode: {
        javascript: "function subarraySum(nums, k) {\n  // Write your code here\n  \n}",
        python: "def subarraySum(nums, k):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "hm_3",
      title: "Contains Duplicate",
      difficulty: "Easy",
      description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
      examples: [
        { input: "nums = [1,2,3,1]", output: "true" }
      ],
      constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
      starterCode: {
        javascript: "function containsDuplicate(nums) {\n  // Write your code here\n  \n}",
        python: "def containsDuplicate(nums):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "hm_4",
      title: "Intersection of Two Arrays",
      difficulty: "Easy",
      description: "Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.",
      examples: [
        { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]" }
      ],
      constraints: ["1 <= nums1.length, nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 1000"],
      starterCode: {
        javascript: "function intersection(nums1, nums2) {\n  // Write your code here\n  \n}",
        python: "def intersection(nums1, nums2):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "hm_5",
      title: "Top K Frequent Elements",
      difficulty: "Medium",
      description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
      examples: [
        { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" }
      ],
      constraints: ["1 <= nums.length <= 10^5", "k is in the range [1, the number of unique elements in the array]."],
      starterCode: {
        javascript: "function topKFrequent(nums, k) {\n  // Write your code here\n  \n}",
        python: "def topKFrequent(nums, k):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Sliding Window": [
    {
      id: "sw_1",
      title: "Minimum Size Subarray Sum",
      difficulty: "Medium",
      description: "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray of which the sum is greater than or equal to `target`. If there is no such subarray, return `0` instead.",
      examples: [
        { input: "target = 7, nums = [2,3,1,2,4,3]", output: "2 (subarray: [4,3])" }
      ],
      constraints: ["1 <= target <= 10^9", "1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"],
      starterCode: {
        javascript: "function minSubArrayLen(target, nums) {\n  // Write your code here\n  \n}",
        python: "def minSubArrayLen(target, nums):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "sw_2",
      title: "Permutation in String",
      difficulty: "Medium",
      description: "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise. In other words, return `true` if one of `s1`'s permutations is the substring of `s2`.",
      examples: [
        { input: "s1 = \"ab\", s2 = \"eidbaooo\"", output: "true" },
        { input: "s1 = \"ab\", s2 = \"eidboaoo\"", output: "false" }
      ],
      constraints: ["1 <= s1.length, s2.length <= 10^4", "s1 and s2 consist of lowercase English letters."],
      starterCode: {
        javascript: "function checkInclusion(s1, s2) {\n  // Write your code here\n  \n}",
        python: "def checkInclusion(s1, s2):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "sw_3",
      title: "Maximum Average Subarray I",
      difficulty: "Easy",
      description: "You are given an integer array `nums` consisting of `n` elements, and an integer `k`. Find a contiguous subarray whose length is equal to `k` that has the maximum average value and return this value.",
      examples: [
        { input: "nums = [1,12,-5,-6,50,3], k = 4", output: "12.75" }
      ],
      constraints: ["n == nums.length", "1 <= k <= n <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      starterCode: {
        javascript: "function findMaxAverage(nums, k) {\n  // Write your code here\n  \n}",
        python: "def findMaxAverage(nums, k):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "sw_4",
      title: "Longest Repeating Character Replacement",
      difficulty: "Medium",
      description: "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times. Return the length of the longest substring containing the same letter you can get after performing the above operations.",
      examples: [
        { input: "s = \"ABAB\", k = 2", output: "4 (replace B with A to get \"AAAA\")" }
      ],
      constraints: ["1 <= s.length <= 10^5", "0 <= k <= s.length", "s consists of only uppercase English letters."],
      starterCode: {
        javascript: "function characterReplacement(s, k) {\n  // Write your code here\n  \n}",
        python: "def characterReplacement(s, k):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "sw_5",
      title: "Sliding Window Maximum",
      difficulty: "Hard",
      description: "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window values array.",
      examples: [
        { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" }
      ],
      constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "1 <= k <= nums.length"],
      starterCode: {
        javascript: "function maxSlidingWindow(nums, k) {\n  // Write your code here\n  \n}",
        python: "def maxSlidingWindow(nums, k):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Greedy": [
    {
      id: "grd_1",
      title: "Jump Game",
      difficulty: "Medium",
      description: "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.",
      examples: [
        { input: "nums = [2,3,1,1,4]", output: "true" },
        { input: "nums = [3,2,1,0,4]", output: "false" }
      ],
      constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
      starterCode: {
        javascript: "function canJump(nums) {\n  // Write your code here\n  \n}",
        python: "def canJump(nums):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "grd_2",
      title: "Gas Station",
      difficulty: "Medium",
      description: "There are `n` gas stations along a circular route, where the amount of gas at the `i`-th station is `gas[i]`. You have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `i`-th station to its next `(i + 1)`-th station. Return the starting gas station's index if you can travel around the circuit once, otherwise return `-1`.",
      examples: [
        { input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", output: "3" }
      ],
      constraints: ["n == gas.length == cost.length", "1 <= n <= 10^5", "0 <= gas[i], cost[i] <= 10^4"],
      starterCode: {
        javascript: "function canCompleteCircuit(gas, cost) {\n  // Write your code here\n  \n}",
        python: "def canCompleteCircuit(gas, cost):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "grd_3",
      title: "Assign Cookies",
      difficulty: "Easy",
      description: "Assume you are a awesome parent and want to give your children some cookies. But, you should give each child at most one cookie. Each child `i` has a greed factor `g[i]`. Each cookie `j` has a size `s[j]`. If `s[j] >= g[i]`, we can assign the cookie `j` to the child `i`. Your goal is to maximize the number of your content children.",
      examples: [
        { input: "g = [1,2,3], s = [1,1]", output: "1" }
      ],
      constraints: ["1 <= g.length, s.length <= 3 * 10^4", "1 <= g[i], s[j] <= 2^31 - 1"],
      starterCode: {
        javascript: "function findContentChildren(g, s) {\n  // Write your code here\n  \n}",
        python: "def findContentChildren(g, s):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "grd_4",
      title: "Partition Labels",
      difficulty: "Medium",
      description: "You are given a string `s`. We want to partition the string into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of these parts.",
      examples: [
        { input: "s = \"ababcbacadefegdehijhklij\"", output: "[9,7,8]" }
      ],
      constraints: ["1 <= s.length <= 500", "s consists of lowercase English letters."],
      starterCode: {
        javascript: "function partitionLabels(s) {\n  // Write your code here\n  \n}",
        python: "def partitionLabels(s):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "grd_5",
      title: "Lemonade Change",
      difficulty: "Easy",
      description: "At a lemonade stand, each lemonade costs `$5`. Customers are standing in a queue to buy from you and order one at a time. Each customer will only buy one lemonade and pay with either a `$5`, `$10`, or `$20` bill. Return `true` if you can provide every customer with correct change, or `false` otherwise.",
      examples: [
        { input: "bills = [5,5,5,10,20]", output: "true" }
      ],
      constraints: ["1 <= bills.length <= 10^5", "bills[i] is either 5, 10, or 20."],
      starterCode: {
        javascript: "function lemonadeChange(bills) {\n  // Write your code here\n  \n}",
        python: "def lemonadeChange(bills):\n    # Write your code here\n    pass"
      }
    }
  ],
  "Bit Manipulation": [
    {
      id: "bm_1",
      title: "Single Number",
      difficulty: "Easy",
      description: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
      examples: [
        { input: "nums = [2,2,1]", output: "1" },
        { input: "nums = [4,1,2,1,2]", output: "4" }
      ],
      constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4", "Each element in the array appears twice except for one element."],
      starterCode: {
        javascript: "function singleNumber(nums) {\n  // Write your code here using XOR\n  \n}",
        python: "def singleNumber(nums):\n    # Write your code here using XOR\n    pass"
      }
    },
    {
      id: "bm_2",
      title: "Number of 1 Bits",
      difficulty: "Easy",
      description: "Write a function that takes the binary representation of a positive integer and returns the number of set bits (also known as the Hamming weight).",
      examples: [
        { input: "n = 11 (binary: 00000000000000000000000000001011)", output: "3" }
      ],
      constraints: ["n must be a positive integer."],
      starterCode: {
        javascript: "function hammingWeight(n) {\n  // Write your code here\n  \n}",
        python: "def hammingWeight(n):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "bm_3",
      title: "Counting Bits",
      difficulty: "Easy",
      description: "Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (`0 <= i <= n`), `ans[i]` is the number of `1`'s in the binary representation of `i`.",
      examples: [
        { input: "n = 2", output: "[0,1,1]" },
        { input: "n = 5", output: "[0,1,1,2,1,2]" }
      ],
      constraints: ["0 <= n <= 10^5"],
      starterCode: {
        javascript: "function countBits(n) {\n  // Write your code here\n  \n}",
        python: "def countBits(n):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "bm_4",
      title: "Reverse Bits",
      difficulty: "Easy",
      description: "Reverse bits of a given 32 bits unsigned integer recursively or iteratively and return the resulting number.",
      examples: [
        { input: "n = 43261596 (binary: 00000010100101000001111010011100)", output: "964176192" }
      ],
      constraints: ["The input must be a binary 32-bit unsigned integer."],
      starterCode: {
        javascript: "function reverseBits(n) {\n  // Write your code here\n  \n}",
        python: "def reverseBits(n):\n    # Write your code here\n    pass"
      }
    },
    {
      id: "bm_5",
      title: "Missing Number",
      difficulty: "Easy",
      description: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
      examples: [
        { input: "nums = [3,0,1]", output: "2" }
      ],
      constraints: ["n == nums.length", "1 <= n <= 10^4", "0 <= nums[i] <= n", "All the numbers of nums are unique."],
      starterCode: {
        javascript: "function missingNumber(nums) {\n  // Write your code here\n  \n}",
        python: "def missingNumber(nums):\n    # Write your code here\n    pass"
      }
    }
  ],
  "OOPs": [
    {
      id: "oop_1",
      title: "Design Parking System",
      difficulty: "Easy",
      description: "Design a parking system for a parking lot. The parking lot has three kinds of parking spaces: big, medium, and small, with a fixed number of slots for each size. Implement the `ParkingSystem` class.",
      examples: [
        { input: "[\"ParkingSystem\", \"addCar\", \"addCar\", \"addCar\"]", output: "[null, true, true, false]" }
      ],
      constraints: ["0 <= big, medium, small <= 1000", "carType is 1, 2, or 3", "At most 1000 calls will be made to addCar."],
      starterCode: {
        javascript: "class ParkingSystem {\n  constructor(big, medium, small) {}\n  addCar(carType) {}\n}",
        python: "class ParkingSystem:\n    def __init__(self, big: int, medium: int, small: int):\n        pass\n    def addCar(self, carType: int) -> bool:\n        pass"
      }
    },
    {
      id: "oop_2",
      title: "Design Browser History",
      difficulty: "Medium",
      description: "You have a browser of one tab where you start on the `homepage` and you can visit another `url`, get back in the history number of `steps` or move forward in the history number of `steps`.",
      examples: [
        { input: "[\"BrowserHistory\",\"visit\",\"visit\",\"back\",\"forward\"]", output: "[null,null,null,\"google.com\",\"facebook.com\"]" }
      ],
      constraints: ["1 <= homepage.length <= 20", "1 <= steps <= 100", "At most 5000 calls will be made to visit, back, and forward."],
      starterCode: {
        javascript: "class BrowserHistory {\n  constructor(homepage) {}\n  visit(url) {}\n  back(steps) {}\n  forward(steps) {}\n}",
        python: "class BrowserHistory:\n    def __init__(self, homepage: str):\n        pass\n    def visit(self, url: str) -> None:\n        pass\n    def back(self, steps: int) -> str:\n        pass\n    def forward(self, steps: int) -> str:\n        pass"
      }
    },
    {
      id: "oop_3",
      title: "Design Food Rating System",
      difficulty: "Hard",
      description: "Design a food rating system that can record ratings of different foods, modify ratings, and return the highest-rated food of a specific cuisine. Implement the `FoodRatings` class.",
      examples: [
        { input: "[\"FoodRatings\", \"highestRated\", \"changeRating\"]", output: "[null, \"kimchi\", null]" }
      ],
      constraints: ["Foods, cuisines, ratings lengths match", "At most 2 * 10^4 calls will be made to changeRating/highestRated."],
      starterCode: {
        javascript: "class FoodRatings {\n  constructor(foods, cuisines, ratings) {}\n  changeRating(food, newRating) {}\n  highestRated(cuisine) {}\n}",
        python: "class FoodRatings:\n    def __init__(self, foods: List[str], cuisines: List[str], ratings: List[int]):\n        pass\n    def changeRating(self, food: str, newRating: int) -> None:\n        pass\n    def highestRated(self, cuisine: str) -> str:\n        pass"
      }
    },
    {
      id: "oop_4",
      title: "Design Underground System",
      difficulty: "Medium",
      description: "An underground railway system is keeping track of customer travel times between different stations. They are using this data to calculate the average time it takes to travel between stations. Implement the `UndergroundSystem` class.",
      examples: [
        { input: "[\"UndergroundSystem\",\"checkIn\",\"checkOut\",\"getAverageTime\"]", output: "[null,null,null,12.0]" }
      ],
      constraints: ["At most 2 * 10^4 calls will be made to checkIn/checkOut/getAverageTime."],
      starterCode: {
        javascript: "class UndergroundSystem {\n  constructor() {}\n  checkIn(id, stationName, t) {}\n  checkOut(id, stationName, t) {}\n  getAverageTime(startStation, endStation) {}\n}",
        python: "class UndergroundSystem:\n    def __init__(self):\n        pass\n    def checkIn(self, id: int, stationName: str, t: int) -> None:\n        pass\n    def checkOut(self, id: int, stationName: str, t: int) -> None:\n        pass\n    def getAverageTime(self, startStation: str, endStation: str) -> float:\n        pass"
      }
    },
    {
      id: "oop_5",
      title: "Design Hit Counter",
      difficulty: "Medium",
      description: "Design a hit counter which counts the number of hits received in the past 5 minutes (i.e., past 300 seconds). Implement the `HitCounter` class.",
      examples: [
        { input: "[\"HitCounter\", \"hit\", \"hit\", \"hit\", \"getHits\"]", output: "[null, null, null, null, 3]" }
      ],
      constraints: ["At most 10^4 calls will be made to methods.", "Time is strictly increasing."],
      starterCode: {
        javascript: "class HitCounter {\n  constructor() {}\n  hit(timestamp) {}\n  getHits(timestamp) {}\n}",
        python: "class HitCounter:\n    def __init__(self):\n        pass\n    def hit(self, timestamp: int) -> None:\n        pass\n    def getHits(self, timestamp: int) -> int:\n        pass"
      }
    }
  ],
  "SQL": [
    {
      id: "sql_1",
      title: "Big Countries",
      difficulty: "Easy",
      description: "Write a SQL query to report the name, population, and area of the big countries. A country is big if it has an area of at least 3 million sq km, or a population of at least 25 million.",
      examples: [
        { input: "Table: World (name, continent, area, population, gdp)", output: "SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000" }
      ],
      constraints: ["Return table in any order."],
      starterCode: {
        javascript: "-- Write your SQL query here\nSELECT ",
        python: "# Write your SQL query here\nquery = \"\"\"SELECT \"\"\""
      }
    },
    {
      id: "sql_2",
      title: "Combine Two Tables",
      difficulty: "Easy",
      description: "Write a SQL query to report the first name, last name, city, and state of each person in the `Person` table. If the address of a `personId` is not present in the `Address` table, report null instead.",
      examples: [
        { input: "Tables: Person (personId, lastName, firstName), Address (addressId, personId, city, state)", output: "SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId" }
      ],
      constraints: ["Use outer join correctly."],
      starterCode: {
        javascript: "-- Write your SQL query here\nSELECT ",
        python: "# Write your SQL query here\nquery = \"\"\"SELECT \"\"\""
      }
    },
    {
      id: "sql_3",
      title: "Employees Earning More Than Their Managers",
      difficulty: "Easy",
      description: "Write a SQL query to find the employees who earn more than their managers.",
      examples: [
        { input: "Table: Employee (id, name, salary, managerId)", output: "SELECT e.name as Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary" }
      ],
      constraints: ["Self JOIN standard matching."],
      starterCode: {
        javascript: "-- Write your SQL query here\nSELECT ",
        python: "# Write your SQL query here\nquery = \"\"\"SELECT \"\"\""
      }
    },
    {
      id: "sql_4",
      title: "Customers Who Never Order",
      difficulty: "Easy",
      description: "Write a SQL query to report all customers who never order anything. Return the name column renamed as `Customers`.",
      examples: [
        { input: "Tables: Customers (id, name), Orders (id, customerId)", output: "SELECT name as Customers FROM Customers WHERE id NOT IN (SELECT customerId FROM Orders)" }
      ],
      constraints: ["Subqueries or anti-joins allowed."],
      starterCode: {
        javascript: "-- Write your SQL query here\nSELECT ",
        python: "# Write your SQL query here\nquery = \"\"\"SELECT \"\"\""
      }
    },
    {
      id: "sql_5",
      title: "Duplicate Emails",
      difficulty: "Easy",
      description: "Write a SQL query to report all duplicate emails in a table `Person`.",
      examples: [
        { input: "Table: Person (id, email)", output: "SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1" }
      ],
      constraints: ["Aggregating email grouping."],
      starterCode: {
        javascript: "-- Write your SQL query here\nSELECT ",
        python: "# Write your SQL query here\nquery = \"\"\"SELECT \"\"\""
      }
    }
  ]
};

// Topic Meta Info (Icons, Color Themes, Descriptions)
const TOPICS_META = [
  { name: "Arrays", icon: <Layers size={18} />, color: "from-blue-500 to-indigo-500", shadow: "shadow-blue-500/10", desc: "Contiguous memory blocks, pointers & sorting properties" },
  { name: "Strings", icon: <Type size={18} />, color: "from-indigo-500 to-purple-500", shadow: "shadow-indigo-500/10", desc: "ASCII operations, substring matches & character parsing" },
  { name: "Linked List", icon: <Link2 size={18} />, color: "from-purple-500 to-fuchsia-500", shadow: "shadow-purple-500/10", desc: "Sequential structures, nodes, pointers, and cycles" },
  { name: "Stack", icon: <Cpu size={18} />, color: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/10", desc: "LIFO parsing, parenthetical operations & evaluations" },
  { name: "Queue", icon: <ListCollapse size={18} />, color: "from-rose-500 to-orange-500", shadow: "shadow-rose-500/10", desc: "FIFO buffers, scheduling, circular and double-ended queues" },
  { name: "Trees", icon: <GitBranch size={18} />, color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/10", desc: "Hierarchical traversal, BSTs, heaps & balancing trees" },
  { name: "Graphs", icon: <Network size={18} />, color: "from-teal-500 to-cyan-500", shadow: "shadow-teal-500/10", desc: "BFS/DFS search, islands, topological sorting & paths" },
  { name: "Dynamic Programming", icon: <Workflow size={18} />, color: "from-cyan-500 to-sky-500", shadow: "shadow-cyan-500/10", desc: "Subproblem memoization, bottom-up tabulations & limits" },
  { name: "Recursion", icon: <Repeat size={18} />, color: "from-sky-500 to-blue-500", shadow: "shadow-sky-500/10", desc: "Self-referencing states, backtrack trees & call stacks" },
  { name: "Sorting", icon: <ArrowUpDown size={18} />, color: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/10", desc: "NlogN distributions, partition pivots & quick allocations" },
  { name: "Searching", icon: <Search size={18} />, color: "from-fuchsia-500 to-pink-500", shadow: "shadow-fuchsia-500/10", desc: "O(logN) binary search partitions & rotational searches" },
  { name: "HashMap", icon: <Database size={18} />, color: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/10", desc: "O(1) lookups, duplicates, unique keys & frequencies" },
  { name: "Sliding Window", icon: <Grid size={18} />, color: "from-emerald-500 to-green-500", shadow: "shadow-emerald-500/10", desc: "Sequential contiguous ranges, sliding windows & bounds" },
  { name: "Greedy", icon: <Scale size={18} />, color: "from-yellow-500 to-amber-500", shadow: "shadow-yellow-500/10", desc: "Local optimal choice parsing, gas limits & jump bounds" },
  { name: "Bit Manipulation", icon: <Binary size={18} />, color: "from-cyan-500 to-blue-600", shadow: "shadow-cyan-500/10", desc: "Low-level XOR, set bit calculations & masks" },
  { name: "OOPs", icon: <Package size={18} />, color: "from-indigo-600 to-violet-600", shadow: "shadow-indigo-500/10", desc: "Design interfaces, modular objects & architectures" },
  { name: "SQL", icon: <Terminal size={18} />, color: "from-pink-600 to-rose-600", shadow: "shadow-pink-600/10", desc: "Relational queries, self-joins, aggregates & grouping" }
];

const CodingPractice = () => {
  // Stats & Progress States
  const [solvedList, setSolvedList] = useState(() => JSON.parse(localStorage.getItem('solved_practice_questions') || '[]'));
  const [unsolvedRepeatedList, setUnsolvedRepeatedList] = useState(() => JSON.parse(localStorage.getItem('unsolved_repeated_questions') || '[]'));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('practice_streak') || '0'));
  
  // Navigation & Active States
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  
  // Code Editor Workspace States
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('> Ready. Submit code to evaluated via the AI Evaluator.');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Difficulty mapping colors
  const diffColors = {
    Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    Hard: 'text-red-400 bg-red-500/10 border-red-500/20'
  };

  // Sync Streak and Solved questions to localStorage
  useEffect(() => {
    localStorage.setItem('solved_practice_questions', JSON.stringify(solvedList));
    localStorage.setItem('unsolved_repeated_questions', JSON.stringify(unsolvedRepeatedList));
    
    const lastPractice = localStorage.getItem('last_practice_date');
    const today = new Date().toDateString();
    if (lastPractice !== today && solvedList.length > 0) {
      const nextStreak = lastPractice ? streak + 1 : 1;
      setStreak(nextStreak);
      localStorage.setItem('practice_streak', String(nextStreak));
      localStorage.setItem('last_practice_date', today);
    }
  }, [solvedList, unsolvedRepeatedList]);

  // Handle starter code selection when question/language shifts
  useEffect(() => {
    if (activeQuestion) {
      let newCode = activeQuestion.starterCode?.[language];
      if (!newCode) {
        if (language === 'cpp') {
          newCode = `// ${activeQuestion.title}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    \n    return 0;\n}`;
        } else if (language === 'java') {
          newCode = `// ${activeQuestion.title}\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n        \n    }\n}`;
        } else if (language === 'python') {
          newCode = `# ${activeQuestion.title}\ndef solution():\n    # Write your Python solution here\n    pass`;
        } else {
          newCode = `// ${activeQuestion.title}\nfunction solution() {\n  // Write your JavaScript solution here\n\n}`;
        }
      }
      setCode(newCode);
      setConsoleOutput('> Ready. Submit code to evaluated via the AI Evaluator.');
      setEvaluation(null);
      setIsExpanded(false);
    }
  }, [activeQuestion, language]);

  // Topic Completion and Statistics Calculations
  const getTopicProgress = (topicName) => {
    const questions = PRACTICE_QUESTIONS[topicName] || [];
    if (questions.length === 0) return { solvedCount: 0, totalCount: 0, percent: 0 };
    const solvedForTopic = questions.filter(q => solvedList.includes(q.id)).length;
    return {
      solvedCount: solvedForTopic,
      totalCount: questions.length,
      percent: Math.round((solvedForTopic / questions.length) * 100)
    };
  };

  const globalStats = (() => {
    let totalSolved = solvedList.length;
    let totalQuestions = Object.values(PRACTICE_QUESTIONS).flat().length;
    
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    Object.values(PRACTICE_QUESTIONS).flat().forEach(q => {
      if (solvedList.includes(q.id)) {
        if (q.difficulty === 'Easy') easySolved++;
        else if (q.difficulty === 'Medium') mediumSolved++;
        else if (q.difficulty === 'Hard') hardSolved++;
      }
    });

    return {
      totalSolved,
      totalQuestions,
      percent: Math.round((totalSolved / totalQuestions) * 100) || 0,
      easy: easySolved,
      medium: mediumSolved,
      hard: hardSolved
    };
  })();

  // Select Topic View - Show Questions List inside topic first
  const handleSelectTopic = (topicName) => {
    setSelectedTopic(topicName);
    setActiveQuestion(null);
  };

  // Dynamic Randomized Solved Isolation Logic for "Pick Random Unsolved" Button
  const handlePickRandomUnsolved = () => {
    const pool = PRACTICE_QUESTIONS[selectedTopic] || [];
    
    // 1. Separate unsolved questions
    const unsolvedInPool = pool.filter(q => !solvedList.includes(q.id));
    
    // 2. IMPORTANT LOGIC CHECK: Prioritize failed unsolved questions
    const failedQuestionsInTopic = pool.filter(q => unsolvedRepeatedList.includes(q.id) && !solvedList.includes(q.id));
    
    let selectedQ = null;
    
    if (failedQuestionsInTopic.length > 0) {
      selectedQ = failedQuestionsInTopic[Math.floor(Math.random() * failedQuestionsInTopic.length)];
      toast.info(`Retrying your active review challenge: "${selectedQ.title}"!`);
    } else if (unsolvedInPool.length > 0) {
      selectedQ = unsolvedInPool[Math.floor(Math.random() * unsolvedInPool.length)];
    } else if (pool.length > 0) {
      selectedQ = pool[Math.floor(Math.random() * pool.length)];
      toast.success("💡 Replaying solved challenge.");
    }
    
    if (selectedQ) {
      setActiveQuestion(selectedQ);
    }
  };

  // Run Local Test Mock Output
  const handleRunLocalCode = async () => {
    if (language !== 'javascript') {
      setConsoleOutput(`> Compiling and running ${language} code...`);
      try {
        const res = await axios.post('/api/interview/run-code', { code, language });
        setConsoleOutput(`> Output:\n${res.data.output}`);
      } catch (err) {
        setConsoleOutput(`> Execution failed. Ensure backend is running.`);
      }
      return;
    }
    setConsoleOutput("> Running test cases...\n\nCompiling template parameters...\n✔ Code execution completed locally.\nWarning: Submitting to AI evaluation is required to record completed status and obtain a score!");
  };

  // Evaluate Practice Code with AI
  const handleSubmitCode = async () => {
    setSubmitting(true);
    setConsoleOutput("> Sending code submission to AI Evaluator...\n> Analyzing algorithm correctness and complexity...");
    
    try {
      const response = await axios.post('/api/interview/evaluate-code', {
        title: activeQuestion.title,
        description: activeQuestion.description,
        code: code,
        language: language
      });
      
      const evalData = response.data;
      setEvaluation(evalData);
      
      if (evalData.correctness >= 7 || evalData.overall_score >= 7) {
        let outputStr = `> SUCCESS! Overall Score: ${evalData.overall_score}/10\n> Correctness: ${evalData.correctness}/10\n✔ Algorithm solved successfully! Practice progress saved.\n\n> AI Analysis:\n${evalData.feedback}`;
        if (evalData.suggestions && evalData.suggestions.length > 0) {
          outputStr += `\n\n> Suggestions:\n` + evalData.suggestions.map(s => `  - ${s}`).join('\n');
        }
        setConsoleOutput(outputStr);
        
        if (!solvedList.includes(activeQuestion.id)) {
          setSolvedList(prev => [...prev, activeQuestion.id]);
        }
        setUnsolvedRepeatedList(prev => prev.filter(id => id !== activeQuestion.id));
        toast.success(`🎉 Excellent! You solved "${activeQuestion.title}" successfully!`);
      } else {
        let outputStr = `> FAILED. Overall Score: ${evalData.overall_score}/10\n> Correctness: ${evalData.correctness}/10\n❌ Solution did not meet target correctness criteria (>=7.0). This challenge has been marked for repetition.\n\n> Why it failed (AI Analysis):\n${evalData.feedback}`;
        if (evalData.suggestions && evalData.suggestions.length > 0) {
          outputStr += `\n\n> Suggestions:\n` + evalData.suggestions.map(s => `  - ${s}`).join('\n');
        }
        setConsoleOutput(outputStr);
        
        if (!unsolvedRepeatedList.includes(activeQuestion.id) && !solvedList.includes(activeQuestion.id)) {
          setUnsolvedRepeatedList(prev => [...prev, activeQuestion.id]);
        }
        toast.warning(`⚠️ Challenge not solved. This exact question will repeat until solved!`);
      }
    } catch (error) {
      console.error(error);
      setConsoleOutput(`> Evaluation Error: ${error.message}\nUnable to contact the AI evaluator. Please verify your server connection and try again.`);
      toast.error("Failed to run code evaluation. Try again shortly.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTopicMeta = TOPICS_META.find(t => t.name === selectedTopic);
  const selectedTopicQuestions = PRACTICE_QUESTIONS[selectedTopic] || [];
  const topicProgress = selectedTopic ? getTopicProgress(selectedTopic) : null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#030712] text-slate-100 relative">
      <div className="digital-grid" />
      <div className="aurora" />

      {/* Main Container Layout */}
      <AnimatePresence mode="wait">
        {!selectedTopic ? (
          // VIEW 1: OVERALL TOPICS DASHBOARD GRID
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar"
          >
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-3">
                    <Sparkles className="text-indigo-400 animate-pulse" />
                    <span className="vibrant-text">Practice Arena</span>
                  </h1>
                  <p className="text-zinc-500 text-sm mt-2">Master data structures & algorithms through automated AI review sandbox sessions.</p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-3xl backdrop-blur-md">
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 font-bold text-xs">
                    <Flame size={14} className="animate-pulse" />
                    <span>{streak} Days Streak</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Practice Level</div>
                    <div className="text-sm font-black text-white">{globalStats.totalSolved} / {globalStats.totalQuestions} Solved</div>
                  </div>
                </div>
              </div>

              {/* Global Progress Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 neon-glass p-8 rounded-[36px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black tracking-wider uppercase text-zinc-500 mb-2">Overall Completion</h3>
                    <div className="text-3xl font-black text-white">{globalStats.percent}%</div>
                  </div>
                  <div className="mt-6">
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500" style={{ width: `${globalStats.percent}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-2">
                      <span>0% Complete</span>
                      <span>100% Mastered</span>
                    </div>
                  </div>
                </div>

                {[
                  { label: "Easy Challenges", count: globalStats.easy, total: 47, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                  { label: "Medium Challenges", count: globalStats.medium, total: 31, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
                  { label: "Hard Challenges", count: globalStats.hard, total: 7, color: "text-red-400 bg-red-500/10 border-red-500/20" }
                ].map((dif, idx) => (
                  <div key={idx} className="neon-glass p-8 rounded-[36px] flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-black tracking-wider uppercase text-zinc-500 mb-2">{dif.label}</h3>
                      <div className="text-3xl font-black text-white">{dif.count} <span className="text-xs text-zinc-500">/ {dif.total}</span></div>
                    </div>
                    <div className={`mt-4 px-3 py-1.5 rounded-2xl border text-center text-xs font-black uppercase tracking-wider ${dif.color}`}>
                      Progress: {dif.total > 0 ? Math.round((dif.count / dif.total) * 100) : 0}%
                    </div>
                  </div>
                ))}
              </div>

              {/* Topics Grid Selector */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-300">
                    <Trophy size={18} className="text-indigo-400" /> Focus Learning Tracks
                  </h2>
                  <span className="text-[10px] font-black text-zinc-500 tracking-wider uppercase bg-white/5 px-2.5 py-1 rounded-xl">17 Core Topics</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TOPICS_META.map((topic, i) => {
                    const progress = getTopicProgress(topic.name);
                    const isCompleted = progress.percent === 100;
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ y: -6, scale: 1.02 }}
                        onClick={() => handleSelectTopic(topic.name)}
                        className={`cyber-card p-6 cursor-pointer flex flex-col justify-between h-48 border border-white/5 relative group ${topic.shadow}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${topic.color} text-white`}>
                            {topic.icon}
                          </div>
                          {isCompleted ? (
                            <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">Mastered</span>
                          ) : progress.solvedCount > 0 ? (
                            <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">{progress.percent}%</span>
                          ) : (
                            <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-white/5 text-zinc-500 rounded-md border border-white/10">Incomplete</span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors mt-4">{topic.name}</h3>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{topic.desc}</p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{progress.solvedCount} / {progress.totalCount} SOLVED</span>
                          <div className="w-16 bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-400 h-full" style={{ width: `${progress.percent}%` }} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : !activeQuestion ? (
          // VIEW 2: TOPIC SPECIFIC QUESTION LIST VIEW
          <motion.div
            key="question-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar"
          >
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Back & Title Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${selectedTopicMeta.color} text-white`}>
                        {selectedTopicMeta.icon}
                      </div>
                      <h1 className="text-2xl lg:text-3xl font-black text-white">{selectedTopic} Challenges</h1>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">{selectedTopicMeta.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePickRandomUnsolved}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-black rounded-2xl text-white flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    🎲 Pick Random Unsolved
                  </button>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="neon-glass p-6 rounded-3xl flex flex-col justify-between md:col-span-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black uppercase text-zinc-500">Track Mastery</span>
                    <span className="text-sm font-black text-white">{topicProgress.solvedCount} / {topicProgress.totalCount} Solved</span>
                  </div>
                  <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500" style={{ width: `${topicProgress.percent}%` }} />
                  </div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-2.5">
                    {topicProgress.percent}% Complete
                  </div>
                </div>

                <div className="neon-glass p-6 rounded-3xl flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-black uppercase text-zinc-500 mb-1">Active Fail Queue</span>
                  <div className="text-2xl font-black text-red-400">
                    {selectedTopicQuestions.filter(q => unsolvedRepeatedList.includes(q.id) && !solvedList.includes(q.id)).length} Questions
                  </div>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Marked for persistent repetition</span>
                </div>
              </div>

              {/* Question Row List */}
              <div className="space-y-4">
                <h2 className="text-lg font-black text-zinc-300 flex items-center gap-2">
                  <BookOpenCheck size={18} className="text-indigo-400" /> Challenge Curriculum
                </h2>
                
                <div className="overflow-hidden border border-white/10 rounded-3xl glass-dark">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 h-10 px-6">
                        <th className="pl-6 w-16">Status</th>
                        <th className="py-3">Challenge Title</th>
                        <th className="py-3 w-32">Difficulty</th>
                        <th className="pr-6 w-32 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm text-zinc-300 font-medium">
                      {selectedTopicQuestions.map((q) => {
                        const isSolved = solvedList.includes(q.id);
                        const isFailed = unsolvedRepeatedList.includes(q.id);

                        return (
                          <tr key={q.id} className="hover:bg-white/5 transition-all h-16 group">
                            <td className="pl-6">
                              {isSolved ? (
                                <span className="text-emerald-400" title="Solved successfully!"><CheckCircle2 size={18} /></span>
                              ) : isFailed ? (
                                <span className="text-red-400 animate-pulse" title="Marked for repetition!"><RotateCcw size={18} /></span>
                              ) : (
                                <span className="text-zinc-600"><QuestionIcon size={18} /></span>
                              )}
                            </td>
                            <td className="py-4">
                              <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">{q.title}</div>
                              <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1 font-medium">{q.description}</div>
                            </td>
                            <td>
                              <span className={`px-2.5 py-0.5 text-[9px] font-black tracking-wider rounded-md uppercase border ${diffColors[q.difficulty || 'Medium']}`}>
                                {q.difficulty || 'Medium'}
                              </span>
                            </td>
                            <td className="pr-6 text-right">
                              <button
                                onClick={() => setActiveQuestion(q)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                                  isSolved 
                                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20' 
                                    : isFailed 
                                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 animate-pulse'
                                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                                }`}
                              >
                                {isSolved ? 'Solve Again' : isFailed ? 'Retry' : 'Solve'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // VIEW 3: LEETCODE WORKSPACE SPLIT ARENA VIEW
          <motion.div 
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {/* Top workspace toolbar */}
            <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
              <button 
                onClick={() => setActiveQuestion(null)}
                className="flex items-center gap-2 text-xs font-black text-zinc-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} /> Back to Question List
              </button>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Language:</span>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="bg-white/5 border border-white/10 text-xs rounded-xl px-3 py-1.5 focus:outline-none text-zinc-300 font-bold"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python 3</option>
                </select>

                <button 
                  onClick={handleRunLocalCode}
                  className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-xl flex items-center gap-1.5 text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                >
                  <Play size={12} className="text-zinc-400" /> Run Code
                </button>

                <button 
                  onClick={handleSubmitCode}
                  disabled={submitting}
                  className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold rounded-xl text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 transition-all active:scale-95 cursor-pointer border border-white/10"
                >
                  {submitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Evaluate Solution
                </button>
              </div>
            </div>

            {/* Split Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Pane: Challenge Info */}
              <div className="w-[38%] h-full border-r border-white/10 flex flex-col glass-dark overflow-y-auto custom-scrollbar">
                <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/30">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-indigo-400" size={18} />
                    <h1 className="font-bold uppercase tracking-wider text-[10px] text-gray-500">Practice Track: {selectedTopic}</h1>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-black tracking-wider text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                    <Target size={10} className="text-indigo-400" /> Target: 7.0+
                  </div>
                </div>

                <div className="p-6 space-y-6 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold">{activeQuestion.title}</h2>
                      <span className={`px-2.5 py-0.5 text-[9px] font-black tracking-wider rounded-md uppercase border ${diffColors[activeQuestion.difficulty || 'Medium']}`}>
                        {activeQuestion.difficulty || 'Medium'}
                      </span>
                      {solvedList.includes(activeQuestion.id) && (
                        <span className="px-2 py-0.5 text-[9px] font-black tracking-wider bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 uppercase">Solved</span>
                      )}
                    </div>
                    <p className="text-gray-400 leading-relaxed text-sm">{activeQuestion.description}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-sm text-zinc-300"><CheckCircle2 size={14} className="text-indigo-400" /> Key Examples</h3>
                    {activeQuestion.examples && activeQuestion.examples.map((ex, i) => (
                      <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs space-y-1">
                        <div className="flex gap-2"><span className="text-indigo-400 font-bold">Input:</span> <span className="text-gray-300 font-mono">{ex.input}</span></div>
                        <div className="flex gap-2"><span className="text-emerald-400 font-bold">Output:</span> <span className="text-gray-300 font-mono">{ex.output}</span></div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <h3 className="font-bold flex items-center gap-2 text-sm text-zinc-300"><HelpCircle size={14} className="text-zinc-500" /> Constraints</h3>
                    <ul className="list-disc list-inside text-xs text-zinc-500 space-y-1 pl-1">
                      {activeQuestion.constraints && activeQuestion.constraints.map((c, i) => (
                        <li key={i} className="font-mono">{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Pane: Code Editor & Output */}
              <div className="flex-1 h-full flex flex-col">
                <div className="flex-1 min-h-0 relative">
                  <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={setCode}
                    options={{
                      fontSize: 15,
                      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                      minimap: { enabled: false },
                      padding: { top: 16 },
                      cursorSmoothCaretAnimation: "on",
                      smoothScrolling: true,
                      scrollbar: { verticalScrollbarSize: 8 }
                    }}
                  />
                </div>

                {/* Console Output and AI Evaluation Drawer */}
                <div className={`border-t border-white/10 glass-dark flex flex-col transition-all duration-300 ${
                  evaluation 
                    ? isExpanded ? 'h-[60vh]' : 'h-[35vh]' 
                    : 'h-40'
                }`}>
                  <div className="h-9 px-5 border-b border-white/10 flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-black/40">
                    <div className="flex items-center gap-2">
                      <Terminal size={12} /> {evaluation ? 'AI Evaluation Analysis' : 'Console Output'}
                    </div>
                    {evaluation && (
                      <button
                        type="button"
                        onClick={() => setIsExpanded(prev => !prev)}
                        className="text-[9px] font-black text-indigo-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider"
                      >
                        {isExpanded ? (
                          <>Collapse <Minimize2 size={10} /></>
                        ) : (
                          <>Expand <Maximize2 size={10} /></>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {evaluation ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { label: 'Correctness', val: evaluation.correctness, icon: <CheckCircle2 size={12} /> },
                            { label: 'Efficiency', val: evaluation.efficiency, icon: <Zap size={12} /> },
                            { label: 'Quality', val: evaluation.code_quality, icon: <Award size={12} /> },
                            { label: 'Overall', val: evaluation.overall_score, icon: <Target size={12} /> },
                          ].map((m, i) => (
                            <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                              <div className="text-lg font-black text-white">{m.val}<span className="text-xs text-zinc-600">/10</span></div>
                              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-1 mt-1">{m.icon} {m.label}</div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 font-bold">Detailed Feedback:</span>
                          <p className="text-xs text-zinc-300 leading-relaxed font-semibold">{evaluation.feedback}</p>
                        </div>

                        {/* Bulletproof Suggestions Renderer */}
                        <div className="pt-2 border-t border-white/5 space-y-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">💡 Suggested Actions to Improve:</span>
                          <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1.5 mt-1 font-medium">
                            {evaluation.suggestions ? (
                              Array.isArray(evaluation.suggestions) ? (
                                evaluation.suggestions.map((sug, idx) => (
                                  <li key={idx} className="leading-relaxed">{sug}</li>
                                ))
                              ) : typeof evaluation.suggestions === 'string' ? (
                                evaluation.suggestions.split('\n').filter(Boolean).map((sug, idx) => (
                                  <li key={idx} className="leading-relaxed">{sug.replace(/^-\s*/, '')}</li>
                                ))
                              ) : (
                                <li className="leading-relaxed">Verify complexity limits and optimize standard recursion overhead.</li>
                              )
                            ) : (
                              <>
                                <li className="leading-relaxed">Ensure all edge cases (such as null/empty arrays and maximum boundaries) are handled.</li>
                                <li className="leading-relaxed">Refactor nested loops to optimize execution time complexity to its theoretical lower bound.</li>
                              </>
                            )}
                          </ul>
                        </div>

                        <div className="flex gap-3 text-[10px] pt-1">
                          <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 font-bold">Time: {evaluation.time_complexity}</span>
                          <span className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/20 font-bold">Space: {evaluation.space_complexity}</span>
                        </div>
                      </div>
                    ) : (
                      <pre className="font-mono text-xs text-gray-500 whitespace-pre-wrap">{consoleOutput}</pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodingPractice;
