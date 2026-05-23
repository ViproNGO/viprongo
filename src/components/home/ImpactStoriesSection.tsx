"use client";

import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface Story {
  id?: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

const DEFAULT_STORIES: Story[] = [
  {
    name: "Lakshmi",
    role: "Tailoring Entrepreneur",
    quote: "VIPRO's tailoring program didn't just teach me how to sew; it taught me how to dream. Today, I employ three other women in my village.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Meena",
    role: "SHG Leader",
    quote: "Through the financial literacy training, our SHG has saved enough to start a small dairy business. We are now financially independent.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Saraswathi",
    role: "Handicrafts Maker",
    quote: "I thought my lack of education was a barrier. VIPRO helped me realize my worth. My handicrafts are now sold across the state.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop"
  }
];

export function ImpactStoriesSection({ stories }: { stories?: Story[] }) {
  const listToDisplay = stories && stories.length > 0 ? stories : DEFAULT_STORIES;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -420, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 420, behavior: "smooth" });
    }
  };

  return (
    <section id="impact" className="py-24 bg-vipro-purple dark:bg-[#0f070f] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-vipro-magenta/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-vipro-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-vipro-gold font-semibold tracking-wider uppercase text-sm mb-4">Voices of Transformation</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              Real Stories, Real Impact
            </h3>
          </div>
          
          {/* Nav Buttons (Hidden on mobile scroll since mobile has native swipe) */}
          <div className="hidden md:flex items-center space-x-4 mt-6 md:mt-0">
            <button
              onClick={scrollLeft}
              className="p-4 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-vipro-gold/50 hover:text-vipro-gold transition-all duration-300 focus:outline-none"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollRight}
              className="p-4 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-vipro-gold/50 hover:text-vipro-gold transition-all duration-300 focus:outline-none"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Horizontally Scrollable Cards Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-8 pb-10 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {listToDisplay.map((story, idx) => (
            <motion.div
              key={story.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex-shrink-0 w-[320px] sm:w-[380px] md:w-[420px] snap-start bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 hover:border-vipro-gold/30 hover:bg-white/10 transition-all duration-500 flex flex-col justify-between group shadow-2xl relative"
            >
              <div>
                <Quote className="w-12 h-12 text-vipro-magenta/30 mb-6 group-hover:text-vipro-gold/40 transition-colors duration-300" />
                <p className="text-lg md:text-xl text-gray-200 font-serif leading-relaxed italic mb-8">
                  &quot;{story.quote}&quot;
                </p>
              </div>

              <div className="flex items-center mt-auto border-t border-white/10 pt-6">
                {story.image && (
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-vipro-gold/20 mr-4 shadow-md group-hover:border-vipro-gold/50 transition-colors duration-300"
                  />
                )}
                <div>
                  <h4 className="text-lg font-bold text-vipro-gold group-hover:text-white transition-colors duration-300">{story.name}</h4>
                  <p className="text-gray-400 text-sm">{story.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
