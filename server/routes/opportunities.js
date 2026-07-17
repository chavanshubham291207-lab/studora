const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');

// Initialize Gemini AI for recommendations if key is present
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (e) {
    console.error('Failed to initialize Gemini API in opportunities router:', e.message);
  }
}

// @route   GET api/opportunities
// @desc    Get all opportunities with advanced search, filtering and sorting
router.get('/', async (req, res) => {
  const { 
    type, search, category, mode, regFee, country, state, college, technology, 
    status, sort, limit, platform, isGovernment, educationLevel, scholarshipType,
    skills, company, duration, stipend
  } = req.query;
  
  const filter = {};

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (mode) filter.mode = mode;
  if (regFee) filter.regFee = regFee;
  if (country) filter.country = country;
  if (state) filter.state = state;
  if (college) filter.college = college;
  if (platform) filter.platform = platform;
  if (isGovernment !== undefined) filter.isGovernment = isGovernment === 'true';
  if (educationLevel) filter.educationLevel = educationLevel;
  if (scholarshipType) filter.scholarshipType = scholarshipType;
  if (company) filter.company = company;
  if (duration) filter.duration = duration;
  if (stipend) filter.stipend = stipend;
  if (skills) filter.skills = skills;

  // For approval checks (default to showing approved ones only, except when admin queries)
  if (status === 'pending') {
    filter.isApproved = false;
  } else {
    // If not specified, default to approved
    filter.isApproved = true;
  }

  try {
    let opportunities = await db.Opportunity.find(filter);
    
    // Check if caller is admin to bypass future publishing dates
    let isAdmin = false;
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'studora_jwt_secret_key_12345');
        if (decoded && decoded.role === 'admin') {
          isAdmin = true;
        }
      } catch (e) {
        // Ignore token errors for public list
      }
    }

    // Filter out future publish dates for non-admins
    if (!isAdmin) {
      const nowStr = new Date().toISOString().split('T')[0];
      opportunities = opportunities.filter(opp => {
        if (!opp.publishDate) return true; // Publish immediately if no date
        return opp.publishDate <= nowStr;
      });
    }

    // Apply rolling deadline logic for client queries (when not retrieving pending admin lists)
    if (status !== 'pending') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Step A: Keep only opportunities with deadline >= 10 days from today
      opportunities = opportunities.filter(opp => {
        if (!['hackathon', 'scholarship', 'internship'].includes(opp.type)) {
          return true;
        }
        if (!opp.deadline) return false;
        const deadlineDate = new Date(opp.deadline);
        const daysRemaining = (deadlineDate - today) / 86400000;
        return daysRemaining >= 10;
      });

      // Step B: For hackathons, scholarships, and internships separately:
      // Remove 90+ days remaining if there is at least one other relevant option (10 to 90 days)
      const targetTypes = ['hackathon', 'scholarship', 'internship'];
      targetTypes.forEach(t => {
        const typeItems = opportunities.filter(opp => opp.type === t);
        if (typeItems.length > 0) {
          const hasOptionUnder90 = typeItems.some(opp => {
            const daysRemaining = (new Date(opp.deadline) - today) / 86400000;
            return daysRemaining < 90;
          });
          if (hasOptionUnder90) {
            // Remove any listings of this type with 90+ days remaining
            opportunities = opportunities.filter(opp => {
              if (opp.type !== t) return true;
              const daysRemaining = (new Date(opp.deadline) - today) / 86400000;
              return daysRemaining < 90;
            });
          }
        }
      });
    }
    
    // Apply search query (text matching across titles, description, tags, company)
    if (search) {
      const q = search.toLowerCase();
      opportunities = opportunities.filter(opp => 
        (opp.title && opp.title.toLowerCase().includes(q)) ||
        (opp.company && opp.company.toLowerCase().includes(q)) ||
        (opp.description && opp.description.toLowerCase().includes(q)) ||
        (opp.tags && opp.tags.some(tag => tag.toLowerCase().includes(q))) ||
        (opp.technologies && opp.technologies.some(tech => tech.toLowerCase().includes(q)))
      );
    }

    // Technology filter (specific tags/technologies match)
    if (technology) {
      const techLower = technology.toLowerCase();
      opportunities = opportunities.filter(opp => 
        opp.technologies && opp.technologies.some(t => t.toLowerCase() === techLower)
      );
    }

    // Featured/Trending/Closing Soon Status Filters
    if (status === 'featured') {
      opportunities = opportunities.filter(opp => opp.isFeatured === true);
    } else if (status === 'trending') {
      opportunities = opportunities.filter(opp => opp.isTrending === true);
    } else if (status === 'closing_soon') {
      const now = Date.now();
      opportunities = opportunities.filter(opp => {
        if (!opp.deadline) return false;
        const end = new Date(opp.deadline).getTime();
        const diff = end - now;
        return diff > 0 && diff <= 7 * 86400000; // closing in 7 days
      });
    }

    // Sorting Logic (defaults to latest, except for target types which default to deadline ascending)
    let activeSort = sort;
    const isTargetType = type && ['hackathon', 'scholarship', 'internship'].includes(type) && status !== 'pending';
    
    if (!activeSort) {
      activeSort = isTargetType ? 'deadline' : 'latest';
    }

    if (activeSort) {
      if (activeSort === 'latest') {
        if (isTargetType) {
          opportunities.sort((a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31'));
        } else {
          opportunities.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }
      } else if (activeSort === 'deadline') {
        opportunities.sort((a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31'));
      } else if (activeSort === 'prize') {
        // Parse numbers from prize pools for sorting (e.g. "$10,000" -> 10000, "₹5,00,000" -> 500000)
        const parsePrize = (str) => {
          if (!str) return 0;
          const cleaned = str.replace(/[^0-9]/g, '');
          return parseInt(cleaned, 10) || 0;
        };
        opportunities.sort((a, b) => parsePrize(b.prizePool) - parsePrize(a.prizePool));
      }
    }

    if (limit) {
      opportunities = opportunities.slice(0, parseInt(limit, 10));
    }

    res.json(opportunities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving opportunities' });
  }
});

// @route   GET api/opportunities/recommendations
// @desc    Get AI-based or tag-similarity-based personalized recommendations
router.get('/recommendations', authMiddleware, async (req, res) => {
  try {
    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch all active hackathons
    const hackathons = await db.Opportunity.find({ type: 'hackathon', isApproved: true });
    
    // User profile characteristics
    const userSkills = user.achievements || []; // list of skills/achievements
    const completedCerts = user.certificates || []; // list of certifications

    // If Gemini API is available, generate AI-powered recommendations
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const studentInfo = `Student Name: ${user.name}, Skills: ${userSkills.join(', ')}, Certifications: ${completedCerts.map(c => c.title).join(', ')}`;
        
        const hackathonList = hackathons.map(h => ({
          id: h._id,
          title: h.title,
          description: h.description,
          technologies: h.technologies,
          category: h.category
        }));

        const prompt = `Analyze the student's profile and recommend the top 3 best-suited hackathons from the list below. Return ONLY a valid JSON array of objects, containing:
        1. "id" (the hackathon ID string)
        2. "reason" (a 1-sentence reason explaining why it fits their skills/goals)

        Student Info:
        ${studentInfo}

        Hackathons:
        ${JSON.stringify(hackathonList)}
        
        Do not output any markdown code blocks, just raw JSON.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        // Clean markdown backticks if returned
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const recList = JSON.parse(cleanedText);

        const recommendations = [];
        for (const item of recList) {
          const matched = hackathons.find(h => h._id === item.id || h.id === item.id);
          if (matched) {
            recommendations.push({
              ...matched,
              aiReason: item.reason
            });
          }
        }

        if (recommendations.length > 0) {
          return res.json(recommendations);
        }
      } catch (geminiErr) {
        console.warn('Gemini recommendation failed, falling back to algorithmic matches:', geminiErr.message);
      }
    }

    // Algorithmic overlap fallback (tag matching)
    // Score each hackathon by counting overlaps of technologies/tags with user skills
    const scored = hackathons.map(h => {
      let score = 0;
      const hTags = [...(h.tags || []), ...(h.technologies || []), h.category || ''];
      
      hTags.forEach(tag => {
        const tLower = tag.toLowerCase();
        // Check overlaps with skills
        userSkills.forEach(skill => {
          if (skill.toLowerCase().includes(tLower) || tLower.includes(skill.toLowerCase())) {
            score += 3;
          }
        });
        // Check overlaps with certifications
        completedCerts.forEach(cert => {
          if (cert.title.toLowerCase().includes(tLower) || tLower.includes(cert.title.toLowerCase())) {
            score += 4;
          }
        });
      });

      // Default bias for featured/trending
      if (h.isFeatured) score += 2;
      if (h.isTrending) score += 1;

      return { hackathon: h, score };
    });

    // Sort by score desc, take top 3
    scored.sort((a, b) => b.score - a.score);
    const results = scored.slice(0, 4).map(item => ({
      ...item.hackathon,
      aiReason: item.score > 3 
        ? "Matches your completed coursework and skills tags." 
        : "Highly active competition matching premium student tracks."
    }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error generating recommendations' });
  }
});

router.post('/submit', authMiddleware, async (req, res) => {
  const { title, company, platform, type, description, eligibility, deadline, applyLink, logo, tags, banner, mode, location, eventDates, prizePool, teamSize, regFee, regFeeAmount, category, difficulty, technologies, country, state, college, provider, amount, educationLevel, documents, isGovernment, scholarshipType, stipend, duration, skills, openings, website } = req.body;

  if (!title || !type) {
    return res.status(400).json({ message: 'Title and type are required' });
  }

  try {
    const opp = await db.Opportunity.create({
      title,
      company: company || 'Student Submitted',
      platform: platform || 'Unstop',
      type,
      description: description || '',
      eligibility: eligibility || 'Open to all',
      deadline: deadline || 'No Deadline',
      applyLink: applyLink || '#',
      logo: logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company || title)}`,
      tags: tags || [],
      banner: banner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
      mode: mode || 'online',
      location: location || 'Online',
      eventDates: eventDates || 'TBD',
      prizePool: prizePool || 'Prizes',
      teamSize: teamSize || '1-4 Members',
      regFee: regFee || 'free',
      regFeeAmount: regFeeAmount || 0,
      category: category || 'General',
      difficulty: difficulty || 'Intermediate',
      technologies: technologies || [],
      country: country || 'Global',
      state: state || '',
      college: college || '',
      provider: provider || '',
      amount: amount || '',
      educationLevel: educationLevel || '',
      documents: documents || [],
      isGovernment: isGovernment === true || isGovernment === 'true',
      scholarshipType: scholarshipType || '',
      stipend: stipend || '',
      duration: duration || '',
      skills: skills || [],
      openings: Number(openings) || 1,
      website: website || '',
      isFeatured: false,
      isTrending: false,
      isApproved: false, // REQUIRES ADMIN APPROVAL
      submittedBy: req.user.id,
      registrations: [],
      reviews: [],
      discussions: [],
      teamFinder: []
    });

    res.status(201).json(opp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error submitting opportunity' });
  }
});

// @route   PUT api/opportunities/:id/approve
// @desc    Approve/Publish a pending opportunity (Admin only)
router.put('/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const opp = await db.Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });

    const updated = await db.Opportunity.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: 'Opportunity approved successfully', opp: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error approving opportunity' });
  }
});

