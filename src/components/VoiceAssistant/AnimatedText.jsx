import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './AnimatedText.css'

const AnimatedText = ({ text, isPlaying, speed = 1.1 }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(-1)
    const words = text.split(' ')
    
    useEffect(() => {
        if (!isPlaying) {
            setCurrentWordIndex(-1)
            return
        }
        
        // Calcular tempo por palavra baseado na velocidade do TTS
        // OpenAI TTS fala ~150 palavras/minuto no speed 1.0
        const baseWordsPerMinute = 150 * speed
        const msPerWord = (60 / baseWordsPerMinute) * 1000
        
        let currentIndex = 0
        setCurrentWordIndex(0)
        
        const interval = setInterval(() => {
            currentIndex++
            if (currentIndex >= words.length) {
                clearInterval(interval)
                setCurrentWordIndex(words.length - 1)
            } else {
                setCurrentWordIndex(currentIndex)
            }
        }, msPerWord)
        
        return () => clearInterval(interval)
    }, [text, isPlaying, speed, words.length])
    
    if (!text) return null
    
    return (
        <div className="animated-text-container">
            <div className="animated-text-content">
                {words.map((word, index) => {
                    const isActive = index === currentWordIndex
                    const isPast = index < currentWordIndex
                    const isFuture = index > currentWordIndex
                    
                    return (
                        <motion.span
                            key={`${word}-${index}`}
                            className={`animated-word ${
                                isActive ? 'active' : 
                                isPast ? 'past' : 
                                'future'
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ 
                                opacity: isFuture ? 0.3 : 1,
                                y: 0,
                                scale: isActive ? 1.05 : 1
                            }}
                            transition={{ 
                                duration: 0.3,
                                ease: "easeOut"
                            }}
                        >
                            {word}{' '}
                        </motion.span>
                    )
                })}
            </div>
        </div>
    )
}

export default AnimatedText
