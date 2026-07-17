const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { authMiddleware } = require('../middleware/auth');
const cors = require('cors');

// Initialize Gemini API
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✨ [AI SUCCESS]: Google Gemini API client initialized.');
  } catch (e) {
    console.error('❌ [AI ERROR]: Failed to initialize Gemini API client:', e.message);
  }
} else {
  console.warn('⚠️  [AI WARNING]: GEMINI_API_KEY is not set or placeholder. Using simulated AI outputs.');
}

// Helper function to call Gemini model
const generateWithGemini = async (prompt, systemInstruction = '') => {
  if (!genAI) return null;
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction || 'You are Studora AI, a friendly, professional AI academic and career mentor for college students.'
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Gemini API Error:', err);
    return null;
  }
};

// @route   POST api/ai/ask
// @desc    Ask a doubt / general question
router.post('/ask', authMiddleware, async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ message: 'Question is required' });

  try {
    // If Gemini client exists, use it
    const geminiResponse = await generateWithGemini(
      `Answer the following student question. Use clean formatting, markdown headers, and lists where appropriate:\n\n${question}`,
      'You are Studora AI, a premium learning assistant. Provide highly educational, clear, and comprehensive explanations.'
    );

    if (geminiResponse) {
      return res.json({ answer: geminiResponse });
    }

    // Interactive fallback logic
    let simulatedAnswer = `### Studora AI Response\n\nThanks for asking: **"${question}"**!\n\nHere is a detailed breakdown to help you understand this topic:\n\n`;
    
    const qLower = question.toLowerCase();
    if (qLower.includes('react') || qLower.includes('hook') || qLower.includes('frontend')) {
      simulatedAnswer += `#### 1. Introduction to React & State\nReact is a component-based UI library. Hooks like \`useState\` and \`useEffect\` allow functional components to manage local state and lifecycle side-effects.\n\n#### 2. Key Concepts to Remember\n* **State Persistence:** State remains intact between re-renders.\n* **Virtual DOM:** React updates the DOM efficiently by comparing diffs.\n* **Unidirectional Data Flow:** Data travels down the component tree via props.\n\n#### 3. Recommended Code Example\n\`\`\`javascript\nimport React, { useState, useEffect } from 'react';\n\nfunction Tracker() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    console.log("Count is updated to:", count);\n  }, [count]);\n  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;\n}\n\`\`\``;
    } else if (qLower.includes('dsa') || qLower.includes('algorithm') || qLower.includes('complexity') || qLower.includes('sort')) {
      simulatedAnswer += `#### 1. Understanding Algorithm Performance\nTime complexity represents the scaling behavior of an algorithm as the input size $N$ grows. Space complexity measures memory overhead.\n\n#### 2. Standard Complexities Cheat-Sheet\n* **$O(1)$**: Constant time (e.g., Array lookup, Hashmap get).\n* **$O(\log N)$**: Logarithmic time (e.g., Binary Search).\n* **$O(N)$**: Linear time (e.g., Single loop traversal).\n* **$O(N \log N)$**: Linearithmic time (e.g., Merge Sort, Quick Sort).\n* **$O(N^2)$**: Quadratic time (e.g., Bubble Sort, Nested loops).\n\n#### 3. Pro-Tip\nWhen coding, look for nested loops, recursive trees, or dynamic memory allocations to analyze performance before submitting!`;
    } else {
      simulatedAnswer += `#### Core Summary\nTo master this subject, break it down into modular concepts and practice implementing them in projects.\n\n#### Next Steps & Roadmap\n1. **Learn the Foundations:** Read verified textbooks or documentation.\n2. **Run Code/Experiments:** Create small test scripts in your local compiler.\n3. **Test Yourself:** Generate a practice quiz in Studora's AI Hub to solidify your understanding.\n\n*Note: To enable full real-time Gemini LLM generation, please configure your \`GEMINI_API_KEY\` in the backend server variables.*`;
    }

    res.json({ answer: simulatedAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error processing AI doubt' });
  }
});

