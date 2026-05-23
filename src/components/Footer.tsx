interface FooterProps {
  logo?: string;
  instagram?: string;
  facebook?: string;
  x?: string;
}

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer({ logo, instagram, facebook, x }: FooterProps) {
  const instagramUrl = instagram || "https://instagram.com/viprongotamilnadu";
  const facebookUrl = facebook || "https://facebook.com/viprongo";
  const xUrl = x || "https://x.com/viprongo";

  return (
    <footer className="bg-vipro-purple text-vipro-beige py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Brand Text */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-serif font-bold text-white tracking-wider">VIPRO NGO</h3>
        </div>

        {/* Follow us on section */}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold font-serif">
            Follow us on
          </span>
          <div className="flex justify-center items-center space-x-6">
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-vipro-gold transition-all duration-300 hover:scale-110 p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 shadow-md"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-vipro-gold transition-all duration-300 hover:scale-110 p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 shadow-md"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a 
              href={xUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-vipro-gold transition-all duration-300 hover:scale-110 p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 shadow-md"
              aria-label="X (formerly Twitter)"
            >
              <XIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="pt-6 border-t border-white/5 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} VIPRO. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}


