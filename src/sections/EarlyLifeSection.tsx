import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EarlyLifeSectionProps {
  className?: string;
}

export default function EarlyLifeSection({ className = '' }: EarlyLifeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const slateFieldRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const slateField = slateFieldRef.current;
    const portrait = portraitRef.current;
    const label = labelRef.current;
    const text = textRef.current;

    if (!section || !slateField || !portrait || !label || !text) return;

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
        slateField,
        { x: '-70vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        portrait,
        { y: '45vh', opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        label,
        { x: '-12vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        text,
        { x: '-12vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.15
      );

      // SETTLE phase (30% - 70%) - elements hold position

      // EXIT phase (70% - 100%)
      scrollTl.fromTo(
        slateField,
        { x: 0, opacity: 1 },
        { x: '14vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        portrait,
        { x: 0, opacity: 1 },
        { x: '-14vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        [label, text],
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0, ease: 'power2.in' },
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
      {/* Slate Painted Field */}
      <div
        ref={slateFieldRef}
        className="painted-field painted-field-slate"
        style={{
          left: '16vw',
          top: '14vh',
          width: '72vw',
          height: '68vh',
          transform: 'rotate(-1deg)',
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
          width: 'clamp(260px, 30vw, 460px)',
          height: 'clamp(360px, 54vh, 600px)',
        }}
      >
        <img
          src="/images/childhood_photo.jpg"
          alt="Jacquelin's Early Life"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Chapter Label */}
      <div
        ref={labelRef}
        className="absolute"
        style={{
          left: '7vw',
          top: '10vh',
        }}
      >
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#D4A03F]">
          Chapter One
        </span>
      </div>

      {/* Text Block */}
      <div
        ref={textRef}
        className="absolute"
        style={{
          left: '7vw',
          bottom: '12vh',
          maxWidth: '34vw',
        }}
      >
        <h2 className="text-[clamp(32px,3.6vw,54px)] font-serif text-[#F7F7F5] leading-[1.1] mb-4">
          Early life
        </h2>
        <p className="text-[clamp(13px,1.1vw,16px)] text-[rgba(247,247,245,0.72)] font-light leading-relaxed">
          Born in the quiet of winter, Jacquelin grew up curious—collecting shells, 
          sketching clouds, and filling the margins of every notebook with color.
        </p>
      </div>
    </section>
  );
}
