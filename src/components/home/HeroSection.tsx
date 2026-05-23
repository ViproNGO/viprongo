"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Animated Counter Component
function AnimatedCounter({ from = 0, to, duration = 2, suffix = "" }: { from?: number, to: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.5 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * (to - from) + from));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
}

export function HeroSection({ content, logo }: { content?: any; logo?: string }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const stats = content?.stats || [
    { label: "Women Empowered", value: 5000, suffix: "+" },
    { label: "SHGs Supported", value: 350, suffix: "+" },
    { label: "Training Programs", value: 120, suffix: "+" },
    { label: "Families Benefited", value: 20000, suffix: "+" },
  ];

  return (
    <section id="home" className="relative flex flex-col overflow-hidden bg-vipro-beige dark:bg-[#0f070f]">
      {/* Background blobs / Parallax elements */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] sm:w-[40vw] sm:h-[40vw] rounded-full bg-vipro-magenta/20 dark:bg-vipro-magenta/10 blur-[100px] pointer-events-none"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] sm:w-[50vw] sm:h-[50vw] rounded-full bg-vipro-purple/20 dark:bg-vipro-purple/30 blur-[120px] pointer-events-none"
      />

      <div className="absolute inset-0 pointer-events-none opacity-30 sm:opacity-50">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-vipro-gold"
            initial={{
              x: (i * 10) + "vw",
              y: ((i * 15) % 100) + "vh",
              opacity: (i % 5) * 0.1 + 0.2
            }}
            animate={{
              y: [null, (i * -20) - 100],
              opacity: [null, 0]
            }}
            transition={{
              duration: (i % 5) * 2 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ opacity }}
          className="flex flex-col items-center w-full"
        >
          {logo && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-3 sm:mb-4 md:mb-6 flex justify-center"
            >
              <img 
                src={logo} 
                alt="VIPRO Logo" 
                className="h-24 sm:h-32 md:h-44 w-auto object-contain drop-shadow-lg transition-transform hover:scale-105"
              />
            </motion.div>
          )}

          {/* Organisation Name in a Beautiful Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mb-4 sm:mb-5 flex justify-center px-2"
          >
            <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.15em] sm:tracking-[0.25em] uppercase text-vipro-gold dark:text-vipro-gold font-sans bg-vipro-purple/5 dark:bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-vipro-purple/10 dark:border-white/10 shadow-sm backdrop-blur-sm text-center leading-relaxed">
              Village People Renaissance Organisation
            </span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-vipro-purple dark:text-vipro-beige mb-3 sm:mb-4 leading-tight px-2">
            {content?.headline || "Empowering Women."} <br/>
            <span className="text-vipro-magenta">{content?.subheadline || "Transforming Communities."}</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed px-2">
            {content?.description || "VIPRO is building a stronger future for women through skill development, self-help groups, employment opportunities, and sustainable empowerment."}
          </p>

        </motion.div>
      </div>

      {/* Stats Counter Section — inline (not absolute) so it doesn't overlap content */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 bg-white/50 dark:bg-black/40 backdrop-blur-md border-t border-white/20 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            {stats.map((stat: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-vipro-purple dark:text-vipro-gold mb-1 sm:mb-2">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
