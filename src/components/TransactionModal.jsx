import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { STANDARD_CATEGORIES } from '../utils/constants'
import './TransactionModal.css'

// Custom Minimalist Select Component
const CustomSelect = ({ value, options, onChange, placeholder, disabled = false, renderOption }) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef(null)

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (val) => {
        onChange(val)
        setIsOpen(false)
    }

    const selectedOption = options.find(opt => opt.value === value)

    return (
        <div className="custom-select-container" ref={selectRef}>
            <button
                type="button"
                className={`custom-select-trigger ${isOpen ? 'is-open' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                {selectedOption ? (
                    <span>{renderOption ? renderOption(selectedOption) : selectedOption.label}</span>
                ) : (
                    <span className="placeholder">{placeholder}</span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        className="custom-select-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                    >
                        {options.map((opt) => (
                            <div
                                key={opt.value}
                                className={`custom-option ${opt.value === value ? 'selected' : ''}`}
                                onClick={() => handleSelect(opt.value)}
                            >
                                {renderOption ? renderOption(opt) : opt.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const getIconForCategory = (category) => {
    switch (category?.toLowerCase()) {
        case 'alimentação': return '🍽️'
        case 'transporte': return '🚗'
        case 'lazer': return '🎉'
        case 'saúde': return '💊'
        case 'moradia': return '🏠'
        case 'compras': return '🛍️'
        case 'cuidados pessoais': return '💆'
        case 'educação': return '📚'
        case 'recebimento': return '💵'
        default: return '💸'
    }
}

// Pega a data no formato YYYY-MM-DD ignorando fuso
const getLocalYMD = (dateString = null) => {
    if (dateString) {
        // Separa '2026-03-01 00:00:00+00' por espaço ou T e pega a parte YYYY-MM-DD
        const [datePart] = dateString.split(/[T ]/);
        return datePart;
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TransactionModal = ({ isOpen, onClose, onSave, transaction, onDelete }) => {
    const [formData, setFormData] = useState({
        valor: '',
        tipo: 'saida',
        categoria: '',
        summary: '',
        created_at: getLocalYMD()
    })
    const [loading, setLoading] = useState(false)

    // Pre-fill form when transaction prop changes
    useEffect(() => {
        if (transaction && isOpen) {
            setFormData({
                valor: transaction.valor,
                tipo: transaction.tipo,
                categoria: transaction.categoria,
                summary: transaction.summary || '',
                created_at: getLocalYMD(transaction.created_at)
            })
        } else if (isOpen) {
            // Reset for new transaction
            setFormData({
                valor: '',
                tipo: 'saida',
                categoria: '',
                summary: '',
                created_at: getLocalYMD()
            })
        }
    }, [transaction, isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.valor || isNaN(parseFloat(formData.valor))) {
            return alert('Digite um valor válido.')
        }
        if (!formData.categoria) {
            return alert('Selecione uma categoria.')
        }

        setLoading(true)
        try {
            await onSave({
                ...formData,
                valor: parseFloat(formData.valor)
            })
            onClose()
        } catch (error) {
            console.error('Error saving transaction:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChangeTipo = (newTipo) => {
        setFormData(prev => ({
            ...prev,
            tipo: newTipo,
            categoria: newTipo === 'entrada' ? 'Recebimento' : (prev.categoria === 'Recebimento' ? '' : prev.categoria)
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const typeOptions = [
        { value: 'saida', label: 'Saída (Despesa)' },
        { value: 'entrada', label: 'Entrada (Receita)' }
    ]

    const categoryOptions = STANDARD_CATEGORIES
        .filter(cat => cat !== 'Recebimento')
        .sort()
        .map(cat => ({ value: cat, label: cat }))

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay" onMouseDown={onClose}>
                    <motion.div
                        className="modal-content minimal-modal"
                        onMouseDown={e => e.stopPropagation()}
                        initial={{ scale: 0.95, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 15 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    >
                        <div className="modal-header">
                            <h2>{transaction ? 'Editar Registro' : 'Novo Registro'}</h2>
                            <button className="close-btn" onClick={onClose} type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="transaction-form">
                            <div className="form-group">
                                <label>Tipo de Registro</label>
                                <CustomSelect
                                    value={formData.tipo}
                                    options={typeOptions}
                                    onChange={handleChangeTipo}
                                    placeholder="Selecione o tipo"
                                />
                            </div>

                            <div className="form-group">
                                <label>Valor</label>
                                <div className="currency-wrapper">
                                    <span className="currency-symbol">R$</span>
                                    <input
                                        type="number"
                                        name="valor"
                                        step="0.01"
                                        value={formData.valor}
                                        onChange={handleChange}
                                        className="minimal-input"
                                        placeholder="0,00"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Categoria</label>
                                {formData.tipo === 'entrada' ? (
                                    <CustomSelect
                                        value="Recebimento"
                                        options={[{ value: 'Recebimento', label: 'Recebimento Automático' }]}
                                        onChange={() => {}}
                                        disabled={true}
                                        renderOption={(opt) => (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>💵</span> {opt.label}
                                            </span>
                                        )}
                                    />
                                ) : (
                                    <CustomSelect
                                        value={formData.categoria}
                                        options={categoryOptions}
                                        onChange={(val) => setFormData(prev => ({ ...prev, categoria: val }))}
                                        placeholder="Selecione uma categoria..."
                                        renderOption={(opt) => (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>{getIconForCategory(opt.value)}</span> {opt.label}
                                            </span>
                                        )}
                                    />
                                )}
                            </div>

                            <div className="form-group">
                                <label>Descrição (Opcional)</label>
                                <input
                                    type="text"
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleChange}
                                    className="minimal-input"
                                    placeholder="Ex: Assinatura Netflix..."
                                    autoComplete="off"
                                />
                            </div>

                            <div className="form-group">
                                <label>Data</label>
                                <input
                                    type="date"
                                    name="created_at"
                                    value={formData.created_at}
                                    onChange={handleChange}
                                    className="minimal-input"
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                {transaction && onDelete && (
                                    <button 
                                        type="button" 
                                        className="btn-delete-modal"
                                        onClick={async (e) => {
                                            if(window.confirm('Tem certeza que deseja apagar essa transação?')) {
                                                setLoading(true);
                                                try {
                                                    await onDelete(transaction.id);
                                                    onClose();
                                                } catch(err) {
                                                    console.error('Error deleting:', err);
                                                    setLoading(false);
                                                }
                                            }
                                        }}
                                        disabled={loading}
                                        title="Excluir transação"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="20" height="20">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                )}
                                <div style={{flex: 1}}></div>
                                <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-save" disabled={loading}>
                                    {loading ? 'Salvando...' : 'Confirmar'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default TransactionModal
