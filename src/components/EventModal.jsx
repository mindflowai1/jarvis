import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './CalendarAgenda.css'

export default function EventModal({ isOpen, onClose, onSave, onDelete, initialEvent }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')

    // Split state for separate inputs
    const [startDate, setStartDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endDate, setEndDate] = useState('')
    const [endTime, setEndTime] = useState('')

    // Meet Link states
    const [generateMeetLink, setGenerateMeetLink] = useState(false)
    const [existingMeetLink, setExistingMeetLink] = useState('')

    useEffect(() => {
        if (isOpen) {
            setGenerateMeetLink(false)
            if (initialEvent) {
                setTitle(initialEvent.summary || '')
                setDescription(initialEvent.description || '')
                setLocation(initialEvent.location || '')
                setExistingMeetLink(initialEvent.hangoutLink || '')

                // Format dates for inputs
                const startObj = new Date(initialEvent.start.dateTime || initialEvent.start.date)
                const endObj = new Date(initialEvent.end.dateTime || initialEvent.end.date)

                const { date: sDate, time: sTime } = formatDateTime(startObj)
                const { date: eDate, time: eTime } = formatDateTime(endObj)

                setStartDate(sDate)
                setStartTime(sTime)
                setEndDate(eDate)
                setEndTime(eTime)
            } else {
                // Default new event: starts now, ends in 1 hour
                const now = new Date()
                now.setMinutes(0, 0, 0) // Round to nearest hour
                const nextHour = new Date(now)
                nextHour.setHours(now.getHours() + 1)

                const { date: sDate, time: sTime } = formatDateTime(now)
                const { date: eDate, time: eTime } = formatDateTime(nextHour)

                setTitle('')
                setDescription('')
                setLocation('')
                setExistingMeetLink('')
                setStartDate(sDate)
                setStartTime(sTime)
                setEndDate(eDate)
                setEndTime(eTime)
            }
        }
    }, [isOpen, initialEvent])

    const formatDateTime = (date) => {
        if (!date) return { date: '', time: '' }
        const offset = date.getTimezoneOffset()
        const localDate = new Date(date.getTime() - (offset * 60 * 1000))
        const iso = localDate.toISOString()
        return {
            date: iso.slice(0, 10),
            time: iso.slice(11, 16)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const startDateTime = new Date(`${startDate}T${startTime}:00`)
        const endDateTime = new Date(`${endDate}T${endTime}:00`)

        const eventData = {
            summary: title,
            description,
            location,
            start: { dateTime: startDateTime.toISOString() },
            end: { dateTime: endDateTime.toISOString() }
        }

        if (generateMeetLink && !existingMeetLink) {
            eventData.conferenceData = {
                createRequest: {
                    requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet'
                    }
                }
            }
        }

        onSave(eventData)
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-container event-modal"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>{initialEvent ? 'Editar Evento' : 'Novo Evento'}</h3>
                            {initialEvent && onDelete && (
                                <button type="button" className="delete-btn-text" onClick={onDelete}>
                                    Excluir
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Título</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Nome do evento"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Início</label>
                                <div className="form-row" style={{ display: 'flex', gap: '12px' }}>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                        style={{ flex: 2 }}
                                    />
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Fim</label>
                                <div className="form-row" style={{ display: 'flex', gap: '12px' }}>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                        min={startDate}
                                        style={{ flex: 2 }}
                                    />
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>

                            {existingMeetLink ? (
                                <div className="form-group meet-link-group">
                                    <label>Videoconferência</label>
                                    <div className="meet-link-display" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'var(--light-bg, #f8f9fa)', borderRadius: '8px', border: '1px solid var(--border-color, #eaeaea)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: '#1a73e8' }}>
                                            <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 5.532c.12-.131.312-.11.41.056l1.966 3.342a2.25 2.25 0 010 2.227l-1.966 3.342c-.098.167-.29.187-.41.056L17.25 12.9V11.1l2.69-5.568z" />
                                        </svg>
                                        <a href={existingMeetLink} target="_blank" rel="noopener noreferrer" style={{ flex: 1, color: '#1a73e8', textDecoration: 'none', fontWeight: 500, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            Entrar no Google Meet
                                        </a>
                                        <button 
                                            type="button" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigator.clipboard.writeText(existingMeetLink);
                                                e.target.closest('button').style.color = '#2ecc71';
                                                setTimeout(() => { if(e.target.closest('button')) e.target.closest('button').style.color = '#666' }, 2000);
                                            }}
                                            title="Copiar link"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px', display: 'flex', alignItems: 'center' }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="form-group meet-link-group">
                                    <label>Videoconferência</label>
                                    <label className="meet-toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--light-bg, #f8f9fa)', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color, #eaeaea)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', background: generateMeetLink ? '#1a73e8' : '#ccc', borderRadius: '4px', transition: 'all 0.2s' }}>
                                            {generateMeetLink && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px', color: 'white' }}>
                                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={generateMeetLink}
                                            onChange={(e) => setGenerateMeetLink(e.target.checked)}
                                            style={{ display: 'none' }}
                                        />
                                        <span className="meet-toggle-text" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dark-text, #333)', fontSize: '14px', fontWeight: generateMeetLink ? 500 : 400 }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px', color: generateMeetLink ? '#1a73e8' : '#666' }}>
                                                <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 5.532c.12-.131.312-.11.41.056l1.966 3.342a2.25 2.25 0 010 2.227l-1.966 3.342c-.098.167-.29.187-.41.056L17.25 12.9V11.1l2.69-5.568z" />
                                            </svg>
                                            Adicionar Google Meet
                                        </span>
                                    </label>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Local</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Adicionar local"
                                />
                            </div>

                            <div className="form-group">
                                <label>Descrição</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Adicionar descrição"
                                    rows={3}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={onClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="save-btn">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}
