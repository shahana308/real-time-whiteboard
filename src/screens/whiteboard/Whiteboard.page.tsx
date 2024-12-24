"use client";
import React, { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import { useParams } from "next/navigation"; // Extract params from URL
import SwatchColorPicker from "./SwatchColorPicker";
import CircleColorPicker from "./CircleColorPicker";
import { Typography } from "antd";

export const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { sessionId } = useParams();
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [pencilType, setPencilType] = useState("normal");

  const setDrawingStyles = (ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    if (pencilType === "blurred") {
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
    } else {
      ctx.shadowBlur = 0;
    }

    if (pencilType === "dotted") {
      ctx.setLineDash([10, 10]);
    } else {
      ctx.setLineDash([]);
    }
  };

  useEffect(() => {
    if (!sessionId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Connect to the session
    socket.emit("joinSession", { sessionId });
    console.log(`Connected to session: ${sessionId}`);

    const handleMouseDown = (e: MouseEvent) => {
      setDrawing(true);
      context.beginPath();
      const xPercent = (e.clientX - canvas.offsetLeft) / canvas.width;
      const yPercent = (e.clientY - canvas.offsetTop) / canvas.height;
      context.moveTo(xPercent * canvas.width, yPercent * canvas.height);
      socket.emit("beginPath", { sessionId });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!drawing) return;
      const xPercent = (e.clientX - canvas.offsetLeft) / canvas.width;
      const yPercent = (e.clientY - canvas.offsetTop) / canvas.height;
      setDrawingStyles(context);
      const x = xPercent * canvas.width;
      const y = yPercent * canvas.height;
      context.lineTo(x, y);
      context.stroke();

      socket.emit("draw", {
        sessionId,
        xPercent,
        yPercent,
        color,
        size: brushSize,
        type: pencilType,
      });
    };

    const handleMouseUp = () => {
      setDrawing(false);
      context.closePath();
    };

    socket.on("draw", (data) => {
      const { xPercent, yPercent, color, size } = data;
      setDrawingStyles(context);
      context.lineWidth = size;
      context.strokeStyle = color;
      const x = xPercent * canvas.width;
      const y = yPercent * canvas.height;
      context.lineTo(x, y);
      context.stroke();
    });

    socket.on("clear", () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    socket.on("beginPath", () => {
      context.beginPath();
    });

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      socket.off("draw");
      socket.off("clear");
      socket.off("beginPath");
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [drawing, color, brushSize, pencilType]);

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

  const handlePencilTypeChange = (value: string) => {
    setPencilType(value);
  };

  return (
    <div className="m-10">
      <Typography.Title>Whiteboard - Session: {sessionId}</Typography.Title>
      <div className="flex gap-x-20">
        <div className="flex flex-col gap-y-10">
          <div className="border border-slate-50 shadow-lg p-6 rounded-2xl">
            <SwatchColorPicker
              color={color}
              onColorChange={handleColorChange}
            />
          </div>
          <div className="border border-slate-50 shadow-lg p-6 rounded-2xl">
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
          <div className="border border-slate-50 shadow-lg p-6 rounded-2xl">
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

          <div className="border border-slate-50 shadow-lg p-6 rounded-2xl mt-10">
            <Typography.Title
              level={5}
              className="!text-gray-500 !font-normal !mb-4"
            >
              Pencil Type
            </Typography.Title>
            <select
              value={pencilType}
              onChange={(e) => handlePencilTypeChange(e.target.value)}
              className="border border-[#009688] focus:outline-none focus:ring-0  p-2 rounded-lg"
              style={{ width: "100%" }}
            >
              <option value="normal">Normal</option>
              <option value="blurred">Blurred</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
