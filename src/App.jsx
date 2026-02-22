import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import Landing from './Landing';
import Settings from './Settings';
import ZenEditor from './ZenEditor';
import EmotionalMap from './EmotionalMap';
import CalmAnchor from './CalmAnchor';
import FirstAidKit from './FirstAidKit';

function App() {
    const [currentView, setCurrentView] = useState('landing');
    const [isFirstAidOpen, setIsFirstAidOpen] = useState(false);

    // Simple Router
    const renderView = () => {
        switch (currentView) {
            case 'landing':
                return <Landing onEnter={() => setCurrentView('editor')} />;
            case 'editor':
                return <ZenEditor />;
            case 'history':
                return <EmotionalMap />;
            case 'settings':
                return <Settings />;
            default:
                return <Landing onEnter={() => setCurrentView('editor')} />;
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Global Navigation that appears when not on landing page */}
            {currentView !== 'landing' && (
                <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/40 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-6 shadow-sm border border-black/5 text-[#2A2A35]/80 text-sm font-medium transition-all hover:bg-white/60">

                    <button
                        onClick={() => setCurrentView('editor')}
                        className={`transition-colors ${currentView === 'editor' ? 'text-[#CC5833]' : 'hover:text-[#1A1A1A]'}`}
                    >
                        Refugio
                    </button>

                    <button
                        onClick={() => setCurrentView('history')}
                        className={`transition-colors ${currentView === 'history' ? 'text-[#CC5833]' : 'hover:text-[#1A1A1A]'}`}
                    >
                        Mapa
                    </button>

                    <button
                        onClick={() => setCurrentView('settings')}
                        className={`transition-colors ${currentView === 'settings' ? 'text-[#CC5833]' : 'hover:text-[#1A1A1A]'}`}
                    >
                        Configuración
                    </button>

                    <div className="w-px h-4 bg-black/10 mx-2" />

                    <button
                        onClick={() => setCurrentView('landing')}
                        className="flex items-center gap-2 hover:text-[#1A1A1A] transition-colors opacity-60 hover:opacity-100"
                    >
                        <ArrowLeft size={14} /> Salir
                    </button>

                </nav>
            )}

            {/* Global Calm Anchor (Available inside the app) */}
            {currentView !== 'landing' && (
                <CalmAnchor onClick={() => setIsFirstAidOpen(true)} />
            )}

            {/* The Emotional First Aid Modal */}
            <FirstAidKit isOpen={isFirstAidOpen} onClose={() => setIsFirstAidOpen(false)} />

            {/* Main Content Area */}
            {renderView()}
        </div>
    );
}

export default App;
