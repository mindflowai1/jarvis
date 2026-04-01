import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import '../index.css'

const ResetPassword = () => {
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Form fields
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        setLoaded(true)
        
        // Verifica se há uma sessão ativa após o redirecionamento
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setError('Sessão de recuperação inválida ou expirada. Solicite uma nova redefinição de senha.')
            }
        })
    }, [])

    const validateForm = () => {
        if (!password || password.length < 6) {
            setError('A nova senha deve ter no mínimo 6 caracteres')
            return false
        }
        if (password !== confirmPassword) {
            setError('As senhas não coincidem')
            return false
        }
        return true
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) return

        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) throw error

            setSuccess(true)
            // Redireciona para o dashboard após sucesso
            setTimeout(() => {
                navigate('/dashboard', { replace: true })
            }, 3000)
        } catch (err) {
            console.error('Reset password error:', err)
            setError(err.message || 'Erro ao redefinir senha')
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
                    <h1 className="uppercase tracking-[0.2em]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Redefinir Senha</h1>
                    <p>Digite sua nova senha abaixo</p>
                </div>

                {success ? (
                    <div className="success-message text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#00f5ff] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-[#00f5ff] font-medium text-lg">Senha alterada com sucesso!</p>
                        <p className="text-gray-400 mt-2">Redirecionando para o painel...</p>
                    </div>
                ) : (
                    <form className="auth-form" onSubmit={handleResetPassword}>
                        <div className="form-input-wrapper">
                            <input
                                type="password"
                                placeholder="Nova Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                disabled={loading}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="form-input-wrapper">
                            <input
                                type="password"
                                placeholder="Repita a Senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-input"
                                disabled={loading}
                                autoComplete="new-password"
                            />
                        </div>

                        {error && (
                            <div className="error-message">{error}</div>
                        )}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading || !!success}
                        >
                            {loading ? 'Processando...' : 'Atualizar Senha'}
                        </button>
                    </form>
                )}

                <div className="footer-credits mt-8">
                    <p>Controle-C © 2026</p>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
