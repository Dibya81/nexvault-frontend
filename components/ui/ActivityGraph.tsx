"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export function ActivityGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 120;

    const dataPoints = Array.from({ length: 50 }, () => Math.random() * 0.6 + 0.2);
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 5; i++) {
        const y = (i / 4) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * (1 - dataPoints[0]));

      for (let i = 1; i < dataPoints.length; i++) {
        const x = (i / (dataPoints.length - 1)) * canvas.width;
        const y = canvas.height * (1 - dataPoints[i]);

        // Smooth curve
        const prevX = ((i - 1) / (dataPoints.length - 1)) * canvas.width;
        const prevY = canvas.height * (1 - dataPoints[i - 1]);
        const cpX = (prevX + x) / 2;

        ctx.quadraticCurveTo(cpX, prevY, x, y);
      }

      // Gradient stroke
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "rgba(0, 240, 255, 0.8)");
      gradient.addColorStop(0.5, "rgba(112, 0, 255, 0.8)");
      gradient.addColorStop(1, "rgba(255, 0, 160, 0.8)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Fill area
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      const fillGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      fillGradient.addColorStop(0, "rgba(0, 240, 255, 0.2)");
      fillGradient.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = fillGradient;
      ctx.fill();

      // Update data points
      dataPoints.shift();
      dataPoints.push(Math.random() * 0.6 + 0.2);

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-24" />
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
}
