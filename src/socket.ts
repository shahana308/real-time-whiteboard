import { io } from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000",
  {
    transports: ["websocket"],
  }
);

export default socket;
