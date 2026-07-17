const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API (similar to server/routes/ai.js)
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✨ [CERTIFICATIONS AI]: Gemini API client initialized.');
  } catch (e) {
    console.error('❌ [CERTIFICATIONS AI]: Failed to initialize Gemini:', e.message);
  }
}

// Helper to get formatted date string (YYYY-MM-DD)
const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

// @route   GET api/certifications
// @desc    Get all certifications (supports search and multiple filters)
router.get('/', async (req, res) => {
  try {
    let certifications = await db.Certification.find();

    const { search, companyName, provider, category, difficulty, duration, isVirtualExperience, isFreeCertificate } = req.query;

    // Apply filtering in memory to ensure same behavior across both MongoDB and JSON DB modes
    if (search) {
      const q = search.toLowerCase();
      certifications = certifications.filter(c =>
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.companyName && c.companyName.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.skills && c.skills.some(skill => skill.toLowerCase().includes(q))) ||
        (c.category && c.category.toLowerCase().includes(q))
      );
    }

    if (companyName) {
      const companies = Array.isArray(companyName) ? companyName : [companyName];
      certifications = certifications.filter(c => 
        c.companyName && companies.some(co => co.toLowerCase() === c.companyName.toLowerCase())
      );
    }

    if (provider) {
      const providers = Array.isArray(provider) ? provider : [provider];
      certifications = certifications.filter(c => 
        c.provider && providers.some(pr => pr.toLowerCase() === c.provider.toLowerCase())
      );
    }

    if (category) {
      const categories = Array.isArray(category) ? category : [category];
      certifications = certifications.filter(c => 
        c.category && categories.some(cat => cat.toLowerCase() === c.category.toLowerCase())
      );
    }

    if (difficulty) {
      const levels = Array.isArray(difficulty) ? difficulty : [difficulty];
      certifications = certifications.filter(c => 
        c.difficulty && levels.some(lv => lv.toLowerCase() === c.difficulty.toLowerCase())
      );
    }

    if (duration) {
      // Simple filter based on keywords in duration (e.g. "hours", "weeks", "days")
      const durList = Array.isArray(duration) ? duration : [duration];
      certifications = certifications.filter(c => {
        if (!c.duration) return false;
        const durLower = c.duration.toLowerCase();
        return durList.some(d => {
          if (d === 'Short (< 2 hrs)') {
            const hrsMatch = durLower.match(/(\d+)\s*hour/);
            const minsMatch = durLower.match(/(\d+)\s*min/);
            if (minsMatch) return true;
            if (hrsMatch && parseInt(hrsMatch[1]) < 2) return true;
            return false;
          } else if (d === 'Medium (2-10 hrs)') {
            const hrsMatch = durLower.match(/(\d+)\s*hour/);
            if (hrsMatch) {
              const hrs = parseInt(hrsMatch[1]);
              return hrs >= 2 && hrs <= 10;
            }
            return false;
          } else if (d === 'Long (> 10 hrs)') {
            const hrsMatch = durLower.match(/(\d+)\s*hour/);
            const weeksMatch = durLower.includes('week');
            if (weeksMatch) return true;
            if (hrsMatch && parseInt(hrsMatch[1]) > 10) return true;
            return false;
          }
          return false;
        });
      });
    }

    if (isVirtualExperience !== undefined) {
      const isVE = isVirtualExperience === 'true';
      certifications = certifications.filter(c => c.isVirtualExperience === isVE);
    }

    if (isFreeCertificate !== undefined) {
      const isFC = isFreeCertificate === 'true';
      certifications = certifications.filter(c => c.isFreeCertificate === isFC);
    }

    res.json(certifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving certifications' });
  }
});

// @route   GET api/certifications/stats
// @desc    Get dashboard statistics for certifications page
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const totalCourses = await db.Certification.countDocuments();
    const certifications = await db.Certification.find();

    // Get unique companies
    const companiesSet = new Set();
    certifications.forEach(c => {
      if (c.companyName) companiesSet.add(c.companyName);
    });

    const completedCount = user.completedCourses ? user.completedCourses.length : 0;
    const bookmarkedCount = user.bookmarkedCourses ? user.bookmarkedCourses.length : 0;
    const progressPercent = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

    res.json({
      totalCourses,
      totalCompanies: companiesSet.size,
      certificatesCompleted: completedCount,
      coursesBookmarked: bookmarkedCount,
      learningStreak: user.learningStreak || 0,
      progressPercentage: Math.min(progressPercent, 100)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error loading stats' });
  }
});

