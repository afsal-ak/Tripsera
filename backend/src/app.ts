 
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from '@presentation/routes/userRoutes';
import adminRoutes from '@presentation/routes/adminRoutes';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
 import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Picnigo Travel API',
      version: '1.0.0',
      description: 'User authentication routes for Picnigo',
    },
  },
  apis: ['./src/presentation/routes/userRoutes.ts'], // update path if needed
};


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


const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//app.use(cors());

 app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
    credentials: true, // allow cookies/auth headers
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
 


connectMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});