import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NameSectionProps {
  className?: string;
}

export default function NameSection({ className = '' }: NameSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const creamFieldRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const creamField = creamFieldRef.current;
    const portrait = portraitRef.current;
    const text = textRef.current;

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
        { x: '60vw', scale: 1.08, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        portrait,
        { y: '40vh', scale: 0.96, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        text,
        { x: '-10vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // SETTLE phase (30% - 70%) - elements hold position

      // EXIT phase (70% - 100%)
      scrollTl.fromTo(
        creamField,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        portrait,
        { y: 0, opacity: 1 },
        { y: '-18vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        text,
        { x: 0, opacity: 1 },
        { x: '-6vw', opacity: 0, ease: 'power2.in' },
        0.7
      );
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
          left: '22vw',
          top: '12vh',
          width: '66vw',
          height: '70vh',
          transform: 'rotate(1deg)',
        }}
      />

      {/* Center Portrait */}
      <div
        ref={portraitRef}
        className="portrait-card absolute"
        style={{
          left: '50%',
          top: '48%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(240px, 28vw, 440px)',
          height: 'clamp(320px, 52vh, 580px)',
        }}
      >
        <img
          src="/images/nameplate_portrait.jpg"
          alt="Jacquelin Anne Hellenberg"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name Plate */}
      <div
        ref={textRef}
        className="absolute"
        style={{
          left: '7vw',
          bottom: '12vh',
          maxWidth: '40vw',
        }}
      >
        <h2 className="text-[clamp(28px,3.6vw,56px)] font-serif text-[#F7F7F5] leading-[1.1] mb-3">
          Jacquelin Anne
          <br />
          Hellenberg
        </h2>
        <p className="font-mono text-[clamp(14px,1.4vw,22px)] tracking-[0.1em] text-[#D4A03F] mb-4">
          1965 — 2025
        </p>
        <p className="text-[clamp(12px,1vw,15px)] text-[rgba(247,247,245,0.72)] font-light tracking-wide">
          Artist. Daughter. Friend.
        </p>
      </div>
    </section>
  );
}
