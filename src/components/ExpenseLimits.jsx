import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabaseClient'
import './ExpenseLimits.css'

const ExpenseLimits = ({ isOpen, onClose, transactions, categories }) => {
    const [limits, setLimits] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({ category: '', amount: '' })

    const loadLimits = async () => {
        try {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('expense_limits')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setLimits(data || [])
        } catch (error) {
            console.error('Error loading limits:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            loadLimits()
            // Reset state
            setIsAdding(false)
            setEditingId(null)
            setFormData({ category: categories[0] || '', amount: '' })
        }
    }, [isOpen, categories])

    // Compute progress matching transactions array
    const getLimitProgress = (limitCategory, maxAmount) => {
        const spent = transactions
            .filter(tx => tx.tipo === 'saida' && tx.categoria === limitCategory)
            .reduce((acc, current) => acc + Number(current.valor), 0)

        const percentage = Math.min((spent / maxAmount) * 100, 100)
        
        let status = 'good'
        if (percentage >= 90) status = 'danger'
        else if (percentage >= 60) status = 'warning'

        return { spent, percentage, status }
    }

    const handleSave = async () => {
        if (!formData.category || !formData.amount) return

        try {
            const { data: { user } } = await supabase.auth.getUser()
            
            if (editingId) {
                // Update existing
                const { error } = await supabase
                    .from('expense_limits')
                    .update({
                        category: formData.category,
                        amount: parseFloat(formData.amount)
                    })
                    .eq('id', editingId)
                if (error) throw error
            } else {
                // Insert new (upsert based on constraint logic or just normal insert)
                // We have a unique constraint, let's try upsert to prevent duplicates
                const { error } = await supabase
                    .from('expense_limits')
                    .upsert({
                        user_id: user.id,
                        category: formData.category,
                        amount: parseFloat(formData.amount)
                    }, { onConflict: 'user_id, category' })
                if (error) throw error
            }

            setFormData({ category: categories[0] || '', amount: '' })
            setEditingId(null)
            setIsAdding(false)
            loadLimits()
        } catch (error) {
            console.error('Error saving limit:', error)
            alert('Erro ao salvar limite.')
        }
    }

    const handleEdit = (limit) => {
        setFormData({ category: limit.category, amount: limit.amount })
        setEditingId(limit.id)
        setIsAdding(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Deseja remover esse limite?')) return
        try {
            const { error } = await supabase.from('expense_limits').delete().eq('id', id)
            if (error) throw error
            loadLimits()
        } catch (error) {
            console.error('Error deleting:', error)
        }
    }

    const getIconForCategory = (category) => {
        switch (category?.toLowerCase()) {
            case 'alimentação': return '🍽️'
            case 'transporte': return '🚗'
            case 'lazer': return '🎉'
            case 'saúde':
            case 'farmácia': return '💊'
            case 'moradia': return '🏠'
            case 'compras': return '🛍️'
            default: return '💸'
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        className="limits-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div 
                        className="limits-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="limits-header">
                            <div>
                                <h2>Limites de Gastos</h2>
                                <p>Defina o teto para não estourar seu orçamento</p>
                            </div>
                            <button className="close-btn" onClick={onClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="limits-content">
                            {!isAdding ? (
                                <button className="add-limit-btn" onClick={() => {
                                    setIsAdding(true)
                                    setFormData({ category: categories[0] || '', amount: '' })
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Adicionar Novo Limite
                                </button>
                            ) : (
                                <motion.div 
                                    className="limit-form"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                >
                                    <div className="form-group">
                                        <label>Categoria Alvo</label>
                                        <div className="input-wrapper">
                                            <span className="input-prefix">🏷️</span>
                                            <select 
                                                value={formData.category} 
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Teto de Gasto Mensal</label>
                                        <div className="input-wrapper amount-wrapper">
                                            <span className="input-prefix currency-prefix">R$</span>
                                            <input 
                                                type="number"
                                                step="0.01"
                                                placeholder="0,00"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button className="cancel-btn" onClick={() => {
                                            setIsAdding(false)
                                            setEditingId(null)
                                        }}>Cancelar</button>
                                        <button className="save-btn" onClick={handleSave}>Salvar Limite</button>
                                    </div>
                                </motion.div>
                            )}

                            <div className="limits-list">
                                {loading ? (
                                    <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: 30 }}>Carregando limites...</div>
                                ) : limits.length === 0 && !isAdding ? (
                                    <div style={{ color: '#64748b', textAlign: 'center', marginTop: 30 }}>
                                        Nenhum limite configurado.<br/>Crie um para começar a acompanhar.
                                    </div>
                                ) : (
                                    limits.map(limit => {
                                        const { spent, percentage, status } = getLimitProgress(limit.category, limit.amount)
                                        return (
                                            <motion.div 
                                                className={`limit-card status-${status}`} 
                                                key={limit.id}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                            >
                                                <div className="limit-header-info">
                                                    <div className="limit-cat">
                                                        <div className="limit-cat-icon">
                                                            {getIconForCategory(limit.category)}
                                                        </div>
                                                        {limit.category}
                                                    </div>
                                                    <div className="limit-actions">
                                                        <button title="Editar" onClick={() => handleEdit(limit)}>✎</button>
                                                        <button title="Remover" onClick={() => handleDelete(limit.id)}>🗑️</button>
                                                    </div>
                                                </div>

                                                <div className="progress-container">
                                                    <div className="progress-stats">
                                                        <span className="spent">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(spent)}
                                                        </span>
                                                        <span className="max-amount">
                                                            de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(limit.amount)}
                                                        </span>
                                                    </div>
                                                    <div className="progress-track">
                                                        <div 
                                                            className="progress-fill" 
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default ExpenseLimits
