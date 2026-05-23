"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen({ logo }: { logo?: string }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState("Empowering Women...");

  useEffect(() => {
    // Lock scrolling during loader
    document.body.style.overflow = "hidden";

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Increment progress incrementally
        return prev + 1;
      });
    }, 28); // 100 * 28ms = 2.8 seconds

    // Change subtitle micro-copy over time
    const textTimer1 = setTimeout(() => setStepText("Transforming Communities..."), 1000);
    const textTimer2 = setTimeout(() => setStepText("Structuring Livelihoods..."), 2000);
    const textTimer3 = setTimeout(() => setStepText("Ready to Explore!"), 3000);

    // Final unlock timer (3.5 seconds total)
    const fadeTimer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "unset";
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(textTimer3);
      clearTimeout(fadeTimer);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -50,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[200] bg-[#1a0f1a] flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Subtle Ambient Glowing Background Shapes */}
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-vipro-purple/20 blur-[100px] pointer-events-none animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-vipro-magenta/10 blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "1s" }} />

          <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
            
            {/* Pulsing & Glowing Logo Wrapper */}
            {logo && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.95, 1.05, 0.95],
                  opacity: 1 
                }}
                transition={{ 
                  scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
                  opacity: { duration: 0.5 }
                }}
                className="mb-8 relative flex justify-center"
              >
                {/* Glow Ring Behind Logo */}
                <div className="absolute inset-0 rounded-full bg-vipro-magenta/10 blur-xl scale-125" />
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-28 md:h-36 w-auto object-contain drop-shadow-2xl relative z-10"
                />
              </motion.div>
            )}

            {/* Organisation Name */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-vipro-gold font-sans mb-3"
            >
              Village People Renaissance Organisation
            </motion.h1>

            {/* Main Branding Phrase */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-serif font-bold text-2xl md:text-3xl text-vipro-beige mb-8 leading-tight"
            >
              VIPRO NGO
            </motion.p>

            {/* Progress Bar Container */}
            <motion.div 
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden mb-4 relative"
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-vipro-magenta to-vipro-gold rounded-full"
                style={{ width: `${progress}%` }}
                layoutId="loaderProgress"
              />
            </motion.div>

            {/* Action text indicators below progress */}
            <motion.div
              key={stepText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-semibold tracking-widest text-vipro-magenta/80 dark:text-vipro-magenta"
            >
              {stepText}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
