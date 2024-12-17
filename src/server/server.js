/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Join a session/room
  socket.on("joinSession", ({ sessionId }) => {
    socket.join(sessionId);
    console.log(`User joined session: ${sessionId}`);
  });

  // Handle drawing event (scoped to session)
  socket.on("draw", ({ sessionId, xPercent, yPercent, color, size, type }) => {
    console.log(`Draw in session ${sessionId} by ${socket.id}`);
    socket
      .to(sessionId)
      .emit("draw", { xPercent, yPercent, color, size, type });
  });

  // Handle begin path event (scoped to session)
  socket.on("beginPath", ({ sessionId }) => {
    socket.to(sessionId).emit("beginPath");
  });

  // Handle clear event (scoped to session)
  socket.on("clear", ({ sessionId }) => {
    socket.to(sessionId).emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log("Backend server is listening on port 4000");
});
