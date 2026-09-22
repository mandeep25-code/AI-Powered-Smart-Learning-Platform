/* Static, read-mostly domain content for SmartLearn. Served via /api/content/* */

const CAREER_TRACKS = [
  { slug: "mern", name: "MERN Full Stack", category: "Software", icon: "layers", color: "#6366F1", demand: "Very High",
    description: "Master MongoDB, Express, React and Node to build production web apps end-to-end.",
    skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "REST APIs", "Auth", "Deployment"],
    roles: ["Full Stack Developer", "Frontend Engineer", "Backend Engineer"], avgSalary: "₹6-18 LPA" },
  { slug: "ai-ml", name: "AI / Machine Learning", category: "Data & AI", icon: "brain", color: "#8B5CF6", demand: "Very High",
    description: "Build intelligent systems with ML, deep learning, and modern LLM tooling.",
    skills: ["Python", "NumPy", "Pandas", "scikit-learn", "PyTorch", "Deep Learning", "NLP", "MLOps"],
    roles: ["ML Engineer", "AI Engineer", "Research Engineer"], avgSalary: "₹8-30 LPA" },
  { slug: "data-science", name: "Data Science", category: "Data & AI", icon: "line-chart", color: "#0ea5e9", demand: "High",
    description: "Turn raw data into insight with statistics, modelling and storytelling.",
    skills: ["Python", "Statistics", "SQL", "Pandas", "Visualization", "ML", "Experimentation"],
    roles: ["Data Scientist", "ML Analyst"], avgSalary: "₹7-25 LPA" },
  { slug: "data-analytics", name: "Data Analytics", category: "Data & AI", icon: "bar-chart-3", color: "#10B981", demand: "High",
    description: "Drive decisions with dashboards, SQL and business analytics.",
    skills: ["Excel", "SQL", "Power BI", "Tableau", "Python", "Business Acumen"],
    roles: ["Data Analyst", "BI Analyst"], avgSalary: "₹4-12 LPA" },
  { slug: "devops", name: "DevOps Engineering", category: "Infrastructure", icon: "infinity", color: "#F59E0B", demand: "High",
    description: "Automate delivery pipelines with CI/CD, containers and orchestration.",
    skills: ["Linux", "Docker", "Kubernetes", "CI/CD", "Terraform", "AWS", "Monitoring"],
    roles: ["DevOps Engineer", "SRE", "Platform Engineer"], avgSalary: "₹7-24 LPA" },
  { slug: "cloud", name: "Cloud Computing", category: "Infrastructure", icon: "cloud", color: "#38bdf8", demand: "High",
    description: "Design scalable systems on AWS, Azure and GCP.",
    skills: ["AWS", "Azure", "Networking", "IaC", "Serverless", "Security"],
    roles: ["Cloud Engineer", "Cloud Architect"], avgSalary: "₹8-28 LPA" },
  { slug: "cybersecurity", name: "Cybersecurity", category: "Security", icon: "shield", color: "#EF4444", demand: "High",
    description: "Defend systems through ethical hacking, network and application security.",
    skills: ["Networking", "Linux", "Cryptography", "Pen Testing", "SIEM", "Threat Analysis"],
    roles: ["Security Analyst", "Pen Tester", "SOC Engineer"], avgSalary: "₹6-22 LPA" },
  { slug: "bde-sales", name: "BDE / Tech Sales", category: "Business", icon: "handshake", color: "#ec4899", demand: "Medium",
    description: "Blend product knowledge with communication to drive business growth.",
    skills: ["Communication", "CRM", "Negotiation", "Product Knowledge", "Lead Gen"],
    roles: ["Business Development Executive", "Sales Engineer"], avgSalary: "₹4-14 LPA" },
  { slug: "product", name: "Product Management", category: "Business", icon: "compass", color: "#a855f7", demand: "Medium",
    description: "Own the why, what and when of products users love.",
    skills: ["User Research", "Roadmapping", "Analytics", "Agile", "Communication"],
    roles: ["Associate PM", "Product Analyst"], avgSalary: "₹8-26 LPA" },
];

