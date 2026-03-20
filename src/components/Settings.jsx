import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './SettingsPage.css'

const Settings = ({ session }) => {
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')

    // Password Change State
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loadingPassword, setLoadingPassword] = useState(false)
    const [passwordError, setPasswordError] = useState(null)
    const [passwordSuccess, setPasswordSuccess] = useState('')

    // Calendar Integration State
    const [isCalendarConnected, setIsCalendarConnected] = useState(false)
    const [checkingConnection, setCheckingConnection] = useState(true)
    const [connectingCalendar, setConnectingCalendar] = useState(false)

    useEffect(() => {
        fetchProfile()
        checkCalendarConnection()

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkCalendarConnection()
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [session])

    const checkCalendarConnection = async () => {
        try {
            const { data, error } = await supabase
                .from('user_integrations')
                .select('refresh_token')
                .eq('user_id', session.user.id)
                .eq('provider', 'google')
                .maybeSingle()

            if (error) {
                console.error('Error checking calendar connection:', error)
                setCheckingConnection(false)
                return false
            }

            const isConnected = !!data?.refresh_token
            setIsCalendarConnected(isConnected)
            return isConnected
        } catch (err) {
            console.error('Error:', err)
            setCheckingConnection(false)
            return false
        } finally {
            setCheckingConnection(false)
        }
    }

    const handleConnectGoogle = async () => {
        setConnectingCalendar(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard?tab=settings`,
                    scopes: 'https://www.googleapis.com/auth/calendar',
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            })

            if (error) throw error
        } catch (err) {
            console.error('Error:', err)
            alert('Erro ao conectar com Google Calendar')
        } finally {
            setConnectingCalendar(false)
        }
    }

    const handleDisconnectGoogle = async () => {
        if (!confirm('Tem certeza que deseja desconectar o Google Calendar? Seus agendamentos continuarão lá, mas a plataforma não poderá mais acessá-los.')) return;

        setConnectingCalendar(true)
        try {
            const { error } = await supabase
                .from('user_integrations')
                .delete()
                .eq('user_id', session.user.id)
                .eq('provider', 'google')

            if (error) throw error

            setIsCalendarConnected(false)
        } catch (err) {
            console.error('Error disconnecting calendar:', err)
            alert('Erro ao desconectar do Google Calendar')
        } finally {
            setConnectingCalendar(false)
        }
    }

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('phone_number')
                .eq('user_id', session.user.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error)
            }

            if (data && data.phone_number) {
                // Remove country code (55) if present to display in input mask
                // Assuming stored format is 5511999999999
                let displayPhone = data.phone_number
                if (displayPhone.startsWith('55') && displayPhone.length === 13) {
                    displayPhone = displayPhone.substring(2)
                }
                setPhone(formatPhone(displayPhone))
            }
        } catch (err) {
            console.error('Error:', err)
        } finally {
            setFetching(false)
        }
    }

    // Formata o telefone conforme digita: (XX) XXXXX-XXXX
    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, '')

        if (numbers.length <= 2) return numbers
        if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
        if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`

        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }

    const handleChange = (e) => {
        const value = e.target.value
        if (value.length <= 15) {
            setPhone(formatPhone(value))
            setError(null)
            setSuccessMessage('')
        }
    }

    const validatePhone = (phone) => {
        const numbers = phone.replace(/\D/g, '')
        return numbers.length === 11 // DDD + 9 dígitos
    }

    const handleSave = async () => {
        if (!validatePhone(phone)) {
            setError('Por favor, digite um número de celular válido com DDD')
            return
        }

        setLoading(true)
        setError(null)
        setSuccessMessage('')

        try {
            const rawPhone = phone.replace(/\D/g, '') // 11999999999
            const phoneNumber = `55${rawPhone}` // 5511999999999

            // Logic to remove the extra '9' for whatsapp_number
            // rawPhone is DDD + 9 digits (11 total)
            // We want to check if the first digit of the number part is 9.
            // Indices: 0-1 are DDD, 2 is the first digit.

            let whatsappNumber = phoneNumber;

            // Checks if it is a mobile number with 9 digits (11 total with DDD) and the digit is 9
            if (rawPhone.length === 11 && rawPhone[2] === '9') {
                // Remove the 9 at index 2
                const ddd = rawPhone.slice(0, 2)
                const numberWithoutNine = rawPhone.slice(3)
                whatsappNumber = `55${ddd}${numberWithoutNine}`
            }

            console.log('Saving phone:', phoneNumber)
            console.log('Saving whatsapp:', whatsappNumber)

            const { error: dbError } = await supabase
                .from('user_profiles')
                .update({
                    phone_number: phoneNumber,
                    whatsapp_number: whatsappNumber,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', session.user.id)

            if (dbError) throw dbError

            setSuccessMessage('Número salvo com sucesso!')

            // ⚡ Dispara o Webhook do n8n com o número atualizado
            const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
            if (webhookUrl) {
                try {
                    const userName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário'
                    await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: session.user.id,
                            name: userName,
                            email: session.user.email,
                            whatsapp_number: whatsappNumber,
                            event: 'phone_number_updated'
                        })
                    })
                    console.log('🚀 Webhook n8n disparado com sucesso (número atualizado)!')
                } catch (webhookErr) {
                    console.error('⚠️ Falha ao disparar o webhook do n8n:', webhookErr)
                }
            }

        } catch (err) {
            console.error('Error saving phone:', err)
            setError('Erro ao salvar as alterações.')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdatePassword = async () => {
        setPasswordError(null)
        setPasswordSuccess('')

        if (newPassword !== confirmPassword) {
            setPasswordError('As senhas não conferem.')
            return
        }

        if (newPassword.length < 6) {
            setPasswordError('A senha deve ter pelo menos 6 caracteres.')
            return
        }

        setLoadingPassword(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) throw error

            setPasswordSuccess('Senha atualizada com sucesso!')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err) {
            console.error('Error updating password:', err)
            setPasswordError('Erro ao atualizar senha. Tente novamente.')
        } finally {
            setLoadingPassword(false)
        }
    }

    if (fetching) return <div className="p-8 text-center">Carregando...</div>

    return (
        <div className="settings-container">
            <h2 className="settings-title">Configurações</h2>

            <div className="settings-grid">
                <div className="settings-card">
                    <h3 className="section-title">Perfil</h3>

                    <div className="input-group">
                        <label>Número de WhatsApp</label>
                        <div className="phone-input-wrapper-settings">
                            <div className="country-code-badge">🇧🇷 +55</div>
                            <input
                                type="tel"
                                className={`settings-input ${error ? 'input-error' : ''}`}
                                placeholder="(11) 99999-9999"
                                value={phone}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <p className="helper-text">Este número será usado para integração com assistente.</p>
                    </div>

                    {error && (
                        <div className="error-message-settings">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="success-message-settings">
                            {successMessage}
                        </div>
                    )}

                    <button
                        className="save-settings-btn"
                        onClick={handleSave}
                        disabled={loading || phone.length < 15}
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>

                <div className="settings-card">
                    <h3 className="section-title">Segurança</h3>

                    <div className="input-group">
                        <label>Nova Senha</label>
                        <input
                            type="password"
                            className={`settings-input ${passwordError ? 'input-error' : ''}`}
                            placeholder="Nova senha (mínimo 6 caracteres)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={loadingPassword}
                        />
                    </div>

                    <div className="input-group">
                        <label>Confirmar Senha</label>
                        <input
                            type="password"
                            className={`settings-input ${passwordError ? 'input-error' : ''}`}
                            placeholder="Confirme a nova senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loadingPassword}
                        />
                    </div>

                    {passwordError && (
                        <div className="error-message-settings">
                            {passwordError}
                        </div>
                    )}

                    {passwordSuccess && (
                        <div className="success-message-settings">
                            {passwordSuccess}
                        </div>
                    )}

                    <button
                        className="save-settings-btn"
                        onClick={handleUpdatePassword}
                        disabled={loadingPassword || !newPassword}
                    >
                        {loadingPassword ? 'Atualizando...' : 'Alterar Senha'}
                    </button>
                </div>

                <div className="settings-card">
                    <h3 className="section-title">Integrações</h3>

                    <div className="calendar-status-wrapper">
                        <div className="calendar-status-info">
                            <div className="calendar-icon">📅</div>
                            <div>
                                <h4 className="calendar-status-label">Google Calendar</h4>
                                <p className="calendar-status-description">
                                    Sincronize seus agendamentos e eventos.
                                </p>
                            </div>
                        </div>
                        <div className={`calendar-status-badge ${isCalendarConnected ? 'connected' : 'disconnected'}`}>
                            <div className="status-dot"></div>
                            {isCalendarConnected ? 'Conectado' : 'Desconectado'}
                        </div>
                    </div>

                    <div className="calendar-actions">
                        {checkingConnection ? (
                            <button className="connect-calendar-btn" style={{ background: 'rgba(51, 65, 85, 0.4)', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.05)' }} disabled>
                                Verificando status...
                            </button>
                        ) : isCalendarConnected ? (
                            <button
                                className="disconnect-calendar-btn"
                                onClick={handleDisconnectGoogle}
                                disabled={connectingCalendar}
                            >
                                {connectingCalendar ? 'Processando...' : 'Desconectar Agenda'}
                            </button>
                        ) : (
                            <button
                                className="connect-calendar-btn"
                                onClick={handleConnectGoogle}
                                disabled={connectingCalendar}
                            >
                                <svg className="google-icon-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </svg>
                                {connectingCalendar ? 'Conectando...' : 'Conectar com Google'}
                            </button>
                        )}
                    </div>
                    {!isCalendarConnected && (
                        <p className="calendar-helper-text">
                            A integração permite que seus agendamentos sejam criados e gerenciados diretamente pela plataforma e pelo assistente IA.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Settings
