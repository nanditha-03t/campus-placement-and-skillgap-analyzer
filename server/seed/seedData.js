const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const JobRole = require('../models/JobRole');
const Drive = require('../models/Drive');
const Assessment = require('../models/Assessment');

const seedJobRoles = [
  {
    roleName: 'Software Development Engineer (SDE)',
    category: 'Software Engineering',
    tier: 'Tier 1 (Product / FAANG)',
    averageCtcLpa: { min: 14, max: 35 },
    minCgpa: 7.5,
    maxBacklogsAllowed: 0,
    description: 'Design and develop robust, scalable distributed applications with solid data structures and algorithms.',
    topCompaniesHiring: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Uber', 'Atlassian'],
    interviewRounds: ['Online Assessment (DSA + Aptitude)', 'Technical Round 1 (Data Structures)', 'Technical Round 2 (Algorithms & Problem Solving)', 'Technical Round 3 (Low Level Design & CS Fundamentals)', 'Bar Raiser / HR'],
    requiredSkills: [
      { name: 'Data Structures & Algorithms', importance: 'Critical', minimumLevel: 'Advanced', weight: 10, category: 'Core CS' },
      { name: 'Java / C++', importance: 'Critical', minimumLevel: 'Advanced', weight: 9, category: 'Programming' },
      { name: 'Object Oriented Design (LLD)', importance: 'High', minimumLevel: 'Intermediate', weight: 8, category: 'Core CS' },
      { name: 'Operating Systems & Concurrency', importance: 'High', minimumLevel: 'Intermediate', weight: 7, category: 'Core CS' },
      { name: 'DBMS & SQL', importance: 'High', minimumLevel: 'Intermediate', weight: 7, category: 'Database' },
      { name: 'Computer Networks', importance: 'Medium', minimumLevel: 'Intermediate', weight: 6, category: 'Core CS' },
      { name: 'Git & GitHub', importance: 'Medium', minimumLevel: 'Intermediate', weight: 5, category: 'Tools' },
      { name: 'System Design Basics', importance: 'Bonus', minimumLevel: 'Beginner', weight: 4, category: 'Cloud & DevOps' },
    ],
  },
  {
    roleName: 'Full Stack Web Developer',
    category: 'Web Development',
    tier: 'Tier 2 (Mid-Product / Fintech)',
    averageCtcLpa: { min: 8, max: 20 },
    minCgpa: 7.0,
    maxBacklogsAllowed: 0,
    description: 'Build complete web applications handling client-side reactivity, RESTful APIs, and database persistence.',
    topCompaniesHiring: ['Razorpay', 'Swiggy', 'Zomato', 'Freshworks', 'JioCinema', 'Paytm'],
    interviewRounds: ['Frontend/Backend Machine Coding', 'Technical Round (API Architecture & Async JS)', 'Database Design & Optimization', 'Culture Fit / HR'],
    requiredSkills: [
      { name: 'JavaScript / TypeScript', importance: 'Critical', minimumLevel: 'Advanced', weight: 10, category: 'Programming' },
      { name: 'React.js', importance: 'Critical', minimumLevel: 'Advanced', weight: 9, category: 'Frameworks' },
      { name: 'Node.js & Express', importance: 'Critical', minimumLevel: 'Advanced', weight: 9, category: 'Frameworks' },
      { name: 'MongoDB / PostgreSQL', importance: 'High', minimumLevel: 'Intermediate', weight: 8, category: 'Database' },
      { name: 'REST APIs & WebSockets', importance: 'High', minimumLevel: 'Intermediate', weight: 7, category: 'Frameworks' },
      { name: 'HTML5 & Tailwind CSS', importance: 'Medium', minimumLevel: 'Intermediate', weight: 6, category: 'Frameworks' },
      { name: 'Docker Basics', importance: 'Medium', minimumLevel: 'Beginner', weight: 5, category: 'Cloud & DevOps' },
      { name: 'Data Structures Basics', importance: 'Medium', minimumLevel: 'Intermediate', weight: 6, category: 'Core CS' },
    ],
  },
  {
    roleName: 'Data Scientist & AI/ML Engineer',
    category: 'Artificial Intelligence & Data',
    tier: 'Tier 1 (Product / FAANG)',
    averageCtcLpa: { min: 12, max: 28 },
    minCgpa: 7.5,
    maxBacklogsAllowed: 0,
    description: 'Build intelligent models, analyze high-dimensional datasets, and deploy machine learning pipelines.',
    topCompaniesHiring: ['NVIDIA', 'Walmart Labs', 'Fractal Analytics', 'Microsoft', 'Tiger Analytics'],
    interviewRounds: ['Data Manipulation & Python Test', 'Machine Learning Algorithms & Math/Stats', 'Deep Learning & LLM Project Discussion', 'HR Round'],
    requiredSkills: [
      { name: 'Python', importance: 'Critical', minimumLevel: 'Advanced', weight: 10, category: 'Programming' },
      { name: 'Machine Learning (Scikit-Learn)', importance: 'Critical', minimumLevel: 'Advanced', weight: 9, category: 'Frameworks' },
      { name: 'Probability & Linear Algebra', importance: 'High', minimumLevel: 'Intermediate', weight: 8, category: 'Core CS' },
      { name: 'Pandas & NumPy', importance: 'High', minimumLevel: 'Advanced', weight: 8, category: 'Frameworks' },
      { name: 'SQL & Data Warehousing', importance: 'High', minimumLevel: 'Intermediate', weight: 7, category: 'Database' },
      { name: 'Deep Learning (PyTorch / TensorFlow)', importance: 'High', minimumLevel: 'Intermediate', weight: 8, category: 'Frameworks' },
      { name: 'Model Deployment (FastAPI / Docker)', importance: 'Medium', minimumLevel: 'Beginner', weight: 6, category: 'Cloud & DevOps' },
    ],
  },
  {
    roleName: 'Cloud & DevOps Engineer',
    category: 'Infrastructure & Cloud',
    tier: 'Tier 2 (Mid-Product / Fintech)',
    averageCtcLpa: { min: 8, max: 18 },
    minCgpa: 6.8,
    maxBacklogsAllowed: 0,
    description: 'Automate CI/CD delivery pipelines, manage container orchestration, and ensure cloud infrastructure reliability.',
    topCompaniesHiring: ['Red Hat', 'Cisco', 'Wipro Digital', 'Infosys Cobalt', 'Oracle Cloud'],
    interviewRounds: ['Linux & Shell Scripting Test', 'Docker & Kubernetes Hands-on', 'CI/CD Pipeline Design', 'HR'],
    requiredSkills: [
      { name: 'Linux & Bash Scripting', importance: 'Critical', minimumLevel: 'Advanced', weight: 10, category: 'Core CS' },
      { name: 'Docker & Containers', importance: 'Critical', minimumLevel: 'Advanced', weight: 9, category: 'Cloud & DevOps' },
      { name: 'Kubernetes Orchestration', importance: 'High', minimumLevel: 'Intermediate', weight: 8, category: 'Cloud & DevOps' },
      { name: 'AWS / Azure Fundamentals', importance: 'High', minimumLevel: 'Intermediate', weight: 8, category: 'Cloud & DevOps' },
      { name: 'CI/CD (GitHub Actions / Jenkins)', importance: 'High', minimumLevel: 'Intermediate', weight: 7, category: 'Tools' },
      { name: 'Networking & Security', importance: 'Medium', minimumLevel: 'Intermediate', weight: 6, category: 'Core CS' },
    ],
  },
];

