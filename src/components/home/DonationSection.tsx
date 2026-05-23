"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Heart } from "lucide-react";

export function DonationSection() {
  const [amount, setAmount] = useState(1000);
  const predefinedAmounts = [500, 1000, 2000, 5000];

  return (
    <section className="py-24 bg-vipro-beige dark:bg-[#1a0f1a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white dark:bg-[#251525] rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            
            {/* Visual Side */}
            <div className="relative p-12 lg:p-16 flex flex-col justify-center bg-vipro-magenta text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
              
              <div className="relative z-10">
                <Heart className="w-12 h-12 mb-8 text-vipro-gold animate-pulse" />
                <h3 className="text-4xl font-serif font-bold mb-6">
                  Your Support Creates Lasting Change
                </h3>
                <p className="text-lg text-white/90 leading-relaxed mb-8">
                  Sponsor a woman&apos;s training today. When you donate to VIPRO, you&apos;re not just giving money; you&apos;re giving the gift of self-reliance, dignity, and a brighter future.
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Goal: ₹500,000</span>
                    <span>Raised: ₹350,000</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-3">
                    <div className="bg-vipro-gold h-3 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Make a Donation</h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {predefinedAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-3 rounded-xl font-semibold transition-colors ${
                      amount === amt 
                        ? "bg-vipro-purple text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vipro-magenta"
                  />
                </div>
              </div>

              <button className="w-full py-4 bg-vipro-gold hover:bg-yellow-500 text-vipro-purple font-bold rounded-xl text-lg shadow-lg shadow-vipro-gold/30 transition-all hover:-translate-y-1">
                Donate via UPI / Razorpay
              </button>

              <p className="text-sm text-center text-gray-500 mt-6">
                All donations are eligible for tax exemption under section 80G of the Income Tax Act.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