// @route   POST api/opportunities/:id/register
// @desc    Register or unregister user for a hackathon
router.post('/:id/register', authMiddleware, async (req, res) => {
  try {
    const opp = await db.Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });

    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let registrations = opp.registrations || [];
    let registeredEvents = user.registeredEvents || [];
    let isRegistered = false;

    if (registrations.includes(user._id || user.id)) {
      registrations = registrations.filter(uid => uid !== (user._id || user.id));
      registeredEvents = registeredEvents.filter(eid => eid !== req.params.id);
    } else {
      registrations.push(user._id || user.id);
      registeredEvents.push(req.params.id);
      isRegistered = true;
    }

    const updatedOpp = await db.Opportunity.findByIdAndUpdate(req.params.id, { registrations });
    await db.User.findByIdAndUpdate(req.user.id, { registeredEvents });

    res.json({ isRegistered, registrationsCount: registrations.length, opp: updatedOpp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error registering for opportunity' });
  }
});

// @route   POST api/opportunities/:id/win
// @desc    Toggle marking hackathon as won by student
router.post('/:id/win', authMiddleware, async (req, res) => {
  try {
    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let wonCompetitions = user.wonCompetitions || [];
    let hasWon = false;

    if (wonCompetitions.includes(req.params.id)) {
      wonCompetitions = wonCompetitions.filter(eid => eid !== req.params.id);
    } else {
      wonCompetitions.push(req.params.id);
      hasWon = true;
    }

    await db.User.findByIdAndUpdate(req.user.id, { wonCompetitions });
    res.json({ hasWon, wonCompetitions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating winning status' });
  }
});

// @route   POST api/opportunities/:id/discussion
// @desc    Post a comment on the opportunity discussion board
router.post('/:id/discussion', authMiddleware, async (req, res) => {
  const { comment } = req.body;
  if (!comment) return res.status(400).json({ message: 'Comment text is required' });

  try {
    const opp = await db.Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });

    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const discussions = opp.discussions || [];
    const newComment = {
      id: Math.random().toString(36).substring(2, 9),
      userId: user._id || user.id,
      userName: user.name,
      avatar: user.avatar,
      comment,
      date: new Date().toISOString()
    };
    discussions.push(newComment);

    const updatedOpp = await db.Opportunity.findByIdAndUpdate(req.params.id, { discussions });
    res.status(201).json({ discussions: updatedOpp.discussions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error posting comment' });
  }
});

// @route   POST api/opportunities/:id/reviews
// @desc    Add review & rating to hackathon
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) return res.status(400).json({ message: 'Rating is required' });

  try {
    const opp = await db.Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });

    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const reviews = opp.reviews || [];
    
    // Check if user already reviewed, if so update it
    const existingIndex = reviews.findIndex(r => r.userId === (user._id || user.id));
    const newReview = {
      userId: user._id || user.id,
      userName: user.name,
      rating: parseInt(rating, 10),
      comment: comment || '',
      date: new Date().toISOString()
    };

    if (existingIndex > -1) {
      reviews[existingIndex] = newReview;
    } else {
      reviews.push(newReview);
    }

    const updatedOpp = await db.Opportunity.findByIdAndUpdate(req.params.id, { reviews });
    res.status(201).json({ reviews: updatedOpp.reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error posting review' });
  }
});

