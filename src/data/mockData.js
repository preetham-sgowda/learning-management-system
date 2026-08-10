export const INITIAL_USER = {
  name: "Lohith R C",
  email: "lohith.rc@skillforge.edu",
  avatar: "LR",
  role: "Aspiring SDE-1 / CS Senior",
  targetRole: "Full Stack Engineer",
  streak: 12,
  points: 2450,
  rank: 14,
  mcqAccuracy: 88,
  codingAccuracy: 64,
  descriptiveScore: 75,
  completedProblems: 84,
  totalProblems: 150,
  joinedDate: "Jan 2026",
};

export const COURSES_DATA = [
  {
    id: "dsa-mastery",
    title: "Data Structures & Algorithms Mastery",
    category: "Core CS",
    difficulty: "Intermediate",
    progress: 72,
    modulesCount: 24,
    completedModules: 17,
    duration: "45 Hours",
    rating: 4.9,
    studentsCount: 14200,
    instructor: "Dr. Aris Thorne (Ex-Google Lead)",
    image: "https://images.unsplash.com/photo-1516116211223-4c7142b2e2ec?auto=format&fit=crop&w=600&q=80",
    tags: ["Arrays", "Trees", "Graphs", "Dynamic Programming"],
    description: "Comprehensive guide to mastering problem solving patterns for FAANG & tier-1 technical interviews.",
    status: "In Progress",
    modules: [
      { id: 1, title: "Array & Two-Pointers Technique", duration: "2h 30m", completed: true },
      { id: 2, title: "Sliding Window & Hash Maps", duration: "3h 15m", completed: true },
      { id: 3, title: "Trees & Binary Search Trees", duration: "4h 00m", completed: true },
      { id: 4, title: "Graph Traversal (BFS & DFS)", duration: "5h 20m", completed: false },
      { id: 5, title: "Dynamic Programming Foundations", duration: "6h 45m", completed: false },
    ]
  },
  {
    id: "dbms-internals",
    title: "Database Management Systems & SQL Scaling",
    category: "Database",
    difficulty: "Beginner to Intermediate",
    progress: 40,
    modulesCount: 16,
    completedModules: 6,
    duration: "28 Hours",
    rating: 4.8,
    studentsCount: 9800,
    instructor: "Prof. Elena Vance (Database Architect)",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80",
    tags: ["SQL", "Indexing", "ACID", "Transactions", "Sharding"],
    description: "Deep dive into relational engine internals, query optimization, indexing strategies, and distributed storage.",
    status: "In Progress",
    modules: [
      { id: 1, title: "Relational Data Modeling & ER Diagrams", duration: "2h 10m", completed: true },
      { id: 2, title: "Advanced SQL Queries & Window Functions", duration: "3h 30m", completed: true },
      { id: 3, title: "B-Tree Indexing & Query Execution Plans", duration: "4h 15m", completed: false },
      { id: 4, title: "ACID Properties & Concurrency Control", duration: "3h 45m", completed: false },
    ]
  },
  {
    id: "system-design",
    title: "System Design for High Scale Applications",
    category: "Architecture",
    difficulty: "Advanced",
    progress: 15,
    modulesCount: 20,
    completedModules: 3,
    duration: "36 Hours",
    rating: 4.95,
    studentsCount: 18500,
    instructor: "Marcus Brody (Principal Systems Architect)",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    tags: ["Load Balancing", "Microservices", "Kafka", "Caching"],
    description: "Learn how to architect distributed systems handling millions of requests per second.",
    status: "In Progress",
    modules: [
      { id: 1, title: "Scalability Fundamentals & CAP Theorem", duration: "2h 45m", completed: true },
      { id: 2, title: "Load Balancing & Rate Limiting Algorithms", duration: "3h 50m", completed: false },
      { id: 3, title: "Distributed Caching with Redis & Memcached", duration: "4h 10m", completed: false },
      { id: 4, title: "Message Queues: Kafka vs RabbitMQ", duration: "5h 00m", completed: false },
    ]
  },
  {
    id: "operating-systems",
    title: "Operating Systems & Low Level Concurrency",
    category: "Core CS",
    difficulty: "Intermediate",
    progress: 0,
    modulesCount: 18,
    completedModules: 0,
    duration: "30 Hours",
    rating: 4.7,
    studentsCount: 7600,
    instructor: "Sarah Jenkins (Kernel Engineer)",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80",
    tags: ["Threads", "Virtual Memory", "Deadlocks", "POSIX"],
    description: "Understand kernel memory management, process scheduling, multithreading synchronization, and I/O multiplexing.",
    status: "New",
    modules: [
      { id: 1, title: "Process Control Blocks & Context Switching", duration: "2h 00m", completed: false },
      { id: 2, title: "Memory Management & Paging Systems", duration: "3h 30m", completed: false },
    ]
  },
  {
    id: "fullstack-react-node",
    title: "Production Full Stack Engineering",
    category: "Development",
    difficulty: "Intermediate",
    progress: 100,
    modulesCount: 22,
    completedModules: 22,
    duration: "40 Hours",
    rating: 4.9,
    studentsCount: 21000,
    instructor: "Lohith R C & Dev Team",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    tags: ["React.js", "Node.js", "TypeScript", "Docker"],
    description: "Build, containerize, and deploy full stack web applications with modern CI/CD pipelines.",
    status: "Completed",
    modules: [
      { id: 1, title: "React 19 Architecture & Custom Hooks", duration: "4h 00m", completed: true },
      { id: 2, title: "Express RESTful APIs & Middleware Security", duration: "3h 30m", completed: true },
    ]
  }
];

