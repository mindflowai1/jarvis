import { useState, useEffect } from 'react'
import './TaskModal.css'

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
    const [formData, setFormData] = useState({
        text: '',
        prazo: new Date().toISOString().split('T')[0]
    })
    const [loading, setLoading] = useState(false)

    // Pre-fill form when task prop changes
    useEffect(() => {
        if (task) {
            setFormData({
                text: task.content || task.text || '',
                prazo: task.prazo || new Date().toISOString().split('T')[0]
            })
        } else {
            // Reset for new task
            setFormData({
                text: '',
                prazo: new Date().toISOString().split('T')[0]
            })
        }
    }, [task, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.text.trim()) return

        setLoading(true)
        try {
            await onSave({
                ...formData
            })
            onClose()
        } catch (error) {
            console.error('Error saving task:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="task-form">
                    <div className="form-group">
                        <label>Título da Tarefa</label>
                        <input
                            type="text"
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Ex: Pagar conta de luz"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Prazo</label>
                        <input
                            type="date"
                            name="prazo"
                            value={formData.prazo}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TaskModal
