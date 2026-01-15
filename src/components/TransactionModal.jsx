import { useState, useEffect } from 'react'
import './TransactionModal.css'

const TransactionModal = ({ isOpen, onClose, onSave, transaction, categories = [] }) => {
    const [formData, setFormData] = useState({
        valor: '',
        tipo: 'saida',
        categoria: '',
        summary: '',
        created_at: new Date().toISOString().split('T')[0]
    })
    const [loading, setLoading] = useState(false)

    // Pre-fill form when transaction prop changes
    useEffect(() => {
        if (transaction) {
            setFormData({
                valor: transaction.valor,
                tipo: transaction.tipo,
                categoria: transaction.categoria,
                summary: transaction.summary || '',
                created_at: transaction.created_at.split('T')[0]
            })
        } else {
            // Reset for new transaction
            setFormData({
                valor: '',
                tipo: 'saida',
                categoria: '',
                summary: '',
                created_at: new Date().toISOString().split('T')[0]
            })
        }
    }, [transaction, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSave({
                ...formData,
                valor: parseFloat(formData.valor) // Ensure number
            })
            onClose()
        } catch (error) {
            console.error('Error saving transaction:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const uniqueCategories = Array.from(new Set([...categories, formData.categoria].filter(Boolean))).sort()

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{transaction ? 'Editar Transação' : 'Nova Transação'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="transaction-form">
                    <div className="form-group">
                        <label>Tipo</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="saida">Saída (Despesa)</option>
                            <option value="entrada">Entrada (Receita)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Valor (R$)</label>
                        <input
                            type="number"
                            name="valor"
                            step="0.01"
                            value={formData.valor}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="0,00"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <input
                            type="text"
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Ex: Almoço, Salário, Uber..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Categoria</label>
                        <input
                            type="text"
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            className="form-input"
                            list="categories-list"
                            placeholder="Ex: Alimentação, Transporte"
                            required
                        />
                        <datalist id="categories-list">
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                    </div>

                    <div className="form-group">
                        <label>Data</label>
                        <input
                            type="date"
                            name="created_at"
                            value={formData.created_at}
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

export default TransactionModal
