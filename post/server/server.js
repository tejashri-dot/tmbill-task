// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.js'; // Add .js here

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/posts', postRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  }))
  .catch(err => console.log(err));
