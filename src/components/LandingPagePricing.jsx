import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { Check, Sparkles, ArrowRight, ChevronDown, Shield, Zap, Crown } from 'lucide-react';

const LandingPagePricing = () => {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <div id="pricing" className="relative bg-gradient-to-b from-[#0a192f] via-[#0d1f38] to-[#0a192f] text-[#ccd6f6] font-body overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-[#13eca4]/15 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[50%] left-[40%] w-[400px] h-[400px] bg-cyan-400/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            {/* Pricing Section */}
            <section className="w-full max-w-7xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center relative z-10">

                {/* Header */}
                <ScrollReveal variant="fadeInUp" className="text-center mb-16">
                    <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                        Investimento{' '}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-[#13eca4] via-[#0fb880] to-[#13eca4] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                                Transparente
                            </span>
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#13eca4]/40" viewBox="0 0 200 12" preserveAspectRatio="none">
                                <path d="M0 6 Q 100 12 200 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-[#8892b0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Escolha o plano ideal para organizar suas finanças pessoais sem complicações.
                    </p>
                </ScrollReveal>

                {/* Toggle Switch - Enhanced */}
                <ScrollReveal variant="fadeInUp" delay={0.1} className="mb-16">
                    <div className="relative inline-flex items-center gap-4">
                        <div className="bg-gradient-to-br from-[#112240]/80 to-[#0d1a2d]/60 backdrop-blur-xl border border-white/10 p-1.5 rounded-full flex relative shadow-2xl">
                            <button
                                className="relative px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 z-10"
                                onClick={() => setIsAnnual(false)}
                                style={{
                                    color: !isAnnual ? '#0a192f' : '#8892b0',
                                    backgroundColor: !isAnnual ? '#13eca4' : 'transparent',
                                    boxShadow: !isAnnual ? '0 8px 20px rgba(19, 236, 164, 0.4)' : 'none'
                                }}
                            >
                                Mensal
                            </button>
                            <button
                                className="relative px-8 py-3 rounded-full text-sm font-bold transition-all duration-300"
                                onClick={() => setIsAnnual(true)}
                                style={{
                                    color: isAnnual ? '#0a192f' : '#8892b0',
                                    backgroundColor: isAnnual ? '#13eca4' : 'transparent',
                                    boxShadow: isAnnual ? '0 8px 20px rgba(19, 236, 164, 0.4)' : 'none'
                                }}
                            >
                                Anual
                            </button>
                        </div>

                        {/* 20% OFF Badge */}
                        <div className="absolute -top-4 -right-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-black text-xs font-black px-3 py-1.5 rounded-full shadow-xl transform rotate-12 animate-bounce-gentle border-2 border-yellow-300">
                            20% OFF
                        </div>
                    </div>
                </ScrollReveal>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">

                    {/* Starter Plan */}
                    <ScrollReveal variant="fadeInUp" delay={0.2}>
                        <div className="group relative flex flex-col h-full rounded-3xl border border-white/10 bg-gradient-to-br from-[#112240]/60 to-[#0d1a2d]/40 backdrop-blur-xl p-10 hover:border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#13eca4]/0 via-[#13eca4]/0 to-[#13eca4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="size-10 rounded-xl bg-gradient-to-br from-slate-600/30 to-slate-700/20 border border-slate-500/30 flex items-center justify-center">
                                            <Sparkles size={20} className="text-slate-400" strokeWidth={2} />
                                        </div>
                                        <h3 className="font-display text-2xl font-bold text-white">Starter</h3>
                                    </div>
                                    <p className="text-[#8892b0] text-sm mb-8">Para quem está começando a organizar.</p>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-display text-6xl font-bold text-white">R$ 0</span>
                                        <span className="text-[#8892b0] text-lg">/mês</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="flex-grow flex flex-col gap-4 mb-10">
                                    {[
                                        '5 transcrições de áudio/mês',
                                        'Exportação básica (CSV)',
                                        'Suporte por e-mail'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm text-[#ccd6f6]">
                                            <div className="size-5 rounded-full bg-[#13eca4]/10 border border-[#13eca4]/30 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check size={14} className="text-[#13eca4]" strokeWidth={3} />
                                            </div>
                                            <span className="leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                                    className="w-full py-4 rounded-xl border-2 border-white/20 text-white font-display font-bold hover:bg-white/5 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-base"
                                >
                                    Começar Grátis
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Pro Plan - Featured */}
                    <ScrollReveal variant="fadeInUp" delay={0.3}>
                        <div className="group relative flex flex-col h-full rounded-3xl border-2 border-[#13eca4]/50 bg-gradient-to-br from-[#112240]/90 to-[#0f2e2a]/70 backdrop-blur-2xl p-10 shadow-[0_0_40px_rgba(19,236,164,0.2)] transform md:-translate-y-4 hover:-translate-y-6 transition-all duration-500 hover:shadow-[0_0_60px_rgba(19,236,164,0.4)]">

                            {/* Recommended Badge */}
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#13eca4] to-[#0fb880] text-[#0a192f] text-xs font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2 border-2 border-[#13eca4]/30">
                                <Crown size={14} strokeWidth={3} />
                                Recomendado
                            </div>

                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#13eca4]/10 via-transparent to-transparent rounded-3xl pointer-events-none"></div>

                            {/* Animated particles */}
                            <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-[#13eca4]/60 animate-ping"></div>
                            <div className="absolute bottom-20 left-10 w-3 h-3 rounded-full bg-cyan-400/40 animate-pulse"></div>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="mb-8 pt-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="size-10 rounded-xl bg-gradient-to-br from-[#13eca4]/30 to-[#0fb880]/20 border border-[#13eca4]/40 flex items-center justify-center shadow-lg shadow-[#13eca4]/20">
                                            <Zap size={20} className="text-[#13eca4]" strokeWidth={2.5} fill="#13eca4" />
                                        </div>
                                        <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                                            Pro
                                            <div className="size-6 rounded-full bg-[#13eca4]/20 border border-[#13eca4]/40 flex items-center justify-center">
                                                <Check size={14} className="text-[#13eca4]" strokeWidth={3} />
                                            </div>
                                        </h3>
                                    </div>
                                    <p className="text-[#8892b0] text-sm mb-8">Controle total e inteligência avançada.</p>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className="font-display text-6xl font-bold bg-gradient-to-r from-white to-[#ccd6f6] bg-clip-text text-transparent">
                                            R$ {isAnnual ? '29,90' : '39,90'}
                                        </span>
                                        <span className="text-[#8892b0] text-lg">/mês</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 bg-[#13eca4]/10 border border-[#13eca4]/30 px-3 py-1.5 rounded-lg">
                                        <Sparkles size={12} className="text-[#13eca4]" />
                                        <p className="text-xs text-[#13eca4] font-bold">
                                            Cobrado R$ {isAnnual ? '358,80' : '478,80'} anualmente
                                        </p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="flex-grow flex flex-col gap-4 mb-10">
                                    {[
                                        'Mensagens e Áudios Ilimitados',
                                        'Dashboard Web Completo',
                                        'Categorização automática com IA',
                                        'Prioridade no suporte'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-white">
                                            <div className="size-5 rounded-full bg-[#13eca4] border-2 border-[#13eca4]/30 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-[#13eca4]/30">
                                                <Check size={14} className="text-[#0a192f]" strokeWidth={3} />
                                            </div>
                                            <span className="leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#13eca4] to-[#0fb880] text-[#0a192f] font-display font-black hover:from-[#0fb880] hover:to-[#0da872] transition-all duration-300 transform hover:-translate-y-1 shadow-[0_8px_30px_rgba(19,236,164,0.4)] hover:shadow-[0_12px_40px_rgba(19,236,164,0.6)] text-base flex items-center justify-center gap-2"
                                >
                                    Começar Agora
                                    <ArrowRight size={18} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>

                </div>
            </section>

            {/* FAQ Section - Enhanced */}
            <section className="w-full max-w-4xl mx-auto px-6 pb-24 relative z-10">
                <ScrollReveal variant="fadeInUp" className="text-center mb-14">
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">Perguntas Frequentes</h2>
                    <p className="text-[#8892b0] text-base">Tudo o que você precisa saber</p>
                </ScrollReveal>

                <div className="flex flex-col gap-5">
                    {[
                        {
                            q: 'Meus dados e áudios estão seguros?',
                            a: 'Sim, utilizamos criptografia de ponta a ponta. Seus áudios são processados apenas para extração de dados e não são armazenados permanentemente.',
                            icon: Shield
                        },
                        {
                            q: 'Qual o limite de tamanho dos áudios?',
                            a: 'No plano Pro, suportamos áudios de até 15 minutos de duração contínua.'
                        },
                        {
                            q: 'A IA entende gírias e sotaques?',
                            a: 'Nossa IA é treinada especificamente com dados em português brasileiro, reconhecendo a maioria dos sotaques regionais e gírias comuns.'
                        },
                        {
                            q: 'Como funciona o cancelamento?',
                            a: 'O cancelamento é simples e pode ser feito a qualquer momento diretamente no seu painel de controle.'
                        }
                    ].map((faq, i) => (
                        <ScrollReveal key={i} variant="fadeInUp" delay={0.05 * i}>
                            <details className="group bg-gradient-to-br from-[#112240]/80 to-[#0d1a2d]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 open:border-[#13eca4]/30 open:bg-gradient-to-br open:from-[#112240] open:to-[#0f2e2a]/80 hover:shadow-xl">
                                <summary className="flex cursor-pointer items-center justify-between p-6 text-white hover:text-[#13eca4] transition-colors">
                                    <div className="flex items-center gap-4">
                                        {faq.icon && (
                                            <div className="size-10 rounded-xl bg-[#13eca4]/10 border border-[#13eca4]/20 flex items-center justify-center shrink-0">
                                                <faq.icon size={20} className="text-[#13eca4]" strokeWidth={2} />
                                            </div>
                                        )}
                                        <h3 className="text-base md:text-lg font-bold pr-4">{faq.q}</h3>
                                    </div>
                                    <ChevronDown size={20} className="transition-transform duration-300 group-open:rotate-180 text-[#13eca4] shrink-0" strokeWidth={2.5} />
                                </summary>
                                <div className="px-6 pb-6 text-[#8892b0] text-sm md:text-base leading-relaxed" style={{ paddingLeft: faq.icon ? '88px' : '24px' }}>
                                    {faq.a}
                                </div>
                            </details>
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            {/* CTA Banner - Enhanced */}
            <section className="w-full px-4 pb-24 relative z-10">
                <ScrollReveal variant="scaleIn">
                    <div className="w-full max-w-6xl mx-auto rounded-3xl overflow-hidden relative border-2 border-[#13eca4]/30 shadow-[0_0_60px_rgba(19,236,164,0.2)]">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a192f] via-[#0f2e2a] to-[#112240] z-0"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:30px_30px]"></div>

                        {/* Glowing orbs */}
                        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-[#13eca4]/20 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-cyan-400/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-10 py-16 md:px-16 gap-10 text-center md:text-left">
                            <div className="flex flex-col gap-5 max-w-2xl">
                                <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
                                    Pare de perder tempo com planilhas{' '}
                                    <span className="text-[#13eca4]">hoje.</span>
                                </h2>
                                <p className="text-[#8892b0] text-base md:text-lg leading-relaxed">
                                    Junte-se a milhares de brasileiros que organizam suas finanças apenas falando.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                                    className="group px-10 py-5 bg-gradient-to-r from-[#13eca4] to-[#0fb880] hover:from-[#0fb880] hover:to-[#0da872] text-[#0a192f] font-display font-black rounded-2xl shadow-[0_0_40px_rgba(19,236,164,0.5)] transition-all transform hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(19,236,164,0.7)] text-lg flex items-center gap-3"
                                >
                                    Começar Teste Grátis
                                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-gradient {
                    animation: gradient 3s ease infinite;
                }

                @keyframes bounce-gentle {
                    0%, 100% { transform: translateY(0) rotate(12deg); }
                    50% { transform: translateY(-5px) rotate(12deg); }
                }

                .animate-bounce-gentle {
                    animation: bounce-gentle 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default LandingPagePricing;