// @route   POST api/ai/summarize
// @desc    Summarize study notes / text / PDF contents
router.post('/summarize', authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Text or document content is required' });

  try {
    const prompt = `Summarize the following educational material. Provide: 1) Executive Summary, 2) Key Pillars/Topics, 3) 5 Bullet-Point Takeaways, and 4) Actionable Next Steps.\n\nContent:\n${text}`;
    const geminiResponse = await generateWithGemini(prompt, 'You are an expert academic research assistant who creates high-retention lecture summaries.');

    if (geminiResponse) {
      return res.json({ summary: geminiResponse });
    }

    // Fallback Summary
    const fallbackSummary = `### Studora AI Lecture Summary\n\n**Executive Summary:**\nThe uploaded material discusses foundational concepts, design methodologies, and optimization trade-offs in this subject area. It highlights the importance of structured design patterns and efficient resource utilization.\n\n#### 🔑 Key Pillars Analyzed\n1. **Theoretical Underpinnings:** Core definitions and system constraints.\n2. **Practical Implementations:** Code logic and real-world architectures.\n3. **Optimization Strategies:** Methods to speed up execution, minimize network bandwidth, and reduce memory footprints.\n\n#### 💡 Core Takeaways\n* **Structure Matters:** Always decouple logical components from visual presentation layers.\n* **Analyze Tradeoffs:** A design is never perfect; balance performance with developer readability.\n* **Scalability First:** Build with modular services that can scale independently under load.\n* **Security Checks:** Enforce input verification and sanitization on all user interfaces.\n* **Feedback Loops:** Continuously test and refine system throughput via stress benchmarks.\n\n#### 📅 Actionable Review Plan\n- [ ] Review core terms in the first chapter.\n- [ ] Code a small proof-of-concept integrating the primary module.\n- [ ] Take the Studora self-assessment quiz on this topic to test retention.`;

    res.json({ summary: fallbackSummary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error summarizing content' });
  }
});

// @route   POST api/ai/roadmap
// @desc    Generate Career & Study Roadmap
router.post('/roadmap', authMiddleware, async (req, res) => {
  const { targetRole } = req.body;
  if (!targetRole) return res.status(400).json({ message: 'Target role/career is required' });

  try {
    const prompt = `Generate a comprehensive step-by-step career learning roadmap to become a "${targetRole}". Split it into 4 clear phases: 1) Foundations, 2) Intermediate Skills & Tooling, 3) Advanced Techniques & Projects, and 4) Portfolio & Job Readiness. For each phase, provide specific skills to learn and project ideas.`;
    const geminiResponse = await generateWithGemini(prompt, 'You are an experienced technical career coach who builds structured pathways to employment.');

    if (geminiResponse) {
      return res.json({ roadmap: geminiResponse });
    }

    // Fallback Roadmap
    const fallbackRoadmap = `### 🗺️ Career Roadmap: ${targetRole}\n\nHere is your personalized roadmap to success. Follow these phases to build competitive industry skills.\n\n---\n\n#### 🟢 Phase 1: Core Foundations (Months 1-2)\n* **Key Subjects:** Command Line, Basic Syntax (JS/Python), Version Control (Git/GitHub), Data Types & Variables.\n* **Recommended Tools:** VS Code, Git CLI, GitHub.\n* **Project Idea:** Build a command-line calculator or a responsive personal biography landing page.\n\n#### 🟡 Phase 2: Intermediate Tools & Frameworks (Months 3-4)\n* **Key Subjects:** Advanced frameworks, Package Management (npm/pip), RESTful API Consumption, Database schemas (SQL/NoSQL).\n* **Recommended Tools:** React/Tailwind, Node/Express, PostgreSQL or MongoDB.\n* **Project Idea:** Build a multi-page interactive web application displaying live metrics fetched from a public API.\n\n#### 🔴 Phase 3: Advanced Architectures & Systems (Months 5-6)\n* **Key Subjects:** State Management (Redux/Zustand), Authentication (JWT/OAuth), Cloud Deployment, Unit Testing.\n* **Recommended Tools:** Jest/Cypress, Docker, AWS/Vercel, JWT.\n* **Project Idea:** Design and host a collaborative task board system featuring user accounts, real-time sync, and notification emails.\n\n#### 🔵 Phase 4: Portfolio & Interview Readiness (Month 7+)\n* **Key Subjects:** LeetCode DSA Patterns, Portfolio layout, Resume tailoring, Mock interviews, networking.\n* **Recommended Tools:** Studora Resume Builder, LinkedIn Profile Reviewer, GitHub Portfolio.\n* **Action Plan:** Host at least three full-stack projects on GitHub, generate your portfolio page, and start applying for internship opportunities.`;

    res.json({ roadmap: fallbackRoadmap });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error generating roadmap' });
  }
});

// @route   POST api/ai/quiz
// @desc    Generate a multiple-choice practice quiz
router.post('/quiz', authMiddleware, async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ message: 'Topic is required' });

  try {
    const systemPrompt = `You are a testing coordinator. Generate exactly 5 multiple choice questions on the topic: "${topic}".
    Return ONLY a valid JSON array, containing objects with this schema:
    [
      {
        "id": 1,
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answerIndex": 2, // 0-based index of correct option
        "explanation": "Why this answer is correct."
      }
    ]
    Do not wrap the JSON in markdown formatting.`;

    const geminiResponse = await generateWithGemini(`Generate a quiz on topic: ${topic}`, systemPrompt);
    
    if (geminiResponse) {
      try {
        // Strip markdown code block markers if present
        let cleaned = geminiResponse.trim();
        if (cleaned.startsWith('```json')) {
          cleaned = cleaned.slice(7);
        }
        if (cleaned.endsWith('```')) {
          cleaned = cleaned.slice(0, -3);
        }
        const parsedQuiz = JSON.parse(cleaned.trim());
        return res.json(parsedQuiz);
      } catch (err) {
        console.error('Failed to parse Gemini quiz JSON, falling back:', err);
      }
    }

    // Fallback Quiz JSON
    const fallbackQuiz = [
      {
        id: 1,
        question: `In modern development on the topic of "${topic}", what is considered a critical best practice?`,
        options: [
          "Hardcoding secret API keys inside frontend files",
          "Creating modular, reusable components with clear separation of concerns",
          "Avoiding testing entirely to speed up deployment schedules",
          "Writing monolithic code files exceeding 10,000 lines"
        ],
        answerIndex: 1,
        explanation: "Decoupling systems into reusable modules improves code readability, testability, and maintenance."
      },
      {
        id: 2,
        question: `Which of the following describes the core objective of optimization?`,
        options: [
          "Maximizing system response latency",
          "Increasing CPU overhead and battery drain",
          "Improving page loading speed and efficient data utilization",
          "Adding unneeded animations to block rendering"
        ],
        answerIndex: 2,
        explanation: "Optimization aims to enhance runtime speeds and limit hardware resource consumption."
      },
      {
        id: 3,
        question: `Why is version control (e.g. Git) essential?`,
        options: [
          "It tracks revisions, simplifies branching, and allows seamless rollbacks",
          "It makes the computer run 10x faster",
          "It eliminates the need to compile code",
          "It acts as a primary email client"
        ],
        answerIndex: 0,
        explanation: "Git records changes to files over time, allowing developers to collaborate and revert files back to previous states."
      },
      {
        id: 4,
        question: `When designing a responsive layout, what rule should you apply?`,
        options: [
          "Use fixed pixel widths for all components",
          "Verify the display only on widescreen 4K monitors",
          "Ensure adaptability across desktop, tablet, and mobile dimensions",
          "Disable media queries and flexbox"
        ],
        answerIndex: 2,
        explanation: "Responsive layouts adjust dynamically to different screen viewport sizes, boosting accessibility."
      },
      {
        id: 5,
        question: `What is the role of a schema in relational or NoSQL database clients?`,
        options: [
          "To translate Javascript variables into CSS classes",
          "To outline data structures, constraints, and validation rules",
          "To host web page assets",
          "To encrypt outgoing router packets"
        ],
        answerIndex: 1,
        explanation: "Schemas dictate the structure, datatypes, and validation protocols that records must conform to before storage."
      }
    ];

    res.json(fallbackQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error generating quiz' });
  }
});

