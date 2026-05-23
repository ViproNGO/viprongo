"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export function ContactSection({ whatsapp, contactData }: { whatsapp?: string; contactData?: any }) {
  const whatsappUrl = whatsapp || "https://wa.me/919876543210";
  const finalDirectorImage = contactData?.directorImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop";
  const phone1 = contactData?.phone1 || "+91 98765 43210";
  const phone2 = contactData?.phone2 || "";
  const email1 = contactData?.email1 || "contact@vipro.org";
  const email2 = contactData?.email2 || "";
  const headoffice = contactData?.headoffice || "123 Empowerment Way, VIPRO Building, Near Community Center, Chennai, Tamil Nadu, India - 600001";
  const mapLink = contactData?.mapLink || "https://maps.app.goo.gl/dez7vr4AwcfmEiGo7";

  // If the server-side resolved mapQuery is available, use it directly to guarantee the exact pin displays!
  // Otherwise, fall back to parsing mapLink.
  let iframeQuery = contactData?.mapQuery || mapLink;
  
  if (!contactData?.mapQuery) {
    if (mapLink.includes("maps.app.goo.gl")) {
      // It's a short web link, so we fall back to the head office address (cleaned up of newlines and typos)
      iframeQuery = headoffice
        .replace(/\r?\n/g, ", ")
        .replace(/\s+/g, " ")
        .replace(/Karimangalam\s+Talurk/gi, "Karimangalam Taluk")
        .trim();
    } else if (mapLink.startsWith("http")) {
      // If it's a long Google Maps link, check if we can extract coordinates
      const coordMatch = mapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || mapLink.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        iframeQuery = `${coordMatch[1]},${coordMatch[2]}`;
      } else {
        iframeQuery = headoffice
          .replace(/\r?\n/g, ", ")
          .replace(/\s+/g, " ")
          .replace(/Karimangalam\s+Talurk/gi, "Karimangalam Taluk")
          .trim();
      }
    } else {
      // If it's already coordinates or an address query, replace any newlines/typos just in case
      iframeQuery = mapLink
        .replace(/\r?\n/g, ", ")
        .replace(/\s+/g, " ")
        .replace(/Karimangalam\s+Talurk/gi, "Karimangalam Taluk")
        .trim();
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-[#120a12] relative overflow-hidden">
      {/* Floating WhatsApp Button */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
        <span className="absolute right-full mr-3 sm:mr-4 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-vipro-magenta font-semibold tracking-wider uppercase text-xs sm:text-sm mb-3 sm:mb-4">Get in Touch</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-vipro-purple dark:text-vipro-beige leading-tight">
            We&apos;d Love to Hear From You
          </h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          
          {/* Contact Details & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="bg-gray-50 dark:bg-white/5 p-4 sm:p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-vipro-magenta/10 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-vipro-magenta" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Phone</h4>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{phone1}</p>
                {phone2 && phone2.trim() !== "" && phone2.trim() !== "undefined" && (
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{phone2}</p>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-4 sm:p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-vipro-gold/10 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-vipro-gold" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Email</h4>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm break-all">{email1}</p>
                {email2 && email2.trim() !== "" && email2.trim() !== "undefined" && (
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm break-all">{email2}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-4 sm:p-6 rounded-2xl flex items-start space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-vipro-purple/10 dark:bg-vipro-purple-light/20 shrink-0 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-vipro-purple dark:text-vipro-purple-light" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Head Office</h4>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {headoffice}
                </p>
              </div>
            </div>

            {/* Live Interactive Maps Frame */}
            <div className="w-full h-52 sm:h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden relative shadow-inner border border-gray-100 dark:border-white/5 group">
              <iframe
                title="VIPRO NGO Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(iframeQuery)}&z=15&output=embed`}
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              {/* Premium Floating "Get Directions" navigation overlay */}
              <a 
                href={mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(headoffice)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-vipro-purple dark:bg-vipro-magenta hover:bg-vipro-purple-light dark:hover:bg-vipro-magenta/80 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-black/30 hover:scale-105 transition-all flex items-center space-x-1.5 z-10 border border-white/10"
              >
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>
          </motion.div>

          {/* Director Presentation Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#1a0f1a] p-6 sm:p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 group"
          >
            <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-md border-4 border-vipro-magenta/10 dark:border-white/10 group-hover:border-vipro-magenta/30 transition-colors duration-500">
              {/* Decorative accent element */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              
              <img 
                src={finalDirectorImage} 
                alt="Venkatesan G - Director" 
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-2xl sm:text-3xl font-serif font-bold text-vipro-purple dark:text-vipro-beige tracking-wide">
                Venkatesan G
              </h4>
              <div className="inline-block px-4 py-1.5 bg-vipro-magenta/10 dark:bg-vipro-magenta/20 rounded-full border border-vipro-magenta/25">
                <span className="text-vipro-magenta dark:text-vipro-magenta-light font-bold text-xs tracking-wider uppercase">
                  Director
                </span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm italic leading-relaxed">
              &ldquo;Empowering women is the most effective way to elevate families and communities to a brighter, more sustainable future.&rdquo;
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
