"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

const colors = ["#4083b7", "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

export default function Confetti() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2,
        },
      });
    }
    setConfetti(pieces);

    // Clean up after animation
    const timer = setTimeout(() => {
      setConfetti([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
          }}
          initial={{
            x: piece.x,
            y: piece.y,
            rotate: piece.rotation,
          }}
          animate={{
            y: window.innerHeight + 100,
            x: piece.x + piece.velocity.x * 100,
            rotate: piece.rotation + 720,
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}