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
        <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <div className="task-modal-content" onClick={e => e.stopPropagation()}>
                <div className="tm-header">
                    <h2>{task?.id ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
                    <button className="tm-close-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="task-form">
                    <div className="tm-form-group">
                        <label>Título da Tarefa</label>
                        <input
                            type="text"
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            className="tm-input"
                            placeholder="Ex: Pagar conta de luz"
                            required
                        />
                    </div>

                    <div className="tm-form-group">
                        <label>Projeto / Lista</label>
                        <div className="tm-select-wrapper">
                            <select
                                name="project_id"
                                value={formData.project_id}
                                onChange={handleChange}
                                className="tm-input tm-select"
                                required
                            >
                                <option value="" disabled>Selecione um projeto</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            <div className="tm-select-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="tm-form-group">
                        <div className="tm-label-with-action">
                            <label>Prazo (Opcional)</label>
                            {formData.prazo && (
                                <button 
                                    type="button" 
                                    className="tm-btn-clear-date" 
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
                            className="tm-input"
                        />
                    </div>

                    <div className="tm-footer">
                        <button type="button" className="tm-btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="tm-btn-save" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Tarefa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TaskModal
