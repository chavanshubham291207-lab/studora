const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route   GET api/events
// @desc    Get all calendar events and workshops
router.get('/', async (req, res) => {
  try {
    const events = await db.Event.find();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving events' });
  }
});

// @route   POST api/events
// @desc    Create a new workshop/event (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, description, date, time, venue, speaker, registrationLink, tags } = req.body;

  if (!title || !date || !time) {
    return res.status(400).json({ message: 'Title, date and time are required' });
  }

  try {
    const newEvent = await db.Event.create({
      title,
      description: description || '',
      date,
      time,
      venue: venue || 'Virtual (TBD)',
      speaker: speaker || 'TBD',
      registrationLink: registrationLink || '',
      tags: tags || [],
      rsvps: []
    });
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating event' });
  }
});

// @route   POST api/events/:id/rsvp
// @desc    Toggle RSVP for an event
router.post('/:id/rsvp', authMiddleware, async (req, res) => {
  try {
    const event = await db.Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    let rsvps = event.rsvps || [];
    const userId = req.user.id;

    if (rsvps.includes(userId)) {
      rsvps = rsvps.filter(id => id !== userId);
    } else {
      rsvps.push(userId);
    }

    const updatedEvent = await db.Event.findByIdAndUpdate(req.params.id, { rsvps });
    res.json({ rsvps: updatedEvent.rsvps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating RSVP' });
  }
});

// @route   DELETE api/events/:id
// @desc    Delete event (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await db.Event.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting event' });
  }
});

module.exports = router;
