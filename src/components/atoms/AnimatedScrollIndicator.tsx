"use client";

import { useEffect, useRef } from "react";

interface AnimatedScrollIndicatorProps {
  className?: string;
}

export default function AnimatedScrollIndicator({ className = "" }: AnimatedScrollIndicatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size - mais espaço para evitar cortes
    const scale = window.devicePixelRatio || 1;
    const canvasWidth = 32;
    const canvasHeight = 50;
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.scale(scale, scale);

    let animationTime = 0;
    const ANIMATION_SPEED = 0.02; // Mais lento para ser mais fluido
    const BOUNCE_HEIGHT = 4; // Menor bounce para evitar cortes

    // Dimensões baseadas na imagem de referência
    const MOUSE_WIDTH = 20; // Mais largo
    const MOUSE_HEIGHT = 32; // Mais alto
    const MOUSE_RADIUS = 10; // Bordas bem arredondadas
    const MOUSE_X = (canvasWidth - MOUSE_WIDTH) / 2;
    const MOUSE_Y = 6;

    const DOT_WIDTH = 2; // Mais fino
    const DOT_HEIGHT = 8; // Menor altura
    const DOT_RADIUS = 1;

    const animate = () => {
      animationTime += ANIMATION_SPEED;

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Calculate smooth bounce offset
      const bounceOffset = Math.sin(animationTime) * BOUNCE_HEIGHT;

      // Draw outer border (mouse shape) - mais largo como na imagem
      ctx.beginPath();
      ctx.roundRect(MOUSE_X, MOUSE_Y + bounceOffset, MOUSE_WIDTH, MOUSE_HEIGHT, MOUSE_RADIUS);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Calculate dot position - movimento mais sutil e controlado
      // Posicionar o dot mais para baixo no mouse
      const dotBaseY = MOUSE_Y + MOUSE_HEIGHT - 16; // Começar mais embaixo
      const dotY = dotBaseY + bounceOffset + Math.sin(animationTime * 1.8) * 4;
      const dotX = MOUSE_X + (MOUSE_WIDTH - DOT_WIDTH) / 2;

      // Add subtle glow effect first
      ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
      ctx.shadowBlur = 6;

      // Draw inner dot - menor e mais elegante
      ctx.beginPath();
      ctx.roundRect(dotX, dotY, DOT_WIDTH, DOT_HEIGHT, DOT_RADIUS);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();

      // Reset shadow
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`${className}`}
      style={{ imageRendering: "auto" }} // Mudei para 'auto' para suavização
    />
  );
}
