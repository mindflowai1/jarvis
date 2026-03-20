import { useState } from 'react'
import TransactionModal from '../TransactionModal'
import RecurringReminders from '../RecurringReminders'
import ExpenseLimits from '../ExpenseLimits'
import ExpensePieChart from '../ExpensePieChart'
import { exportFinancialPDF } from '../../utils/exportFinancialPDF'
import '../FinancialDashboard.css' // Reusing original styles for desktop

const DesktopFinancialDashboard = ({
    loading,
    filters,
    stats,
    transactions,
    categories,
    handleFilterChange,
    deleteTransaction,
    saveTransaction,
    userName
}) => {
    // UI State local to this view
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)
    const [isRemindersOpen, setIsRemindersOpen] = useState(false)
    const [isLimitsOpen, setIsLimitsOpen] = useState(false)

    // Helpers
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDate = (dateString = "") => {
        if (!dateString) return ""
        // Extrai data ignorando fuso (YYYY-MM-DD...)
        const [datePart] = dateString.split(/[T ]/)
        const [year, month, day] = datePart.split("-")
        return `${day}/${month}/${year}`
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

    // Handlers
    const handleEdit = (transaction) => {
        setEditingTransaction(transaction)
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja apagar essa transação?')) {
            await deleteTransaction(id)
        }
    }

    const onSaveTransaction = async (data) => {
        await saveTransaction(data, editingTransaction?.id)
        setIsModalOpen(false)
        setEditingTransaction(null)
    }

    return (
        <div className="financial-dashboard desktop-view">

            <header className="dashboard-header">
                <h1>Financeiro</h1>
                <div className="header-actions">
                    <button
                        onClick={() => setIsRemindersOpen(true)}
                        className="header-btn"
                        title="Lembretes Recorrentes"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span className="btn-label">Lembretes</span>
                    </button>
                    <button
                        onClick={() => setIsLimitsOpen(true)}
                        className="header-btn"
                        title="Limites de Gastos"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="btn-label">Limites</span>
                    </button>
                    <button
                        onClick={() => exportFinancialPDF(transactions, stats, filters, userName)}
                        className="header-btn"
                        title="Exportar Relatório PDF"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span className="btn-label">Exportar</span>
                    </button>
                    <button
                        onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
                        className="header-btn primary"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Nova Transação</span>
                    </button>
                </div>
            </header>

            <section className="filters-bar">
                <div className="search-input-wrapper">
                    <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="filter-input"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>

                <div className="filters-row">
                    <input
                        type={filters.startDate ? "date" : "text"}
                        placeholder="Data Inicial"
                        className="date-input"
                        value={filters.startDate}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => {
                            if (!e.target.value) e.target.type = "text";
                        }}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                    <span className="date-separator">até</span>
                    <input
                        type={filters.endDate ? "date" : "text"}
                        placeholder="Data Final"
                        className="date-input"
                        value={filters.endDate}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => {
                            if (!e.target.value) e.target.type = "text";
                        }}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                </div>

                <div className="filters-row">
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
                </div>
            </section>

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

            <section className="transactions-list">
                <div className="list-header">Transações Recentes</div>

                {loading ? (
                    <div className="no-results">Carregando...</div>
                ) : transactions.length === 0 ? (
                    <div className="no-results">Nenhuma transação encontrada.</div>
                ) : (
                    transactions.map(tx => (
                        <div
                            key={tx.id}
                            className="transaction-card clickable"
                            onClick={() => handleEdit(tx)}
                        >
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
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEdit(tx)
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        title="Excluir"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(tx.id)
                                        }}
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
                onSave={onSaveTransaction}
                transaction={editingTransaction}
                categories={categories}
                onDelete={deleteTransaction}
            />

            <RecurringReminders
                isOpen={isRemindersOpen}
                onClose={() => setIsRemindersOpen(false)}
            />

            <ExpenseLimits
                isOpen={isLimitsOpen}
                onClose={() => setIsLimitsOpen(false)}
                transactions={transactions}
                categories={categories}
            />
        </div>
    )
}

export default DesktopFinancialDashboard
