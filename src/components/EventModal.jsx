import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './CalendarAgenda.css'

export default function EventModal({ isOpen, onClose, onSave, onDelete, initialEvent }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')

    useEffect(() => {
        if (isOpen) {
            if (initialEvent) {
                setTitle(initialEvent.summary || '')
                setDescription(initialEvent.description || '')
                setLocation(initialEvent.location || '')

                // Format dates for datetime-local input
                const startDate = new Date(initialEvent.start.dateTime || initialEvent.start.date)
                const endDate = new Date(initialEvent.end.dateTime || initialEvent.end.date)

                setStart(formatForInput(startDate))
                setEnd(formatForInput(endDate))
            } else {
                // Default new event: starts now, ends in 1 hour
                const now = new Date()
                now.setMinutes(0, 0, 0) // Round to nearest hour
                const nextHour = new Date(now)
                nextHour.setHours(now.getHours() + 1)

                setTitle('')
                setDescription('')
                setLocation('')
                setStart(formatForInput(now))
                setEnd(formatForInput(nextHour))
            }
        }
    }, [isOpen, initialEvent])

    const formatForInput = (date) => {
        if (!date) return ''
        const offset = date.getTimezoneOffset()
        const localDate = new Date(date.getTime() - (offset * 60 * 1000))
        return localDate.toISOString().slice(0, 16)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const eventData = {
            summary: title,
            description,
            location,
            start: { dateTime: new Date(start).toISOString() },
            end: { dateTime: new Date(end).toISOString() }
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

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Início</label>
                                    <input
                                        type="datetime-local"
                                        value={start}
                                        onChange={(e) => setStart(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Fim</label>
                                    <input
                                        type="datetime-local"
                                        value={end}
                                        onChange={(e) => setEnd(e.target.value)}
                                        required
                                        min={start}
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