// @route   POST api/certifications/:id/bookmark
// @desc    Toggle bookmark status of a certification
router.post('/:id/bookmark', authMiddleware, async (req, res) => {
  try {
    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let bookmarks = user.bookmarkedCourses || [];
    const courseId = req.params.id;

    if (bookmarks.includes(courseId)) {
      bookmarks = bookmarks.filter(id => id !== courseId);
    } else {
      bookmarks.push(courseId);
    }

    await db.User.findByIdAndUpdate(req.user.id, {
      bookmarkedCourses: bookmarks
    });

    res.json({ bookmarkedCourses: bookmarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error bookmarking course' });
  }
});

// @route   POST api/certifications/:id/complete
// @desc    Toggle completion status of a certification & update streak
router.post('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let completed = user.completedCourses || [];
    const courseId = req.params.id;
    const isNowCompleted = !completed.includes(courseId);

    if (isNowCompleted) {
      completed.push(courseId);

      // Increment course completions
      const course = await db.Certification.findById(courseId);
      if (course) {
        await db.Certification.findByIdAndUpdate(courseId, {
          completions: (course.completions || 0) + 1
        });
      }

      // Update Learning Streak
      const todayStr = getTodayDateString();
      const yesterdayStr = getYesterdayDateString();
      let streak = user.learningStreak || 0;

      if (user.lastActiveDate === todayStr) {
        // Already active today, streak remains same
      } else if (user.lastActiveDate === yesterdayStr) {
        // Active yesterday, increment streak
        streak += 1;
      } else {
        // Broke streak, reset to 1
        streak = 1;
      }

      await db.User.findByIdAndUpdate(req.user.id, {
        completedCourses: completed,
        learningStreak: streak,
        lastActiveDate: todayStr
      });

      res.json({ completedCourses: completed, learningStreak: streak, message: 'Course marked as completed!' });
    } else {
      completed = completed.filter(id => id !== courseId);

      // Decrement course completions (min 0)
      const course = await db.Certification.findById(courseId);
      if (course) {
        await db.Certification.findByIdAndUpdate(courseId, {
          completions: Math.max((course.completions || 0) - 1, 0)
        });
      }

      await db.User.findByIdAndUpdate(req.user.id, {
        completedCourses: completed
      });

      res.json({ completedCourses: completed, message: 'Course marked as incomplete.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error marking completion' });
  }
});

// @route   POST api/certifications/:id/view
// @desc    Increment views of a certification
router.post('/:id/view', async (req, res) => {
  try {
    const course = await db.Certification.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const updated = await db.Certification.findByIdAndUpdate(req.params.id, {
      views: (course.views || 0) + 1
    });

    res.json({ views: updated.views });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/certifications/request
// @desc    Submit a user request for new certification or report a broken link
router.post('/request', authMiddleware, async (req, res) => {
  const { type, courseTitle, provider, description, courseUrl, comments } = req.body;
  if (!type || !courseTitle) {
    return res.status(400).json({ message: 'Type and Course Title are required' });
  }

  try {
    const JSON_DIR = path.join(__dirname, '..', 'data');
    const filePath = path.join(JSON_DIR, 'requests.json');

    let requests = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        requests = JSON.parse(fileContent || '[]');
      } catch (e) {
        requests = [];
      }
    }

    const newRequest = {
      id: Math.random().toString(36).substring(2, 9),
      userId: req.user.id,
      type, // 'request' or 'broken_link'
      courseTitle,
      provider: provider || 'Unknown',
      description: description || '',
      courseUrl: courseUrl || '',
      comments: comments || '',
      createdAt: new Date().toISOString()
    };

    requests.push(newRequest);
    fs.writeFileSync(filePath, JSON.stringify(requests, null, 2));

    res.status(201).json({ message: 'Request submitted successfully!', request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error logging request' });
  }
});

// @route   POST api/certifications/recommend-ai
// @desc    Generate AI recommendations based on user input skills
router.post('/recommend-ai', authMiddleware, async (req, res) => {
  const { skills, careerGoal } = req.body;
  if (!skills && !careerGoal) {
    return res.status(400).json({ message: 'Skills or Career Goal is required' });
  }

  try {
    const courses = await db.Certification.find();
    if (courses.length === 0) {
      return res.json({ recommendations: [] });
    }

    const promptText = `
Given a student with the following details:
- Current Skills: ${skills || 'Not specified'}
- Career Goal: ${careerGoal || 'Not specified'}

Recommend exactly 3 courses from this JSON list of courses. Return ONLY a JSON array containing the titles of the 3 most relevant courses.
Course List:
${JSON.stringify(courses.map(c => ({ id: c._id, title: c.title, companyName: c.companyName, category: c.category, skills: c.skills, description: c.description })))}

Format your response EXACTLY like this:
["Course Title 1", "Course Title 2", "Course Title 3"]
Do not add any other words, markdown formatting (like \`\`\`json), or explanations.
`;

    let recommendedTitles = [];

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(promptText);
        let text = result.response.text().trim();
        // Clean markdown code blocks if the LLM returned it anyway
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        recommendedTitles = JSON.parse(text);
      } catch (aiErr) {
        console.error('Failed to get Gemini AI response, using simulated fallback:', aiErr);
      }
    }

    // Fallback static recommendation matcher
    if (!recommendedTitles || recommendedTitles.length === 0) {
      const skillsLower = (skills || '').toLowerCase();
      const goalLower = (careerGoal || '').toLowerCase();
      const combined = (skillsLower + ' ' + goalLower).trim();

      // Score each course based on keyword overlaps
      const scored = courses.map(c => {
        let score = 0;
        const titleLower = c.title.toLowerCase();
        const compLower = c.companyName.toLowerCase();
        const catLower = c.category.toLowerCase();
        const descLower = (c.description || '').toLowerCase();
        const skillListLower = c.skills.map(s => s.toLowerCase());

        // Check search overlap
        if (combined) {
          const words = combined.split(/[\s,]+/);
          words.forEach(word => {
            if (word.length < 3) return;
            if (titleLower.includes(word)) score += 5;
            if (compLower.includes(word)) score += 3;
            if (catLower.includes(word)) score += 4;
            if (descLower.includes(word)) score += 2;
            if (skillListLower.some(s => s.includes(word))) score += 5;
          });
        }

        // Feature bias
        if (c.isFeatured) score += 2;
        return { course: c, score };
      });

      // Sort by score and grab top 3
      scored.sort((a, b) => b.score - a.score);
      recommendedTitles = scored.slice(0, 3).map(item => item.course.title);
    }

    // Map titles back to full course details
    const recommendations = courses.filter(c => recommendedTitles.includes(c.title)).slice(0, 3);
    
    // If we couldn't match enough, pad with featured or random courses
    if (recommendations.length < 3) {
      const extraCourses = courses.filter(c => !recommendations.some(r => r.title === c.title));
      const needed = 3 - recommendations.length;
      recommendations.push(...extraCourses.slice(0, needed));
    }

    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error generating recommendations' });
  }
});

// @route   POST api/certifications
// @desc    Create a new certification (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, companyName, companyLogo, category, description, skills, duration, difficulty, isFreeCertificate, isVirtualExperience, provider, courseLink, isFeatured } = req.body;

  if (!title || !companyName || !category || !provider || !courseLink) {
    return res.status(400).json({ message: 'Please provide all required fields (title, companyName, category, provider, courseLink)' });
  }

  try {
    const defaultLogo = companyLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(companyName)}&backgroundColor=003366`;
    const skillsArray = Array.isArray(skills) 
      ? skills 
      : typeof skills === 'string' 
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    const newCourse = await db.Certification.create({
      title,
      companyName,
      companyLogo: defaultLogo,
      category,
      description: description || '',
      skills: skillsArray,
      duration: duration || 'Self-paced',
      difficulty: difficulty || 'Beginner',
      isFreeCertificate: isFreeCertificate !== undefined ? isFreeCertificate : true,
      isVirtualExperience: isVirtualExperience !== undefined ? isVirtualExperience : false,
      provider,
      courseLink,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      views: 0,
      completions: 0
    });

    res.status(201).json(newCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating certification' });
  }
});

// @route   PUT api/certifications/:id
// @desc    Update certification (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { skills } = req.body;
  const updates = { ...req.body };
  
  if (skills && !Array.isArray(skills)) {
    updates.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
  }

  try {
    const updated = await db.Certification.findByIdAndUpdate(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating certification' });
  }
});

// @route   DELETE api/certifications/:id
// @desc    Delete certification (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await db.Certification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    res.json({ message: 'Certification deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting certification' });
  }
});

module.exports = router;
