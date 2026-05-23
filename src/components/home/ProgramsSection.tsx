"use client";

import { motion } from "framer-motion";
import { Scissors, Users, Lightbulb, GraduationCap, ShieldCheck, TrendingUp } from "lucide-react";

const programs = [
  {
    icon: Users,
    title: "SHG Development",
    desc: "Mobilizing women into Self-Help Groups, providing micro-finance training, and fostering leadership."
  },
  {
    icon: Scissors,
    title: "Tailoring Training",
    desc: "Comprehensive garment making and tailoring courses equipping women with immediate earning skills."
  },
  {
    icon: Lightbulb,
    title: "Entrepreneurship",
    desc: "Mentorship and seed funding support to help women launch and sustain their own micro-businesses."
  },
  {
    icon: ShieldCheck,
    title: "Women Employment",
    desc: "Partnering with local industries to provide direct placement for our trained beneficiaries."
  },
  {
    icon: GraduationCap,
    title: "Skill Workshops",
    desc: "Short-term workshops on digital literacy, financial management, and advanced craft skills."
  },
  {
    icon: TrendingUp,
    title: "Community Upliftment",
    desc: "Holistic development programs addressing health, sanitation, and child education in rural areas."
  }
];

export function ProgramsSection() {
  return (
    <section id="programs" className="py-24 bg-white dark:bg-[#120a12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-vipro-magenta font-semibold tracking-wider uppercase text-sm mb-4"
          >
            Our Initiatives
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-vipro-purple dark:text-vipro-beige mb-6"
          >
            Programs That Drive Change
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            Our diverse range of programs are designed to provide end-to-end support, ensuring women achieve lasting economic and social independence.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog, idx) => (
            <motion.div
              key={prog.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-vipro-beige dark:bg-white/5 rounded-3xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-vipro-magenta/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-vipro-magenta/10 to-transparent rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-150" />
              
              <div className="relative z-10">
                <prog.icon className="w-10 h-10 text-vipro-purple dark:text-vipro-gold mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{prog.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                  {prog.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

