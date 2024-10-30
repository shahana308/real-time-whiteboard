/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "https://realtime-whiteboard-l4cw.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("draw", (data) => {
    console.log("Draw event received:", data); // Add this line

    socket.broadcast.emit("draw", data);
  });
});

server.listen(4000, () => {
  console.log("listening");
});
