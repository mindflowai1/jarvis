import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useHomeDashboard } from '../../hooks/useHomeDashboard'
import './HomeDashboard.css'

// Animated counter component
const AnimatedValue = ({ value, prefix = '', suffix = '' }) => {
    const [display, setDisplay] = useState(0)
    const ref = useRef(null)

    useEffect(() => {
        const target = typeof value === 'number' ? value : 0
        const duration = 1400
        const startTime = performance.now()
        const startVal = 0

        const animate = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(startVal + (target - startVal) * eased)
            if (progress < 1) ref.current = requestAnimationFrame(animate)
        }

        ref.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(ref.current)
    }, [value])

    const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: 'BRL', minimumFractionDigits: 2
    }).format(display)

    return <span>{formatted}</span>
}

const HomeDashboard = ({ session, userName, onNavigate }) => {
    const {
        loading, stats, recentTransactions, pendingTasks, taskProgress,
        upcomingEvents, nearReminders, isCalendarConnected
    } = useHomeDashboard(session)

    const [greeting, setGreeting] = useState('')
    const [dateStr, setDateStr] = useState('')

    useEffect(() => {
        const now = new Date()
        const h = now.getHours()
        setGreeting(h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite')

        const day = now.getDate().toString().padStart(2, '0')
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        const month = months[now.getMonth()]
        setDateStr(`${day} ${month} ${now.getFullYear()}`)
    }, [])

    const formatTime = (iso) => {
        if (!iso) return ''
        return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (d) => {
        if (!d) return ''
        const [y, m, day] = d.split('T')[0].split('-')
        return `${day}/${m}`
    }

    const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

    const categoryIcon = (cat, type) => {
        if (type === 'entrada') return '💰'
        const map = { 'alimentacao': '🍽️', 'alimentação': '🍽️', 'transporte': '🚗', 'lazer': '🎉', 'saude': '💊', 'saúde': '💊', 'moradia': '🏠', 'compras': '🛍️', 'farmacia': '💊' }
        return map[cat?.toLowerCase()] || '💸'
    }

    const displayName = userName || session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'Usuário'
    const progressPercent = taskProgress.total > 0 ? Math.round((taskProgress.done / taskProgress.total) * 100) : 0

    const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
    const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 28 } } }

    if (loading) {
        return (
            <div className="hd-loading">
                <div className="hd-spinner" />
                <p>Carregando painel...</p>
            </div>
        )
    }

    return (
        <motion.div className="hd-root" variants={stagger} initial="hidden" animate="show">

            {/* TOP BAR */}
            <motion.div className="hd-topbar" variants={fadeUp}>
                <div className="hd-greeting">
                    <h1>{greeting}, <span>{displayName}</span></h1>
                </div>
                <div className="hd-date">{dateStr}</div>
            </motion.div>

            {/* STATS ROW */}
            <div className="hd-stats">
                <motion.div className="hd-stat hd-stat--balance" variants={fadeUp}>
                    <div className="hd-stat__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                        </svg>
                    </div>
                    <div className="hd-stat__data">
                        <span className="hd-stat__label">Saldo</span>
                        <span className="hd-stat__value"><AnimatedValue value={stats.balance} /></span>
                    </div>
                </motion.div>

                <motion.div className="hd-stat hd-stat--income" variants={fadeUp}>
                    <div className="hd-stat__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                    </div>
                    <div className="hd-stat__data">
                        <span className="hd-stat__label">Entradas</span>
                        <span className="hd-stat__value hd-stat__value--green"><AnimatedValue value={stats.income} /></span>
                    </div>
                </motion.div>

                <motion.div className="hd-stat hd-stat--expense" variants={fadeUp}>
                    <div className="hd-stat__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                        </svg>
                    </div>
                    <div className="hd-stat__data">
                        <span className="hd-stat__label">Saídas</span>
                        <span className="hd-stat__value hd-stat__value--red"><AnimatedValue value={stats.expense} /></span>
                    </div>
                </motion.div>
            </div>

            {/* MAIN GRID 2x2 */}
            <div className="hd-grid">

                {/* AGENDA */}
                <motion.div className="hd-widget" variants={fadeUp}>
                    <div className="hd-widget__head">
                        <div className="hd-widget__title">
                            <span className="hd-widget__emoji">📅</span>
                            <h3>Agenda de Hoje</h3>
                            {upcomingEvents.length > 0 && <span className="hd-badge">{upcomingEvents.length}</span>}
                        </div>
                        <button className="hd-widget__link" onClick={() => onNavigate('calendar')}>Ver tudo</button>
                    </div>
                    <div className="hd-widget__body">
                        {!isCalendarConnected ? (
                            <div className="hd-empty">
                                <p>Agenda não conectada</p>
                                <button className="hd-connect-btn" onClick={() => onNavigate('settings')}>Conectar Google</button>
                            </div>
                        ) : upcomingEvents.length === 0 ? (
                            <div className="hd-empty">
                                <span className="hd-empty__icon">🎉</span>
                                <p>Dia livre! Sem compromissos.</p>
                            </div>
                        ) : (
                            <div className="hd-timeline">
                                {upcomingEvents.map((ev, i) => (
                                    <div className="hd-timeline__item" key={ev.id || i}>
                                        <span className="hd-timeline__time">
                                            {ev.start?.dateTime ? formatTime(ev.start.dateTime) : 'Dia todo'}
                                        </span>
                                        <div className="hd-timeline__dot" />
                                        <span className="hd-timeline__text">{ev.summary}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* TASKS */}
                <motion.div className="hd-widget" variants={fadeUp}>
                    <div className="hd-widget__head">
                        <div className="hd-widget__title">
                            <span className="hd-widget__emoji">📋</span>
                            <h3>Afazeres</h3>
                            {pendingTasks.length > 0 && <span className="hd-badge hd-badge--amber">{pendingTasks.length}</span>}
                        </div>
                        <button className="hd-widget__link" onClick={() => onNavigate('tasks')}>Ver quadro</button>
                    </div>
                    {/* Progress bar */}
                    {taskProgress.total > 0 && (
                        <div className="hd-progress">
                            <div className="hd-progress__bar">
                                <div className="hd-progress__fill" style={{ width: `${progressPercent}%` }} />
                            </div>
                            <span className="hd-progress__text">{taskProgress.done}/{taskProgress.total} concluídas ({progressPercent}%)</span>
                        </div>
                    )}
                    <div className="hd-widget__body">
                        {pendingTasks.length === 0 ? (
                            <div className="hd-empty">
                                <span className="hd-empty__icon">✅</span>
                                <p>Tudo em dia!</p>
                            </div>
                        ) : (
                            <ul className="hd-tasks">
                                {pendingTasks.map(task => {
                                    const now = new Date(); now.setHours(0, 0, 0, 0)
                                    let urg = 'future'
                                    if (task.prazo) {
                                        const [y, m, d] = task.prazo.split('T')[0].split('-')
                                        const td = new Date(y, m - 1, d)
                                        if (td < now) urg = 'expired'
                                        else if (td.getTime() === now.getTime()) urg = 'today'
                                    }
                                    return (
                                        <li key={task.id} className={`hd-task ${urg === 'expired' ? 'hd-task--expired' : ''}`}>
                                            <span className={`hd-task__dot hd-task__dot--${urg}`} />
                                            <span className="hd-task__text">{task.content}</span>
                                            {task.prazo && <span className="hd-task__date">{formatDate(task.prazo)}</span>}
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                </motion.div>

                {/* REMINDERS */}
                <motion.div className="hd-widget" variants={fadeUp}>
                    <div className="hd-widget__head">
                        <div className="hd-widget__title">
                            <span className="hd-widget__emoji">💳</span>
                            <h3>Contas do Mês</h3>
                        </div>
                        <button className="hd-widget__link" onClick={() => onNavigate('finance')}>Gerenciar</button>
                    </div>
                    <div className="hd-widget__body">
                        {nearReminders.length === 0 ? (
                            <div className="hd-empty"><p>Nenhum lembrete cadastrado</p></div>
                        ) : (
                            <ul className="hd-reminders">
                                {nearReminders.map(r => (
                                    <li key={r.id} className="hd-reminder">
                                        <span className={`hd-reminder__dot hd-reminder__dot--${r.status}`} />
                                        <span className="hd-reminder__name">{r.summary}</span>
                                        <span className="hd-reminder__day">dia {r.due_day}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </motion.div>

                {/* TRANSACTIONS */}
                <motion.div className="hd-widget" variants={fadeUp}>
                    <div className="hd-widget__head">
                        <div className="hd-widget__title">
                            <span className="hd-widget__emoji">💸</span>
                            <h3>Movimentações</h3>
                        </div>
                        <button className="hd-widget__link" onClick={() => onNavigate('finance')}>Ver extrato</button>
                    </div>
                    <div className="hd-widget__body">
                        {recentTransactions.length === 0 ? (
                            <div className="hd-empty"><p>Nenhuma transação ainda</p></div>
                        ) : (
                            <ul className="hd-txlist">
                                {recentTransactions.map(tx => (
                                    <li key={tx.id} className="hd-tx">
                                        <span className="hd-tx__icon">{categoryIcon(tx.categoria, tx.tipo)}</span>
                                        <div className="hd-tx__info">
                                            <span className="hd-tx__desc">{tx.summary}</span>
                                            <span className="hd-tx__cat">{tx.categoria}</span>
                                        </div>
                                        <span className={`hd-tx__val hd-tx__val--${tx.tipo}`}>
                                            {tx.tipo === 'entrada' ? '+' : '-'}{formatCurrency(tx.valor)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </motion.div>

            </div>
        </motion.div>
    )
}

export default HomeDashboard
