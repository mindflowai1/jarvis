import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import '../index.css'

const Login = () => {
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Form fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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
                <form className="auth-form" onSubmit={handleSignIn}>
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

                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Processando...' : 'Entrar'}
                    </button>
                </form>

                <div className="footer-credits">
                    <p>Controle-C © 2026</p>
                </div>
            </div>
        </div>
    )
}

export default Login
