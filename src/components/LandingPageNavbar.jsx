import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

const LandingPageNavbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Obter usuário atual
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        // Ouvir mudanças na autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLoginClick = () => {
        if (user) {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/login';
        }
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 transition-all duration-300"
        >
            <div className="max-w-7xl mx-auto glass-panel rounded-full px-3 md:px-6 py-2 md:py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                    <img src="/logo-controle-c.png" alt="Controle-C Logo" className="h-8 md:h-10 w-auto object-contain" />
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-white text-lg md:text-xl font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Controle-C</h2>
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider">v2.0 com IA</span>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-8">
                    {['Início', 'Recursos', 'Dashboard', 'Planos'].map((item, index) => (
                        <a
                            key={index}
                            className="text-slate-300 hover:text-white text-sm font-medium transition-colors relative group"
                            href={`#${item === 'Início' ? 'hero' : item === 'Recursos' ? 'features' : item === 'Planos' ? 'pricing' : item.toLowerCase()}`}
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    ))}
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={handleLoginClick}
                        className="text-slate-300 hover:text-white text-sm font-bold transition-colors cursor-pointer"
                    >
                        {user ? 'Painel' : 'Login'}
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                        className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-full h-9 md:h-10 px-4 md:px-5 bg-gradient-to-r from-primary to-[#1da851] hover:shadow-[0_0_20px_rgba(37,212,102,0.4)] text-[#020c1b] text-sm font-bold transition-all duration-300"
                    >
                        <span>
                            <span className="sm:hidden">Testar</span>
                            <span className="hidden sm:inline">Testar no WhatsApp</span>
                        </span>
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
};

export default LandingPageNavbar;
