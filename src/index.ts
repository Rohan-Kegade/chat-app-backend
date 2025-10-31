import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.config.js";
import { app } from "./app.js";
import { PORT } from "./config/env.js";

const startServer = async (): Promise<void> => {
  try {
    await connectDB(); // Wait for DB connection first

    // Create HTTP server
    const server = http.createServer(app);

    // Create Socket.IO server
    const io = new Server(server, {
      pingTimeout: 60000, // increase from 20000

      cors: {
        origin: "*", // or your frontend URL
        methods: ["GET", "POST"],
      },
    });

    // Socket.IO logic
    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      // User setup
      socket.on("setup", (userData) => {
        console.log("setup event received:", userData);
        socket.join(userData._id);
        socket.emit("connected");
      });

      // Join specific chat room
      socket.on("join chat", (roomId) => {
        socket.join(roomId);
        console.log(`User joined chat room: ${roomId}`);
      });

      // Send and broadcast new messages
      socket.on("new message", (message) => {
        console.log("Received message:", message);
        const chat = message.chat;
        if (!chat?.users) return;

        chat.users.forEach((user: any) => {
          if (user._id === message.sender._id) return;
          socket.in(user._id).emit("message received", message);
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    // Start both HTTP + WebSocket servers
    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
