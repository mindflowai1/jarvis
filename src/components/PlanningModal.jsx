import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './PlanningModal.css'

const PlanningModal = ({ isOpen, onClose, onSave, onDelete, initialData = null }) => {
    const [formData, setFormData] = useState({
        tipo: 'installment', // Conforme imagem (Parcelado)
        description: '',
        valor: '',
        due_day: 15,
        categoria: 'Outros',
        start_date: new Date().toISOString().split('T')[0],
        installments_total: 12
    })
    const [loading, setLoading] = useState(false)

    // Pre-fill from initialData if redirected or editing
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const { id, ...other } = initialData;
                setFormData({
                    ...(id ? { id } : {}),
                    tipo: other.tipo || 'installment',
                    description: other.description || '',
                    valor: other.valor || '',
                    due_day: other.due_day || 15,
                    categoria: other.categoria || 'Outros',
                    start_date: other.start_date || new Date().toISOString().split('T')[0],
                    installments_total: other.installments_total || 12,
                    payment_method: other.payment_method || 'Dinheiro'
                })
            } else {
                // Reset for new item
                setFormData({
                    tipo: 'installment',
                    description: '',
                    valor: '',
                    due_day: 15,
                    categoria: 'Outros',
                    start_date: new Date().toISOString().split('T')[0],
                    installments_total: 12,
                    payment_method: 'Dinheiro'
                })
            }
        }
    }, [isOpen, initialData])

    const categories = [
        'Alimentação', 'Transporte', 'Lazer', 'Saúde', 
        'Educação', 'Moradia', 'Compras', 'Cuidados Pessoais', 
        'Outros', 'Recebimento'
    ]

    const handleDelete = async () => {
        if (window.confirm('Deseja realmente excluir este planejamento?')) {
            try {
                setLoading(true)
                await onDelete(formData.id)
                onClose()
            } catch (error) {
                console.error('Erro ao excluir planejamento:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.description || !formData.valor) return

        try {
            setLoading(true)
            await onSave({
                ...formData,
                valor: parseFloat(formData.valor),
                due_day: parseInt(formData.due_day),
                installments_total: formData.tipo === 'installment' ? parseInt(formData.installments_total) : null,
                payment_method: formData.payment_method || 'Dinheiro'
            })
            onClose()
        } catch (error) {
            console.error('Erro ao salvar planejamento:', error)
        } finally {
            setLoading(false)
        }
    }

    const getLabels = () => {
        switch(formData.tipo) {
            case 'installment':
                return {
                    description: 'Ex: TV Samsung, Curso Online...',
                    valor: 'Valor da Parcela',
                    date: 'Mês da 1ª Parcela'
                }
            case 'future_expense':
                return {
                    description: 'Ex: Dentista, Conserto carro...',
                    valor: 'Valor',
                    date: 'Mês do Gasto'
                }
            default: // subscription / fixo mensal
                return {
                    description: 'Ex: Plano de Saúde, Academia...',
                    valor: 'Valor',
                    date: 'Começa em'
                }
        }
    }

    const labels = getLabels()

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div 
                    className="planning-modal-content" 
                    onClick={e => e.stopPropagation()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                >
                    <div className="planning-modal-header">
                        <h2>{formData.id ? 'Editar Planejamento' : 'Novo Planejamento'}</h2>
                        <button className="close-btn" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="planning-form">
                        <div className="form-group">
                            <label>Tipo de Gasto</label>
                            <div className="type-selector">
                                <button 
                                    type="button"
                                    className={`type-option ${formData.tipo === 'subscription' ? 'active' : ''}`}
                                    onClick={() => setFormData({...formData, tipo: 'subscription'})}
                                >
                                    🔄 Fixo Mensal
                                </button>
                                <button 
                                    type="button"
                                    className={`type-option ${formData.tipo === 'installment' ? 'active' : ''}`}
                                    onClick={() => setFormData({...formData, tipo: 'installment'})}
                                >
                                    💳 Parcelado
                                </button>
                                <button 
                                    type="button"
                                    className={`type-option ${formData.tipo === 'future_expense' ? 'active' : ''}`}
                                    onClick={() => setFormData({...formData, tipo: 'future_expense'})}
                                >
                                    📌 Único
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Descrição</label>
                            <input 
                                type="text"
                                className="planning-input"
                                placeholder={labels.description}
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>

                        <div className="planning-grid">
                            <div className="form-group">
                                <label>{labels.valor}</label>
                                <div className="currency-field">
                                    <span className="prefix">R$</span>
                                    <input 
                                        type="number"
                                        className="planning-input"
                                        step="0.01"
                                        placeholder="0,00"
                                        value={formData.valor}
                                        onChange={e => setFormData({...formData, valor: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Dia Venc.</label>
                                <input 
                                    type="number"
                                    className="planning-input"
                                    min="1"
                                    max="31"
                                    placeholder="15"
                                    value={formData.due_day}
                                    onChange={e => setFormData({...formData, due_day: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Categoria</label>
                            <select 
                                className="planning-input"
                                value={formData.categoria}
                                onChange={e => setFormData({...formData, categoria: e.target.value})}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Forma de Pagamento</label>
                            <select 
                                className="planning-input"
                                value={formData.payment_method}
                                onChange={e => setFormData({...formData, payment_method: e.target.value})}
                            >
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Pix">Pix</option>
                                <option value="Débito">Débito</option>
                                <option value="Crédito">Crédito (Parcelado)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>{labels.date}</label>
                            <input 
                                type="date"
                                className="planning-input"
                                value={formData.start_date}
                                onChange={e => setFormData({...formData, start_date: e.target.value})}
                                required
                            />
                        </div>

                        {formData.tipo === 'installment' && (
                            <div className="form-group">
                                <label>Número de Parcelas</label>
                                <input 
                                    type="number"
                                    className="planning-input"
                                    min="2"
                                    max="60"
                                    placeholder="12"
                                    value={formData.installments_total}
                                    onChange={e => setFormData({...formData, installments_total: e.target.value})}
                                    required
                                />
                            </div>
                        )}
                    </form>

                    <div className="planning-actions">
                        {formData.id && (
                            <button 
                                type="button" 
                                className="btn-plan-delete" 
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                🗑️ Excluir
                            </button>
                        )}
                        <div className="action-buttons-right">
                            <button type="button" className="btn-plan-cancel" onClick={onClose}>
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                className="btn-plan-save" 
                                disabled={loading}
                                onClick={handleSubmit}
                            >
                                {loading ? 'Processando...' : (formData.id ? 'Salvar Alterações' : 'Salvar Planejamento')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default PlanningModal
