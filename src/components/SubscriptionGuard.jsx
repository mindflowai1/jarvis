import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const SubscriptionGuard = ({ children, session }) => {
    const [status, setStatus] = useState('loading') // loading, active, blocked

    useEffect(() => {
        checkSubscription()
    }, [session])

    const checkSubscription = async () => {
        if (!session?.user?.id) return

        try {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('subscription_status, subscription_expires_at')
                .eq('user_id', session.user.id)
                .single()

            if (!profile) {
                // Se não tem perfil, assume ativo (ou trate conforme regra de negócio)
                setStatus('active')
                return
            }

            const isBlocked = profile.subscription_status === 'blocked'
            const isExpired = profile.subscription_expires_at && new Date(profile.subscription_expires_at) < new Date()

            if (isBlocked || isExpired) {
                setStatus('blocked')
            } else {
                setStatus('active')
            }

        } catch (error) {
            console.error('Erro ao verificar assinatura:', error)
            setStatus('active') // Fail safe: permitir acesso se der erro de rede? Ou bloquear? Decisão de negócio.
        }
    }

    if (status === 'loading') {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
                Carregando...
            </div>
        )
    }

    if (status === 'blocked') {
        return <Navigate to="/access-denied" replace />
    }

    return children
}

export default SubscriptionGuard
