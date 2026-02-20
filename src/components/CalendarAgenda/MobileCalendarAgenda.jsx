import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './MobileCalendarAgenda.css'

const MobileCalendarAgenda = ({
    events,
    selectedDate,
    setSelectedDate,
    mobileWeekStart,
    navigateMobileWeek,
    goToToday,
    getDayEvents,
    isSameDay,
    setSelectedEvent,
    setIsModalOpen,
    mobileDays
}) => {
    const stripRef = useRef(null)

    // Scroll selected day into view
    useEffect(() => {
        if (stripRef.current) {
            const sel = stripRef.current.querySelector('.mcal-day-pill.selected')
            if (sel) {
                sel.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }
        }
    }, [selectedDate])

    const dayEvents = getDayEvents(selectedDate)
        .sort((a, b) => new Date(a.start.dateTime || a.start.date) - new Date(b.start.dateTime || b.start.date))

    const formatTime = (dateStr) =>
        new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    const openNewEvent = () => {
        setSelectedEvent(null)
        setIsModalOpen(true)
    }

    const openEvent = (event) => {
        setSelectedEvent(event)
        setIsModalOpen(true)
    }

    return (
        <div className="mcal-root">
            {/* ===== STICKY HEADER ===== */}
            <header className="mcal-header">
                <div className="mcal-header-row">
                    <div className="mcal-header-left">
                        <button
                            className="mcal-nav-arrow"
                            onClick={() => navigateMobileWeek(-1)}
                            aria-label="Semana anterior"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        <h2 className="mcal-month-title">
                            {mobileWeekStart.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </h2>

                        <button
                            className="mcal-nav-arrow"
                            onClick={() => navigateMobileWeek(1)}
                            aria-label="Próxima semana"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>

                    <div className="mcal-header-right">
                        <button className="mcal-today-chip" onClick={goToToday}>
                            Hoje
                        </button>
                        <button className="mcal-add-btn" onClick={openNewEvent} aria-label="Novo evento">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ===== DAY STRIP ===== */}
                <div className="mcal-day-strip" ref={stripRef}>
                    {mobileDays.map((d, i) => {
                        const isSelected = isSameDay(d, selectedDate)
                        const isToday = isSameDay(d, new Date())
                        const hasEvents = events.some(e =>
                            isSameDay(new Date(e.start.dateTime || e.start.date), d)
                        )

                        return (
                            <button
                                key={i}
                                className={`mcal-day-pill ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                onClick={() => setSelectedDate(d)}
                            >
                                <span className="mcal-day-label">
                                    {d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase()}
                                </span>
                                <span className="mcal-day-num">{d.getDate()}</span>
                                {hasEvents && <span className="mcal-event-dot" />}
                            </button>
                        )
                    })}
                </div>
            </header>

            {/* ===== EVENT LIST ===== */}
            <div className="mcal-content">
                <div className="mcal-list-header">
                    <h3>
                        {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                </div>

                {dayEvents.length === 0 ? (
                    <div className="mcal-empty">
                        <div className="mcal-empty-icon">📅</div>
                        <p>Nenhum compromisso para esse dia</p>
                        <button className="mcal-empty-cta" onClick={openNewEvent}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="20" height="20">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            NOVO EVENTO
                        </button>
                    </div>
                ) : (
                    <div className="mcal-timeline">
                        {dayEvents.map((event, idx) => (
                            <motion.div
                                key={event.id}
                                className="mcal-event-card"
                                onClick={() => openEvent(event)}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.25 }}
                            >
                                <div className="mcal-event-time">
                                    <span className="mcal-time-label">
                                        {event.start.dateTime ? formatTime(event.start.dateTime) : 'Dia todo'}
                                    </span>
                                    <div className="mcal-time-line" />
                                </div>
                                <div className="mcal-event-body">
                                    <h4>{event.summary}</h4>
                                    {event.location && (
                                        <span className="mcal-event-location">📍 {event.location}</span>
                                    )}
                                    {event.start.dateTime && event.end.dateTime && (
                                        <span className="mcal-event-duration">
                                            {formatTime(event.start.dateTime)} — {formatTime(event.end.dateTime)}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MobileCalendarAgenda
