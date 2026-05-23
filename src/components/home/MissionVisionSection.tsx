"use client";

import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

export function MissionVisionSection({ content }: { content?: any }) {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-vipro-beige dark:bg-[#1a0f1a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-5 sm:gap-8 md:gap-16">
          
          {/* Mission Card */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-7 sm:p-10 md:p-14 rounded-3xl bg-white dark:bg-[#251525] shadow-2xl overflow-hidden group"
          >
            {/* Morphing Background Shape */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-vipro-magenta/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 ease-in-out" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-vipro-magenta flex items-center justify-center mb-5 sm:mb-8 shadow-lg shadow-vipro-magenta/30 text-white">
                <Target className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-vipro-purple dark:text-vipro-beige mb-4 sm:mb-6">{content?.missionTitle || "Our Mission"}</h3>
              <ul className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg">
                {(content?.missionPoints || [
                  "Empower women economically and socially",
                  "Support micro-entrepreneurship and self-reliance",
                  "Create sustainable livelihood opportunities through skill training"
                ]).map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-vipro-magenta mr-3 mt-0.5">✦</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative p-7 sm:p-10 md:p-14 rounded-3xl bg-vipro-purple dark:bg-[#140814] shadow-2xl overflow-hidden group text-white"
          >
            {/* Morphing Background Shape */}
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-vipro-gold/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 ease-in-out" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-vipro-gold flex items-center justify-center mb-5 sm:mb-8 shadow-lg shadow-vipro-gold/30 text-vipro-purple">
                <Eye className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-vipro-beige mb-4 sm:mb-6">{content?.visionTitle || "Our Vision"}</h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed italic font-serif">
                &quot;{content?.visionText || "A self-reliant society where women lead community transformation, inspiring generations to build an equitable and prosperous future for all."}&quot;
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
