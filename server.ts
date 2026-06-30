import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  const PORT = 3000;

  // Steam API Proxy
  app.get("/api/steam/achievements", async (req, res) => {
    const steamId = req.query.steamId as string;
    if (!steamId) return res.status(400).json({ error: "Missing steamId" });
    
    try {
      const response = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/`, {
        params: {
          key: process.env.STEAM_API_KEY,
          steamid: steamId,
          appid: process.env.STEAM_APP_ID,
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error("Steam API Error:", error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Multiplayer State
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("create_room", (roomId) => {
      if (rooms.has(roomId)) {
        socket.emit("error", "Room already exists");
        return;
      }
      rooms.set(roomId, { players: [socket.id], gameState: {} });
      socket.join(roomId);
      socket.emit("room_created", roomId);
      console.log(`Room ${roomId} created by ${socket.id}`);
    });

    socket.on("join_room", (roomId) => {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit("error", "Room not found");
        return;
      }
      if (room.players.length >= 2) {
        socket.emit("error", "Room is full");
        return;
      }
      room.players.push(socket.id);
      socket.join(roomId);
      io.to(roomId).emit("player_joined", { playerCount: room.players.length });
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("update_game_state", ({ roomId, state }) => {
      socket.to(roomId).emit("opponent_state_update", state);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Cleanup rooms
      for (const [roomId, room] of rooms.entries()) {
        const index = room.players.indexOf(socket.id);
        if (index !== -1) {
          room.players.splice(index, 1);
          io.to(roomId).emit("player_left");
          if (room.players.length === 0) {
            rooms.delete(roomId);
          }
          break;
        }
      }
    });
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
