import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GallerySectionProps {
  className?: string;
}

const galleryImages = [
  { src: '/images/hero_portrait.jpg',    alt: 'Jacquelin',           span: 'col-span-1 row-span-2' },
  { src: '/images/nameplate_portrait.jpg', alt: 'Portrait',          span: 'col-span-1' },
  { src: '/images/childhood_photo.jpg',  alt: 'Early years',         span: 'col-span-1' },
  { src: '/images/gallery_01.jpg',       alt: 'A quiet moment',      span: 'col-span-2' },
  { src: '/images/gallery_02.jpg',       alt: 'Light and shadow',    span: 'col-span-1' },
  { src: '/images/gallery_03.jpg',       alt: 'Joy',                 span: 'col-span-1' },
  { src: '/images/closing_portrait.jpg', alt: 'Her light',           span: 'col-span-1 row-span-2' },
  { src: '/images/gallery_04.jpg',       alt: 'Laughter',            span: 'col-span-1' },
  { src: '/images/gallery_05.jpg',       alt: 'Outdoors',            span: 'col-span-1' },
  { src: '/images/artist_photo.jpg',     alt: 'In the studio',       span: 'col-span-2' },
  { src: '/images/gallery_06.jpg',       alt: 'In the garden',       span: 'col-span-1' },
  { src: '/images/gallery_07.jpg',       alt: 'Tender',              span: 'col-span-1' },
  { src: '/images/friends_photo.jpg',    alt: 'With friends',        span: 'col-span-2' },
  { src: '/images/gallery_08.jpg',       alt: 'Afternoon',           span: 'col-span-1' },
  { src: '/images/gallery_09.jpg',       alt: 'Golden hour',         span: 'col-span-1' },
  { src: '/images/father_photo.jpg',     alt: 'With her father',     span: 'col-span-1 row-span-2' },
  { src: '/images/gallery_10.jpg',       alt: 'At rest',             span: 'col-span-1' },
  { src: '/images/gallery_11.jpg',       alt: 'Wandering',           span: 'col-span-1' },
  { src: '/images/gallery_12.jpg',       alt: 'Full bloom',          span: 'col-span-2' },
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

      const items = grid.querySelectorAll('.gallery-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
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
      className={`relative bg-[#F5F0E8] py-32 lg:py-48 ${className}`}
    >
      {/* Section Header */}
      <div ref={headerRef} className="px-8 lg:px-16 mb-16">
        <p className="reveal label-mono text-[#1A1A1A] mb-4">Moments in Time</p>
        <h2 className="reveal title-section text-[#1A1A1A]">
          A Life in Photographs
        </h2>
        <p className="reveal body-text text-[rgba(26,26,26,0.55)] mt-4 max-w-lg">
          Jacquelin Anne Hellenberg, 1965 – 2025. Collected here are the images 
          that capture who she was — daughter, friend, spirit.
        </p>
      </div>

      {/* Full Gallery Grid */}
      <div
        ref={gridRef}
        className="px-8 lg:px-16 grid grid-cols-2 md:grid-cols-4 auto-rows-[240px] gap-2 lg:gap-3"
      >
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className={`gallery-item ${image.span} group relative overflow-hidden`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              style={{ filter: 'grayscale(10%)' }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
              <span className="label-mono text-white/80 text-[9px]">{image.alt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Note */}
      <div className="px-8 lg:px-16 mt-20 text-center">
        <p className="body-text text-[rgba(26,26,26,0.5)] italic font-serif text-xl">
          "Every photograph is a certificate of presence."
        </p>
        <span className="label-mono text-[rgba(26,26,26,0.35)] mt-3 block">— Roland Barthes</span>
      </div>
    </section>
  );
}
