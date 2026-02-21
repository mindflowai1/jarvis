import { useState } from 'react'
import { supabase } from '../supabaseClient'
import './PhoneNumberModal.css'

const PhoneNumberModal = ({ session, onSave, onClose }) => {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

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
        // Limita a 15 caracteres: (XX) XXXXX-XXXX
        if (value.length <= 15) {
            setPhone(formatPhone(value))
            setError(null)
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

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres')
            return
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Atualiza a senha no Supabase Auth
            const { error: passwordError } = await supabase.auth.updateUser({
                password: password
            })

            if (passwordError) {
                throw new Error(passwordError.message || 'Erro ao definir a senha')
            }

            // Remove formatação e adiciona código do país (+55)
            const rawPhone = phone.replace(/\D/g, '')
            const phoneWithCountryCode = `55${rawPhone}` // +55 (Brasil)

            // Logic to remove the extra '9' for whatsapp_number
            let whatsappNumber = phoneWithCountryCode
            if (rawPhone.length === 11 && rawPhone[2] === '9') {
                const ddd = rawPhone.slice(0, 2)
                const numberWithoutNine = rawPhone.slice(3)
                whatsappNumber = `55${ddd}${numberWithoutNine}`
            }

            // Pega o nome do usuário dos metadados
            const userName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário'

            console.log('💾 Updating profile for user:', session.user.id)

            // Usa UPDATE direto, pois o trigger já criou o registro
            const { data, error: dbError } = await supabase
                .from('user_profiles')
                .update({
                    name: userName,
                    phone_number: phoneWithCountryCode,
                    whatsapp_number: whatsappNumber,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', session.user.id)
                .select()

            if (dbError) {
                console.error('❌ Database error:', dbError)
                throw new Error(dbError.message || 'Erro ao salvar no banco de dados')
            }

            if (!data || data.length === 0) {
                console.error('❌ No record was updated')
                throw new Error('Registro não encontrado. Por favor, faça logout e login novamente.')
            }

            console.log('✅ Phone saved successfully:', data[0])

            if (onSave) onSave()

        } catch (err) {
            console.error('❌ Error saving phone:', err)
            setError(err.message || 'Erro ao salvar número. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (onClose) {
            onClose()
        }
    }

    return (
        <div className="phone-modal-overlay">
            <div className="phone-modal">
                {/* Botão de fechar */}
                <button className="phone-modal-close" onClick={handleClose} disabled={loading}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="phone-modal-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                </div>

                <h2>Configuração de Conta</h2>
                <p>Para continuar, defina sua senha e vincule seu número de WhatsApp.</p>

                <div className="phone-input-group">
                    <label className="phone-input-label">Seu número de WhatsApp</label>
                    <div className="phone-input-wrapper">
                        <div className="country-code">
                            🇧🇷 +55
                        </div>
                        <input
                            type="tel"
                            className={`phone-input ${error ? 'error' : ''}`}
                            placeholder="(11) 99999-9999"
                            value={phone}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="phone-input-group" style={{ marginBottom: '1rem' }}>
                    <label className="phone-input-label">Definir Nova Senha</label>
                    <div className="phone-input-wrapper" style={{ paddingLeft: 0 }}>
                        <input
                            type="password"
                            className={`phone-input ${error && error.includes('senha') ? 'error' : ''}`}
                            style={{ paddingLeft: '1rem' }}
                            placeholder="Mínimo de 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="phone-input-group" style={{ marginBottom: '2rem' }}>
                    <label className="phone-input-label">Confirmar Senha</label>
                    <div className="phone-input-wrapper" style={{ paddingLeft: 0 }}>
                        <input
                            type="password"
                            className={`phone-input ${error && error.includes('coincidem') ? 'error' : ''}`}
                            style={{ paddingLeft: '1rem' }}
                            placeholder="Repita a senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>

                {error && (
                    <div className="error-message" style={{ marginBottom: '1rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={loading || phone.length < 15 || password.length < 6 || confirmPassword.length < 6}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Salvando...
                        </>
                    ) : (
                        'Confirmar e Continuar'
                    )}
                </button>
            </div>
        </div>
    )
}

export default PhoneNumberModal
