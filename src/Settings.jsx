import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  User,
  Palette,
  Heart,
  Shield,
  Bell,
  Cloud,
  CloudOff,
  HardDrive,
  Download,
  Trash2,
  Plus,
  X,
  Clock,
  LogOut
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import AuthModal from './AuthModal';
import { supabase } from './lib/supabase';

const MENU_ITEMS = [
  { id: 'profile', label: 'Identity & Presence', icon: User, desc: 'How you appear in your safe space' },
  { id: 'aesthetic', label: 'The Atmosphere', icon: Palette, desc: 'Your visual environment' },
  { id: 'triggers', label: 'Emotional Vocabulary', icon: Heart, desc: 'Words that define your feelings' },
  { id: 'privacy', label: 'Privacy & The Vault', icon: Shield, desc: 'Security for your thoughts' },
  { id: 'notifications', label: 'Gentle Nudges', icon: Bell, desc: 'Reminders to breathe and reflect' }
];

const MOODS = [
  { id: 'organic', name: 'Organic Tech', bg: 'bg-[#F2F0E9]', cardBg: 'bg-[#F2F0E9]/80', text: 'text-[#1A1A1A]', primary: '#2E4036', accent: '#CC5833' },
  { id: 'midnight', name: 'Midnight Luxe', bg: 'bg-[#0D0D12]', cardBg: 'bg-[#0D0D12]/80', text: 'text-[#FAF8F5]', primary: '#C9A84C', accent: '#C9A84C' },
  { id: 'brutalist', name: 'Brutalist Signal', bg: 'bg-[#F5F3EE]', cardBg: 'bg-[#F5F3EE]/90', text: 'text-[#111111]', primary: '#E8E4DD', accent: '#E63B2E' },
  { id: 'vapor', name: 'Vapor Clinic', bg: 'bg-[#F0EFF4]', cardBg: 'bg-[#F0EFF4]/80', text: 'text-[#18181B]', primary: '#0A0A14', accent: '#7B61FF' }
];

const syncProfileToCloud = async (session, payload) => {
  if (!session?.user?.id) return;

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: session.user.id,
      name: payload.profile.name,
      pronouns: payload.profile.pronouns,
      color: payload.profile.color,
      emotions: payload.emotions,
      notifications: payload.notifications,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error("[Supabase Sync] Error syncing profile:", error.message);
  } else {
    console.log("[Supabase Sync] Profile saved successfully.");
  }
};

export default function Settings() {
  const { session, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [initDone, setInitDone] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Cloud-only State
  const [mood, setMood] = useState(MOODS[0]);
  const [profile, setProfile] = useState({ name: 'Nestor', pronouns: 'he/him', color: '#E5A9A9' });
  const [emotions, setEmotions] = useState(['Joy', 'Anxiety', 'Grateful', 'Exhausted']);
  const [notifications, setNotifications] = useState({ enabled: false, hour: '20', minute: '00' });

  const contentRef = useRef(null);
  const skipFirstSync = useRef(true);

  // Fetch settings from Cloud on Session Load
  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data && !error) {
          if (data.name) setProfile({ name: data.name, pronouns: data.pronouns || 'he/him', color: data.color || '#E5A9A9' });
          if (data.emotions) setEmotions(data.emotions);
          if (data.notifications) setNotifications(data.notifications);
        }
      } else {
        // Reset to defaults if logged out
        setProfile({ name: 'Nestor', pronouns: 'he/him', color: '#E5A9A9' });
        setEmotions(['Joy', 'Anxiety', 'Grateful', 'Exhausted']);
        setNotifications({ enabled: false, hour: '20', minute: '00' });
      }
      setInitDone(true);
    };

    fetchProfile();
  }, [session]);

  // Cloud Sync Effect (Triggered on changes if authenticated)
  useEffect(() => {
    if (!initDone) return;

    const currentState = { mood, profile, emotions, notifications };

    if (skipFirstSync.current) {
      skipFirstSync.current = false;
      return;
    }

    if (session) {
      syncProfileToCloud(session, currentState);
    }
  }, [mood, profile, emotions, notifications, initDone, session]);

  // Transition between tabs
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { y: 10, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
      );
    }, contentRef);
    return () => ctx.revert();
  }, [activeTab]);

  // Background Mood Transition
  useEffect(() => {
    gsap.to('.app-background', {
      backgroundColor: mood.bg.replace('bg-[', '').replace(']', ''),
      duration: 1.2,
      ease: 'power2.inOut'
    });
  }, [mood]);

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 ${mood.bg} ${mood.text} font-sans relative overflow-hidden flex items-center justify-center p-4 md:p-8 app-background`}>
      {/* Global CSS Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Cloud-Only Logged Out Indicator */}
      {!session && (
        <div className="absolute top-6 right-6 flex items-center gap-2 text-xs font-medium opacity-60 bg-black/5 px-4 py-2 rounded-full backdrop-blur-md z-50 transition-opacity">
          <CloudOff size={14} />
          <span>Not Authenticated</span>
        </div>
      )}

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">

        {/* Navigation Sidebar */}
        <nav className="md:col-span-4 lg:col-span-3 flex flex-col gap-2">
          <div className="mb-8 px-4">
            <h1 className="text-3xl font-medium tracking-tight mb-2">Configuration</h1>
            <p className="text-sm opacity-60">Mold this space to your comfort.</p>
          </div>

          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible pb-4 md:pb-0 hide-scrollbar gap-2">
            {MENU_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex items-center gap-4 px-4 py-4 rounded-[2rem] text-left transition-all duration-500 min-w-[200px] md:min-w-0
                    ${isActive ? `bg-white/10 backdrop-blur-md shadow-sm border-l-4` : 'hover:bg-black/5 hover:translate-y-[-1px] border-l-4 border-transparent opacity-70'}
                  `}
                  style={{ borderLeftColor: isActive ? mood.accent : 'transparent' }}
                >
                  <div className={`p-2 rounded-full ${isActive ? 'bg-black/5' : ''}`}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-medium text-sm md:text-base">{item.label}</div>
                    <div className="text-xs opacity-60 hidden md:block mt-0.5">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="md:col-span-8 lg:col-span-9">
          <div
            ref={contentRef}
            className={`w-full min-h-[600px] p-8 md:p-12 rounded-[2.5rem] backdrop-blur-2xl border border-white/10 shadow-2xl transition-colors duration-1000 ${mood.cardBg}`}
          >
            {activeTab === 'profile' && <ProfileSection mood={mood} profile={profile} setProfile={setProfile} />}
            {activeTab === 'aesthetic' && <AestheticSection mood={mood} setMood={setMood} />}
            {activeTab === 'triggers' && <TriggersSection mood={mood} emotions={emotions} setEmotions={setEmotions} />}
            {activeTab === 'privacy' &&
              <PrivacySection
                mood={mood}
                cloudSyncEnabled={cloudSyncEnabled}
                setCloudSyncEnabled={setCloudSyncEnabled}
                session={session}
                signOut={signOut}
                openAuthModal={() => setIsAuthModalOpen(true)}
              />
            }
            {activeTab === 'notifications' && <NotificationSection mood={mood} notifications={notifications} setNotifications={setNotifications} />}
          </div>
        </main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          // Auto-enable sync if they successfully logged in
          if (session && !cloudSyncEnabled) {
            setCloudSyncEnabled(true);
          }
        }}
      />
    </div>
  );
}

