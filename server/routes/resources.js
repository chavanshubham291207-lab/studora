const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

// @route   GET api/resources
// @desc    Get all study resources (filtered by type and search)
router.get('/', async (req, res) => {
  const { type, search } = req.query;
  const filter = {};

  if (type) {
    filter.type = type;
  }

  try {
    let resources = await db.Resource.find(filter);

    if (search) {
      const q = search.toLowerCase();
      resources = resources.filter(res => 
        (res.title && res.title.toLowerCase().includes(q)) ||
        (res.subject && res.subject.toLowerCase().includes(q)) ||
        (res.uploaderName && res.uploaderName.toLowerCase().includes(q))
      );
    }

    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving study resources' });
  }
});

// @route   POST api/resources
// @desc    Create a new study resource (any authenticated student/admin can upload)
router.post('/', authMiddleware, async (req, res) => {
  const { title, subject, type, link } = req.body;

  if (!title || !subject || !type || !link) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    const user = await db.User.findById(req.user.id);
    const newResource = await db.Resource.create({
      title,
      subject,
      type,
      link,
      uploaderName: user ? user.name : 'Anonymous Student',
      uploaderId: req.user.id
    });

    res.status(201).json(newResource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error uploading resource' });
  }
});

// @route   DELETE api/resources/:id
// @desc    Delete resource (uploader or Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const resource = await db.Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Only allow uploader or admin to delete
    if (resource.uploaderId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized deletion' });
    }

    await db.Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting resource' });
  }
});

module.exports = router;
