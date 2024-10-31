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

    // Draw based on normalized percentages for consistency across clients
    const draw = (xPercent: number, yPercent: number, drawColor = color) => {
      const x = xPercent * canvas.width;
      const y = yPercent * canvas.height;
      context.strokeStyle = drawColor;
      context.lineTo(x, y);
      context.stroke();
    };

    const handleMouseDown = (e: MouseEvent) => {
      context.beginPath(); // Start a new path
      const xPercent = (e.clientX - canvas.offsetLeft) / canvas.width;
      const yPercent = (e.clientY - canvas.offsetTop) / canvas.height;
      context.moveTo(xPercent * canvas.width, yPercent * canvas.height);
      setDrawing(true);
      socket.emit("beginPath"); // Emit beginPath event to reset paths on other clients
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (drawing) {
        const xPercent = (e.clientX - canvas.offsetLeft) / canvas.width;
        const yPercent = (e.clientY - canvas.offsetTop) / canvas.height;
        draw(xPercent, yPercent);
        socket.emit("draw", { xPercent, yPercent, color });
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

    // Listen for draw events from other clients
    socket.on("draw", (data) => {
      const { xPercent, yPercent, color: drawColor } = data;
      draw(xPercent, yPercent, drawColor);
    });

    // Listen for clear events
    socket.on("clear", handleClear);

    // Reset path on other clients whenever a new drawing starts
    socket.on("beginPath", () => {
      context.beginPath();
    });

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [drawing, color]);

  const handleColorChange = (newColor: { hex: React.SetStateAction<string> }) => {
    setColor(newColor.hex);
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
