import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const artwork = artworkRef.current;
    const text = textRef.current;
    const scrollCue = scrollCueRef.current;

    if (!section || !artwork || !text) return;

    const ctx = gsap.context(() => {
      // Load animation
      const loadTl = gsap.timeline({ delay: 0.3 });

      loadTl.fromTo(
        artwork,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
      );

      loadTl.fromTo(
        text.querySelectorAll('.reveal'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power2.out' },
        '-=0.8'
      );

      if (scrollCue) {
        loadTl.fromTo(
          scrollCue,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.3'
        );
      }

      // Scroll exit
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.5,
          onLeaveBack: () => {
            gsap.set(artwork, { opacity: 1, scale: 1 });
            gsap.set(text.querySelectorAll('.reveal'), { opacity: 1, y: 0 });
          },
        },
      });

      scrollTl.fromTo(
        artwork,
        { scale: 1, opacity: 1 },
        { scale: 1.15, opacity: 0.3, ease: 'power2.in' },
        0.6
      );

      scrollTl.fromTo(
        text.querySelectorAll('.reveal'),
        { y: 0, opacity: 1 },
        { y: -50, opacity: 0, stagger: 0.05, ease: 'power2.in' },
        0.6
      );

      if (scrollCue) {
        scrollTl.fromTo(
          scrollCue,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.4
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`gallery-section bg-[#F8F7F4] ${className}`}
    >
      {/* Full-bleed Dan Rice Artwork */}
      <div
        ref={artworkRef}
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/1000059981.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Subtle gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F8F7F4]/80" />

      {/* Centered Text */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <p className="reveal label-mono text-[#1A1A1A] mb-6">
          In Memory Of
        </p>
        <h1 className="reveal title-hero text-[#1A1A1A] mb-4">
          Jacquelin Anne
          <br />
          <span className="italic">Hellenberg</span>
        </h1>
        <p className="reveal text-lg text-[rgba(26,26,26,0.6)] font-light tracking-wide">
          1987 — 2025
        </p>
        <p className="reveal body-text text-[rgba(26,26,26,0.5)] mt-8 max-w-md mx-auto">
          A life lived in color. Daughter, artist, friend.
          Her spirit lives on in the paintings she loved.
        </p>
      </div>

      {/* Scroll Cue */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="label-mono text-[#1A1A1A]">Scroll</span>
        <div className="scroll-line text-[#1A1A1A]" />
      </div>
    </section>
  );
}
