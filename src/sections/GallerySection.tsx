import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GallerySectionProps {
  className?: string;
}

const galleryImages = [
  { src: '/images/hero_portrait.jpg', alt: 'Jacquelin', span: 'col-span-1 row-span-2' },
  { src: '/images/childhood_photo.jpg', alt: 'Early years', span: 'col-span-1' },
  { src: '/images/father_photo.jpg', alt: 'With her father', span: 'col-span-1' },
  { src: '/images/artist_photo.jpg', alt: 'In the studio', span: 'col-span-2' },
  { src: '/images/friends_photo.jpg', alt: 'With friends', span: 'col-span-1' },
  { src: '/images/closing_portrait.jpg', alt: 'Her light', span: 'col-span-1 row-span-2' },
  { src: '/images/gallery_01.jpg', alt: 'Reading', span: 'col-span-1' },
  { src: '/images/gallery_04.jpg', alt: 'Laughter', span: 'col-span-1' },
  { src: '/images/gallery_06.jpg', alt: 'In the garden', span: 'col-span-2' },
];

export default function GallerySection({ className = '' }: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;

    if (!section || !header || !grid) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header.querySelectorAll('.reveal'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Grid items animation
      const items = grid.querySelectorAll('.gallery-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
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
      id="gallery"
      className={`relative bg-[#F8F7F4] py-32 lg:py-48 ${className}`}
    >
      {/* Section Header */}
      <div ref={headerRef} className="px-8 lg:px-16 mb-16">
        <p className="reveal label-mono text-[#1A1A1A] mb-4">Moments in Time</p>
        <h2 className="reveal title-section text-[#1A1A1A]">
          A Life in Photographs
        </h2>
      </div>

      {/* Gallery Grid */}
      <div 
        ref={gridRef}
        className="px-8 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3"
      >
        {galleryImages.map((image, index) => (
          <div 
            key={index}
            className={`gallery-item ${image.span} group relative overflow-hidden`}
          >
            <div className="artwork-frame w-full h-full">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                style={{ 
                  minHeight: image.span.includes('row-span-2') ? '500px' : '240px',
                  filter: 'grayscale(15%)'
                }}
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>
        ))}
      </div>

      {/* Bottom Note */}
      <div className="px-8 lg:px-16 mt-16 text-center">
        <p className="body-text text-[rgba(26,26,26,0.5)]">
          "Every photograph is a certificate of presence."
          <br />
          <span className="label-mono not-italic mt-2 block">— Roland Barthes</span>
        </p>
      </div>
    </section>
  );
}
