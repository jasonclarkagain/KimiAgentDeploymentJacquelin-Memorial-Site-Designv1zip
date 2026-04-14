import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, Send, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface MemorySectionProps {
  className?: string;
}

interface Candle {
  id: number;
  name: string;
}

interface Memory {
  id: number;
  name: string;
  message: string;
}

export default function MemorySection({ className = '' }: MemorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [candles, setCandles] = useState<Candle[]>([
    { id: 1, name: 'The Rice Family' },
    { id: 2, name: 'Sarah M.' },
    { id: 3, name: 'David H.' },
    { id: 4, name: 'Emma L.' },
  ]);
  const [memories, setMemories] = useState<Memory[]>([
    { 
      id: 1, 
      name: 'Dan Rice', 
      message: 'Jacquelin had the rare gift of seeing beauty in the ordinary. Her visits to my studio were always filled with thoughtful questions and genuine wonder. She will be deeply missed.' 
    },
    { 
      id: 2, 
      name: 'Margaret', 
      message: 'Thank you for teaching me to look at paintings differently—to see the emotion behind the brushstroke. Your light continues to shine.' 
    },
  ]);
  const [newCandleName, setNewCandleName] = useState('');
  const [newMemoryName, setNewMemoryName] = useState('');
  const [newMemoryMessage, setNewMemoryMessage] = useState('');
  const [showCandleForm, setShowCandleForm] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const content = contentRef.current;

    if (!section || !header || !content) return;

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

      gsap.fromTo(
        content.querySelectorAll('.animate-in'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const lightCandle = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCandleName.trim()) {
      setCandles([...candles, { id: Date.now(), name: newCandleName }]);
      setNewCandleName('');
      setShowCandleForm(false);
    }
  };

  const shareMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoryName.trim() && newMemoryMessage.trim()) {
      setMemories([...memories, { id: Date.now(), name: newMemoryName, message: newMemoryMessage }]);
      setNewMemoryName('');
      setNewMemoryMessage('');
      setShowMemoryForm(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="memory"
      className={`relative bg-[#1A1A1A] text-[#F8F7F4] py-32 lg:py-48 ${className}`}
    >
      {/* Subtle Artwork Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(/images/1000060032.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 px-8 lg:px-16 max-w-5xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <p className="reveal label-mono text-[rgba(248,247,244,0.5)] mb-4">Leave a Light</p>
          <h2 className="reveal title-section text-[#F8F7F4] mb-6">
            Share a Memory
          </h2>
          <p className="reveal body-text text-[rgba(248,247,244,0.6)] max-w-xl mx-auto">
            If you have a story, a thought, or a quiet moment you'd like to share, 
            please leave it here. Your words become part of her legacy.
          </p>
        </div>

        {/* Content */}
        <div ref={contentRef} className="space-y-16">
          {/* Digital Candles */}
          <div className="animate-in">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-xl text-[#F8F7F4] flex items-center gap-3">
                <Flame className="w-5 h-5 text-[#D4AF37] candle-glow" />
                Light a Candle
              </h3>
              <button
                onClick={() => setShowCandleForm(!showCandleForm)}
                className="label-mono text-[#D4AF37] hover:text-[#E8C76A] transition-colors"
              >
                {showCandleForm ? 'Cancel' : 'Light One'}
              </button>
            </div>

            {showCandleForm && (
              <form onSubmit={lightCandle} className="mb-8 p-6 bg-[rgba(248,247,244,0.05)] rounded-sm">
                <input
                  type="text"
                  value={newCandleName}
                  onChange={(e) => setNewCandleName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-transparent border border-[rgba(248,247,244,0.2)] text-[#F8F7F4] placeholder:text-[rgba(248,247,244,0.4)] focus:outline-none focus:border-[#D4AF37] transition-colors mb-4"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C9A227] text-[#1A1A1A] label-mono transition-colors flex items-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  Light Candle
                </button>
              </form>
            )}

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {candles.map((candle) => (
                <div 
                  key={candle.id}
                  className="flex flex-col items-center text-center p-3"
                >
                  <Flame className="w-6 h-6 text-[#D4AF37] candle-glow mb-2" />
                  <span className="text-[10px] text-[rgba(248,247,244,0.6)]">{candle.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Memories */}
          <div className="animate-in">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-xl text-[#F8F7F4] flex items-center gap-3">
                <Heart className="w-5 h-5 text-[#D4AF37]" />
                Shared Memories
              </h3>
              <button
                onClick={() => setShowMemoryForm(!showMemoryForm)}
                className="label-mono text-[#D4AF37] hover:text-[#E8C76A] transition-colors"
              >
                {showMemoryForm ? 'Cancel' : 'Share Yours'}
              </button>
            </div>

            {showMemoryForm && (
              <form onSubmit={shareMemory} className="mb-8 p-6 bg-[rgba(248,247,244,0.05)] rounded-sm">
                <input
                  type="text"
                  value={newMemoryName}
                  onChange={(e) => setNewMemoryName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-transparent border border-[rgba(248,247,244,0.2)] text-[#F8F7F4] placeholder:text-[rgba(248,247,244,0.4)] focus:outline-none focus:border-[#D4AF37] transition-colors mb-4"
                />
                <textarea
                  value={newMemoryMessage}
                  onChange={(e) => setNewMemoryMessage(e.target.value)}
                  placeholder="Share a memory..."
                  rows={4}
                  className="w-full px-4 py-3 bg-transparent border border-[rgba(248,247,244,0.2)] text-[#F8F7F4] placeholder:text-[rgba(248,247,244,0.4)] focus:outline-none focus:border-[#D4AF37] transition-colors mb-4 resize-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C9A227] text-[#1A1A1A] label-mono transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Share Memory
                </button>
              </form>
            )}

            <div className="space-y-4">
              {memories.map((memory) => (
                <div 
                  key={memory.id}
                  className="p-6 bg-[rgba(248,247,244,0.05)] hover:bg-[rgba(248,247,244,0.08)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                      <span className="text-xs text-[#D4AF37]">
                        {memory.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-[#F8F7F4]">{memory.name}</span>
                  </div>
                  <p className="text-sm text-[rgba(248,247,244,0.7)] leading-relaxed pl-11">
                    {memory.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="animate-in pt-16 border-t border-[rgba(248,247,244,0.1)] text-center">
            <p className="font-serif text-2xl text-[#F8F7F4] italic mb-4">
              "Color is the keyboard, the eyes are the harmonies, 
              <br className="hidden md:block" />
              the soul is the piano with many strings."
            </p>
            <p className="label-mono text-[rgba(248,247,244,0.4)] mb-8">
              — Wassily Kandinsky
            </p>
            <p className="text-[10px] text-[rgba(248,247,244,0.3)]">
              © 2026 Jacquelin Anne Hellenberg Memorial
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}
