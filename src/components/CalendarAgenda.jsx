import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import EventList from './EventList'
import EventModal from './EventModal'
import MobileCalendarAgenda from './CalendarAgenda/MobileCalendarAgenda'
import './CalendarAgenda.css'

const CalendarAgenda = ({ session }) => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()))
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

    // Mobile State
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [mobileWeekStart, setMobileWeekStart] = useState(getStartOfWeek(new Date()))

    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
    }

    const getDayEvents = (date) => {
        return events.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date)
            return isSameDay(eventDate, date)
        })
    }

    // Calendar Connection State
    const [isCalendarConnected, setIsCalendarConnected] = useState(false)
    const [checkingConnection, setCheckingConnection] = useState(true)
    const [connectingCalendar, setConnectingCalendar] = useState(false)

    // CRUD State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)

    const accessTokenCache = useRef(null)
    const timeGridRef = useRef(null)
    const HOUR_HEIGHT = 120 // Altura em pixels de cada hora
    const [currentTime, setCurrentTime] = useState(new Date())

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    function getStartOfWeek(date) {
        const d = new Date(date)
        const diff = d.getDate() - 3
        return new Date(d.setDate(diff))
    }

    function addDays(date, days) {
        const result = new Date(date)
        result.setDate(result.getDate() + days)
        return result
    }

    const getValidAccessToken = async () => {
        if (accessTokenCache.current) return accessTokenCache.current

        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
        const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET

        if (!clientId || !clientSecret) {
            console.error('❌ Missing Google OAuth environment variables directly in client code.')
            console.error('Please ensure VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_CLIENT_SECRET are set in your environment.')
            throw new Error('Configuration error: Missing Google OAuth credentials.')
        }

        const { data: integration, error: dbError } = await supabase
            .from('user_integrations')
            .select('refresh_token')
            .eq('user_id', session.user.id)
            .eq('provider', 'google')
            .single()

        if (dbError || !integration?.refresh_token) {
            throw new Error('No refresh token found. Please re-login with Google.')
        }

        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    refresh_token: integration.refresh_token,
                    grant_type: 'refresh_token'
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})) // Try to parse error body
                console.error('❌ Failed to refresh access token. Status:', response.status, 'Response:', errorData)
                throw new Error(`Failed to refresh access token properties. Google API returned ${response.status}.`)
            }

            const data = await response.json()
            accessTokenCache.current = data.access_token
            return data.access_token
        } catch (error) {
            console.error('❌ Error refreshing token:', error)
            throw error
        }
    }

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
        }
    }

    const handleConnectGoogle = async () => {
        setConnectingCalendar(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard?tab=agenda`,
                    scopes: 'https://www.googleapis.com/auth/calendar',
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            })

            if (error) {
                console.error('Error connecting to Google:', error)
                setError('Erro ao conectar com Google Calendar')
            }
        } catch (err) {
            console.error('Error:', err)
            setError('Erro ao conectar com Google Calendar')
        } finally {
            setConnectingCalendar(false)
        }
    }

    const fetchEvents = async () => {
        if (!session?.user) return

        setLoading(true)
        setCheckingConnection(true)
        try {
            // SEMPRE verificar se está conectado antes de buscar eventos
            const connected = await checkCalendarConnection()
            if (!connected) {
                setLoading(false)
                setCheckingConnection(false)
                setEvents([]) // Limpar eventos se desconectado
                return
            }

            const accessToken = await getValidAccessToken()

            // Calculate a safe fetch window that covers both Desktop and Mobile weeks
            // Get the earliest and latest dates from both desktop and mobile views
            const desktopStart = weekStart
            const desktopEnd = addDays(weekStart, 6)
            const mobileStart = mobileWeekStart
            const mobileEnd = addDays(mobileWeekStart, 6)

            // Start from the earliest required date
            const start = desktopStart < mobileStart ? desktopStart : mobileStart
            start.setHours(0, 0, 0, 0)

            // End at the latest required date with buffer for navigation
            const latestEnd = desktopEnd > mobileEnd ? desktopEnd : mobileEnd
            const end = addDays(latestEnd, 14) // Add 2 week buffer for smooth navigation
            end.setHours(23, 59, 59, 999)

            const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&singleEvents=true&orderBy=startTime`

            let response = await fetch(url, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            if (response.status === 401) {
                accessTokenCache.current = null
                const newAccessToken = await getValidAccessToken()
                response = await fetch(url, {
                    headers: { Authorization: `Bearer ${newAccessToken}` }
                })
            }

            if (!response.ok) throw new Error('Failed to fetch events from Google Calendar')

            const data = await response.json()
            setEvents((data.items || []).filter(e => e.eventType !== 'birthday'))
            setError(null)
        } catch (err) {
            console.error('Fetch error:', err)
            setError(err.message || 'Não foi possível carregar a agenda.')
        } finally {
            setLoading(false)
            setCheckingConnection(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [session, weekStart, mobileWeekStart])

    // Re-verificar conexão quando componente é montado ou quando volta para a aba
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Quando a aba volta a ficar visível, re-verifica conexão
                checkCalendarConnection().then(connected => {
                    if (!connected) {
                        setIsCalendarConnected(false)
                        setEvents([])
                    }
                })
            }
        }

        // Re-verificar ao montar o componente
        checkCalendarConnection()

        // Escutar quando a aba fica visível novamente
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    // CRUD Operations
    const handleCreateEvent = async (eventData) => {
        try {
            const accessToken = await getValidAccessToken()
            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            })

            if (!response.ok) throw new Error('Failed to create event')

            setIsModalOpen(false)
            fetchEvents() // Refresh list
        } catch (error) {
            console.error('Error creating event:', error)
            alert('Erro ao criar evento')
        }
    }

    const handleUpdateEvent = async (eventData) => {
        if (!selectedEvent) return

        try {
            const accessToken = await getValidAccessToken()
            const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${selectedEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            })

            if (!response.ok) throw new Error('Failed to update event')

            setIsModalOpen(false)
            setSelectedEvent(null)
            fetchEvents() // Refresh list
        } catch (error) {
            console.error('Error updating event:', error)
            alert('Erro ao atualizar evento')
        }
    }

    const handleDeleteEvent = async () => {
        if (!selectedEvent || !confirm('Deseja excluir este evento?')) return

        try {
            const accessToken = await getValidAccessToken()
            const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${selectedEvent.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            if (!response.ok) throw new Error('Failed to delete event')

            setIsModalOpen(false)
            setSelectedEvent(null)
            fetchEvents() // Refresh list
        } catch (error) {
            console.error('Error deleting event:', error)
            alert('Erro ao excluir evento')
        }
    }

    // Abordagem reforçada para garantir o scroll no horário atual
    const performScrollToNow = (behavior = 'auto') => {
        if (!timeGridRef.current) return

        const now = new Date()
        const isCurrentWeek = weekDays.some(d => isSameDay(d, now))

        // Foca no horário atual se for a semana de hoje, caso contrário foca no horário comercial (8h)
        const targetHour = isCurrentWeek ? now.getHours() : 8
        const targetMin = isCurrentWeek ? now.getMinutes() : 0

        // Calcula a posição (150px de margem no topo para contexto)
        const position = (targetHour * HOUR_HEIGHT) + (targetMin * HOUR_HEIGHT / 60) - 150
        const finalPos = Math.max(0, position)

        console.log('Scrolling to position:', finalPos, 'isCurrentWeek:', isCurrentWeek)

        try {
            timeGridRef.current.scrollTo({
                top: finalPos,
                behavior: behavior
            })
        } catch (e) {
            timeGridRef.current.scrollTop = finalPos
        }
    }

    useEffect(() => {
        if (!loading && viewMode === 'grid' && timeGridRef.current) {
            // Sequência de tentativas para garantir que o scroll aconteça após o render completo
            const timers = [
                setTimeout(() => performScrollToNow('auto'), 100),   // Imediato sem animação
                setTimeout(() => performScrollToNow('smooth'), 500), // Suave após renderização
                setTimeout(() => performScrollToNow('smooth'), 1500) // Backup extra
            ]

            return () => timers.forEach(t => clearTimeout(t))
        }
    }, [loading, viewMode, weekStart, events.length])


    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    const mobileDays = Array.from({ length: 7 }, (_, i) => addDays(mobileWeekStart, i))
    const hours = Array.from({ length: 24 }, (_, i) => i)

    const getEventPosition = (event) => {
        const start = new Date(event.start.dateTime || event.start.date)
        const end = new Date(event.end.dateTime || event.end.date)

        // Calcula a diferença de dias entre a data do evento e o inicio da semana que esta em exibicao
        const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const weekStartDay = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
        const dayOffset = Math.round((startDay - weekStartDay) / (1000 * 60 * 60 * 24));

        const startHour = start.getHours()
        const startMin = start.getMinutes()
        const endHour = end.getHours()
        const endMin = end.getMinutes()

        const dayWidth = 100 / 7
        const left = dayOffset * dayWidth
        const top = (startHour * HOUR_HEIGHT) + (startMin * HOUR_HEIGHT / 60)

        const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
        const height = Math.max(durationMinutes * HOUR_HEIGHT / 60, 40) // Minimum 40px

        return {
            left: `${left}%`,
            width: `${dayWidth}%`,
            top: `${top}px`,
            height: `${height}px`
        }
    }

    const navigateWeek = (direction) => {
        setWeekStart(addDays(weekStart, direction * 7))
    }

    const navigateMobileWeek = (direction) => {
        setMobileWeekStart(addDays(mobileWeekStart, direction * 7))
    }

    const goToToday = () => {
        const today = new Date()
        setWeekStart(getStartOfWeek(today))
        setMobileWeekStart(getStartOfWeek(today))
        setSelectedDate(today)
    }

    if (checkingConnection) {
        return <div className="calendar-wrapper"><div className="calendar-loading">Verificando conexão...</div></div>
    }

    if (!isCalendarConnected) {
        return (
            <div className="calendar-wrapper">
                <div className="calendar-connection-card">
                    <div className="connection-icon">📅</div>
                    <h2 className="connection-title">Conecte sua Agenda do Google</h2>
                    <p className="connection-description">
                        Para visualizar e gerenciar seus eventos, conecte sua conta Google Calendar.
                        Seus dados permanecerão seguros e você poderá desconectar a qualquer momento.
                    </p>

                    <button
                        className="connect-google-btn-calendar"
                        onClick={handleConnectGoogle}
                        disabled={connectingCalendar}
                    >
                        <svg className="google-icon-calendar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        {connectingCalendar ? 'Conectando...' : 'Conectar Google Calendar'}
                    </button>

                    <div className="connection-features">
                        <div className="feature-item">
                            <span className="feature-icon">✓</span>
                            <span>Sincronização em tempo real</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">✓</span>
                            <span>Criação e edição de eventos</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">✓</span>
                            <span>Visualização de agenda semanal</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (loading && events.length === 0) {
        return <div className="calendar-wrapper"><div className="calendar-loading">Carregando agenda...</div></div>
    }

    if (error) {
        return <div className="calendar-wrapper"><div className="calendar-error">{error}</div></div>
    }



    // ... existing CRUD handlers ...

    return (
        <div className="calendar-wrapper">
            {/* ===== DESKTOP VIEW ===== */}
            <div className="cal-desktop-wrapper">
                <div className="calendar-controls">
                    <div className="nav-buttons">
                        <button onClick={() => navigateWeek(-1)}>&lt;</button>
                        <button className="today-btn-desktop" onClick={goToToday}>Hoje</button>
                        <button
                            className="focus-now-btn"
                            onClick={() => performScrollToNow('smooth')}
                            title="Focar no horário atual"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        <span>{weekStart.toLocaleDateString('pt-BR')} - {addDays(weekStart, 6).toLocaleDateString('pt-BR')}</span>
                        <button onClick={() => navigateWeek(1)}>&gt;</button>
                    </div>

                    <div className="control-buttons">
                        <button
                            className="primary-action-btn"
                            onClick={() => {
                                setSelectedEvent(null)
                                setIsModalOpen(true)
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Novo Agendamento
                        </button>

                        <button
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                            className="view-toggle-btn secondary-action-btn"
                        >
                            {viewMode === 'grid' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                </svg>
                            )}
                            <span>{viewMode === 'grid' ? 'Lista' : 'Grade'}</span>
                        </button>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <div className="calendar-grid-container">
                        <div className="calendar-header">
                            <div className="time-column-header"></div>
                            {weekDays.map((d, i) => (
                                <div key={i} className={`day-header-cell ${d.toDateString() === new Date().toDateString() ? 'today' : ''}`}>
                                    <div className="day-name">{d.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                                    <div className="day-num">{d.getDate()}</div>
                                </div>
                            ))}
                        </div>

                        <div className="calendar-time-grid" ref={timeGridRef}>
                            <div className="time-column">
                                {hours.map(h => (
                                    <div key={h} className="time-label">
                                        {h.toString().padStart(2, '0')}:00
                                    </div>
                                ))}
                            </div>

                            <div className="days-grid">
                                {weekDays.map((d, dayIndex) => (
                                    <div key={dayIndex} className={`day-column ${isSameDay(d, currentTime) ? 'today-column' : ''}`}>
                                        {hours.map(h => {
                                            const isPast = isSameDay(d, currentTime) && h < currentTime.getHours()
                                            const isCurrent = isSameDay(d, currentTime) && h === currentTime.getHours()

                                            return (
                                                <div
                                                    key={h}
                                                    className={`hour-cell ${isPast ? 'past-hour' : ''} ${isCurrent ? 'current-hour-cell' : ''}`}
                                                >
                                                    {isCurrent && <div className="hour-focus-glow" />}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}

                                {weekDays.some(d => isSameDay(d, currentTime)) && (
                                    <div
                                        className="current-time-indicator"
                                        style={{
                                            top: `${(currentTime.getHours() * HOUR_HEIGHT) + (currentTime.getMinutes() * HOUR_HEIGHT / 60)}px`
                                        }}
                                    >
                                        <div className="indicator-line"></div>
                                        <div className="indicator-dot">
                                            <span className="indicator-time">
                                                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {events.map(event => {
                                    const pos = getEventPosition(event)
                                    return (
                                        <div
                                            key={event.id}
                                            className="calendar-event"
                                            style={pos}
                                            onClick={() => {
                                                setSelectedEvent(event)
                                                setIsModalOpen(true)
                                            }}
                                        >
                                            <div className="event-title">{event.summary}</div>
                                            {event.start.dateTime && (
                                                <div className="event-time">
                                                    {new Date(event.start.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <EventList events={events} />
                )}
            </div>

            {/* ===== MOBILE VIEW ===== */}
            <div className="cal-mobile-wrapper">
                <MobileCalendarAgenda
                    events={events}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    mobileWeekStart={mobileWeekStart}
                    navigateMobileWeek={navigateMobileWeek}
                    goToToday={goToToday}
                    getDayEvents={getDayEvents}
                    isSameDay={isSameDay}
                    setSelectedEvent={setSelectedEvent}
                    setIsModalOpen={setIsModalOpen}
                    mobileDays={mobileDays}
                />
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={selectedEvent ? handleUpdateEvent : handleCreateEvent}
                onDelete={selectedEvent ? handleDeleteEvent : null}
                initialEvent={selectedEvent}
            />
        </div>
    )
}


export default CalendarAgenda