const DSA_SHEETS = [
  { name: "Striver SDE Sheet", count: 180, level: "Placement", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" },
  { name: "Blind 75", count: 75, level: "Essential", url: "https://neetcode.io/practice" },
  { name: "NeetCode 150", count: 150, level: "Comprehensive", url: "https://neetcode.io/practice" },
  { name: "Love Babbar 450", count: 450, level: "Complete", url: "https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view" },
];

let DSA_PROBLEMS = [
  { title: "Two Sum", difficulty: "Easy", topic: "Arrays & Hashing", pattern: "Hash Map", companies: ["Amazon", "Google"], url: "https://leetcode.com/problems/two-sum/" },
  { title: "Valid Anagram", difficulty: "Easy", topic: "Arrays & Hashing", pattern: "Frequency Count", companies: ["Uber"], url: "https://leetcode.com/problems/valid-anagram/" },
  { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Sliding Window", pattern: "Greedy", companies: ["Amazon", "Meta"], url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", pattern: "Stack", companies: ["Microsoft"], url: "https://leetcode.com/problems/valid-parentheses/" },
  { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", pattern: "Two Pointers", companies: ["Amazon", "Adobe"], url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { title: "3Sum", difficulty: "Medium", topic: "Two Pointers", pattern: "Sorting + Two Pointers", companies: ["Meta", "Google"], url: "https://leetcode.com/problems/3sum/" },
  { title: "Group Anagrams", difficulty: "Medium", topic: "Arrays & Hashing", pattern: "Hash Map", companies: ["Amazon"], url: "https://leetcode.com/problems/group-anagrams/" },
  { title: "Number of Islands", difficulty: "Medium", topic: "Graphs", pattern: "BFS/DFS", companies: ["Amazon", "Google", "Microsoft"], url: "https://leetcode.com/problems/number-of-islands/" },
  { title: "Course Schedule", difficulty: "Medium", topic: "Graphs", pattern: "Topological Sort", companies: ["Google"], url: "https://leetcode.com/problems/course-schedule/" },
  { title: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming", pattern: "DP", companies: ["Amazon"], url: "https://leetcode.com/problems/coin-change/" },
  { title: "Merge Intervals", difficulty: "Medium", topic: "Intervals", pattern: "Sorting", companies: ["Meta", "Google"], url: "https://leetcode.com/problems/merge-intervals/" },
  { title: "Word Break", difficulty: "Medium", topic: "Dynamic Programming", pattern: "DP", companies: ["Amazon"], url: "https://leetcode.com/problems/word-break/" },
  { title: "Trapping Rain Water", difficulty: "Hard", topic: "Two Pointers", pattern: "Two Pointers", companies: ["Amazon", "Goldman Sachs"], url: "https://leetcode.com/problems/trapping-rain-water/" },
  { title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", pattern: "Binary Search", companies: ["Google", "Adobe"], url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
  { title: "Word Ladder", difficulty: "Hard", topic: "Graphs", pattern: "BFS", companies: ["Amazon"], url: "https://leetcode.com/problems/word-ladder/" },
];

const SYSTEM_DESIGN = [
  { title: "Fundamentals: Scalability & Load Balancing", level: "Basics", url: "https://github.com/donnemartin/system-design-primer" },
  { title: "Design a URL Shortener (TinyURL)", level: "Beginner", url: "https://www.youtube.com/watch?v=JQDHz72OA3c" },
  { title: "Design Instagram / News Feed", level: "Intermediate", url: "https://www.youtube.com/watch?v=QmX2NPkJTKg" },
  { title: "Design WhatsApp / Chat System", level: "Intermediate", url: "https://www.youtube.com/watch?v=vvhC64hQZMk" },
  { title: "Design YouTube / Netflix", level: "Advanced", url: "https://www.youtube.com/watch?v=jPKTo1iGQiE" },
  { title: "Caching, CDN, Sharding & CAP Theorem", level: "Core", url: "https://github.com/donnemartin/system-design-primer#the-cap-theorem" },
];

const PLACEMENT_COMPANIES = [
  { name: "Google", type: "Product", difficulty: "Hard", focus: ["DSA", "System Design"], prep: ["LeetCode Hard", "Behavioral (Googleyness)"], ctc: "₹25-45 LPA" },
  { name: "Amazon", type: "Product", difficulty: "Medium-Hard", focus: ["DSA", "Leadership Principles"], prep: ["Blind 75", "LP Stories"], ctc: "₹18-40 LPA" },
  { name: "Microsoft", type: "Product", difficulty: "Medium", focus: ["DSA", "OOP"], prep: ["NeetCode 150", "OS/DBMS"], ctc: "₹20-42 LPA" },
  { name: "TCS", type: "Service", difficulty: "Easy", focus: ["Aptitude", "Coding Basics"], prep: ["NQT", "C/Java basics"], ctc: "₹3.5-7 LPA" },
  { name: "Infosys", type: "Service", difficulty: "Easy", focus: ["Aptitude", "Verbal"], prep: ["InfyTQ", "Pseudocode"], ctc: "₹3.6-8 LPA" },
  { name: "Wipro", type: "Service", difficulty: "Easy", focus: ["Aptitude", "Essay"], prep: ["Elite NLTH"], ctc: "₹3.5-6.5 LPA" },
  { name: "Accenture", type: "Service", difficulty: "Easy-Medium", focus: ["Cognitive", "Coding"], prep: ["Pseudocode MCQs"], ctc: "₹4.5-9 LPA" },
  { name: "Flipkart", type: "Product", difficulty: "Hard", focus: ["DSA", "System Design"], prep: ["Striver SDE", "LLD"], ctc: "₹20-38 LPA" },
];

const APTITUDE_TOPICS = [
  { category: "Quantitative", topics: ["Number System", "Percentages", "Profit & Loss", "Time & Work", "Time Speed Distance", "Probability"],
    resources: [ { title: "IndiaBIX Quantitative Aptitude", url: "https://www.indiabix.com/aptitude/questions-and-answers/" }, { title: "PrepInsta Aptitude Learning", url: "https://prepinsta.com/learn-aptitude/" }, { title: "TalentSprint Aptitude Playlist (YouTube)", url: "https://www.youtube.com/@TalentSprintEducation/playlists" }, { title: "Quantitative Aptitude One-Shot (YouTube)", url: "https://www.youtube.com/results?search_query=quantitative+aptitude+one+shot+placement" } ] },
  { category: "Logical Reasoning", topics: ["Series", "Coding-Decoding", "Blood Relations", "Syllogism", "Puzzles"],
    resources: [ { title: "IndiaBIX Logical Reasoning", url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/" }, { title: "PrepInsta Logical Reasoning", url: "https://prepinsta.com/logical-reasoning/" }, { title: "Reasoning Playlist (YouTube)", url: "https://www.youtube.com/results?search_query=logical+reasoning+placement+playlist" } ] },
  { category: "Verbal Ability", topics: ["Reading Comprehension", "Sentence Correction", "Synonyms/Antonyms", "Para Jumbles"],
    resources: [ { title: "IndiaBIX Verbal Ability", url: "https://www.indiabix.com/verbal-ability/questions-and-answers/" }, { title: "PrepInsta Verbal Ability", url: "https://prepinsta.com/verbal-ability/" }, { title: "Verbal Ability One-Shot (YouTube)", url: "https://www.youtube.com/results?search_query=verbal+ability+one+shot+placement" } ] },
  { category: "Data Interpretation", topics: ["Tables", "Bar/Line Graphs", "Pie Charts", "Caselets"],
    resources: [ { title: "DI Practice (IndiaBIX)", url: "https://www.indiabix.com/data-interpretation/questions-and-answers/" } ] },
];

const QUICKREV = [
  { name: "W3Schools", category: "Web", description: "Fast reference for HTML, CSS, JS, SQL & more", url: "https://www.w3schools.com/" },
  { name: "MDN Web Docs", category: "Web", description: "The authoritative web platform reference", url: "https://developer.mozilla.org/" },
  { name: "GeeksforGeeks", category: "CS Core", description: "DSA, OS, DBMS, CN quick notes", url: "https://www.geeksforgeeks.org/" },
  { name: "JavaScript.info", category: "Web", description: "Modern JavaScript tutorial", url: "https://javascript.info/" },
  { name: "React Docs", category: "Frontend", description: "Official React learning docs", url: "https://react.dev/learn" },
  { name: "roadmap.sh", category: "Career", description: "Developer roadmaps for every track", url: "https://roadmap.sh/" },
  { name: "DevDocs", category: "Reference", description: "Unified API docs for 100+ technologies", url: "https://devdocs.io/" },
  { name: "Cheatography", category: "Reference", description: "Thousands of cheat sheets", url: "https://cheatography.com/" },
];

const FUTURE_PATH = [
  { key: "jobs", title: "Get a Job (Software)", icon: "briefcase", summary: "Enter the industry directly as a developer, analyst or engineer.",
    points: ["Build 2-3 strong portfolio projects", "Crack DSA + core CS for interviews", "Optimize LinkedIn & GitHub", "Target both product and service companies"],
    outcomes: ["SDE / Full Stack", "Data Analyst", "QA / DevOps"] },
  { key: "ms-abroad", title: "MS / Study Abroad", icon: "plane", summary: "Pursue a Master's in the US, Germany, Canada, or Australia.",
    points: ["Prepare GRE/IELTS/TOEFL early", "Maintain a strong GPA & research", "Craft SOP + LORs", "Apply for scholarships & assistantships"],
    outcomes: ["MS CS / Data Science", "Research Assistant", "Global career"] },
  { key: "higher-studies", title: "MTech / GATE / PhD", icon: "graduation-cap", summary: "Deepen expertise via GATE, MTech, IISc/IITs or research.",
    points: ["Prepare for GATE (CS)", "Target IITs/IISc/NITs", "Explore research internships", "Consider PhD for academia/R&D"],
    outcomes: ["MTech", "Research Scientist", "Professor"] },
  { key: "startup", title: "Startup / Freelance", icon: "rocket", summary: "Build your own product or freelance with your skills.",
    points: ["Validate an idea with a real user problem", "Ship an MVP fast", "Learn sales & marketing basics", "Build in public"],
    outcomes: ["Founder", "Freelancer", "Indie hacker"] },
  { key: "govt", title: "Govt / PSU / Civil", icon: "landmark", summary: "Stable public-sector careers via GATE-PSU or civil services.",
    points: ["GATE for PSUs (ISRO, BHEL, etc.)", "UPSC / State PSC for civil services", "Banking (IBPS) exams", "Prepare general studies + aptitude"],
    outcomes: ["PSU Engineer", "Civil Servant", "Bank PO"] },
];

const DSA_50 = [
  ["Two Sum", "two-sum", "Easy"], ["Contains Duplicate", "contains-duplicate", "Easy"], ["Valid Anagram", "valid-anagram", "Easy"], ["Group Anagrams", "group-anagrams", "Medium"],
  ["Top K Frequent Elements", "top-k-frequent-elements", "Medium"], ["Product of Array Except Self", "product-of-array-except-self", "Medium"], ["Valid Sudoku", "valid-sudoku", "Medium"], ["Longest Consecutive Sequence", "longest-consecutive-sequence", "Medium"],
  ["Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "Easy"], ["3Sum", "3sum", "Medium"], ["Container With Most Water", "container-with-most-water", "Medium"], ["Trapping Rain Water", "trapping-rain-water", "Hard"],
  ["Valid Palindrome", "valid-palindrome", "Easy"], ["Two Sum II", "two-sum-ii-input-array-is-sorted", "Medium"], ["Permutation in String", "permutation-in-string", "Medium"], ["Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "Medium"],
  ["Minimum Window Substring", "minimum-window-substring", "Hard"], ["Find All Anagrams in a String", "find-all-anagrams-in-a-string", "Medium"], ["Minimum Size Subarray Sum", "minimum-size-subarray-sum", "Medium"], ["Remove Duplicates from Sorted Array", "remove-duplicates-from-sorted-array", "Easy"],
  ["Move Zeroes", "move-zeroes", "Easy"], ["Sort Colors", "sort-colors", "Medium"], ["Invert Binary Tree", "invert-binary-tree", "Easy"], ["Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "Easy"],
  ["Diameter of Binary Tree", "diameter-of-binary-tree", "Easy"], ["Balanced Binary Tree", "balanced-binary-tree", "Easy"], ["Same Tree", "same-tree", "Easy"], ["Subtree of Another Tree", "subtree-of-another-tree", "Easy"],
  ["Lowest Common Ancestor of a BST", "lowest-common-ancestor-of-a-binary-search-tree", "Medium"], ["Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "Medium"], ["Validate Binary Search Tree", "validate-binary-search-tree", "Medium"], ["Kth Smallest Element in a BST", "kth-smallest-element-in-a-bst", "Medium"],
  ["Clone Graph", "clone-graph", "Medium"], ["Number of Islands", "number-of-islands", "Medium"], ["Max Area of Island", "max-area-of-island", "Medium"], ["Course Schedule", "course-schedule", "Medium"],
  ["Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "Medium"], ["Word Ladder", "word-ladder", "Hard"], ["Climbing Stairs", "climbing-stairs", "Easy"], ["House Robber", "house-robber", "Medium"],
  ["House Robber II", "house-robber-ii", "Medium"], ["Coin Change", "coin-change", "Medium"], ["Longest Increasing Subsequence", "longest-increasing-subsequence", "Medium"], ["Longest Common Subsequence", "longest-common-subsequence", "Medium"],
  ["Word Break", "word-break", "Medium"], ["Combination Sum IV", "combination-sum-iv", "Medium"], ["Decode Ways", "decode-ways", "Medium"], ["Unique Paths", "unique-paths", "Medium"],
  ["Jump Game", "jump-game", "Medium"], ["Partition Equal Subset Sum", "partition-equal-subset-sum", "Medium"],
].map(([title, slug, difficulty]) => ({ title, difficulty, url: `https://leetcode.com/problems/${slug}/` }));

// The Coding Arena uses this complete, placement-first set.  Keeping the
// metadata alongside every problem lets the UI teach a pattern instead of
// presenting a disconnected list of external links.
const DSA_TOPIC_METADATA = [
  ["Arrays & Hashing", "Hash map / frequency count"], ["Arrays & Hashing", "Set lookup"], ["Strings", "Frequency count"], ["Arrays & Hashing", "Hash map + grouping"],
  ["Arrays & Hashing", "Bucket sort / heap"], ["Arrays & Hashing", "Prefix / postfix"], ["Arrays & Hashing", "Hash set constraints"], ["Arrays & Hashing", "Hash set sequence"],
  ["Arrays", "One-pass minimum"], ["Two Pointers", "Sort + opposite pointers"], ["Two Pointers", "Opposite pointers"], ["Two Pointers", "Two pointers + max"],
  ["Strings", "Two pointers"], ["Two Pointers", "Sorted two pointers"], ["Strings", "Fixed sliding window"], ["Strings", "Variable sliding window"],
  ["Strings", "Variable sliding window"], ["Strings", "Fixed sliding window"], ["Arrays", "Sliding window"], ["Arrays", "Read / write pointers"],
  ["Arrays", "Read / write pointers"], ["Arrays", "Dutch national flag"], ["Trees", "DFS recursion"], ["Trees", "DFS height"],
  ["Trees", "Post-order DFS"], ["Trees", "DFS height"], ["Trees", "DFS comparison"], ["Trees", "DFS matching"],
  ["Trees", "BST traversal"], ["Trees", "BFS queue"], ["Trees", "DFS bounds"], ["Trees", "In-order DFS"],
  ["Graphs", "DFS / BFS + map"], ["Graphs", "Grid DFS / BFS"], ["Graphs", "Grid DFS / BFS"], ["Graphs", "Topological sort"],
  ["Graphs", "Multi-source DFS"], ["Graphs", "BFS shortest path"], ["Dynamic Programming", "One-dimensional DP"], ["Dynamic Programming", "One-dimensional DP"],
  ["Dynamic Programming", "State transition"], ["Dynamic Programming", "Unbounded knapsack"], ["Dynamic Programming", "Subsequence DP"], ["Dynamic Programming", "2D DP"],
  ["Dynamic Programming", "Word segmentation DP"], ["Dynamic Programming", "State transition"], ["Dynamic Programming", "Decode DP"], ["Dynamic Programming", "Grid DP"],
  ["Greedy", "Reachability greedy"], ["Dynamic Programming", "Subset-sum DP"],
];

DSA_PROBLEMS = DSA_50.map((problem, index) => {
  const [topic, pattern] = DSA_TOPIC_METADATA[index];
  const hard = problem.difficulty === "Hard";
  return {
    ...problem,
    topic,
    pattern,
    companies: hard ? ["Google", "Amazon"] : index % 3 === 0 ? ["Amazon", "Microsoft"] : ["Product companies"],
    complexity: hard ? "Usually O(n)–O(n log n); verify constraints" : "Target O(n) time; use O(n) extra space only when the pattern needs it",
  };
});

const yt = (id) => `https://www.youtube.com/watch?v=${id}`;

const SEED_COURSES = [
  { title: "MERN Stack Bootcamp", category: "Software", track: "mern", level: "Beginner",
    description: "Go from JavaScript fundamentals to deploying full-stack MERN applications — with video lectures and notes.",
    thumbnail: "https://images.unsplash.com/photo-1584697964328-b1e7f63dca95?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    tags: ["React", "Node", "MongoDB"], topics: [
      { title: "Modern JavaScript Essentials", type: "video", durationMin: 45, resourceUrl: yt("PkZNo7MFNFg"),
        content: `Goal: write modern JavaScript confidently before React or Node.

Core ideas
• let / const, template strings, destructuring, spread/rest
• Arrays: map, filter, reduce (these replace most loops)
• Objects as key-value maps; JSON is just text that maps to objects
• Functions: arrow functions, closures, higher-order functions
• Async: Promises and async/await sit on top of the event loop

Complexity intuition
• Array index access is O(1). Searching an unsorted array is O(n).
• Object/Map lookup by key is typically O(1).

Practice
1. Convert a nested callback to async/await.
2. Group an array of users by city using reduce.
3. Explain why a setTimeout(fn, 0) still runs after the current stack.

Watch the lecture, pause to type along, then ask the AI tutor about anything that is still fuzzy.` },
      { title: "React Fundamentals", type: "video", durationMin: 50, resourceUrl: yt("bMknfKXIFA8"),
        content: `Goal: build UI as a tree of components, not as one giant HTML file.

Core ideas
• A component is a function that returns JSX.
• Props are read-only inputs from the parent.
• State is data the component owns. Updating state re-renders that component.
• useEffect runs after render for fetching, subscriptions, and timers.
• Lift state up when two siblings need the same data.

Rules that prevent bugs
• Never mutate state: setItems([...items, next]) instead of items.push.
• Keys in lists must be stable (id, not array index) when the list can reorder.
• Keep derived values as calculations, not extra state.

Mini project
Build a todo list: add, toggle complete, filter active/done. That covers state, lists, and events.` },
      { title: "Building REST APIs with Express", type: "video", durationMin: 40, resourceUrl: yt("SccSCuHhOw0"),
        content: `Goal: expose CRUD over HTTP so the React app can persist data.

Request flow
Client → route (method + path) → middleware → controller → database → JSON response.

REST mapping
• GET /items — list
• GET /items/:id — one record
• POST /items — create
• PUT/PATCH /items/:id — update
• DELETE /items/:id — remove

Quality checklist
• Validate body and params; return 400 with a clear error.
• Use middleware for CORS, JSON parsing, auth, and logging.
• Keep route handlers thin; put business logic in services.
• Consistent error shape: { error: "message" }.

Try it
Create GET/POST /notes, then call them from fetch or Postman before wiring React.` },
      { title: "MongoDB & Mongoose", type: "video", durationMin: 35, resourceUrl: yt("OfFgnDtn_d8"),
        content: `Goal: store documents instead of rigid SQL rows, with a schema when you need one.

Mental model
• Database → collections → documents (JSON-like).
• Mongoose Schema defines fields, types, required, defaults, indexes.
• populate() follows ObjectId refs (like a join, but explicit).

Design tips
• Embed small, always-together data (address on a user).
• Reference large or many-to-many data (orders → user).
• Index fields you filter/sort on (email, createdAt).

Queries
User.find({ role: "student" }).sort({ createdAt: -1 }).limit(20)
Avoid fetching entire collections when you only need a page of rows.` },
      { title: "Auth with JWT", type: "video", durationMin: 30, resourceUrl: yt("7Q17ubqLfaM"),
        content: `Goal: identify the user on every request without storing session rows on the server.

Flow
1. Register: hash password with bcrypt, save user.
2. Login: compare hash, sign JWT { userId, role } with a secret.
3. Client stores token (memory or httpOnly cookie).
4. Protected routes: Authorization: Bearer <token>, verify signature.

Security
• Never put JWT_SECRET in the frontend.
• Hash passwords; never store plaintext.
• Short expiry + refresh (or re-login) is safer than tokens that never die.
• Check role on the server. Hiding a button is not authorization.

After this lesson
Protect enroll and complete-topic APIs the same way this platform does.` },
    ] },
  { title: "Python for Data Science", category: "Data & AI", track: "data-science", level: "Beginner",
    description: "Learn Python, NumPy, Pandas and visualization for data analysis with full video lessons.",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    tags: ["Python", "Pandas", "NumPy"], topics: [
      { title: "Python Crash Course", type: "video", durationMin: 40, resourceUrl: yt("rfscVS0vtbw"),
        content: `Goal: be fluent in Python syntax used in notebooks and interviews.

Must-know
• Types: int, float, str, bool, None
• Collections: list (ordered), dict (key-value), set (unique), tuple (immutable)
• Control: if/elif, for, while, list comprehensions
• Functions, *args/**kwargs, unpacking
• Files: with open(...) as f

Complexity
• dict/set lookup ≈ O(1); list search ≈ O(n); sorting ≈ O(n log n).

Exercise
Count word frequency in a paragraph using a dict. Then rewrite it with collections.Counter.` },
      { title: "NumPy for Numerical Computing", type: "video", durationMin: 30, resourceUrl: yt("QUT1VHiLmmI"),
        content: `Goal: replace Python loops with vectorized array operations.

Why NumPy
A ndarray stores homogeneous numbers in contiguous memory. Arithmetic runs in C speed.

Patterns
• np.array, arange, linspace, zeros, ones, random
• Indexing, slicing, boolean masks: a[a > 0]
• Broadcasting: (n, 1) + (1, m) → (n, m)
• Aggregations: mean, sum, std, argmax along an axis

Rule
If you write for i in range(len(a)) on numbers, there is usually a NumPy one-liner.` },
      { title: "Data Wrangling with Pandas", type: "video", durationMin: 35, resourceUrl: yt("vmEHCJofslg"),
        content: `Goal: turn messy tables into analysis-ready DataFrames.

Pipeline
1. read_csv / read_excel
2. inspect: head, info, describe, isnull().sum()
3. clean: dropna / fillna, astype, rename, drop duplicates
4. transform: assign, apply, datetime parsing
5. combine: merge, concat, groupby().agg()

Interview habits
• Always check shape before and after a merge.
• Prefer vectorized ops over row-wise apply when possible.
• groupby is the spreadsheet “pivot” of Python.

Mini task
Load a CSV, fill missing ages with the median, and compute mean salary by department.` },
      { title: "Visualization with Matplotlib", type: "video", durationMin: 25, resourceUrl: yt("3Xc3CA655Y4"),
        content: `Goal: pick a chart that answers a question, not decoration.

Chart map
• Line — trend over time
• Bar — compare categories
• Histogram — distribution of one numeric column
• Scatter — relationship between two numerics
• Box — spread and outliers

Craft
Label axes, title the claim, start bar charts at zero, and avoid 3D pie charts.

Stack
Matplotlib is the base. Seaborn sits on top for statistical plots. Pandas .plot() is a shortcut.` },
    ] },
  { title: "DSA for Placements", category: "Software", track: "mern", level: "Intermediate",
    description: "Master data structures & algorithms with video lectures, written notes, and LeetCode practice on every topic.",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    tags: ["DSA", "Interview"], topics: [
      { title: "Arrays & Hashing", type: "video", durationMin: 35, resourceUrl: yt("KLlXCFG5TnA"), practiceLinks: DSA_50.slice(0, 8),
        content: `Pattern: Hash map for O(1) lookup / frequency.

Two Sum (classic)
Brute: check every pair → O(n²).
Optimal: for each x, look up target - x in a map of seen values → O(n) time, O(n) space.

Related tools
• Frequency map: anagrams, majority element
• Hash set: contains duplicate, longest consecutive sequence
• Prefix sums: range sum in O(1) after O(n) build

Template
seen = {}
for i, x in enumerate(nums):
    if need in seen: return [seen[need], i]
    seen[x] = i

Watch the Two Sum walkthrough, then solve the practice set in order (Easy → Medium).` },
      { title: "Two Pointers & Sliding Window", type: "video", durationMin: 35, resourceUrl: yt("cEQWkO2u3pQ"), practiceLinks: DSA_50.slice(8, 22),
        content: `When the array is sorted or you need a contiguous subarray, think pointers — not nested loops.

Two pointers
• Opposite ends: container with most water, 2-sum on sorted array
• Same direction: remove duplicates, partition

Sliding window
Maintain a window [left, right]. Expand right; shrink left when the window is invalid.
Each index moves at most once → O(n).

Examples
• Longest substring without repeating characters (set + left pointer)
• Minimum size subarray sum (numeric window)
• Permutation in string (need vs have counts)

If your solution is O(n²) on a contiguous range, try a window.` },
      { title: "Binary Search", type: "video", durationMin: 30, resourceUrl: yt("s4DPM8ktP0A"), practiceLinks: [
        { title: "Binary Search", url: "https://leetcode.com/problems/binary-search/", difficulty: "Easy" },
        { title: "Search a 2D Matrix", url: "https://leetcode.com/problems/search-a-2d-matrix/", difficulty: "Medium" },
        { title: "Koko Eating Bananas", url: "https://leetcode.com/problems/koko-eating-bananas/", difficulty: "Medium" },
        { title: "Find Minimum in Rotated Sorted Array", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", difficulty: "Medium" },
        { title: "Median of Two Sorted Arrays", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", difficulty: "Hard" },
      ],
        content: `Binary search is not only “find x in a sorted array”. It is “search the answer space”.

Array search
lo, hi = 0, n-1
while lo <= hi:
    mid = (lo + hi) // 2
    if a[mid] == t: return mid
    elif a[mid] < t: lo = mid + 1
    else: hi = mid - 1

Answer-space search (Koko, capacity, splitting)
Predicate: can we finish with speed m?
Binary search m on [1, max]. Time O(n log M).

Pitfalls
Off-by-one on lo/hi, overflow of lo+hi (use lo + (hi-lo)//2), unsorted input.` },
      { title: "Stacks & Queues", type: "video", durationMin: 25, resourceUrl: yt("r3dH_uqbI-g"), practiceLinks: [
        { title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", difficulty: "Easy" },
        { title: "Min Stack", url: "https://leetcode.com/problems/min-stack/", difficulty: "Medium" },
        { title: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/", difficulty: "Medium" },
        { title: "Evaluate Reverse Polish Notation", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", difficulty: "Medium" },
      ],
        content: `Stack = LIFO. Queue = FIFO.

Interview uses
• Matching brackets / parse expressions
• Monotonic stack: next greater element, daily temperatures
• Call stack intuition for recursion
• Queue for BFS (graphs, trees level-order)

Valid parentheses
Push opening. On closing, pop and match. Stack must be empty at the end.

Monotonic stack
Keep indices in increasing (or decreasing) order so you can answer “next greater” in O(n).` },
      { title: "Trees & Graphs", type: "video", durationMin: 40, resourceUrl: yt("fAAZixBzGEI"), practiceLinks: DSA_50.slice(22, 38),
        content: `Trees are graphs with no cycles. Interviews love both.

Tree traversals
• DFS: preorder / inorder / postorder (recursion or stack)
• BFS: level order (queue)
Time O(n) for n nodes.

Graph traversal
• Adjacency list is the default representation
• DFS: stack / recursion + visited
• BFS: queue + visited — shortest path in unweighted graphs
Time O(V + E)

Patterns
• Number of islands: DFS/BFS on grid
• Course schedule: cycle detection / topological sort
• Clone graph: BFS + map old→new node

Always mark visited or you will infinite-loop on cycles.` },
      { title: "Recursion & Backtracking", type: "video", durationMin: 30, resourceUrl: yt("M2uO2nMTRs8"), practiceLinks: [
        { title: "Subsets", url: "https://leetcode.com/problems/subsets/", difficulty: "Medium" },
        { title: "Permutations", url: "https://leetcode.com/problems/permutations/", difficulty: "Medium" },
        { title: "Combination Sum", url: "https://leetcode.com/problems/combination-sum/", difficulty: "Medium" },
        { title: "Word Search", url: "https://leetcode.com/problems/word-search/", difficulty: "Medium" },
      ],
        content: `Recursion: solve a smaller copy of the same problem, plus a base case.

Backtracking template
def dfs(path, choices):
    if goal: record(path); return
    for c in choices:
        choose c
        dfs(...)
        unchoose c   # undo

Used for subsets, permutations, N-Queens, word search.

Complexity
Branching factor b, depth d → up to O(b^d). Prune invalid branches early.

Tip
Draw the decision tree for Subsets of [1,2,3] once. Most backtracking questions are the same tree with extra constraints.` },
      { title: "Heaps & Priority Queue", type: "video", durationMin: 25, resourceUrl: yt("HqNlixQYYfk"), practiceLinks: [
        { title: "Kth Largest Element in an Array", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", difficulty: "Medium" },
        { title: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/", difficulty: "Medium" },
        { title: "Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", difficulty: "Hard" },
        { title: "Merge k Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", difficulty: "Hard" },
      ],
        content: `A heap gives you min or max in O(1), insert/delete in O(log n).

Python: heapq is a min-heap. For max-heap, store negatives.
JS: no built-in heap — know the idea even if you sort for Easy problems.

Patterns
• Top K: keep a heap of size k
• Two heaps: median of a stream (max-heap left, min-heap right)
• Dijkstra: min-heap of (distance, node)

If a problem says “kth”, “top k”, or “always get the smallest”, reach for a heap.` },
      { title: "Dynamic Programming", type: "video", durationMin: 45, resourceUrl: yt("oBt53YbR9Kk"), practiceLinks: DSA_50.slice(38, 50),
        content: `DP = recursion + memory. Ask: “what is the answer for a smaller prefix / sum / capacity?”

Recipe
1. Define state: dp[i] = answer using first i items (or ending at i)
2. Recurrence: how dp[i] uses earlier states
3. Base cases
4. Order: compute small states first (tabulation) or memoize recursion
5. Answer location: dp[n] or max(dp)

Starters
• Climbing stairs: dp[i] = dp[i-1] + dp[i-2]
• House robber: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
• 0/1 knapsack / coin change: include capacity in the state
• LIS: O(n²) DP, or O(n log n) with patience sorting

If you see overlapping subproblems and optimal substructure, it is DP — not greedy.` },
    ] },
  { title: "AWS Cloud Practitioner", category: "Infrastructure", track: "cloud", level: "Beginner",
    description: "Understand core AWS services and cloud fundamentals with exam-oriented video lessons.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    tags: ["AWS", "Cloud"], topics: [
      { title: "Cloud Concepts", type: "video", durationMin: 30, resourceUrl: yt("ulprqHHWlng"),
        content: `Cloud = on-demand IT over the internet, pay for what you use.

Service models
• IaaS — you manage OS (EC2)
• PaaS — you manage app (Elastic Beanstalk, RDS-ish)
• SaaS — you use the app (WorkMail, many vendor apps)

Deployments
Public, private, hybrid, multi-cloud.

Shared responsibility
AWS: hardware, regions, hypervisor.
You: data, IAM users, encryption, OS patches on EC2.

Benefits: elasticity, global reach, trade capex for opex.` },
      { title: "Compute: EC2 & Lambda", type: "video", durationMin: 30, resourceUrl: yt("TsRBftzZsQo"),
        content: `EC2 = virtual servers. You pick AMI, instance type, VPC, security group, key pair.

Pricing: On-Demand, Reserved, Spot, Savings Plans.

Lambda = run a function without managing servers. Pay per request and duration. 15-minute max.

Choose EC2 when you need a long-running process or custom OS.
Choose Lambda for APIs, S3 triggers, scheduled jobs.

Always put instances in private subnets when they do not need a public IP; use a load balancer in public subnets.` },
      { title: "Storage: S3 & EBS", type: "video", durationMin: 25, resourceUrl: yt("e6wA6S0Zqmw"),
        content: `S3 = object storage (files as objects in buckets). Durable, infinite scale, HTTP access.

Classes: Standard, IA, Glacier. Lifecycle rules move old objects cheaper.

EBS = block disk attached to one EC2 (io2/gp3). Snapshots go to S3.

Compare
• S3: websites, backups, data lakes — not a boot disk
• EBS: OS and databases on EC2
• EFS: shared file system across instances

Lock buckets down: Block Public Access, bucket policies, encryption (SSE-S3 / KMS).` },
    ] },
  { title: "SQL for Data & Placements", category: "Data & AI", track: "data-analytics", level: "Beginner", description: "A practical SQL path from SELECT to joins, windows and interview queries.", thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80", tags: ["SQL", "Databases", "Interview"], topics: [
    { title: "SQL Foundations: SELECT to JOIN", type: "video", durationMin: 45, resourceUrl: yt("HXV3zeQKqGY"), content: "Build queries in layers: SELECT columns, filter with WHERE, group with GROUP BY, then combine tables with JOIN. Start with readable queries before optimising.", practiceLinks: [{ title: "LeetCode SQL 50", url: "https://leetcode.com/studyplan/top-sql-50/", difficulty: "Basic → Advanced" }] },
    { title: "Window Functions & Interview Patterns", type: "video", durationMin: 35, resourceUrl: yt("Ww71knvhQ-s"), content: "Window functions calculate across related rows without collapsing them. Learn ROW_NUMBER, RANK, LAG and running totals for analytics and interview questions." }
  ] },
  { title: "Cybersecurity Foundations", category: "Security", track: "cybersecurity", level: "Beginner", description: "Build a strong ethical-security foundation across networks, web safety and threat awareness.", thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80", tags: ["Security", "Networking", "Ethical Hacking"], topics: [
    { title: "Security, Networks & Threats", type: "video", durationMin: 42, resourceUrl: yt("inWWhr5tnEA"), content: "Learn the CIA triad, authentication, encryption basics, common web threats and responsible security practice. Never test systems without explicit permission." },
    { title: "Web Security Essentials", type: "video", durationMin: 35, resourceUrl: yt("2_lswM1S264"), content: "Recognise OWASP-style risks: injection, broken authentication, insecure access control and poor secrets management. Build security in from the start." }
  ] },
  { title: "DevOps & Cloud Delivery", category: "Infrastructure", track: "devops", level: "Beginner", description: "Learn Linux, Git, Docker, CI/CD and reliable deployment workflows.", thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=900&q=80", tags: ["Docker", "CI/CD", "Linux"], topics: [
    { title: "DevOps Fundamentals", type: "video", durationMin: 40, resourceUrl: yt("j5Zsa_eOXeY"), content: "DevOps connects development and operations through automation, fast feedback and reliable releases. Learn version control, pipelines, monitoring and infrastructure as code." },
    { title: "Docker & CI/CD Workflow", type: "video", durationMin: 40, resourceUrl: yt("3c-iBn73dDE"), content: "Package an application in a repeatable container, test it in a pipeline and deploy a version you can roll back safely." }
  ] },
  { title: "Android App Development", category: "Mobile", track: "mern", level: "Beginner", description: "Build polished Android apps with Kotlin, layouts, state and APIs.", thumbnail: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=900&q=80", tags: ["Kotlin", "Android", "Mobile"], topics: [
    { title: "Android & Kotlin Starter Path", type: "video", durationMin: 50, resourceUrl: yt("FjrKMcnKahY"), content: "Start with Kotlin syntax, Android Studio, screens, layouts, state and navigation. Build small apps before connecting a network API." }
  ] },
  { title: "iOS App Development", category: "Mobile", track: "mern", level: "Beginner", description: "Create modern iPhone apps using Swift and SwiftUI.", thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80", tags: ["Swift", "SwiftUI", "Mobile"], topics: [
    { title: "SwiftUI Foundations", type: "video", durationMin: 45, resourceUrl: yt("b1oC7sLIgpI"), content: "Learn Swift basics, declarative views, state, lists and navigation. Focus on a small usable app and iterate with previews." }
  ] },
];

const SEED_PREMIUM = [
  { title: "The Complete Placement Handbook", type: "ebook", price: 499, category: "Placement",
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    description: "300+ pages covering DSA patterns, HR rounds, negotiation and offer strategy.",
    previewContent: "Chapter 1: How top companies actually evaluate freshers...",
    protectedContent: "FULL EBOOK: 12 chapters, 300+ pages of curated placement strategy, mock scripts and salary negotiation playbooks." },
  { title: "System Design Masterclass", type: "course", price: 1299, category: "Software",
    thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    description: "8-hour masterclass on designing scalable systems with real case studies.",
    previewContent: "Preview: Designing a rate limiter (first 6 minutes)...",
    protectedContent: "FULL COURSE: 40 lessons, downloadable diagrams, and 6 end-to-end design case studies." },
  { title: "Resume & LinkedIn Power Pack", type: "bundle", price: 299, category: "Career",
    thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    description: "ATS-beating templates, 50 bullet-point formulas and a LinkedIn optimization guide.",
    previewContent: "Preview: The 3-line summary formula recruiters love...",
    protectedContent: "FULL BUNDLE: 10 premium templates + 50 quantified bullet formulas + LinkedIn audit checklist." },
  { title: "AI/ML Interview Question Bank", type: "pdf", price: 399, category: "Data & AI",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    description: "200 curated ML/DL interview questions with model answers.",
    previewContent: "Preview: Explain bias-variance tradeoff...",
    protectedContent: "FULL BANK: 200 Q&A across ML, DL, NLP, and MLOps with detailed model answers." },
];

module.exports = {
  CAREER_TRACKS, DSA_SHEETS, DSA_PROBLEMS, SYSTEM_DESIGN, PLACEMENT_COMPANIES,
  APTITUDE_TOPICS, QUICKREV, FUTURE_PATH, SEED_COURSES, SEED_PREMIUM,
};
