import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './index.css'
import LandingPage from './components/LandingPage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import SubscriptionGuard from './components/SubscriptionGuard'
import AccessDenied from './pages/AccessDenied'
import LandingPageTest from './pages/LandingPageTest'
import Tests from './pages/Tests'

// Componente independente para gerenciar redirecionamentos de autenticação
function AuthRedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Verifica se aterrissamos na raiz com um hash de convite ou recuperacao
        if (window.location.hash && (window.location.hash.includes('type=invite') || window.location.hash.includes('type=recovery'))) {
            navigate('/dashboard', { replace: true });
        }

        // Escuta os eventos de Auth do Supabase (quando o token e processado)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
                if (location.pathname === '/' || location.pathname === '/login') {
                    navigate('/dashboard', { replace: true });
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate, location.pathname]);

    return null;
}

function App() {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            // Salvar tokens se houver provider_token (OAuth do Google)
            if (session?.provider_token) {
                saveGoogleTokens(session)
            }
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            // Salvar tokens se houver provider_token (OAuth do Google)
            if (session?.provider_token) {
                saveGoogleTokens(session)
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const saveGoogleTokens = async (session) => {
        const { user, provider_token, provider_refresh_token } = session

        const updates = {
            user_id: user.id,
            provider: 'google',
            access_token: provider_token,
            updated_at: new Date(),
        }

        if (provider_refresh_token) {
            updates.refresh_token = provider_refresh_token
        }

        const { error } = await supabase
            .from('user_integrations')
            .upsert(updates, { onConflict: 'user_id,provider' })

        if (error) {
            console.error('Error saving Google tokens:', error)
        } else {
            console.log('✅ Google Calendar tokens saved successfully!')
        }
    }

    if (loading) {
        return null // Or a loading spinner
    }

    return (
        <BrowserRouter>
            <AuthRedirectHandler />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={!session ? <Login /> : <Navigate to="/dashboard" replace />}
                />
                <Route
                    path="/access-denied"
                    element={<AccessDenied />}
                />
                <Route
                    path="/landing-page-test"
                    element={<LandingPageTest />}
                />
                <Route
                    path="/tests"
                    element={<Tests />}
                />
                <Route
                    path="/dashboard"
                    element={
                        session ? (
                            <SubscriptionGuard session={session}>
                                <Dashboard session={session} />
                            </SubscriptionGuard>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/admin"
                    element={session ? <AdminDashboard session={session} /> : <Navigate to="/login" replace />}
                />
                {/* Catch all - redirect to "/" */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
