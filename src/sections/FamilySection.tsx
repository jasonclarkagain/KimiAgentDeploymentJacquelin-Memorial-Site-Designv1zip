import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FamilySectionProps {
  className?: string;
}

export default function FamilySection({ className = '' }: FamilySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;

    if (!section || !image || !text) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
        },
      });

      scrollTl.fromTo(
        image,
        { x: '30vw', opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        text.querySelectorAll('.reveal'),
        { x: '-10vw', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        image,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        text.querySelectorAll('.reveal'),
        { y: 0, opacity: 1 },
        { y: -30, opacity: 0, stagger: 0.03, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="family"
      className={`gallery-section bg-[#F0EDE6] ${className}`}
    >
      {/* Photo collage on the right */}
      <div
        ref={imageRef}
        className="absolute right-0 top-0 w-[55vw] h-full grid grid-cols-2 gap-1"
        style={{ gridTemplateRows: '1fr 1fr' }}
      >
        <div className="overflow-hidden">
          <img
            src="/images/father_photo.jpg"
            alt="Jacquelin with her father"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="overflow-hidden">
          <img
            src="/images/childhood_photo.jpg"
            alt="Childhood"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="overflow-hidden col-span-2">
          <img
            src="/images/friends_photo.jpg"
            alt="With friends"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Gradient to blend photos into bg */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F0EDE6] via-[#F0EDE6]/40 to-transparent pointer-events-none" />

      {/* Text Content */}
      <div
        ref={textRef}
        className="absolute left-8 lg:left-20 top-1/2 -translate-y-1/2 max-w-sm z-10"
      >
        <p className="reveal label-mono text-[#1A1A1A] mb-6">Family & Friends</p>
        <h2 className="reveal title-section text-[#1A1A1A] mb-8">
          The People<br />She Loved
        </h2>
        <div className="reveal space-y-4 body-text text-[rgba(26,26,26,0.7)]">
          <p>
            The Hellenbergs and the Rices were more than neighbors — they were
            family in every sense that mattered. Their homes shared walls,
            their children shared childhoods, and their dinner tables shared
            stories that stretched late into the night.
          </p>
          <p>
            Dan's studio was Jacquelin's second home. She grew up surrounded
            by the smell of oil paint and turpentine, watching canvases
            transform from blank voids into worlds of color.
          </p>
          <p className="italic font-serif text-base text-[rgba(26,26,26,0.6)]">
            "She had an eye. The kind that sees not just what is, but what could be."
            <br /><span className="label-mono not-italic text-[rgba(26,26,26,0.4)] text-[9px] mt-1 block">— Dan Rice</span>
          </p>
        </div>
      </div>
    </section>
  );
}
