import { useEffect, useState } from 'react';

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show navigation after scrolling past hero
      setIsVisible(scrollY > windowHeight * 0.5);
      
      // Check if we're in the contact section (light background)
      const contactSection = document.getElementById('contact-section');
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        setIsLight(rect.top < windowHeight * 0.5 && rect.bottom > 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}
    >
      <div 
        className={`transition-all duration-300 ${
          isLight 
            ? 'bg-[#F3EFE6]/90 backdrop-blur-sm' 
            : 'bg-[#0B0B0D]/80 backdrop-blur-sm'
        }`}
      >
        <div className="flex items-center justify-between px-6 lg:px-12 py-4">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero-section')}
            className={`text-left transition-colors ${
              isLight ? 'text-[#0B0B0D]' : 'text-[#F7F7F5]'
            }`}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase block opacity-60">
              In Memory Of
            </span>
            <span className="font-serif text-sm lg:text-base">
              Jacquelin Anne Hellenberg
            </span>
          </button>

          {/* Nav Links */}
          <div className="flex items-center gap-6 lg:gap-10">
            <button
              onClick={() => scrollToSection('gallery-section')}
              className={`font-mono text-[11px] tracking-[0.14em] uppercase transition-colors hover:opacity-70 ${
                isLight ? 'text-[#0B0B0D]' : 'text-[#F7F7F5]'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className={`font-mono text-[11px] tracking-[0.14em] uppercase transition-colors hover:opacity-70 ${
                isLight ? 'text-[#0B0B0D]' : 'text-[#F7F7F5]'
              }`}
            >
              Share a Memory
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
