// import http from 'http'
// import express from 'express';
// import mongoose from 'mongoose';
// import userRoutes from '@presentation/routes/userRoutes';
// import adminRoutes from '@presentation/routes/adminRoutes';
// import { errorHandler } from '@presentation/middlewares/errorHandler';
// import bodyParser from 'body-parser';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import morganLogger from '@presentation/middlewares/logger';
// import { Server } from 'socket.io';
// import { MessageUseCases } from '@application/usecases/user/messageUseCases';
// import { ChatRoomRepository } from '@infrastructure/repositories/ChatRoomRepository';
// import { MessageRepository } from '@infrastructure/repositories/MessageRepository';
// import { SocketService } from '@infrastructure/sockets/SocketService';
// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// const PORT = process.env.PORT || 4000;
// app.use(cookieParser());

// const connectMongoDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/picnigo');
//     console.log(' MongoDB connected successfully');
//   } catch (error) {
//     console.error(' MongoDB connection failed:', error);
//     process.exit(1); // Exit process with failure
//   }
// };

// const io=new Server(server,{
//   cors:{
//     origin:"*",
//     methods:["GET","POST"]
//   }
// })

// const chatRoomRepository=new ChatRoomRepository()
// const messageRepository=new MessageRepository()
// const messageUseCases=new MessageUseCases(messageRepository,chatRoomRepository);

// const socketService=new SocketService(io,messageUseCases)
// socketService.initialize()

// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   })
// );
// app.use(morganLogger);

// app.use(bodyParser.json());
// app.use('/api/user', userRoutes);
// app.use('/api/admin', adminRoutes);

// app.use(errorHandler);

// connectMongoDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(` Server running on port ${PORT}`);
//   });
// });
import http from "http";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "@presentation/routes/userRoutes";
import adminRoutes from "@presentation/routes/adminRoutes";
// import chatRoutes from "@presentation/routes/chatRoutes";
import { errorHandler } from "@presentation/middlewares/errorHandler";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morganLogger from "@presentation/middlewares/logger";
import { Server } from "socket.io";
import { MessageUseCases } from "@application/usecases/chat/messageUseCases";
import { ChatRoomRepository } from "@infrastructure/repositories/ChatRoomRepository";
import { MessageRepository } from "@infrastructure/repositories/MessageRepository";
import { SocketService } from "@infrastructure/sockets/SocketService";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4001;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/picnigo");
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    process.exit(1);
  }
};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Initialize repositories & use cases
const chatRoomRepository = new ChatRoomRepository();
const messageRepository = new MessageRepository();
const messageUseCases = new MessageUseCases(messageRepository, chatRoomRepository);

// Initialize Socket.IO
const socketService = new SocketService(io, messageUseCases);
socketService.initialize();

// Middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morganLogger);
app.use(bodyParser.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
//app.use("/api/chat", chatRoutes);

// Error handler
app.use(errorHandler);

// Start server
connectMongoDB().then(() => {
  server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
});
