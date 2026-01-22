import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import './LandingPage.css'

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
    const [currentFrame, setCurrentFrame] = useState(1)

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

    // Animation Choreography for 6 Slides
    // Ranges:
    // 1. Hero: 0 - 0.12
    // 2. Question 1: 0.16 - 0.28
    // 3. Question 2: 0.32 - 0.44
    // 4. Question 3: 0.48 - 0.60
    // 5. Solution/Intro: 0.64 - 0.76
    // 6. Final/Jarvis: 0.80 - 0.95

    // Slide 1: Hero
    const op1 = useTransform(scrollYProgress, [0, 0.12, 0.16], [1, 1, 0])
    const y1 = useTransform(scrollYProgress, [0, 0.16], [0, -50])

    // Slide 2: Aniversário
    const op2 = useTransform(scrollYProgress, [0.12, 0.16, 0.28, 0.32], [0, 1, 1, 0])
    const y2 = useTransform(scrollYProgress, [0.12, 0.28], [50, -50])

    // Slide 3: Contas
    const op3 = useTransform(scrollYProgress, [0.28, 0.32, 0.44, 0.48], [0, 1, 1, 0])
    const y3 = useTransform(scrollYProgress, [0.28, 0.44], [50, -50])

    // Slide 4: Reunião
    const op4 = useTransform(scrollYProgress, [0.44, 0.48, 0.60, 0.64], [0, 1, 1, 0])
    const y4 = useTransform(scrollYProgress, [0.44, 0.60], [50, -50])

    // Slide 5: Automático
    const op5 = useTransform(scrollYProgress, [0.60, 0.64, 0.76, 0.80], [0, 1, 1, 0])
    const y5 = useTransform(scrollYProgress, [0.60, 0.76], [50, -50])

    // Slide 6: Jarvis (Final)
    const op6 = useTransform(scrollYProgress, [0.76, 0.80, 0.85, 0.89], [0, 1, 1, 0])
    const y6 = useTransform(scrollYProgress, [0.76, 0.85], [50, 0])

    // Slide 7: Final Impact
    const op7 = useTransform(scrollYProgress, [0.90, 0.93, 0.98, 1], [0, 1, 1, 0])
    const y7 = useTransform(scrollYProgress, [0.90, 0.93], [50, 0])


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
            <div ref={containerRef} className="scroll-sequence-container" style={{ height: '900vh' }}>
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

            <div className="post-scroll-content" style={{ position: 'relative', zIndex: 30, marginTop: '-100vh', background: 'var(--bg-darker)', minHeight: '100vh', padding: '100px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>

                    <p style={{ marginTop: '20px', color: '#cbd5e1' }}>Continue rolando para ver todas as funcionalidades.</p>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
