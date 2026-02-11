import { motion } from 'framer-motion'
import './VoiceAssistant.css'

const VoiceAssistant = () => {
    return (
        <div className="voice-assistant-container">
            <motion.div
                className="coming-soon-wrapper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="icon-pulse-container">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="brain-icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring delay"></div>
                </div>

                <h1 className="coming-soon-title">Em Breve</h1>
                <p className="coming-soon-subtitle">
                    Estamos calibrando nossa Inteligência Artificial para te oferecer a melhor experiência possível.
                </p>

                <div className="feature-preview">
                    <div className="preview-badge">
                        <span className="dot"></span>
                        Reconhecimento de Voz Avançado
                    </div>
                    <div className="preview-badge">
                        <span className="dot"></span>
                        Integração Total com Agenda
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default VoiceAssistant
