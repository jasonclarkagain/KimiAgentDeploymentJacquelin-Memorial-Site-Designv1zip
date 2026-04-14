import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './sections/HeroSection';
import ArtworkSection from './sections/ArtworkSection';
import FamilySection from './sections/FamilySection';
import GallerySection from './sections/GallerySection';
import MemorySection from './sections/MemorySection';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Global snap for pinned sections
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.2, max: 0.5 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-[#F8F7F4]">
      {/* Canvas Texture Overlay */}
      <div className="canvas-texture" />
      
      {/* Navigation */}
      <nav className="nav-minimal">
        <a href="#hero">Jacquelin Anne Hellenberg</a>
        <div className="flex gap-8">
          <a href="#artwork">Artwork</a>
          <a href="#family">Family</a>
          <a href="#gallery">Gallery</a>
          <a href="#memory">Memory</a>
        </div>
      </nav>
      
      {/* Sections */}
      <main className="relative">
        <HeroSection className="z-10" />
        <ArtworkSection className="z-20" />
        <FamilySection className="z-30" />
        <GallerySection className="z-40" />
        <MemorySection className="z-50" />
      </main>
    </div>
  );
}

export default App;
