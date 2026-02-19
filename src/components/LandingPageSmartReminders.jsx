import React from 'react';
import ScrollReveal from './ScrollReveal';
import { Bell, List, Repeat, User, Check } from 'lucide-react';

const LandingPageSmartReminders = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-[#0B1120] via-[#0f1629] to-[#0B1120] overflow-hidden flex items-center py-24">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[15%] left-[-5%] w-[600px] h-[600px] bg-[#10b19c]/15 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[700px] h-[700px] bg-[#1e3a8a]/20 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute top-[50%] left-[30%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* Left: Enhanced Visual Mockup */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <ScrollReveal variant="fadeInLeft">
                            <div className="relative bg-gradient-to-br from-[#111827]/80 to-[#0f1629]/60 border border-white/10 rounded-3xl p-10 lg:p-14 backdrop-blur-2xl shadow-2xl min-h-[600px] flex flex-col items-center justify-center hover:border-white/20 transition-all duration-500">
                                
                                {/* Inner glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#10b19c]/5 via-transparent to-transparent rounded-3xl pointer-events-none"></div>

                                {/* Voice Note Input - Enhanced */}
                                <div className="relative w-full max-w-md mb-20 animate-float z-10">
                                    <div className="bg-gradient-to-br from-[#1f2937] to-[#1a2332] border border-slate-600/50 rounded-2xl rounded-tr-sm p-5 shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="size-11 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shrink-0 shadow-lg">
                                                <User size={20} className="text-slate-300" strokeWidth={2} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-9 bg-[#2d3b4e] rounded-xl flex items-center px-4 gap-1.5 overflow-hidden">
                                                    {[...Array(10)].map((_, i) => (
                                                        <div 
                                                            key={i} 
                                                            className="waveform-bar w-1 bg-gradient-to-t from-[#10b19c] to-[#14d4bb] rounded-full"
                                                            style={{ 
                                                                height: `${12 + Math.sin(i * 0.7) * 10}px`,
                                                                animationDelay: `${i * 0.08}s`
                                                            }}
                                                        ></div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-400 mt-2 font-medium">Voice Note • 0:04</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* AI Processing Bubble */}
                                    <div className="absolute -bottom-8 right-8 bg-gradient-to-r from-[#10b19c] to-[#0d9785] text-[#0B1120] text-sm font-semibold px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-xl transform rotate-1 hover:rotate-0 transition-transform animate-bounce-gentle">
                                        "Lembra de pagar a escola..."
                                    </div>

                                    {/* Connection Line */}
                                    <div className="absolute left-1/2 -bottom-16 w-0.5 h-16 bg-gradient-to-b from-[#10b19c]/60 to-transparent"></div>
                                </div>

                                {/* Central AI Processing Node */}
                                <div className="relative mb-20">
                                    <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_25px_5px_rgba(16,177,156,0.6)] animate-pulse-glow z-20"></div>
                                    {/* Orbital rings */}
                                    <div className="absolute inset-0 -m-4 rounded-full border border-[#10b19c]/30 animate-ping"></div>
                                    <div className="absolute inset-0 -m-6 rounded-full border border-[#10b19c]/20"></div>
                                </div>

                                {/* Output Widgets Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-xl relative z-10">
                                    
                                    {/* Reminder Widget - Enhanced */}
                                    <div className="relative group">
                                        {/* Connection line from center */}
                                        <div className="absolute bottom-full right-[30%] w-0.5 h-20 bg-gradient-to-t from-[#f59e0b]/60 to-transparent hidden lg:block"></div>
                                        
                                        <div className="bg-gradient-to-br from-[#1a1a1a]/95 to-[#0f0f0f]/80 backdrop-blur-xl border-l-4 border-[#f59e0b] rounded-r-2xl p-5 shadow-2xl hover:shadow-[#f59e0b]/20 transform hover:-translate-y-2 transition-all duration-300">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="size-8 rounded-lg bg-gradient-to-br from-[#f59e0b]/30 to-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center">
                                                        <Bell size={16} className="text-[#f59e0b]" strokeWidth={2.5} />
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Lembrete</span>
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-medium">Agora</span>
                                            </div>
                                            <h4 className="text-white font-bold text-base mb-1.5">Pagar Escola</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#f59e0b] text-xs font-semibold bg-[#f59e0b]/10 px-2 py-1 rounded-md border border-[#f59e0b]/20">
                                                    Vence Hoje
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* List Widget - Enhanced */}
                                    <div className="relative group">
                                        {/* Connection line from center */}
                                        <div className="absolute bottom-full left-[30%] w-0.5 h-20 bg-gradient-to-t from-[#10b19c]/60 to-transparent hidden lg:block"></div>
                                        
                                        <div className="bg-gradient-to-br from-[#1a1a1a]/95 to-[#0f0f0f]/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5 shadow-2xl hover:shadow-[#10b19c]/20 transform hover:-translate-y-2 transition-all duration-300 hover:border-[#10b19c]/30">
                                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                                                <h4 className="text-white font-bold text-base">Lista de Mercado</h4>
                                                <div className="size-7 rounded-lg bg-gradient-to-br from-[#10b19c]/20 to-[#10b19c]/5 border border-[#10b19c]/20 flex items-center justify-center">
                                                    <List size={14} className="text-[#10b19c]" strokeWidth={2.5} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="flex items-center gap-3 cursor-pointer group/item">
                                                    <div className="size-5 rounded-md border-2 border-[#10b19c] bg-[#10b19c] flex items-center justify-center text-[#0B1120] shrink-0 shadow-lg shadow-[#10b19c]/30">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-slate-500 text-sm line-through decoration-slate-600 group-hover/item:text-slate-400 transition-colors">
                                                        Ração do cachorro
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-3 cursor-pointer group/item opacity-60 hover:opacity-100 transition-opacity">
                                                    <div className="size-5 rounded-md border-2 border-slate-600 bg-transparent shrink-0 group-hover/item:border-[#10b19c]/50 transition-colors"></div>
                                                    <span className="text-slate-400 text-sm group-hover/item:text-slate-300 transition-colors">
                                                        Leite
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Decorative particles */}
                                <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-[#10b19c]/40 animate-ping"></div>
                                <div className="absolute bottom-10 left-10 w-3 h-3 rounded-full bg-cyan-400/30 animate-pulse"></div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right: Copy Section - Enhanced */}
                    <div className="lg:col-span-5 flex flex-col gap-10 order-1 lg:order-2">
                        {/* Badge */}
                        <ScrollReveal variant="fadeInRight">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-[#10b19c]/15 to-transparent border border-[#10b19c]/30 w-fit backdrop-blur-xl shadow-lg shadow-[#10b19c]/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b19c] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b19c]"></span>
                                </span>
                                <span className="text-xs font-bold text-[#10b19c] uppercase tracking-wider">Second Brain AI</span>
                            </div>
                        </ScrollReveal>

                        {/* Title */}
                        <ScrollReveal variant="fadeInRight" delay={0.1}>
                            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight font-display">
                                Libere espaço na{' '}
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-r from-white via-slate-300 to-slate-400 bg-clip-text text-transparent">
                                        sua mente.
                                    </span>
                                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#10b19c]/40" viewBox="0 0 200 12" preserveAspectRatio="none">
                                        <path d="M0 6 Q 100 12 200 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                    </svg>
                                </span>
                            </h2>
                        </ScrollReveal>

                        {/* Subtitle */}
                        <ScrollReveal variant="fadeInRight" delay={0.2}>
                            <p className="text-lg lg:text-xl text-slate-400 leading-relaxed font-light">
                                Não confie na sua memória para coisas pequenas. Deixe a IA transformar seus pensamentos soltos em ações organizadas.
                            </p>
                        </ScrollReveal>

                        {/* Features List */}
                        <div className="space-y-6 pt-4">
                            {[
                                { 
                                    icon: Bell, 
                                    color: '#f59e0b',
                                    title: 'Cobrança Amigável', 
                                    desc: 'Receba lembretes gentis e inteligentes no momento certo, sem o estresse de notificações constantes.' 
                                },
                                { 
                                    icon: List, 
                                    color: '#10b19c',
                                    title: 'Listas Dinâmicas', 
                                    desc: 'Sua IA identifica itens em áudios e textos, organizando-os automaticamente em listas de tarefas ou compras.' 
                                },
                                { 
                                    icon: Repeat, 
                                    color: '#6366f1',
                                    title: 'Lembretes Recorrentes', 
                                    desc: 'Configure pagamentos mensais ou hábitos diários com apenas um comando de voz simples.' 
                                }
                            ].map((item, i) => (
                                <ScrollReveal key={i} variant="fadeInUp" delay={0.3 + (i * 0.1)}>
                                    <div className="group flex gap-5 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
                                        <div 
                                            className="shrink-0 size-14 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-lg"
                                            style={{
                                                backgroundColor: `${item.color}10`,
                                                borderColor: `${item.color}30`,
                                            }}
                                        >
                                            <item.icon 
                                                size={26} 
                                                strokeWidth={2} 
                                                style={{ color: item.color }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white text-xl font-bold mb-2 group-hover:text-[#10b19c] transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes bounce-gentle {
                    0%, 100% { transform: translateY(0) rotate(1deg); }
                    50% { transform: translateY(-5px) rotate(1deg); }
                }

                .animate-bounce-gentle {
                    animation: bounce-gentle 2s ease-in-out infinite;
                }

                @keyframes pulse-glow {
                    0%, 100% { 
                        box-shadow: 0 0 25px 5px rgba(16, 177, 156, 0.6);
                    }
                    50% { 
                        box-shadow: 0 0 35px 8px rgba(16, 177, 156, 0.8);
                    }
                }

                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }

                .waveform-bar {
                    animation: wave 0.8s ease-in-out infinite;
                }

                @keyframes wave {
                    0%, 100% { transform: scaleY(0.8); }
                    50% { transform: scaleY(1.3); }
                }
            `}</style>
        </div>
    );
};

export default LandingPageSmartReminders;
