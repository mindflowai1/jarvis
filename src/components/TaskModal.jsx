import { useState, useEffect } from 'react'
import './TaskModal.css'

const TaskModal = ({ isOpen, onClose, onSave, task, projects }) => {
    const [formData, setFormData] = useState({
        text: '',
        prazo: new Date().toISOString().split('T')[0],
        project_id: ''
    })
    const [loading, setLoading] = useState(false)

    // Pre-fill form when task prop changes
    useEffect(() => {
        if (task) {
            setFormData({
                text: task.content || task.text || '',
                prazo: task.prazo || '',
                project_id: task.project_id || (projects.length > 0 ? (projects[0].id || '') : '')
            })
        } else {
            // Reset for new task
            setFormData({
                text: '',
                prazo: '',
                project_id: projects.length > 0 ? (projects[0].id || '') : ''
            })
        }
    }, [task, isOpen, projects])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.text.trim()) return

        setLoading(true)
        try {
            await onSave({
                ...formData,
                prazo: formData.prazo || null // Garante que salve como null se estiver vazio
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
                    <h2>{task?.id ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
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
                        <label>Projeto</label>
                        <select
                            name="project_id"
                            value={formData.project_id}
                            onChange={handleChange}
                            className="form-input"
                            required
                        >
                            <option value="" disabled>Selecione um projeto</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <div className="label-with-action">
                            <label>Prazo (Opcional)</label>
                            {formData.prazo && (
                                <button 
                                    type="button" 
                                    className="btn-clear-date" 
                                    onClick={() => setFormData(prev => ({ ...prev, prazo: '' }))}
                                >
                                    Remover prazo
                                </button>
                            )}
                        </div>
                        <input
                            type="date"
                            name="prazo"
                            value={formData.prazo}
                            onChange={handleChange}
                            className="form-input"
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
