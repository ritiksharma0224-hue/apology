"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  swaySpeed: number;
  color: string;
}

export default function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const colors = [
      "#F8E8EC", // soft rose
      "#FFA4B4", // lighter pink
      "#FFC0CB", // soft pink
      "#E2A4B4", // deep rose
      "#800020", // burgundy accents (occasional)
    ];

    const generated: Petal[] = [];
    const count = 35; // rich falling petal effect
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100, // percentage horizontal placement
        size: Math.random() * 18 + 12, // 12px to 30px
        duration: Math.random() * 7 + 5, // 5s to 12s fall speed
        delay: Math.random() * 6, // staggered initialization
        rotation: Math.random() * 360, // initial rot angle
        swaySpeed: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    
    let active = true;
    requestAnimationFrame(() => {
      if (active) {
        setPetals(generated);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {petals.map((p) => (
        <motion.svg
          key={p.id}
          className="absolute fill-current drop-shadow-sm"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            color: p.color,
          }}
          viewBox="0 0 24 24"
          initial={{ y: -50, opacity: 0, rotate: p.rotation }}
          animate={{
            y: "105vh",
            opacity: [0, 0.85, 0.85, 0],
            rotate: [p.rotation, p.rotation + 360 * p.swaySpeed],
            x: [
              0,
              Math.sin(p.id) * 35 * p.swaySpeed,
              -Math.sin(p.id) * 35 * p.swaySpeed,
              0,
            ],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {/* Custom leaf/petal shape */}
          <path d="M17 2.002c-2.614 0-4.5 1.533-5 3.327-.5-1.794-2.386-3.327-5-3.327-3.7 0-6 3.167-6 6.8 0 6.643 9.4 12.871 11 13.2 1.6-.329 11-6.557 11-13.2 0-3.633-2.3-6.8-6-6.8z" className="hidden" />
          {/* Actually let's use a beautiful organic leaf/petal shape */}
          <path d="M12.001 2.002c-5.523 0-10 4.477-10 10s4.477 10 10 10c1.785 0 3.47-.468 4.938-1.285.836.438 1.77.29 2.457-.397.689-.69.835-1.625.398-2.46.818-1.468 1.286-3.153 1.286-4.938.001-5.523-4.476-10-10-10zm-3.69 13.993c-.496 0-.901-.405-.901-.9 0-.496.405-.901.9-.901.496 0 .901.405.901.9 0 .496-.405.9-.9.9z" className="hidden"/>
          {/* Petal geometry */}
          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.07 3.06 7.44 7 7.93V22l4-2.5 4 2.5v-2.07c3.94-.49 7-3.86 7-7.93 0-5.52-4.48-10-10-10zm-1 11H8v-2h3V8h2v3h3v2h-3v3h-2v-3z" className="hidden"/>
          
          {/* Actual beautiful organic droplet petal shape */}
          <path d="M12 21.35C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" className="hidden"/>
          
          {/* Beautiful petal path: */}
          <path d="M12,2 C16.5,2 20.5,5.5 21,10.5 C21.5,15.5 17.5,19.5 12,22 C6.5,19.5 2.5,15.5 3,10.5 C3.5,5.5 7.5,2 12,2 Z" />
        </motion.svg>
      ))}
    </div>
  );
}
