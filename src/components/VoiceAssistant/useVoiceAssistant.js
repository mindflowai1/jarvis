import { useState, useRef, useCallback, useEffect } from 'react'

export const useVoiceAssistant = (session) => {
    const [state, setState] = useState('IDLE') // IDLE, LISTENING, THINKING, SPEAKING
    const [audioLevel, setAudioLevel] = useState(0)
    const [error, setError] = useState(null)
    const [responseText, setResponseText] = useState('')
    const [responseItems, setResponseItems] = useState([])
    const [isPlaying, setIsPlaying] = useState(false)
    
    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])
    const audioContextRef = useRef(null)
    const analyserRef = useRef(null)
    const animationFrameRef = useRef(null)
    const streamRef = useRef(null)

    const initializeAudioContext = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            streamRef.current = stream

            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
            analyserRef.current = audioContextRef.current.createAnalyser()
            analyserRef.current.fftSize = 256

            const source = audioContextRef.current.createMediaStreamSource(stream)
            source.connect(analyserRef.current)

            return stream
        } catch (err) {
            console.error('Error accessing microphone:', err)
            setError('Não foi possível acessar o microfone. Verifique as permissões.')
            throw err
        }
    }, [])

    const analyzeAudio = useCallback(() => {
        if (!analyserRef.current) return

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)

        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        const normalizedLevel = Math.min(average / 128, 1)
        
        setAudioLevel(normalizedLevel)

        animationFrameRef.current = requestAnimationFrame(analyzeAudio)
    }, [])

    const startListening = useCallback(async () => {
        try {
            setError(null)
            setState('LISTENING')
            
            const stream = await initializeAudioContext()
            
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            })

            audioChunksRef.current = []

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorderRef.current.start()
            analyzeAudio()

            console.log('🎤 Recording started')
        } catch (err) {
            console.error('Error starting recording:', err)
            setState('IDLE')
        }
    }, [initializeAudioContext, analyzeAudio])

    const stopListening = useCallback(async () => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
                resolve(null)
                return
            }

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                console.log('🎤 Recording stopped, blob size:', audioBlob.size)
                
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                }
                
                setAudioLevel(0)
                resolve(audioBlob)
            }

            mediaRecorderRef.current.stop()
            
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
        })
    }, [])

    const sendToWebhook = useCallback(async (audioBlob) => {
        setState('THINKING')
        
        try {
            const userId = session?.user?.id
            
            console.log('📤 Sending audio to webhook...', audioBlob.size, 'bytes')
            console.log('📦 Audio type:', audioBlob.type)
            console.log('👤 User ID:', userId)
            
            const formData = new FormData()
            formData.append('audio', audioBlob, 'recording.webm')
            
            if (userId) {
                formData.append('user_id', userId)
            }
            
            const webhookUrl = 'https://n8n-n8n-start.kof6cn.easypanel.host/webhook/5ccef907-66d3-46ad-94bf-a3ded50073fc'
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: formData
            })
            
            console.log('✅ Webhook response status:', response.status)
            
            if (!response.ok) {
                throw new Error(`Webhook error: ${response.status}`)
            }
            
            // O n8n retorna multipart com JSON + arquivo binário
            const contentType = response.headers.get('content-type')
            console.log('📦 Content-Type:', contentType)
            
            if (contentType && contentType.includes('multipart')) {
                // Processar resposta multipart
                const formData = await response.formData()
                
                // Extrair JSON (campo com metadados)
                let metadata = null
                let audioBlob = null
                
                for (const [key, value] of formData.entries()) {
                    console.log('📦 FormData key:', key, typeof value)
                    
                    if (key === 'data' && value instanceof Blob) {
                        // Arquivo de áudio
                        audioBlob = value
                        console.log('🎵 Audio blob found:', audioBlob.size, 'bytes')
                    } else if (typeof value === 'string') {
                        // Tentar parsear como JSON
                        try {
                            metadata = JSON.parse(value)
                            console.log('📄 Metadata:', metadata)
                        } catch (e) {
                            console.log('📄 String value:', value)
                        }
                    }
                }
                
                // Extrair texto da resposta
                const text = metadata?.find(item => item.output)?.output || 'Resposta recebida'
                
                // Criar URL do áudio se existir
                let audioUrl = null
                if (audioBlob) {
                    audioUrl = URL.createObjectURL(audioBlob)
                    console.log('🎵 Audio URL created:', audioUrl)
                }
                
                return {
                    text,
                    audioUrl,
                    metadata
                }
            } else {
                // Processar JSON simples
                const data = await response.json()
                console.log('📥 Webhook response:', data)
                
                let text = 'Resposta recebida'
                let items = []
                
                // Extrair response e items do novo formato
                if (Array.isArray(data) && data.length > 0 && data[0].output) {
                    // Formato: [{ output: { response, items } }]
                    const output = data[0].output
                    
                    if (output.response) {
                        text = output.response
                    }
                    
                    if (output.items && Array.isArray(output.items)) {
                        items = output.items
                    }
                    
                    console.log('📝 Extracted response:', text)
                    console.log('📦 Extracted items:', items.length)
                } else if (Array.isArray(data)) {
                    // Formato antigo (fallback)
                    const textItem = data.find(item => item.output)
                    if (textItem) text = textItem.output
                } else if (data.output) {
                    text = data.output
                } else if (data.text) {
                    text = data.text
                }
                
                return { text, items }
            }
        } catch (err) {
            console.error('❌ Error sending to webhook:', err)
            setError('Erro ao enviar áudio para processamento.')
            throw err
        }
    }, [session])

    const playResponse = useCallback(async (response) => {
        setState('SPEAKING')
        
        console.log('🔊 playResponse called with:', response)
        
        try {
            if (response.text) {
                setResponseText(response.text)
                console.log('✅ Text set:', response.text)
                
                // Salvar items se existirem
                if (response.items && response.items.length > 0) {
                    setResponseItems(response.items)
                    console.log('📦 Items set:', response.items.length)
                } else {
                    setResponseItems([])
                }
                
                // Gerar áudio com OpenAI TTS
                console.log('🎵 Generating audio with OpenAI TTS...')
                
                // TODO: Adicionar sua OPENAI_API_KEY
                const OPENAI_API_KEY = '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'
                
                const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'tts-1', // tts-1 é mais rápido, tts-1-hd é melhor qualidade
                        voice: 'alloy', // alloy, echo, fable, onyx, nova, shimmer
                        input: response.text,
                        speed: 1.1 // 0.25 a 4.0 (1.1 = 10% mais rápido)
                    })
                })
                
                if (ttsResponse.ok) {
                    const audioBlob = await ttsResponse.blob()
                    const audioUrl = URL.createObjectURL(audioBlob)
                    
                    console.log('🎵 OpenAI TTS audio generated')
                    
                    const audio = new Audio(audioUrl)
                    
                    audio.onplay = () => {
                        setIsPlaying(true)
                        console.log('🎵 Audio playback started')
                    }
                    
                    audio.onended = () => {
                        console.log('✅ Audio playback finished')
                        setIsPlaying(false)
                        setState('IDLE')
                        setTimeout(() => {
                            setResponseText('')
                        }, 3000)
                    }
                    
                    await audio.play()
                } else {
                    console.error('❌ OpenAI TTS error:', await ttsResponse.text())
                    // Fallback para Web Speech API
                    const utterance = new SpeechSynthesisUtterance(response.text)
                    utterance.lang = 'pt-BR'
                    utterance.rate = 1.2 // Mais rápido
                    
                    utterance.onend = () => {
                        setState('IDLE')
                        setTimeout(() => setResponseText(''), 3000)
                    }
                    
                    window.speechSynthesis.speak(utterance)
                }
            }
        } catch (err) {
            console.error('❌ Error playing response:', err)
            setState('IDLE')
            setResponseText('')
        }
    }, [])

    const handleVoiceInteraction = useCallback(async () => {
        try {
            await startListening()
        } catch (err) {
            console.error('Voice interaction error:', err)
            setState('IDLE')
        }
    }, [startListening])

    const handleStopInteraction = useCallback(async () => {
        try {
            const audioBlob = await stopListening()
            
            if (!audioBlob || audioBlob.size === 0) {
                console.warn('No audio recorded')
                setState('IDLE')
                return
            }

            const response = await sendToWebhook(audioBlob)
            await playResponse(response)
        } catch (err) {
            console.error('Stop interaction error:', err)
            setState('IDLE')
        }
    }, [stopListening, sendToWebhook, playResponse])

    const cancelInteraction = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
        }
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
        }
        
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
        }
        
        window.speechSynthesis.cancel()
        
        setState('IDLE')
        setAudioLevel(0)
        setError(null)
        setResponseText('')
        setResponseItems([])
        setIsPlaying(false)
    }, [])

    const clearResponseItems = useCallback(() => {
        setResponseItems([])
    }, [])

    useEffect(() => {
        return () => {
            cancelInteraction()
        }
    }, [cancelInteraction])

    return {
        state,
        audioLevel,
        error,
        responseText,
        responseItems,
        isPlaying,
        startListening: handleVoiceInteraction,
        stopListening: handleStopInteraction,
        cancelInteraction,
        clearResponseItems
    }
}
