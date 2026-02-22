import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Feather, Shield, Activity, CircleDot } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Landing({ onEnter }) {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const manifestoRef = useRef(null);
    const cardsRef = useRef(null);
    const navRef = useRef(null);
    const ctaRef = useRef(null);

    // Dynamic Typewriter state
    const [telemetryText, setTelemetryText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    // Preset A: Organic Tech Palettes
    const palette = {
        bg: '#F2F0E9',
        primary: '#2E4036',
        accent: '#CC5833',
        text: '#1A1A1A'
    };

    // GSAP Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Navbar Scroll Effect
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top -50",
                onEnter: () => gsap.to(navRef.current, { backgroundColor: 'rgba(242, 240, 233, 0.7)', backdropFilter: 'blur(16px)', duration: 0.5 }),
                onLeaveBack: () => gsap.to(navRef.current, { backgroundColor: 'transparent', backdropFilter: 'blur(0px)', duration: 0.5 })
            });

            // 2. Hero Reveal
            gsap.from(".hero-text", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2
            });

            // 3. Manifesto Word-by-Word Reveal
            const manifestoWords = gsap.utils.toArray('.manifesto-word');
            gsap.fromTo(manifestoWords,
                { opacity: 0.1, y: 10 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: manifestoRef.current,
                        start: "top 70%",
                        end: "bottom 80%",
                        scrub: 1
                    }
                }
            );

            // 4. Feature Cards Reveal
            gsap.from(".feature-card", {
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: "top 75%"
                }
            });

            // 5. Sticky Protocol Cards
            const stickyCards = gsap.utils.toArray('.sticky-card');
            stickyCards.forEach((card, i) => {
                if (i < stickyCards.length - 1) {
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top 10%",
                        endTrigger: stickyCards[i + 1],
                        end: "top 50%",
                        pin: true,
                        pinSpacing: false,
                        animation: gsap.to(card, { scale: 0.9, opacity: 0, filter: "blur(10px)", duration: 0.5 }),
                        scrub: true
                    });
                }
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Telemetry Typewriter Effect Simulation
    useEffect(() => {
        const textToType = "> Sistematizando emociones... \n> Ruido reducido: 84% \n> Entorno seguro = true";
        let i = 0;
        if (isTyping) {
            const typeInterval = setInterval(() => {
                setTelemetryText(textToType.substring(0, i));
                i++;
                if (i > textToType.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => { setIsTyping(false); setTelemetryText(''); setIsTyping(true); }, 4000);
                }
            }, 50);
            return () => clearInterval(typeInterval);
        }
    }, [isTyping]);

    return (
        <div ref={containerRef} className="w-full bg-[#F2F0E9] text-[#1A1A1A] font-sans relative overflow-x-hidden selection:bg-[#CC5833]/20">

            {/* Global CSS Noise Overlay */}
            <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.05] mix-blend-overlay">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>

            {/* 1. Navbar */}
            <nav ref={navRef} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-8 py-3 rounded-full flex items-center gap-8 text-sm font-medium transition-all">
                <div className="font-serif italic text-lg opacity-80">Diario de Emociones</div>
                <div className="hidden md:flex gap-6 opacity-60">
                    <a href="#filosofia" className="hover:opacity-100 transition-opacity">Filosofía</a>
                    <a href="#herramientas" className="hover:opacity-100 transition-opacity">Herramientas</a>
                </div>
                <button
                    onClick={onEnter}
                    className="bg-[#2E4036] text-[#F2F0E9] px-5 py-2 rounded-full hover:scale-105 transition-transform"
                >
                    Entrar
                </button>
            </nav>

            {/* 2. Hero Section */}
            <section ref={heroRef} className="relative w-full h-[100dvh] flex items-end pb-20 px-8 md:px-16 overflow-hidden">
                {/* Full-bleed Generated Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/diario-de-emociones-v2/hero.png" // Path works for GH Pages when placed in public/
                        onError={(e) => { e.target.src = '/hero.png' }} // Fallback for local dev
                        alt="Serene Organic Forest"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F2F0E9] via-[#F2F0E9]/40 to-transparent" />
                </div>

                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-6xl md:text-8xl font-serif text-[#2E4036] tracking-tight mb-6">
                        <span className="hero-text block">Un espacio seguro</span>
                        <span className="hero-text block italic font-light opacity-80">para la mente que naufraga.</span>
                    </h1>
                    <p className="hero-text text-xl md:text-2xl font-light opacity-70 max-w-xl mb-10 leading-relaxed">
                        Tu refugio digital sin evaluaciones ni ruido exterior. Descifra lo que sientes a tu propio ritmo.
                    </p>
                    <button
                        onClick={onEnter}
                        className="hero-text group flex items-center gap-4 bg-[#CC5833] text-white px-8 py-4 rounded-full text-lg hover:scale-[1.03] transition-transform duration-300"
                    >
                        Entrar al refugio
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* 4. Philosophy Manifesto (Updated with provided copy) */}
            <section id="filosofia" className="w-full bg-[#2E4036] text-[#F2F0E9] py-32 md:py-48 px-8 md:px-16 relative overflow-hidden">
                {/* Subtle abstract SVG in background */}
                <svg className="absolute top-0 right-0 w-[800px] h-[800px] opacity-5 -translate-y-1/4 translate-x-1/4" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 0 L100 50 L50 100 L0 50 Z" />
                </svg>

                <div className="max-w-4xl mx-auto" ref={manifestoRef}>
                    <p className="text-sm md:text-base uppercase tracking-widest opacity-50 mb-12 font-medium">
                        El Manifiesto de la Empatía
                    </p>

                    <p className="text-lg md:text-2xl font-light leading-relaxed opacity-70 mb-12 max-w-3xl">
                        El mundo de afuera a veces te exige ir demasiado rápido. Te pide que te adaptes en silencio, que cargues con equipajes pesados y que camines sin mirar atrás.
                    </p>

                    <h2 className="text-4xl md:text-7xl font-serif italic mb-16 leading-tight">
                        {"Aquí priorizamos tu propio ".split(" ").map((word, i) => (
                            <span key={i} className="manifesto-word inline-block mr-3 md:mr-4">{word}</span>
                        ))}
                        <span className="manifesto-word inline-block text-[#CC5833]">ritmo.</span>
                    </h2>

                    <p className="text-xl md:text-3xl font-light leading-relaxed opacity-80">
                        Este no es un espacio para evaluar cómo te sientes ni para exigir que todo esté bien. Sabemos que las realidades complejas no se resuelven con frases vacías. Este diario es un <span className="text-[#CC5833] font-medium">refugio digital</span> diseñado para desenredar el ruido. Un lugar seguro para pausar, reconocer tus propios signos y soltar el peso. Porque tu historia, con todos sus tránsitos y matices, merece un lugar donde respirar sin ser juzgada.
                    </p>

                    <div className="mt-20">
                        <button onClick={onEnter} className="border border-[#F2F0E9]/30 hover:border-[#F2F0E9] px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 text-lg">
                            Soltar el primer pensamiento
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. Interactive Features */}
            <section id="herramientas" ref={cardsRef} className="py-32 px-8 md:px-16 max-w-7xl mx-auto">
                <div className="mb-20">
                    <h2 className="text-4xl md:text-5xl font-serif italic text-[#2E4036]">Herramientas de contención</h2>
                    <p className="opacity-60 text-lg mt-4 max-w-md">Diseñadas para reducir la carga cognitiva.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Feature 1: The Zen Editor representation */}
                    <div className="feature-card bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-black/5 group hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-16 h-16 rounded-full bg-[#2E4036]/5 flex items-center justify-center mb-8">
                            <Feather className="text-[#2E4036]" size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-medium mb-4">El Lienzo en Blanco</h3>
                        <p className="opacity-70 leading-relaxed mb-8">Un editor que desaparece cuando escribes. Sin formatos, sin contadores de palabras. Sólo tú y tus pensamientos.</p>
                        <div className="h-32 bg-[#F2F0E9]/50 rounded-2xl relative overflow-hidden flex flex-col justify-end p-4">
                            <div className="w-3/4 h-3 bg-black/5 rounded-full mb-3" />
                            <div className="w-1/2 h-3 bg-black/5 rounded-full" />
                        </div>
                    </div>

                    {/* Feature 2: Telemetry Typewriter */}
                    <div className="feature-card bg-[#2E4036] text-[#F2F0E9] rounded-[2rem] p-8 md:p-10 shadow-lg group hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-8">
                            <Shield className="text-[#A9E5C3]" size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-medium mb-4">Privacidad Extrema</h3>
                        <p className="opacity-70 leading-relaxed mb-8 text-[#FAF8F5]">Tus datos nunca te abandonan. Cifrado local por defecto, con sincronización en la nube completamente opcional.</p>
                        <div className="h-32 bg-black/20 rounded-2xl p-4 font-mono text-xs text-[#A9E5C3] opacity-80 flex items-end">
                            <span>{telemetryText}<span className="animate-pulse">_</span></span>
                        </div>
                    </div>

                    {/* Feature 3: Emotional Map representation */}
                    <div className="feature-card bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-black/5 group hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-16 h-16 rounded-full bg-[#CC5833]/10 flex items-center justify-center mb-8">
                            <Activity className="text-[#CC5833]" size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-medium mb-4">Mapa Estelar</h3>
                        <p className="opacity-70 leading-relaxed mb-8">Visualiza tu historial emocional como una constelación de días, ayudándote a reconocer patrones sin juicios.</p>
                        <div className="h-32 rounded-2xl relative overflow-hidden flex items-center justify-center gap-2">
                            <CircleDot size={20} className="text-[#CC5833]/40" />
                            <CircleDot size={32} className="text-[#A9BAE5]/80" />
                            <CircleDot size={24} className="text-[#A9E5C3]/60" />
                            <CircleDot size={40} className="text-[#E5D4A9]/90" />
                        </div>
                    </div>

                </div>
            </section>

            {/* 5. Sticky Protocol Instructions */}
            <section className="py-20 bg-[#1A1A1A] relative">
                <div className="sticky-card min-h-[90vh] w-full flex items-center justify-center absolute top-0 left-0 bg-[#2E4036] text-[#F2F0E9] rounded-b-[4rem] z-30">
                    <div className="text-center max-w-2xl px-8">
                        <div className="font-mono text-[#CC5833] mb-6">Fase 1</div>
                        <h2 className="text-5xl md:text-7xl font-serif italic mb-6">Respira.</h2>
                        <p className="text-xl opacity-70">El primer paso es soltar la tensión física. Nadie te apura.</p>
                    </div>
                </div>
                <div className="sticky-card min-h-[90vh] w-full flex items-center justify-center absolute top-0 left-0 bg-[#CC5833] text-white rounded-b-[4rem] z-20" style={{ marginTop: '5vh' }}>
                    <div className="text-center max-w-2xl px-8">
                        <div className="font-mono text-white/70 mb-6">Fase 2</div>
                        <h2 className="text-5xl md:text-7xl font-serif italic mb-6">Identifica.</h2>
                        <p className="text-xl opacity-90">Ponle un nombre a lo que sientes. Una palabra es suficiente.</p>
                    </div>
                </div>
                <div className="sticky-card min-h-[90vh] w-full flex items-center justify-center relative top-0 left-0 bg-[#F2F0E9] text-[#1A1A1A] rounded-b-[4rem] z-10" style={{ marginTop: '10vh' }}>
                    <div className="text-center max-w-2xl px-8">
                        <div className="font-mono text-[#2E4036]/50 mb-6">Fase 3</div>
                        <h2 className="text-5xl md:text-7xl font-serif italic mb-6">Escribe.</h2>
                        <p className="text-xl opacity-70">Vuelca la abstracción en palabras concretas. Materializa la emoción.</p>
                    </div>
                </div>
            </section>

            {/* 7. Footer & Final CTA */}
            <footer ref={ctaRef} className="bg-[#1A1A1A] text-[#F2F0E9] pt-40 pb-20 px-8 rounded-t-[4rem] relative z-40 -mt-20">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    <h2 className="text-5xl md:text-6xl font-serif italic mb-8">Comienza cuando estés listo.</h2>
                    <p className="text-xl opacity-60 mb-16 max-w-xl">El refugio siempre estará aquí, disponible 24/7 sin requerir conexión constante.</p>
                    <button
                        onClick={onEnter}
                        className="bg-[#F2F0E9] text-[#1A1A1A] px-10 py-5 rounded-full text-xl font-medium hover:scale-105 transition-transform"
                    >
                        Entrar al refugio
                    </button>

                    <div className="w-full h-px bg-white/10 my-20" />

                    <div className="flex flex-col md:flex-row justify-between items-center w-full opacity-40 text-sm">
                        <span>&copy; 2026 Diario de Emociones.</span>
                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Sistemas operacionales - Local Only Defaults</span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
