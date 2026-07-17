import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, BookOpen, Code, Globe, Play, ExternalLink, Bookmark, BookmarkCheck,
  Star, Clock, ChevronRight, Filter, Grid, List, Flame, TrendingUp,
  Sparkles, Award, Shield, Share2, Flag, Plus, X, ChevronDown, ChevronUp,
  Zap, Brain, Database, Server, Cpu, Terminal, Layout, Layers, GitBranch,
  Cloud, Lock, Monitor, Smartphone, BarChart2, FileText, Video, Headphones,
  GraduationCap, Trophy, Target, Users, RefreshCw, AlertCircle, Check,
  RotateCcw, Home, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion as m } from 'framer-motion';

// ─── DATA LAYER ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', label: 'All Resources', icon: Home },
  { id: 'cwh', label: 'CodeWithHarry', icon: Star },
  { id: 'prog', label: 'Programming', icon: Code },
  { id: 'dsa', label: 'DSA', icon: Target },
  { id: 'webdev', label: 'Web Dev', icon: Globe },
  { id: 'mobile', label: 'Mobile Dev', icon: Smartphone },
  { id: 'db', label: 'Databases', icon: Database },
  { id: 'ai', label: 'AI / ML', icon: Brain },
  { id: 'ds', label: 'Data Science', icon: BarChart2 },
  { id: 'cyber', label: 'Cyber Security', icon: Lock },
  { id: 'cloud', label: 'Cloud & DevOps', icon: Cloud },
  { id: 'git', label: 'Git & GitHub', icon: GitBranch },
  { id: 'system', label: 'System Design', icon: Layers },
  { id: 'os', label: 'OS / DBMS / CN', icon: Monitor },
  { id: 'interview', label: 'Interview Prep', icon: Trophy },
  { id: 'practice', label: 'Practice Platforms', icon: Terminal },
  { id: 'courses', label: 'Free Courses', icon: GraduationCap },
  { id: 'pyq', label: 'PYQs & Notes', icon: FileText },
  { id: 'videos', label: 'Video Tutorials', icon: Video },
  { id: 'cheatsheet', label: 'Cheat Sheets', icon: Zap },
];

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SOURCES = ['All Sources', 'Official Docs', 'Free Courses', 'Practice', 'Video Tutorials', 'Notes & PDFs'];

const TAG_COLORS = {
  'C': 'bg-blue-900/40 text-blue-300 border-blue-700/30',
  'C++': 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30',
  'Java': 'bg-orange-900/40 text-orange-300 border-orange-700/30',
  'Python': 'bg-yellow-900/40 text-yellow-300 border-yellow-700/30',
  'JavaScript': 'bg-yellow-800/40 text-yellow-200 border-yellow-600/30',
  'TypeScript': 'bg-blue-900/40 text-blue-300 border-blue-700/30',
  'React': 'bg-cyan-900/40 text-cyan-300 border-cyan-700/30',
  'Node.js': 'bg-green-900/40 text-green-300 border-green-700/30',
  'Express': 'bg-slate-700/50 text-slate-300 border-slate-600/30',
  'MongoDB': 'bg-emerald-900/40 text-emerald-300 border-emerald-700/30',
  'SQL': 'bg-blue-900/40 text-blue-300 border-blue-700/30',
  'HTML': 'bg-orange-900/40 text-orange-300 border-orange-700/30',
  'CSS': 'bg-blue-900/40 text-blue-300 border-blue-700/30',
  'DSA': 'bg-violet-900/40 text-violet-300 border-violet-700/30',
  'AI': 'bg-pink-900/40 text-pink-300 border-pink-700/30',
  'ML': 'bg-rose-900/40 text-rose-300 border-rose-700/30',
  'Git': 'bg-orange-900/40 text-orange-300 border-orange-700/30',
  'Docker': 'bg-blue-900/40 text-blue-300 border-blue-700/30',
  'K8s': 'bg-blue-900/40 text-blue-300 border-blue-700/30',
  'Linux': 'bg-yellow-900/40 text-yellow-300 border-yellow-700/30',
  'default': 'bg-slate-800/40 text-slate-300 border-slate-600/30',
};

const getTagColor = (tag) => TAG_COLORS[tag] || TAG_COLORS['default'];

