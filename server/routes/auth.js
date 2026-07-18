const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'studora_jwt_secret_key_12345';

// @route   POST api/auth/register
// @desc    Register a new student/admin
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    const userExists = await db.User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      avatar: defaultAvatar,
      bookmarks: [],
      attendance: [],
      cgpa: { semesters: [], cgpa: 0 },
      timetable: [],
      achievements: [],
      certificates: [],
      progress: { profileComplete: 25 }
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   GET api/auth/register
// @desc    Inform users that registration requires POST
router.get('/register', (req, res) => {
  res.status(405).json({
    message: 'Registration requires a POST request with name, email, and password in the JSON body.',
    status: 'error',
    method: 'POST'
  });
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password' });
  }

  try {
    const user = await db.User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET api/auth/login
// @desc    Inform users that login requires POST
router.get('/login', (req, res) => {
  res.status(405).json({
    message: 'Login requires a POST request with email and password in the JSON body.',
    status: 'error',
    method: 'POST'
  });
});

// @route   GET api/auth/me
// @desc    Get user data
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await db.User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't send back password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile & achievements
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.avatar) updates.avatar = req.body.avatar;
    if (req.body.achievements) updates.achievements = req.body.achievements;
    if (req.body.certificates) updates.certificates = req.body.certificates;
    if (req.body.progress) updates.progress = { ...user.progress, ...req.body.progress };

    const updatedUser = await db.User.findByIdAndUpdate(req.user.id, updates);
    const { password, ...cleanUser } = updatedUser;
    res.json(cleanUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   POST api/auth/bookmark
// @desc    Toggle a bookmark (hackathon, scholarship, job etc.)
router.post('/bookmark', authMiddleware, async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) return res.status(400).json({ message: 'Item ID is required' });

  try {
    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let bookmarks = user.bookmarks || [];
    if (bookmarks.includes(itemId)) {
      bookmarks = bookmarks.filter(id => id !== itemId);
    } else {
      bookmarks.push(itemId);
    }

    const updatedUser = await db.User.findByIdAndUpdate(req.user.id, { bookmarks });
    res.json({ bookmarks: updatedUser.bookmarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error toggling bookmark' });
  }
});

// @route   PUT api/auth/cgpa
// @desc    Update CGPA/SGPA data
router.put('/cgpa', authMiddleware, async (req, res) => {
  const { semesters, cgpa } = req.body;
  try {
    const updatedUser = await db.User.findByIdAndUpdate(req.user.id, {
      cgpa: { semesters, cgpa }
    });
    res.json({ cgpa: updatedUser.cgpa });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating CGPA' });
  }
});

// @route   PUT api/auth/attendance
// @desc    Update attendance records
router.put('/attendance', authMiddleware, async (req, res) => {
  const { attendance } = req.body;
  try {
    const updatedUser = await db.User.findByIdAndUpdate(req.user.id, { attendance });
    res.json({ attendance: updatedUser.attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating attendance' });
  }
});

// @route   PUT api/auth/timetable
// @desc    Update student timetable slots
router.put('/timetable', authMiddleware, async (req, res) => {
  const { timetable } = req.body;
  try {
    const updatedUser = await db.User.findByIdAndUpdate(req.user.id, { timetable });
    res.json({ timetable: updatedUser.timetable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating timetable' });
  }
});

module.exports = router;