const seedAssessments = [
  {
    title: 'Data Structures & Algorithms Core Challenge',
    category: 'DSA',
    targetRole: 'Software Development Engineer (SDE)',
    timeLimitMinutes: 15,
    questions: [
      {
        questionText: 'What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?',
        options: ['O(log N)', 'O(N)', 'O(1)', 'O(N log N)'],
        correctOptionIndex: 1,
        explanation: 'In the worst case, an unbalanced BST degenerates into a linear linked list where height is N, giving O(N) search time.',
        category: 'DSA',
        difficulty: 'Easy',
        skillTag: 'Data Structures & Algorithms',
      },
      {
        questionText: 'Which data structure is primarily utilized to implement Breadth-First Search (BFS) on graphs?',
        options: ['Stack', 'Priority Queue', 'Queue', 'Hash Map'],
        correctOptionIndex: 2,
        explanation: 'BFS explores vertices level by level, maintaining FIFO (First In First Out) ordering via a standard Queue.',
        category: 'DSA',
        difficulty: 'Easy',
        skillTag: 'Data Structures & Algorithms',
      },
      {
        questionText: 'Given an array of integers, which approach gives O(N) time and O(N) auxiliary space to find two numbers that sum to a target?',
        options: ['Two nested loops', 'Hash Map to store seen complements', 'QuickSort followed by binary search', 'Heap Sort'],
        correctOptionIndex: 1,
        explanation: 'Using a Hash Map (Two Sum approach) allows checking if complement (target - x) exists in O(1) average lookup, yielding O(N) total time.',
        category: 'DSA',
        difficulty: 'Medium',
        skillTag: 'Data Structures & Algorithms',
      },
      {
        questionText: 'What is the amortized time complexity of inserting into a dynamic array (like std::vector or ArrayList)?',
        options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
        correctOptionIndex: 0,
        explanation: 'Although array resizing takes O(N), resizing doubles the capacity infrequently, averaging out to O(1) amortized per insert.',
        category: 'DSA',
        difficulty: 'Medium',
        skillTag: 'Data Structures & Algorithms',
      },
    ],
  },
  {
    title: 'Full Stack & Web Architecture Assessment',
    category: 'Web Development',
    targetRole: 'Full Stack Web Developer',
    timeLimitMinutes: 15,
    questions: [
      {
        questionText: 'In React, what is the primary benefit of the Virtual DOM (VDOM)?',
        options: [
          'It completely bypasses browser rendering engine',
          'It batches DOM updates and minimizes expensive real-DOM layout recalculations via diffing',
          'It stores component states permanently in local storage',
          'It compiles JavaScript into WebAssembly'
        ],
        correctOptionIndex: 1,
        explanation: 'React compares the Virtual DOM with the previous snapshot (reconciliation) and updates only the altered DOM nodes in batches.',
        category: 'Web Development',
        difficulty: 'Medium',
        skillTag: 'React.js',
      },
      {
        questionText: 'In Node.js Express, which middleware executes first in this sequence: app.use(auth), app.use(logger), router.get(...) ?',
        options: ['router.get', 'logger', 'auth', 'Random execution based on event loop'],
        correctOptionIndex: 2,
        explanation: 'Express executes middleware sequentially in the order they are registered with app.use(). Therefore auth executes first.',
        category: 'Web Development',
        difficulty: 'Easy',
        skillTag: 'Node.js & Express',
      },
      {
        questionText: 'Which HTTP method should be idempotent according to REST specifications?',
        options: ['POST', 'PATCH', 'PUT', 'CONNECT'],
        correctOptionIndex: 2,
        explanation: 'PUT replaces the resource state and yields the same outcome regardless of how many identical requests are sent, making it idempotent.',
        category: 'Web Development',
        difficulty: 'Medium',
        skillTag: 'REST APIs & WebSockets',
      },
      {
        questionText: 'In MongoDB, which index structure is used by default on the _id field?',
        options: ['Hash Index', 'B-Tree Index', 'LSM-Tree', 'Bitmap Index'],
        correctOptionIndex: 1,
        explanation: 'WiredTiger engine in MongoDB employs B-Tree indexes by default for fast range queries and point lookups on _id.',
        category: 'Web Development',
        difficulty: 'Medium',
        skillTag: 'MongoDB / PostgreSQL',
      },
    ],
  },
  {
    title: 'Operating Systems & Database Fundamentals',
    category: 'Core CS (OS & DBMS)',
    targetRole: 'Software Development Engineer (SDE)',
    timeLimitMinutes: 15,
    questions: [
      {
        questionText: 'Which of the following is NOT one of the 4 Coffman conditions required for a Deadlock to occur?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
        correctOptionIndex: 2,
        explanation: 'For a deadlock to occur, resources must have NO preemption. If preemption is allowed, deadlock cannot form.',
        category: 'Core CS (OS & DBMS)',
        difficulty: 'Medium',
        skillTag: 'Operating Systems & Concurrency',
      },
      {
        questionText: 'What does the "I" stand for in the ACID properties of relational databases?',
        options: ['Integrity', 'Isolation', 'Indexing', 'Idempotency'],
        correctOptionIndex: 1,
        explanation: 'Isolation ensures concurrent transactions execute without interfering with one another, preventing dirty reads or phantom reads.',
        category: 'Core CS (OS & DBMS)',
        difficulty: 'Easy',
        skillTag: 'DBMS & SQL',
      },
      {
        questionText: 'Which page replacement algorithm suffers from Belady’s Anomaly?',
        options: ['LRU (Least Recently Used)', 'Optimal Replacement', 'FIFO (First-In, First-Out)', 'LFU (Least Frequently Used)'],
        correctOptionIndex: 2,
        explanation: 'FIFO suffers from Beladys anomaly where increasing the number of page frames can paradoxically increase page faults.',
        category: 'Core CS (OS & DBMS)',
        difficulty: 'Hard',
        skillTag: 'Operating Systems & Concurrency',
      },
    ],
  },
];

