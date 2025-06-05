 
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from '@presentation/routes/userRoutes';
import adminRoutes from '@presentation/routes/adminRoutes';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
 const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/picnigo');
    console.log(' MongoDB connected successfully');
  } catch (error) {
    console.error(' MongoDB connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
 


connectMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});