const SOURCE_BADGE = {
  official: { label: 'Official', color: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/30' },
  free: { label: 'Free', color: 'bg-violet-900/40 text-violet-300 border-violet-700/30' },
  practice: { label: 'Practice', color: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/30' },
  video: { label: 'Video', color: 'bg-rose-900/40 text-rose-300 border-rose-700/30' },
  course: { label: 'Course', color: 'bg-amber-900/40 text-amber-300 border-amber-700/30' },
  community: { label: 'Community', color: 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' },
};

const ALL_RESOURCES = [
  // ─── CodeWithHarry ───────────────────────────────────────────────────────
  {
    id: 'cwh-c', category: 'cwh', title: 'C Language – Complete Notes by CodeWithHarry',
    description: 'Comprehensive C programming notes covering basics, pointers, memory management, file handling, and more. Written by Harry Bhai for quick, easy reference.',
    tags: ['C'], difficulty: 'Beginner', time: '6h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/c-language',
    trending: true, rating: 4.9, ratingCount: 12800, featured: true,
  },
  {
    id: 'cwh-cpp', category: 'cwh', title: 'C++ Notes – CodeWithHarry',
    description: 'Handwritten-style C++ notes covering OOP, STL, templates, smart pointers, and competitive programming essentials.',
    tags: ['C++'], difficulty: 'Intermediate', time: '8h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/cpp',
    trending: true, rating: 4.8, ratingCount: 10200, featured: true,
  },
  {
    id: 'cwh-java', category: 'cwh', title: 'Java Notes – CodeWithHarry',
    description: 'Detailed Java notes covering OOP concepts, Collections, Generics, Multithreading, Exception Handling and Java 8+ features.',
    tags: ['Java'], difficulty: 'Intermediate', time: '10h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/java',
    rating: 4.8, ratingCount: 9400, featured: true,
  },
  {
    id: 'cwh-python', category: 'cwh', title: 'Python Notes – CodeWithHarry',
    description: 'Crisp Python notes covering syntax, OOP, functional programming, file I/O, libraries (NumPy, Pandas), and Django basics.',
    tags: ['Python'], difficulty: 'Beginner', time: '7h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/python',
    trending: true, rating: 4.9, ratingCount: 15600, featured: true,
  },
  {
    id: 'cwh-html', category: 'cwh', title: 'HTML Notes – CodeWithHarry',
    description: 'Complete HTML5 quick-reference notes with semantic tags, forms, tables, media elements, accessibility attributes and cheat sheets.',
    tags: ['HTML'], difficulty: 'Beginner', time: '3h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/html',
    rating: 4.8, ratingCount: 7800,
  },
  {
    id: 'cwh-css', category: 'cwh', title: 'CSS Notes – CodeWithHarry',
    description: 'Covers selectors, box model, Flexbox, Grid, animations, responsive design, and CSS variables with clean examples.',
    tags: ['CSS'], difficulty: 'Beginner', time: '4h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/css',
    rating: 4.7, ratingCount: 6900,
  },
  {
    id: 'cwh-js', category: 'cwh', title: 'JavaScript Notes – CodeWithHarry',
    description: 'Modern JS notes covering ES6+, closures, promises, async/await, DOM manipulation, event loop, and prototype chain.',
    tags: ['JavaScript'], difficulty: 'Intermediate', time: '8h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/javascript',
    trending: true, rating: 4.9, ratingCount: 13200, featured: true,
  },
  {
    id: 'cwh-react', category: 'cwh', title: 'React Notes – CodeWithHarry',
    description: 'React notes covering JSX, hooks (useState, useEffect, useContext, useReducer), React Router, Redux and project patterns.',
    tags: ['React'], difficulty: 'Intermediate', time: '9h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/react',
    rating: 4.8, ratingCount: 8700,
  },
  {
    id: 'cwh-node', category: 'cwh', title: 'Node.js Notes – CodeWithHarry',
    description: 'Node.js fundamentals: event loop, streams, file system, Express.js REST APIs, middleware, authentication, and deployment.',
    tags: ['Node.js'], difficulty: 'Intermediate', time: '7h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/nodejs',
    rating: 4.7, ratingCount: 6200,
  },
  {
    id: 'cwh-sql', category: 'cwh', title: 'SQL Notes – CodeWithHarry',
    description: 'Complete SQL notes covering DDL, DML, DCL, joins, subqueries, transactions, stored procedures, and triggers.',
    tags: ['SQL'], difficulty: 'Beginner', time: '5h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/sql',
    rating: 4.8, ratingCount: 7400,
  },
  {
    id: 'cwh-mongo', category: 'cwh', title: 'MongoDB Notes – CodeWithHarry',
    description: 'MongoDB notes covering CRUD, aggregation pipelines, indexes, schema design, Mongoose ODM, and Atlas deployment.',
    tags: ['MongoDB'], difficulty: 'Intermediate', time: '5h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/mongodb',
    rating: 4.7, ratingCount: 5400,
  },
  {
    id: 'cwh-dsa', category: 'cwh', title: 'DSA Notes – CodeWithHarry',
    description: 'Data Structures & Algorithms notes covering arrays, linked lists, stacks, queues, trees, graphs, sorting, searching and dynamic programming.',
    tags: ['DSA', 'C++'], difficulty: 'Intermediate', time: '15h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/data-structures-algorithms',
    trending: true, rating: 4.9, ratingCount: 16800, featured: true,
  },
  {
    id: 'cwh-webdev', category: 'cwh', title: 'Complete Web Dev Course – CodeWithHarry',
    description: 'Mega beginner-to-advanced web development guide covering HTML, CSS, JavaScript, React, Node.js, MongoDB and deployment.',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'], difficulty: 'Beginner', time: '30h course', source: 'video',
    provider: 'CodeWithHarry', url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w',
    trending: true, rating: 4.9, ratingCount: 22400, featured: true,
  },
  {
    id: 'cwh-interview', category: 'cwh', title: 'Interview Preparation – CodeWithHarry',
    description: 'Interview prep notes covering coding questions, HR questions, resume tips, and common patterns across top companies.',
    tags: ['DSA'], difficulty: 'Advanced', time: '12h read', source: 'official',
    provider: 'CodeWithHarry', url: 'https://www.codewithharry.com/notes/interview-preparation',
    rating: 4.8, ratingCount: 9800,
  },

  // ─── Official Docs ─────────────────────────────────────────────────────
  {
    id: 'react-docs', category: 'webdev', title: 'React – Official Documentation',
    description: 'The official React docs with interactive examples, hooks reference, new Server Components, and migration guides from React 17 to 18+.',
    tags: ['React'], difficulty: 'Intermediate', time: 'Reference', source: 'official',
    provider: 'React', url: 'https://react.dev',
    trending: true, rating: 4.9, ratingCount: 28000,
  },
  {
    id: 'mdn-web', category: 'webdev', title: 'MDN Web Docs – Complete Reference',
    description: 'Mozilla\'s authoritative reference for HTML, CSS, JavaScript, Web APIs and browser compatibility. The gold standard for web developers.',
    tags: ['HTML', 'CSS', 'JavaScript'], difficulty: 'All', time: 'Reference', source: 'official',
    provider: 'Mozilla', url: 'https://developer.mozilla.org',
    trending: true, rating: 4.9, ratingCount: 42000, featured: true,
  },
  {
    id: 'w3schools', category: 'webdev', title: 'W3Schools – Web Development Tutorials',
    description: 'Beginner-friendly tutorials, references, and exercises for HTML, CSS, JavaScript, SQL, Python and many more technologies.',
    tags: ['HTML', 'CSS', 'JavaScript'], difficulty: 'Beginner', time: 'Reference', source: 'free',
    provider: 'W3Schools', url: 'https://www.w3schools.com',
    rating: 4.6, ratingCount: 19000,
  },
  {
    id: 'nodejs-docs', category: 'webdev', title: 'Node.js – Official Documentation',
    description: 'Complete API reference for Node.js core modules: fs, http, events, streams, child_process, crypto and more.',
    tags: ['Node.js'], difficulty: 'Intermediate', time: 'Reference', source: 'official',
    provider: 'Node.js', url: 'https://nodejs.org/en/docs',
    rating: 4.8, ratingCount: 11000,
  },
  {
    id: 'express-docs', category: 'webdev', title: 'Express.js – Official Documentation',
    description: 'Official Express framework docs covering routing, middleware, error handling, template engines and production best practices.',
    tags: ['Express', 'Node.js'], difficulty: 'Intermediate', time: 'Reference', source: 'official',
    provider: 'Express', url: 'https://expressjs.com',
    rating: 4.7, ratingCount: 8200,
  },
  {
    id: 'mongodb-docs', category: 'db', title: 'MongoDB – Official Documentation',
    description: 'Complete MongoDB docs covering CRUD operations, aggregation, indexing, Atlas cloud, Mongoose integration, and sharding.',
    tags: ['MongoDB'], difficulty: 'Intermediate', time: 'Reference', source: 'official',
    provider: 'MongoDB', url: 'https://www.mongodb.com/docs',
    rating: 4.7, ratingCount: 7600,
  },
  {
    id: 'postgresql-docs', category: 'db', title: 'PostgreSQL – Official Documentation',
    description: 'Comprehensive docs for PostgreSQL covering SQL dialect, advanced queries, JSONB, stored procedures, and performance tuning.',
    tags: ['SQL'], difficulty: 'Intermediate', time: 'Reference', source: 'official',
    provider: 'PostgreSQL', url: 'https://www.postgresql.org/docs',
    rating: 4.8, ratingCount: 8900,
  },
  {
    id: 'mysql-docs', category: 'db', title: 'MySQL – Official Documentation',
    description: 'MySQL reference manual covering installation, SQL syntax, storage engines, replication, and performance schema.',
    tags: ['SQL'], difficulty: 'Beginner', time: 'Reference', source: 'official',
    provider: 'MySQL', url: 'https://dev.mysql.com/doc',
    rating: 4.6, ratingCount: 7200,
  },
  {
    id: 'python-docs', category: 'prog', title: 'Python – Official Documentation',
    description: 'The official Python language reference, standard library docs, tutorial, and how-to guides for Python 3.x.',
    tags: ['Python'], difficulty: 'Beginner', time: 'Reference', source: 'official',
    provider: 'Python.org', url: 'https://docs.python.org/3',
    trending: true, rating: 4.9, ratingCount: 24000, featured: true,
  },
  {
    id: 'java-docs', category: 'prog', title: 'Java SE – Official Documentation',
    description: 'Oracle\'s official Java SE documentation including API reference, language spec, tutorials and JVM internals.',
    tags: ['Java'], difficulty: 'Intermediate', time: 'Reference', source: 'official',
    provider: 'Oracle', url: 'https://docs.oracle.com/en/java',
    rating: 4.7, ratingCount: 11000,
  },
  {
    id: 'cppreference', category: 'prog', title: 'C++ Reference – cppreference.com',
    description: 'Comprehensive C++ language and standard library reference with examples, portability notes, and feature-level details for every version.',
    tags: ['C++'], difficulty: 'Intermediate', time: 'Reference', source: 'official',
    provider: 'cppreference', url: 'https://en.cppreference.com',
    rating: 4.9, ratingCount: 15000, featured: true,
  },
  {
    id: 'git-docs', category: 'git', title: 'Git – Official Documentation',
    description: 'Official Git reference manual covering every command, branching strategies, rebasing, hooks, and internal object model.',
    tags: ['Git'], difficulty: 'Beginner', time: 'Reference', source: 'official',
    provider: 'Git', url: 'https://git-scm.com/doc',
    rating: 4.8, ratingCount: 12000,
  },
  {
    id: 'docker-docs', category: 'cloud', title: 'Docker – Official Documentation',
    description: 'Complete Docker docs covering Dockerfile best practices, Compose, networking, volumes, Docker Swarm, and container security.',
    tags: ['Docker'], difficulty: 'Intermediate', time: 'Reference', source: 'official',
    provider: 'Docker', url: 'https://docs.docker.com',
    rating: 4.8, ratingCount: 10800,
  },
  {
    id: 'k8s-docs', category: 'cloud', title: 'Kubernetes – Official Documentation',
    description: 'Official K8s docs covering pods, deployments, services, ConfigMaps, Helm charts, and production cluster management.',
    tags: ['K8s'], difficulty: 'Advanced', time: 'Reference', source: 'official',
    provider: 'Kubernetes', url: 'https://kubernetes.io/docs',
    rating: 4.8, ratingCount: 8400,
  },
  {
    id: 'github-docs', category: 'git', title: 'GitHub Docs – Complete Guide',
    description: 'GitHub documentation covering repositories, Actions CI/CD, Copilot, Codespaces, GitHub Pages, and security features.',
    tags: ['Git'], difficulty: 'Beginner', time: 'Reference', source: 'official',
    provider: 'GitHub', url: 'https://docs.github.com',
    rating: 4.8, ratingCount: 9200,
  },
  {
    id: 'github-student', category: 'git', title: 'GitHub Student Developer Pack',
    description: 'Free access to 100+ developer tools, cloud credits, domains, and premium courses for verified students. Includes Copilot, Namecheap, Canva, and more.',
    tags: ['Git'], difficulty: 'Beginner', time: 'Free Pack', source: 'free',
    provider: 'GitHub', url: 'https://education.github.com/pack',
    trending: true, rating: 5.0, ratingCount: 8800, featured: true,
  },

  // ─── Roadmaps ──────────────────────────────────────────────────────────
  {
    id: 'roadmap-sh', category: 'webdev', title: 'Roadmap.sh – Developer Learning Roadmaps',
    description: 'Community-curated, visual roadmaps for Frontend, Backend, DevOps, Android, ML, and 20+ technology paths. Updated yearly with community consensus.',
    tags: ['JavaScript', 'Python', 'DSA'], difficulty: 'All', time: 'Interactive', source: 'community',
    provider: 'Roadmap.sh', url: 'https://roadmap.sh',
    trending: true, rating: 4.9, ratingCount: 32000, featured: true,
  },

  // ─── Free Courses ──────────────────────────────────────────────────────
  {
    id: 'cs50', category: 'courses', title: 'CS50 – Introduction to Computer Science (Harvard)',
    description: 'Harvard\'s legendary intro-to-CS course. Covers C, algorithms, data structures, Python, SQL, JavaScript and web development. Completely free to audit.',
    tags: ['C', 'Python', 'DSA'], difficulty: 'Beginner', time: '11 weeks', source: 'course',
    provider: 'Harvard / edX', url: 'https://cs50.harvard.edu/x',
    trending: true, rating: 5.0, ratingCount: 45000, featured: true,
  },
  {
    id: 'cs50-python', category: 'prog', title: 'CS50\'s Introduction to Programming with Python',
    description: 'Harvard\'s Python-focused course covering functions, conditionals, loops, exceptions, file I/O, libraries, and OOP through hands-on problem sets.',
    tags: ['Python'], difficulty: 'Beginner', time: '10 weeks', source: 'course',
    provider: 'Harvard / edX', url: 'https://cs50.harvard.edu/python',
    rating: 4.9, ratingCount: 22000, featured: true,
  },
  {
    id: 'mit-ocw', category: 'courses', title: 'MIT OpenCourseWare – Computer Science',
    description: 'Free lecture notes, problem sets, and exams from MIT\'s flagship CS courses including 6.006 (Algorithms), 6.824 (Distributed Systems), and 6.830 (Database Systems).',
    tags: ['DSA', 'Python'], difficulty: 'Advanced', time: 'Semester', source: 'course',
    provider: 'MIT', url: 'https://ocw.mit.edu/search/?d=Electrical+Engineering+and+Computer+Science',
    trending: true, rating: 4.9, ratingCount: 18000, featured: true,
  },
  {
    id: 'nptel', category: 'courses', title: 'NPTEL – Online Courses for Engineering Students',
    description: 'Joint initiative by IITs and IISc offering free online courses in CS, Electronics, Civil, Mechanical, and more. Certification available on Swayam portal.',
    tags: ['DSA', 'Python', 'Java'], difficulty: 'Intermediate', time: 'Semester', source: 'course',
    provider: 'NPTEL / IIT', url: 'https://nptel.ac.in',
    trending: true, rating: 4.7, ratingCount: 21000, featured: true,
  },
  {
    id: 'swayam', category: 'courses', title: 'SWAYAM – National Online Education Platform',
    description: 'India\'s government initiative offering university-accredited MOOC courses from top institutions. Earn credits transferable to your degree.',
    tags: ['DSA', 'Python'], difficulty: 'Beginner', time: 'Semester', source: 'course',
    provider: 'SWAYAM', url: 'https://swayam.gov.in',
    rating: 4.5, ratingCount: 14000,
  },
  {
    id: 'khan-academy', category: 'courses', title: 'Khan Academy – Computer Science',
    description: 'Free interactive lessons on computer science fundamentals, algorithms, cryptography, and programming for all ages. No prior experience needed.',
    tags: ['DSA', 'Python'], difficulty: 'Beginner', time: 'Self-paced', source: 'free',
    provider: 'Khan Academy', url: 'https://www.khanacademy.org/computing/computer-science',
    rating: 4.8, ratingCount: 16000,
  },
  {
    id: 'freecodecamp', category: 'courses', title: 'freeCodeCamp – Web Development Certifications',
    description: '6 free certifications covering Responsive Web Design, JS Algorithms, Front End Libraries, Data Viz, APIs, and Quality Assurance. 300 hours each.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Python'], difficulty: 'Beginner', time: 'Self-paced', source: 'free',
    provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org',
    trending: true, rating: 4.8, ratingCount: 29000, featured: true,
  },
  {
    id: 'coursera-free', category: 'courses', title: 'Coursera – Audit Free Courses',
    description: 'Audit thousands of courses for free from top universities (Stanford, Duke, Johns Hopkins). Covers programming, data science, AI, cloud, and business.',
    tags: ['Python', 'AI', 'ML'], difficulty: 'All', time: 'Self-paced', source: 'course',
    provider: 'Coursera', url: 'https://www.coursera.org',
    rating: 4.7, ratingCount: 26000,
  },
  {
    id: 'edx-free', category: 'courses', title: 'edX – Free University Courses',
    description: 'Free online courses from MIT, Harvard, Berkeley, and Microsoft. Audit for free or earn verified certificates in CS, Data Science, AI, and more.',
    tags: ['DSA', 'Python', 'AI'], difficulty: 'All', time: 'Self-paced', source: 'course',
    provider: 'edX', url: 'https://www.edx.org',
    rating: 4.7, ratingCount: 21000,
  },

  // ─── AI & ML ──────────────────────────────────────────────────────────
  {
    id: 'kaggle-learn', category: 'ds', title: 'Kaggle Learn – Micro Courses',
    description: 'Free bite-sized courses on Python, Pandas, ML, Deep Learning, NLP, Data Visualization, and feature engineering directly from Kaggle experts.',
    tags: ['Python', 'ML'], difficulty: 'Beginner', time: 'Self-paced', source: 'free',
    provider: 'Kaggle', url: 'https://www.kaggle.com/learn',
    trending: true, rating: 4.8, ratingCount: 18000, featured: true,
  },
  {
    id: 'huggingface', category: 'ai', title: 'Hugging Face – Free NLP & AI Courses',
    description: 'Hands-on courses on transformers, diffusion models, RL, and NLP. Practice with real models using Datasets, Transformers, and Spaces platforms.',
    tags: ['Python', 'AI', 'ML'], difficulty: 'Intermediate', time: 'Self-paced', source: 'free',
    provider: 'Hugging Face', url: 'https://huggingface.co/learn',
    trending: true, rating: 4.9, ratingCount: 12000, featured: true,
  },
  {
    id: 'google-ai-studio', category: 'ai', title: 'Google AI Studio – Gemini API Playground',
    description: 'Experiment with Google\'s Gemini models for free. Build and test prompts, function calls, multimodal inputs, and get your free API key to start building.',
    tags: ['AI', 'Python'], difficulty: 'Intermediate', time: 'Interactive', source: 'free',
    provider: 'Google', url: 'https://aistudio.google.com',
    rating: 4.8, ratingCount: 8000, featured: true,
  },
  {
    id: 'google-colab', category: 'ds', title: 'Google Colab – Free Jupyter Notebooks',
    description: 'Free cloud-based Jupyter notebook with GPU/TPU access. Perfect for ML experiments, data science projects, and Python learning without local setup.',
    tags: ['Python', 'ML'], difficulty: 'Beginner', time: 'Interactive', source: 'free',
    provider: 'Google', url: 'https://colab.research.google.com',
    trending: true, rating: 4.9, ratingCount: 26000, featured: true,
  },
  {
    id: 'gfg-ml', category: 'ai', title: 'GeeksforGeeks – Machine Learning Tutorial',
    description: 'Comprehensive ML tutorial series covering supervised/unsupervised learning, neural networks, decision trees, SVMs, and hands-on scikit-learn examples.',
    tags: ['Python', 'ML'], difficulty: 'Intermediate', time: '20h read', source: 'free',
    provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/machine-learning',
    rating: 4.6, ratingCount: 14000,
  },

  // ─── DSA ──────────────────────────────────────────────────────────────
  {
    id: 'gfg-dsa', category: 'dsa', title: 'GeeksforGeeks – DSA Tutorial',
    description: 'The most comprehensive DSA tutorial on the web. Covers arrays, linked lists, trees, graphs, dynamic programming, and segment trees with C++/Java/Python implementations.',
    tags: ['DSA', 'C++', 'Java', 'Python'], difficulty: 'All', time: '40h read', source: 'free',
    provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/data-structures',
    trending: true, rating: 4.7, ratingCount: 36000, featured: true,
  },
  {
    id: 'neetcode', category: 'dsa', title: 'NeetCode – DSA Roadmap & Solutions',
    description: 'Curated list of 150 most-asked LeetCode patterns by a Google engineer, with video explanations and optimal solutions in Python.',
    tags: ['DSA', 'Python'], difficulty: 'Intermediate', time: 'Practice', source: 'free',
    provider: 'NeetCode.io', url: 'https://neetcode.io/roadmap',
    trending: true, rating: 4.9, ratingCount: 21000, featured: true,
  },
  {
    id: 'cses', category: 'practice', title: 'CSES Problem Set – Competitive Programming',
    description: 'A high-quality, curated problem set for competitive programmers. 300+ problems covering sorting, graphs, trees, math, and dynamic programming.',
    tags: ['DSA', 'C++'], difficulty: 'Intermediate', time: 'Practice', source: 'practice',
    provider: 'CSES', url: 'https://cses.fi/problemset',
    rating: 4.9, ratingCount: 14000, featured: true,
  },
  {
    id: 'cp-algo', category: 'dsa', title: 'CP-Algorithms – Competitive Programming',
    description: 'High-quality articles on algorithms and data structures for competitive programming, translated from the famous e-maxx.ru Russian CP resource.',
    tags: ['DSA', 'C++'], difficulty: 'Advanced', time: '60h read', source: 'community',
    provider: 'CP-Algorithms', url: 'https://cp-algorithms.com',
    rating: 4.9, ratingCount: 11000,
  },

  // ─── Practice Platforms ────────────────────────────────────────────────
  {
    id: 'leetcode', category: 'practice', title: 'LeetCode – Coding Interview Problems',
    description: 'The #1 platform for coding interview prep with 3000+ problems, company-tagged questions, weekly contests, and a global leaderboard.',
    tags: ['DSA', 'Python', 'C++', 'Java'], difficulty: 'All', time: 'Practice', source: 'practice',
    provider: 'LeetCode', url: 'https://leetcode.com',
    trending: true, rating: 4.8, ratingCount: 52000, featured: true,
  },
  {
    id: 'hackerrank', category: 'practice', title: 'HackerRank – Skills & Certifications',
    description: 'Platform for coding challenges, skill certifications (Python, SQL, Java), and company-specific interview kits for placement preparation.',
    tags: ['DSA', 'Python', 'SQL'], difficulty: 'Beginner', time: 'Practice', source: 'practice',
    provider: 'HackerRank', url: 'https://www.hackerrank.com',
    rating: 4.6, ratingCount: 24000,
  },
  {
    id: 'codechef', category: 'practice', title: 'CodeChef – Competitive Programming',
    description: 'Indian competitive programming platform with monthly long contests, cook-offs, and a rich problem archive for all skill levels.',
    tags: ['DSA', 'C++'], difficulty: 'All', time: 'Practice', source: 'practice',
    provider: 'CodeChef', url: 'https://www.codechef.com',
    rating: 4.5, ratingCount: 18000,
  },
  {
    id: 'codeforces', category: 'practice', title: 'Codeforces – Competitive Programming Contests',
    description: 'The world\'s premier competitive programming contest platform with frequent Div. 1, 2, 3 contests and an enormous archived problem set.',
    tags: ['DSA', 'C++'], difficulty: 'Intermediate', time: 'Practice', source: 'practice',
    provider: 'Codeforces', url: 'https://codeforces.com',
    trending: true, rating: 4.7, ratingCount: 22000, featured: true,
  },
  {
    id: 'atcoder', category: 'practice', title: 'AtCoder – Japanese Contest Platform',
    description: 'High-quality competitive programming problems known for mathematical rigor. Excellent for mastering algorithms and mathematical CS concepts.',
    tags: ['DSA', 'C++'], difficulty: 'Advanced', time: 'Practice', source: 'practice',
    provider: 'AtCoder', url: 'https://atcoder.jp',
    rating: 4.8, ratingCount: 9800,
  },
  {
    id: 'interviewbit', category: 'interview', title: 'InterviewBit – Placement Preparation',
    description: 'Structured interview preparation platform with curated problem tracks, mock interviews, and company-specific preparation guides for product companies.',
    tags: ['DSA', 'C++', 'Java'], difficulty: 'Intermediate', time: 'Practice', source: 'practice',
    provider: 'InterviewBit', url: 'https://www.interviewbit.com',
    trending: true, rating: 4.7, ratingCount: 16000, featured: true,
  },

  // ─── Interview Prep ────────────────────────────────────────────────────
  {
    id: 'gfg-interview', category: 'interview', title: 'GeeksforGeeks – Interview Prep Resources',
    description: 'Company-specific interview experiences, coding questions, HR tips, and placement guides for FAANG, product, and service companies.',
    tags: ['DSA'], difficulty: 'Intermediate', time: 'Reference', source: 'free',
    provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/company-preparation',
    rating: 4.7, ratingCount: 28000,
  },
  {
    id: 'blind75', category: 'interview', title: 'Blind 75 – Must-Know LeetCode Problems',
    description: 'The famous list of 75 curated LeetCode problems that cover every critical coding interview pattern. Essential for FAANG prep.',
    tags: ['DSA', 'Python'], difficulty: 'Intermediate', time: 'Practice', source: 'community',
    provider: 'Community', url: 'https://leetcode.com/discuss/general-discussion/460599',
    trending: true, rating: 4.9, ratingCount: 31000,
  },
  {
    id: 'system-design-primer', category: 'system', title: 'System Design Primer – GitHub',
    description: 'The most starred GitHub repo for system design interview prep. Covers scalability, load balancing, databases, caching, microservices, and real-world designs.',
    tags: ['DSA'], difficulty: 'Advanced', time: '20h read', source: 'community',
    provider: 'GitHub / donnemartin', url: 'https://github.com/donnemartin/system-design-primer',
    trending: true, rating: 4.9, ratingCount: 38000, featured: true,
  },

  // ─── Cheat Sheets ─────────────────────────────────────────────────────
  {
    id: 'cheat-git', category: 'cheatsheet', title: 'Git Cheat Sheet – Official PDF',
    description: 'GitHub\'s official Git command cheat sheet covering init, clone, commit, branch, merge, rebase, and remote operations in a single printable PDF.',
    tags: ['Git'], difficulty: 'Beginner', time: '10 min', source: 'official',
    provider: 'GitHub', url: 'https://education.github.com/git-cheat-sheet-education.pdf',
    rating: 4.9, ratingCount: 14000,
  },
  {
    id: 'cheat-python', category: 'cheatsheet', title: 'Python Cheat Sheet – DataCamp',
    description: 'Comprehensive Python cheat sheets for beginners, NumPy, Pandas, Matplotlib, Scikit-Learn, and more. Clean and print-ready.',
    tags: ['Python'], difficulty: 'Beginner', time: '10 min', source: 'free',
    provider: 'DataCamp', url: 'https://www.datacamp.com/cheat-sheet',
    rating: 4.7, ratingCount: 9200,
  },
  {
    id: 'cheat-regex', category: 'cheatsheet', title: 'RegEx Cheat Sheet – Quick Reference',
    description: 'Complete regular expressions reference with examples for all regex flavors: quantifiers, anchors, groups, lookaheads, and character classes.',
    tags: ['JavaScript', 'Python'], difficulty: 'Intermediate', time: '10 min', source: 'community',
    provider: 'QuickRef.me', url: 'https://quickref.me/regex',
    rating: 4.8, ratingCount: 7800,
  },
  {
    id: 'bigocheat', category: 'cheatsheet', title: 'Big-O Algorithm Complexity Cheat Sheet',
    description: 'Visual reference for time and space complexity of common sorting and searching algorithms, plus data structure operation complexities.',
    tags: ['DSA'], difficulty: 'Beginner', time: '5 min', source: 'community',
    provider: 'bigocheatsheet.com', url: 'https://www.bigocheatsheet.com',
    trending: true, rating: 4.9, ratingCount: 22000,
  },

  // ─── Video Tutorials ──────────────────────────────────────────────────
  {
    id: 'yt-traversy', category: 'videos', title: 'Traversy Media – Web Dev Crash Courses',
    description: 'Brad Traversy\'s industry-respected YouTube channel with free crash courses on React, Node.js, Django, Docker, and many more technologies.',
    tags: ['JavaScript', 'React', 'Node.js'], difficulty: 'Beginner', time: 'Video', source: 'video',
    provider: 'YouTube / Traversy Media', url: 'https://www.youtube.com/@TraversyMedia',
    rating: 4.8, ratingCount: 14000,
  },
  {
    id: 'yt-apna', category: 'videos', title: 'Apna College – DSA Full Course Playlist',
    description: 'Shradha Khapra\'s complete DSA playlist in Java with 200+ videos covering all major data structures and algorithms for placement.',
    tags: ['DSA', 'Java'], difficulty: 'Beginner', time: 'Video Playlist', source: 'video',
    provider: 'YouTube / Apna College', url: 'https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkstJDYO2eF',
    trending: true, rating: 4.9, ratingCount: 19000, featured: true,
  },
  {
    id: 'yt-striver', category: 'dsa', title: 'Striver\'s DSA Sheet – TakeYouForward',
    description: 'The most comprehensive DSA sheet by Raj Vikramaditya (Striver). 191 curated problems covering every interview topic with detailed video explanations.',
    tags: ['DSA', 'C++'], difficulty: 'Intermediate', time: 'Practice', source: 'free',
    provider: 'TakeYouForward', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2',
    trending: true, rating: 5.0, ratingCount: 28000, featured: true,
  },
  {
    id: 'yt-freecodecamp', category: 'videos', title: 'freeCodeCamp – YouTube Full Courses',
    description: 'freeCodeCamp\'s YouTube channel hosts complete free courses on Python, JS, React, ML, SQL, C++, and more — all 8+ hours long and beginner-friendly.',
    tags: ['Python', 'JavaScript', 'React'], difficulty: 'Beginner', time: 'Video', source: 'video',
    provider: 'YouTube / freeCodeCamp', url: 'https://www.youtube.com/@freecodecamp',
    trending: true, rating: 4.9, ratingCount: 24000, featured: true,
  },

  // ─── OS / DBMS / CN ─────────────────────────────────────────────────
  {
    id: 'gfg-os', category: 'os', title: 'GeeksforGeeks – Operating Systems',
    description: 'Detailed OS tutorial covering processes, threads, CPU scheduling, memory management, paging, deadlocks, file systems, and I/O management.',
    tags: ['C'], difficulty: 'Intermediate', time: '15h read', source: 'free',
    provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/operating-systems',
    rating: 4.7, ratingCount: 17000,
  },
  {
    id: 'gfg-dbms', category: 'os', title: 'GeeksforGeeks – DBMS Tutorial',
    description: 'Complete DBMS guide covering ER models, relational algebra, SQL, normalization (1NF to BCNF), transactions, ACID properties, and indexing.',
    tags: ['SQL'], difficulty: 'Intermediate', time: '12h read', source: 'free',
    provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dbms',
    rating: 4.7, ratingCount: 16000,
  },
  {
    id: 'gfg-cn', category: 'os', title: 'GeeksforGeeks – Computer Networks Tutorial',
    description: 'Covers OSI & TCP/IP model, data link layer, routing algorithms, TCP/UDP, HTTP, DNS, security protocols, and network troubleshooting.',
    tags: ['C'], difficulty: 'Intermediate', time: '12h read', source: 'free',
    provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/computer-network-tutorials',
    rating: 4.6, ratingCount: 15000,
  },
  {
    id: 'gfg-oops', category: 'os', title: 'GeeksforGeeks – OOP Concepts',
    description: 'Object-Oriented Programming fundamentals: classes, objects, inheritance, polymorphism, encapsulation, abstraction with Java and C++ examples.',
    tags: ['Java', 'C++'], difficulty: 'Beginner', time: '8h read', source: 'free',
    provider: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java',
    rating: 4.7, ratingCount: 19000,
  },

  // ─── Cybersecurity ────────────────────────────────────────────────────
  {
    id: 'tryhackme', category: 'cyber', title: 'TryHackMe – Hands-On Cybersecurity',
    description: 'Browser-based cybersecurity learning with gamified rooms covering penetration testing, network security, malware analysis, and CTF challenges.',
    tags: ['Linux'], difficulty: 'Beginner', time: 'Self-paced', source: 'free',
    provider: 'TryHackMe', url: 'https://tryhackme.com',
    trending: true, rating: 4.9, ratingCount: 18000, featured: true,
  },
  {
    id: 'hackthebox', category: 'cyber', title: 'Hack The Box – Cybersecurity Platform',
    description: 'Advanced cybersecurity challenges for penetration testers. Practice on real machines, play CTFs, and prepare for OSCP and CEH certifications.',
    tags: ['Linux'], difficulty: 'Advanced', time: 'Practice', source: 'free',
    provider: 'Hack The Box', url: 'https://www.hackthebox.com',
    rating: 4.8, ratingCount: 12000,
  },

  // ─── Cloud ────────────────────────────────────────────────────────────
  {
    id: 'aws-skill', category: 'cloud', title: 'AWS Skill Builder – Free Cloud Courses',
    description: 'Amazon\'s official free learning center with 500+ digital courses on AWS services, cloud architecture, security, and ML with AWS.',
    tags: ['Cloud'], difficulty: 'All', time: 'Self-paced', source: 'free',
    provider: 'AWS', url: 'https://skillbuilder.aws',
    rating: 4.7, ratingCount: 13000,
  },
  {
    id: 'gcp-skill', category: 'cloud', title: 'Google Cloud Skills Boost',
    description: 'Free labs and courses on Google Cloud Platform: Kubernetes, BigQuery, Cloud Run, Vertex AI, and more with hands-on Qwiklabs environment.',
    tags: ['Cloud', 'K8s', 'AI'], difficulty: 'Intermediate', time: 'Self-paced', source: 'free',
    provider: 'Google Cloud', url: 'https://cloudskillsboost.google',
    rating: 4.7, ratingCount: 11000,
  },
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PROVIDER_LOGOS = {
  'CodeWithHarry': '⚡',
  'Mozilla': '🦊',
  'React': '⚛️',
  'W3Schools': '🌐',
  'Node.js': '🟢',
  'Express': '⬛',
  'MongoDB': '🍃',
  'PostgreSQL': '🐘',
  'MySQL': '🐬',
  'Python.org': '🐍',
  'Oracle': '☕',
  'cppreference': '🔵',
  'Git': '🔶',
  'Docker': '🐳',
  'Kubernetes': '⎈',
  'GitHub': '🐱',
  'Roadmap.sh': '🗺️',
  'Harvard / edX': '🎓',
  'MIT': '🔬',
  'NPTEL / IIT': '🏛️',
  'SWAYAM': '🇮🇳',
  'Khan Academy': '📚',
  'freeCodeCamp': '🔥',
  'Coursera': '📋',
  'edX': '🎓',
  'Kaggle': '📊',
  'Hugging Face': '🤗',
  'Google': '🌈',
  'GeeksforGeeks': '🟩',
  'NeetCode.io': '🧩',
  'CSES': '🏁',
  'CP-Algorithms': '⚙️',
  'LeetCode': '🟡',
  'HackerRank': '💚',
  'CodeChef': '👨‍🍳',
  'Codeforces': '🔴',
  'AtCoder': '🔵',
  'InterviewBit': '💼',
  'TakeYouForward': '🎯',
  'YouTube / Traversy Media': '▶️',
  'YouTube / Apna College': '▶️',
  'YouTube / freeCodeCamp': '▶️',
  'GitHub / donnemartin': '⭐',
  'DataCamp': '📊',
  'QuickRef.me': '📋',
  'bigocheatsheet.com': '📈',
  'Community': '👥',
  'TryHackMe': '🔐',
  'Hack The Box': '💀',
  'AWS': '☁️',
  'Google Cloud': '☁️',
};

const DIFF_COLORS = {
  'Beginner': 'bg-emerald-900/40 text-emerald-300 border-emerald-700/30',
  'Intermediate': 'bg-amber-900/40 text-amber-300 border-amber-700/30',
  'Advanced': 'bg-rose-900/40 text-rose-300 border-rose-700/30',
  'All': 'bg-violet-900/40 text-violet-300 border-violet-700/30',
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 },
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const StarRating = ({ rating, count }) => (
  <div className="flex items-center gap-1">
    <div className="flex">
      {[1,2,3,4,5].map(s => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
        />
      ))}
    </div>
    <span className="text-[10px] text-slate-400 font-semibold">{rating.toFixed(1)}</span>
    <span className="text-[10px] text-slate-600">({(count/1000).toFixed(1)}k)</span>
  </div>
);

const TagBadge = ({ tag }) => (
  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${getTagColor(tag)}`}>
    {tag}
  </span>
);

const SourceBadge = ({ source }) => {
  const s = SOURCE_BADGE[source] || SOURCE_BADGE.free;
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${s.color}`}>
      {s.label}
    </span>
  );
};

