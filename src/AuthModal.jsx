import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { X, Mail, Lock, Loader2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
    const { signIn, signUp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = isLogin
                ? await signIn(email, password)
                : await signUp(email, password);

            if (authError) throw authError;

            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity duration-500"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#F2F0E9] text-[#1A1A1A] rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-3xl font-serif mb-2">{isLogin ? 'Welcome Back' : 'Create Vault'}</h2>
                <p className="text-sm opacity-60 mb-8 leading-relaxed">
                    {isLogin
                        ? 'Access your securely encrypted cloud journal.'
                        : 'Register to enable cloud synchronization across your devices.'}
                </p>

                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-500/10 text-red-600 text-sm border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full bg-white/50 border border-black/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-black/30 focus:bg-white transition-all text-[15px]"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password (min 6 chars)"
                                className="w-full bg-white/50 border border-black/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-black/30 focus:bg-white transition-all text-[15px]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#2E4036] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-[#1A251F] transition-colors disabled:opacity-70"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : (isLogin ? 'Enter Vault' : 'Secure my Data')}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
                    >
                        {isLogin ? "Don't have a vault? Create one" : "Already have a vault? Log in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
