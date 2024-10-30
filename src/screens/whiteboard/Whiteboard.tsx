"use client";
import ColorPicker from "./ColorPicker";
import React, { useEffect, useRef, useState } from "react";
import socket from "../../socket";

export const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000"); // Default color

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = (x: number, y: number) => {
      context.strokeStyle = color;
      context.lineTo(x, y);
      context.stroke();
    };

    const handleMouseDown = (e: MouseEvent) => {
      context.beginPath();
      context.moveTo(
        e.clientX - canvas?.offsetLeft,
        e.clientY - canvas?.offsetTop
      );
      setDrawing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (drawing) {
        draw(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        socket.emit("draw", { x: e.clientX, y: e.clientY, color });
      }
    };

    const handleMouseUp = () => {
      context.closePath();
      setDrawing(false);
    };

    const handleClear = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      socket.emit("clear");
    };

    socket.on("draw", (data) => {
      console.log("Drawing received:", data);
      context.strokeStyle = data.color;
      draw(data.x, data.y);
    });

    socket.on("clear", handleClear);

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [drawing, color]);

  const handleColorChange = (color: { hex: React.SetStateAction<string> }) => {
    setColor(color.hex);
  };

  return (
    <div>
      <ColorPicker color={color} onColorChange={handleColorChange} />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid black" }}
      />
      {/* <button onClick={handleClear}>Clear</button> */}
    </div>
  );
};
