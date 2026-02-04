import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './index.css'
import LandingPage from './components/LandingPage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

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
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={!session ? <Login /> : <Navigate to="/dashboard" replace />}
                />
                <Route
                    path="/dashboard"
                    element={session ? <Dashboard session={session} /> : <Navigate to="/login" replace />}
                />
                {/* Catch all - redirect to "/" */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
