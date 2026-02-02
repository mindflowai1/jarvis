import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import './FinancialDashboard.css'
import TransactionModal from './TransactionModal'
import RecurringReminders from './RecurringReminders'
import ExpensePieChart from './ExpensePieChart'

const FinancialDashboard = () => {
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        search: '',
        type: 'all',
        category: 'all'
    })
    const [stats, setStats] = useState({
        income: 0,
        expense: 0,
        balance: 0
    })
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)

    // Reminders Drawer State
    const [isRemindersOpen, setIsRemindersOpen] = useState(false)

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search)
        }, 500)
        return () => clearTimeout(timer)
    }, [filters.search])

    const loadData = useCallback(async () => {
        try {
            setLoading(true)

            // 1. Get Summary Stats (RPC)
            const { data: summaryData, error: summaryError } = await supabase
                .rpc('get_financial_summary', {
                    start_date: filters.startDate || null,
                    end_date: filters.endDate || null,
                    search_term: debouncedSearch || null,
                    filter_type: filters.type === 'all' ? null : filters.type,
                    filter_category: filters.category === 'all' ? null : filters.category
                })

            if (summaryError) throw summaryError

            if (summaryData && summaryData[0]) {
                setStats({
                    income: summaryData[0].total_income || 0,
                    expense: summaryData[0].total_expense || 0,
                    balance: summaryData[0].balance || 0
                })
            }

            // 2. Get Transactions List
            let query = supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)

            if (filters.startDate) query = query.gte('created_at', filters.startDate)
            if (filters.endDate) query = query.lte('created_at', filters.endDate + 'T23:59:59')
            if (filters.type !== 'all') query = query.eq('tipo', filters.type)
            if (filters.category !== 'all') query = query.eq('categoria', filters.category)
            if (debouncedSearch) {
                query = query.or(`summary.ilike.%${debouncedSearch}%,categoria.ilike.%${debouncedSearch}%`)
            }

            const { data: txData, error: txError } = await query

            if (txError) throw txError
            setTransactions(txData || [])

            // 3. Get unique categories
            if (filters.category === 'all') {
                const { data: catData } = await supabase
                    .from('transactions')
                    .select('categoria')
                    .order('categoria')

                if (catData) {
                    const uniqueCats = [...new Set(catData.map(item => item.categoria))]
                    setCategories(uniqueCats)
                }
            }

        } catch (error) {
            console.error('Error loading financial data:', error)
        } finally {
            setLoading(false)
        }
    }, [filters.startDate, filters.endDate, filters.type, filters.category, debouncedSearch])

    useEffect(() => {
        loadData()
    }, [loadData])

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja apagar essa transação?')) return

        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id)

            if (error) throw error
            loadData() // Reload
        } catch (error) {
            console.error('Error deleting transaction:', error)
            alert('Erro ao apagar transação')
        }
    }

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction)
        setIsModalOpen(true)
    }

    const handleSaveTransaction = async (data) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (editingTransaction) {
                // Update
                const { error } = await supabase
                    .from('transactions')
                    .update({
                        valor: data.valor,
                        tipo: data.tipo,
                        categoria: data.categoria,
                        summary: data.summary,
                        created_at: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString()
                    })
                    .eq('id', editingTransaction.id)

                if (error) throw error
            } else {
                // Insert
                const { error } = await supabase
                    .from('transactions')
                    .insert({
                        user_id: user.id,
                        valor: data.valor,
                        tipo: data.tipo,
                        categoria: data.categoria,
                        summary: data.summary,
                        created_at: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString()
                    })

                if (error) throw error
            }
            loadData()
        } catch (error) {
            console.error('Error saving transaction:', error)
            alert('Erro ao salvar transação')
            throw error // Propagate to modal
        }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const getIconForCategory = (category, type) => {
        if (type === 'entrada') return '💰'
        switch (category.toLowerCase()) {
            case 'alimentacao': return '🍽️'
            case 'transporte': return '🚗'
            case 'lazer': return '🎉'
            case 'saude':
            case 'farmacia': return '💊'
            case 'moradia': return '🏠'
            case 'compras': return '🛍️'
            default: return '💸'
        }
    }

    return (
        <div className="financial-dashboard">
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginBottom: '24px',
                gap: '20px'
            }}>
                <h1 style={{ margin: 0, flex: '0 0 auto' }}>Financeiro</h1>
                <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
                    <button
                        onClick={() => setIsRemindersOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        className="add-btn"
                        title="Lembretes Recorrentes"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Lembretes
                    </button>
                    <button
                        onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        className="add-btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Nova Transação
                    </button>
                </div>
            </header>

            <section className="summary-cards">
                <div className="summary-card balance">
                    <span className="card-title">
                        <svg className="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Saldo Atual
                    </span>
                    <span className="card-value">{formatCurrency(stats.balance)}</span>
                </div>
                <div className="summary-card income">
                    <span className="card-title">
                        <svg className="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                        Entradas
                    </span>
                    <span className="card-value">{formatCurrency(stats.income)}</span>
                </div>
                <div className="summary-card expense">
                    <span className="card-title">
                        <svg className="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                        </svg>
                        Saídas
                    </span>
                    <span className="card-value">{formatCurrency(stats.expense)}</span>
                </div>
            </section>

            {/* Gráfico de Gastos por Categoria */}
            <ExpensePieChart transactions={transactions} />

            <section className="filters-bar">
                <div className="search-input-wrapper">
                    <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar transações..."
                        className="filter-input"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>

                <input
                    type="date"
                    className="date-input"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />

                <input
                    type="date"
                    className="date-input"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />

                <select
                    className="filter-select"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                    <option value="all">Todos os Tipos</option>
                    <option value="entrada">Entradas</option>
                    <option value="saida">Saídas</option>
                </select>

                <select
                    className="filter-select"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                    <option value="all">Todas as Categorias</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </section>

            <section className="transactions-list">
                <div className="list-header">Transações Recentes</div>

                {loading ? (
                    <div className="no-results">Carregando...</div>
                ) : transactions.length === 0 ? (
                    <div className="no-results">Nenhuma transação encontrada.</div>
                ) : (
                    transactions.map(tx => (
                        <div key={tx.id} className="transaction-card">
                            <div className="t-info">
                                <div className={`t-icon ${tx.tipo}`}>
                                    {getIconForCategory(tx.categoria, tx.tipo)}
                                </div>
                                <div className="t-details">
                                    <h3>{tx.summary || tx.categoria}</h3>
                                    <p>
                                        {formatDate(tx.created_at)}
                                        <span className="t-category">{tx.categoria}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="t-right-side">
                                <div className={`t-amount ${tx.tipo}`}>
                                    {tx.tipo === 'saida' ? '- ' : '+ '}
                                    {formatCurrency(tx.valor)}
                                </div>
                                <div className="t-actions">
                                    <button
                                        className="action-btn edit"
                                        title="Editar"
                                        onClick={() => handleEdit(tx)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        title="Excluir"
                                        onClick={() => handleDelete(tx.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </section>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTransaction}
                transaction={editingTransaction}
                categories={categories}
            />

            <RecurringReminders
                isOpen={isRemindersOpen}
                onClose={() => setIsRemindersOpen(false)}
            />
        </div>
    )
}

export default FinancialDashboard
