import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Check, Edit3 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

const EMPATHETIC_PROMPTS = [
  "¿Qué pesa hoy en tu mente?",
  "Escribe sin preocuparte por la ortografía...",
  "Este es un espacio seguro. Nadie más lo leerá.",
  "¿Hubo algo que te hiciera sonreír hoy, por más pequeño que sea?",
  "Toma una respiración profunda antes de empezar..."
];

const EMOTIONAL_ANCHORS = [
  { id: 'joy', color: 'bg-[#C3A9E5]', label: 'Muted Rose (Joy)', icon: '✨' },
  { id: 'calm', color: 'bg-[#A9E5C3]', label: 'Soft Sage (Calm)', icon: '🌱' },
  { id: 'anxiety', color: 'bg-[#E5D4A9]', label: 'Warm Amber (Anxiety)', icon: '⚡' },
  { id: 'sadness', color: 'bg-[#A9BAE5]', label: 'Deep Indigo (Sadness)', icon: '🌧️' }
];

export default function ZenEditor() {
  const { session } = useAuth();
  const [content, setContent] = useState('');
  const [activePrompt, setActivePrompt] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const typingTimeoutRef = useRef(null);
  const textareaRef = useRef(null);
  const editorContainerRef = useRef(null);
  const surroundingUiRef = useRef(null);

  // Load existing draft
  useEffect(() => {
    const savedDraft = localStorage.getItem('diario_draft');
    if (savedDraft) setContent(savedDraft);
  }, []);

  // Soft Placeholder Cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePrompt((prev) => (prev + 1) % EMPATHETIC_PROMPTS.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Auto-save logic
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (content) {
        localStorage.setItem('diario_draft', content);
      }
    }, 5000);
    return () => clearInterval(saveInterval);
  }, [content]);

  // Focus Mode Logic
  const handleInput = (e) => {
    setContent(e.target.value);

    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    // Entering typing focus mode
    if (!isTyping) {
      setIsTyping(true);
      gsap.to(surroundingUiRef.current, { opacity: 0.1, duration: 1.2, ease: "power2.inOut" });
    }

    // Reset the "stop typing" timer
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      gsap.to(surroundingUiRef.current, { opacity: 1, duration: 1.5, ease: "power2.inOut" });
    }, 2000);
  };

  // Release Action (Save)
  const handleSave = async () => {
    if (!content.trim()) return;

    // Fire-and-forget Cloud Sync if Authenticated
    if (session?.user?.id) {
      supabase.from('entries').insert([{
        user_id: session.user.id,
        content: content.trim(),
        emotion: selectedEmotion || 'neutral'
      }]).then(({ error }) => {
        if (error) console.error("Error saving entry to Supabase:", error);
      });
    }

    // Save animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setContent('');
          setSelectedEmotion(null);
          localStorage.removeItem('diario_draft');
          if (textareaRef.current) textareaRef.current.style.height = 'auto';
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);

          // Gently fade back in
          gsap.to(editorContainerRef.current, { opacity: 1, y: 0, scale: 1, clearProps: "all", duration: 1.5 });
        }
      });

      tl.to(editorContainerRef.current, {
        y: -40,
        opacity: 0,
        scale: 0.98,
        filter: "blur(8px)",
        duration: 1.2,
        ease: "power3.inOut"
      });
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#2A2A35] font-serif relative overflow-hidden flex flex-col items-center justify-center p-4">

      {/* Dynamic Ambiance: Slow breathing mesh background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-rose-100/30 to-transparent blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-l from-indigo-100/20 to-transparent blur-[100px] animate-pulse" style={{ animationDuration: '15s', animationDelay: '2s' }} />
      </div>

      {/* Global CSS Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Surrounding UI (Fades out when typing) */}
      <div ref={surroundingUiRef} className="w-full max-w-3xl flex flex-col items-center z-20 space-y-12 mb-8">
        <h2 className="text-xl md:text-2xl font-light opacity-60 flex items-center gap-3">
          <Edit3 size={18} className="opacity-50" />
          <span>Refugio de Pensamientos</span>
        </h2>

        {/* Emotional Anchoring Slider */}
        <div className="flex gap-4 items-center">
          {EMOTIONAL_ANCHORS.map(anchor => (
            <button
              key={anchor.id}
              onClick={() => setSelectedEmotion(anchor.id)}
              className={`
                w-14 h-14 md:w-16 md:h-16 rounded-[2rem] flex items-center justify-center text-2xl transition-all duration-500 ease-out
                ${anchor.color} 
                ${selectedEmotion === anchor.id ? 'scale-110 shadow-lg ring-2 ring-white ring-offset-2 ring-offset-[#FAF8F5]' : 'opacity-70 hover:scale-105 hover:opacity-100'}
              `}
              title={anchor.label}
            >
              <span className="opacity-80 mix-blend-multiply">{anchor.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Zen Editor Area */}
      <div ref={editorContainerRef} className="w-full max-w-3xl z-20 relative">
        <div className="relative">
          {/* Subtle Placeholder that cycles */}
          {!content && (
            <div className="absolute top-0 left-0 w-full pointer-events-none transition-opacity duration-1000 opacity-40 text-2xl md:text-3xl lg:text-4xl leading-relaxed text-center font-light">
              {EMPATHETIC_PROMPTS[activePrompt]}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            className="w-full bg-transparent outline-none resize-none text-2xl md:text-3xl lg:text-4xl leading-relaxed text-[#2A2A35] font-light min-h-[200px] text-center"
            style={{ overflow: 'hidden' }}
          />
        </div>

        {/* Soft Release Button */}
        {content.trim() && (
          <div className="flex justify-center mt-16 transition-all duration-700 opacity-100 animate-in fade-in slide-in-from-bottom-4">
            <button
              onClick={handleSave}
              className="px-8 py-4 rounded-[2rem] bg-[#2E4036]/5 hover:bg-[#2E4036]/10 text-[#2E4036] transition-all duration-500 hover:-translate-y-1 font-sans text-sm tracking-wide uppercase"
            >
              Soltar pensamiento
            </button>
          </div>
        )}
      </div>

      {/* Gentle Toast */}
      <div
        className={`fixed bottom-12 z-50 bg-white/40 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-3 shadow-sm border border-black/5 transition-all duration-1000 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
      >
        <span className="w-6 h-6 rounded-full bg-[#A9E5C3] flex items-center justify-center">
          <Check size={14} className="text-[#2E4036]" />
        </span>
        <span className="font-sans text-sm opacity-80">Guardado con éxito en tu refugio.</span>
      </div>
    </div>
  );
}
