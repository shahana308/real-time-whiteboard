"use client";
import React, { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import SwatchColorPicker from "./SwatchColorPicker";
import CircleColorPicker from "./CircleColorPicker";
import { Typography } from "antd";

export const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000"); // Default color
  const [brushSize, setBrushSize] = useState(5); // Default brush size

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set the initial brush size and style
    context.lineWidth = brushSize;
    context.lineCap = "round";
    context.strokeStyle = color;

    // Draw based on normalized percentages for consistency across clients
    const draw = (
      xPercent: number,
      yPercent: number,
      drawColor = color,
      size = brushSize
    ) => {
      const x = xPercent * canvas.width;
      const y = yPercent * canvas.height;
      context.strokeStyle = drawColor;
      context.lineWidth = size;
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
        socket.emit("draw", { xPercent, yPercent, color, size: brushSize });
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
      const { xPercent, yPercent, color: drawColor, size } = data;
      draw(xPercent, yPercent, drawColor, size);
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
  }, [drawing, color, brushSize]);

  const handleColorChange = (newColor: {
    hex: React.SetStateAction<string>;
  }) => {
    setColor(newColor.hex);
  };

  const handleBrushSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBrushSize(Number(event.target.value));
  };

  return (
    <div className="m-10">
      <Typography.Title>Whiteboard</Typography.Title>
      <div className="flex gap-x-20">
        <div className="flex flex-col gap-y-10">
          <div className="border border-slate-50 shadow-lg	p-6 rounded-2xl">
            <SwatchColorPicker
              color={color}
              onColorChange={handleColorChange}
            />
          </div>
          <div className="border border-slate-50 shadow-lg	p-6 rounded-2xl">
            <CircleColorPicker
              color={color}
              onColorChange={handleColorChange}
            />
          </div>
        </div>
        <div>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ border: "1px solid gray", borderRadius: "50px" }}
          />
        </div>
        <div>
          <div className="border border-slate-50 shadow-lg	p-6 rounded-2xl">
            <Typography.Title
              level={5}
              className="!text-gray-500 !font-normal !mb-4"
            >
              Brush Size
            </Typography.Title>
            <div className="flex gap-x-10">
              <input
                id="brushSize"
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={handleBrushSizeChange}
                style={{
                  appearance: "none",
                  width: "100%",
                  height: "6px",
                  background: "#4db6ac",
                  outline: "none",
                  opacity: 0.7,
                  borderRadius: "5px",
                  transition: "opacity 0.2s",
                }}
              />
              <span className="text-teal-800 mt-[-8px]">{brushSize}px</span>
            </div>
          </div>
        </div>
      </div>
      {/* <button onClick={handleClear}>Clear</button> */}
    </div>
  );
};
