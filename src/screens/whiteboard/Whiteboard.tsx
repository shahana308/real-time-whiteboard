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

    const draw = (
      xPercent: number,
      yPercent: number,
      drawColor = color,
      move = true
    ) => {
      const x = xPercent * canvas.width;
      const y = yPercent * canvas.height;
      context.strokeStyle = drawColor;
      if (move) {
        context.lineTo(x, y);
        context.stroke();
      } else {
        context.moveTo(x, y);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const xPercent = (e.clientX - canvas.offsetLeft) / canvas.width;
      const yPercent = (e.clientY - canvas.offsetTop) / canvas.height;
      context.beginPath();
      draw(xPercent, yPercent, color, false); // Move to the starting point without drawing
      setDrawing(true);
      socket.emit("beginPath", { xPercent, yPercent, color }); // Emit beginPath event to reset paths on other clients
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
      if (drawing) {
        context.closePath();
        setDrawing(false);
        socket.emit("endDrawing");
      }
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

    // Listen for begin path events from other clients
    socket.on("beginPath", ({ xPercent, yPercent, color: drawColor }) => {
      context.beginPath();
      draw(xPercent, yPercent, drawColor, false);
    });

    // Stop drawing when other clients indicate the drawing has ended
    socket.on("endDrawing", () => {
      context.closePath();
    });

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp); // Handle case where mouse leaves canvas while drawing

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [drawing, color]);

  const handleColorChange = (newColor: {
    hex: React.SetStateAction<string>;
  }) => {
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