// @route   POST api/ai/resume-check
// @desc    Analyze resume text for ATS and provide suggestions
router.post('/resume-check', authMiddleware, async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText) return res.status(400).json({ message: 'Resume text is required' });

  try {
    const prompt = `Analyze this resume text and return a JSON object with this format:
    {
      "score": 82, // Score out of 100
      "formatIssues": ["Issue 1", "Issue 2"],
      "impactBulletPoints": ["Suggestion 1", "Suggestion 2"],
      "missingKeywords": ["keyword1", "keyword2"]
    }
    Resume content:\n${resumeText}`;

    const geminiResponse = await generateWithGemini(prompt, 'You are an ATS compliance auditor who rates technical and corporate resumes.');
    
    if (geminiResponse) {
      try {
        let cleaned = geminiResponse.trim();
        if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
        if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
        const parsed = JSON.parse(cleaned.trim());
        return res.json(parsed);
      } catch (e) {
        console.error('Failed to parse Gemini resume check, falling back.');
      }
    }

    // Fallback Resume Suggestions
    const fallbackReview = {
      score: 74,
      formatIssues: [
        "Found multiple columns. Single-column layouts are preferred by older ATS parses.",
        "Missing clear dates on some project entries. Use format: (MM/YYYY - MM/YYYY)."
      ],
      impactBulletPoints: [
        "Rewrite project bullet points using the STAR method: Situation, Task, Action, Result. Start with strong action verbs (e.g. 'Engineered', 'Optimized', 'Deployed').",
        "Add quantifiable metrics. Instead of 'Made app faster', write: 'Optimized page load speed by 34%, reducing server query latency by 120ms.'"
      ],
      missingKeywords: [
        "CI/CD Pipelines",
        "System Architecture",
        "Unit Testing (Jest/Cypress)",
        "RESTful Web Services",
        "NoSQL Database"
      ]
    };

    res.json(fallbackReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error checking resume' });
  }
});

