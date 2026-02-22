import React from 'react';
import { HeartPulse } from 'lucide-react';

export default function CalmAnchor({ onClick }) {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <button
                onClick={onClick}
                className="group relative flex items-center justify-center w-16 h-16 md:w-auto md:h-14 md:px-6 rounded-full bg-[#A9BAE5]/90 hover:bg-[#A9BAE5] backdrop-blur-md shadow-lg border border-white/20 transition-all duration-500 hover:scale-105"
                title="Pausa Activa / Primeros Auxilios Emocionales"
            >
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                <HeartPulse size={22} className="text-[#3E4A6B] relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                <span className="hidden md:block ml-3 font-medium text-[#3E4A6B] text-sm tracking-wide relative z-10">Pausa</span>
            </button>
        </div>
    );
}
