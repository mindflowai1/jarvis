import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './index.css'
import CalendarAgenda from './components/CalendarAgenda'
import PhoneNumberModal from './components/PhoneNumberModal'
import VoiceAssistant from './components/VoiceAssistant/VoiceAssistant'
import FinancialDashboard from './components/FinancialDashboard'

function App() {
    const [session, setSession] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [showPhoneModal, setShowPhoneModal] = useState(false)
    const [userProfile, setUserProfile] = useState(null)
    const [activeTab, setActiveTab] = useState('assistant')

    // Formata número para exibição: 5511999999999 -> +55 (11) 99999-9999
    const formatPhoneDisplay = (phone) => {
        if (!phone) return ''
        const numbers = phone.replace(/\D/g, '')

        // Se tem 13 dígitos, assume que tem código do país (55)
        if (numbers.length === 13 && numbers.startsWith('55')) {
            const ddd = numbers.slice(2, 4)
            const firstPart = numbers.slice(4, 9)
            const secondPart = numbers.slice(9, 13)
            return `+55 (${ddd}) ${firstPart}-${secondPart}`
        }

        // Se tem 11 dígitos, formato sem código do país
        if (numbers.length === 11) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
        }

        // Retorna o número original se não corresponder aos formatos esperados
        return phone
    }

    useEffect(() => {
        setLoaded(true)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session) {
                saveTokens(session)
                checkUserProfile(session.user.id)
            }
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) {
                saveTokens(session)
                checkUserProfile(session.user.id)
            } else {
                setUserProfile(null)
                setShowPhoneModal(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const checkUserProfile = async (userId) => {
        console.log('🔍 Checking user profile for:', userId)
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error checking profile:', error)
                return
            }

            // Se não tem perfil ou não tem telefone, mostra modal
            if (!data || !data.phone_number) {
                console.log('⚠️ No profile or phone found, showing modal')
                setShowPhoneModal(true)
            } else {
                console.log('✅ Profile found:', data)
                setUserProfile(data)
                setShowPhoneModal(false)
            }
        } catch (err) {
            console.error('Unexpected error checking profile:', err)
        }
    }

    const saveTokens = async (session) => {
        if (session?.provider_token) {
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
                .upsert(updates, { onConflict: 'user_id, provider' })

            if (error) {
                console.error('Error saving tokens:', error.message)
            } else {
                console.log('Tokens saved successfully to database!')
            }
        }
    }

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.readonly',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
        if (error) console.error('Error logging in:', error.message)
    }

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.error('Error logging out:', error.message)
    }

    const onPhoneSaved = () => {
        if (session?.user?.id) {
            checkUserProfile(session.user.id)
        }
    }

    if (!session) {
        return (
            <div className="app-container">
                <div className="bg-glow top-left"></div>
                <div className="bg-glow bottom-right"></div>

                <div className={`login-card ${loaded ? 'fade-in' : ''}`}>
                    <div className="logo-area">
                        <img src="/logo.png" alt="Jarvis Logo" className="login-logo" />
                    </div>

                    <div className="text-content">
                        <h1>Bem-vindo de volta</h1>
                        <p>Acesse sua conta para continuar</p>
                    </div>

                    <button onClick={handleGoogleLogin} className="google-btn">
                        <div className="icon-wrapper">
                            <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                        </div>
                        <span>Entrar com Google</span>
                    </button>
                </div>

                <div className="footer-credits">
                    <p>Secure System © 2026</p>
                </div>
            </div>
        )
    }

    // Full-screen dashboard layout
    return (
        <div className="dashboard-container">
            {showPhoneModal && (
                <PhoneNumberModal session={session} onSave={onPhoneSaved} />
            )}

            {/* Desktop Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src="/logo.png" alt="Jarvis Logo" className="sidebar-logo" />
                </div>

                <div className="user-profile">
                    <div className="avatar-large">
                        {session.user.user_metadata.avatar_url ? (
                            <img src={session.user.user_metadata.avatar_url} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder-large">{session.user.email[0].toUpperCase()}</div>
                        )}
                    </div>
                    <h3>{userProfile?.name || session.user.user_metadata.full_name || 'Usuário'}</h3>
                    <p className="user-email">{session.user.email}</p>
                    {userProfile && userProfile.phone_number && (
                        <div className="user-phone-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            {formatPhoneDisplay(userProfile.phone_number)}
                        </div>
                    )}
                </div>

                <nav className="sidebar-nav">
                    <a
                        href="#"
                        className={`nav-item ${activeTab === 'assistant' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('assistant'); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                        </svg>
                        Assistente
                    </a>
                    <a
                        href="#"
                        className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('calendar'); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Agenda
                    </a>
                    <a
                        href="#"
                        className={`nav-item ${activeTab === 'finance' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('finance'); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Financeiro
                    </a>
                    <a
                        href="#"
                        className={`nav-item ${activeTab === 'email' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('email'); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        Email
                    </a>
                </nav>

                <button onClick={handleLogout} className="logout-btn-sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Sair
                </button>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-nav">
                <a
                    href="#"
                    className={`mobile-nav-item ${activeTab === 'assistant' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab('assistant'); }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <span>Assistente</span>
                </a>
                <a
                    href="#"
                    className={`mobile-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab('calendar'); }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span>Agenda</span>
                </a>
                <a
                    href="#"
                    className={`mobile-nav-item ${activeTab === 'finance' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab('finance'); }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Financeiro</span>
                </a>
                <a
                    href="#"
                    className={`mobile-nav-item ${activeTab === 'email' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab('email'); }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <span>Email</span>
                </a>
            </nav>

            <main className="main-content">
                {activeTab === 'assistant' && <VoiceAssistant session={session} />}
                {activeTab === 'calendar' && <CalendarAgenda session={session} />}
                {activeTab === 'finance' && <FinancialDashboard />}
                {activeTab === 'email' && (
                    <div className="coming-soon">
                        <h2>Email</h2>
                        <p>Em breve...</p>
                    </div>
                )}
            </main>
        </div>
    )
}

export default App
