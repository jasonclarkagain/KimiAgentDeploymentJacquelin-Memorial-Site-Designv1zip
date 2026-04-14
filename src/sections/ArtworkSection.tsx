import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ArtworkSectionProps {
  className?: string;
}

const artworks = [
  { 
    src: '/images/1000059979.jpg', 
    title: 'Untitled (Aqua Field)',
    year: '2018'
  },
  { 
    src: '/images/1000059980.jpg', 
    title: 'Composition in Gray',
    year: '2019'
  },
  { 
    src: '/images/1000059984.jpg', 
    title: 'Color Study III',
    year: '2020'
  },
];

export default function ArtworkSection({ className = '' }: ArtworkSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const artworksRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const artworksContainer = artworksRef.current;

    if (!section || !title || !artworksContainer) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        title.querySelectorAll('.reveal'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Artworks stagger animation
      const items = artworksContainer.querySelectorAll('.artwork-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: artworksContainer,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="artwork"
      className={`relative bg-[#F8F7F4] py-32 lg:py-48 ${className}`}
    >
      {/* Section Header */}
      <div ref={titleRef} className="px-8 lg:px-16 mb-20">
        <p className="reveal label-mono text-[#1A1A1A] mb-4">The Art She Loved</p>
        <h2 className="reveal title-section text-[#1A1A1A] max-w-2xl">
          Dan Rice and the New York School
        </h2>
        <p className="reveal body-text text-[rgba(26,26,26,0.6)] max-w-xl mt-6">
          Jacquelin's family and Dan's were woven together by decades of friendship, 
          shared meals, and a mutual love for the transformative power of abstract art. 
          These paintings hung in her home, whispering their colors into her dreams.
        </p>
      </div>

      {/* Artworks Grid */}
      <div 
        ref={artworksRef}
        className="px-8 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
      >
        {artworks.map((artwork, index) => (
          <div 
            key={index}
            className="artwork-item group"
          >
            <div className="artwork-frame aspect-[4/5] overflow-hidden mb-4">
              <img
                src={artwork.src}
                alt={artwork.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex justify-between items-baseline">
              <h3 className="font-serif text-sm text-[#1A1A1A]">{artwork.title}</h3>
              <span className="label-mono text-[rgba(26,26,26,0.4)]">{artwork.year}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div className="px-8 lg:px-16 mt-24 max-w-2xl">
        <blockquote className="font-serif text-2xl lg:text-3xl text-[#1A1A1A] italic leading-relaxed">
          "Color is the place where our brain and the universe meet."
        </blockquote>
        <cite className="label-mono text-[rgba(26,26,26,0.5)] mt-4 block not-italic">
          — Paul Klee, an inspiration to the Abstract Expressionists
        </cite>
      </div>
    </section>
  );
}
