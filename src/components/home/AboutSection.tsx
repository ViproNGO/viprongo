"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Briefcase, Heart } from "lucide-react";
import Image from "next/image";

const aboutCards = [
  {
    icon: Users,
    title: "SHG Support",
    desc: "Forming and nurturing Self-Help Groups to build collective strength and financial independence.",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
  },
  {
    icon: BookOpen,
    title: "Skill Training",
    desc: "Providing professional tailoring and vocational training to create employable skills.",
    color: "bg-vipro-magenta/10 text-vipro-magenta"
  },
  {
    icon: Briefcase,
    title: "Economic Independence",
    desc: "Connecting trained women with employment and entrepreneurship opportunities.",
    color: "bg-vipro-gold/10 text-vipro-gold"
  },
  {
    icon: Heart,
    title: "Social Transformation",
    desc: "Creating a ripple effect of empowerment that transforms entire communities.",
    color: "bg-vipro-purple/10 text-vipro-purple dark:bg-vipro-purple-light/20 dark:text-vipro-purple-light"
  }
];

export function AboutSection({ content }: { content?: any }) {
  return (
    <section id="about" className="py-24 bg-white dark:bg-[#120a12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-vipro-magenta font-semibold tracking-wider uppercase text-sm">About VIPRO</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-vipro-purple dark:text-vipro-beige">
                {content?.title || "A Journey of Hope & Empowerment"}
              </h3>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {content?.description1 || "For over a decade, VIPRO has been at the forefront of social transformation. We believe that when you empower a woman, you empower a family, a community, and ultimately, a nation."}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {content?.description2 || "Through targeted interventions in rural and urban areas, we provide women with the tools they need—be it through Self-Help Groups (SHGs), rigorous skill development, or access to livelihood opportunities—to rewrite their destinies."}
            </p>
            

          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {aboutCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 hover:shadow-xl transition-shadow border border-gray-100 dark:border-white/10 group"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
