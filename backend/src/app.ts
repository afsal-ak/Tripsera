import express from 'express';
import mongoose from 'mongoose';
import userRoutes from '@presentation/routes/userRoutes';
import adminRoutes from '@presentation/routes/adminRoutes';
import { errorHandler } from '@presentation/middlewares/errorHandler';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cookieParser());
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/picnigo');
    console.log(' MongoDB connected successfully');
  } catch (error) {
    console.error(' MongoDB connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);
connectMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
});