const DiffBadge = ({ difficulty }) => (
  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${DIFF_COLORS[difficulty] || DIFF_COLORS['All']}`}>
    {difficulty}
  </span>
);

const ResourceCard = ({ resource, isBookmarked, onBookmark, isGrid = true, delay = 0 }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(resource.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark(resource.id);
  };

  const logo = PROVIDER_LOGOS[resource.provider] || '📄';

  if (!isGrid) {
    // List view
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay }}
        className="glass-panel rounded-xl p-4 flex items-center gap-4 glass-card-hover cursor-default"
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-900/80 border border-white/5 shrink-0">
          {logo}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h4 className="font-display font-bold text-sm text-slate-100 line-clamp-1">{resource.title}</h4>
            {resource.trending && <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
            {resource.featured && <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
          </div>
          <p className="text-xs text-slate-400 line-clamp-1">{resource.description}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {resource.tags.slice(0,2).map(t => <TagBadge key={t} tag={t} />)}
            <DiffBadge difficulty={resource.difficulty} />
            <SourceBadge source={resource.source} />
            <StarRating rating={resource.rating} count={resource.ratingCount} />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleBookmark} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-amber-400 transition-all cursor-pointer" title="Bookmark">
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Bookmark className="w-4 h-4" />}
          </button>
          <button onClick={handleShare} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer" title="Copy link">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer">
              Open <ExternalLink className="w-3 h-3" />
            </button>
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="glass-panel rounded-2xl overflow-hidden flex flex-col glass-card-hover cursor-default group"
    >
      {/* Card Banner */}
      <div className="relative h-24 bg-gradient-to-br from-violet-950/60 via-indigo-950/60 to-slate-950/80 flex items-center justify-center border-b border-white/5 overflow-hidden">
        {/* Glowing blob */}
        <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 60% 40%, ${
            resource.category === 'cwh' ? '#7c3aed' :
            resource.category === 'ai' ? '#ec4899' :
            resource.category === 'dsa' ? '#06b6d4' :
            resource.category === 'practice' ? '#f59e0b' :
            resource.category === 'webdev' ? '#10b981' :
            '#6366f1'
          }, transparent 70%)` }}
        />
        <span className="text-5xl z-10 drop-shadow-lg select-none">{logo}</span>
        {resource.trending && (
          <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-700/30 backdrop-blur-sm">
            <Flame className="w-2.5 h-2.5" /> Trending
          </span>
        )}
        {resource.featured && (
          <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-700/30 backdrop-blur-sm">
            <Award className="w-2.5 h-2.5" /> Featured
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 text-left">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <SourceBadge source={resource.source} />
              <DiffBadge difficulty={resource.difficulty} />
            </div>
            <h4 className="font-display font-bold text-sm text-slate-100 leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
              {resource.title}
            </h4>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1 mb-3">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {resource.tags.slice(0, 3).map(t => <TagBadge key={t} tag={t} />)}
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3">
          <span className="flex items-center gap-1 font-semibold">
            <Clock className="w-3 h-3" />{resource.time}
          </span>
          <StarRating rating={resource.rating} count={resource.ratingCount} />
        </div>

        {/* Provider */}
        <div className="text-[10px] text-slate-500 font-semibold mb-4">
          by <span className="text-slate-400">{resource.provider}</span>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-white/5">
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-500/10 cursor-pointer">
              Open Resource <ExternalLink className="w-3 h-3" />
            </button>
          </a>
          <button
            onClick={handleBookmark}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-amber-400 transition-all border border-white/5 cursor-pointer"
            title="Bookmark"
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Bookmark className="w-4 h-4" />}
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-cyan-400 transition-all border border-white/5 cursor-pointer"
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SuggestModal = ({ onClose }) => {
  const [formData, setFormData] = useState({ title: '', url: '', category: '', description: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(onClose, 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-md glass-panel rounded-2xl p-6 border border-violet-500/20 text-left"
        onClick={e => e.stopPropagation()}
      >
        {sent ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
              <Check className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-100">Request Submitted!</h3>
            <p className="text-xs text-slate-400 text-center">Thank you! We'll review and add this resource soon.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-violet-400" /> Suggest a Resource
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: 'Resource Title', key: 'title', placeholder: 'e.g. The Odin Project' },
                { label: 'Resource URL', key: 'url', placeholder: 'https://...' },
                { label: 'Category', key: 'category', placeholder: 'e.g. Web Dev, DSA, AI...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={formData[f.key]}
                    onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                    required
                    className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Why is this useful?</label>
                <textarea
                  placeholder="Brief description of what this resource covers..."
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold transition-all cursor-pointer mt-2">
                Submit Request
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────
const StudyResources = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDiff, setActiveDiff] = useState('All');
  const [activeSource, setActiveSource] = useState('All Sources');
  const [isGrid, setIsGrid] = useState(true);
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studora_res_bookmarks') || '[]'); } catch { return []; }
  });
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studora_res_recent') || '[]'); } catch { return []; }
  });

  const searchRef = useRef(null);

  const handleBookmark = (id) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      localStorage.setItem('studora_res_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const handleOpen = (resource) => {
    setRecentlyViewed(prev => {
      const next = [resource.id, ...prev.filter(r => r !== resource.id)].slice(0, 10);
      localStorage.setItem('studora_res_recent', JSON.stringify(next));
      return next;
    });
  };

  // Filtered resources
  const filtered = useMemo(() => {
    return ALL_RESOURCES.filter(r => {
      const matchCat = activeCategory === 'all' || r.category === activeCategory;
      const matchDiff = activeDiff === 'All' || r.difficulty === activeDiff;
      const matchSource =
        activeSource === 'All Sources' ||
        (activeSource === 'Official Docs' && r.source === 'official') ||
        (activeSource === 'Free Courses' && (r.source === 'free' || r.source === 'course')) ||
        (activeSource === 'Practice' && r.source === 'practice') ||
        (activeSource === 'Video Tutorials' && r.source === 'video') ||
        (activeSource === 'Notes & PDFs' && r.source === 'community');
      const matchSearch = !search || (
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        r.provider.toLowerCase().includes(search.toLowerCase())
      );
      const matchBookmark = !showBookmarksOnly || bookmarks.includes(r.id);
      return matchCat && matchDiff && matchSource && matchSearch && matchBookmark;
    });
  }, [search, activeCategory, activeDiff, activeSource, showBookmarksOnly, bookmarks]);

  const trending = useMemo(() => ALL_RESOURCES.filter(r => r.trending), []);
  const featured = useMemo(() => ALL_RESOURCES.filter(r => r.featured), []);
  const recentItems = useMemo(() => recentlyViewed.map(id => ALL_RESOURCES.find(r => r.id === id)).filter(Boolean), [recentlyViewed]);

  const totalCount = ALL_RESOURCES.length;
  const showingHero = !search && activeCategory === 'all' && activeDiff === 'All' && activeSource === 'All Sources' && !showBookmarksOnly;

  return (
    <div className="flex gap-0 -mx-6 -mt-0 min-h-[calc(100vh-4rem)] relative text-left">

      {/* ─── LEFT SIDEBAR ─────────────────────────────────────────────── */}
      <aside className={`hidden lg:flex flex-col shrink-0 w-56 border-r border-white/5 bg-slate-950/40 overflow-y-auto sticky top-16 max-h-[calc(100vh-4rem)] transition-all duration-300`}>
        <div className="p-3">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2 px-1">Categories</p>
          <nav className="space-y-0.5">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const count = cat.id === 'all' ? totalCount : ALL_RESOURCES.filter(r => r.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    activeCategory === cat.id
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-700/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </span>
                  {count > 0 && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                      activeCategory === cat.id ? 'bg-violet-700/40 text-violet-300' : 'bg-white/5 text-slate-500'
                    }`}>{count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bookmarks quick access */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showBookmarksOnly ? 'bg-amber-600/20 text-amber-300 border border-amber-700/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            My Bookmarks
            <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full ${showBookmarksOnly ? 'bg-amber-700/40 text-amber-300' : 'bg-white/5 text-slate-500'}`}>
              {bookmarks.length}
            </span>
          </button>
        </div>

        {/* Recently Viewed */}
        {recentItems.length > 0 && (
          <div className="p-3 border-t border-white/5">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">Recently Viewed</p>
            <div className="space-y-1">
              {recentItems.slice(0, 5).map(r => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-1 py-1 rounded-lg hover:bg-white/5 text-[10px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  onClick={() => handleOpen(r)}
                >
                  <span className="text-base leading-none">{PROVIDER_LOGOS[r.provider] || '📄'}</span>
                  <span className="truncate">{r.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-x-hidden">

        {/* Sticky Header / Search Bar */}
        <div className="sticky top-16 z-20 bg-[#0b0f19]/90 backdrop-blur-xl border-b border-white/5 px-6 py-3">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                ref={searchRef}
                type="text"
                placeholder={`Search ${totalCount}+ learning resources...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-white/10 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter row */}
            <div className="hidden md:flex items-center gap-2">
              <select
                value={activeDiff}
                onChange={e => setActiveDiff(e.target.value)}
                className="px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={activeSource}
                onChange={e => setActiveSource(e.target.value)}
                className="px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <Filter className="w-4 h-4" />
            </button>

            {/* View toggle */}
            <div className="flex rounded-xl overflow-hidden border border-white/10 bg-slate-950/60">
              <button onClick={() => setIsGrid(true)} className={`p-2 transition-all cursor-pointer ${isGrid ? 'bg-violet-600/30 text-violet-300' : 'text-slate-500 hover:text-slate-300'}`}>
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setIsGrid(false)} className={`p-2 transition-all cursor-pointer ${!isGrid ? 'bg-violet-600/30 text-violet-300' : 'text-slate-500 hover:text-slate-300'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Suggest resource */}
            <button
              onClick={() => setShowSuggest(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600/20 border border-violet-700/30 text-violet-300 text-xs font-bold hover:bg-violet-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Suggest
            </button>
          </div>

          {/* Mobile filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-3 flex flex-wrap gap-2"
              >
                <select value={activeDiff} onChange={e => setActiveDiff(e.target.value)} className="px-3 py-1.5 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer">
                  {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                </select>
                <select value={activeSource} onChange={e => setActiveSource(e.target.value)} className="px-3 py-1.5 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer">
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 py-6 space-y-10">

          {/* ─── HERO SECTION (only on default view) ──────────────────── */}
          {showingHero && (
            <motion.div {...fadeUp} className="relative rounded-2xl overflow-hidden border border-violet-700/20 bg-gradient-to-br from-violet-950/60 via-indigo-950/50 to-slate-950/80 p-8">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-violet-600/20 border border-violet-700/30 text-violet-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Premium Learning Hub
                    </span>
                  </div>
                  <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white leading-tight mb-2">
                    Study Resources Library
                  </h1>
                  <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
                    {totalCount}+ curated, free, and official learning resources from the world's best educators and platforms — organized for engineering students.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4 text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-violet-400" />{totalCount}+ Resources</span>
                    <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" />100% Free to Access</span>
                    <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" />Updated Regularly</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-cyan-400" />Community Curated</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 shrink-0">
                  {[
                    { label: 'Official Docs', count: ALL_RESOURCES.filter(r => r.source === 'official').length, color: 'text-emerald-400', icon: Shield },
                    { label: 'Free Courses', count: ALL_RESOURCES.filter(r => r.source === 'course' || r.source === 'free').length, color: 'text-violet-400', icon: GraduationCap },
                    { label: 'Practice', count: ALL_RESOURCES.filter(r => r.source === 'practice').length, color: 'text-cyan-400', icon: Terminal },
                    { label: 'Video Courses', count: ALL_RESOURCES.filter(r => r.source === 'video').length, color: 'text-rose-400', icon: Video },
                  ].map(stat => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="glass-panel rounded-xl p-3 text-center border border-white/5">
                        <Icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
                        <p className={`font-display font-extrabold text-xl ${stat.color}`}>{stat.count}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── TRENDING SECTION ─────────────────────────────────────── */}
          {showingHero && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" /> Trending Right Now
                </h2>
                <button
                  onClick={() => setSearch('trending')}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
                {trending.slice(0, 8).map((r, i) => (
                  <motion.a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleOpen(r)}
                    className="shrink-0 w-52 glass-panel rounded-xl p-3 flex flex-col gap-2 border border-white/5 hover:border-orange-500/30 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{PROVIDER_LOGOS[r.provider] || '📄'}</span>
                      <span className="flex items-center gap-1 text-[10px] text-orange-400 font-bold">
                        <Flame className="w-3 h-3" /> Trending
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 line-clamp-2 group-hover:text-violet-300 transition-colors leading-snug">{r.title}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {r.tags.slice(0,2).map(t => <TagBadge key={t} tag={t} />)}
                    </div>
                    <StarRating rating={r.rating} count={r.ratingCount} />
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* ─── FEATURED (QUICK ACCESS) ──────────────────────────────── */}
          {showingHero && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Featured Picks
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featured.slice(0, 8).map((r, i) => (
                  <ResourceCard
                    key={r.id}
                    resource={r}
                    isBookmarked={bookmarks.includes(r.id)}
                    onBookmark={handleBookmark}
                    isGrid={true}
                    delay={i * 0.05}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ─── RESULTS / FULL LIBRARY ───────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
                  {showBookmarksOnly
                    ? <><Bookmark className="w-5 h-5 text-amber-400" /> My Bookmarks</>
                    : activeCategory !== 'all'
                    ? <><BookOpen className="w-5 h-5 text-violet-400" /> {CATEGORIES.find(c => c.id === activeCategory)?.label}</>
                    : search
                    ? <><Search className="w-5 h-5 text-violet-400" /> Search Results</>
                    : <><BookOpen className="w-5 h-5 text-violet-400" /> All Resources</>
                  }
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing <span className="text-slate-300 font-semibold">{filtered.length}</span> resources
                  {search && <> for "<span className="text-violet-400">{search}</span>"</>}
                </p>
              </div>
              {(search || activeCategory !== 'all' || activeDiff !== 'All' || activeSource !== 'All Sources' || showBookmarksOnly) && (
                <button
                  onClick={() => { setSearch(''); setActiveCategory('all'); setActiveDiff('All'); setActiveSource('All Sources'); setShowBookmarksOnly(false); }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset filters
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div {...fadeUp} className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-300">No resources found</h3>
                  <p className="text-sm text-slate-500 max-w-sm">Try a different search term or filter. Can't find what you need? Suggest a resource!</p>
                  <button
                    onClick={() => setShowSuggest(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-700/30 text-violet-300 text-sm font-semibold hover:bg-violet-600/30 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Suggest a Resource
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${activeCategory}-${activeDiff}-${activeSource}-${isGrid}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={isGrid
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'space-y-3'
                  }
                >
                  {filtered.map((r, i) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      isBookmarked={bookmarks.includes(r.id)}
                      onBookmark={handleBookmark}
                      isGrid={isGrid}
                      delay={Math.min(i * 0.04, 0.5)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-panel rounded-2xl p-6 border border-violet-700/20 bg-gradient-to-r from-violet-950/40 to-indigo-950/40 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-left">
              <h3 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" /> Know a great resource we missed?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Help the community by suggesting free, trusted educational resources.</p>
            </div>
            <button
              onClick={() => setShowSuggest(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-violet-500/10 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Suggest a Resource
            </button>
          </motion.div>

        </div>
      </main>

      {/* ─── MODALS ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSuggest && <SuggestModal onClose={() => setShowSuggest(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default StudyResources;
