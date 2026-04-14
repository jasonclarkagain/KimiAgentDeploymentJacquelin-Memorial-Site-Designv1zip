import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RememberedSectionProps {
  className?: string;
}

export default function RememberedSection({ className = '' }: RememberedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const slateFieldRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const slateField = slateFieldRef.current;
    const portrait = portraitRef.current;
    const text = textRef.current;

    if (!section || !slateField || !portrait || !text) return;

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
        { x: '70vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        portrait,
        { x: '-40vw', opacity: 0, scale: 0.97 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
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
        slateField,
        { x: 0, opacity: 1 },
        { x: '-14vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        portrait,
        { x: 0, opacity: 1 },
        { x: '16vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        text,
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
          width: 'clamp(280px, 32vw, 480px)',
          height: 'clamp(380px, 56vh, 620px)',
        }}
      >
        <img
          src="/images/friends_photo.jpg"
          alt="Jacquelin with friends"
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
          Chapter Four
        </span>
        <h2 className="text-[clamp(28px,3.2vw,50px)] font-serif text-[#F7F7F5] leading-[1.1] mb-4">
          Remembered by many
        </h2>
        <p className="text-[clamp(13px,1.1vw,16px)] text-[rgba(247,247,245,0.72)] font-light leading-relaxed">
          She was a friend who showed up—on porches, at openings, in the kitchen 
          with wine and good questions. Her circle was wide because her heart was wider.
        </p>
      </div>
    </section>
  );
}
