import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all users with rankings
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 });
    // Update ranks
    const updatedUsers = users.map((user, index) => {
      user.rank = index + 1;
      return user;
    });
    await Promise.all(updatedUsers.map(user => user.save()));
    res.json(updatedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new user
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    points: 0
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;