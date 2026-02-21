import React from 'react';

const LandingPageFeatures = () => {
    return (
        <div id="features" className="relative w-full min-h-screen flex items-center justify-center py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#0f172a] to-[#022c22] overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#19e664]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#19e664]/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10 items-center">
                {/* Left Column: Copy */}
                <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8 order-2 lg:order-1">
                    <div className="space-y-6 text-center lg:text-left">
                        <h2 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.1] tracking-tight font-display">
                            Você <span className="relative inline-block text-white">
                                manda
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#19e664]" preserveAspectRatio="none" viewBox="0 0 100 10">
                                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4"></path>
                                </svg>
                            </span> no seu dinheiro. <br className="hidden md:block" />Não o contrário.
                        </h2>
                        <div className="space-y-4 text-lg text-slate-400 font-light leading-relaxed font-display">
                            <p>
                                A gestão manual é o caos silencioso que drena sua riqueza mês após mês. Você perde horas tentando entender para onde o dinheiro foi, enquanto as oportunidades de investimento passam.
                            </p>
                            <p>
                                O Controle-C elimina a adivinhação. Nossa IA transforma recibos físicos em inteligência financeira instantânea, permitindo que você assuma o comando de cada centavo sem levantar um dedo.
                            </p>
                        </div>
                    </div>

                    {/* Feature Bullets */}
                    <div className="space-y-6 pt-4 max-w-xl mx-auto lg:mx-0">
                        {[
                            { icon: 'document_scanner', title: 'Leitura de Notas Fiscais', desc: 'Digitalize instantaneamente qualquer comprovante via câmera com precisão de 99%.' },
                            { icon: 'pie_chart', title: 'Categorização Inteligente', desc: 'A IA identifica o estabelecimento e classifica seus gastos automaticamente em segundos.' },
                            { icon: 'notifications_active', title: 'Alertas de Orçamento', desc: 'Receba notificações proativas no WhatsApp antes de estourar seus limites mensais.' }
                        ].map((feature, idx) => (
                            <div key={idx} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/5">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#19e664]/10 flex items-center justify-center text-[#19e664] group-hover:bg-[#19e664] group-hover:text-[#022c22] transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">{feature.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-white text-lg font-bold mb-1 font-display">{feature.title}</h3>
                                    <p className="text-sm text-slate-400 font-display">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 text-center lg:text-left">
                        <button className="group inline-flex items-center gap-3 text-[#19e664] font-bold text-lg hover:text-white transition-colors relative">
                            Ver automação em ação
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            <div className="h-[2px] w-0 bg-[#19e664] absolute bottom-0 left-0 transition-all duration-300 group-hover:w-full"></div>
                        </button>
                    </div>
                </div>

                {/* Right Column: Visual */}
                <div className="lg:col-span-12 xl:col-span-7 h-full min-h-[500px] relative order-1 lg:order-2 flex items-center justify-center">
                    <div className="relative w-full max-w-3xl h-[500px] glass-panel rounded-2xl overflow-hidden p-4 md:p-8 flex items-center justify-center bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-8 relative z-10">

                            {/* Receipt Visual */}
                            <div className="relative h-full flex items-center justify-center overflow-hidden">
                                <div className="relative w-40 md:w-48 h-64 md:h-72 bg-white rotate-[-6deg] shadow-2xl overflow-hidden rounded-sm mx-auto">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/crumpled-paper.png')] opacity-20 z-10 mix-blend-multiply pointer-events-none"></div>
                                    <div className="p-4 flex flex-col items-center text-gray-800 text-[10px] font-mono leading-tight h-full">
                                        <div className="font-bold text-sm mb-2">STARBUCKS COFFEE</div>
                                        <div className="mb-4 text-center">Rua Fictícia, 123<br />São Paulo, SP</div>
                                        <div className="w-full border-b border-dashed border-gray-400 mb-2"></div>
                                        <div className="w-full flex justify-between"><span>1 Cappuccino</span><span>R$ 14,00</span></div>
                                        <div className="w-full flex justify-between mb-2"><span>1 Cookie</span><span>R$ 4,50</span></div>
                                        <div className="w-full border-b border-dashed border-gray-400 mb-2"></div>
                                        <div className="w-full flex justify-between font-bold text-xs"><span>TOTAL</span><span>R$ 18,50</span></div>
                                        <div className="mt-auto text-center opacity-60">Obrigado pela preferência!</div>
                                        <div className="mt-2 h-8 w-full bg-gray-800" style={{ background: 'repeating-linear-gradient(90deg, #000 0, #000 2px, #fff 2px, #fff 4px)' }}></div>
                                    </div>
                                    <div className="absolute w-full h-1 bg-[#19e664] blur-[2px] z-20 animate-scan left-0"></div>
                                </div>
                            </div>

                            {/* UI Card Result */}
                            <div className="relative h-full flex items-center justify-center">
                                <div className="animate-float relative w-full max-w-[260px] bg-[#1a3223] border border-[#346546] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 backdrop-blur-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center border border-green-800 overflow-hidden text-white font-bold">
                                            <span>S</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white text-sm font-bold">Starbucks Coffee</h4>
                                            <p className="text-xs text-slate-400">Há 2 minutos</p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <span className="text-xs text-[#93c8a6] uppercase tracking-wider font-semibold">Valor Total</span>
                                        <div className="text-2xl text-white font-bold">R$ 18,50</div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="px-3 py-1 bg-[#19e664]/20 text-[#19e664] rounded-full text-xs font-bold border border-[#19e664]/30 flex items-center gap-1">
                                            ☕ Alimentação
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-slate-400">Orçamento Diário</span>
                                            <span className="text-white font-bold">45%</span>
                                        </div>
                                        <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-[#19e664] h-full rounded-full w-[45%] shadow-[0_0_10px_rgba(25,230,100,0.5)]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Grid BG */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPageFeatures;
