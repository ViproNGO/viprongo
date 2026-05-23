import { fetchCmsData } from "@/lib/cms";
import { GallerySection } from "@/components/home/GallerySection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery — VIPRO NGO | Moments of Livelihood & Lived Impact",
  description:
    "Explore the full photo gallery of VIPRO NGO — witness the transformative activities, self-help group meetings, skill training programs, and community events that define our mission.",
};

export default async function GalleryPage() {
  let gallery: any[] = [];

  try {
    const cmsData = await fetchCmsData();
    gallery = cmsData.gallery || [];
  } catch (error) {
    console.error("Failed to fetch gallery data:", error);
  }

  return (
    <>
      {/* Page Hero Banner */}
      <div className="relative bg-vipro-purple dark:bg-[#0f070f] overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-vipro-magenta/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-vipro-gold/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 sm:pt-32 sm:pb-16 text-center">
          <p className="text-vipro-gold font-semibold tracking-[0.2em] uppercase text-xs sm:text-sm mb-3 sm:mb-4">
            Full Activity Gallery
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
            Moments of Livelihood<br />
            <span className="text-vipro-magenta">&amp; Lived Impact</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every photo tells a story of courage, resilience, and transformation.
            Browse through all of our activity stacks from self-help group meetings,
            vocational training, and community programs.
          </p>

          {gallery.length > 0 && (
            <div className="mt-6 inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-sm font-medium backdrop-blur-sm">
              {gallery.length} Activity Stack{gallery.length !== 1 ? "s" : ""} documented
            </div>
          )}
        </div>
      </div>

      {/* Full Gallery — preview=false shows everything */}
      <GallerySection galleryData={gallery} preview={false} />
    </>
  );
}
