import { useState, useEffect } from 'react'
import './EventList.css'

const EventList = ({ events }) => {
    const [expandedEvent, setExpandedEvent] = useState(null)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Group events by date
    const groupEventsByDate = (events) => {
        const grouped = {}
        events.forEach(event => {
            const start = new Date(event.start.dateTime || event.start.date)
            const dateKey = start.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            if (!grouped[dateKey]) {
                grouped[dateKey] = []
            }
            grouped[dateKey].push(event)
        })
        return grouped
    }

    // Calculate time until event
    const getTimeUntil = (eventStart) => {
        const start = new Date(eventStart)
        const diff = start - currentTime

        if (diff < 0) return null

        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (hours > 24) {
            const days = Math.floor(hours / 24)
            return `em ${days}d ${hours % 24}h`
        }
        if (hours > 0) return `em ${hours}h ${minutes}m`
        return `em ${minutes}m`
    }

    // Get event status color
    const getEventStatus = (event) => {
        const start = new Date(event.start.dateTime || event.start.date)
        const end = new Date(event.end.dateTime || event.end.date)
        const now = currentTime

        if (now >= start && now <= end) {
            return { status: 'happening', color: 'var(--color-happening)' }
        }

        const diff = start - now
        const hoursUntil = diff / (1000 * 60 * 60)

        if (hoursUntil < 0) {
            return { status: 'past', color: 'var(--color-past)' }
        } else if (hoursUntil < 1) {
            return { status: 'soon', color: 'var(--color-soon)' }
        } else if (hoursUntil < 24) {
            return { status: 'today', color: 'var(--color-today)' }
        } else {
            return { status: 'upcoming', color: 'var(--color-upcoming)' }
        }
    }

    const groupedEvents = groupEventsByDate(events)

    return (
        <div className="event-list-container">
            {/* Animated background particles */}
            <div className="particles">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${5 + Math.random() * 10}s`
                    }} />
                ))}
            </div>

            <div className="event-list-content">
                {Object.entries(groupedEvents).map(([date, dateEvents], dateIndex) => (
                    <div
                        key={date}
                        className="event-date-group"
                        style={{ animationDelay: `${dateIndex * 0.1}s` }}
                    >
                        <div className="date-header">
                            <div className="date-line" />
                            <h2 className="date-title">{date}</h2>
                            <div className="date-line" />
                        </div>

                        <div className="events-grid">
                            {dateEvents.map((event, eventIndex) => {
                                const eventStatus = getEventStatus(event)
                                const isExpanded = expandedEvent === event.id
                                const timeUntil = getTimeUntil(event.start.dateTime || event.start.date)
                                const startTime = new Date(event.start.dateTime || event.start.date)
                                const endTime = new Date(event.end.dateTime || event.end.date)

                                return (
                                    <div
                                        key={event.id}
                                        className={`event-card ${eventStatus.status} ${isExpanded ? 'expanded' : ''}`}
                                        style={{
                                            animationDelay: `${(dateIndex * 0.1) + (eventIndex * 0.05)}s`,
                                            '--status-color': eventStatus.color
                                        }}
                                        onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                                    >
                                        {/* Status indicator */}
                                        <div className="event-status-indicator">
                                            {eventStatus.status === 'happening' && (
                                                <div className="pulse-ring" />
                                            )}
                                        </div>

                                        {/* Main content */}
                                        <div className="event-card-main">
                                            <div className="event-time-badge">
                                                <svg className="clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                    <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                <span>
                                                    {startTime.toLocaleTimeString('pt-BR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            <div className="event-info">
                                                <h3 className="event-title">{event.summary}</h3>
                                                {timeUntil && (
                                                    <div className="event-countdown">
                                                        <div className="countdown-dot" />
                                                        {timeUntil}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="event-actions">
                                                <button className="action-btn">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded details */}
                                        {isExpanded && (
                                            <div className="event-details">
                                                <div className="detail-row">
                                                    <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                        <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    <div>
                                                        <div className="detail-label">Horário</div>
                                                        <div className="detail-value">
                                                            {startTime.toLocaleTimeString('pt-BR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })} - {endTime.toLocaleTimeString('pt-BR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {event.description && (
                                                    <div className="detail-row">
                                                        <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" />
                                                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                        <div>
                                                            <div className="detail-label">Descrição</div>
                                                            <div className="detail-value">{event.description}</div>
                                                        </div>
                                                    </div>
                                                )}

                                                {event.location && (
                                                    <div className="detail-row">
                                                        <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" />
                                                            <circle cx="12" cy="10" r="3" strokeWidth="2" />
                                                        </svg>
                                                        <div>
                                                            <div className="detail-label">Local</div>
                                                            <div className="detail-value">{event.location}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Shimmer effect */}
                                        <div className="shimmer" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {events.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" />
                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" />
                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                            </svg>
                        </div>
                        <h3>Nenhum evento encontrado</h3>
                        <p>Não há eventos agendados para este período</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EventList
