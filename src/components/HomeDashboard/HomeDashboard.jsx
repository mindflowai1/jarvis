import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHomeDashboard } from '../../hooks/useHomeDashboard'
import './HomeDashboard.css'

// Premium Animated Counter
const AnimatedValue = ({ value, prefix = '', suffix = '', isCurrency = true }) => {
    const [display, setDisplay] = useState(0)
    const ref = useRef(null)

    useEffect(() => {
        const target = typeof value === 'number' ? value : 0
        const duration = 1500
        const startTime = performance.now()
        const startVal = display

        const animate = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 5)
            setDisplay(startVal + (target - startVal) * eased)
            if (progress < 1) ref.current = requestAnimationFrame(animate)
        }

        ref.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(ref.current)
    }, [value])

    const formatted = isCurrency 
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(display)
        : `${prefix}${Math.round(display)}${suffix}`

    return <span className="animated-num">{formatted}</span>
}

const HomeDashboard = ({ session, userName, onNavigate }) => {
    const {
        loading, stats, recentTransactions, pendingTasks, taskProgress,
        upcomingEvents, nearReminders, habitProgress, isCalendarConnected
    } = useHomeDashboard(session)

    const [greeting, setGreeting] = useState('')
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        const h = new Date().getHours()
        setGreeting(h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite')
        return () => clearInterval(timer)
    }, [])

    const formatTime = (iso) => {
        if (!iso) return ''
        return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (d) => {
        if (!d) return ''
        const date = new Date(d)
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }

    const cleanSummary = (summary) => {
        if (!summary) return ''
        // Remove [Ref: ...], [Mês: ...]
        let cleaned = summary.replace(/\[Ref:.*?\]/g, '').replace(/\[Mês:.*?\]/g, '')
        // Format [Parc: 1/2] to (1/2)
        cleaned = cleaned.replace(/\[Parc: (.*?)\]/g, '($1)')
        return cleaned.trim()
    }

    const categoryIcon = (cat) => {
        const map = { 
            'alimentacao': '🍴', 'transporte': '🚗', 'lazer': '🎮', 
            'saude': '🏥', 'moradia': '🏠', 'compras': '🛍️', 
            'farmacia': '💊', 'educação': '📚', 'investimento': '📈',
            'salário': '💰', 'renda': '💵'
        }
        return map[cat?.toLowerCase()] || '💸'
    }

    const displayName = userName || session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'Comandante'

    if (loading) {
        return (
            <div className="hd-loader">
                <div className="hd-loader-circle" />
                <p>Sincronizando cockpit...</p>
            </div>
        )
    }

    return (
        <div className="hd-viewport hd-no-scroll">
            <div className="hd-ambient-glow" />
            
            <div className="hd-cockpit-fixed">
                {/* --- HEADER: COMPACT & BALANCED --- */}
                <header className="hd-header-compact">
                    <div className="hd-id-group">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <span className="hd-tag">{greeting}, {displayName}</span>
                            <div className="hd-balance-header">
                                <small>Saldo Disponível</small>
                                <h2><AnimatedValue value={stats.balance} /></h2>
                            </div>
                        </motion.div>
                    </div>

                    <div className="hd-stats-mini">
                        <div className="hd-mini-stat in">
                            <label>Entradas</label>
                            <AnimatedValue value={stats.income} />
                        </div>
                        <div className="hd-mini-stat out">
                            <label>Saídas</label>
                            <AnimatedValue value={stats.expense} />
                        </div>
                    </div>

                    <div className="hd-clock-group">
                        <div className="hd-clock-big">
                            {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="hd-date-small">
                            {time.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </div>
                    </div>
                </header>

                {/* --- MAIN GRID: 3 COLUMNS --- */}
                <main className="hd-main-grid">
                    
                    {/* COL 1: FOCUS & DISCIPLINE */}
                    <div className="hd-col">
                        {/* AGENDA */}
                        <section className="hd-widget-compact hd-widget-agenda">
                            <div className="hd-w-head">
                                <h3><span className="hd-w-icon">📅</span> Agenda</h3>
                                <button onClick={() => onNavigate('calendar')}>Ver tudo</button>
                            </div>
                            <div className="hd-w-body">
                                {upcomingEvents.length === 0 ? (
                                    <div className="hd-w-empty">Sem missões para hoje.</div>
                                ) : (
                                    <div className="hd-t-list">
                                        {upcomingEvents.slice(0, 3).map((event, i) => (
                                            <div key={event.id || i} className="hd-t-item">
                                                <span className="hd-t-time">{event.start?.dateTime ? formatTime(event.start.dateTime) : 'Hoje'}</span>
                                                <span className="hd-t-desc">{event.summary}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* HABITS */}
                        <section className="hd-widget-compact hd-widget-habits">
                            <div className="hd-w-head">
                                <h3><span className="hd-w-icon">🔥</span> Hábitos</h3>
                                <button onClick={() => onNavigate('habits')}>Tracker</button>
                            </div>
                            <div className="hd-habits-mini">
                                <div className="hd-ring-small">
                                    <svg viewBox="0 0 100 100">
                                        <circle className="hd-ring-base" cx="50" cy="50" r="40" />
                                        <motion.circle 
                                            className="hd-ring-progress" 
                                            cx="50" cy="50" r="40" 
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: habitProgress.percent / 100 }}
                                            transition={{ duration: 1.5 }}
                                        />
                                    </svg>
                                    <span className="hd-ring-text">{habitProgress.percent}%</span>
                                </div>
                                <div className="hd-h-stats">
                                    <div className="hd-h-pill"><strong>{habitProgress.done}</strong> <span>feitos</span></div>
                                    <div className="hd-h-pill"><strong>{habitProgress.total}</strong> <span>total</span></div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* COL 2: FINANCE RADAR (CENTRAL FOCUS) */}
                    <div className="hd-col hd-col--wide">
                        <section className="hd-widget-compact hd-widget-finance-full">
                            <div className="hd-w-head">
                                <h3><span className="hd-w-icon">💰</span> Transações Recentes</h3>
                                <button onClick={() => onNavigate('finance')}>Financeiro</button>
                            </div>
                            <div className="hd-w-body">
                                <div className="hd-tx-grid">
                                    {recentTransactions.map(tx => (
                                        <div key={tx.id} className="hd-tx-row">
                                            <span className="hd-tx-cat">{categoryIcon(tx.categoria)}</span>
                                            <div className="hd-tx-info">
                                                <strong>{cleanSummary(tx.summary)}</strong>
                                                <small>{formatDate(tx.created_at)}</small>
                                            </div>
                                            <span className={`hd-tx-val ${tx.tipo}`}>
                                                {tx.tipo === 'entrada' ? '+' : '-'}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(tx.valor)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* COL 3: OPERATIONS */}
                    <div className="hd-col">
                        {/* TASKS */}
                        <section className="hd-widget-compact hd-widget-tasks">
                            <div className="hd-w-head">
                                <h3><span className="hd-w-icon">✅</span> Tarefas</h3>
                                <button onClick={() => onNavigate('tasks')}>Quadro</button>
                            </div>
                            <div className="hd-w-body">
                                {pendingTasks.length === 0 ? (
                                    <div className="hd-w-empty">Missões cumpridas! 🏆</div>
                                ) : (
                                    <div className="hd-op-list">
                                        {pendingTasks.slice(0, 4).map(task => {
                                            const isOverdue = task.prazo && new Date(task.prazo) < new Date()
                                            return (
                                                <div key={task.id} className={`hd-op-item ${isOverdue ? 'overdue' : ''}`}>
                                                    <div className="hd-op-bullet" />
                                                    <div className="hd-op-text">
                                                        <p>{task.content}</p>
                                                        {task.prazo && <span>{formatDate(task.prazo)}</span>}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* REMINDERS */}
                        <section className="hd-widget-compact hd-widget-reminders">
                            <div className="hd-w-head">
                                <h3><span className="hd-w-icon">🔔</span> Alertas</h3>
                            </div>
                            <div className="hd-w-body">
                                {nearReminders.length === 0 ? (
                                    <div className="hd-w-empty">Sem alertas críticos.</div>
                                ) : (
                                    <div className="hd-al-list">
                                        {nearReminders.slice(0, 3).map(bill => (
                                            <div key={bill.id} className={`hd-al-item ${bill.status}`}>
                                                <div className="hd-al-day">{bill.due_day}</div>
                                                <div className="hd-al-info">
                                                    <strong>{cleanSummary(bill.summary)}</strong>
                                                    <span>{bill.status === 'past' ? 'Atrasado' : 'Próximo'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                </main>
            </div>
        </div>
    )
}

export default HomeDashboard
