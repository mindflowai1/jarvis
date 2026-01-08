import { motion } from 'framer-motion'
import AIOrb from './AIOrb'
import AnimatedText from './AnimatedText'
import ItemCards from './ItemCards'
import { useVoiceAssistant } from './useVoiceAssistant'
import './VoiceAssistant.css'

const VoiceAssistant = ({ session }) => {
    const { 
        state, 
        audioLevel, 
        error,
        responseText,
        responseItems,
        isPlaying,
        startListening, 
        stopListening, 
        cancelInteraction,
        clearResponseItems
    } = useVoiceAssistant(session)

    const getStateText = () => {
        switch (state) {
            case 'IDLE':
                return ''
            case 'LISTENING':
                return 'Ouvindo... Solte para enviar'
            case 'THINKING':
                return 'Processando...'
            case 'SPEAKING':
                return 'Respondendo...'
            default:
                return ''
        }
    }

    const getStateColor = () => {
        switch (state) {
            case 'IDLE':
                return 'text-slate-400'
            case 'LISTENING':
                return 'text-green-400'
            case 'THINKING':
                return 'text-yellow-400'
            case 'SPEAKING':
                return 'text-purple-400'
            default:
                return 'text-slate-400'
        }
    }

    return (
        <div className="voice-assistant-container">
            <div className="voice-assistant-content">
                {/* Header */}
                <motion.div 
                    className="assistant-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="assistant-title">Assistente de Voz</h1>
                    <p className="assistant-subtitle">Seu assistente pessoal inteligente</p>
                </motion.div>

                {/* AI Orb */}
                <motion.div 
                    className="orb-wrapper"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <AIOrb state={state} audioLevel={audioLevel} />
                </motion.div>

                {/* State Text */}
                <motion.div 
                    className="state-text-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <p className={`state-text ${getStateColor()}`}>
                        {getStateText()}
                    </p>
                    
                    {error && (
                        <motion.p 
                            className="error-text"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.p>
                    )}

                    {responseText && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AnimatedText 
                                text={responseText} 
                                isPlaying={isPlaying}
                                speed={1.1}
                            />
                        </motion.div>
                    )}

                    {responseItems && responseItems.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <ItemCards items={responseItems} onClose={clearResponseItems} />
                        </motion.div>
                    )}
                </motion.div>

                {/* Control Button */}
                <motion.div 
                    className="control-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    {state === 'IDLE' ? (
                        <motion.button
                            className="voice-button"
                            onMouseDown={startListening}
                            onMouseUp={stopListening}
                            onTouchStart={startListening}
                            onTouchEnd={stopListening}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="mic-icon"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" 
                                />
                            </svg>
                            <span>Segurar para Falar</span>
                        </motion.button>
                    ) : state === 'LISTENING' ? (
                        <motion.button
                            className="voice-button listening"
                            onMouseUp={stopListening}
                            onTouchEnd={stopListening}
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(34, 197, 94, 0.4)',
                                    '0 0 40px rgba(34, 197, 94, 0.6)',
                                    '0 0 20px rgba(34, 197, 94, 0.4)'
                                ]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="mic-icon"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" 
                                />
                            </svg>
                            <span>Solte para Enviar</span>
                        </motion.button>
                    ) : (
                        <motion.button
                            className="voice-button cancel"
                            onClick={cancelInteraction}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="cancel-icon"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M6 18L18 6M6 6l12 12" 
                                />
                            </svg>
                            <span>Cancelar</span>
                        </motion.button>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default VoiceAssistant
