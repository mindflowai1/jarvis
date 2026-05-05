import './PlanningDashboard.css'

const PlanningDashboard = ({
    loading,
    currentMonth,
    nextMonth,
    prevMonth,
    getMonthKey,
    items,
    togglePaidStatus,
    savePlanningItem,
    deletePlanningItem,
    toggleReminder,
    refresh
}) => {
    // Note: The modal is now managed by the parent FinancialDashboard
    // But we still need a way to open it for "Novo Plano"
    const openNewPlanModal = () => {
        if (window.onRedirectToPlanning) {
            window.onRedirectToPlanning(null);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const monthYearLabel = currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
    const viewMonthKey = getMonthKey(currentMonth)

    // Cálculos de resumo do mês
    const totalMonth = items.reduce((acc, curr) => acc + Number(curr.valor), 0)
    const paidMonth = items.filter(i => i.isPaid).reduce((acc, curr) => acc + Number(curr.valor), 0)
    const pendingMonth = totalMonth - paidMonth

    const getIconForCategory = (category) => {
        switch (category?.toLowerCase()) {
            case 'alimentação': return '🍽️'
            case 'transporte': return '🚗'
            case 'lazer': return '🎉'
            case 'saúde': return '💊'
            case 'moradia': return '🏠'
            case 'compras': return '🛍️'
            default: return '💸'
        }
    }

    const getTypeLabel = (type) => {
        switch (type) {
            case 'installment': return 'Parcelado'
            case 'subscription': return 'Assinatura'
            case 'future_expense': return 'Único'
            default: return type
        }
    }

    return (
        <div className="planning-dashboard">
            {/* Top Summary */}
            <div className="planning-summary">
                <div className="mini-stat-card">
                    <label>Total Projetado</label>
                    <div className="value">{formatCurrency(totalMonth)}</div>
                </div>
                <div className="mini-stat-card">
                    <label>Já Pago</label>
                    <div className="value done">{formatCurrency(paidMonth)}</div>
                </div>
                <div className="mini-stat-card">
                    <label>Pendente</label>
                    <div className="value pending">{formatCurrency(pendingMonth)}</div>
                </div>
            </div>

            {/* Navigation */}
            <div className="month-navigator">
                <button className="nav-month-btn" onClick={prevMonth}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <div className="current-month-display">
                    <h2>{monthYearLabel}</h2>
                    <p>Previsão Mensal</p>
                </div>
                <button className="nav-month-btn" onClick={nextMonth}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            {/* List Actions */}
            <div className="planning-list-header">
                <h3>Itens Planejados</h3>
                <button 
                    className="header-btn primary"
                    onClick={openNewPlanModal}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Novo Plano
                </button>
            </div>

            {/* Items List */}
            <div className="transactions-list">
                {loading ? (
                    <div className="no-results">Carregando planejamento...</div>
                ) : items.length === 0 ? (
                    <div className="no-results">
                        <p>Nenhum gasto planejado para este mês.</p>
                        <span className="text-sm">Use o botão "Novo Plano" para simular compras ou assinaturas.</span>
                    </div>
                ) : (
                    items.map(item => (
                        <div 
                            key={`${item.id}-${viewMonthKey}`} 
                            className={`planning-item-card clickable ${item.tipo} ${item.isPaid ? 'is-paid' : ''}`}
                            onClick={() => window.onRedirectToPlanning(item)}
                        >
                            <div className="t-info">
                                <div className="t-icon">
                                    {getIconForCategory(item.categoria)}
                                </div>
                                <div className="t-details">
                                    <span className="type-badge">{getTypeLabel(item.tipo)}</span>
                                    <h3>
                                        {item.description}
                                        {item.tipo === 'installment' && (
                                            <span className="installment-info">
                                                ({item.currentInstallment}/{item.installments_total})
                                            </span>
                                        )}
                                    </h3>
                                    <p>
                                        <span className="t-category">{item.categoria}</span>
                                        {item.due_day && <span className="t-due-day"> • Venc. dia {item.due_day}</span>}
                                    </p>
                                </div>
                            </div>

                            <div className="t-right-side">
                                <div className="t-actions">
                                    <button 
                                        className={`action-btn reminder ${item.reminder_id ? 'active' : ''}`}
                                        title={item.reminder_id ? "Desativar Lembrete" : "Ativar Lembrete"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleReminder(item);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={item.reminder_id ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                        </svg>
                                    </button>
                                    <button 
                                        className="action-btn edit"
                                        title="Editar"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.onRedirectToPlanning && window.onRedirectToPlanning(item);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    </button>
                                    <button 
                                        className="action-btn delete"
                                        title="Excluir"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if(confirm('Excluir este planejamento removerá a previsão de todos os meses. Confirmar?')) {
                                                deletePlanningItem(item.id)
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </div>
                                
                                <div className="t-amount">
                                    {formatCurrency(item.valor)}
                                </div>
                                
                                <div 
                                    className="paid-toggle"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        togglePaidStatus(item, viewMonthKey);
                                    }}
                                >
                                    <div className={`check-circle ${item.isPaid ? 'checked' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <span className="paid-label">{item.isPaid ? 'PAGO' : 'CHECK'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}

export default PlanningDashboard
