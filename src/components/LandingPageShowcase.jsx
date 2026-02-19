import React from 'react';
import ScrollReveal from './ScrollReveal';
import { Mic, Video, Calendar, Bell } from 'lucide-react';

const LandingPageShowcase = () => {
    return (
        <div id="showcase" className="relative bg-gradient-to-b from-[#020c1b] via-[#0a1628] to-[#020c1b] text-white font-display overflow-hidden flex items-center justify-center min-h-screen py-20 px-4 sm:px-8">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[#2bd4bd]/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-[50%] right-[5%] w-[300px] h-[300px] bg-cyan-400/5 rounded-full blur-[80px]"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            <div className="w-full max-w-7xl relative z-10">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <ScrollReveal variant="fadeInUp">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#2bd4bd]/15 to-transparent border border-[#2bd4bd]/30 text-[#2bd4bd] text-xs font-bold tracking-wider uppercase mb-8 backdrop-blur-xl shadow-lg shadow-[#2bd4bd]/10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2bd4bd] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2bd4bd]"></span>
                            </span>
                            WhatsApp Assistant
                        </div>
                    </ScrollReveal>
                    
                    <ScrollReveal variant="fadeInUp" delay={0.1}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
                            Sua agenda no WhatsApp.{' '}
                            <br className="hidden sm:block" />
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-[#2bd4bd] via-[#20c9b5] to-[#2bd4bd] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                                    Simples assim.
                                </span>
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#2bd4bd]/40" viewBox="0 0 200 12" preserveAspectRatio="none">
                                    <path d="M0 6 Q 100 12 200 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                </svg>
                            </span>
                        </h1>
                    </ScrollReveal>
                    
                    <ScrollReveal variant="fadeInUp" delay={0.2}>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                            Esqueça a navegação complexa. Gerencie seus compromissos apenas conversando.
                        </p>
                    </ScrollReveal>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-[minmax(280px,auto)]">
                    
                    {/* Card 1 - Audio/Text Scheduling (Larger, Spans 2 columns) */}
                    <ScrollReveal delay={0.1} variant="fadeInUp" className="md:col-span-6 lg:col-span-7 row-span-1">
                        <div className="group h-full bg-gradient-to-br from-[#0a192f]/90 to-[#0d1f3a]/50 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl hover:border-[#2bd4bd]/40 hover:shadow-2xl hover:shadow-[#2bd4bd]/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#2bd4bd]/0 via-[#2bd4bd]/0 to-[#2bd4bd]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="relative z-10 h-full flex flex-col">
                                {/* Visual Preview */}
                                <div className="flex-1 flex items-center justify-center mb-8">
                                    <div className="relative">
                                        {/* WhatsApp Message Bubble */}
                                        <div className="bg-[#005c4b] px-5 py-4 rounded-2xl rounded-br-sm shadow-2xl flex items-center gap-4 transform group-hover:scale-105 transition-transform duration-300">
                                            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-lg">
                                                <Mic size={20} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {[...Array(8)].map((_, i) => (
                                                    <div 
                                                        key={i} 
                                                        className="waveform-bar w-1 bg-white/70 rounded-full"
                                                        style={{
                                                            height: `${12 + Math.sin(i * 0.8) * 8}px`,
                                                            animationDelay: `${i * 0.1}s`
                                                        }}
                                                    ></div>
                                                ))}
                                            </div>
                                            <span className="text-xs text-white/70 font-mono ml-2">0:12</span>
                                        </div>
                                        {/* Floating Particles */}
                                        <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-[#25D366]/60 animate-ping"></div>
                                        <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-[#2bd4bd]/60 animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="size-12 rounded-2xl bg-gradient-to-br from-[#25D366]/20 to-[#25D366]/5 border border-[#25D366]/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#25D366]/40 transition-colors">
                                            <Mic size={24} className="text-[#25D366]" strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-[#2bd4bd] transition-colors">
                                                Agendar por Áudio ou Texto
                                            </h3>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                Envie um áudio e nós criamos o evento na sua agenda instantaneamente.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Card 2 - Meet Links (Taller) */}
                    <ScrollReveal delay={0.2} variant="fadeInUp" className="md:col-span-6 lg:col-span-5 row-span-1">
                        <div className="group h-full bg-gradient-to-br from-[#0a192f]/90 to-[#0d1f3a]/50 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl hover:border-[#1da4f7]/40 hover:shadow-2xl hover:shadow-[#1da4f7]/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1da4f7]/0 via-[#1da4f7]/0 to-[#1da4f7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="relative z-10 h-full flex flex-col">
                                {/* Visual Preview */}
                                <div className="flex-1 flex items-center justify-center mb-8">
                                    <div className="w-full max-w-[280px]">
                                        <div className="bg-gradient-to-br from-[#2bd4bd]/10 to-[#1da4f7]/5 border border-[#2bd4bd]/20 rounded-2xl rounded-tr-sm p-4 shadow-2xl backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
                                            <div className="bg-[#0d1f3a]/60 rounded-xl p-3 border border-white/10 flex items-center gap-3">
                                                <div className="size-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-lg">
                                                    <Video size={20} className="text-[#1da4f7]" />
                                                </div>
                                                <div className="overflow-hidden flex-1">
                                                    <p className="text-xs font-semibold text-white truncate mb-1">Reunião de Alinhamento</p>
                                                    <p className="text-[10px] text-[#1da4f7] truncate font-mono">meet.google.com/abc-defg</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-[10px] text-[#2bd4bd] flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#2bd4bd] animate-pulse"></span>
                                                Link gerado e enviado.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="size-12 rounded-2xl bg-gradient-to-br from-[#1da4f7]/20 to-[#1da4f7]/5 border border-[#1da4f7]/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#1da4f7]/40 transition-colors">
                                            <Video size={24} className="text-[#1da4f7]" strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-[#2bd4bd] transition-colors">
                                                Links do Meet Automáticos
                                            </h3>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                Detectamos intenção de reunião e anexamos o link automaticamente.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Card 3 - Agenda Query */}
                    <ScrollReveal delay={0.3} variant="fadeInUp" className="md:col-span-6 lg:col-span-5 row-span-1">
                        <div className="group h-full bg-gradient-to-br from-[#0a192f]/90 to-[#0d1f3a]/50 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl hover:border-[#2bd4bd]/40 hover:shadow-2xl hover:shadow-[#2bd4bd]/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#2bd4bd]/0 via-[#2bd4bd]/0 to-[#2bd4bd]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="relative z-10 h-full flex flex-col">
                                {/* Visual Preview */}
                                <div className="flex-1 flex items-center justify-center mb-8">
                                    <div className="space-y-4 w-full max-w-[280px]">
                                        {/* User Message */}
                                        <div className="flex justify-end">
                                            <div className="bg-white/10 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-gray-200 backdrop-blur-sm shadow-lg">
                                                O que tenho pra hoje?
                                            </div>
                                        </div>
                                        {/* Bot Response */}
                                        <div className="flex justify-start transform group-hover:scale-105 transition-transform duration-300">
                                            <div className="bg-gradient-to-br from-[#2bd4bd]/15 to-[#2bd4bd]/5 border border-[#2bd4bd]/20 rounded-2xl rounded-tl-sm p-4 max-w-[240px] shadow-xl backdrop-blur-sm">
                                                <ul className="space-y-3">
                                                    <li className="flex items-start gap-3 text-xs text-gray-300 border-l-2 border-[#2bd4bd] pl-3 py-1 bg-[#2bd4bd]/5 rounded-r">
                                                        <span className="font-mono text-[#2bd4bd] font-semibold">14:00</span>
                                                        <span>Revisão Trimestral</span>
                                                    </li>
                                                    <li className="flex items-start gap-3 text-xs text-gray-300 border-l-2 border-gray-600 pl-3 py-1">
                                                        <span className="font-mono text-gray-500 font-semibold">16:30</span>
                                                        <span>Call Investidores</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="size-12 rounded-2xl bg-gradient-to-br from-[#2bd4bd]/20 to-[#2bd4bd]/5 border border-[#2bd4bd]/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#2bd4bd]/40 transition-colors">
                                            <Calendar size={24} className="text-[#2bd4bd]" strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-[#2bd4bd] transition-colors">
                                                Consulte sua Agenda
                                            </h3>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                Pergunte ao bot sobre seus horários livres ou compromissos do dia.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Card 4 - Notifications */}
                    <ScrollReveal delay={0.4} variant="fadeInUp" className="md:col-span-6 lg:col-span-7 row-span-1">
                        <div className="group h-full bg-gradient-to-br from-[#0a192f]/90 to-[#0d1f3a]/50 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl hover:border-[#f97316]/40 hover:shadow-2xl hover:shadow-[#f97316]/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/0 via-[#f97316]/0 to-[#f97316]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="relative z-10 h-full flex flex-col">
                                {/* Visual Preview */}
                                <div className="flex-1 flex items-center justify-center mb-8">
                                    <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 shadow-2xl w-full max-w-[280px]">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="size-6 rounded-lg bg-black/80 flex items-center justify-center shadow-lg">
                                                        <Calendar size={14} className="text-white" strokeWidth={2.5} />
                                                    </div>
                                                    <span className="text-[9px] font-bold text-white/60 uppercase tracking-wider">Calendar</span>
                                                </div>
                                                <span className="text-[9px] text-white/50 font-medium">Agora</span>
                                            </div>
                                            <h4 className="text-base font-bold text-white mb-1.5">Reunião em 10 min</h4>
                                            <p className="text-xs text-white/70 leading-relaxed">
                                                Prepare-se para o Daily Standup.
                                            </p>
                                        </div>
                                        {/* Notification Bell Icon */}
                                        <div className="absolute -top-3 -right-3 size-10 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/50 animate-bounce">
                                            <Bell size={20} className="text-white" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="size-12 rounded-2xl bg-gradient-to-br from-[#f97316]/20 to-[#f97316]/5 border border-[#f97316]/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#f97316]/40 transition-colors">
                                            <Bell size={24} className="text-[#f97316]" strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2 group-hover:text-[#2bd4bd] transition-colors">
                                                Avisos Antecipados
                                            </h3>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                Receba notificações inteligentes no WhatsApp antes de reuniões.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                </div>
            </div>

            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-gradient {
                    animation: gradient 3s ease infinite;
                }

                .waveform-bar {
                    animation: wave 0.8s ease-in-out infinite;
                }

                @keyframes wave {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.5); }
                }
            `}</style>
        </div>
    );
};

export default LandingPageShowcase;
