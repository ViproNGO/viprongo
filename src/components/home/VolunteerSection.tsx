"use client";

import { motion } from "framer-motion";
import { HandHeart, Upload, ArrowRight } from "lucide-react";

export function VolunteerSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#120a12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-vipro-magenta/10 text-vipro-magenta px-4 py-2 rounded-full text-sm font-semibold">
              <HandHeart className="w-4 h-4" />
              <span>Join the Movement</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-vipro-purple dark:text-vipro-beige leading-tight">
              Become a Catalyst <br/>for Change
            </h3>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Whether you have skills to share, time to give, or resources to provide, your contribution can make a profound impact on the lives of women in our communities.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-6">
              <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Volunteer</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Join our on-ground activities and community outreach programs.</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Trainer</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share your expertise in tailoring, finance, or business management.</p>
              </div>
            </div>
          </motion.div>

          {/* Application Form */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-vipro-beige dark:bg-[#251525] p-10 md:p-12 rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-vipro-purple/10 rounded-full blur-3xl -mt-10 -mr-10" />
            
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Application Form</h4>
            
            <form className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <input type="text" id="fname" className="peer w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-vipro-purple focus:ring-1 focus:ring-vipro-purple outline-none transition-all placeholder-transparent" placeholder="First Name" />
                  <label htmlFor="fname" className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-vipro-purple bg-vipro-beige dark:bg-[#251525] px-1">First Name</label>
                </div>
                <div className="space-y-2 relative">
                  <input type="text" id="lname" className="peer w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-vipro-purple focus:ring-1 focus:ring-vipro-purple outline-none transition-all placeholder-transparent" placeholder="Last Name" />
                  <label htmlFor="lname" className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-vipro-purple bg-vipro-beige dark:bg-[#251525] px-1">Last Name</label>
                </div>
              </div>

              <div className="space-y-2 relative">
                <input type="email" id="email" className="peer w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-vipro-purple focus:ring-1 focus:ring-vipro-purple outline-none transition-all placeholder-transparent" placeholder="Email Address" />
                <label htmlFor="email" className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-vipro-purple bg-vipro-beige dark:bg-[#251525] px-1">Email Address</label>
              </div>

              <div className="space-y-2 relative">
                <select className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 focus:border-vipro-purple focus:ring-1 focus:ring-vipro-purple outline-none appearance-none">
                  <option value="" disabled selected>I want to join as a...</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="trainer">Trainer</option>
                  <option value="partner">Partner NGO</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 flex flex-col items-center justify-center bg-white/50 dark:bg-black/10 hover:bg-white dark:hover:bg-black/20 transition-colors cursor-pointer group">
                <Upload className="w-8 h-8 text-vipro-purple/50 dark:text-vipro-beige/50 group-hover:text-vipro-purple dark:group-hover:text-vipro-beige mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Upload Resume / Profile (Optional)</span>
              </div>

              <button type="button" className="w-full py-4 bg-vipro-purple hover:bg-vipro-purple-light text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors">
                <span>Submit Application</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
