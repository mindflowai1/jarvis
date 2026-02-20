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

    useEffect(() => {
        if (isOpen) {
            if (initialEvent) {
                setTitle(initialEvent.summary || '')
                setDescription(initialEvent.description || '')
                setLocation(initialEvent.location || '')

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
