"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

const events = [
  {
    title: "Annual SHG Convention",
    date: "15 Oct 2026",
    time: "10:00 AM - 4:00 PM",
    location: "VIPRO Main Center, Chennai",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Digital Literacy Workshop",
    date: "22 Oct 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Community Hall, Madurai",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Women Entrepreneurs Mela",
    date: "05 Nov 2026",
    time: "9:00 AM - 8:00 PM",
    location: "Exhibition Grounds, Trichy",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=800&auto=format&fit=crop"
  }
];

export function EventsSection() {
  return (
    <section id="events" className="py-24 bg-vipro-beige dark:bg-[#1a0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-vipro-magenta font-semibold tracking-wider uppercase text-sm mb-4">Upcoming Events</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-vipro-purple dark:text-vipro-beige">
              Join Our Community Gatherings
            </h3>
          </div>
          <button className="mt-6 md:mt-0 px-6 py-3 border-2 border-vipro-purple text-vipro-purple dark:border-vipro-beige dark:text-vipro-beige rounded-full font-semibold hover:bg-vipro-purple hover:text-white dark:hover:bg-vipro-beige dark:hover:text-vipro-purple transition-colors">
            View All Events
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white dark:bg-[#251525] rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-4 py-2 rounded-xl font-bold text-vipro-purple dark:text-vipro-gold">
                  {event.date}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 line-clamp-2">{event.title}</h4>
                
                <div className="space-y-3 mt-auto mb-8">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="w-5 h-5 mr-3 text-vipro-magenta" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-start text-gray-600 dark:text-gray-300">
                    <MapPin className="w-5 h-5 mr-3 text-vipro-magenta shrink-0 mt-0.5" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-gray-50 dark:bg-white/5 hover:bg-vipro-magenta hover:text-white text-vipro-purple dark:text-vipro-beige font-semibold rounded-xl transition-colors">
                  RSVP Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
