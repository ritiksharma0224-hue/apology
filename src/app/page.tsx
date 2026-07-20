"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingParticles from "@/components/FloatingParticles";
import FallingPetals from "@/components/FallingPetals";

export default function Home() {
  const [page, setPage] = useState<1 | 2 | 3>(1);
  
  // "No" button escaping states
  const [noTapCount, setNoTapCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noBubbleText, setNoBubbleText] = useState("");
  const [showNoBubble, setShowNoBubble] = useState(false);
  const [noHidden, setNoHidden] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // References for button positions
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  // Trigger confetti dynamically on page 3 entry
  const triggerConfetti = async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Burgundy, Cream White, Soft Rose, Gold, Pink colors
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#800020", "#FFF8F6", "#F8E8EC", "#D4AF37", "#FFA4B4"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#800020", "#FFF8F6", "#F8E8EC", "#D4AF37", "#FFA4B4"],
        });
      }, 250);
    } catch (err) {
      console.error("Failed to load confetti:", err);
    }
  };

  const handleYesClick = () => {
    setPage(3);
    triggerConfetti();
  };

  // Calculate random screen position safely inside the viewport
  const getRandomSafePosition = () => {
    if (typeof window === "undefined") return { x: 100, y: 100 };

    const btnWidth = 100;
    const btnHeight = 46;
    const padding = 32;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const maxX = vw - btnWidth - padding;
    const maxY = vh - btnHeight - padding;
    const minX = padding;
    const minY = padding;

    let x = Math.random() * (maxX - minX) + minX;
    let y = Math.random() * (maxY - minY) + minY;

    // Check overlap with YES button to prevent placing it exactly on top
    if (yesButtonRef.current) {
      const rect = yesButtonRef.current.getBoundingClientRect();
      const overlapX = x > rect.left - 40 && x < rect.right + 40;
      const overlapY = y > rect.top - 40 && y < rect.bottom + 40;

      if (overlapX && overlapY) {
        // Shift it outside the YES button bounds
        x = x < rect.left ? rect.left - btnWidth - padding : rect.right + padding;
        y = y < rect.top ? rect.top - btnHeight - padding : rect.bottom + padding;
      }
    }

    // Keep coordinates within bounds
    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    return { x, y };
  };

  const handleNoClick = () => {
    const nextCount = noTapCount + 1;
    setNoTapCount(nextCount);

    if (nextCount === 1) {
      const pos = getRandomSafePosition();
      setNoPosition(pos);
      setNoBubbleText("Oops! 🤭");
      setShowNoBubble(true);
      setTimeout(() => setShowNoBubble(false), 2000);
    } else if (nextCount === 2) {
      const pos = getRandomSafePosition();
      setNoPosition(pos);
      setNoBubbleText("Not so fast 😝");
      setShowNoBubble(true);
      setTimeout(() => setShowNoBubble(false), 2000);
    } else {
      // 3rd click: fly behind YES button and disappear
      if (yesButtonRef.current) {
        const rect = yesButtonRef.current.getBoundingClientRect();
        setNoPosition({ x: rect.left, y: rect.top });
      }
      setNoHidden(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4500);
    }
  };

  // Recalculate No button position if window resizes (while in escape state)
  useEffect(() => {
    if (noTapCount > 0 && noTapCount < 3 && !noHidden) {
      const handleResize = () => {
        setNoPosition(getRandomSafePosition());
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [noTapCount, noHidden]);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full p-4 overflow-hidden select-none">
      
      {/* Background A: Deep Burgundy for Page 1 */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: page === 1 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-br from-burgundy-dark via-burgundy to-burgundy-dark z-0"
      />

      {/* Background B: Cream Rose for Page 2 and 3 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: page !== 1 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-b from-[#FFF8F6] via-[#F8E8EC] to-[#FFF8F6] z-0"
      />

      {/* Floating Sparkles & Hearts Background */}
      {page !== 3 ? <FloatingParticles /> : <FallingPetals />}

      <AnimatePresence mode="wait">
        
        {/* PAGE 1: Welcome */}
        {page === 1 && (
          <motion.div
            key="page1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md text-center px-4 flex flex-col items-center justify-center z-10"
          >
            <h1 className="font-great-vibes text-4xl sm:text-5xl text-cream-white mb-6 leading-tight drop-shadow-md">
              Hey... Can I Have Just 2 Minutes Of Your Time? 🥺
            </h1>
            
            <p className="font-poppins text-soft-rose/90 text-base sm:text-lg mb-10 font-light tracking-wide">
              I made something just for you.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(2)}
              className="px-10 py-4 bg-cream-white text-burgundy font-medium text-lg rounded-full shadow-xl border border-gold hover:text-burgundy-dark transition-all duration-300 font-poppins relative overflow-hidden gold-glow"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Continue <span className="text-red-500 animate-pulse text-xl">❤️</span>
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* PAGE 2: Apology */}
        {page === 2 && (
          <motion.div
            key="page2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md px-4 z-10 flex items-center justify-center"
          >
            <div className="glass-card p-6 sm:p-8 rounded-3xl text-center relative w-full">
              <h1 className="font-great-vibes text-4xl sm:text-5xl text-burgundy mb-6 leading-tight">
                {"I'm Really Sorry ❤️"}
              </h1>
              
              <p className="font-poppins text-burgundy-dark/95 text-xs sm:text-sm md:text-base leading-relaxed mb-8 font-light">
                {"I know I made mistakes, and maybe I hurt you without realizing it. That was never my intention. You mean a lot to me, and seeing you upset is something I never wanted. I'm not asking you to forget everything instantly... I just hope you'll let my apology reach your heart."}
              </p>
              
              <h2 className="font-great-vibes text-3xl text-burgundy mb-8">
                Will You Forgive Me? 🌹
              </h2>
              
              {/* Interaction Buttons Container */}
              <div className="flex gap-6 items-center justify-center min-h-[60px] relative w-full">
                
                {/* YES Button */}
                <motion.button
                  ref={yesButtonRef}
                  onClick={handleYesClick}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-burgundy text-cream-white font-medium rounded-full shadow-lg border border-gold hover:bg-burgundy-dark transition-all duration-300 font-poppins text-sm flex items-center gap-2 z-30 cursor-pointer"
                >
                  <span>❤️ Yes, I Forgive You</span>
                </motion.button>

                {/* NO Button (escapes on tap) */}
                {!noHidden && (
                  <motion.button
                    ref={noButtonRef}
                    onClick={handleNoClick}
                    style={
                      noTapCount > 0
                        ? {
                            position: "fixed",
                            left: noPosition.x,
                            top: noPosition.y,
                            zIndex: 40,
                          }
                        : {
                            position: "relative",
                            zIndex: 20,
                          }
                    }
                    animate={noTapCount > 0 ? { scale: 1, opacity: 1 } : {}}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                    className="px-6 py-3 bg-cream-white text-burgundy font-medium rounded-full shadow-md border border-burgundy/10 hover:bg-white transition-all duration-300 font-poppins text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>🤍 No</span>
                    
                    {/* Speech bubble above No button */}
                    <AnimatePresence>
                      {showNoBubble && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -12, scale: 0.8 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3.5 py-1.5 bg-burgundy text-cream-white text-xs font-semibold rounded-xl shadow-xl border border-gold/40 whitespace-nowrap z-50"
                        >
                          {noBubbleText}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 bg-burgundy rotate-45 border-r border-b border-gold/40" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}

                {/* Flying / Dissolving No Button Overlay */}
                <AnimatePresence>
                  {noHidden && (
                    <motion.button
                      style={{
                        position: "fixed",
                        left: noPosition.x,
                        top: noPosition.y,
                        zIndex: 10,
                      }}
                      initial={{ scale: 1, opacity: 0.9 }}
                      animate={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="px-6 py-3 bg-cream-white text-burgundy font-medium rounded-full shadow-md border border-burgundy/10 font-poppins text-sm flex items-center gap-2 pointer-events-none"
                    >
                      🤍 No
                    </motion.button>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </motion.div>
        )}

        {/* PAGE 3: Thank You */}
        {page === 3 && (
          <motion.div
            key="page3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.35,
                },
              },
            }}
            className="w-full max-w-md text-center z-10 px-4 flex flex-col items-center justify-center"
          >
            
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: -25 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
              }}
              className="font-great-vibes text-5xl sm:text-6xl text-burgundy mb-6 leading-tight drop-shadow-sm"
            >
              {"Thank You BETUUUUUU. ❤️"}
            </motion.h1>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.5 } },
              }}
              className="font-poppins text-burgundy-dark text-xs sm:text-sm md:text-base space-y-4 mb-8 bg-cream-white/70 backdrop-blur-md px-6 py-8 rounded-3xl border border-white/50 shadow-lg w-full font-light"
            >
              <p>Your smile means more to me than you know.</p>
              <p>{"I'll do my best to never repeat my mistake."}</p>
              <p>Thank you for giving me another chance.</p>
            </motion.div>

            <motion.p
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.5 } },
              }}
              className="font-great-vibes text-2xl sm:text-3xl text-gold mb-10"
            >
              Made with lots of care, just for you. 🌹
            </motion.p>

            {/* Glowing Heartbeat Animation */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.5 },
                visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120 } },
              }}
              className="flex justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  filter: [
                    "drop-shadow(0 0 4px rgba(128, 0, 32, 0.3))",
                    "drop-shadow(0 0 16px rgba(128, 0, 32, 0.7))",
                    "drop-shadow(0 0 4px rgba(128, 0, 32, 0.3))",
                  ],
                }}
                transition={{
                  duration: 1.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-burgundy fill-current"
              >
                <svg className="w-12 h-12" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* Tiny Floating Toast Message */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-cream-white/95 border border-gold text-burgundy font-medium text-xs sm:text-sm shadow-xl text-center flex items-center gap-2 max-w-[90%] whitespace-nowrap"
          >
            <span>{"Looks like even your heart is choosing 'Yes'. ❤️"}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
