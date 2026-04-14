import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ClosingSectionProps {
  className?: string;
}

export default function ClosingSection({ className = '' }: ClosingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const ochreFieldRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const ochreField = ochreFieldRef.current;
    const portrait = portraitRef.current;
    const text = textRef.current;

    if (!section || !ochreField || !portrait || !text) return;

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
        ochreField,
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
        text,
        { x: '-12vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // SETTLE phase (30% - 70%) - elements hold position

      // EXIT phase (70% - 100%)
      scrollTl.fromTo(
        ochreField,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        portrait,
        { y: 0, opacity: 1 },
        { y: '-14vh', opacity: 0, ease: 'power2.in' },
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
      {/* Ochre Painted Field */}
      <div
        ref={ochreFieldRef}
        className="painted-field painted-field-ochre"
        style={{
          left: '18vw',
          top: '10vh',
          width: '70vw',
          height: '74vh',
          transform: 'rotate(-2deg)',
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
          src="/images/closing_portrait.jpg"
          alt="Jacquelin - A Life in Color"
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
          maxWidth: '38vw',
        }}
      >
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#D4A03F] block mb-3">
          Final Chapter
        </span>
        <h2 className="text-[clamp(32px,3.6vw,54px)] font-serif text-[#F7F7F5] leading-[1.1] mb-4">
          A life in color
        </h2>
        <p className="text-[clamp(13px,1.1vw,16px)] text-[rgba(247,247,245,0.72)] font-light leading-relaxed mb-4">
          Jacquelin believed the world was worth beautifying. She did exactly that—
          one gesture, one canvas, one kindness at a time.
        </p>
        <p className="text-[clamp(11px,0.9vw,13px)] text-[rgba(247,247,245,0.5)] font-light">
          Thank you for remembering with us.
        </p>
      </div>
    </section>
  );
}