export const PRACTICE_PROBLEMS = [
  {
    id: "prob-1",
    title: "Optimized Placement Match Score",
    difficulty: "Medium",
    category: "Arrays & Hash Map",
    acceptance: "78.4%",
    points: 50,
    description: `Given a student profile object containing skills vector \`V\` and target role threshold \`T\`, implement an algorithm that calculates the optimal candidate match score in O(N) time complexity.

Return \`"Top Tier Match"\` if score > 95, else calculate weighted placement probability using the provided ATS metric helper.`,
    starterCode: {
      python: `def optimize_placement(profile):\n    # Extract metric scores\n    skills = profile.get_metrics()\n    if skills.score > 95:\n        return "Top Tier Match"\n    \n    # Calculate ATS match probability\n    total_score = sum(skills.values) / len(skills.values)\n    return f"Match Score: {total_score:.1f}%"`,
      javascript: `function optimizePlacement(profile) {\n  const skills = profile.getMetrics();\n  if (skills.score > 95) {\n    return "Top Tier Match";\n  }\n  const avg = Object.values(skills.values).reduce((a, b) => a + b, 0) / Object.keys(skills.values).length;\n  return \`Match Score: \${avg.toFixed(1)}%\`;\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\n\nstd::string optimizePlacement(const std::vector<int>& skills) {\n    int sum = 0;\n    for(int s : skills) sum += s;\n    double avg = (double)sum / skills.size();\n    if(avg > 95) return "Top Tier Match";\n    return "Qualified Candidate";\n}`
    },
    testCases: [
      { id: 1, input: "profile = { score: 98, values: [95, 99, 100] }", expected: '"Top Tier Match"', passed: true },
      { id: 2, input: "profile = { score: 88, values: [85, 90, 89] }", expected: '"Match Score: 88.0%"', passed: true },
      { id: 3, input: "profile = { score: 72, values: [70, 75, 71] }", expected: '"Match Score: 72.0%"', passed: true }
    ],
    groqAiInsight: "Code structure optimized. Time complexity: O(N), Space complexity: O(1). ATS match probability increased to 98%."
  },
  {
    id: "prob-2",
    title: "LRU Cache Memory eviction",
    difficulty: "Hard",
    category: "Data Structures",
    acceptance: "52.1%",
    points: 100,
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the \`LRUCache\` class:
- \`LRUCache(capacity)\` Initialize the LRU cache with positive size capacity.
- \`get(key)\` Return the value of the key if key exists, otherwise return -1.
- \`put(key, value)\` Update the value if key exists, otherwise add key-value pair. If keys exceed capacity, evict the least recently used key.`,
    starterCode: {
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = {}\n\n    def get(self, key: int) -> int:\n        if key in self.cache:\n            val = self.cache.pop(key)\n            self.cache[key] = val\n            return val\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.pop(key)\n        elif len(self.cache) >= self.cap:\n            first_key = next(iter(self.cache))\n            del self.cache[first_key]\n        self.cache[key] = value`,
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    else if (this.map.size >= this.capacity) {\n      const oldest = this.map.keys().next().value;\n      this.map.delete(oldest);\n    }\n    this.map.set(key, value);\n  }\n}`
    },
    testCases: [
      { id: 1, input: "LRUCache(2) -> put(1,1), put(2,2), get(1)", expected: "1", passed: true },
      { id: 2, input: "put(3,3) -> evicts key 2 -> get(2)", expected: "-1", passed: true }
    ],
    groqAiInsight: "Using Doubly Linked List + Hash Map yields true O(1) time complexity for get and put operations."
  }
];

export const LEADERBOARD_USERS = [
  { rank: 1, name: "Aarav Sharma", avatar: "AS", college: "IIT Bombay", points: 4890, streak: 45, badge: "🥇 Grandmaster", problems: 240 },
  { rank: 2, name: "Priya Patel", avatar: "PP", college: "BITS Pilani", points: 4620, streak: 38, badge: "🥈 Master", problems: 215 },
  { rank: 3, name: "Rohan Mehta", avatar: "RM", college: "IIT Delhi", points: 4310, streak: 31, badge: "🥉 Master", problems: 198 },
  { rank: 4, name: "Sneha Reddy", avatar: "SR", college: "NIT Trichy", points: 3950, streak: 29, badge: "Expert", problems: 175 },
  { rank: 5, name: "Vikram Malhotra", avatar: "VM", college: "IIIT Hyderabad", points: 3810, streak: 24, badge: "Expert", problems: 162 },
  { rank: 14, name: "Lohith R C (You)", avatar: "LR", college: "SkillForge Academy", points: 2450, streak: 12, badge: "Specialist", problems: 84, isCurrentUser: true }
];

export const NOTIFICATIONS_DATA = [
  { id: 1, title: "Streak Saved!", message: "Your 12-day streak is active. Keep learning today!", time: "10 mins ago", read: false },
  { id: 2, title: "Groq AI ATS Audit Ready", message: "Your resume scored 88/100 for SDE-1 role. Check 3 keyword suggestions.", time: "1 hour ago", read: false },
  { id: 3, title: "New Mock Contest", message: "System Design Mock Assessment goes live tomorrow at 6 PM.", time: "3 hours ago", read: true },
];
