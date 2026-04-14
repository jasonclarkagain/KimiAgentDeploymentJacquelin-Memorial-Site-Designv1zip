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
      const loadTl = gsap.timeline({ delay: 0.3 });

      loadTl.fromTo(
        artwork,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' }
      );

      loadTl.fromTo(
        text.querySelectorAll('.reveal'),
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.18, ease: 'power2.out' },
        '-=1.0'
      );

      if (scrollCue) {
        loadTl.fromTo(
          scrollCue,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.3'
        );
      }

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
        { scale: 1.12, opacity: 0.4, ease: 'power2.in' },
        0.5
      );

      scrollTl.fromTo(
        text.querySelectorAll('.reveal'),
        { y: 0, opacity: 1 },
        { y: -50, opacity: 0, stagger: 0.05, ease: 'power2.in' },
        0.5
      );

      if (scrollCue) {
        scrollTl.fromTo(
          scrollCue,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.3
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`gallery-section ${className}`}
      style={{ background: '#F5F0E8' }}
    >
      {/* Light Dan Rice Painting — full bleed background */}
      <div
        ref={artworkRef}
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/1000059979.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Very light scrim so white text reads clearly */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Centered Text */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <p className="reveal label-mono text-white/70 mb-6 tracking-[0.3em]">
          In Memory Of
        </p>
        <h1 className="reveal font-serif text-white mb-4"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em' }}
        >
          Jacquelin Anne
          <br />
          <em>Hellenberg</em>
        </h1>
        <p className="reveal text-white/80 font-light tracking-widest text-lg mt-4">
          1965 — 2025
        </p>
        <p className="reveal body-text text-white/60 mt-8 max-w-md mx-auto">
          A life lived in color. Daughter, artist, friend.
          Her spirit lives on in the paintings she loved.
        </p>
      </div>

      {/* Scroll Cue */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="label-mono text-white/60">Scroll</span>
        <div className="scroll-line text-white" />
      </div>
    </section>
  );
}
