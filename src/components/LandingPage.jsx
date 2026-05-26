import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Sparkles, ArrowRight, Play, CheckCircle2, Shield, MessageSquare, Calendar, TrendingUp, Sparkle, Mic, Volume2, X, DollarSign, Flame, ChevronLeft, ChevronRight, Brain, Frown, Smile, AlertCircle, Hourglass } from 'lucide-react';

const situations = [
    {
        tabLabel: "Acordando na segunda",
        emoji: "🌅",
        userMessage: "Jarvis, o que eu tenho programado para hoje e qual é a primeira tarefa da minha semana?",
        jarvisReply: "Bom dia, chefe! Você tem 3 compromissos hoje. O primeiro é a Reunião de Alinhamento às 10:00. Sua primeira tarefa pendente é 'Revisar proposta do Controle-C'.",
        category: "Agenda & Tarefas",
        tags: ["Agenda", "Tarefas"],
        metricLabel: "Progresso Semanal",
        metricValue: "12%",
        metricBarWidth: "w-[12%]",
        floatingTitle: "Agenda",
        floatingVal: "Reunião de Alinhamento",
        floatingIcon: "📅",
        floatingColor: "text-accent-purple bg-accent-purple/10",
        videoUrl: "https://pub-91424e7b1d9d42bba2633f0dd91bcea1.r2.dev/hero-segunda.mp4"
    },
    {
        tabLabel: "Na fila do café",
        emoji: "☕",
        userMessage: "Jarvis, comprei um cappuccino e um pão na chapa. Deu R$ 18,50 no débito.",
        jarvisReply: "Anotado, chefe! R$ 18,50 lançados em Alimentação. Seu gasto na categoria esta semana está em R$ 94,20 (dentro da meta de R$ 250).",
        category: "Finanças Pessoais",
        tags: ["Finanças", "Alimentação"],
        metricLabel: "Orçamento Diário",
        metricValue: "45%",
        metricBarWidth: "w-[45%]",
        floatingTitle: "Finanças",
        floatingVal: "Starbucks: R$ 18,50",
        floatingIcon: "💰",
        floatingColor: "text-accent-emerald bg-accent-emerald/10",
        videoUrl: "https://pub-91424e7b1d9d42bba2633f0dd91bcea1.r2.dev/hero-fila-cafe.mp4"
    },
    {
        tabLabel: "Briefing diário",
        emoji: "📊",
        userMessage: "Jarvis, me dá um resumo do meu orçamento e compromissos de hoje de forma rápida.",
        jarvisReply: "Resumo pronto! Compromissos: 2 reuniões à tarde. Gastos de hoje: R$ 0,00 lançados. Saldo restante do mês dentro do planejado. Você está no caminho certo!",
        category: "Relatórios & Resumos",
        tags: ["Briefing", "Sincronizado"],
        metricLabel: "Previsão Mensal",
        metricValue: "Meta Batida",
        metricBarWidth: "w-[100%]",
        floatingTitle: "Meta",
        floatingVal: "+ R$ 1.500,00 poupados",
        floatingIcon: "📈",
        floatingColor: "text-accent-cyan bg-accent-cyan/10",
        videoUrl: "https://pub-91424e7b1d9d42bba2633f0dd91bcea1.r2.dev/hero-briefing.mp4"
    },
    {
        tabLabel: "Querendo aprender",
        emoji: "💡",
        userMessage: "Jarvis, salve esse link sobre Inteligência Artificial na minha base de conhecimento para ler mais tarde.",
        jarvisReply: "Link salvo com sucesso na sua Base de Conhecimento! Marquei como 'Tecnologia' e 'Leitura'. Deseja que eu agende um lembrete para domingo às 19:00?",
        category: "Base de Conhecimento",
        tags: ["Conhecimento", "Leitura"],
        metricLabel: "Artigos Salvos",
        metricValue: "8 links",
        metricBarWidth: "w-[65%]",
        floatingTitle: "Base de Conhecimento",
        floatingVal: "Salvo com sucesso",
        floatingIcon: "💡",
        floatingColor: "text-amber-400 bg-amber-400/10",
        videoUrl: "https://pub-91424e7b1d9d42bba2633f0dd91bcea1.r2.dev/hero-reuniao.mp4"
    },
    {
        tabLabel: "Sexta à noite",
        emoji: "🎉",
        userMessage: "Jarvis, acabei de treinar agora na academia. Marca como concluído meu hábito de exercícios.",
        jarvisReply: "Excelente trabalho, chefe! Hábito de 'Exercícios Físicos' marcado. Você completou 5 dias seguidos! Streak de fogo ativado: 🔥 5 dias!",
        category: "Gestão de Hábitos",
        tags: ["Habits", "🔥 Streak!"],
        metricLabel: "Hábito Semanal",
        metricValue: "🔥 5 dias seguidos",
        metricBarWidth: "w-[83%]",
        floatingTitle: "Saúde",
        floatingVal: "Exercícios Feitos",
        floatingIcon: "🏋️",
        floatingColor: "text-rose-500 bg-rose-500/10",
        videoUrl: "https://pub-91424e7b1d9d42bba2633f0dd91bcea1.r2.dev/hero-sexta.mp4"
    },
    {
        tabLabel: "Final do mês",
        emoji: "📈",
        userMessage: "Jarvis, como fecharam minhas contas este mês? Consegui poupar o planejado?",
        jarvisReply: "Parabéns, chefe! Você poupou R$ 1.500,00 este mês, superando a meta em 15%. Seus maiores gastos foram Alimentação e Lazer. Relatório detalhado disponível no painel!",
        category: "Finanças Avançadas",
        tags: ["Balanço", "Relatório"],
        metricLabel: "Saldo Economizado",
        metricValue: "115% da meta",
        metricBarWidth: "w-[100%]",
        floatingTitle: "Economia",
        floatingVal: "+ R$ 1.500,00",
        floatingIcon: "💰",
        floatingColor: "text-accent-emerald bg-accent-emerald/10",
        videoUrl: "https://pub-91424e7b1d9d42bba2633f0dd91bcea1.r2.dev/hero-final-mes.mp4"
    }
];