const seedDrives = [
  {
    companyName: 'Google',
    role: 'Software Development Engineer (SDE-1)',
    ctcLpa: 34.0,
    driveDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    location: 'Bangalore / Hyderabad / Hybrid',
    jobDescription: 'Seeking high-potential computer science graduates with deep passion for distributed computing, algorithmic problem solving, and large-scale software design.',
    criteria: {
      minCgpa: 8.0,
      maxBacklogs: 0,
      allowedBranches: ['CSE', 'IT', 'AI & DS'],
      requiredSkills: ['Data Structures & Algorithms', 'Java / C++', 'Operating Systems & Concurrency'],
    },
    status: 'Registration Open',
  },
  {
    companyName: 'Microsoft',
    role: 'Software Engineer',
    ctcLpa: 28.5,
    driveDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    location: 'Hyderabad / Noida',
    jobDescription: 'Build next-generation enterprise productivity software and Azure cloud services with world-class engineering teams.',
    criteria: {
      minCgpa: 7.5,
      maxBacklogs: 0,
      allowedBranches: ['CSE', 'IT', 'AI & DS', 'ECE'],
      requiredSkills: ['Data Structures & Algorithms', 'Object Oriented Design (LLD)', 'DBMS & SQL'],
    },
    status: 'Upcoming',
  },
  {
    companyName: 'Razorpay',
    role: 'Full Stack Engineer - Fintech',
    ctcLpa: 19.0,
    driveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    location: 'Bangalore',
    jobDescription: 'Architect resilient payment gateways and developer APIs powering billions of transactions across India.',
    criteria: {
      minCgpa: 7.0,
      maxBacklogs: 0,
      allowedBranches: ['CSE', 'IT', 'AI & DS', 'ECE'],
      requiredSkills: ['React.js', 'Node.js & Express', 'MongoDB / PostgreSQL'],
    },
    status: 'Registration Open',
  },
  {
    companyName: 'Oracle Cloud Infrastructure',
    role: 'Cloud Development Engineer',
    ctcLpa: 17.5,
    driveDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    location: 'Bangalore / Pune',
    jobDescription: 'Work on cutting-edge high-performance cloud virtualization, network telemetry, and storage orchestration systems.',
    criteria: {
      minCgpa: 7.2,
      maxBacklogs: 0,
      allowedBranches: ['CSE', 'IT', 'AI & DS', 'ECE'],
      requiredSkills: ['Linux & Bash Scripting', 'Docker & Containers', 'Java / C++'],
    },
    status: 'Upcoming',
  },
  {
    companyName: 'TCS Digital',
    role: 'System Engineer & Digital Cadre',
    ctcLpa: 7.5,
    driveDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    location: 'PAN India',
    jobDescription: 'Campus premier placement drive for digital applications, enterprise web development, and cloud transformation.',
    criteria: {
      minCgpa: 6.5,
      maxBacklogs: 1,
      allowedBranches: ['CSE', 'IT', 'AI & DS', 'ECE', 'EEE', 'MECH'],
      requiredSkills: ['JavaScript / TypeScript', 'DBMS & SQL'],
    },
    status: 'Registration Open',
  },
];

