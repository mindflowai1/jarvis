import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import '../index.css'

const Login = () => {
    const [loaded, setLoaded] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')

    // Form fields
    const [name, setName] = useState('')
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
        if (isSignUp && !name.trim()) {
            setError('Por favor, informe seu nome')
            return false
        }
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

    const handleSignUp = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) return

        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name.trim()
                    }
                }
            })

            if (error) throw error

            // Mostrar mensagem de confirmação de email
            setRegisteredEmail(email)
            setEmailSent(true)
        } catch (err) {
            console.error('Signup error:', err)
            setError(err.message || 'Erro ao criar conta')
        } finally {
            setLoading(false)
        }
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

            {emailSent ? (
                <div className={`login-card ${loaded ? 'fade-in' : ''}`}>
                    <div className="email-confirmation-screen">
                        <div className="confirmation-icon">📧</div>
                        <h2 className="confirmation-title">Verifique seu email!</h2>
                        <p className="confirmation-message">
                            Enviamos um link de confirmação para:
                        </p>
                        <p className="confirmation-email">{registeredEmail}</p>
                        <p className="confirmation-instructions">
                            Por favor, verifique sua caixa de entrada (e também a pasta de spam)
                            e clique no link para ativar sua conta.
                        </p>
                        <button
                            className="back-to-login-btn"
                            onClick={() => {
                                setEmailSent(false)
                                setIsSignUp(false)
                                setEmail('')
                                setPassword('')
                                setName('')
                            }}
                        >
                            Voltar para o Login
                        </button>
                    </div>
                </div>
            ) : (
                <div className={`login-card ${loaded ? 'fade-in' : ''}`}>
                    <div className="logo-area">
                        <img src="/logo.png" alt="Jarvis Logo" className="login-logo" />
                    </div>

                    <div className="text-content">
                        <h1>{isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}</h1>
                        <p>{isSignUp ? 'Preencha seus dados para começar' : 'Acesse sua conta para continuar'}</p>
                    </div>

                    {/* Toggle Login/Signup */}
                    <div className="auth-toggle">
                        <button
                            className={`auth-toggle-btn ${!isSignUp ? 'active' : ''}`}
                            onClick={() => {
                                setIsSignUp(false)
                                setError('')
                            }}
                            type="button"
                        >
                            Login
                        </button>
                        <button
                            className={`auth-toggle-btn ${isSignUp ? 'active' : ''}`}
                            onClick={() => {
                                setIsSignUp(true)
                                setError('')
                            }}
                            type="button"
                        >
                            Cadastrar
                        </button>
                    </div>

                    {/* Form */}
                    <form className="auth-form" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                        {isSignUp && (
                            <div className="form-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Nome completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>
                        )}

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
                                placeholder="Senha (mínimo 6 caracteres)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                disabled={loading}
                                autoComplete={isSignUp ? "new-password" : "current-password"}
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
                            {loading ? 'Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
                        </button>
                    </form>

                    <div className="footer-credits">
                        <p>Secure System © 2026</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login
