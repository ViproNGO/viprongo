import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScrolling } from "@/components/SmoothScrolling";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AdminPanel } from "@/components/AdminPanel";
import { cookies } from "next/headers";
import { fetchCmsData } from "@/lib/cms";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIPRO - Empowering Women. Transforming Communities.",
  description: "Village People Renaissance Organisation (VIPRO) is building a stronger future for women through skill development, self-help groups, and sustainable empowerment.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('auth_token')?.value === 'admin-session-token-vipro-2026';

  let logo = "";
  let socialLinks = { instagram: "", facebook: "", x: "" };
  try {
    const cmsData = await fetchCmsData();
    logo = cmsData.content?.general?.logo || "";
    socialLinks = {
      instagram: cmsData.content?.general?.instagram || "",
      facebook: cmsData.content?.general?.facebook || "",
      x: cmsData.content?.general?.x || "",
    };
  } catch (error) {
    console.error("Failed to load CMS logo/links for layout:", error);
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans">
        <SmoothScrolling>
          <Navbar isAdmin={isAdmin} logo={logo} />
          <main className="flex-grow">{children}</main>
          <Footer 
            logo={logo} 
            instagram={socialLinks.instagram} 
            facebook={socialLinks.facebook} 
            x={socialLinks.x} 
          />
        </SmoothScrolling>
        {isAdmin && <AdminPanel />}
      </body>
    </html>
  );
}