// @route   POST api/opportunities/:id/teams
// @desc    Create, Join, or Leave a Team Finder request
router.post('/:id/teams', authMiddleware, async (req, res) => {
  const { action, teamName, description, requiredSkills, teamId } = req.body;

  try {
    const opp = await db.Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });

    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let teamFinder = opp.teamFinder || [];

    if (action === 'create') {
      if (!teamName) return res.status(400).json({ message: 'Team Name is required' });
      
      const newTeam = {
        id: Math.random().toString(36).substring(2, 10),
        leaderId: user._id || user.id,
        leaderName: user.name,
        leaderAvatar: user.avatar,
        teamName,
        description: description || '',
        requiredSkills: requiredSkills || [],
        members: [user.name] // start with leader
      };
      teamFinder.push(newTeam);
    } 
    else if (action === 'join') {
      if (!teamId) return res.status(400).json({ message: 'Team ID is required' });
      const teamIndex = teamFinder.findIndex(t => t.id === teamId);
      if (teamIndex === -1) return res.status(404).json({ message: 'Team not found' });
      
      if (!teamFinder[teamIndex].members.includes(user.name)) {
        teamFinder[teamIndex].members.push(user.name);
      }
    } 
    else if (action === 'leave') {
      if (!teamId) return res.status(400).json({ message: 'Team ID is required' });
      const teamIndex = teamFinder.findIndex(t => t.id === teamId);
      if (teamIndex === -1) return res.status(404).json({ message: 'Team not found' });

      // If leader leaves, delete team or assign new leader
      if (teamFinder[teamIndex].leaderId === (user._id || user.id)) {
        teamFinder = teamFinder.filter(t => t.id !== teamId);
      } else {
        teamFinder[teamIndex].members = teamFinder[teamIndex].members.filter(m => m !== user.name);
      }
    }

    const updatedOpp = await db.Opportunity.findByIdAndUpdate(req.params.id, { teamFinder });
    res.json({ teamFinder: updatedOpp.teamFinder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error processing team request' });
  }
});

