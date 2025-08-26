const express = require('express');
const router = express.Router();
const EventRegistration = require('../models/eventRegistration');

// GET all registrations
router.get('/', async (req, res) => {
  try {
    const registrations = await EventRegistration.find();
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new registration
router.post('/', async (req, res) => {
  try {
    const registration = new EventRegistration({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      eventType: req.body.eventType,
      registrationDate: new Date(),
      status: 'pending',
      notes: req.body.notes,
      attendeeCount: req.body.attendeeCount
    });

    await registration.save();
    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// DELETE a registration by ID
router.delete('/:id', async (req, res) => {
  try {
    await EventRegistration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
