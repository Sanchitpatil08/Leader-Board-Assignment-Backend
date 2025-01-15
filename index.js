import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import pointsRoutes from './routes/points.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/points', pointsRoutes);

// Initial users to be added when the database is empty
const initialUsers = [
  'Rahul', 'Kamal', 'Sanaki', 'Priya', 'Amit',
  'Neha', 'Raj', 'Sonia', 'Vikram', 'Maya'
];

// MongoDB Connection and initial setup
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if users collection is empty
    const User = mongoose.model('User');
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      // Add initial users
      const userPromises = initialUsers.map(name => {
        return new User({ name, points: 0 }).save();
      });
      await Promise.all(userPromises);
      console.log('Initial users added successfully');
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});