// @route   GET api/opportunities/:id
// @desc    Get a single opportunity details
router.get('/:id', async (req, res) => {
  try {
    const opp = await db.Opportunity.findById(req.params.id);
    if (!opp) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json(opp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving opportunity details' });
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, company, platform, type, description, eligibility, deadline, applyLink, logo, tags, banner, mode, location, eventDates, prizePool, teamSize, regFee, regFeeAmount, category, difficulty, technologies, country, state, college, isFeatured, isTrending, publishDate, provider, amount, educationLevel, documents, isGovernment, scholarshipType, stipend, duration, skills, openings, website } = req.body;

  if (!title || !type) {
    return res.status(400).json({ message: 'Title and type are required' });
  }

  try {
    const opp = await db.Opportunity.create({
      title,
      company: company || 'Studora Partner',
      platform: platform || 'Unstop',
      type,
      description: description || '',
      eligibility: eligibility || 'Open to all',
      deadline: deadline || 'No Deadline',
      applyLink: applyLink || '#',
      logo: logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(company || title)}`,
      tags: tags || [],
      banner: banner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
      mode: mode || 'online',
      location: location || 'Online',
      eventDates: eventDates || 'TBD',
      prizePool: prizePool || 'Prizes',
      teamSize: teamSize || '1-4 Members',
      regFee: regFee || 'free',
      regFeeAmount: regFeeAmount || 0,
      category: category || 'General',
      difficulty: difficulty || 'Intermediate',
      technologies: technologies || [],
      country: country || 'Global',
      state: state || '',
      college: college || '',
      isFeatured: isFeatured === true,
      isTrending: isTrending === true,
      isApproved: true,
      publishDate: publishDate || '',
      provider: provider || '',
      amount: amount || '',
      educationLevel: educationLevel || '',
      documents: documents || [],
      isGovernment: isGovernment === true || isGovernment === 'true',
      scholarshipType: scholarshipType || '',
      stipend: stipend || '',
      duration: duration || '',
      skills: skills || [],
      openings: Number(openings) || 1,
      website: website || '',
      registrations: [],
      reviews: [],
      discussions: [],
      teamFinder: []
    });

    res.status(201).json(opp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating opportunity' });
  }
});

// @route   PUT api/opportunities/:id
// @desc    Update opportunity (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await db.Opportunity.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating opportunity' });
  }
});

// @route   DELETE api/opportunities/:id
// @desc    Delete opportunity (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await db.Opportunity.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json({ message: 'Opportunity deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting opportunity' });
  }
});

// @route   POST api/opportunities/sync
// @desc    Sync opportunities from public RSS feeds or legal simulated feeds (Admin only)
router.post('/sync', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { syncOpportunities } = require('../utils/apiSync');
    const result = await syncOpportunities();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error syncing opportunities', error: err.message });
  }
});

// @route   POST api/opportunities/:id/reminder
// @desc    Toggle deadline reminder for student
router.post('/:id/reminder', authMiddleware, async (req, res) => {
  try {
    const opp = await db.Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });

    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let reminders = user.reminders || [];
    let isReminded = false;

    if (reminders.includes(req.params.id)) {
      reminders = reminders.filter(eid => eid !== req.params.id);
    } else {
      reminders.push(req.params.id);
      isReminded = true;
    }

    await db.User.findByIdAndUpdate(req.user.id, { reminders });
    res.json({ isReminded, remindersCount: reminders.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error toggling reminder status' });
  }
});

module.exports = router;
