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

  socket.on("draw", (data) => {
    console.log("Draw event received:", data);
    socket.broadcast.emit("draw", data);
  });

  socket.on("startDrawing", () => {
    console.log("Start drawing event received");
    socket.broadcast.emit("startDrawing");
  });

  // Broadcast end of drawing to other clients
  socket.on("endDrawing", () => {
    console.log("End drawing event received");
    socket.broadcast.emit("endDrawing");
  });

  // Broadcast begin path to reset paths on other clients
  socket.on("beginPath", (data) => {
    console.log("Begin path event received:", data);
    socket.broadcast.emit("beginPath", data);
  });

  // Broadcast clear action to all clients
  socket.on("clear", () => {
    console.log("Clear event received");
    socket.broadcast.emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log("Backend server is listening on port 4000");
});
