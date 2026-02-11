import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './Settings.css'

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

    useEffect(() => {
        fetchProfile()
    }, [session])

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

            // Refresh user profile in parent if needed (handled by Dashboard effect usually)

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
        </div>
    )
}

export default Settings
