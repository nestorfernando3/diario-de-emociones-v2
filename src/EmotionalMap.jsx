import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Calendar as CalendarIcon, Wind } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

// Emotion Palette mapping emphasizing nuanced semiotics
const EMOTION_PALETTE = {
  sadness: { bg: 'bg-[#A9BAE5]', text: 'text-[#3E4A6B]', label: 'Deep Indigo (Sadness)' },
  anxiety: { bg: 'bg-[#E5D4A9]', text: 'text-[#7A6A45]', label: 'Warm Amber (Anxiety/Energy)' },
  calm: { bg: 'bg-[#A9E5C3]', text: 'text-[#3B664F]', label: 'Soft Sage (Calm)' },
  joy: { bg: 'bg-[#C3A9E5]', text: 'text-[#4F3B66]', label: 'Muted Rose (Joy)' },
  neutral: { bg: 'bg-[#E8E4DD]', text: 'text-[#666666]', label: 'Neutral' }
};

// Mock data constellation
const generateMockEntries = () => {
  const entries = [];
  const emotions = ['sadness', 'anxiety', 'calm', 'joy', 'neutral'];
  const today = new Date();

  for (let i = 28; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    // Simulate some missing days for organic gaps
    if (Math.random() > 0.8) continue;

    entries.push({
      id: `entry-${i}`,
      date: d.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' }),
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      content: "Hoy fue un día particular. Sentí que el tiempo pasaba de una forma distinta, más espesa. Al principio me incomodó, pero luego decidí observarlo sin juzgarlo. Es extraño cómo cambiar la perspectiva aligera la mente.",
      intensity: 0.6 + (Math.random() * 0.4) // Dynamic sizing for organic feel
    });
  }
  return entries;
};

const MOCK_ENTRIES = generateMockEntries();

export default function EmotionalMap() {
  const { session } = useAuth();
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const containerRef = useRef(null);
  const constellationRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch from Supabase
      const fetchCloudData = async () => {
        const { data, error } = await supabase
          .from('entries')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error("Error fetching map entries:", error);
          setEntries(MOCK_ENTRIES);
        } else if (data) {
          // Format the dates and map them exactly like the mock for the UI
          const formattedData = data.map(entry => {
            const d = new Date(entry.created_at);
            return {
              id: entry.id,
              date: d.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' }),
              emotion: entry.emotion || 'neutral',
              content: entry.content,
              intensity: 0.7 + (Math.random() * 0.3) // dynamic sizing for organic feel
            };
          });
          setEntries(formattedData);
        }
      };
      fetchCloudData();
    } else {
      setEntries(MOCK_ENTRIES);
    }
  }, [session]);

  // Initial Stagger Reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".constellation-node",
        { opacity: 0, scale: 0, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.05,
          ease: "elastic.out(1, 0.7)",
          delay: 0.2
        }
      );
    }, constellationRef);
    return () => ctx.revert();
  }, []);

  // Modal Expand Animation
  useEffect(() => {
    if (selectedEntry) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [selectedEntry]);

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    // Soft fade of background mapping
    gsap.to(constellationRef.current, { opacity: 0.3, filter: "blur(4px)", duration: 0.6 });
  };

  const handleCloseEntry = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 10,
      duration: 0.4,
      onComplete: () => {
        setSelectedEntry(null);
        gsap.to(constellationRef.current, { opacity: 1, filter: "blur(0px)", duration: 0.6 });
      }
    });
  };

  // Determine a Gentle Insight based on the data
  const getInsight = () => {
    if (entries.length > 20) return "Has estado observando tus emociones de cerca últimamente.";
    if (entries.some(e => e.emotion === 'sadness')) return "Está bien tener días nublados. Forman parte del paisaje.";
    return "Esta temporada ha estado llena de matices.";
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-[#FAF8F5] text-[#2A2A35] font-sans relative flex flex-col items-center justify-center p-4 py-20">

      {/* Global CSS Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="max-w-4xl w-full z-10 flex flex-col items-center">

        {/* Header & Insight */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-3xl font-light tracking-wide opacity-80 flex items-center justify-center gap-3">
            <Wind size={24} className="opacity-50" />
            El Mapa de tu Temporada
          </h1>
          <p className="text-sm md:text-base opacity-50 italic">"{getInsight()}"</p>
        </div>

        {/* The Constellation */}
        <div ref={constellationRef} className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 max-w-2xl mx-auto mb-20">
          {entries.length === 0 && (
            <div className="text-center opacity-50 mt-10">
              Aún no hay estrellas en tu constelación. Ve al Refugio y suelta tu primer pensamiento.
            </div>
          )}
          {entries.map((entry, index) => {
            // Fallback gracefully if an emotion isn't mapped
            const styleInfo = EMOTION_PALETTE[entry.emotion] || EMOTION_PALETTE['neutral'];
            const baseSize = 40;
            const size = baseSize * entry.intensity;

            return (
              <div key={entry.id} className="group relative constellation-node flex-shrink-0">
                <button
                  onClick={() => handleEntryClick(entry)}
                  className={`rounded-full ${styleInfo.bg} shadow-sm transition-transform duration-500 ease-out hover:scale-[1.15] opacity-80 hover:opacity-100`}
                  style={{ width: `${size}px`, height: `${size}px` }}
                />

                {/* Floating Tooltip */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none flex flex-col items-center shadow-sm border border-black/5 min-w-max z-20">
                  <span className="text-xs font-medium opacity-80 capitalize">{entry.date}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* The Narrative Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-8">
          {/* Invisible backdrop click to close */}
          <div className="absolute inset-0 z-0" onClick={handleCloseEntry} />

          <div
            ref={modalRef}
            className="w-full max-w-2xl bg-[#FCFBF9]/95 backdrop-blur-2xl rounded-[3rem] p-8 md:p-14 shadow-2xl border border-black/5 z-10 relative flex flex-col"
          >
            <div className="flex items-center justify-between mb-10 w-full">
              <div className="flex items-center gap-3 opacity-60">
                <CalendarIcon size={16} />
                <span className="text-sm font-medium capitalize">{selectedEntry.date}</span>
              </div>
              <button
                onClick={handleCloseEntry}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors opacity-50 hover:opacity-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 rounded-full ${EMOTION_PALETTE[selectedEntry.emotion]?.bg || EMOTION_PALETTE['neutral'].bg} opacity-80 shadow-sm`} />
              <div className="text-sm font-medium opacity-60">
                Resonancia: {EMOTION_PALETTE[selectedEntry.emotion]?.label.split(' (')[0] || 'Neutral'}
              </div>
            </div>

            <p className="font-serif text-xl md:text-2xl leading-relaxed text-[#2A2A35]/90 min-h-[150px]">
              {selectedEntry.content}
            </p>

            <div className="mt-12 pt-8 border-t border-black/5 flex justify-center">
              <button onClick={handleCloseEntry} className="text-sm font-medium opacity-50 hover:opacity-100 transition-opacity uppercase tracking-wider">
                Volver al mapa
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
