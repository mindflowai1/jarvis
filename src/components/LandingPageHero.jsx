import React from 'react';


import { motion } from 'framer-motion';

import { useTypewriter } from '../hooks/useTypewriter';

const LandingPageHero = () => {
    const dynamicText = useTypewriter([
        'sua vida financeira',
        'sua agenda',
        'suas tarefas'
    ]);

    return (
        <div id="hero" className="relative flex items-center pt-24 pb-12 lg:pb-20 overflow-hidden bg-background-ocean">
            <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,212,102,0.15)_0%,_rgba(2,12,27,0)_70%)] blur-3xl opacity-50 pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col gap-8 items-start relative z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        Novo: Integração com Google Calendar lançada 🚀
                    </motion.div>
                    <div className="flex flex-col gap-4">
                        <h1 className="min-h-[4.5em] text-white text-5xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight">
                            A IA que organiza, em um áudio, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25d466] to-[#00d2ff]">{dynamicText}</span><span className="text-primary animate-pulse w-1 inline-block">|</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                            O assistente de IA que vive no seu WhatsApp. Envie uma mensagem de voz para registrar gastos, agendar pagamentos e visualizar gráficos. Sem apps complexos.
                        </p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                            className="group flex items-center justify-center gap-3 h-14 px-8 rounded-full bg-primary hover:bg-primary-dark text-[#020c1b] text-base font-bold transition-all duration-300 shadow-[0_0_25px_rgba(37,212,102,0.25)] hover:shadow-[0_0_40px_rgba(37,212,102,0.4)]"
                        >
                            <span className="material-symbols-outlined text-xl">chat</span>
                            <span>Começar Agora — É Grátis</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
                            className="flex items-center justify-center gap-2 h-14 px-8 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-white text-base font-bold transition-all duration-300"
                        >
                            <span className="material-symbols-outlined text-xl">play_circle</span>
                            <span>Ver Demo</span>
                        </motion.button>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col gap-4 pt-4"
                    >
                        <p className="text-slate-500 text-sm font-medium">Aprovado por +10.000 usuários de empresas como</p>
                        <div className="flex flex-wrap items-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            <div className="h-6 w-auto flex items-center text-white font-display font-bold text-lg">Google</div>
                            <div className="w-px h-4 bg-slate-700"></div>
                            <div className="h-6 w-auto flex items-center text-white font-display font-bold text-lg">Nubank</div>
                            <div className="w-px h-4 bg-slate-700"></div>
                            <div className="h-6 w-auto flex items-center text-white font-display font-bold text-lg">XP</div>
                            <div className="w-px h-4 bg-slate-700"></div>
                            <div className="h-6 w-auto flex items-center text-white font-display font-bold text-lg">Stone</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Side - Phone Mockup */}
                <motion.div
                    initial={{ opacity: 0, x: 50, rotate: 5 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="relative flex justify-center lg:justify-end min-h-[680px] lg:h-[800px] items-center mt-12 lg:mt-0"
                >

                    {/* Main Scale Wrapper for Responsiveness */}
                    <div className="relative scale-90 sm:scale-100 transition-transform duration-300">

                        {/* Floating Widgets */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute top-10 left-0 lg:-left-8 z-20 animate-float glass-panel p-4 rounded-2xl flex items-center gap-4 max-w-[220px] shadow-2xl"
                        >
                            <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <span className="material-symbols-outlined">calendar_month</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400">Google Calendar</span>
                                <span className="text-sm text-white font-bold">Fatura Sincronizada</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="absolute bottom-20 right-0 lg:-right-4 z-20 animate-float-delayed glass-panel p-4 rounded-2xl flex flex-col gap-2 shadow-2xl border border-primary/20"
                        >
                            <div className="flex justify-between items-center gap-8">
                                <span className="text-xs text-slate-400">Economia Mensal</span>
                                <span className="text-xs text-primary font-bold flex items-center">
                                    <span className="material-symbols-outlined text-sm">trending_up</span> +15%
                                </span>
                            </div>
                            <div className="h-10 flex items-end gap-1">
                                <div className="w-2 bg-primary/20 rounded-t-sm h-[40%]"></div>
                                <div className="w-2 bg-primary/20 rounded-t-sm h-[60%]"></div>
                                <div className="w-2 bg-primary/20 rounded-t-sm h-[50%]"></div>
                                <div className="w-2 bg-primary/20 rounded-t-sm h-[70%]"></div>
                                <div className="w-2 bg-primary rounded-t-sm h-[85%] shadow-[0_0_10px_rgba(37,212,102,0.5)]"></div>
                            </div>
                        </motion.div>

                        <div className="relative z-10">
                            <div className="absolute -inset-6 bg-gradient-to-tr from-[#25D366] to-[#00d2ff] rounded-[3.5rem] blur-2xl opacity-50 animate-pulse-glow"></div>
                            <div className="absolute -inset-2 bg-[#25D366] rounded-[3.5rem] blur-xl opacity-60 animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
                            <div className="relative w-[300px] sm:w-[340px] h-[640px] bg-[#121212] rounded-[3rem] border-[8px] border-[#2d2d2d] shadow-2xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-8 bg-[#121212] z-30 flex justify-center">
                                    <div className="w-24 h-6 bg-black rounded-b-xl"></div>
                                </div>
                                <div className="bg-[#202c33] px-4 pt-12 pb-3 flex items-center gap-3 border-b border-[#2a3942]">
                                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                        <span className="material-symbols-outlined text-xl">smart_toy</span>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-white text-sm font-semibold">Controle-C 🤖</span>
                                        <span className="text-[#8696a0] text-xs">online</span>
                                    </div>
                                    <div className="flex gap-4 text-primary">
                                        <span className="material-symbols-outlined">videocam</span>
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                </div>

                                <div className="bg-[#0b141a] h-full p-4 flex flex-col gap-4 overflow-hidden relative">
                                    {/* WhatsApp BG Image */}
                                    <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8U34eklfWkRgSoCuFKrV5nKCbsHvzzt2iXyH7n6y5R18TMmDnMbZaUP3w9wEJNnwxLNCT_WzfKEVJof2rOE1_GbDMp1U1tVnbhy5wFHCsIBaq1JLE8VL5ZBsJNlXTBDwV4yBiR2AGq02J5GxCarVcD1lJA1SDFAe5cwnOugBL73S5e6ojsNomsho-WIA1ETPqCOKDXfpJYl17jUI2MTb3S_WdUBA6dih5Z3MGEYkhCfzn8gy5z4RcJGXBbRRkrhwZLEu1Ym7Y48g')" }}></div>
                                    <div className="absolute inset-0 bg-[#0b141a]/95 z-0"></div>

                                    <div className="relative z-10 flex justify-center mb-2">
                                        <span className="bg-[#182229] text-[#8696a0] text-[10px] px-3 py-1 rounded-lg shadow-sm">Hoje</span>
                                    </div>

                                    {/* User Message */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.5, type: "spring" }}
                                        className="relative z-10 self-end max-w-[85%] bg-[#005c4b] rounded-lg rounded-tr-none p-2 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3 pr-2">
                                            <div className="text-[#aebac1]">
                                                <span className="material-symbols-outlined text-3xl">account_circle</span>
                                            </div>
                                            <div className="flex flex-col w-full min-w-[140px]">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="material-symbols-outlined text-slate-300 text-lg">play_arrow</span>
                                                    <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden flex items-center gap-0.5 px-0.5">
                                                        <div className="w-[2px] h-[60%] bg-white/80 rounded-full"></div>
                                                        <div className="w-[2px] h-[100%] bg-white/80 rounded-full"></div>
                                                        <div className="w-[2px] h-[40%] bg-white/80 rounded-full"></div>
                                                        <div className="w-[2px] h-[70%] bg-white/80 rounded-full"></div>
                                                        <div className="w-[2px] h-[50%] bg-white/80 rounded-full"></div>
                                                        <div className="w-[2px] h-[30%] bg-white/80 rounded-full"></div>
                                                        <div className="w-[2px] h-[80%] bg-white/80 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[#aebac1] text-[10px]">0:12</span>
                                                    <div className="flex items-end gap-1">
                                                        <span className="text-[#aebac1] text-[10px]">10:42</span>
                                                        <span className="material-symbols-outlined text-[#53bdeb] text-[14px]">done_all</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Bot Message */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 2.5, type: "spring" }}
                                        className="relative z-10 self-start max-w-[85%] bg-[#202c33] rounded-lg rounded-tl-none p-3 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <p className="text-white text-sm">Entendido! Registrei o gasto:</p>
                                            <div className="bg-[#182229] rounded p-2 border-l-4 border-primary">
                                                <p className="text-white font-bold text-sm">Almoço de Negócios</p>
                                                <p className="text-primary font-bold">R$ 120,00</p>
                                                <p className="text-[#8696a0] text-xs">Categoria: Alimentação</p>
                                            </div>
                                            <p className="text-white text-sm">Também adicionei ao seu Google Calendar para o reembolso. ✅</p>
                                            <div className="flex justify-end items-center gap-1 mt-1">
                                                <span className="text-[#8696a0] text-[10px]">10:42</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Chart Message */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 3.5, type: "spring" }}
                                        className="relative z-10 self-start max-w-[85%] bg-[#202c33] rounded-lg rounded-tl-none p-1 shadow-sm mt-1"
                                    >
                                        <div className="bg-[#111b21] rounded p-3">
                                            <p className="text-[#8696a0] text-xs mb-2 uppercase tracking-wide font-bold">Gastos da Semana</p>
                                            <div className="flex items-end justify-between h-16 gap-1 px-1">
                                                <div className="w-full bg-[#2a3942] rounded-t-sm h-[30%]"></div>
                                                <div className="w-full bg-[#2a3942] rounded-t-sm h-[50%]"></div>
                                                <div className="w-full bg-[#2a3942] rounded-t-sm h-[40%]"></div>
                                                <div className="w-full bg-[#2a3942] rounded-t-sm h-[80%]"></div>
                                                <div className="w-full bg-[#2a3942] rounded-t-sm h-[45%]"></div>
                                                <div className="w-full bg-[#2a3942] rounded-t-sm h-[60%]"></div>
                                                <div className="w-full bg-primary rounded-t-sm h-[90%]"></div>
                                            </div>
                                            <div className="flex justify-between text-[#8696a0] text-[9px] mt-1 px-1 font-mono">
                                                <span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span><span>D</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center gap-1 p-2 pb-1">
                                            <span className="text-[#8696a0] text-[10px]">10:43</span>
                                        </div>
                                    </motion.div>

                                    {/* Input Area */}
                                    <div className="absolute bottom-16 left-0 w-full p-2 flex gap-2 items-center z-20">
                                        <div className="bg-[#202c33] flex-1 h-10 rounded-full flex items-center px-4 gap-3">
                                            <span className="material-symbols-outlined text-[#8696a0] text-xl">sentiment_satisfied</span>
                                            <span className="text-[#8696a0] text-sm">Mensagem</span>
                                            <div className="flex-1"></div>
                                            <span className="material-symbols-outlined text-[#8696a0] text-xl">attach_file</span>
                                            <span className="material-symbols-outlined text-[#8696a0] text-xl">camera_alt</span>
                                        </div>
                                        <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                                            <span className="material-symbols-outlined text-xl">mic</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 left-0 w-full flex justify-center z-20">
                                        <div className="w-32 h-1 bg-white/20 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPageHero;
