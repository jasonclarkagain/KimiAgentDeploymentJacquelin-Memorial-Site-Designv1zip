import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, Send, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
  className?: string;
}

interface Candle {
  id: number;
  name: string;
  message: string;
}

interface Memory {
  id: number;
  name: string;
  message: string;
}

export default function ContactSection({ className = '' }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [candles, setCandles] = useState<Candle[]>([
    { id: 1, name: 'Sarah M.', message: 'Forever in my heart' },
    { id: 2, name: 'Michael R.', message: 'Miss you every day' },
    { id: 3, name: 'Emma L.', message: 'Your light still shines' },
  ]);
  const [memories, setMemories] = useState<Memory[]>([
    { id: 1, name: 'David', message: 'Remembering our art classes together. You had such a unique way of seeing the world.' },
    { id: 2, name: 'Lisa', message: 'Thank you for teaching me to appreciate the beauty in ordinary moments.' },
  ]);
  const [newCandleName, setNewCandleName] = useState('');
  const [newMemoryName, setNewMemoryName] = useState('');
  const [newMemoryMessage, setNewMemoryMessage] = useState('');
  const [showCandleForm, setShowCandleForm] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const elements = content.querySelectorAll('.animate-in');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 24 },
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
      setCandles([...candles, { 
        id: Date.now(), 
        name: newCandleName, 
        message: 'In loving memory' 
      }]);
      setNewCandleName('');
      setShowCandleForm(false);
    }
  };

  const shareMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoryName.trim() && newMemoryMessage.trim()) {
      setMemories([...memories, { 
        id: Date.now(), 
        name: newMemoryName, 
        message: newMemoryMessage 
      }]);
      setNewMemoryName('');
      setNewMemoryMessage('');
      setShowMemoryForm(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact-section"
      className={`relative bg-[#F3EFE6] min-h-screen ${className}`}
    >
      {/* Decorative Ochre Blob */}
      <div 
        className="absolute painted-field painted-field-ochre opacity-30"
        style={{
          right: '-10vw',
          top: '-8vh',
          width: '40vw',
          height: '40vh',
        }}
      />

      <div 
        ref={contentRef}
        className="relative max-w-3xl mx-auto px-6 py-20 lg:py-32"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="animate-in text-[clamp(36px,4.5vw,64px)] font-serif text-[#0B0B0D] leading-[1.1] mb-4">
            Share a memory
          </h2>
          <p className="animate-in text-[clamp(14px,1.2vw,18px)] text-[#6B7280] font-light max-w-xl mx-auto">
            If you have a photo, a story, or a quiet thought you'd like to leave behind, 
            we'd love to receive it.
          </p>
        </div>

        {/* Digital Candles Section */}
        <div className="animate-in mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif text-[#0B0B0D] flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#D4A03F]" />
              Light a Digital Candle
            </h3>
            <button
              onClick={() => setShowCandleForm(!showCandleForm)}
              className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#D4A03F] hover:text-[#B8932F] transition-colors"
            >
              {showCandleForm ? 'Cancel' : 'Light Candle'}
            </button>
          </div>

          {/* Candle Form */}
          {showCandleForm && (
            <form onSubmit={lightCandle} className="mb-6 p-4 bg-white/50 rounded-xl">
              <input
                type="text"
                value={newCandleName}
                onChange={(e) => setNewCandleName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-white border border-[#E5E0D5] rounded-lg text-[#0B0B0D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D4A03F] transition-colors mb-3"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#D4A03F] hover:bg-[#B8932F] text-white font-mono text-[12px] tracking-[0.14em] uppercase rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" />
                Light Candle
              </button>
            </form>
          )}

          {/* Candles Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {candles.map((candle) => (
              <div 
                key={candle.id}
                className="flex flex-col items-center text-center p-3 bg-white/40 rounded-xl hover:bg-white/60 transition-colors"
              >
                <div className="relative mb-2">
                  <Flame className="w-8 h-8 text-[#D4A03F] candle-flame" />
                </div>
                <span className="text-[11px] text-[#0B0B0D] font-medium">{candle.name}</span>
                <span className="text-[9px] text-[#6B7280] mt-1">{candle.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Sharing Section */}
        <div className="animate-in mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif text-[#0B0B0D] flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#D4A03F]" />
              Shared Memories
            </h3>
            <button
              onClick={() => setShowMemoryForm(!showMemoryForm)}
              className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#D4A03F] hover:text-[#B8932F] transition-colors"
            >
              {showMemoryForm ? 'Cancel' : 'Share Memory'}
            </button>
          </div>

          {/* Memory Form */}
          {showMemoryForm && (
            <form onSubmit={shareMemory} className="mb-6 p-4 bg-white/50 rounded-xl">
              <input
                type="text"
                value={newMemoryName}
                onChange={(e) => setNewMemoryName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-white border border-[#E5E0D5] rounded-lg text-[#0B0B0D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D4A03F] transition-colors mb-3"
              />
              <textarea
                value={newMemoryMessage}
                onChange={(e) => setNewMemoryMessage(e.target.value)}
                placeholder="Share a memory or message..."
                rows={4}
                className="w-full px-4 py-3 bg-white border border-[#E5E0D5] rounded-lg text-[#0B0B0D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D4A03F] transition-colors mb-3 resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#D4A03F] hover:bg-[#B8932F] text-white font-mono text-[12px] tracking-[0.14em] uppercase rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}

          {/* Memories List */}
          <div className="space-y-4">
            {memories.map((memory) => (
              <div 
                key={memory.id}
                className="p-4 bg-white/40 rounded-xl hover:bg-white/60 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#D4A03F]/20 flex items-center justify-center">
                    <span className="text-[12px] font-medium text-[#D4A03F]">
                      {memory.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[#0B0B0D]">{memory.name}</span>
                </div>
                <p className="text-[13px] text-[#4B5563] leading-relaxed pl-10">
                  {memory.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="animate-in">
          <h3 className="text-xl font-serif text-[#0B0B0D] mb-6 text-center">
            Send a Private Message
          </h3>
          <form className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="px-4 py-3 bg-white border border-[#E5E0D5] rounded-lg text-[#0B0B0D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D4A03F] transition-colors"
              />
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-3 bg-white border border-[#E5E0D5] rounded-lg text-[#0B0B0D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D4A03F] transition-colors"
              />
            </div>
            <textarea
              placeholder="Your message..."
              rows={5}
              className="w-full px-4 py-3 bg-white border border-[#E5E0D5] rounded-lg text-[#0B0B0D] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D4A03F] transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full py-4 bg-[#0B0B0D] hover:bg-[#1a1a1c] text-white font-mono text-[12px] tracking-[0.14em] uppercase rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="animate-in mt-20 pt-8 border-t border-[#E5E0D5] text-center">
          <p className="text-[11px] text-[#9CA3AF] font-light">
            © 2026 Jacquelin Anne Hellenberg Tribute. Designed with care.
          </p>
        </footer>
      </div>
    </section>
  );
}
