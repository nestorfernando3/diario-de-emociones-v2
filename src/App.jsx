import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

import Landing from './Landing';
import Settings from './Settings';
import ZenEditor from './ZenEditor';
import EmotionalMap from './EmotionalMap';
import CalmAnchor from './CalmAnchor';
import FirstAidKit from './FirstAidKit';
import AuthModal from './AuthModal';
import { useAuth } from './contexts/AuthContext';

function App() {
    const { session } = useAuth();
    const [currentView, setCurrentView] = useState('landing');
    const [isFirstAidOpen, setIsFirstAidOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Watch for successful login to redirect
    useEffect(() => {
        if (session && isAuthModalOpen) {
            setIsAuthModalOpen(false);
            if (currentView === 'landing') {
                setCurrentView('editor');
            }
        }
    }, [session, isAuthModalOpen, currentView]);

    const handleNavigation = (view) => {
        if (view !== 'landing' && !session) {
            setIsAuthModalOpen(true);
        } else {
            setCurrentView(view);
        }
    };

    // Simple Router
    const renderView = () => {
        switch (currentView) {
            case 'landing':
                return <Landing onEnter={() => handleNavigation('editor')} />;
            case 'editor':
                return <ZenEditor />;
            case 'history':
                return <EmotionalMap />;
            case 'settings':
                return <Settings />;
            default:
                return <Landing onEnter={() => handleNavigation('editor')} />;
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Global Navigation that appears when not on landing page */}
            {currentView !== 'landing' && (
                <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/40 backdrop-blur-xl px-4 md:px-6 py-3 rounded-full flex items-center gap-4 md:gap-6 shadow-sm border border-black/5 text-[#2A2A35]/80 text-sm font-medium transition-all hover:bg-white/60">

                    <button
                        onClick={() => handleNavigation('editor')}
                        className={`transition-colors ${currentView === 'editor' ? 'text-[#CC5833]' : 'hover:text-[#1A1A1A]'}`}
                    >
                        Refugio
                    </button>

                    <button
                        onClick={() => handleNavigation('history')}
                        className={`transition-colors ${currentView === 'history' ? 'text-[#CC5833]' : 'hover:text-[#1A1A1A]'}`}
                    >
                        Mapa
                    </button>

                    <button
                        onClick={() => handleNavigation('settings')}
                        className={`transition-colors ${currentView === 'settings' ? 'text-[#CC5833]' : 'hover:text-[#1A1A1A]'}`}
                    >
                        Configuración
                    </button>

                    <div className="w-px h-4 bg-black/10 mx-1 md:mx-2" />

                    <button
                        onClick={() => handleNavigation('landing')}
                        className="flex items-center gap-1 md:gap-2 hover:text-[#1A1A1A] transition-colors opacity-60 hover:opacity-100"
                    >
                        <ArrowLeft size={14} /> <span className="hidden md:inline">Salir</span>
                    </button>

                </nav>
            )}

            {/* Global Calm Anchor (Available inside the app) */}
            {currentView !== 'landing' && (
                <CalmAnchor onClick={() => setIsFirstAidOpen(true)} />
            )}

            {/* Modals */}
            <FirstAidKit isOpen={isFirstAidOpen} onClose={() => setIsFirstAidOpen(false)} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {/* Main Content Area */}
            {renderView()}
        </div>
    );
}

export default App;
