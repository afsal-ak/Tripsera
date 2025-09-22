import http from "http";
import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "@presentation/routes/userRoutes";
import adminRoutes from "@presentation/routes/adminRoutes";
import { errorHandler } from "@presentation/middlewares/errorHandler";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import morganLogger from "@presentation/middlewares/logger";
import { Server } from "socket.io";

//chat
import { MessageUseCases } from "@application/usecases/chat/messageUseCases";
import { ChatRoomRepository } from "@infrastructure/repositories/ChatRoomRepository";
import { MessageRepository } from "@infrastructure/repositories/MessageRepository";
import { SocketService } from "@infrastructure/sockets/SocketService";


// Notifications
import { NotificationRepository } from "@infrastructure/repositories/NotificationRepository";
import { NotificationUseCases } from "@application/usecases/notification/notificationUseCases";
import { NotificationSocketService } from "@infrastructure/sockets/NotificationSocketService";
import { UserRepository } from "@infrastructure/repositories/UserRepository";
import { PackageRepository } from "@infrastructure/repositories/PackageRepository";

import { initNotificationSocketService } from "@infrastructure/sockets/NotificationSocketService";

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
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const chatRoomRepository = new ChatRoomRepository();
const messageRepository = new MessageRepository();
const messageUseCases = new MessageUseCases(messageRepository, chatRoomRepository);

const socketService = new SocketService(io, messageUseCases);
socketService.initialize();


// create repo + useCases
const notificationRepository = new NotificationRepository();
const userRepository = new UserRepository();
const packageRepository=new PackageRepository()
const notificationUseCases = new NotificationUseCases(notificationRepository,userRepository,packageRepository);

// initialize singleton
initNotificationSocketService(io, notificationUseCases);

// const notificationRepository = new NotificationRepository();
// const notificationUseCases = new NotificationUseCases(notificationRepository);
//  const notificationSocketService = new NotificationSocketService(io, notificationUseCases);

// notificationSocketService.initialize();
//       //console.log("NotificationSocketService app, io:", io);

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
