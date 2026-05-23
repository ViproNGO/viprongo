"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Lock } from "lucide-react";
import { LoginModal } from "@/components/AdminPanel";

const NAV_LINKS = [
  { name: "Home", href: "/#home" },
  { name: "About", href: "/#about" },
  { name: "Programs", href: "/#programs" },
  { name: "Impact", href: "/#impact" },
  { name: "Gallery", href: "/#gallery" },
];

export default function Navbar({ isAdmin, logo }: { isAdmin?: boolean; logo?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && (pathname === "/" || pathname === "")) {
      e.preventDefault();
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md dark:bg-vipro-purple/80 border-b border-gray-200 dark:border-vipro-purple-light transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-2xl font-serif font-bold text-vipro-purple dark:text-vipro-beige"
              >
                VIPRO NGO
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-gray-700 dark:text-gray-200 hover:text-vipro-magenta dark:hover:text-vipro-gold font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {!isAdmin && (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="p-2 text-gray-500 hover:text-vipro-purple transition-colors"
                  title="Admin Login"
                >
                  <Lock className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 dark:text-gray-200 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-vipro-purple shadow-xl"
            >
              <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="block px-3 py-2.5 text-base font-medium text-gray-800 dark:text-gray-200 hover:text-vipro-magenta dark:hover:text-vipro-gold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Admin Login — mobile */}
                {!isAdmin && (
                  <>
                    <div className="border-t border-gray-100 dark:border-white/10 my-2" />
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setIsLoginOpen(true);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-vipro-purple dark:text-vipro-gold hover:bg-vipro-purple/5 dark:hover:bg-white/5 rounded-xl transition-colors w-full text-left"
                    >
                      <Lock className="w-5 h-5 shrink-0" />
                      Admin Login
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