async function seedDatabase() {
  console.log('Seeding initial database records...');

  // Clear existing records
  await User.deleteMany({});
  await Student.deleteMany({});
  await JobRole.deleteMany({});
  await Drive.deleteMany({});
  await Assessment.deleteMany({});

  // Seed Job Roles
  const roles = await JobRole.insertMany(seedJobRoles);
  console.log(` Created ${roles.length} Job Roles`);

  // Seed Assessments
  const assessments = await Assessment.insertMany(seedAssessments);
  console.log(` Created ${assessments.length} Mock Assessments`);

  // Seed Drives
  const drives = await Drive.insertMany(seedDrives);
  console.log(` Created ${drives.length} Campus Placement Drives`);

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create TPO Officer Account
  const tpoUser = await User.create({
    name: 'Dr. Rajesh Sharma (TPO Head)',
    email: 'tpo@campus.edu',
    password: hashedPassword,
    role: 'tpo',
  });
  console.log(` Created TPO user: ${tpoUser.email}`);

  // Create Primary Demo Student
  const demoStudentUser = await User.create({
    name: 'Alex Rivera',
    email: 'student@campus.edu',
    password: hashedPassword,
    role: 'student',
  });

  const demoStudent = await Student.create({
    user: demoStudentUser._id,
    name: 'Alex Rivera',
    email: 'student@campus.edu',
    rollNo: '22CS1045',
    department: 'CSE',
    batch: '2026',
    cgpa: 8.4,
    backlogs: 0,
    targetRole: 'Software Development Engineer (SDE)',
    technicalSkills: [
      { name: 'Java / C++', category: 'Programming', level: 'Advanced', score: 85, verified: true },
      { name: 'Data Structures & Algorithms', category: 'Core CS', level: 'Intermediate', score: 72, verified: true },
      { name: 'DBMS & SQL', category: 'Database', level: 'Intermediate', score: 78, verified: false },
      { name: 'Git & GitHub', category: 'Tools', level: 'Intermediate', score: 80, verified: true },
      { name: 'JavaScript / TypeScript', category: 'Programming', level: 'Intermediate', score: 75, verified: false },
      { name: 'React.js', category: 'Frameworks', level: 'Intermediate', score: 70, verified: false },
    ],
    softSkills: ['Problem Solving', 'Team Collaboration', 'Technical Communication', 'Adaptability'],
    projects: [
      {
        title: 'Distributed Task Queue System',
        techStack: ['Node.js', 'Redis', 'Docker', 'PostgreSQL'],
        description: 'Scalable background job worker supporting rate-limiting and automatic retries.',
        githubUrl: 'https://github.com/example/task-queue',
      },
      {
        title: 'Algorithmic Visualizer Suite',
        techStack: ['React.js', 'TypeScript', 'Tailwind CSS'],
        description: 'Interactive visualization tool for pathfinding and graph traversal algorithms.',
        githubUrl: 'https://github.com/example/algo-visualizer',
      },
    ],
    assessmentScores: [
      { topic: 'DSA Core Challenge', score: 3, total: 4, percentage: 75, date: new Date() },
    ],
    readinessScore: 78,
    appliedDrives: [
      { drive: drives[0]._id, status: 'Applied' },
      { drive: drives[2]._id, status: 'Shortlisted' },
    ],
    githubProfile: 'https://github.com/alexrivera-dev',
    leetcodeProfile: 'https://leetcode.com/alexrivera',
  });

  demoStudentUser.studentProfile = demoStudent._id;
  await demoStudentUser.save();

  // Create Cohort of 16 students for TPO Analytics
  const sampleDepartments = ['CSE', 'IT', 'AI & DS', 'ECE', 'CSE', 'IT'];
  const sampleRoles = [
    'Software Development Engineer (SDE)',
    'Full Stack Web Developer',
    'Data Scientist & AI/ML Engineer',
    'Cloud & DevOps Engineer',
  ];
  const sampleNames = [
    'Priya Nair', 'Rohan Verma', 'Ananya Gupta', 'Karthik Raman',
    'Sneha Patil', 'Dev Patel', 'Meera Iyer', 'Arjun Reddy',
    'Tanvi Deshmukh', 'Vikram Singh', 'Pooja Hegde', 'Nikhil Joshi',
    'Bhavana Joshi', 'Siddharth Rao', 'Deepika Sen', 'Farhan Ali',
  ];

  for (let i = 0; i < sampleNames.length; i++) {
    const cgpa = Number((6.8 + Math.random() * 2.8).toFixed(1));
    const backlogs = Math.random() < 0.85 ? 0 : 1;
    const readiness = Math.round(50 + Math.random() * 45);
    const dept = sampleDepartments[i % sampleDepartments.length];
    const roleChoice = sampleRoles[i % sampleRoles.length];

    const studentRecord = await Student.create({
      name: sampleNames[i],
      email: `${sampleNames[i].toLowerCase().replace(' ', '.')}@campus.edu`,
      rollNo: `22${dept.replace(/[^A-Z]/g, '')}${1000 + i + 1}`,
      department: dept,
      batch: '2026',
      cgpa,
      backlogs,
      targetRole: roleChoice,
      readinessScore: readiness,
      technicalSkills: [
        { name: 'JavaScript / TypeScript', level: 'Intermediate', score: 65 + (i % 25), category: 'Programming' },
        { name: 'Data Structures & Algorithms', level: readiness > 75 ? 'Advanced' : 'Beginner', score: readiness, category: 'Core CS' },
        { name: 'DBMS & SQL', level: 'Intermediate', score: 70, category: 'Database' },
      ],
      softSkills: ['Communication', 'Teamwork'],
      projects: [{ title: 'Campus Capstone Project', techStack: ['React', 'Node.js'] }],
      appliedDrives: [{ drive: drives[i % drives.length]._id, status: readiness > 75 ? 'Shortlisted' : 'Registered' }],
    });

    // Register into drive
    drives[i % drives.length].registeredStudents.push({
      student: studentRecord._id,
      status: readiness > 75 ? 'Shortlisted' : 'Registered',
      matchScore: readiness,
    });
  }

  for (const drive of drives) {
    await drive.save();
  }

  console.log(` Seeded 16 students for cohort and TPO analytics.`);
  console.log(' Database seeding finished successfully!');
}

module.exports = seedDatabase;
