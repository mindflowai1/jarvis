import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import './LandingPage.css'
import Navbar from './Navbar'

const totalFrames = 80

// Sub-component for the Sticky Background
const StickyBackground = ({ currentFrame }) => {
    const getFramePath = (index) => {
        const safeIndex = Math.max(1, Math.min(index, totalFrames))
        const frameNumber = safeIndex.toString().padStart(3, '0')
        return `/img-bg-jarvis/ezgif-frame-${frameNumber}.jpg`
    }

    return (
        <div className="sticky-content">
            <div className="background-image-wrapper">
                <img
                    src={getFramePath(currentFrame)}
                    alt="Background Animation"
                    className="sequence-image"
                />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', pointerEvents: 'none' }} />
        </div>
    )
}

// Generic component for all slides to ensure consistent design
const StorySlide = ({ opacity, y, title, subtitle, cta, isFirstSlide }) => (
    <motion.div className="glass-container" style={{ opacity, y, position: 'absolute' }}>
        {isFirstSlide && (
            <div className="hero-badge">
                <span className="sparkle">✨</span> v2.0 Agora com IA Integrada
            </div>
        )}
        <h1 className="glass-title" dangerouslySetInnerHTML={{ __html: title }}></h1>
        {subtitle && <p className="glass-subtitle" dangerouslySetInnerHTML={{ __html: subtitle }}></p>}
        {cta && (
            <div className="cta-group">
                <button className="btn-primary">Começar Agora</button>
                <button className="btn-secondary">Ver Demo</button>
            </div>
        )}
    </motion.div>
)

