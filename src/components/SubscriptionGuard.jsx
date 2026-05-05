import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const SubscriptionGuard = ({ children, session }) => {
    const [status, setStatus] = useState('loading') // loading, active, blocked

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const checkSubscription = async () => {
            if (!session?.user?.id) return;

            try {
                const { data: profile, error } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                if (error) {
                    // Erro de registro não encontrado (PGRST116) não é um erro de rede
                    if (error.code === 'PGRST116') {
                        if (isMounted) setStatus('active');
                        return;
                    }
                    throw error;
                }

                if (isMounted) {
                    const isBlocked = profile?.subscription_status === 'blocked';
                    const isExpired = profile?.subscription_expires_at && new Date(profile.subscription_expires_at) < new Date();

                    if (isBlocked || isExpired) {
                        setStatus('blocked');
                    } else {
                        // Passamos o perfil completo para os filhos se necessário (via cloneElement ou prop explícita se usarmos contexto futuramente)
                        setStatus('active');
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Erro ao verificar assinatura:', err);
                    setStatus('active'); // Fail-safe
                }
            }
        };

        checkSubscription();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [session])


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
