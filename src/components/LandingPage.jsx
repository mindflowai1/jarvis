import React, { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticleWave3D from './ParticleWave3D';

// ── Componentes Utilitários ──────────────────────────────────────────

const Typewriter = ({ words, typingSpeed = 70, deletingSpeed = 40, pauseDelay = 2500 }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    // Realistic blinking cursor
    useEffect(() => {
        const interval = setInterval(() => setCursorVisible((v) => !v), 530);
        return () => clearInterval(interval);
    }, []);

    // Force cursor visible while actively typing or deleting
    useEffect(() => {
        setCursorVisible(true);
    }, [subIndex]);

    useEffect(() => {
        if (index >= words.length) {
            setIndex(0);
            return;
        }

        const currentWord = words[index];

        if (subIndex === currentWord.length && !reverse) {
            // Once the word is fully typed, wait before reversing
            const timeout = setTimeout(() => setReverse(true), pauseDelay);
            return () => clearTimeout(timeout);
        }

        if (subIndex === 0 && reverse) {
            // Once fully deleted, wait a tiny bit and move to next word
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        // Realistic typing dynamics:
        // - Occasional micro-pauses for human effect (10% chance to pause)
        // - Randomized delays for each keystroke
        const isPause = !reverse && Math.random() < 0.1;
        const baseDelay = reverse ? deletingSpeed : typingSpeed;
        const randomVariation = (Math.random() * baseDelay) - (baseDelay / 2);
        let finalDelay = Math.max(20, baseDelay + randomVariation);

        if (isPause) finalDelay += 150; // Add human hesitation

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, finalDelay);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words, typingSpeed, deletingSpeed, pauseDelay]);

    return (
        <span className="inline-flex items-center min-h-[1.2em] relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0cf2cd] to-[#25D366]">
                {words[index].substring(0, subIndex)}
            </span>
            <span
                className={`inline-block text-[#0cf2cd] font-light ml-[2px] -translate-y-[2px] transition-opacity duration-75 ${cursorVisible ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                |
            </span>
        </span>
    );
};

/* ═══════════════════════════════════════════════════════════════════
   CONTROLE-C — Landing Page de Conversão (SaaS)
   100 % Tailwind CSS v4 · React · Three.js
   ═══════════════════════════════════════════════════════════════════ */

// ── Dados ────────────────────────────────────────────────────────────

const FEATURES_BENTO = [
    {
        title: 'Controle Financeiro Inteligente',
        desc: 'Registre gastos por voz ou texto. O Controle-C categoriza automaticamente e mostra gráficos claros de para onde seu dinheiro vai.',
        icon: '💰',
        span: 'md:col-span-2',
        visual: 'chart',
    },
    {
        title: 'Google Agenda Integrada',
        desc: 'Seus compromissos sincronizados em tempo real. Diga "agende reunião amanhã às 15h" e pronto.',
        icon: '📅',
        span: '',
        visual: 'calendar',
    },
    {
        title: 'Kanban de Tarefas',
        desc: 'Organize sua vida em cards com status: A Fazer, Em Andamento e Concluído. Tudo por voz.',
        icon: '📋',
        span: '',
        visual: 'kanban',
    },
    {
        title: 'Áudio Inteligente',
        desc: 'Fale naturalmente. A IA transcreve, entende a intenção e executa a ação certa automaticamente.',
        icon: '🎙️',
        span: '',
        visual: 'audio',
    },
    {
        title: 'Tudo no WhatsApp',
        desc: 'Sem apps novos. Sem cadastros complicados. Envie uma mensagem e o Controle-C resolve. Texto, imagem de recibos ou áudio.',
        icon: '💬',
        span: 'md:row-span-2',
        visual: 'whatsapp',
    },
    {
        title: 'Lembretes de Contas Recorrentes',
        desc: 'Nunca mais esqueça um vencimento. O Controle-C avisa sobre aluguel, internet, streaming e todas as suas contas fixas antes do prazo.',
        icon: '🔔',
        span: 'md:col-span-2',
        visual: 'reminders',
    },
];

const STEPS = [
    { num: '01', icon: '🎙️', title: 'Envie um áudio', desc: 'Fale naturalmente: "Gastei 50 reais no almoço hoje"' },
    { num: '02', icon: '🤖', title: 'A IA processa', desc: 'O Controle-C entende, categoriza e registra automaticamente' },
    { num: '03', icon: '✅', title: 'Pronto!', desc: 'Gasto registrado, lembrete agendado e notificação enviada via WhatsApp' },
];

const PRICING = [
    {
        name: 'Mensal',
        price: '80',
        period: '/mês',
        popular: false,
        features: [
            'Registro ilimitado de gastos',
            'Categorização automática por IA',
            'Integração Google Agenda',
            'Kanban de tarefas',
            'Lembretes via WhatsApp',
            'Suporte por WhatsApp',
        ],
    },
    {
        name: 'Anual',
        price: '800',
        period: '/ano',
        popular: true,
        badge: 'Economize 17%',
        features: [
            'Tudo do plano Mensal',
            'Relatórios financeiros avançados',
            'Prioridade no suporte',
            'Exportação de dados (CSV/PDF)',
            'Múltiplas contas financeiras',
            'Acesso antecipado a novos recursos',
        ],
    },
];

const TESTIMONIALS = [
    {
        name: 'Marina Silva',
        role: 'Empreendedora',
        text: 'Eu nunca consegui me organizar financeiramente até conhecer o Controle-C. Agora é só mandar um áudio e tudo fica registrado!',
        rating: 5,
    },
    {
        name: 'Carlos Eduardo',
        role: 'Desenvolvedor',
        text: 'A integração com o Google Calendar é sensacional. Minha agenda nunca esteve tão organizada e eu nem preciso abrir um app.',
        rating: 5,
    },
    {
        name: 'Ana Beatriz',
        role: 'Designer Freelancer',
        text: 'O kanban por WhatsApp mudou minha vida. Organizo meus projetos, prazos e finanças em um lugar só. Recomendo demais!',
        rating: 5,
    },
];

const FAQS = [
    { q: 'O Controle-C funciona em qual WhatsApp?', a: 'Funciona no WhatsApp comum e no WhatsApp Business, tanto no celular quanto no WhatsApp Web. Basta adicionar nosso número e começar a conversar.' },
    { q: 'Meus dados financeiros estão seguros?', a: 'Sim! Utilizamos criptografia de ponta a ponta e nossos servidores seguem todas as normas da LGPD. Seus dados nunca são compartilhados com terceiros.' },
    { q: 'Posso cancelar a qualquer momento?', a: 'Claro! Não existe fidelidade. Você pode cancelar sua assinatura a qualquer momento direto pelo WhatsApp, sem burocracia.' },
    { q: 'Como funciona o reconhecimento de áudio?', a: 'Nossa IA utiliza modelos avançados de processamento de linguagem natural. Basta falar normalmente e ela entende a intenção, valor, categoria e data automaticamente.' },
    { q: 'O Google Calendar sincroniza automaticamente?', a: 'Sim! Após conectar sua conta Google (processo de 1 clique), todos os compromissos criados pelo Controle-C aparecem instantaneamente na sua agenda.' },
];

// ── Componentes Internos ─────────────────────────────────────────────

const StarRating = ({ count }) => (
    <div className="flex gap-1">
        {Array.from({ length: count }).map((_, i) => (
            <span key={i} className="text-[#0cf2cd] text-sm">★</span>
        ))}
    </div>
);

const FAQItem = ({ q, a }) => (
    <details className="group border-b border-white/5 last:border-0">
        <summary className="flex items-center justify-between cursor-pointer py-5 text-white font-medium text-base sm:text-lg list-none select-none transition-colors group-open:text-[#0cf2cd]">
            {q}
            <span className="text-slate-500 transition-transform duration-300 group-open:rotate-45 text-2xl ml-4 shrink-0">+</span>
        </summary>
        <p className="text-slate-400 text-sm sm:text-base pb-5 pr-8 leading-relaxed">{a}</p>
    </details>
);

const MiniChart = () => (
    <div className="flex items-end gap-1.5 h-16 mt-4">
        {[35, 55, 40, 70, 50, 80, 92].map((h, i) => (
            <div
                key={i}
                className="flex-1 rounded-t-sm transition-all duration-500"
                style={{
                    height: `${h}%`,
                    background: i === 6
                        ? 'linear-gradient(to top, #0cf2cd, #25D366)'
                        : 'rgba(12,242,205,0.15)',
                }}
            />
        ))}
    </div>
);

const MiniKanban = () => (
    <div className="grid grid-cols-3 gap-2 mt-4">
        {['A Fazer', 'Fazendo', 'Feito'].map((col, i) => (
            <div key={i} className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{col}</span>
                {[1, 2].map((_, j) => (
                    <div key={j} className={`h-5 rounded-md ${i === 2 ? 'bg-[#0cf2cd]/20 border border-[#0cf2cd]/30' : 'bg-white/5 border border-white/10'}`} />
                ))}
            </div>
        ))}
    </div>
);

const AudioWave = () => (
    <div className="flex items-center gap-[3px] h-10 mt-4">
        {[8, 16, 24, 14, 10, 20, 12, 18, 8, 14, 22, 10, 16].map((h, i) => (
            <div
                key={i}
                className="w-[3px] rounded-full bg-[#0cf2cd] animate-pulse"
                style={{ height: `${h}px`, animationDelay: `${i * 0.1}s`, animationDuration: '1.2s' }}
            />
        ))}
    </div>
);

const WhatsAppMock = () => (
    <div className="mt-4 space-y-2.5">
        {/* User msg */}
        <div className="self-end ml-auto max-w-[85%] bg-[#005c4b] rounded-lg rounded-tr-none p-2.5 text-white text-xs">
            <div className="flex items-center gap-2 text-[10px] text-slate-300 mb-1">
                <span>🎙️</span> <span>0:08</span>
            </div>
            <div className="flex items-end justify-end gap-1 text-[10px] text-slate-400">
                <span>10:42</span>
                <span className="text-[#53bdeb]">✓✓</span>
            </div>
        </div>
        {/* Bot msg */}
        <div className="max-w-[85%] bg-[#202c33] rounded-lg rounded-tl-none p-2.5 text-white text-xs">
            <p>✅ Registrei: <strong className="text-[#0cf2cd]">Almoço — R$ 45,00</strong></p>
            <p className="text-slate-400 text-[10px] mt-1">Categoria: Alimentação</p>
        </div>
    </div>
);

const BentoCard = ({ feature }) => {
    const visuals = {
        chart: <MiniChart />,
        kanban: <MiniKanban />,
        audio: <AudioWave />,
        whatsapp: <WhatsAppMock />,
        reminders: (
            <div className="mt-4 space-y-2">
                {[
                    { label: 'Netflix', date: 'Vence em 2 dias', amount: 'R$ 55,90', color: 'bg-red-500' },
                    { label: 'Aluguel', date: 'Vence em 5 dias', amount: 'R$ 1.800,00', color: 'bg-amber-500' },
                    { label: 'Internet', date: 'Vence em 8 dias', amount: 'R$ 119,90', color: 'bg-blue-500' },
                ].map((bill, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-2.5 border border-white/10">
                        <div className={`w-2 h-2 rounded-full ${bill.color}`} />
                        <div className="flex-1">
                            <span className="text-slate-300 text-xs">{bill.label}</span>
                            <span className="text-slate-500 text-[10px] ml-2">{bill.date}</span>
                        </div>
                        <span className="text-white text-xs font-semibold">{bill.amount}</span>
                    </div>
                ))}
            </div>
        ),
        calendar: (
            <div className="mt-4 bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="text-slate-300">Reunião com cliente — 15:00</span>
                </div>
                <div className="flex items-center gap-2 text-xs mt-2">
                    <span className="w-2 h-2 rounded-full bg-[#0cf2cd]"></span>
                    <span className="text-slate-300">Dentista — 17:30</span>
                </div>
            </div>
        ),
    };

    return (
        <div className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 hover:border-[#0cf2cd]/30 transition-all duration-500 ${feature.span}`}>
            {/* Glow sutil no hover */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#0cf2cd]/0 group-hover:bg-[#0cf2cd]/10 rounded-full blur-3xl transition-all duration-700 pointer-events-none" />
            <div className="relative z-10">
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="text-white font-bold text-lg mt-4 mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                {visuals[feature.visual]}
            </div>
        </div>
    );
};

// ── Componente Principal ─────────────────────────────────────────────

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="relative bg-gray-950 text-white font-sans scroll-smooth overflow-x-hidden w-full max-w-[100vw]">
            {/* ═══════════════ NAVBAR ═══════════════ */}
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-3 group">
                        <img src="/logo-controle-c.png" alt="Controle-C Logo" className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(12,242,205,0.2)] group-hover:drop-shadow-[0_0_25px_rgba(12,242,205,0.4)] transition-all" />
                        <span className="font-bold text-lg tracking-tight text-white">Controle-C</span>
                    </a>

                    {/* Nav Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
                        <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
                        <a href="#precos" className="hover:text-white transition-colors">Preços</a>
                        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    </div>

                    {/* CTA + Login (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        <a href="/login" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                            Entrar
                        </a>
                        <a href="#precos" className="inline-flex items-center gap-2 bg-[#0cf2cd] hover:bg-[#1efadb] text-gray-950 font-bold text-sm py-2.5 px-6 rounded-xl shadow-[0_0_20px_rgba(12,242,205,0.2)] hover:shadow-[0_0_30px_rgba(12,242,205,0.4)] transition-all duration-300">
                            Assinar Agora
                        </a>
                    </div>

                    {/* Hamburger (Mobile) */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        aria-label="Menu"
                    >
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/5 bg-gray-950/95 backdrop-blur-xl px-6 pb-6 pt-4 flex flex-col gap-4 animate-in slide-in-from-top">
                        <a href="#recursos" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white py-2 text-base">Recursos</a>
                        <a href="#precos" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white py-2 text-base">Preços</a>
                        <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white py-2 text-base">FAQ</a>
                        <a href="/login" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white py-2 text-base border-t border-white/5 pt-4">Entrar</a>
                        <a href="#precos" onClick={() => setMobileMenuOpen(false)} className="mt-2 text-center bg-[#0cf2cd] text-gray-950 font-bold py-3 px-6 rounded-xl">
                            Assinar Agora
                        </a>
                    </div>
                )}
            </nav>

            {/* ═══════════════ HERO ═══════════════ */}
            <section className="relative min-h-[90vh] sm:h-[calc(100vh-5rem)] pt-12 pb-6 sm:pt-16 sm:pb-8 flex flex-col w-full overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#0cf2cd]/8 rounded-full blur-[120px] pointer-events-none z-0" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#25D366]/5 rounded-full blur-[100px] pointer-events-none z-0" />

                {/* 3D Particle Wave — Full Background (flipped) */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-50 sm:opacity-60 lg:opacity-70" style={{ transform: 'scaleY(-1)' }}>
                    <Suspense fallback={
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-[#0cf2cd]/10 blur-3xl animate-pulse" />
                    }>
                        <ParticleWave3D />
                    </Suspense>
                </div>

                {/* Main Content — 2 columns on desktop */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex-1 flex flex-col justify-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">

                    {/* Left: Text Column */}
                    <motion.div
                        className="max-w-2xl w-full relative"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Subtle dark gradient behind text for legibility */}
                        <div className="absolute -inset-x-8 -inset-y-6 bg-gradient-to-r from-gray-950/80 via-gray-950/60 to-transparent rounded-3xl pointer-events-none -z-10" />

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0cf2cd]/20 bg-[#0cf2cd]/5 text-[#0cf2cd] text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-md whitespace-normal sm:whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0cf2cd] animate-pulse shrink-0" />
                            <span>Novo: Integração com Google Calendar 🚀</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.08] text-white mb-4 sm:mb-5 min-h-[4em] sm:min-h-[2.8em] break-words" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 4px 40px rgba(0,0,0,0.3)' }}>
                            A IA que organiza, <br className="hidden sm:block" /> em um áudio{' '}
                            <div className="mt-2 block">
                                <Typewriter words={['sua agenda.', 'sua vida financeira.', 'seus afazeres.', 'suas contas.']} />
                            </div>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mb-6 sm:mb-8" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}>
                            O assistente de IA que vive no seu WhatsApp. Envie um áudio para registrar gastos, agendar compromissos e organizar tarefas. Sem apps complexos.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                            <a href="#precos" className="inline-flex items-center justify-center gap-2 bg-[#0cf2cd] hover:bg-[#1efadb] text-gray-950 font-bold text-base py-3.5 px-8 rounded-xl shadow-[0_0_30px_rgba(12,242,205,0.25)] hover:shadow-[0_0_45px_rgba(12,242,205,0.45)] transition-all duration-300 w-full sm:w-auto">
                                Assinar Agora →
                            </a>
                            <a href="#como-funciona" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-base py-3.5 px-8 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto">
                                Como funciona?
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Floating Feature Cards (desktop only) */}
                    <motion.div
                        className="hidden lg:block relative"
                        style={{ perspective: '1200px' }}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        <div className="relative w-full h-[420px]">
                            {/* Card 1 — WhatsApp (front, largest) */}
                            <div
                                className="absolute top-[0px] right-[10px] w-[320px] bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] rounded-2xl p-5 shadow-2xl transition-all duration-500 hover:bg-white/[0.10] hover:border-[#0cf2cd]/20 hover:shadow-[0_8px_40px_rgba(12,242,205,0.12)] group"
                                style={{ transform: 'rotateY(-6deg) rotateX(2deg) translateZ(40px)', animation: 'heroFloat1 6s ease-in-out infinite' }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 flex items-center justify-center text-lg">💬</div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">WhatsApp</p>
                                        <p className="text-slate-500 text-[11px]">Agora mesmo</p>
                                    </div>
                                    <div className="ml-auto w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                                </div>
                                <div className="bg-[#005c4b]/40 rounded-lg rounded-tr-none p-3 mb-2">
                                    <p className="text-white/90 text-xs leading-relaxed">🎙️ "Gastei 45 reais no almoço hoje e tenho reunião amanhã às 3 da tarde"</p>
                                </div>
                                <div className="bg-white/5 rounded-lg rounded-tl-none p-3 ml-4">
                                    <p className="text-[#0cf2cd]/90 text-xs leading-relaxed">✅ Registrei R$ 45 em Alimentação e agendei reunião para amanhã 15:00.</p>
                                </div>
                            </div>

                            {/* Card 2 — Agenda */}
                            <div
                                className="absolute top-[135px] right-[50px] w-[280px] bg-white/[0.05] backdrop-blur-lg border border-white/[0.08] rounded-2xl p-4 shadow-xl transition-all duration-500 hover:bg-white/[0.08] hover:border-[#0cf2cd]/15"
                                style={{ transform: 'rotateY(-4deg) rotateX(1deg) translateZ(20px)', animation: 'heroFloat2 7s ease-in-out infinite' }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-base">📅</div>
                                    <p className="text-white font-semibold text-sm">Agenda</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-1 h-6 rounded-full bg-blue-400 shrink-0" />
                                        <div>
                                            <p className="text-white/80 font-medium">Reunião com cliente</p>
                                            <p className="text-slate-500">Amanhã · 15:00</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-1 h-6 rounded-full bg-purple-400 shrink-0" />
                                        <div>
                                            <p className="text-white/80 font-medium">Check-up médico</p>
                                            <p className="text-slate-500">Quinta · 10:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 — Finanças */}
                            <div
                                className="absolute top-[250px] right-[85px] w-[260px] bg-white/[0.04] backdrop-blur-lg border border-white/[0.06] rounded-2xl p-4 shadow-lg transition-all duration-500 hover:bg-white/[0.07] hover:border-[#0cf2cd]/10"
                                style={{ transform: 'rotateY(-3deg) translateZ(0px)', animation: 'heroFloat3 8s ease-in-out infinite' }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-base">💰</div>
                                    <p className="text-white font-semibold text-sm">Finanças</p>
                                    <span className="ml-auto text-[#0cf2cd] text-xs font-bold">-12%</span>
                                </div>
                                <div className="flex items-end gap-[3px] h-8">
                                    {[35, 50, 40, 65, 45, 55, 30, 48, 60, 38, 52, 44].map((h, i) => (
                                        <div key={i} className="flex-1 rounded-sm bg-[#0cf2cd]/30" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                                    <span>Jan</span><span>Fev</span><span>Mar</span>
                                </div>
                            </div>

                            {/* Card 4 — Afazeres (small) */}
                            <div
                                className="absolute top-[345px] right-[115px] w-[230px] bg-white/[0.03] backdrop-blur-md border border-white/[0.05] rounded-2xl p-3.5 shadow-md transition-all duration-500 hover:bg-white/[0.06]"
                                style={{ transform: 'rotateY(-2deg) translateZ(-10px)', animation: 'heroFloat2 9s ease-in-out infinite' }}
                            >
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-sm">✅</div>
                                    <p className="text-white font-semibold text-xs">Afazeres</p>
                                    <span className="ml-auto text-slate-500 text-[10px]">3/5</span>
                                </div>
                                <div className="space-y-1.5">
                                    {['Enviar relatório', 'Comprar presente', 'Ligar para médico'].map((task, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[11px]">
                                            <div className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${i === 0 ? 'border-[#0cf2cd]/40 bg-[#0cf2cd]/10 text-[#0cf2cd]' : 'border-white/15'}`}>
                                                {i === 0 && <span className="text-[8px]">✓</span>}
                                            </div>
                                            <span className={i === 0 ? 'text-slate-500 line-through' : 'text-white/70'}>{task}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Social proof - Bottom of hero, always visible */}
                <motion.div
                    className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-6 sm:pt-4 pb-2 shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex -space-x-2 shrink-0">
                            {['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'].map((bg, i) => (
                                <div key={i} className={`w-8 h-8 ${bg} rounded-full border-2 border-gray-950 flex items-center justify-center text-[10px] font-bold text-white shadow-lg`}>
                                    {['M', 'C', 'A', 'R'][i]}
                                </div>
                            ))}
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm">
                            <span className="text-white font-semibold">+10.000</span> pessoas já organizam sua vida
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════ COMO FUNCIONA ═══════════════ */}
            <section id="como-funciona" className="relative py-24 sm:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Section Header */}
                    <motion.div
                        className="text-center mb-16 sm:mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-[#0cf2cd] text-sm font-semibold tracking-widest uppercase">Como funciona</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 tracking-tight">
                            Simples como mandar uma mensagem
                        </h2>
                        <p className="text-slate-400 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
                            Três passos para transformar a forma como você organiza sua vida financeira, agenda e tarefas.
                        </p>
                    </motion.div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connector line (desktop only) */}
                        <div className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-[#0cf2cd]/0 via-[#0cf2cd]/30 to-[#0cf2cd]/0" />

                        {STEPS.map((step, i) => (
                            <motion.div
                                key={i}
                                className="relative text-center group"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                            >
                                {/* Number */}
                                <div className="w-14 h-14 rounded-2xl bg-[#0cf2cd]/10 border border-[#0cf2cd]/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#0cf2cd]/20 group-hover:border-[#0cf2cd]/40 transition-all duration-300">
                                    <span className="text-[#0cf2cd] font-bold text-lg">{step.num}</span>
                                </div>
                                <span className="text-4xl mb-4 block">{step.icon}</span>
                                <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ BENTO GRID — RECURSOS ═══════════════ */}
            <section id="recursos" className="relative py-24 sm:py-32">
                {/* Background accent */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0cf2cd]/3 rounded-full blur-[150px] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16 sm:mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-[#0cf2cd] text-sm font-semibold tracking-widest uppercase">Recursos</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 tracking-tight">
                            Tudo que você precisa, {' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0cf2cd] to-[#25D366]">
                                em um só lugar
                            </span>
                        </h2>
                        <p className="text-slate-400 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
                            Finanças, agenda, tarefas e lembretes. Tudo integrado ao WhatsApp com inteligência artificial.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {FEATURES_BENTO.map((f, i) => (
                            <motion.div
                                key={i}
                                className={f.span || 'col-span-1'}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                            >
                                <BentoCard feature={f} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ WHATSAPP MOCKUP ═══════════════ */}
            <section className="relative py-24 sm:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Phone Mockup */}
                    <motion.div
                        className="relative flex justify-center"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Glow behind phone */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#25D366]/15 rounded-full blur-[80px]" />

                        <div className="relative w-[280px] sm:w-[320px]">
                            {/* Phone Frame */}
                            <div className="relative bg-[#121212] rounded-[2.5rem] border-[6px] border-[#2d2d2d] shadow-2xl overflow-hidden">
                                {/* Notch */}
                                <div className="h-7 bg-[#121212] flex justify-center relative z-20">
                                    <div className="w-20 h-5 bg-black rounded-b-xl" />
                                </div>
                                {/* WhatsApp Header */}
                                <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 border-b border-[#2a3942]">
                                    <div className="w-8 h-8 rounded-full bg-[#0cf2cd] flex items-center justify-center text-xs font-bold text-gray-950">C</div>
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-semibold">Controle-C 🤖</p>
                                        <p className="text-[#8696a0] text-[10px]">online</p>
                                    </div>
                                </div>
                                {/* Chat */}
                                <div className="bg-[#0b141a] p-4 min-h-[380px] flex flex-col gap-3 relative">
                                    <div className="absolute inset-0 bg-[#0b141a]/95 z-0" />
                                    <div className="relative z-10 flex flex-col gap-3">
                                        {/* Date */}
                                        <div className="flex justify-center">
                                            <span className="bg-[#182229] text-[#8696a0] text-[10px] px-3 py-1 rounded-lg">Hoje</span>
                                        </div>
                                        {/* User Audio */}
                                        <div className="self-end max-w-[80%] bg-[#005c4b] rounded-lg rounded-tr-none p-2">
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <span className="text-xs">▶</span>
                                                <div className="h-1 flex-1 bg-white/30 rounded-full" />
                                            </div>
                                            <div className="flex justify-between text-[10px] text-[#aebac1] mt-1">
                                                <span>0:08</span>
                                                <div className="flex items-center gap-1">
                                                    <span>10:42</span>
                                                    <span className="text-[#53bdeb]">✓✓</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Bot Response */}
                                        <div className="max-w-[80%] bg-[#202c33] rounded-lg rounded-tl-none p-3">
                                            <p className="text-white text-sm">Entendido! Registrei o gasto:</p>
                                            <div className="bg-[#182229] rounded p-2 mt-2 border-l-4 border-[#0cf2cd]">
                                                <p className="text-white font-bold text-sm">Almoço de Negócios</p>
                                                <p className="text-[#0cf2cd] font-bold">R$ 120,00</p>
                                                <p className="text-[#8696a0] text-xs">Categoria: Alimentação 🍽️</p>
                                            </div>
                                            <p className="text-white text-sm mt-2">Também adicionei ao seu Google Calendar ✅</p>
                                            <div className="flex justify-end text-[10px] text-[#8696a0] mt-1">10:42</div>
                                        </div>
                                        {/* Bot Chart */}
                                        <div className="max-w-[80%] bg-[#202c33] rounded-lg rounded-tl-none p-2">
                                            <div className="bg-[#111b21] rounded p-3">
                                                <p className="text-[#8696a0] text-[10px] uppercase tracking-wide font-bold mb-2">Gastos da Semana</p>
                                                <div className="flex items-end h-12 gap-1">
                                                    {[30, 50, 40, 80, 45, 60, 90].map((h, i) => (
                                                        <div key={i} className={`flex-1 rounded-t-sm ${i === 6 ? 'bg-[#0cf2cd]' : 'bg-[#2a3942]'}`} style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex justify-end text-[10px] text-[#8696a0] p-1">10:43</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Input */}
                                <div className="bg-[#0b141a] p-2 flex gap-2 items-center">
                                    <div className="bg-[#202c33] flex-1 h-10 rounded-full flex items-center px-4 gap-3">
                                        <span className="text-[#8696a0] text-sm">Mensagem</span>
                                    </div>
                                    <div className="w-10 h-10 bg-[#0cf2cd] rounded-full flex items-center justify-center text-gray-950 text-lg">🎙</div>
                                </div>
                                {/* Home bar */}
                                <div className="h-6 bg-[#0b141a] flex justify-center items-center">
                                    <div className="w-28 h-1 bg-white/20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Benefits Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="text-[#25D366] text-sm font-semibold tracking-widest uppercase">WhatsApp Nativo</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-6 tracking-tight">
                            Sem apps novos.<br />Tudo no seu WhatsApp.
                        </h2>
                        <div className="space-y-6">
                            {[
                                { icon: '🎙️', title: 'Envie áudios', desc: 'Fale naturalmente como se estivesse conversando com um amigo.' },
                                { icon: '📸', title: 'Envie fotos de recibos', desc: 'A IA lê o comprovante e registra o valor automaticamente.' },
                                { icon: '⚡', title: 'Resposta instantânea', desc: 'Confirmação em segundos. Sem espera, sem travamentos.' },
                                { icon: '🔔', title: 'Lembretes automáticos', desc: 'Receba notificações de contas, vencimentos e compromissos diretamente no chat.' },
                            ].map((b, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-xl shrink-0">
                                        {b.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold text-base">{b.title}</h4>
                                        <p className="text-slate-400 text-sm mt-0.5">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════ DASHBOARD SHOWCASE ═══════════════ */}
            <section id="dashboard" className="relative py-24 sm:py-32 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#0cf2cd]/3 rounded-full blur-[180px] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16 sm:mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-[#0cf2cd] text-sm font-semibold tracking-widest uppercase">Dashboard</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 tracking-tight">
                            Acompanhe tudo em{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0cf2cd] to-[#25D366]">tempo real</span>
                        </h2>
                        <p className="text-slate-400 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
                            Além do WhatsApp, você tem acesso a um painel web completo para visualizar, gerenciar e exportar todos os seus dados.
                        </p>
                    </motion.div>

                    {/* Dashboard Mock */}
                    <motion.div
                        className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-gray-950 overflow-hidden shadow-2xl shadow-black/50"
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Window bar */}
                        <div className="flex items-center gap-2 px-5 py-3 bg-slate-800/50 border-b border-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="bg-slate-700/50 rounded-md px-4 py-1 text-[11px] text-slate-400 flex items-center gap-2">
                                    <span>🔒</span> app.controlec.com.br/dashboard
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5">
                            {/* Sidebar Mini */}
                            <div className="hidden md:flex md:col-span-2 flex-col gap-3 pr-4 border-r border-white/5">
                                <div className="w-full h-8 bg-[#0cf2cd]/10 border border-[#0cf2cd]/20 rounded-lg flex items-center justify-center text-[11px] text-[#0cf2cd] font-semibold">📊 Finanças</div>
                                <div className="w-full h-8 bg-white/5 rounded-lg flex items-center justify-center text-[11px] text-slate-400">📋 Tarefas</div>
                                <div className="w-full h-8 bg-white/5 rounded-lg flex items-center justify-center text-[11px] text-slate-400">📅 Agenda</div>
                                <div className="w-full h-8 bg-white/5 rounded-lg flex items-center justify-center text-[11px] text-slate-400">🔔 Lembretes</div>
                            </div>

                            {/* Main area */}
                            <div className="md:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Finance Card */}
                                <div className="sm:col-span-2 bg-slate-800/40 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-white text-sm font-semibold">Gastos por Categoria</h4>
                                        <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded">Fev 2026</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        {[
                                            { label: 'Alimentação', pct: 35, color: 'bg-[#0cf2cd]' },
                                            { label: 'Transporte', pct: 22, color: 'bg-blue-400' },
                                            { label: 'Lazer', pct: 18, color: 'bg-purple-400' },
                                            { label: 'Moradia', pct: 25, color: 'bg-amber-400' },
                                        ].map((cat, i) => (
                                            <div key={i} className="text-center">
                                                <div className="h-20 bg-white/5 rounded-lg flex flex-col justify-end overflow-hidden">
                                                    <div className={`${cat.color} rounded-t-sm transition-all`} style={{ height: `${cat.pct * 2}%` }} />
                                                </div>
                                                <span className="text-[9px] text-slate-500 mt-1 block">{cat.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                        <span className="text-slate-500 text-xs">Total do mês</span>
                                        <span className="text-white text-sm font-bold">R$ 3.247,80</span>
                                    </div>
                                </div>

                                {/* Reminders Card */}
                                <div className="bg-slate-800/40 rounded-xl p-4 border border-white/5">
                                    <h4 className="text-white text-sm font-semibold mb-3">🔔 Próximos Vencimentos</h4>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Netflix', days: '2 dias', amount: 'R$ 55,90', urgent: true },
                                            { label: 'Aluguel', days: '5 dias', amount: 'R$ 1.800', urgent: false },
                                            { label: 'Energia', days: '8 dias', amount: 'R$ 210', urgent: false },
                                            { label: 'Internet', days: '12 dias', amount: 'R$ 119', urgent: false },
                                        ].map((bill, i) => (
                                            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${bill.urgent ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${bill.urgent ? 'bg-red-500' : 'bg-slate-500'}`} />
                                                <span className="text-slate-300 flex-1">{bill.label}</span>
                                                <span className="text-slate-500">{bill.days}</span>
                                                <span className="text-white font-semibold">{bill.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Kanban Card */}
                                <div className="sm:col-span-2 bg-slate-800/40 rounded-xl p-4 border border-white/5">
                                    <h4 className="text-white text-sm font-semibold mb-3">📋 Tarefas</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { title: 'A Fazer', color: 'border-slate-500/30', items: ['Comprar remédio', 'Enviar proposta'] },
                                            { title: 'Fazendo', color: 'border-amber-500/30', items: ['Relatório mensal'] },
                                            { title: 'Feito', color: 'border-[#0cf2cd]/30', items: ['Reunião equipe', 'Pagar conta luz'] },
                                        ].map((col, i) => (
                                            <div key={i} className="flex flex-col gap-1.5">
                                                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">{col.title}</span>
                                                {col.items.map((item, j) => (
                                                    <div key={j} className={`text-[11px] text-slate-300 p-2 bg-white/5 rounded-md border-l-2 ${col.color}`}>{item}</div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Calendar Mini */}
                                <div className="bg-slate-800/40 rounded-xl p-4 border border-white/5">
                                    <h4 className="text-white text-sm font-semibold mb-3">📅 Hoje</h4>
                                    <div className="space-y-2">
                                        {[
                                            { time: '09:00', event: 'Daily standup', color: 'bg-blue-400' },
                                            { time: '14:00', event: 'Almoço de negócios', color: 'bg-[#0cf2cd]' },
                                            { time: '16:30', event: 'Review projeto', color: 'bg-purple-400' },
                                        ].map((evt, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span className={`w-1.5 h-6 rounded-full ${evt.color}`} />
                                                <div>
                                                    <span className="text-slate-500 text-[10px]">{evt.time}</span>
                                                    <p className="text-slate-300 text-xs">{evt.event}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Dashboard benefits */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                        {[
                            { icon: '📊', label: 'Gráficos de gastos por período e categoria' },
                            { icon: '📋', label: 'Kanban de tarefas com drag & drop' },
                            { icon: '🔔', label: 'Central de lembretes e contas recorrentes' },
                            { icon: '📥', label: 'Exportação de relatórios em CSV e PDF' },
                        ].map((b, i) => (
                            <div key={i} className="text-center">
                                <span className="text-2xl">{b.icon}</span>
                                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">{b.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            <section id="precos" className="relative py-24 sm:py-32">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#0cf2cd]/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-[#0cf2cd] text-sm font-semibold tracking-widest uppercase">Preços</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 tracking-tight">
                            Escolha seu plano
                        </h2>
                        <p className="text-slate-400 text-base sm:text-lg mt-4 max-w-xl mx-auto">
                            Comece gratuitamente. Cancele quando quiser. Sem surpresas.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {PRICING.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                className={`relative rounded-3xl p-8 sm:p-10 transition-all duration-300 ${plan.popular
                                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-[#0cf2cd]/40 shadow-[0_0_40px_rgba(12,242,205,0.1)]'
                                    : 'bg-slate-900/60 border border-white/10 hover:border-white/20'
                                    }`
                                }
                            >
                                {/* Popular badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0cf2cd] text-gray-950 text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(12,242,205,0.3)]">
                                        {plan.badge}
                                    </div>
                                )}

                                <h3 className="text-white font-bold text-xl mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-sm text-slate-400">R$</span>
                                    <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                                    <span className="text-slate-400 text-sm">{plan.period}</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                                            <span className="text-[#0cf2cd] text-base">✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href="https://pay.zouti.com.br/checkout?product_offer_id=prod_offer_ydek6nmp28nqr06wkqifds"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 cursor-pointer flex items-center justify-center ${plan.popular
                                        ? 'bg-[#0cf2cd] hover:bg-[#1efadb] text-gray-950 shadow-[0_0_25px_rgba(12,242,205,0.25)] hover:shadow-[0_0_40px_rgba(12,242,205,0.45)]'
                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                                        }`
                                    }
                                >
                                    {plan.popular ? 'Assinar Plano Anual' : 'Assinar Plano Mensal'}
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ DEPOIMENTOS ═══════════════ */}
            <section className="py-24 sm:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-[#0cf2cd] text-sm font-semibold tracking-widest uppercase">Depoimentos</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 tracking-tight">
                            Amado por milhares
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div
                                key={i}
                                className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-white/10 transition-all duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                            >
                                <StarRating count={t.rating} />
                                <p className="text-slate-300 text-sm leading-relaxed mt-4 mb-6 italic">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0cf2cd] to-[#25D366] flex items-center justify-center text-gray-950 font-bold text-sm">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{t.name}</p>
                                        <p className="text-slate-500 text-xs">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ FAQ ═══════════════ */}
            <section id="faq" className="py-24 sm:py-32">
                <div className="max-w-3xl mx-auto px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-[#0cf2cd] text-sm font-semibold tracking-widest uppercase">FAQ</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
                            Perguntas Frequentes
                        </h2>
                    </motion.div>

                    <motion.div
                        className="border border-white/5 rounded-2xl divide-y divide-white/5 bg-slate-900/30 px-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {FAQS.map((faq, i) => (
                            <FAQItem key={i} q={faq.q} a={faq.a} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════ CTA FINAL ═══════════════ */}
            <section className="relative py-24 sm:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0cf2cd]/5 via-transparent to-transparent pointer-events-none" />

                <motion.div
                    className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center"
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                        Pronto para simplificar{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0cf2cd] to-[#25D366]">
                            sua vida?
                        </span>
                    </h2>
                    <p className="text-slate-400 text-base sm:text-lg mt-6 max-w-xl mx-auto">
                        Escolha seu plano e veja a diferença em 5 minutos. Sem downloads. Sem complicações.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#precos" className="inline-flex items-center gap-2 bg-[#0cf2cd] hover:bg-[#1efadb] text-gray-950 font-bold text-lg py-5 px-10 rounded-2xl shadow-[0_0_40px_rgba(12,242,205,0.3)] hover:shadow-[0_0_60px_rgba(12,242,205,0.5)] transition-all duration-300">
                            Escolher Meu Plano →
                        </a>
                    </div>
                    <p className="text-slate-600 text-xs mt-6">Cancele a qualquer momento · Sem fidelidade · LGPD compliant</p>
                </motion.div>
            </section>

            {/* ═══════════════ FOOTER ═══════════════ */}
            <footer className="border-t border-white/5 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-[#0cf2cd] flex items-center justify-center">
                                    <span className="text-gray-950 font-black text-xs">C</span>
                                </div>
                                <span className="font-bold text-white">Controle-C</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Seu assistente pessoal inteligente, direto no WhatsApp.
                            </p>
                        </div>

                        {/* Produto */}
                        <div>
                            <h4 className="text-white font-semibold text-sm mb-4">Produto</h4>
                            <ul className="space-y-2.5">
                                {['Recursos', 'Preços', 'Integrações', 'Roadmap'].map((item, i) => (
                                    <li key={i}><a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* Empresa */}
                        <div>
                            <h4 className="text-white font-semibold text-sm mb-4">Empresa</h4>
                            <ul className="space-y-2.5">
                                {['Sobre', 'Blog', 'Contato', 'Carreiras'].map((item, i) => (
                                    <li key={i}><a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
                            <ul className="space-y-2.5">
                                {['Privacidade', 'Termos de Uso', 'LGPD', 'Cookies'].map((item, i) => (
                                    <li key={i}><a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-slate-600 text-sm">© 2026 Controle-C. Todos os direitos reservados.</p>
                        <div className="flex items-center gap-4">
                            {['Instagram', 'LinkedIn', 'Twitter'].map((social, i) => (
                                <a key={i} href="#" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">{social}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default LandingPage;
