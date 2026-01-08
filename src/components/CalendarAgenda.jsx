import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import EventList from './EventList'
import './CalendarAgenda.css'

const CalendarAgenda = ({ session }) => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()))
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const accessTokenCache = useRef(null)
    const timeGridRef = useRef(null)
    const HOUR_HEIGHT = 120 // Altura em pixels de cada hora

    function getStartOfWeek(date) {
        const d = new Date(date)
        const day = d.getDay()
        const diff = d.getDate() - day
        return new Date(d.setDate(diff))
    }

    function addDays(date, days) {
        const result = new Date(date)
        result.setDate(result.getDate() + days)
        return result
    }

    const getValidAccessToken = async () => {
        console.log('🔑 [getValidAccessToken] Starting...')
        
        if (accessTokenCache.current) {
            console.log('✅ [getValidAccessToken] Using cached token')
            return accessTokenCache.current
        }

        console.log('🔄 [getValidAccessToken] No cached token, fetching refresh token from DB')
        
        const { data: integration, error: dbError } = await supabase
            .from('user_integrations')
            .select('refresh_token')
            .eq('user_id', session.user.id)
            .eq('provider', 'google')
            .single()

        if (dbError || !integration?.refresh_token) {
            throw new Error('No refresh token found. Please re-login with Google.')
        }

        console.log('🔄 [getValidAccessToken] Requesting new access token from Google')
        
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
                client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
                refresh_token: integration.refresh_token,
                grant_type: 'refresh_token'
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('❌ [getValidAccessToken] Failed to refresh token:', errorData)
            throw new Error('Failed to refresh access token. Please re-login.')
        }

        const data = await response.json()
        accessTokenCache.current = data.access_token
        
        console.log('✅ [getValidAccessToken] New access token obtained and cached')
        return data.access_token
    }

    useEffect(() => {
        const fetchEvents = async () => {
            console.log('🔍 [CalendarAgenda] Starting fetchEvents...')

            if (!session?.user) {
                console.warn('⚠️ [CalendarAgenda] No user in session, aborting fetch')
                return
            }

            setLoading(true)

            try {
                const accessToken = await getValidAccessToken()

                const start = weekStart
                start.setHours(0, 0, 0, 0)

                const end = addDays(weekStart, 7)
                end.setHours(23, 59, 59, 999)

                const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&singleEvents=true&orderBy=startTime`
                console.log('🔍 [CalendarAgenda] Fetching URL:', url)

                let response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })

                console.log('🔍 [CalendarAgenda] Response status:', response.status)

                if (response.status === 401) {
                    console.log('⚠️ [CalendarAgenda] Token expired (401), refreshing and retrying...')
                    accessTokenCache.current = null
                    const newAccessToken = await getValidAccessToken()
                    
                    response = await fetch(url, {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`,
                        },
                    })
                    
                    console.log('🔍 [CalendarAgenda] Retry response status:', response.status)
                }

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error('❌ [CalendarAgenda] API Error:', errorText)
                    throw new Error('Failed to fetch events from Google Calendar')
                }

                const data = await response.json()
                console.log('🔍 [CalendarAgenda] Events received:', data.items?.length || 0)

                const filtered = (data.items || []).filter(e => e.eventType !== 'birthday')
                console.log('🔍 [CalendarAgenda] Events after filtering:', filtered.length)

                setEvents(filtered)
                setError(null)
                console.log('✅ [CalendarAgenda] Events set successfully')
            } catch (err) {
                console.error('❌ [CalendarAgenda] Fetch error:', err)
                setError(err.message || 'Não foi possível carregar a agenda.')
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [session, weekStart])

    useEffect(() => {
        if (!loading && timeGridRef.current && viewMode === 'grid') {
            setTimeout(() => {
                const now = new Date()
                const currentHour = now.getHours()
                const currentMinutes = now.getMinutes()
                
                const currentTimePosition = (currentHour * HOUR_HEIGHT) + (currentMinutes * HOUR_HEIGHT / 60)
                const containerHeight = timeGridRef.current.clientHeight
                const scrollPosition = currentTimePosition - (containerHeight / 2)
                
                console.log('🕐 Scroll to current time:', {
                    currentHour,
                    currentMinutes,
                    currentTimePosition,
                    containerHeight,
                    scrollPosition: Math.max(0, scrollPosition)
                })
                
                timeGridRef.current.scrollTo({
                    top: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                })
            }, 100)
        }
    }, [loading, viewMode])

    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    const hours = Array.from({ length: 24 }, (_, i) => i)

    // Calculate event position using absolute positioning
    const getEventPosition = (event) => {
        const start = new Date(event.start.dateTime || event.start.date)
        const end = new Date(event.end.dateTime || event.end.date)

        const dayOfWeek = start.getDay()
        const startHour = start.getHours()
        const startMin = start.getMinutes()
        const endHour = end.getHours()
        const endMin = end.getMinutes()

        // Calculate position
        const dayWidth = 100 / 7 // Each day is 1/7 of the width
        const left = dayOfWeek * dayWidth

        // Calculate top position (HOUR_HEIGHT px per hour)
        const top = (startHour * HOUR_HEIGHT) + (startMin * HOUR_HEIGHT / 60)

        // Calculate height
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

    if (loading && events.length === 0) {
        return (
            <div className="calendar-wrapper">
                <div className="calendar-loading">Carregando agenda...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="calendar-wrapper">
                <div className="calendar-error">{error}</div>
            </div>
        )
    }

    return (
        <div className="calendar-wrapper">
            <div className="calendar-controls">
                <div className="nav-buttons">
                    <button onClick={() => navigateWeek(-1)}>&lt;</button>
                    <span>{weekStart.toLocaleDateString('pt-BR')} - {addDays(weekStart, 6).toLocaleDateString('pt-BR')}</span>
                    <button onClick={() => navigateWeek(1)}>&gt;</button>
                </div>

                <div className="control-buttons">
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="view-toggle-btn"
                        title={viewMode === 'grid' ? 'Visualização em Lista' : 'Visualização em Grade'}
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
                    {/* Header */}
                    <div className="calendar-header">
                        <div className="time-column-header"></div>
                        {weekDays.map((d, i) => (
                            <div key={i} className={`day-header-cell ${d.toDateString() === new Date().toDateString() ? 'today' : ''}`}>
                                <div className="day-name">{d.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                                <div className="day-num">{d.getDate()}</div>
                            </div>
                        ))}
                    </div>

                    {/* Time grid */}
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
                                <div key={dayIndex} className="day-column">
                                    {hours.map(h => (
                                        <div key={h} className="hour-cell"></div>
                                    ))}
                                </div>
                            ))}

                            {/* Events overlay */}
                            {events.map(event => {
                                const pos = getEventPosition(event)
                                return (
                                    <div key={event.id} className="calendar-event" style={pos}>
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
    )
}

export default CalendarAgenda

