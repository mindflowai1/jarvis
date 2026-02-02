import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import './RecurringReminders.css'

const RecurringReminders = ({ isOpen, onClose }) => {
    const [reminders, setReminders] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({ summary: '', due_day: 1 })
    const [isAdding, setIsAdding] = useState(false)

    useEffect(() => {
        if (isOpen) {
            loadReminders()
        }
    }, [isOpen])

    const loadReminders = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('recurring_reminders')
                .select('*')
                .eq('is_active', true)
                .order('due_day', { ascending: true })

            if (error) throw error
            setReminders(data || [])
        } catch (error) {
            console.error('Error loading reminders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!formData.summary.trim()) return

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('recurring_reminders')
                    .update({
                        summary: formData.summary,
                        due_day: formData.due_day
                    })
                    .eq('id', editingId)

                if (error) throw error
            } else {
                // Insert
                const { error } = await supabase
                    .from('recurring_reminders')
                    .insert({
                        user_id: user.id,
                        summary: formData.summary,
                        due_day: formData.due_day
                    })

                if (error) throw error
            }

            setFormData({ summary: '', due_day: 1 })
            setEditingId(null)
            setIsAdding(false)
            loadReminders()
        } catch (error) {
            console.error('Error saving reminder:', error)
            alert('Erro ao salvar lembrete')
        }
    }

    const handleEdit = (reminder) => {
        setFormData({ summary: reminder.summary, due_day: reminder.due_day })
        setEditingId(reminder.id)
        setIsAdding(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Deseja excluir este lembrete?')) return

        try {
            const { error } = await supabase
                .from('recurring_reminders')
                .delete()
                .eq('id', id)

            if (error) throw error
            loadReminders()
        } catch (error) {
            console.error('Error deleting reminder:', error)
            alert('Erro ao excluir lembrete')
        }
    }

    const cancelEdit = () => {
        setFormData({ summary: '', due_day: 1 })
        setEditingId(null)
        setIsAdding(false)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="reminders-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        className="reminders-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="reminders-header">
                            <div>
                                <h2>📅 Lembretes Recorrentes</h2>
                                <p>Gerencie suas cobranças mensais fixas</p>
                            </div>
                            <button className="close-btn" onClick={onClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="reminders-content">
                            {/* Add/Edit Form */}
                            <AnimatePresence>
                                {isAdding ? (
                                    <motion.div
                                        className="reminder-form"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Ex: Aluguel, Netflix, Plano de Celular..."
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            autoFocus
                                        />
                                        <div className="day-selector">
                                            <label>Dia do vencimento:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="31"
                                                value={formData.due_day}
                                                onChange={(e) => setFormData({ ...formData, due_day: parseInt(e.target.value) || 1 })}
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button className="cancel-btn" onClick={cancelEdit}>Cancelar</button>
                                            <button className="save-btn" onClick={handleSave}>
                                                {editingId ? 'Salvar' : 'Adicionar'}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <button className="add-reminder-btn" onClick={() => setIsAdding(true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Novo Lembrete
                                    </button>
                                )}
                            </AnimatePresence>

                            {/* Reminders List */}
                            {loading ? (
                                <div className="loading-state">Carregando...</div>
                            ) : reminders.length === 0 ? (
                                <div className="empty-state">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                    <p>Nenhum lembrete cadastrado</p>
                                    <span>Adicione lembretes para suas contas recorrentes</span>
                                </div>
                            ) : (
                                <div className="reminders-list">
                                    {reminders.map((reminder) => (
                                        <motion.div
                                            key={reminder.id}
                                            className="reminder-card"
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                        >
                                            <div className="reminder-day">
                                                <span className="day-number">{reminder.due_day}</span>
                                                <span className="day-label">dia</span>
                                            </div>
                                            <div className="reminder-info">
                                                <h3>{reminder.summary}</h3>
                                                <p>Vence todo dia {reminder.due_day}</p>
                                            </div>
                                            <div className="reminder-actions">
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleEdit(reminder)}
                                                    title="Editar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(reminder.id)}
                                                    title="Excluir"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default RecurringReminders
