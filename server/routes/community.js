const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

// @route   GET api/community
// @desc    Get all discussion posts (filter by type: discussion / teammate_search)
router.get('/', async (req, res) => {
  const { type, tag } = req.query;
  const filter = {};
  
  if (type) filter.type = type;

  try {
    let posts = await db.Discussion.find(filter);

    if (tag) {
      const targetTag = tag.toLowerCase();
      posts = posts.filter(post => 
        post.tags && post.tags.some(t => t.toLowerCase() === targetTag)
      );
    }

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving posts' });
  }
});

// @route   GET api/community/:id
// @desc    Get a single post details with comments
router.get('/:id', async (req, res) => {
  try {
    const post = await db.Discussion.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving post' });
  }
});

// @route   POST api/community
// @desc    Create a new discussion post or teammate search listing
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, type, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const user = await db.User.findById(req.user.id);
    const newPost = await db.Discussion.create({
      title,
      content,
      type: type || 'discussion',
      tags: tags || [],
      authorName: user ? user.name : 'Anonymous Student',
      authorId: req.user.id,
      comments: []
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating discussion post' });
  }
});

// @route   POST api/community/:id/comment
// @desc    Post a comment on a discussion thread
router.post('/:id/comment', authMiddleware, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  try {
    const post = await db.Discussion.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await db.User.findById(req.user.id);
    const comments = post.comments || [];
    
    const newComment = {
      _id: Math.random().toString(36).substring(2, 15),
      authorName: user ? user.name : 'Anonymous Student',
      authorId: req.user.id,
      content,
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    const updatedPost = await db.Discussion.findByIdAndUpdate(req.params.id, { comments });

    res.status(201).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error posting comment' });
  }
});

// @route   DELETE api/community/:id
// @desc    Delete discussion post (author or admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await db.Discussion.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await db.Discussion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting post' });
  }
});

module.exports = router;