/* --- Section Components --- */

function ProfileSection({ mood, profile, setProfile }) {
  const colors = ['#E5A9A9', '#A9BAE5', '#E5D4A9', '#A9E5C3', '#C3A9E5'];

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-2xl font-medium mb-2">Identity & Presence</h2>
        <p className="opacity-60">How you refer to yourself within these walls.</p>
      </header>

      <div className="space-y-8 max-w-lg">
        <div>
          <label className="block text-sm font-medium opacity-70 mb-4">Your Essence (Avatar)</label>
          <div className="flex gap-4">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setProfile({ ...profile, color })}
                className="w-12 h-12 rounded-full transition-transform duration-300 hover:scale-110"
                style={{
                  backgroundColor: color,
                  boxShadow: profile.color === color ? `0 0 0 4px ${mood.bg}, 0 0 0 6px ${color}` : 'none'
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="group">
            <label htmlFor="profileName" className="block text-xs font-medium opacity-50 uppercase tracking-wider mb-2 transition-opacity group-focus-within:opacity-100">Preferred Name</label>
            <input
              id="profileName"
              name="profileName"
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-transparent border-b-2 border-black/10 focus:border-black/40 py-2 outline-none text-xl transition-colors"
              placeholder="What should we call you?"
            />
          </div>

          <div className="group">
            <label htmlFor="profilePronouns" className="block text-xs font-medium opacity-50 uppercase tracking-wider mb-2 transition-opacity group-focus-within:opacity-100">Pronouns</label>
            <input
              id="profilePronouns"
              name="profilePronouns"
              type="text"
              value={profile.pronouns}
              onChange={(e) => setProfile({ ...profile, pronouns: e.target.value })}
              className="w-full bg-transparent border-b-2 border-black/10 focus:border-black/40 py-2 outline-none text-xl transition-colors"
              placeholder="e.g. they/them"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AestheticSection({ mood, setMood }) {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-2xl font-medium mb-2">The Atmosphere</h2>
        <p className="opacity-60">Set the tone and visual temperature of your space.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {MOODS.map(m => (
          <button
            key={m.id}
            onClick={() => setMood(m)}
            className={`
              relative p-6 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden group hover:-translate-y-1
              ${mood.id === m.id ? 'border-current' : 'border-black/5 hover:border-black/20'}
            `}
          >
            <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30" style={{ backgroundColor: m.bg.replace('bg-[', '').replace(']', '') }} />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: m.accent }} />
              <div className="text-left">
                <div className="font-medium text-lg">{m.name}</div>
                {mood.id === m.id && <span className="text-xs opacity-60">Currently Active</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TriggersSection({ mood, emotions, setEmotions }) {
  const [newEmotion, setNewEmotion] = useState('');

  const addEmotion = (e) => {
    e.preventDefault();
    if (newEmotion.trim() && !emotions.includes(newEmotion.trim())) {
      setEmotions([...emotions, newEmotion.trim()]);
      setNewEmotion('');
    }
  };

  const removeEmotion = (emo) => {
    setEmotions(emotions.filter(e => e !== emo));
  };

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-2xl font-medium mb-2">Emotional Vocabulary</h2>
        <p className="opacity-60">Curate the words you use to define your feelings.</p>
      </header>

      <div className="space-y-8">
        <div className="flex flex-wrap gap-3">
          {emotions.map(emo => (
            <div
              key={emo}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-black/5 backdrop-blur-sm transition-transform hover:-translate-y-0.5"
            >
              <span>{emo}</span>
              <button
                onClick={() => removeEmotion(emo)}
                className="opacity-50 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-black/10"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addEmotion} className="flex items-center gap-4 max-w-sm">
          <label htmlFor="newEmotion" className="sr-only">New Emotion Name</label>
          <input
            id="newEmotion"
            name="newEmotion"
            type="text"
            value={newEmotion}
            onChange={(e) => setNewEmotion(e.target.value)}
            placeholder="Add new emotion..."
            className="flex-1 bg-transparent border-b-2 border-black/10 focus:border-black/40 py-2 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!newEmotion.trim()}
            className="p-2 rounded-full bg-black/5 hover:bg-black/10 disabled:opacity-50 transition-colors"
          >
            <Plus size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

function PrivacySection({ mood, session, signOut, openAuthModal }) {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-2xl font-medium mb-2">Cloud Auth & Privacy</h2>
        <p className="opacity-60">Manage your secure cloud vault session.</p>
      </header>

      <div className="space-y-10 max-w-2xl">
        {/* Authentication State */}
        <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-black/5">
          <div className="flex items-start justify-between">
            <div className="max-w-md pr-8">
              <h3 className="font-medium flex items-center gap-2 mb-1">
                <Cloud size={18} /> Supabase Vault
              </h3>
              <p className="text-sm opacity-60 leading-relaxed">
                Your journal data is entirely cloud-based. You must be authenticated to securely write and sync entries to your vault.
              </p>
            </div>

            {!session && (
              <button
                onClick={openAuthModal}
                className="px-6 py-2 rounded-full font-medium transition-all duration-300 bg-[#2E4036] text-white hover:bg-[#1A2E24] shadow-md"
              >
                Authenticate
              </button>
            )}
          </div>

          {session && (
            <div className="flex items-center justify-between pt-4 border-t border-black/10 mt-2">
              <div className="text-sm opacity-70">
                Logged in as: <strong>{session.user.email}</strong>
              </div>
              <button onClick={handleSignOut} className="text-xs flex items-center gap-1 font-medium opacity-60 hover:opacity-100 transition-opacity text-red-600">
                <LogOut size={14} /> Disconnect Vault
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationSection({ mood, notifications, setNotifications }) {
  const updateNotifications = (updates) => {
    setNotifications({ ...notifications, ...updates });
  };

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-2xl font-medium mb-2">Reminders to Breathe</h2>
        <p className="opacity-60">Gentle nudges to pause, reflect, and document your emotional state.</p>
      </header>

      <div className="max-w-md space-y-8">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">Daily Reflection Nudge</div>
          <button
            onClick={() => updateNotifications({ enabled: !notifications.enabled })}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${notifications.enabled ? 'bg-black/80' : 'bg-black/20'}`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${notifications.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className={`transition-all duration-500 overflow-hidden ${notifications.enabled ? 'opacity-100 max-h-40' : 'opacity-30 max-h-40 pointer-events-none'}`}>
          <label className="block text-sm font-medium opacity-70 mb-4 flex items-center gap-2">
            <Clock size={16} /> Preferred Time
          </label>

          <div className="flex items-center gap-4 bg-black/5 p-6 rounded-[2rem] w-fit">
            <select
              value={notifications.hour}
              onChange={(e) => updateNotifications({ hour: e.target.value })}
              className="appearance-none bg-transparent text-4xl font-light outline-none cursor-pointer hover:opacity-70 transition-opacity"
            >
              {Array.from({ length: 24 }).map((_, i) => {
                const h = i.toString().padStart(2, '0');
                return <option key={h} value={h}>{h}</option>;
              })}
            </select>
            <span className="text-4xl font-light opacity-50">:</span>
            <select
              value={notifications.minute}
              onChange={(e) => updateNotifications({ minute: e.target.value })}
              className="appearance-none bg-transparent text-4xl font-light outline-none cursor-pointer hover:opacity-70 transition-opacity"
            >
              {['00', '15', '30', '45'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <p className="text-xs opacity-50 mt-4">We will softly remind you at this time.</p>
        </div>
      </div>
    </div>
  );
}
