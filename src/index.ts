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
      console.log("New client:", socket.id);

      socket.on("setup", (userData) => {
        console.log("setup for:", userData?.id || userData?._id);
        socket.join(userData?.id || userData?._id);
        socket.emit("connected");
      });

      socket.on("join chat", (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
        console.log("   rooms now:", [...socket.rooms]);
      });

      socket.on("new message", (message) => {
        console.log(" new message for chat:", message.chat?._id);
        console.log("   rooms of sender:", [...socket.rooms]);

        const room = message.chat?._id;
        if (!room) return;
        socket.to(room).emit("message received", message);
      });

      socket.on("disconnect", () => {
        console.log("disconnected:", socket.id);
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
