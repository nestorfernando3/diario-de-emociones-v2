import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Phone, HeartHandshake, Eye, Hand, Ear, Smile, Move } from 'lucide-react';

const GROUNDING_STEPS = [
    { text: "Nombra 5 cosas que puedas ver a tu alrededor", icon: Eye },
    { text: "Toca 4 texturas diferentes y siente su temperatura", icon: Hand },
    { text: "Escucha 3 sonidos distintos cerca o lejos de ti", icon: Ear },
    { text: "Identifica 2 olores en el ambiente", icon: WindIcon },
    { text: "Recuerda 1 cosa que te haga sentir seguro", icon: Smile }
];

// Fallback WindIcon since lucide Wind is not imported directly here
function WindIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.8 19.6A2 2 0 1 0 14 16H2" />
            <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
            <path d="M9.8 4.4A2 2 0 1 1 11 8H2" />
        </svg>
    );
}

export default function FirstAidKit({ isOpen, onClose }) {
    const modalRef = useRef(null);
    const breathingCircleRef = useRef(null);
    const breatheTextRef = useRef(null);
    const breathingTimelineRef = useRef(null);

    const [breathePhase, setBreathePhase] = useState("Preparándonos...");
    const [groundingStep, setGroundingStep] = useState(0);

    // Modal Mount/Unmount Animation
    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 0.95, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" }
            );

            // Reset state
            setGroundingStep(0);
            startBreathingCycle();
        } else {
            if (breathingTimelineRef.current) {
                breathingTimelineRef.current.kill();
            }
        }
    }, [isOpen]);

    // Breathing GSAP Timeline (4-7-8 Technique)
    const startBreathingCycle = () => {
        if (breathingTimelineRef.current) {
            breathingTimelineRef.current.kill();
        }

        const tl = gsap.timeline({ repeat: -1 });
        breathingTimelineRef.current = tl;

        // Reset circle
        gsap.set(breathingCircleRef.current, { scale: 0.5, opacity: 0.6 });

        tl.call(() => setBreathePhase("Inhala profundo (4s)"))
            .to(breathingCircleRef.current, { scale: 1.5, opacity: 1, duration: 4, ease: "sine.inOut" })

            .call(() => setBreathePhase("Sostén el aire (7s)"))
            .to(breathingCircleRef.current, { scale: 1.55, opacity: 0.9, duration: 7, ease: "none" })

            .call(() => setBreathePhase("Exhala despacio (8s)"))
            .to(breathingCircleRef.current, { scale: 0.5, opacity: 0.6, duration: 8, ease: "sine.inOut" })

            .call(() => setBreathePhase("Pausa"));
    };

    const nextGroundingStep = () => {
        if (groundingStep < GROUNDING_STEPS.length - 1) {
            setGroundingStep(prev => prev + 1);
        } else {
            setGroundingStep(0); // Loop back
        }
    };

    if (!isOpen) return null;

    const CurrentIcon = GROUNDING_STEPS[groundingStep].icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            {/* Heavy Backdrop Blur mimicking motion calming */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-3xl transition-opacity duration-1000"
                onClick={() => {
                    gsap.to(modalRef.current, {
                        opacity: 0, scale: 0.95, y: 10, duration: 0.5,
                        onComplete: onClose
                    });
                }}
            />

            <div
                ref={modalRef}
                className="w-full max-w-2xl bg-[#E8E4DD] text-[#2A2A35] rounded-[3rem] p-8 md:p-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 z-10 relative flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
                {/* Soft Close Button */}
                <button
                    onClick={() => {
                        gsap.to(modalRef.current, {
                            opacity: 0, scale: 0.95, y: 10, duration: 0.5,
                            onComplete: onClose
                        });
                    }}
                    className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors opacity-70 hover:opacity-100"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center gap-3 opacity-60 mb-12">
                    <HeartHandshake size={20} />
                    <span className="text-sm font-medium uppercase tracking-widest">Pausa Activa</span>
                </div>

                {/* 1. Breathing Canvas (4-7-8) */}
                <div className="relative w-full h-[250px] flex items-center justify-center mb-16 mt-4">
                    {/* The expanding circle */}
                    <div
                        ref={breathingCircleRef}
                        className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-[#A9BAE5] to-[#A9E5C3] blur-md opacity-60"
                    />
                    {/* Inner circle mask to give it a ring shape or softer feel */}
                    <div className="absolute w-full h-full flex flex-col items-center justify-center pointer-events-none">
                        <h2 ref={breatheTextRef} className="text-2xl md:text-3xl font-serif text-[#3E4A6B] transition-opacity duration-500 z-10 font-light text-center w-64 drop-shadow-sm bg-white/30 backdrop-blur-md px-6 py-3 rounded-full">
                            {breathePhase}
                        </h2>
                    </div>
                </div>

                {/* 2. Grounding Protocol (5-4-3-2-1) */}
                <div className="bg-white/40 rounded-[2.5rem] p-8 mb-12 flex flex-col items-center text-center">
                    <p className="text-sm font-medium opacity-50 uppercase tracking-widest mb-6">Técnica de Enraizamiento</p>

                    <div className="flex flex-col items-center justify-center min-h-[140px] px-4 w-full relative">
                        <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-6">
                            <CurrentIcon size={28} className="text-[#7A6A45] opacity-80" />
                        </div>
                        <p className="font-serif text-xl md:text-2xl leading-relaxed text-[#2E4036] transition-all">
                            {GROUNDING_STEPS[groundingStep].text}
                        </p>
                    </div>

                    <button
                        onClick={nextGroundingStep}
                        className="mt-8 px-8 py-3 rounded-full bg-[#A9E5C3]/40 hover:bg-[#A9E5C3]/60 text-[#3B664F] transition-colors flex items-center gap-2 font-medium"
                    >
                        Siguiente <Move size={16} />
                    </button>
                </div>

                {/* 3. Local Support Network */}
                <div className="bg-[#2E4036] text-[#F2F0E9] rounded-[2.5rem] p-8 md:p-10">
                    <div className="flex items-start gap-4 mb-6">
                        <Phone size={24} className="text-[#A9E5C3] shrink-0 mt-1" />
                        <div>
                            <h3 className="text-xl font-serif mb-2">Líneas de Apoyo Inmediato</h3>
                            <p className="text-sm opacity-80 leading-relaxed max-w-lg mb-8">
                                No tienes que cargar con todo tú solo. Hay personas al otro lado dispuestas a escucharte, sin juzgar tu situación o tu lugar de origen.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SupportLink
                            name="Línea de la Vida (Atlántico)"
                            number="339 99 99"
                            desc="Atención especializada en salud mental y crisis."
                        />
                        <SupportLink
                            name="Línea 106"
                            number="106"
                            desc="Apoyo gratuito para niños, niñas y adolescentes."
                        />
                        <SupportLink
                            name="Línea 141 (ICBF)"
                            number="141"
                            desc="Protección a menores y prevención de emergencias."
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

function SupportLink({ name, number, desc }) {
    return (
        <a
            href={`tel:${number.replace(/\\s/g, '')}`} 
      className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-[1.5rem] bg-white/5 hover:bg-white/10 transition-colors group block border border-white/5"
    >
      <div className="mb-2 md:mb-0">
         <div className="font-medium text-[#A9E5C3] text-lg mb-1 group-hover:underline">{name}</div>
         <div className="text-xs opacity-60 font-sans">{desc}</div>
      </div>
      <div className="font-mono text-xl md:text-2xl font-light opacity-90 shrink-0">
         {number}
      </div>
    </a>
  );
}
