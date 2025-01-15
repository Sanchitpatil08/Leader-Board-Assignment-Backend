import express from 'express';
import User from '../models/User.js';
import PointHistory from '../models/PointHistory.js';

const router = express.Router();

// Claim points for a user
router.post('/claim', async (req, res) => {
  try {
    const { userId } = req.body;
    const points = Math.floor(Math.random() * 10) + 1; // Random points between 1-10

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user points
    user.points += points;
    await user.save();

    // Create point history
    const pointHistory = new PointHistory({
      userId,
      points
    });
    await pointHistory.save();

    // Update all user rankings
    const users = await User.find().sort({ points: -1 });
    await Promise.all(users.map((user, index) => {
      user.rank = index + 1;
      return user.save();
    }));

    res.json({ user, pointsClaimed: points });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get point history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const history = await PointHistory.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;