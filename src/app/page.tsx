import { fetchCmsData } from "@/lib/cms";

import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { MissionVisionSection } from "@/components/home/MissionVisionSection";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { ImpactStoriesSection } from "@/components/home/ImpactStoriesSection";
import { GallerySection } from "@/components/home/GallerySection";
import { ContactSection } from "@/components/home/ContactSection";

export default async function Home() {
  // Fetch CMS Data server-side from Google Sheets or fallback
  const cmsData = await fetchCmsData();

  const { sections, content, gallery, stories } = cmsData;

  return (
    <>
      {sections.hero && <HeroSection content={content.hero} logo={content.general?.logo} />}
      {sections.about && <AboutSection content={content.about} />}
      {sections.mission && <MissionVisionSection content={content.mission} />}
      {sections.programs && <ProgramsSection />}
      {sections.impact && <ImpactStoriesSection stories={stories} />}
      {sections.gallery && <GallerySection galleryData={gallery} />}
      {sections.contact && <ContactSection whatsapp={content.general?.whatsapp} contactData={content.contact} />}
    </>
  );
}

