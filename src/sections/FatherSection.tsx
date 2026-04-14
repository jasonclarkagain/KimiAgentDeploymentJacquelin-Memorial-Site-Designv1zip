import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FatherSectionProps {
  className?: string;
}

export default function FatherSection({ className = '' }: FatherSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const creamFieldRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const creamField = creamFieldRef.current;
    const portrait = portraitRef.current;
    const text = textRef.current;
    const caption = captionRef.current;

    if (!section || !creamField || !portrait || !text) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE phase (0% - 30%)
      scrollTl.fromTo(
        creamField,
        { x: '70vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        portrait,
        { x: '40vw', opacity: 0, scale: 0.97 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        text,
        { x: '-12vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      );

      if (caption) {
        scrollTl.fromTo(
          caption,
          { x: '10vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.12
        );
      }

      // SETTLE phase (30% - 70%) - elements hold position

      // EXIT phase (70% - 100%)
      scrollTl.fromTo(
        creamField,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        portrait,
        { x: 0, opacity: 1 },
        { x: '-16vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        text,
        { x: 0, opacity: 1 },
        { x: '-6vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (caption) {
        scrollTl.fromTo(
          caption,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.7
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section-pinned bg-[#0B0B0D] ${className}`}
    >
      {/* Cream Painted Field */}
      <div
        ref={creamFieldRef}
        className="painted-field painted-field-cream"
        style={{
          left: '20vw',
          top: '10vh',
          width: '68vw',
          height: '74vh',
          transform: 'rotate(2deg)',
        }}
      />

      {/* Center Portrait */}
      <div
        ref={portraitRef}
        className="portrait-card absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 32vw, 480px)',
          height: 'clamp(380px, 56vh, 620px)',
        }}
      >
        <img
          src="/images/father_photo.jpg"
          alt="Jacquelin with her father"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Block */}
      <div
        ref={textRef}
        className="absolute"
        style={{
          left: '7vw',
          bottom: '12vh',
          maxWidth: '36vw',
        }}
      >
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#D4A03F] block mb-3">
          Chapter Two
        </span>
        <h2 className="text-[clamp(28px,3.2vw,50px)] font-serif text-[#F7F7F5] leading-[1.1] mb-4">
          Her father's influence
        </h2>
        <p className="text-[clamp(13px,1.1vw,16px)] text-[rgba(247,247,245,0.72)] font-light leading-relaxed">
          He taught her to look twice—at light, at people, at the ordinary magic 
          of a Tuesday afternoon. That attention became her signature.
        </p>
      </div>

      {/* Caption */}
      <div
        ref={captionRef}
        className="absolute"
        style={{
          right: '7vw',
          bottom: '12vh',
          maxWidth: '22vw',
          textAlign: 'right',
        }}
      >
        <p className="text-[clamp(11px,0.9vw,13px)] text-[rgba(247,247,245,0.5)] font-light italic">
          "Some lessons are written in memory, not ink."
        </p>
      </div>
    </section>
  );
}