const LandingPage = () => {
    const containerRef = useRef(null)
    const nextSectionRef = useRef(null)
    const [currentFrame, setCurrentFrame] = useState(1)
    const [hasAutoScrolled, setHasAutoScrolled] = useState(false)

    // Increased height for 6 slides
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const frameIndex = useTransform(scrollYProgress, [0, 1], [1, totalFrames])

    useMotionValueEvent(frameIndex, "change", (latest) => {
        const frame = Math.round(latest)
        if (frame !== currentFrame && frame >= 1 && frame <= totalFrames) {
            setCurrentFrame(frame)
        }
    })

    // Auto-scroll para próxima seção quando último slide desaparecer
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Quando passar de 0.96 (último slide sumiu), rola automaticamente
        if (latest > 0.96 && !hasAutoScrolled && nextSectionRef.current) {
            setHasAutoScrolled(true)

            // Scroll customizado mais lento e suave
            const rect = nextSectionRef.current.getBoundingClientRect()
            const targetPosition = rect.top + window.pageYOffset
            const startPosition = window.pageYOffset
            const distance = targetPosition - startPosition
            const duration = 1500 // 1.5 segundos (mais lento)
            let start = null

            const smoothScroll = (currentTime) => {
                if (start === null) start = currentTime
                const timeElapsed = currentTime - start
                const progress = Math.min(timeElapsed / duration, 1)

                // Easing function para suavidade (easeInOutCubic)
                const ease = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2

                window.scrollTo(0, startPosition + distance * ease)

                if (timeElapsed < duration) {
                    requestAnimationFrame(smoothScroll)
                }
            }

            requestAnimationFrame(smoothScroll)

            // Reset após 2 segundos para permitir scroll manual de volta
            setTimeout(() => setHasAutoScrolled(false), 2000)
        }
    })

    // Animation Choreography for 6 Slides
    // Ranges ajustados para transição fluida sem espaço vazio
    // 1. Hero: 0 - 0.14
    // 2. Question 1: 0.14 - 0.28
    // 3. Question 2: 0.28 - 0.42
    // 4. Question 3: 0.42 - 0.56
    // 5. Solution/Intro: 0.56 - 0.70
    // 6. Final/Jarvis: 0.70 - 0.95

    // Slide 1: Hero
    const op1 = useTransform(scrollYProgress, [0, 0.12, 0.14], [1, 1, 0])
    const y1 = useTransform(scrollYProgress, [0, 0.14], [0, -50])

    // Slide 2: Fim do Mês
    const op2 = useTransform(scrollYProgress, [0.12, 0.14, 0.26, 0.28], [0, 1, 1, 0])
    const y2 = useTransform(scrollYProgress, [0.12, 0.26], [50, -50])

    // Slide 3: HD
    const op3 = useTransform(scrollYProgress, [0.26, 0.28, 0.40, 0.42], [0, 1, 1, 0])
    const y3 = useTransform(scrollYProgress, [0.26, 0.40], [50, -50])

    // Slide 4: Compromissos
    const op4 = useTransform(scrollYProgress, [0.40, 0.42, 0.54, 0.56], [0, 1, 1, 0])
    const y4 = useTransform(scrollYProgress, [0.40, 0.54], [50, -50])

    // Slide 5: Automático
    const op5 = useTransform(scrollYProgress, [0.54, 0.56, 0.68, 0.70], [0, 1, 1, 0])
    const y5 = useTransform(scrollYProgress, [0.54, 0.68], [50, -50])

    // Slide 6: Jarvis (Final) - termina em 0.95 para transição suave
    const op6 = useTransform(scrollYProgress, [0.68, 0.70, 0.92, 0.95], [0, 1, 1, 0])
    const y6 = useTransform(scrollYProgress, [0.68, 0.92], [50, 0])


    // Preload images
    useEffect(() => {
        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image()
            const frameNumber = i.toString().padStart(3, '0')
            img.src = `/img-bg-jarvis/ezgif-frame-${frameNumber}.jpg`
        }
    }, [])



    return (
        <div className="landing-page">
            <Navbar />
            <div ref={containerRef} className="scroll-sequence-container" style={{ height: '700vh' }}>
                <StickyBackground currentFrame={currentFrame} />

                <div className="hero-content" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    {/* Slide 1 */}
                    <StorySlide
                        opacity={op1}
                        y={y1}
                        isFirstSlide={true}
                        title="SEU TEMPO É <span class='highlight'>PRECIOSO DEMAIS</span><br />PARA SE PREOCUPAR COM O <span class='highlight'>BÁSICO</span>."
                        subtitle="Jarvis unifica calendário, finanças e tarefas com IA.<br />WhatsApp automático. Zero configuração. Tudo sincronizado."
                        cta={true}
                    />

                    {/* Slide 2 */}
                    <StorySlide
                        opacity={op2}
                        y={y2}
                        title="O <span class='highlight'>FIM DO MÊS</span> CHEGOU."
                        subtitle="E você não faz ideia de onde foi o dinheiro. <span class='highlight'>De novo</span>."
                    />

                    {/* Slide 3 */}
                    <StorySlide
                        opacity={op3}
                        y={y3}
                        title="SUA CABEÇA NÃO É UM <span class='highlight'>HD</span>."
                        subtitle="Pare de tentar <span class='highlight'>lembrar de tudo</span>. Você tem coisas mais importantes pra pensar."
                    />

                    {/* Slide 4 */}
                    <StorySlide
                        opacity={op4}
                        y={y4}
                        title="QUANTOS COMPROMISSOS VOCÊ TEM <span class='highlight'>AMANHÃ</span>?"
                        subtitle="Se não souber de cabeça, você <span class='highlight'>já está atrasado</span> pra algum deles."
                    />

                    {/* Slide 5 */}
                    <StorySlide
                        opacity={op5}
                        y={y5}
                        title="E SE TUDO ISSO FOSSE <span class='highlight'>AUTOMÁTICO</span>?"
                        subtitle="Imagine um assistente que trabalha por você 24 horas por dia. <span class='highlight'>DIRETAMENTE EM SEU WHATSAPP</span>."
                    />

                    {/* Slide 6 */}
                    <StorySlide
                        opacity={op6}
                        y={y6}
                        title="CONHEÇA O <span class='highlight'>JARVIS</span>."
                        subtitle="Seu assistente pessoal <span class='highlight'>360</span>.<br />Finanças, Agenda e Lembretes em um só lugar."
                    />



                </div>
            </div>

            <div className="post-scroll-content">
                {/* Seção de Transição - Âncora para auto-scroll */}
                <section ref={nextSectionRef} className="transition-section">
                    <div className="particles-container">
                        {/* Partículas serão geradas via CSS/JS se necessário, ou usar um background animado */}
                        <div className="particle p1"></div>
                        <div className="particle p2"></div>
                        <div className="particle p3"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="transition-content"
                    >
                        <motion.h2 className="glitch-title" data-text="A BAGUNÇA MENTAL ACABA AQUI.">
                            A BAGUNÇA MENTAL<br />ACABA AQUI.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="transition-subtitle"
                        >
                            Você tem <span className="highlight-text">15 abas abertas</span>, 3 apps de notas e ainda esqueceu de pagar aquele boleto.
                            <br />A culpa não é sua. O sistema atual está quebrado.
                        </motion.p>
                    </motion.div>
                </section>

                {/* Seção 2: O Problema - Fragmentação Cognitiva */}
                <section className="problem-section">
                    <div className="problem-header">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="section-title"
                        >
                            SUA VIDA ESTÁ <span className="highlight-text-red">FRAGMENTADA</span>.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="section-subtitle"
                        >
                            Você tem aplicativos demais e controle de menos. O Jarvis unifica tudo no único lugar que você já olha 200 vezes por dia.
                        </motion.p>
                    </div>

                    <div className="bento-grid-deconstructed">
                        {/* Card 1: WhatsApp Chaos */}
                        <motion.div
                            className="bento-card card-whatsapp"
                            initial={{ x: -100, opacity: 0, rotate: -5 }}
                            whileInView={{ x: 0, opacity: 1, rotate: -5 }}
                            transition={{ duration: 0.8 }}
                            whileHover={{ scale: 1.05, rotate: 0 }}
                        >
                            <div className="card-icon whats-icon">💬</div>
                            <div className="card-badge">99+</div>
                            <div className="card-content">
                                <span>Mãe: Cobrança...</span>
                                <span>Chefe: Reunião...</span>
                                <span>Grupo: Boleto...</span>
                            </div>
                        </motion.div>

                        {/* Card 2: Spreadsheet Hell */}
                        <motion.div
                            className="bento-card card-sheet"
                            initial={{ y: 100, opacity: 0, rotate: 3 }}
                            whileInView={{ y: 0, opacity: 1, rotate: 3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            whileHover={{ scale: 1.05, rotate: 0 }}
                        >
                            <div className="sheet-header">
                                <div className="sheet-cell active">ERRO</div>
                                <div className="sheet-cell">#REF!</div>
                            </div>
                            <div className="sheet-grid">
                                <div className="sheet-row"></div>
                                <div className="sheet-row"></div>
                                <div className="sheet-row"></div>
                            </div>
                            <div className="floating-label">Onde foi meu salário?</div>
                        </motion.div>

                        {/* Card 3: Notification Stress */}
                        <motion.div
                            className="bento-card card-notify"
                            initial={{ x: 100, opacity: 0, rotate: 10 }}
                            whileInView={{ x: 0, opacity: 1, rotate: 10 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            whileHover={{ scale: 1.05, rotate: 0 }}
                        >
                            <div className="notify-header">
                                <span>⚠️ Nubank</span>
                                <span className="time">Agora</span>
                            </div>
                            <div className="notify-body">
                                <b>Fatura Vencida</b>
                                <p>Sua fatura de R$ 3.420 venceu ontem. Juros aplicados.</p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Seção 3: A Solução - WhatsApp Core */}
                <section className="solution-section">
                    <div className="solution-container">
                        <div className="solution-text">
                            <motion.h2
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                TÃO <span className="highlight-text-blue">SIMPLES</span> QUANTO<br />MANDAR UM ÁUDIO.
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                Zero curva de aprendizado. Se você sabe usar o WhatsApp, você já é um expert no Jarvis.
                                <br /><br />
                                Chega de baixar apps novos que você nunca abre. O Jarvis vive onde você já está.
                            </motion.p>
                            <motion.button
                                className="btn-whatsapp-large"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Testar Demo no WhatsApp →
                            </motion.button>
                        </div>

                        <div className="solution-visual">
                            <div className="iphone-mockup-giant">
                                <div className="iphone-notch"></div>
                                <div className="iphone-screen">
                                    <div className="chat-header-modern">
                                        <div className="avatar-circle">J</div>
                                        <div className="header-info">
                                            <span className="name">Jarvis AI</span>
                                            <span className="status">Online</span>
                                        </div>
                                    </div>
                                    <div className="chat-body-scroll">
                                        <motion.div className="msg-row sent"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <div className="bubble">Gastei 50 no uber</div>
                                        </motion.div>
                                        <motion.div className="msg-row received"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 1.0 }}
                                        >
                                            <div className="bubble">
                                                ✅ <b>Anotado!</b><br />
                                                Categoria: 🚗 Transporte<br />
                                                Orçamento Restante: R$ 200,00
                                            </div>
                                        </motion.div>

                                        <div className="time-divider">Hoje</div>

                                        <motion.div className="msg-row sent audio"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 2.5 }}
                                        >
                                            <div className="bubble audio-bubble">
                                                <div className="play-icon">▶</div>
                                                <div className="waveform">||||||||||||||</div>
                                                <div className="duration">0:04</div>
                                            </div>
                                            <span className="transcription">"Lembrete dentista amanhã 14h"</span>
                                        </motion.div>

                                        <motion.div className="msg-row received"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 3.5 }}
                                        >
                                            <div className="bubble">
                                                📅 <b>Agendado.</b><br />
                                                "Dentista" - Amanhã às 14:00.<br />
                                                Te aviso 1 hora antes.
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div className="chat-input-fake">
                                        <div className="plus-icon">+</div>
                                        <div className="input-bar"></div>
                                        <div className="mic-icon">🎙️</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}

export default LandingPage
