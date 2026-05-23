"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Images, ChevronLeft, ChevronRight, X, Layers } from "lucide-react";

// Premium Seed fallback data representing bilingual Activity Stacks
const fallbackActivities = [
  {
    id: "act_1",
    date: "2026-04-15",
    title: "Self-Help Group Meetings",
    descEn: "Self-Help Group members discussing microfinance and local community development goals.",
    descTa: "சுயஉதவி குழு உறுப்பினர்கள் நுண்கடன் மற்றும் உள்ளூர் கிராம வளர்ச்சி குறித்து விவாதித்தல்.",
    images: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "act_2",
    date: "2026-05-10",
    title: "Vocational Skill Training",
    descEn: "Women undergoing rigorous computer literacy and professional tailoring classes for self-employment.",
    descTa: "சுயதொழில் வாய்ப்புகளுக்காக பெண்கள் கணினி மற்றும் தொழில்முறை தையல் பயிற்சி பெறுதல்.",
    images: [
      "https://images.unsplash.com/photo-1574681656839-e41c4a01c80b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "act_3",
    date: "2026-05-20",
    title: "Community Development Projects",
    descEn: "Village community members actively building sustainable infrastructure and learning aids.",
    descTa: "கிராம மக்கள் தங்களது பகுதிகளில் நிலையான உள்கட்டமைப்பு வசதிகளை தாங்களாகவே ஏற்படுத்துதல்.",
    images: [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop"
    ]
  }
];

export function GallerySection({ galleryData }: { galleryData?: any[] }) {
  // Normalize and sort gallery items so that the newly added stack/newest date is displayed first
  const activities = (galleryData && galleryData.length > 0 ? galleryData : fallbackActivities)
    .map((act, index) => {
      const actImages = Array.isArray(act.images) 
        ? act.images 
        : (act.src ? [act.src] : (act.url ? [act.url] : []));

      const processedImages = actImages.map((img: string) => {
        if (typeof img === 'string' && (img.includes("lh3.googleusercontent.com") || img.includes("drive.google.com"))) {
          const match = img.match(/\/d\/([a-zA-Z0-9_-]+)/) || img.match(/id=([a-zA-Z0-9_-]+)/);
          if (match) {
            return `/api/image-proxy?id=${match[1]}`;
          }
        }
        return img;
      });

      return {
        ...act,
        title: act.title || act.category || "Activity",
        date: act.date || "",
        images: processedImages,
        index
      };
    })
    .sort((a, b) => {
      // 1. Primary sort: Date descending (newest first)
      if (a.date && b.date) {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        if (timeA !== timeB) {
          return timeB - timeA;
        }
      } else if (a.date) {
        return -1; // a has date, b doesn't -> a comes first
      } else if (b.date) {
        return 1;  // b has date, a doesn't -> b comes first
      }
      // 2. Secondary sort: Original index descending (newest rows appended to spreadsheet come first)
      return b.index - a.index;
    });

  // Lightroom / Lightbox State
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  const handleOpenLightbox = (activity: any) => {
    setSelectedActivity(activity);
    setActivePhotoIdx(0);
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedActivity) return;
    setActivePhotoIdx((prev) => (prev + 1) % selectedActivity.images.length);
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedActivity) return;
    setActivePhotoIdx((prev) => (prev - 1 + selectedActivity.images.length) % selectedActivity.images.length);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-24 bg-white dark:bg-[#120a12] relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-vipro-magenta/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-vipro-gold/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-vipro-magenta font-semibold tracking-wider uppercase text-xs sm:text-sm mb-3 sm:mb-4">Our Activity Gallery</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-vipro-purple dark:text-vipro-beige mb-3 sm:mb-6 leading-tight">
            Moments of Livelihood &amp; Lived Impact
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Browse through visual collections of various self-reliance programs, self-help groups, and vocational workshops undertaken by our organization.
          </p>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 lg:gap-10 pt-4"
        >
          {activities.map((act) => {
            const hasMultiple = act.images.length > 1;
            const primaryImg = act.images[0] || "https://images.unsplash.com/photo-1593113565632-475269f8ed53?q=80&w=800&auto=format&fit=crop";
            
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4 }}
                key={act.id}
                onClick={() => handleOpenLightbox(act)}
                className="relative cursor-pointer group flex flex-col"
              >
                {/* 3D Overlapping Card Stacks underneath if multiple photos exist */}
                {hasMultiple && (
                  <>
                    {/* Level 2 Background layer - Tilted slightly more */}
                    <div className="absolute inset-0 bg-[#e0cee0]/60 dark:bg-white/[0.02] rounded-3xl shadow-md translate-x-3 translate-y-3 rotate-3 scale-95 pointer-events-none border border-gray-100 dark:border-white/5 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4 group-hover:rotate-6" />
                    {/* Level 1 Background layer - Tilted slightly less */}
                    <div className="absolute inset-0 bg-[#eddced]/80 dark:bg-white/[0.04] rounded-3xl shadow-md translate-x-1.5 translate-y-1.5 rotate-1.5 scale-98 pointer-events-none border border-gray-100 dark:border-white/5 transition-transform duration-500 group-hover:translate-x-2.5 group-hover:translate-y-2.5 group-hover:rotate-3" />
                  </>
                )}

                {/* Primary Card Element */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl group-hover:shadow-2xl transition-shadow duration-500 flex-grow z-10">
                  <img 
                    src={primaryImg} 
                    alt={act.title} 
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1593113565632-475269f8ed53?q=80&w=800&auto=format&fit=crop";
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-4 right-4 z-20">
                    {/* Photo count badge */}
                    <div className="px-3 py-1 bg-vipro-purple/80 backdrop-blur-md rounded-full border border-white/10 flex items-center space-x-1 text-white shadow-lg">
                      <Images className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-bold tracking-wider">{act.images?.length || 1} {act.images?.length === 1 ? 'Photo' : 'Photos'}</span>
                    </div>
                  </div>
                </div>

                {/* Static details footer showing Date alone and Learn More option */}
                <div className="mt-4 flex items-center justify-between px-1 z-10">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-vipro-magenta" />
                    <span className="text-sm font-bold text-vipro-purple dark:text-vipro-beige">
                      {formatDate(act.date) || "No Date"}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium ml-2">
                      ({act.images?.length || 1} {act.images?.length === 1 ? 'photo' : 'photos'})
                    </span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLightbox(act);
                    }}
                    className="text-xs font-bold text-vipro-magenta hover:text-vipro-purple dark:hover:text-vipro-beige transition-colors flex items-center space-x-1 animate-pulse hover:animate-none"
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* FULL-SCREEN IMMERSIVE LIGHTBOX CAROUSEL MODAL */}
      <AnimatePresence>
        {selectedActivity && (
          <div 
            onClick={() => setSelectedActivity(null)}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8 select-none"
          >
            {/* Lightroom Card Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl bg-[#150d15] rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl flex flex-col lg:flex-row overflow-hidden max-h-[92vh] sm:max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 z-50 p-2.5 bg-black/50 border border-white/10 hover:bg-white/10 text-white rounded-full transition-colors backdrop-blur-md"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Dynamic Photo Slideshow Box */}
              <div className="flex-1 bg-black flex flex-col justify-between items-center relative aspect-video lg:aspect-auto lg:h-[70vh] min-h-[220px] sm:min-h-[300px]">
                {/* Active Image Frame */}
                <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden p-6">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activePhotoIdx}
                      src={selectedActivity.images[activePhotoIdx]}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1593113565632-475269f8ed53?q=80&w=800&auto=format&fit=crop";
                      }}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-full max-h-full object-contain rounded-2xl shadow-xl"
                    />
                  </AnimatePresence>

                  {/* Left / Right Nav Arrows */}
                  {selectedActivity.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevPhoto}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 border border-white/10 hover:bg-white/10 text-white rounded-full transition-all hover:scale-105 active:scale-95 backdrop-blur-sm z-30"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNextPhoto}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 border border-white/10 hover:bg-white/10 text-white rounded-full transition-all hover:scale-105 active:scale-95 backdrop-blur-sm z-30"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Interactive Slider Thumbnail Strip at the bottom */}
                {selectedActivity.images.length > 1 && (
                  <div className="w-full bg-[#180f18]/60 backdrop-blur-md border-t border-white/5 py-4 px-6 overflow-x-auto flex justify-center space-x-3 scrollbar-none shrink-0 z-20">
                    {selectedActivity.images.map((imgUrl: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 hover:brightness-110 ${idx === activePhotoIdx ? 'border-vipro-magenta scale-105 shadow-md shadow-vipro-magenta/30' : 'border-transparent opacity-50'}`}
                      >
                        <img 
                          src={imgUrl} 
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1593113565632-475269f8ed53?q=80&w=800&auto=format&fit=crop";
                          }}
                          className="w-full h-full object-cover" 
                          alt="" 
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Activity details panel */}
              <div className="w-full lg:w-96 bg-[#1a0f1a] border-t lg:border-t-0 lg:border-l border-white/10 p-8 overflow-y-auto flex flex-col justify-between max-h-[40vh] lg:max-h-[70vh]">
                <div className="space-y-6 text-left">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-vipro-magenta/25 border border-vipro-magenta/40 text-vipro-magenta rounded-full text-[9px] font-bold uppercase tracking-wider">
                      Activity Stack
                    </span>
                    {selectedActivity.date && (
                      <div className="flex items-center space-x-1 text-gray-400 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-vipro-gold" />
                        <span>{formatDate(selectedActivity.date)}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-vipro-beige leading-snug">
                    {selectedActivity.title}
                  </h3>

                  <div className="space-y-4 pt-2">
                    {selectedActivity.descEn && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold tracking-wider text-vipro-gold uppercase">English Overview</span>
                        <p className="text-gray-300 text-sm leading-relaxed font-normal">
                          {selectedActivity.descEn}
                        </p>
                      </div>
                    )}

                    {selectedActivity.descTa && (
                      <div className="space-y-1.5 border-t border-white/5 pt-4">
                        <span className="text-[10px] font-bold tracking-wider text-vipro-gold uppercase">தமிழ் விளக்கம் (Tamil)</span>
                        <p className="text-vipro-beige/80 text-[13px] leading-relaxed font-normal italic font-serif">
                          {selectedActivity.descTa}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 mt-6 lg:mt-0">
                  <div className="flex items-center space-x-1">
                    <Layers className="w-4 h-4 text-gray-500" />
                    <span>Photo {activePhotoIdx + 1} of {selectedActivity.images.length}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedActivity(null)}
                    className="text-vipro-magenta font-semibold hover:underline"
                  >
                    Close Slider
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
