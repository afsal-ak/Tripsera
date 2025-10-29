import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from '@presentation/routes/userRoutes';
import adminRoutes from '@presentation/routes/adminRoutes';
import { errorHandler } from '@presentation/middlewares/errorHandler';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {morganLogger,morganConsole} from '@presentation/middlewares/logger';
import { Server } from 'socket.io';

//chat
import { MessageUseCases } from '@application/usecases/chat/messageUseCases';
import { ChatRoomRepository } from '@infrastructure/repositories/ChatRoomRepository';
import { MessageRepository } from '@infrastructure/repositories/MessageRepository';
import { SocketService } from '@infrastructure/sockets/SocketService';

// Notifications
import { NotificationRepository } from '@infrastructure/repositories/NotificationRepository';
import { NotificationUseCases } from '@application/usecases/notification/notificationUseCases';
import { UserRepository } from '@infrastructure/repositories/UserRepository';

import { initNotificationSocketService } from '@infrastructure/sockets/NotificationSocketService';
import { ChatRoomUseCase } from '@application/usecases/chat/chatRoomUseCases';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4001;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tripsera');
    console.log(' MongoDB connected successfully');
  } catch (error) {
    console.error(' MongoDB connection failed:', error);
    process.exit(1);
  }
};
export const io = new Server(server, {
  cors: {
    origin:process.env.FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});
const userRepository = new UserRepository();

const chatRoomRepository = new ChatRoomRepository();
const messageRepository = new MessageRepository();
const messageUseCases = new MessageUseCases(messageRepository, chatRoomRepository);
const chatRoomUseCases = new ChatRoomUseCase(chatRoomRepository);

const socketService = new SocketService(io, messageUseCases, chatRoomUseCases, userRepository);
socketService.initialize();

// create repo + useCases
const notificationRepository = new NotificationRepository();
const notificationUseCases = new NotificationUseCases(notificationRepository, userRepository);

// initialize singleton
initNotificationSocketService(io, notificationUseCases);

// Middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(morganLogger);
app.use(morganConsole);
app.use(bodyParser.json());

process.on('unhandledRejection', (reason, promise) => {
  console.error(' Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error(' Uncaught Exception:', error);
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use(errorHandler);

// Start server
connectMongoDB().then(() => {
  server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
});
