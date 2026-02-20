import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TransactionModal from '../TransactionModal'
import RecurringReminders from '../RecurringReminders'
import ExpensePieChart from '../ExpensePieChart'
import './MobileFinancialDashboard.css'

const MobileFinancialDashboard = ({
    loading,
    filters,
    stats,
    transactions,
    categories,
    handleFilterChange,
    deleteTransaction,
    saveTransaction
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)
    const [isRemindersOpen, setIsRemindersOpen] = useState(false)
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [showBalance, setShowBalance] = useState(true)
    const [activeTab, setActiveTab] = useState('transactions') // 'transactions' | 'charts'

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const getIconForCategory = (category, type) => {
        if (type === 'entrada') return '💰'
        switch (category?.toLowerCase()) {
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

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction)
        setIsModalOpen(true)
    }

    const onSaveTransaction = async (data) => {
        await saveTransaction(data, editingTransaction?.id)
        setIsModalOpen(false)
        setEditingTransaction(null)
    }

    return (
        <div className="financial-dashboard mobile-view">
            {/* Header Sticky */}
            <header className="mobile-header">
                <div className="header-top">
                    <div className="logo-section">
                        <h1>Financeiro</h1>
                        <button className="eye-btn" onClick={() => setShowBalance(!showBalance)}>
                            {showBalance ? '👁️' : '🔒'}
                        </button>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn" onClick={() => setIsRemindersOpen(true)}>
                            📅
                        </button>
                        <button className="icon-btn" onClick={() => setIsFiltersOpen(true)}>
                            🔍
                        </button>
                    </div>
                </div>

                {/* Balance Card - Horizontal Scroll or Carousel feeling */}
                <div className="summary-carousel">
                    <motion.div
                        className="summary-card-mobile balance-card"
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="label">Saldo Atual</span>
                        <span className="value">
                            {showBalance ? formatCurrency(stats.balance) : 'R$ •••••'}
                        </span>
                    </motion.div>

                    <div className="mini-stats-row">
                        <div className="mini-stat income">
                            <span className="label">Entradas</span>
                            <span className="value">{showBalance ? formatCurrency(stats.income) : '•••••'}</span>
                        </div>
                        <div className="mini-stat expense">
                            <span className="label">Saídas</span>
                            <span className="value">{showBalance ? formatCurrency(stats.expense) : '•••••'}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Switcher */}
            <div className="fin-tabs">
                <button
                    className={`fin-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z" clipRule="evenodd" />
                    </svg>
                    Transações
                </button>
                <button
                    className={`fin-tab-btn ${activeTab === 'charts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('charts')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                        <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
                    </svg>
                    Gráficos
                </button>
            </div>

            {/* Content Area */}
            <div className="mobile-content">
                {activeTab === 'transactions' ? (
                    <>
                        <div className="list-header">
                            <h2>Últimas Transações</h2>
                            <button
                                className="inline-add-btn"
                                onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                </svg>
                                Nova
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading-state">Carregando...</div>
                        ) : transactions.length === 0 ? (
                            <div className="empty-state">
                                <p>Nenhuma transação encontrada</p>
                            </div>
                        ) : (
                            <div className="transactions-list-mobile">
                                {transactions.map(tx => (
                                    <motion.div
                                        key={tx.id}
                                        className="mobile-transaction-card"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => handleEdit(tx)}
                                    >
                                        <div className={`category-icon ${tx.tipo}`}>
                                            {getIconForCategory(tx.categoria, tx.tipo)}
                                        </div>
                                        <div className="card-details">
                                            <span className="card-title">{tx.summary || tx.categoria}</span>
                                            <span className="card-date">
                                                {new Date(tx.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                        <div className={`card-amount ${tx.tipo}`}>
                                            {tx.tipo === 'saida' ? '-' : '+'}
                                            {showBalance ? formatCurrency(tx.valor).replace('R$', '') : '••••'}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <motion.div
                        className="mobile-charts-section"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ExpensePieChart transactions={transactions} />
                    </motion.div>
                )}
            </div>



            {/* Filters Bottom Sheet */}
            <AnimatePresence>
                {isFiltersOpen && (
                    <>
                        <motion.div
                            className="bottom-sheet-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFiltersOpen(false)}
                        />
                        <motion.div
                            className="bottom-sheet"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <div className="sheet-handle"></div>
                            <h3>Filtrar Transações</h3>

                            <div className="filter-group">
                                <label>Período</label>
                                <div className="date-row">
                                    <input
                                        type="date"
                                        className="mobile-input"
                                        value={filters.startDate}
                                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                    />
                                    <span>até</span>
                                    <input
                                        type="date"
                                        className="mobile-input"
                                        value={filters.endDate}
                                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="filter-group">
                                <label>Tipo</label>
                                <div className="chips-row">
                                    {['all', 'entrada', 'saida'].map(type => (
                                        <button
                                            key={type}
                                            className={`chip ${filters.type === type ? 'active' : ''}`}
                                            onClick={() => handleFilterChange('type', type)}
                                        >
                                            {type === 'all' ? 'Todos' : type === 'entrada' ? 'Entradas' : 'Saídas'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <label>Categoria</label>
                                <select
                                    className="mobile-select"
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <option value="all">Todas</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <button className="apply-btn" onClick={() => setIsFiltersOpen(false)}>
                                Aplicar Filtros
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSaveTransaction}
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

export default MobileFinancialDashboard