const LandingPage = () => {
    const containerRef = useRef(null);
    const timelineRef = useRef(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [simStep, setSimStep] = useState(0); // 0: audio processing, 1: processed/revealed
    const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
    const [billingPeriod, setBillingPeriod] = useState('annual');

    const handleMouseMoveCard = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / (rect.height / 2)) * -12;
        const tiltY = (x / (rect.width / 2)) * 12;
        setCardTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeaveCard = () => {
        setCardTilt({ x: 0, y: 0 });
    };

    // States and refs for interactive micro-interfaces in timeline cards
    const [activeFinanceCategory, setActiveFinanceCategory] = useState(null);
    const [tasks, setTasks] = useState([
        { id: 1, text: "Revisar proposta comercial", completed: true },
        { id: 2, text: "Lançar custos de alimentação", completed: false },
        { id: 3, text: "Treinar 40min de cardio", completed: false }
    ]);
    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const [habitDays, setHabitDays] = useState([
        { day: "Seg", done: true },
        { day: "Ter", done: true },
        { day: "Qua", done: true },
        { day: "Qui", done: true },
        { day: "Sex", done: true },
        { day: "Sáb", done: true },
        { day: "Dom", done: false }
    ]);
    const toggleHabitDay = (index) => {
        setHabitDays(prev => prev.map((d, idx) => idx === index ? { ...d, done: !d.done } : d));
    };

    const budgetData = [
        { category: "Alimentação", current: 185, max: 250, color: "bg-[#ffa751]" },
        { category: "Transporte", current: 90, max: 150, color: "bg-[#ffe259]" },
        { category: "Lazer", current: 310, max: 300, color: "bg-rose-500" }
    ];

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 60%", "end 85%"]
    });
    const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        let isCancelled = false;
        setSimStep(0);

        // Sync with video audio processing (approx 1.8 seconds)
        const timer = setTimeout(() => {
            if (isCancelled) return;
            setSimStep(1);
        }, 1800);

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [activeTab]);

    // Auto-cycle situations showcase every 8 seconds to automatically present all features
    useEffect(() => {
        const cycleTimer = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % situations.length);
        }, 8000);
        return () => clearInterval(cycleTimer);
    }, []);

    // High-performance cursor tracking for dynamic background glow spotlight
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            container.style.setProperty('--mouse-x', `${x}px`);
            container.style.setProperty('--mouse-y', `${y}px`);
        };

        container.addEventListener('mousemove', handleMouseMove);
        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Animações do Framer Motion - Tactile Spring
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 90, damping: 20 }
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-bg-space text-text-main font-body-jakarta overflow-x-hidden relative">
            
            {/* ── INTERACTIVE CURSOR SPOTLIGHT GLOW (Prevalece em toda a página) ── */}
            <div 
                className="absolute inset-0 pointer-events-none z-[1] mix-blend-screen"
                style={{
                    background: 'radial-gradient(450px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(6,182,212,0.18) 0%, rgba(29,78,216,0.06) 45%, transparent 80%)',
                }}
            />
            
            {/* ── HERO WRAPPER (Restringe o background e glows ao Hero) ── */}
            <div className="relative overflow-hidden w-full">
                
                {/* ── HIGH-FIDELITY REF BACKGROUND (Multi-Column Diagonal Split - Vivid Tech - Hyper Animated) ──── */}
            {/* Base escura profunda e Wrapper do Ciclo Nebular de Cores */}
            <div className="absolute inset-0 bg-[#010307] pointer-events-none z-0 overflow-hidden animate-nebula-cycle">
                
                {/* COLUNA 1: Extremo Esquerdo (Deep Royal Blue & Sapphire) */}
                <div 
                    className="absolute top-0 left-[-20%] w-[45vw] h-[120vh] -skew-x-[20deg] origin-top border-r border-white/[0.03] pointer-events-none z-0 overflow-hidden mix-blend-screen"
                    style={{
                        background: 'linear-gradient(135deg, rgba(29,78,216,0.06) 0%, #010307 100%)'
                    }}
                >
                    {/* Glow Interno Azul Real & Ciano Premium */}
                    <div 
                        className="absolute top-[-10%] left-[-10%] w-[120%] h-[75%] rounded-full blur-[100px] animate-liquid-fast-1"
                        style={{
                            background: 'radial-gradient(circle, rgba(37,99,235,0.35) 0%, rgba(6,182,212,0.12) 60%, transparent 100%)'
                        }}
                    />
                </div>

                {/* COLUNA 2: Centro-Esquerda (Brilho Ciano Elétrico / Cyan Glow) */}
                <div 
                    className="absolute top-0 left-[22%] w-[30vw] h-[120vh] origin-top border-r border-white/[0.04] pointer-events-none z-0 shadow-[-20px_0_40px_rgba(0,0,0,0.85)] overflow-hidden mix-blend-screen animate-col-slide-hyper-1"
                    style={{
                        background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, #010408 100%)'
                    }}
                >
                    {/* Glow Principal Ciano muito vibrante e vivo */}
                    <div 
                        className="absolute top-[10%] left-[-20%] w-[140%] h-[65%] rounded-full blur-[110px] animate-liquid-fast-2"
                        style={{
                            background: 'radial-gradient(circle, rgba(6,182,212,0.60) 0%, rgba(59,130,246,0.30) 45%, transparent 100%)'
                        }}
                    />
                </div>

                {/* COLUNA 3: Centro-Direita (Glow Azul Royal Elétrico / Electric Blue) */}
                <div 
                    className="absolute top-0 left-[48%] w-[28vw] h-[120vh] origin-top border-r border-white/[0.05] border-l border-white/[0.02] pointer-events-none z-0 shadow-[-25px_0_50px_rgba(0,0,0,0.9)] overflow-hidden mix-blend-screen animate-col-slide-hyper-2"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0,102,255,0.08) 0%, #010307 100%)'
                    }}
                >
                    {/* Glow Azul Royal de Alta Intensidade e Vivacidade */}
                    <div 
                        className="absolute top-[20%] left-[-15%] w-[130%] h-[60%] rounded-full blur-[90px] animate-liquid-fast-3"
                        style={{
                            background: 'radial-gradient(circle, rgba(0,102,255,0.65) 0%, rgba(56,189,248,0.20) 50%, transparent 100%)'
                        }}
                    />
                </div>

                {/* COLUNA 4: Extremo Direito (Glow Deep Cobalt & Sky Blue) */}
                {/* Esta coluna carrega a nossa linha de corte super iluminada em Cyan e o glow azul principal */}
                <div 
                    className="absolute top-0 left-[72%] w-[40vw] h-[120vh] border-l border-accent-cyan/50 origin-top pointer-events-none z-0 shadow-[-25px_0_80px_rgba(0,0,0,0.95),-8px_0_40px_rgba(12,242,205,0.45)] overflow-hidden animate-col-slide-hyper-3"
                    style={{
                        background: 'linear-gradient(135deg, rgba(29,78,216,0.08) 0%, #010307 100%)'
                    }}
                >
                    {/* Glow Interno no Separador para destacar a borda diagonal com brilho ciano */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,182,212,0.12),transparent_50%)] pointer-events-none" />

                    {/* LADO DIREITO (Dentro da fatia diagonal): Glow Azul/Ciano Tech super vivo */}
                    <div className="absolute inset-0 skew-x-[20deg] origin-top mix-blend-screen">
                        <div 
                            className="absolute top-[-5%] right-[-10%] w-[115%] h-[80%] rounded-full blur-[100px] sm:blur-[130px] opacity-100 animate-liquid-fast-1"
                            style={{
                                background: 'radial-gradient(circle, rgba(30,64,175,0.55) 0%, rgba(56,189,248,0.25) 45%, rgba(0,0,0,0) 80%)'
                            }}
                        />
                    </div>
                </div>
                {/* Sutil malha de pontos para adicionar textura tech premium sobre toda a tela */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none z-0 mix-blend-overlay" />
            </div>



            {/* ── HERO SECTION (Centered & Premium Editorial) ────────────────── */}
            <header className="relative pt-20 pb-4 sm:pt-24 sm:pb-6 flex flex-col items-center justify-center z-10 w-full">
                <div className="max-w-5xl mx-auto px-6 w-full flex flex-col items-center text-center">
                    
                    {/* Elementos Centrais de Texto */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center w-full"
                    >
                        {/* Elegant Minimal Badge */}
                        <motion.div 
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border-glass bg-white/[0.02] text-text-muted text-xs sm:text-sm font-medium mb-4 backdrop-blur-md animate-pulse"
                        >
                            <Sparkle className="w-3.5 h-3.5 text-accent-cyan" />
                            <span>✨ +2.000 pessoas no controle da própria rotina</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan/40" />
                        </motion.div>

                        {/* Centered Editorial Headline (Jakarta + Instrument Serif Contrast) */}
                        <motion.h1 
                            variants={itemVariants}
                            className="font-body-jakarta font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.15] mb-4 max-w-4xl premium-text-shadow"
                        >
                            O único aplicativo que você precisa <br className="hidden sm:block" /> para organizar{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe259] to-[#ffa751]">
                                sua vida.
                            </span>
                        </motion.h1>

                        {/* Premium Editorial Subheadline */}
                        <motion.p 
                            variants={itemVariants}
                            className="text-text-muted text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-2xl mb-6 premium-subtext-shadow"
                        >
                            O assistente de IA que vive no seu WhatsApp. Envie um áudio para registrar gastos, agendar compromissos e organizar tarefas. Sem apps complexos.
                        </motion.p>

                        {/* Centered CTAs */}
                        <motion.div 
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
                        >
                            <a 
                                href="#precos" 
                                className="inline-flex items-center justify-center gap-2 bg-white text-bg-space font-semibold text-sm py-3.5 px-8 rounded-full shadow-[0_4px_25px_rgba(255,255,255,0.15)] hover:bg-slate-100 hover:scale-[1.02] active:scale-100 transition-all duration-300 w-full sm:w-auto cursor-pointer"
                            >
                                Testar Grátis no WhatsApp
                                <ArrowRight className="w-4 h-4 text-bg-space" />
                            </a>
                            <button 
                                onClick={() => setShowDemoModal(true)}
                                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm py-3.5 px-8 rounded-full border border-border-glass hover:border-white/20 hover:scale-[1.02] active:scale-100 transition-all duration-300 backdrop-blur-md w-full sm:w-auto cursor-pointer"
                            >
                                <Play className="w-3.5 h-3.5 fill-white text-white" />
                                Ver Vídeo Demo
                            </button>
                        </motion.div>

                        {/* Trust Assurances below CTAs */}
                        <motion.div 
                            variants={itemVariants}
                            className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-muted"
                        >
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" /> 100% Grátis para testar
                            </span>
                            <span className="hidden sm:inline opacity-30">•</span>
                            <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-accent-cyan" /> Configuração em 1 minuto
                            </span>
                            <span className="hidden sm:inline opacity-30">•</span>
                            <span className="flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-accent-cyan" /> Sem necessidade de cartão
                            </span>
                        </motion.div>

                    </motion.div>

                    {/* GRAND CENTERPIECE DEVICE (Product-as-the-Demo Showcase) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 70, damping: 22, delay: 0.45 }}
                        className="w-full max-w-5xl relative z-10 mt-10 sm:mt-14"
                    >
                        
                        {/* O Console de Dashboard Horizontal (Editorial & Clean) */}
                        <div className="w-full bg-[#010307]/60 backdrop-blur-3xl border border-white/[0.08] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 hover:border-white/[0.15]">
                            
                            {/* Top Bar da Janela (Browser Mockup Style) */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                </div>
                                <div className="px-5 py-1.5 rounded-full bg-[#010307]/50 border border-white/[0.08] text-xs text-text-muted select-none">
                                    controle-c.com.br
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                                    <span className="text-[10px] text-text-muted font-bold tracking-wide uppercase">Jarvis Conectado</span>
                                </div>
                            </div>

                            {/* Conteúdo do Console Integrado */}
                            <div className="w-full aspect-video bg-[#010307]/30 relative overflow-hidden flex items-center justify-center">
                                {/* Glow interno sutil */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/5 to-transparent pointer-events-none" />
                                
                                <motion.video
                                    key={situations[activeTab].videoUrl}
                                    initial={{ opacity: 0, scale: 0.99 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.99 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    src={situations[activeTab].videoUrl}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Sutil overlay de reflexo de vidro */}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/[0.06]" />
                            </div>
                        </div>

                        {/* Elementos Flutuantes Dinâmicos Reativos */}
                        {/* Calendário/Metadado Dinâmico 1 no lado esquerdo */}
                        <div 
                            className="absolute -top-6 -left-8 bg-bg-space/95 border border-white/[0.12] rounded-lg p-3.5 shadow-2xl hidden md:flex items-center gap-3 animate-float pointer-events-none transition-all duration-300"
                            style={{ animationDuration: "7s" }}
                        >
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${situations[activeTab].floatingColor}`}>
                                {situations[activeTab].floatingIcon}
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] text-text-dimmed">{situations[activeTab].floatingTitle}</p>
                                <p className="text-[11px] text-white font-bold">{situations[activeTab].floatingVal}</p>
                            </div>
                        </div>

                        {/* Metadado Dinâmico 2 no lado direito */}
                        <div 
                            className="absolute -bottom-6 -right-6 bg-bg-space/95 border border-white/[0.12] rounded-lg p-3.5 shadow-2xl hidden md:flex items-center gap-3 animate-float-delayed pointer-events-none transition-all duration-300"
                            style={{ animationDuration: "5.5s" }}
                        >
                            <div className="w-8 h-8 rounded-md bg-accent-emerald/10 flex items-center justify-center text-accent-emerald text-sm">✓</div>
                            <div className="text-left">
                                <p className="text-[9px] text-text-dimmed">WhatsApp Sync</p>
                                <p className="text-[11px] text-accent-cyan font-bold">100% Sincronizado</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </header>
            
            </div>

            {/* ── TIMELINE SECTION: COMO O CONTROLE-C RESOLVE SUA VIDA ── */}
            <section ref={timelineRef} id="funcionamento" className="relative py-28 z-10 w-full max-w-5xl mx-auto px-6">
                
                {/* Header da Seção */}
                <div className="text-center mb-20 flex flex-col items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.97, filter: "blur(12px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-[#ffa751] mb-4 backdrop-blur-md"
                    >
                        <Sparkle className="w-3.5 h-3.5 text-[#ffa751]" />
                        <span>Funcionamento</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(15px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4, delay: 0.15 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 max-w-2xl premium-text-shadow"
                    >
                        Como o Controle-C resolve sua vida
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 12, scale: 0.99, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4, delay: 0.3 }}
                        className="text-text-muted text-sm sm:text-base max-w-xl leading-relaxed"
                    >
                        O assistente de IA recebe e processa suas mensagens de áudio ou texto pelo WhatsApp, organizando sua rotina em segundo plano em menos de 5 segundos.
                    </motion.p>
                </div>

                {/* Grid da Linha do Tempo */}
                <div className="relative w-full">
                    
                    {/* Linha Fina de Fundo (Rail) */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/[0.05] -translate-x-[1px]" />
                    
                    {/* Linha Ativa com Crescimento via Scroll */}
                    <motion.div 
                        className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#ffe259] via-[#ffa751] to-[#00f0ff] origin-top -translate-x-[1px]"
                        style={{ scaleY }}
                    />

                    {/* Espaçador superior da linha do tempo */}
                    <div className="h-6" />

                    {/* Card 1: Finanças */}
                    <div className="relative flex flex-col md:flex-row items-start md:justify-between mb-24 w-full pl-12 md:pl-0">
                        {/* Ponto de Junção no Trilho */}
                        <motion.div 
                            initial={{ scale: 0.7, borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 0 0px rgba(0,0,0,0)" }}
                            whileInView={{ scale: 1.1, borderColor: "#ffa751", boxShadow: "0 0 15px rgba(250,167,81,0.4)" }}
                            viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            className="absolute left-[3px] md:left-1/2 top-4 md:-translate-x-1/2 w-6 h-6 rounded-full bg-[#010307] border-2 flex items-center justify-center z-20"
                        >
                            <motion.span 
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                                className="w-2 h-2 rounded-full bg-[#ffa751]" 
                            />
                        </motion.div>
                        
                        {/* Card Lado Esquerdo */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(15px)" }}
                            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                            transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4 }}
                            className="w-full md:w-[45%] bg-[#010307]/50 backdrop-blur-xl border border-white/[0.08] hover:border-[#ffa751]/30 hover:shadow-[0_0_30px_rgba(250,167,81,0.06)] rounded-2xl p-6 transition-all duration-500 text-left"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[#ffa751]/10 border border-[#ffa751]/20 flex items-center justify-center text-[#ffa751]">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Suas Finanças no Automático</h3>
                            </div>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">
                                Envie um áudio simples como <span className="text-[#ffa751] font-mono italic bg-[#ffa751]/5 px-1.5 py-0.5 rounded">"gastei R$ 45 com janta"</span> e o Controle-C categoriza instantaneamente, atualiza seu orçamento mensal e sinaliza se você estiver perto do limite.
                            </p>
                            
                            {/* Micro-Interface Interativa de Finanças */}
                            <div className="bg-[#010307]/60 border border-white/[0.06] rounded-xl p-4 space-y-3">
                                <div className="flex items-center justify-between text-xs text-text-dimmed">
                                    <span>Orçamentos do Mês</span>
                                    <span className="text-[#ffa751] text-[10px] font-bold tracking-wide uppercase animate-pulse">● Live Sync</span>
                                </div>
                                {budgetData.map((b, i) => (
                                    <div 
                                        key={i}
                                        onMouseEnter={() => setActiveFinanceCategory(i)}
                                        onMouseLeave={() => setActiveFinanceCategory(null)}
                                        className="space-y-1.5 cursor-pointer group"
                                    >
                                        <div className="flex justify-between text-xs transition-colors group-hover:text-white">
                                            <span className="text-text-muted font-medium group-hover:text-white">{b.category}</span>
                                            <span className="text-text-dimmed group-hover:text-[#ffa751]">
                                                R$ {b.current} <span className="opacity-40">/ R$ {b.max}</span>
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${(b.current / b.max) * 100}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full ${b.color} rounded-full transition-all duration-300 ${activeFinanceCategory === i ? 'brightness-125 shadow-[0_0_10px_rgba(250,167,81,0.5)]' : ''}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        
                        {/* Lado Direito Invisível no Desktop (Para balancear a estrutura alternada) */}
                        <div className="hidden md:block w-[45%]" />
                    </div>

                    {/* Card 2: Agenda */}
                    <div className="relative flex flex-col md:flex-row-reverse items-start md:justify-between mb-24 w-full pl-12 md:pl-0">
                        {/* Ponto de Junção no Trilho */}
                        <motion.div 
                            initial={{ scale: 0.7, borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 0 0px rgba(0,0,0,0)" }}
                            whileInView={{ scale: 1.1, borderColor: "#00f0ff", boxShadow: "0 0 15px rgba(0,240,255,0.4)" }}
                            viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            className="absolute left-[3px] md:left-1/2 top-4 md:-translate-x-1/2 w-6 h-6 rounded-full bg-[#010307] border-2 flex items-center justify-center z-20"
                        >
                            <motion.span 
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                                className="w-2 h-2 rounded-full bg-[#00f0ff]" 
                            />
                        </motion.div>
                        
                        {/* Card Lado Direito */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(15px)" }}
                            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                            transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4 }}
                            className="w-full md:w-[45%] bg-[#010307]/50 backdrop-blur-xl border border-white/[0.08] hover:border-[#00f0ff]/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.06)] rounded-2xl p-6 transition-all duration-500 text-left"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff]">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Compromissos sem Esforço</h3>
                            </div>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">
                                Diga <span className="text-[#00f0ff] font-mono italic bg-[#00f0ff]/5 px-1.5 py-0.5 rounded">"lembrar de ligar para o cliente amanhã às 14h"</span> e o Controle-C agenda diretamente na sua agenda digital. Sem formulários chatos ou aplicativos de gerenciamento complexos.
                            </p>
                            
                            {/* Micro-Interface Interativa de Agenda */}
                            <div className="bg-[#010307]/60 border border-white/[0.06] rounded-xl p-4">
                                <div className="flex items-center justify-between text-xs text-text-dimmed mb-3">
                                    <span>Calendário Jarvis</span>
                                    <span className="text-[#00f0ff] text-[9px] font-bold">Terça-feira, 20 Mai</span>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="flex gap-3 items-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                        <div className="text-[10px] text-text-dimmed font-bold w-10 text-right leading-none">
                                            10:00 <br /><span className="text-[8px] font-normal opacity-50">11:00</span>
                                        </div>
                                        <div className="w-1 h-8 rounded-full bg-[#ffa751]" />
                                        <div className="text-xs">
                                            <p className="font-bold text-white leading-tight">Reunião de Alinhamento</p>
                                            <p className="text-[10px] text-text-dimmed">Sincronizado</p>
                                        </div>
                                    </div>
                                    <motion.div 
                                        whileHover={{ scale: 1.01 }}
                                        className="flex gap-3 items-center p-2 rounded-lg bg-[#00f0ff]/5 border border-[#00f0ff]/15 shadow-[0_0_15px_rgba(0,240,255,0.04)] cursor-pointer group"
                                    >
                                        <div className="text-[10px] text-[#00f0ff] font-bold w-10 text-right leading-none">
                                            14:00 <br /><span className="text-[8px] font-normal opacity-60">14:15</span>
                                        </div>
                                        <div className="w-1 h-8 rounded-full bg-[#00f0ff] animate-pulse" />
                                        <div className="text-xs">
                                            <p className="font-bold text-white group-hover:text-[#00f0ff] transition-colors leading-tight">Ligar para Cliente</p>
                                            <p className="text-[10px] text-[#00f0ff] font-semibold flex items-center gap-1">
                                                <span className="w-1 h-1 rounded-full bg-[#00f0ff] animate-ping" />
                                                Criado via Áudio no WhatsApp
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Lado Esquerdo Invisível no Desktop */}
                        <div className="hidden md:block w-[45%]" />
                    </div>

                    {/* Card 3: Projetos */}
                    <div className="relative flex flex-col md:flex-row items-start md:justify-between mb-24 w-full pl-12 md:pl-0">
                        {/* Ponto de Junção no Trilho */}
                        <motion.div 
                            initial={{ scale: 0.7, borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 0 0px rgba(0,0,0,0)" }}
                            whileInView={{ scale: 1.1, borderColor: "#a855f7", boxShadow: "0 0 15px rgba(168,85,247,0.4)" }}
                            viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            className="absolute left-[3px] md:left-1/2 top-4 md:-translate-x-1/2 w-6 h-6 rounded-full bg-[#010307] border-2 flex items-center justify-center z-20"
                        >
                            <motion.span 
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                                className="w-2 h-2 rounded-full bg-[#a855f7]" 
                            />
                        </motion.div>
                        
                        {/* Card Lado Esquerdo */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(15px)" }}
                            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                            transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4 }}
                            className="w-full md:w-[45%] bg-[#010307]/50 backdrop-blur-xl border border-white/[0.08] hover:border-[#a855f7]/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.06)] rounded-2xl p-6 transition-all duration-500 text-left"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center text-[#a855f7]">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Tarefas e Projetos Integrados</h3>
                            </div>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">
                                Registre pendências, anote insights ou salve links do seu dia. O assistente estrutura suas listas, cria tags para priorizar e lembra você ativamente de concluir as tarefas mais urgentes.
                            </p>
                            
                            {/* Micro-Interface Interativa de Tarefas */}
                            <div className="bg-[#010307]/60 border border-white/[0.06] rounded-xl p-4">
                                <div className="flex items-center justify-between text-xs text-text-dimmed mb-3">
                                    <span>Lista de Tarefas Ativas</span>
                                    <span className="text-[10px] text-[#a855f7]">Clique para marcar</span>
                                </div>
                                <div className="space-y-2">
                                    {tasks.map((task) => (
                                        <div 
                                            key={task.id}
                                            onClick={() => toggleTask(task.id)}
                                            className="flex items-center gap-2.5 p-2 rounded bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] cursor-pointer transition-colors group"
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${task.completed ? 'bg-[#a855f7] border-[#a855f7]' : 'border-white/20 group-hover:border-[#a855f7]'}`}>
                                                {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={`text-xs transition-all ${task.completed ? 'line-through text-text-dimmed opacity-60' : 'text-white'}`}>
                                                {task.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Lado Direito Invisível no Desktop */}
                        <div className="hidden md:block w-[45%]" />
                    </div>

                    {/* Card 4: Hábitos */}
                    <div className="relative flex flex-col md:flex-row-reverse items-start md:justify-between mb-16 w-full pl-12 md:pl-0">
                        {/* Ponto de Junção no Trilho */}
                        <motion.div 
                            initial={{ scale: 0.7, borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 0 0px rgba(0,0,0,0)" }}
                            whileInView={{ scale: 1.1, borderColor: "#f43f5e", boxShadow: "0 0 15px rgba(244,63,94,0.4)" }}
                            viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            className="absolute left-[3px] md:left-1/2 top-4 md:-translate-x-1/2 w-6 h-6 rounded-full bg-[#010307] border-2 flex items-center justify-center z-20"
                        >
                            <motion.span 
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                                className="w-2 h-2 rounded-full bg-[#f43f5e]" 
                            />
                        </motion.div>
                        
                        {/* Card Lado Direito */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(15px)" }}
                            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                            transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4 }}
                            className="w-full md:w-[45%] bg-[#010307]/50 backdrop-blur-xl border border-white/[0.08] hover:border-[#f43f5e]/30 hover:shadow-[0_0_30px_rgba(244,63,94,0.06)] rounded-2xl p-6 transition-all duration-500 text-left"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[#f43f5e]/10 border border-[#f43f5e]/20 flex items-center justify-center text-[#f43f5e]">
                                    <Flame className="w-5 h-5 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Hábitos Consistentes</h3>
                            </div>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">
                                Acompanhe sua disciplina diária. Envie um áudio rápido confirmando o treino ou a leitura do dia e veja seus marcadores de consistência se preencherem instantaneamente, mantendo sua chama ativa.
                            </p>
                            
                            {/* Micro-Interface Interativa de Hábitos */}
                            <div className="bg-[#010307]/60 border border-white/[0.06] rounded-xl p-4">
                                <div className="flex items-center justify-between text-xs text-text-dimmed mb-3">
                                    <span>Streak Semanal de Hábitos</span>
                                    <span className="text-[#f43f5e] font-bold text-[10px] flex items-center gap-0.5">
                                        <Flame className="w-3.5 h-3.5 text-[#f43f5e]" /> 🔥 6 DIAS ATIVOS
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-7 gap-2.5">
                                    {habitDays.map((h, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => toggleHabitDay(i)}
                                            className="flex flex-col items-center gap-1 cursor-pointer group"
                                        >
                                            <span className="text-[9px] text-text-dimmed group-hover:text-white transition-colors">{h.day}</span>
                                            <motion.div 
                                                whileHover={{ scale: 1.1 }}
                                                className={`w-7.5 h-7.5 rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${h.done ? 'bg-[#f43f5e]/10 border-[#f43f5e] text-[#f43f5e] shadow-[0_0_10px_rgba(244,63,94,0.15)]' : 'border-white/10 text-text-dimmed hover:border-[#f43f5e]/50'}`}
                                            >
                                                {h.done ? "🔥" : "✓"}
                                            </motion.div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Lado Esquerdo Invisível no Desktop */}
                        <div className="hidden md:block w-[45%]" />
                    </div>

                </div>
            </section>

            {/* ── SEÇÃO: UM DIA COM O CONTROLE-C (DUAL DEVICE MOCKUP) ── */}
            <section className="relative py-28 z-10 w-full max-w-5xl mx-auto px-6 overflow-hidden">
                {/* Header da Seção */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.97, filter: "blur(12px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-[#00f0ff] mb-4 backdrop-blur-md"
                    >
                        <Sparkle className="w-3.5 h-3.5 text-[#00f0ff]" />
                        <span>💻 Desktop & 📱 Mobile</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(15px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4, delay: 0.15 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 max-w-2xl premium-text-shadow"
                    >
                        No computador ou no celular. O controle é seu.
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 12, scale: 0.99, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -100px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4, delay: 0.3 }}
                        className="text-text-muted text-sm sm:text-base max-w-2xl leading-relaxed"
                    >
                        Use a tela cheia no escritório para planejar sua semana e o aplicativo mobile na rua para registros rápidos de gastos, hábitos e tarefas.
                    </motion.p>
                </div>

                {/* Container do Dual Mockup */}
                <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
                    
                    {/* Glow de fundo extra para dar profundidade de luz */}
                    <div className="absolute -left-12 top-1/4 w-80 h-80 rounded-full bg-[#00f0ff]/5 blur-[120px] pointer-events-none z-0" />
                    <div className="absolute -right-12 bottom-1/4 w-80 h-80 rounded-full bg-[#ffa751]/5 blur-[120px] pointer-events-none z-0" />

                    {/* MOCKUP DESKTOP (LAPTOP) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30, filter: "blur(15px)", scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4 }}
                        className="w-full md:w-[88%] mr-auto relative z-10"
                    >
                        {/* Tela do Laptop */}
                        <div className="bg-[#010307] border border-white/[0.08] rounded-t-2xl shadow-2xl p-2 relative overflow-hidden">
                            {/* Barra Superior do Navegador */}
                            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.05] bg-white/[0.02]">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                                
                                {/* URL Bar */}
                                <div className="flex-1 max-w-sm mx-auto flex items-center justify-center h-5 px-3 rounded bg-white/[0.03] border border-white/[0.04] text-[9px] text-text-dimmed tracking-wider">
                                    <span className="opacity-45">controle-c.com.br</span>
                                </div>
                            </div>
                            
                            {/* Conteúdo da Tela */}
                            <div className="aspect-[1.65] w-full bg-[#030712]/98 relative overflow-hidden">
                                <img 
                                    src="/dashboard_desktop_v2.png" 
                                    alt="Controle-C Desktop Dashboard" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        
                        {/* Base Física do Laptop (Chassis) */}
                        <div className="w-[104%] -ml-[2%] h-3 bg-gradient-to-b from-[#1e293b] to-[#0b0f19] rounded-b-xl border-t border-white/[0.15] relative z-20 shadow-[0_15px_30px_rgba(0,0,0,0.8)]" />
                        <div className="w-[30%] mx-auto h-2 bg-[#080b12] rounded-b-lg relative z-30" />
                    </motion.div>

                    {/* MOCKUP MOBILE (SMARTPHONE COM EFEITO 3D ISOMÉTRICO E HOVER DINÂMICO) */}
                    <motion.div 
                        className="absolute right-4 md:-right-8 bottom-[-40px] w-[32%] z-30 hidden md:block"
                        initial={{ y: 40, opacity: 0, rotateY: -18, rotateX: 10, rotateZ: 3 }}
                        whileInView={{ y: 0, opacity: 1, rotateY: -18, rotateX: 10, rotateZ: 3 }}
                        whileHover={{ y: -8, rotateY: -12, rotateX: 8, rotateZ: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ type: "spring", stiffness: 25, damping: 15, mass: 1.2 }}
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1500px',
                        }}
                    >
                        {/* Chassi do Telefone (Phone Frame) */}
                        <div className="w-full bg-[#010307] rounded-[38px] border-[5px] border-[#1e293b]/90 p-2.5 shadow-[-20px_20px_50px_rgba(0,0,0,0.85)] overflow-hidden relative border-t-white/[0.08] border-l-white/[0.08]">
                            
                            {/* Dynamic Island */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[72px] h-[18px] rounded-full bg-black z-40 border border-white/[0.05] flex items-center justify-end px-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#091530]" />
                            </div>

                            {/* Tela do Telefone */}
                            <div className="rounded-[28px] overflow-hidden bg-[#030712] aspect-[547/767] w-full border border-white/[0.04] relative select-none">
                                <img 
                                    src="/dashboard_mobile_v2.png" 
                                    alt="Controle-C Mobile Dashboard" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* MOCKUP COMPANION COMPATÍVEL COM CELULAR (REVELADO APENAS EM MOBILE) */}
                    <div className="w-[280px] mx-auto mt-8 block md:hidden z-20">
                        {/* Phone Frame */}
                        <div className="w-full bg-[#010307] rounded-[36px] border-[4px] border-[#1e293b]/90 p-2 shadow-2xl relative">
                            
                            {/* Dynamic Island */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-[14px] rounded-full bg-black z-40" />

                            <div className="rounded-[26px] overflow-hidden bg-[#030712] aspect-[547/767] w-full border border-white/[0.04] relative">
                                <img 
                                    src="/dashboard_mobile_v2.png" 
                                    alt="Controle-C Mobile Dashboard" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </section>

            {/* ── SEÇÃO: A PSICOLOGIA DA ORDEM (QUADRO DE ANOTAÇÕES) ── */}
            <section id="psicologia-ordem" className="relative py-20 md:py-24 z-10 w-full max-w-4xl mx-auto px-6 overflow-hidden">
                {/* Glow de fundo sutil para atmosfera de reflexão */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white/[0.01] blur-[120px] pointer-events-none z-0" />

                {/* Header da Seção */}
                <div className="text-center mb-16 flex flex-col items-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.97, filter: "blur(12px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -20px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-[#a855f7] mb-4 backdrop-blur-md"
                    >
                        <Brain className="w-3.5 h-3.5 text-[#a855f7]" />
                        <span>Fricção vs. Liberdade</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(15px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -20px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4, delay: 0.15 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 premium-text-shadow"
                    >
                        O peso do caos. A leveza do controle.
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 12, scale: 0.99, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -20px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4, delay: 0.3 }}
                        className="text-text-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
                    >
                        Uma vida inteira de desorganização consome energia silenciosamente. Veja o contraste de delegar toda a fricção operacional para um sistema tátil.
                    </motion.p>
                </div>

                {/* Grid dos Notepads (Quadro de Anotações) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    
                    {/* NOTEPAD CAOS (Vida sem o Controle-C) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20, rotate: -2, scale: 0.98 }}
                        whileInView={{ opacity: 1, x: 0, rotate: -1.5, scale: 1 }}
                        viewport={{ once: false, margin: "-180px 0px -20px 0px" }}
                        transition={{ type: "spring", stiffness: 25, damping: 16, mass: 1.2 }}
                        whileHover={{ rotate: -0.5, y: -4, transition: { duration: 0.2 } }}
                        className="relative rounded-2xl border border-rose-500/10 bg-gradient-to-b from-[#08090a]/95 to-[#020304]/98 p-6 md:p-8 shadow-[0_15px_30px_rgba(244,63,94,0.02)] overflow-hidden group select-none"
                    >
                        {/* Detalhe de furos de espiral de caderno no topo */}
                        <div className="flex gap-3 justify-center mb-6 pb-5 border-b border-white/[0.04] opacity-40">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div className="w-1.5 h-3 bg-white/[0.12] rounded-full" />
                                    <div className="w-2 h-2 bg-black rounded-full border border-white/[0.08]" />
                                </div>
                            ))}
                        </div>

                        {/* Título do Bloco */}
                        <h3 className="font-display-premium text-2xl md:text-3xl italic text-rose-400 mb-6 text-center">
                            Vida sem o Controle-C
                        </h3>

                        {/* Lista de Sintomas */}
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <span className="w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 select-none">✗</span>
                                <div className="text-left">
                                    <h4 className="text-white text-xs font-bold">Boletos & Finanças</h4>
                                    <p className="text-text-muted text-[11px] mt-0.5 leading-relaxed">Gastos invisíveis e juros surpresa acumulando por preguiça de planilhas.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <span className="w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 select-none">✗</span>
                                <div className="text-left">
                                    <h4 className="text-white text-xs font-bold">Sobrecarga Mental</h4>
                                    <p className="text-text-muted text-[11px] mt-0.5 leading-relaxed">Deitar cansado na cama com a cabeça fervendo, tentando lembrar de tarefas.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <span className="w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 select-none">✗</span>
                                <div className="text-left">
                                    <h4 className="text-white text-xs font-bold">Rotina Reativa</h4>
                                    <p className="text-text-muted text-[11px] mt-0.5 leading-relaxed">Passar o dia inteiro correndo para apagar incêndios e engavetando seus sonhos.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <span className="w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 select-none">✗</span>
                                <div className="text-left">
                                    <h4 className="text-white text-xs font-bold">Hábitos Perdidos</h4>
                                    <p className="text-text-muted text-[11px] mt-0.5 leading-relaxed">Promessas de mudança e treinos que duram no máximo até o dia 5.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* NOTEPAD CONTROLE (Vida com o Controle-C) */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20, rotate: 2, scale: 0.98 }}
                        whileInView={{ opacity: 1, x: 0, rotate: 1.5, scale: 1 }}
                        viewport={{ once: false, margin: "-180px 0px -20px 0px" }}
                        transition={{ type: "spring", stiffness: 25, damping: 16, mass: 1.2 }}
                        whileHover={{ rotate: 0.5, y: -4, transition: { duration: 0.2 } }}
                        className="relative rounded-2xl border border-emerald-500/10 bg-gradient-to-b from-[#08090a]/95 to-[#020304]/98 p-6 md:p-8 shadow-[0_15px_30px_rgba(12,242,205,0.02)] overflow-hidden group select-none"
                    >
                        {/* Glow verde sutil interno no caderno com controle */}
                        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#0cf2cd]/3 blur-[80px] pointer-events-none group-hover:bg-[#0cf2cd]/5 transition-all duration-500" />

                        {/* Detalhe de furos de espiral de caderno no topo */}
                        <div className="flex gap-3 justify-center mb-6 pb-5 border-b border-white/[0.04] opacity-40">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div className="w-1.5 h-3 bg-white/[0.12] rounded-full" />
                                    <div className="w-2 h-2 bg-black rounded-full border border-white/[0.08]" />
                                </div>
                            ))}
                        </div>

                        {/* Título do Bloco */}
                        <h3 className="font-display-premium text-2xl md:text-3xl italic text-[#0cf2cd] mb-6 text-center">
                            Vida com o Controle-C
                        </h3>

                        {/* Lista de Melhorias */}
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <span className="w-5 h-5 rounded-full bg-[#0cf2cd]/15 border border-[#0cf2cd]/25 text-[#0cf2cd] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 select-none">✓</span>
                                <div className="text-left">
                                    <h4 className="text-white text-xs font-bold">Finanças Organizadas</h4>
                                    <p className="text-text-muted text-[11px] mt-0.5 leading-relaxed">Controle total de suas despesas e orçamentos diários de forma automática, prática e 100% livre de planilhas complexas.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <span className="w-5 h-5 rounded-full bg-[#0cf2cd]/15 border border-[#0cf2cd]/25 text-[#0cf2cd] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 select-none">✓</span>
                                <div className="text-left">
                                    <h4 className="text-white text-xs font-bold">Mente 100% Livre</h4>
                                    <p className="text-text-muted text-[11px] mt-0.5 leading-relaxed">A paz de dormir sabendo que tudo está anotado e processado pelo Controle-C.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <span className="w-5 h-5 rounded-full bg-[#0cf2cd]/15 border border-[#0cf2cd]/25 text-[#0cf2cd] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 select-none">✓</span>
                                <div className="text-left">
                                    <h4 className="text-white text-xs font-bold">Foco no Essencial</h4>
                                    <p className="text-text-muted text-[11px] mt-0.5 leading-relaxed">Suas prioridades reais e seus planos futuros no centro da sua rotina.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <span className="w-5 h-5 rounded-full bg-[#0cf2cd]/15 border border-[#0cf2cd]/25 text-[#0cf2cd] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 select-none">✓</span>
                                <div className="text-left">
                                    <h4 className="text-white text-xs font-bold">Hábitos que Colam</h4>
                                    <p className="text-text-muted text-[11px] mt-0.5 leading-relaxed">Consistência diária reforçada por lembretes leves e streaks visíveis de orgulho.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* ── ESTILOS DE ANIMAÇÃO CIBERNÉTICA INLINE ── */}
            <style>{`
                @keyframes bounce-voice {
                    0%, 100% { height: 4px; }
                    50% { height: 18px; }
                }
                .voice-bar {
                    animation: bounce-voice 1.2s ease-in-out infinite;
                }
                .voice-bar:nth-child(2) { animation-delay: 0.15s; }
                .voice-bar:nth-child(3) { animation-delay: 0.3s; }
                .voice-bar:nth-child(4) { animation-delay: 0.45s; }
                .voice-bar:nth-child(5) { animation-delay: 0.6s; }

                @keyframes wiggle-bell {
                    0%, 100% { transform: rotate(0deg); }
                    15% { transform: rotate(8deg); }
                    30% { transform: rotate(-8deg); }
                    45% { transform: rotate(6deg); }
                    60% { transform: rotate(-6deg); }
                    75% { transform: rotate(3deg); }
                    90% { transform: rotate(-3deg); }
                }
                .wiggle-bell-animation {
                    animation: wiggle-bell 1.5s ease-in-out infinite;
                }

                .shine-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -150%;
                    width: 60%; height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
                    transform: skewX(-25deg);
                    transition: 0.8s ease;
                }
                .shine-card:hover::before {
                    left: 150%;
                }

                @keyframes shine-btn-sweep {
                    0% { left: -100%; }
                    100% { left: 200%; }
                }
                .animate-shine-btn {
                    position: relative;
                    overflow: hidden;
                }
                .animate-shine-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 50%; height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent);
                    transform: skewX(-25deg);
                    pointer-events: none;
                    z-index: 1;
                }
                .animate-shine-btn:hover::before {
                    animation: shine-btn-sweep 0.85s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>

            {/* ── SEÇÃO: PASSE LIVRE PARA O CONTROLE (PORTAL DE ACESSO HOLOGRÁFICO) ── */}
            <section id="precos" className="relative py-24 md:py-28 z-10 w-full max-w-5xl mx-auto px-6 overflow-hidden">
                {/* Atmosfera de Luz de Fundo (Tech Space Glows) */}
                <div className="absolute right-[-10%] top-1/4 w-[400px] h-[400px] rounded-full bg-[#0cf2cd]/4 blur-[130px] pointer-events-none z-0" />
                <div className="absolute left-[-10%] bottom-1/4 w-[400px] h-[400px] rounded-full bg-[#8b5cf6]/4 blur-[130px] pointer-events-none z-0" />

                {/* ── HEADER DA SEÇÃO CENTRALIZADO NO TOPO ── */}
                <div className="text-center mb-16 flex flex-col items-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.97, filter: "blur(12px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -20px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-[#0cf2cd] mb-4 backdrop-blur-md"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[#0cf2cd]" />
                        <span>Controle Absoluto · Acesso Controle-C Anual</span>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(15px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -20px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4, delay: 0.15 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 premium-text-shadow font-body-jakarta"
                    >
                        Sua rotina. Redesenhada.
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 12, scale: 0.99, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-180px 0px -20px 0px" }}
                        transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4, delay: 0.3 }}
                        className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
                    >
                        O Controle-C não é apenas mais um aplicativo de tarefas. É um sistema completo e invisível que trabalha para você a partir do seu WhatsApp. Escolha o seu passe de acesso abaixo.
                    </motion.p>
                </div>

                {/* Grid Lateral Lado a Lado (12 colunas no desktop) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10 w-full">
                    
                    {/* COLUNA ESQUERDA: LISTA PREMIUM DE VANTAGENS (7/12) */}
                    <div className="lg:col-span-7 flex flex-col gap-6 text-left w-full h-full justify-center">
                        {/* Lista Premium e Minimalista de 8 Benefícios Exclusivos (2 Colunas) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 w-full pr-0 lg:pr-4">
                            
                            {[
                                {
                                    highlight: "Controle de Finanças por Áudio",
                                    desc: "Envie áudios rápidos de 3 segundos no WhatsApp para registrar gastos e despesas em débito, crédito ou dinheiro instantaneamente."
                                },
                                {
                                    highlight: "Planejamento Financeiro Ativo",
                                    desc: "Defina limites mensais de gastos e orçamentos por categorias inteligentes para economizar sem tocar em uma única planilha."
                                },
                                {
                                    highlight: "Lembrete Inteligente de Contas",
                                    desc: "Chega de juros. O Controle-C monitora e lembra você ativamente antes do vencimento dos seus boletos e despesas recorrentes."
                                },
                                {
                                    highlight: "Listas de Tarefas por Projetos",
                                    desc: "Crie listas temáticas, priorize suas tarefas diárias e organize fluxos de trabalho diretamente pelo chat."
                                },
                                {
                                    highlight: "Rastreador de Hábitos & Streaks",
                                    desc: "Consolide sua rotina de exercícios, leitura ou estudos com streaks visuais de progresso (🔥) e lembretes diários leves."
                                },
                                {
                                    highlight: "Sincronização com Google Agenda",
                                    desc: "Seus compromissos criados no WhatsApp entram automaticamente e em tempo real no seu calendário oficial da Google."
                                },
                                {
                                    highlight: "Painel Web 360° Exclusivo",
                                    desc: "Acesse uma interface web espetacular, limpa e responsiva para ver toda a sua vida organizada de forma consolidada."
                                },
                                {
                                    highlight: "Toda a sua Vida Organizada",
                                    desc: "Centralize finanças, compromissos, tarefas e hábitos em um único ecossistema invisível, prático e livre de fricção."
                                }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 15, scale: 0.97, filter: "blur(10px)" }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                    viewport={{ once: false, margin: "-180px 0px -20px 0px" }}
                                    transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4, delay: 0.15 + idx * 0.04 }}
                                    className="flex items-start gap-3.5 py-3 border-b border-white/[0.03] transition-all hover:border-[#0cf2cd]/15 group cursor-default"
                                >
                                    <span className="w-5 h-5 rounded-full bg-[#0cf2cd]/8 border border-[#0cf2cd]/20 text-[#0cf2cd] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#0cf2cd]/15 group-hover:border-[#0cf2cd]/40 transition-all select-none">
                                        ✓
                                    </span>
                                    <div className="text-left leading-tight">
                                        <span className="text-white text-xs sm:text-sm font-extrabold tracking-tight group-hover:text-[#0cf2cd] transition-colors duration-200">
                                            {item.highlight}
                                        </span>
                                        <p className="text-text-muted text-[10.5px] sm:text-xs leading-relaxed mt-1 group-hover:text-text-dimmed transition-colors duration-200">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                        </div>
                    </div>

                    {/* COLUNA DIREITA: O PASSE DE ACESSO HOLOGRÁFICO 3D (5/12) */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center w-full h-full relative">
                        {/* Glow rotativo de fundo exclusivo para o card de checkout */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#0cf2cd]/4 blur-[100px] pointer-events-none z-0" />
                        
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(15px)" }}
                            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            viewport={{ once: false, margin: "-180px 0px -20px 0px" }}
                            transition={{ type: "spring", stiffness: 15, damping: 13, mass: 1.4, delay: 0.35 }}
                            className="w-full flex justify-center z-10"
                        >
                            <div
                                className="w-full max-w-[350px] rounded-3xl border border-[#0cf2cd]/20 bg-gradient-to-b from-[#0a0f18]/95 to-[#030712]/98 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(12,242,205,0.06)] relative overflow-hidden flex flex-col justify-between group shine-card select-none border-t-white/[0.08] z-10"
                            >
                                {/* Glow de destaque interno metálico */}
                                <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-[#0cf2cd]/6 blur-[80px] pointer-events-none" />

                                {/* Tag de Acesso e Versão */}
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.04] relative z-10">
                                    <span className="text-[9px] text-[#0cf2cd] font-bold uppercase tracking-wider bg-[#0cf2cd]/8 px-2.5 py-1 rounded-full border border-[#0cf2cd]/20 animate-pulse">
                                        {billingPeriod === 'annual' ? 'LICENÇA ANUAL COMPLETA' : 'ASSINATURA MENSAL'}
                                    </span>
                                    <span className="text-[10px] text-text-dimmed font-bold tracking-widest uppercase opacity-60">CONTROLE-C V2.0</span>
                                </div>

                                {/* Seletor de Planos (Mensal vs Anual) */}
                                <div className="relative z-10 mb-8 w-full p-1 bg-white/[0.01] border border-white/[0.06] rounded-xl flex items-center justify-between backdrop-blur-md">
                                    <button
                                        onClick={() => setBillingPeriod('monthly')}
                                        className={`flex-1 py-2 px-3 text-center rounded-lg text-xs font-bold transition-all duration-300 ${billingPeriod === 'monthly' ? 'bg-[#0cf2cd] text-black shadow-[0_0_15px_rgba(12,242,205,0.25)]' : 'text-text-muted hover:text-white'}`}
                                    >
                                        Mensal
                                    </button>
                                    <button
                                        onClick={() => setBillingPeriod('annual')}
                                        className={`flex-1 py-2 px-3 text-center rounded-lg text-xs font-bold transition-all duration-300 relative ${billingPeriod === 'annual' ? 'bg-[#0cf2cd] text-black shadow-[0_0_15px_rgba(12,242,205,0.25)]' : 'text-text-muted hover:text-white'}`}
                                    >
                                        Anual
                                        <span className="absolute -top-2.5 -right-1 bg-purple-600 text-white text-[7.5px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                            37% OFF
                                        </span>
                                    </button>
                                </div>

                                {/* Preços com Tipografia Monumental de Clímax */}
                                <div className="text-left mb-6 relative z-10">
                                    {billingPeriod === 'annual' ? (
                                        <>
                                            <p className="text-[10px] text-text-muted/60 line-through font-semibold tracking-wide uppercase mb-1">De R$ 99,90/mês</p>
                                            <p className="text-[11px] text-text-dimmed font-bold uppercase tracking-wider mb-2.5">Por apenas</p>
                                            
                                            <div className="flex flex-col relative leading-none">
                                                {/* Giant elegant Serif display block for numbers */}
                                                <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter premium-text-shadow font-display">
                                                    12x <span className="text-[26px] sm:text-[34px] font-extrabold tracking-normal">R$</span> 61,69
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-[#0cf2cd] font-semibold mt-3 select-none uppercase tracking-wider">Ou R$ 600,00 à vista (Economize 37%)</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[10px] text-text-muted/60 line-through font-semibold tracking-wide uppercase mb-1 opacity-0">De R$ 99,90/mês</p>
                                            <p className="text-[11px] text-text-dimmed font-bold uppercase tracking-wider mb-2.5">Por apenas</p>
                                            
                                            <div className="flex flex-col relative leading-none">
                                                {/* Giant elegant Serif display block for numbers */}
                                                <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter premium-text-shadow font-display">
                                                    <span className="text-[26px] sm:text-[34px] font-extrabold tracking-normal">R$</span> 80,00<span className="text-xs text-text-muted tracking-normal font-medium"> /mês</span>
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-[#0cf2cd] font-semibold mt-3 select-none uppercase tracking-wider">Sem fidelidade · Cancele quando quiser</p>
                                        </>
                                    )}
                                </div>

                                <p className="text-text-muted text-[10.5px] leading-relaxed text-left mb-8 relative z-10 border-l border-white/[0.08] pl-3 italic">
                                    {billingPeriod === 'annual' 
                                        ? "Equivale a míseros R$ 1,66 por dia. Menos que um único café expresso por semana para colocar a sua mente no controle absoluto."
                                        : "Equivale a R$ 2,66 por dia. Menos que um refrigerante por semana para colocar toda a sua vida organizada de forma imediata."
                                    }
                                </p>

                                {/* Botão de Ignição e Disparo Cibernético (CTA Máximo) */}
                                <div className="relative z-10 w-full mb-6">
                                    <motion.a 
                                        href={billingPeriod === 'annual' ? "https://pay.zouti.com.br/checkout?product_offer_id=prod_offer_ydek6nmp28nqr06wkqifds" : "https://pay.zouti.com.br/checkout?product_offer_id=prod_offer_ynkqy38q0c15pcg9sgvz1u"}
                                        whileHover={{ scale: 1.025, y: -1.5 }}
                                        whileTap={{ scale: 0.985 }}
                                        className="animate-shine-btn bg-gradient-to-r from-[#0cf2cd] via-[#00f5d4] to-[#01c7b7] text-black font-black text-[11px] sm:text-xs md:text-[13px] tracking-widest uppercase flex items-center justify-center gap-2.5 rounded-2xl py-4 sm:py-4.5 px-6 w-full text-center transition-all duration-500 shadow-[0_0_20px_rgba(12,242,205,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(12,242,205,0.5),inset_0_1px_1px_rgba(255,255,255,0.5)] cursor-pointer border border-white/20 group"
                                    >
                                        <span className="relative z-10">Quero organizar minha vida agora</span>
                                        <ArrowRight className="w-4 h-4 text-black flex-shrink-0 stroke-[3] group-hover:translate-x-1.5 transition-transform duration-300 relative z-10" />
                                    </motion.a>
                                </div>

                                {/* Selos de Segurança e Confiança Premium */}
                                <div className="space-y-2.5 border-t border-white/[0.04] pt-5 relative z-10 text-left">
                                    <div className="flex items-center gap-2.5 text-text-dimmed text-[9.5px] font-semibold">
                                        <span className="text-[#0cf2cd]">✓</span>
                                        <span>Garantia de Satisfação de 7 dias</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-text-dimmed text-[9.5px] font-semibold">
                                        <span className="text-[#0cf2cd]">✓</span>
                                        <span>Acesso imediato e direto no seu WhatsApp</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-text-dimmed text-[9.5px] font-semibold">
                                        <span className="text-[#0cf2cd]">✓</span>
                                        <span>Dados 100% criptografados e seguros</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* ── VIDEO DEMO MODAL ────────────────── */}
            <AnimatePresence>
                {showDemoModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg"
                        onClick={() => setShowDemoModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative w-full max-w-4xl bg-[#010307]/80 border border-white/[0.1] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(12,242,205,0.15)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header with Title and Close Button */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.01]">
                                <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse" />
                                    Vídeo Demonstrativo - Controle-C
                                </h3>
                                <button
                                    onClick={() => setShowDemoModal(false)}
                                    className="p-1.5 rounded-full bg-white/5 border border-white/[0.08] text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Video Container (aspect-video) */}
                            <div className="aspect-video w-full bg-black">
                                <iframe
                                    src="https://www.youtube.com/embed/GbvdjrKxfBc?autoplay=1&rel=0&modestbranding=1&color=white"
                                    title="Controle-C Demo Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full border-0"
                                ></iframe>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default LandingPage;
