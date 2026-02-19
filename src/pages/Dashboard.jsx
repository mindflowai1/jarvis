import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import CalendarAgenda from '../components/CalendarAgenda'
import PhoneNumberModal from '../components/PhoneNumberModal'
import VoiceAssistant from '../components/VoiceAssistant/VoiceAssistant'
import FinancialDashboard from '../components/FinancialDashboard'
import Tasks from '../components/Tasks'
import Settings from '../components/Settings'
import '../index.css'

const Dashboard = ({ session }) => {
    const [showPhoneModal, setShowPhoneModal] = useState(false)
    const [userProfile, setUserProfile] = useState(null)
    const [activeTab, setActiveTab] = useState('assistant')
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        if (session?.user?.id) {
            checkUserProfile(session.user.id)
        }
    }, [session])

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

    // Formata número para exibição: 5511999999999 -> +55 (11) 99999-9999
    const formatPhoneDisplay = (phone) => {
        if (!phone) return ''
        const numbers = phone.replace(/\D/g, '')

        if (numbers.length === 13 && numbers.startsWith('55')) {
            const ddd = numbers.slice(2, 4)
            const firstPart = numbers.slice(4, 9)
            const secondPart = numbers.slice(9, 13)
            return `+55 (${ddd}) ${firstPart}-${secondPart}`
        }

        if (numbers.length === 11) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
        }

        return phone
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

    return (
        <div className="dashboard-container">
            {showPhoneModal && (
                <PhoneNumberModal
                    session={session}
                    onSave={onPhoneSaved}
                    onClose={() => setShowPhoneModal(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="flex flex-col items-center gap-4 py-4 px-2">
                        <img src="/logo-controle-c.png" alt="Controle-C Logo" className="sidebar-logo object-contain" />
                        <h2 className="text-white text-2xl font-bold tracking-[0.15em] uppercase whitespace-nowrap" style={{ fontFamily: "'Rajdhani', sans-serif" }}>CONTROLE-C</h2>
                    </div>
                </div>

                <div className="user-profile">
                    <div className="avatar-large">
                        {session.user.user_metadata.avatar_url && !imageError ? (
                            <img
                                src={session.user.user_metadata.avatar_url}
                                alt="Profile"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="avatar-placeholder-large">
                                {(userProfile?.name?.[0] || session.user.email?.[0] || 'U').toUpperCase()}
                            </div>
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
                        className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('tasks'); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Afazeres
                    </a>
                    <a
                        href="#"
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Configurações
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
                    className={`mobile-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab('tasks'); }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Afazeres</span>
                </a>
                <a
                    href="#"
                    className={`mobile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Ajus.</span>
                </a>
            </nav>

            <main className="main-content">
                {activeTab === 'assistant' && <VoiceAssistant session={session} />}
                {activeTab === 'calendar' && <CalendarAgenda session={session} />}
                {activeTab === 'finance' && <FinancialDashboard />}
                {activeTab === 'tasks' && <Tasks session={session} />}
                {activeTab === 'settings' && <Settings session={session} />}
            </main>
        </div>
    )
}

export default Dashboard
