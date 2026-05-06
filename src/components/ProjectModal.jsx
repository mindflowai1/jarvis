import { useState, useEffect } from 'react'
import './ProjectModal.css'

const PRESET_COLORS = [
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#14b8a6', // Teal
    '#64748b'  // Gray
]

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
    const [name, setName] = useState('')
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (project) {
            setName(project.name || '')
            setSelectedColor(project.color || PRESET_COLORS[0])
        } else {
            setName('')
            setSelectedColor(PRESET_COLORS[0])
        }
    }, [project, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return

        setLoading(true)
        try {
            await onSave({
                name: name.trim(),
                color: selectedColor
            })
            onClose()
        } catch (error) {
            console.error('Error saving project:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <div className="project-modal-content" onClick={e => e.stopPropagation()}>
                <div className="pm-header">
                    <h2>{project ? 'Editar Projeto' : 'Novo Projeto'}</h2>
                    <button className="pm-close-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="project-form">
                    <div className="pm-form-group">
                        <label>Nome do Projeto</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pm-input"
                            placeholder="Ex: Trabalho, Estudo, Casa..."
                            required
                        />
                    </div>

                    <div className="pm-form-group">
                        <label>Cor Identificadora</label>
                        <div className="color-grid">
                            {PRESET_COLORS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                    title={color}
                                >
                                    {selectedColor === color && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
                                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pm-footer">
                        <button type="button" className="pm-btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="pm-btn-save" disabled={loading}>
                            {loading ? 'Salvando...' : 'Criar Projeto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProjectModal
