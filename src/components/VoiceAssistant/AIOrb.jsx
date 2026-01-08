import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './AIOrb.css'

const AIOrb = ({ state, audioLevel = 0 }) => {
    const [particles, setParticles] = useState([])

    useEffect(() => {
        const particleArray = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            angle: (i * 360) / 20,
            delay: i * 0.05
        }))
        setParticles(particleArray)
    }, [])

    const getOrbVariants = () => {
        switch (state) {
            case 'IDLE':
                return {
                    scale: [1, 1.05, 1],
                    opacity: [0.6, 0.8, 0.6],
                    transition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }
            case 'LISTENING':
                return {
                    scale: 1 + (audioLevel * 0.3),
                    opacity: 0.9,
                    transition: {
                        duration: 0.1,
                        ease: "easeOut"
                    }
                }
            case 'THINKING':
                return {
                    scale: [1, 1.1, 1],
                    rotate: [0, 360],
                    opacity: [0.7, 1, 0.7],
                    transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }
                }
            case 'SPEAKING':
                return {
                    scale: [1, 1.15, 1],
                    opacity: [0.8, 1, 0.8],
                    transition: {
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }
            default:
                return {}
        }
    }

    const getGradientColors = () => {
        switch (state) {
            case 'IDLE':
                return 'from-blue-500/20 via-purple-500/20 to-pink-500/20'
            case 'LISTENING':
                return 'from-green-500/40 via-emerald-500/40 to-teal-500/40'
            case 'THINKING':
                return 'from-yellow-500/40 via-orange-500/40 to-red-500/40'
            case 'SPEAKING':
                return 'from-purple-500/40 via-pink-500/40 to-blue-500/40'
            default:
                return 'from-blue-500/20 via-purple-500/20 to-pink-500/20'
        }
    }

    return (
        <div className="orb-container">
            {/* Particles orbiting */}
            <div className="particles-container">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="particle"
                        animate={{
                            rotate: state === 'THINKING' ? [0, 360] : 0,
                            scale: state === 'LISTENING' ? [1, 1.5, 1] : 1,
                        }}
                        transition={{
                            rotate: {
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                                delay: particle.delay
                            },
                            scale: {
                                duration: 0.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: particle.delay
                            }
                        }}
                        style={{
                            transform: `rotate(${particle.angle}deg) translateX(150px)`
                        }}
                    />
                ))}
            </div>

            {/* Main Orb */}
            <motion.div
                className={`ai-orb bg-gradient-to-br ${getGradientColors()}`}
                animate={getOrbVariants()}
            >
                {/* Inner glow layers */}
                <motion.div
                    className="orb-glow-1"
                    animate={{
                        scale: state === 'LISTENING' ? [1, 1.2, 1] : [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="orb-glow-2"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                />

                {/* Center core */}
                <motion.div
                    className="orb-core"
                    animate={{
                        scale: state === 'LISTENING' ? [1, 1.2, 1] : [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>

            {/* Rings */}
            {state !== 'IDLE' && (
                <>
                    <motion.div
                        className="orb-ring ring-1"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.8, 1.5],
                            opacity: [0.6, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                    />
                    <motion.div
                        className="orb-ring ring-2"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.8, 1.5],
                            opacity: [0.6, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.5
                        }}
                    />
                </>
            )}
        </div>
    )
}

export default AIOrb
