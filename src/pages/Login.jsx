import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import '../index.css'

const Login = () => {
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Form fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mode, setMode] = useState('login') // 'login' or 'forgot-password'
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        setLoaded(true)
    }, [])

    // Validações
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const validateForm = () => {
        if (!email.trim()) {
            setError('Por favor, informe seu email')
            return false
        }
        if (!validateEmail(email)) {
            setError('Email inválido')
            return false
        }
        if (!password || password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres')
            return false
        }
        return true
    }

    const handleSignIn = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) return

        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            // Sucesso - usuário será redirecionado automaticamente pelo App.jsx
        } catch (err) {
            console.error('Login error:', err)
            setError(err.message === 'Invalid login credentials'
                ? 'Email ou senha incorretos'
                : err.message || 'Erro ao fazer login')
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')

        if (!email.trim() || !validateEmail(email)) {
            setError('Por favor, informe um email válido')
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) throw error

            setSuccessMessage('Se o email existir, um link de recuperação foi enviado.')
        } catch (err) {
            console.error('Forgot password error:', err)
            // Para segurança evite confirmar se o email existe, mas para erros de taxa de limite etc avise
            setError(err.message || 'Erro ao solicitar redefinição de senha')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="app-container">
            <div className="bg-glow top-left"></div>
            <div className="bg-glow bottom-right"></div>

            <div className={`login-card ${loaded ? 'fade-in' : ''}`}>
                <div className="logo-area">
                    <img src="/logo-controle-c.png" alt="Controle-C Logo" className="login-logo" />
                </div>

                <div className="text-content">
                    <h1 className="uppercase tracking-[0.2em]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Controle-C</h1>
                    <p>Acesse seu dashboard de usuário</p>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={mode === 'login' ? handleSignIn : handleForgotPassword}>
                    <div className="form-input-wrapper">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    {mode === 'login' && (
                        <>
                            <div className="form-input-wrapper">
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>
                            <div className="flex justify-end mt-1 mb-2">
                                <button
                                    type="button"
                                    onClick={() => { setMode('forgot-password'); setError(''); setSuccessMessage(''); }}
                                    className="text-xs text-gray-400 hover:text-[#00f5ff] transition-colors bg-transparent border-none cursor-pointer"
                                >
                                    Esqueci minha senha
                                </button>
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="error-message">{error}</div>
                    )}
                    {successMessage && (
                        <div className="success-message text-[#00f5ff] text-sm text-center mb-4 p-2 bg-[#00f5ff]/10 rounded border border-[#00f5ff]/20">
                            {successMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Processando...' : (mode === 'login' ? 'Entrar' : 'Enviar Link de Recuperação')}
                    </button>
                    
                    {mode === 'forgot-password' && (
                        <button
                            type="button"
                            onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
                            className="w-full text-center mt-4 text-sm text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Voltar para o Login
                        </button>
                    )}
                </form>

                <div className="footer-credits mt-6 text-center text-xs text-slate-500">
                    <p className="mb-2">Controle-C © 2026</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/privacy" className="hover:text-[#0cf2cd] transition-colors">Privacidade</Link>
                        <Link to="/terms" className="hover:text-[#0cf2cd] transition-colors">Termos de Serviço</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