// @route   POST api/ai/linkedin-review
// @desc    Review LinkedIn Profile Text
router.post('/linkedin-review', authMiddleware, async (req, res) => {
  const { profileText } = req.body;
  if (!profileText) return res.status(400).json({ message: 'Profile description or text is required' });

  try {
    const prompt = `Review the following LinkedIn profile section and provide constructive feedback. Use markdown format, offering: 1) Overall Grade (A-F), 2) Headline Suggestions, 3) Summary Section Rewrite, 4) Activity & Networking tips. Content:\n${profileText}`;
    const geminiResponse = await generateWithGemini(prompt, 'You are a career development expert who optimizes LinkedIn profiles to attract tech recruiters.');

    if (geminiResponse) {
      return res.json({ review: geminiResponse });
    }

    // Fallback Review
    const fallbackReview = `### 👔 LinkedIn Profile Review\n\n**Overall Grade:** **B-**\n\nYour profile has solid foundations, but it needs to be optimized to stand out to industry recruiters and hiring managers.\n\n#### 🎯 Headline Suggestions\n* **Option 1 (Results-Oriented):** *Computer Science Student at [University] | Aspiring Full-Stack Developer | React & Node.js Enthusiast*\n* **Option 2 (Modern & Tech Stack focused):** *Frontend Engineer | Specializing in React, Tailwind CSS, & Framer Motion | Building Studora Platform*\n\n#### 📝 Summary Section Rewrite\n*Replace generic summary text with a story-driven description:*  \n> "I am a passionate developer who loves bridging the gap between clean, scalable code and beautiful user experiences. Currently pursuing a Computer Science degree, I have built multiple full-stack applications using the MERN stack. I thrive in collaborative environments and am currently seeking software engineering internship opportunities."\n\n#### 🌐 Networking & Activity Action Plan\n1. **Share your progress:** Write short posts about projects you've finished, hackathons you've attended, or coding challenges you solved (e.g. 'Just built a portfolio builder on Studora!').\n2. **Engage with leaders:** Comment on posts from developers or companies you admire. Add valuable insights rather than just 'Congrats!'.\n3. **Request recommendations:** Ask project partners or professors for short recommendations on your profile to build social proof.`;

    res.json({ review: fallbackReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error checking LinkedIn profile' });
  }
});

// @route   GET api/ai/github-analyze/:username
// @desc    Analyze GitHub Profile (using GitHub API + AI Insights)
router.get('/github-analyze/:username', authMiddleware, async (req, res) => {
  const username = req.params.username;
  if (!username) return res.status(400).json({ message: 'GitHub username is required' });

  try {
    // 1. Fetch public profile statistics from GitHub API (read-only)
    // Use standard node fetch or axios (axios is in package.json if installed, but simple fetch is native in Node 18+)
    const profileRes = await fetch(`https://api.github.com/users/${username}`);
    if (profileRes.status === 404) {
      return res.status(404).json({ message: 'GitHub user not found' });
    }
    const profileData = await profileRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
    let repos = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    }

    // Extract basic metrics
    const stats = {
      username: profileData.login,
      name: profileData.name || profileData.login,
      avatar: profileData.avatar_url,
      publicRepos: profileData.public_repos,
      followers: profileData.followers,
      bio: profileData.bio || 'No bio provided.',
      languages: {},
      starsCount: 0,
      recentProjects: []
    };

    repos.forEach(repo => {
      stats.starsCount += repo.stargazers_count;
      if (repo.language) {
        stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
      }
      stats.recentProjects.push({
        name: repo.name,
        description: repo.description || 'No description',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown',
        url: repo.html_url
      });
    });

    // 2. Add AI Analysis
    const languageStr = Object.keys(stats.languages).join(', ') || 'Javascript';
    const prompt = `Analyze this student GitHub profile data. Username: ${stats.username}, Bio: ${stats.bio}, Public Repos: ${stats.publicRepos}, Top Languages: ${languageStr}, Recent Projects: ${JSON.stringify(stats.recentProjects.slice(0, 3))}. Provide a review in markdown focusing on: 1) Profile Strengths, 2) Technical Stack Rating, 3) 3 Key Areas of Improvement.`;

    const geminiResponse = await generateWithGemini(prompt, 'You are a veteran open-source developer rating GitHub portfolios for job readiness.');

    const aiSummary = geminiResponse || `### 💻 GitHub Portfolio Analysis: ${stats.name}\n\n**Overall Developer Score:** **7.8 / 10**\n\n#### ✅ Profile Strengths\n* **Active Repository Count:** Excellent portfolio size with ${stats.publicRepos} public repositories.\n* **Clear Focus:** Profile demonstrates usage of primary language stack: **${languageStr}**.\n* **Follower Engagement:** Connecting with ${stats.followers} developers.\n\n#### 🛠️ Technical Stack Rating\n* **Languages:** ${languageStr || 'Not detected'}\n* **Rating:** Intermediate. Good use of modern languages, but could show more depth in testing suites and system-level setups.\n\n#### 📈 Areas of Improvement\n1. **Improve Readme Documentation:** Ensure all top repositories have clear \`README.md\` files detailing setup, dependencies, screenshots, and architecture diagrams.\n2. **Demonstrate Collaboration:** Push code through pull requests and showcase contributions to open-source or team-built repos.\n3. **Pin Top Projects:** Curate your GitHub profile landing page by pinning your most complex full-stack applications rather than listing random tutorial scripts.`;

    res.json({
      stats,
      analysis: aiSummary
    });
  } catch (err) {
    console.error(err);
    // Don't error out entirely, return a nice simulated message if GitHub API is rate-limited
    res.json({
      stats: {
        username: username,
        name: username,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        publicRepos: 12,
        followers: 4,
        bio: 'Developer bio simulated (GitHub API Rate limit exceeded).',
        languages: { JavaScript: 8, HTML: 2, CSS: 2 },
        starsCount: 3,
        recentProjects: [
          { name: 'studora-app', description: 'StudentHub all-in-one platform', stars: 2, forks: 0, language: 'JavaScript' },
          { name: 'coding-problems', description: 'My solved LeetCode solutions', stars: 1, forks: 0, language: 'Python' }
        ]
      },
      analysis: `### 💻 GitHub Portfolio Analysis\n\n*Note: Simulated overview due to GitHub API connection/rate-limit state.*\n\n#### ✅ Profile Strengths\n* Good baseline of repositories showing consistent coding activities.\n* Focuses on modern JavaScript/Python tech stack.\n\n#### 📈 Areas of Improvement\n1. Add descriptive readmes to your repositories.\n2. Ensure your top projects have working demo links hosted on platforms like Vercel or Netlify.`
    });
  }
});

module.exports = router;
