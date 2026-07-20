"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  type: "heart" | "sparkle";
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = [];
    const count = 25; // elegant particle density
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        type: i % 2 === 0 ? "heart" : "sparkle",
        x: Math.random() * 100, // percentage horizontal placement
        size: Math.random() * 12 + 8, // 8px to 20px
        duration: Math.random() * 12 + 10, // 10s to 22s float time
        delay: Math.random() * 8, // staggered start
      });
    }
    
    let active = true;
    requestAnimationFrame(() => {
      if (active) {
        setParticles(generated);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {particles.map((p) => {
        if (p.type === "heart") {
          return (
            <motion.svg
              key={p.id}
              className="absolute text-burgundy/10 fill-current"
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
              }}
              viewBox="0 0 24 24"
              initial={{ y: "110vh", opacity: 0, rotate: 0 }}
              animate={{
                y: "-10vh",
                opacity: [0, 0.15, 0.15, 0],
                rotate: [0, 20, -20, 360],
                x: [0, Math.sin(p.id) * 40, -Math.sin(p.id) * 40, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </motion.svg>
          );
        } else {
          return (
            <motion.svg
              key={p.id}
              className="absolute text-gold/25 fill-current"
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
              }}
              viewBox="0 0 24 24"
              initial={{ y: "110vh", opacity: 0, scale: 0.6 }}
              animate={{
                y: "-10vh",
                opacity: [0, 0.35, 0.35, 0],
                scale: [0.6, 1.2, 0.9, 0.6],
                rotate: [0, 180, 360],
                x: [0, -Math.sin(p.id) * 30, Math.sin(p.id) * 30, 0],
              }}
              transition={{
                duration: p.duration - 2,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
            >
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
            </motion.svg>
          );
        }
      })}
    </div>
  );
}
