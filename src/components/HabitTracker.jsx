import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHabits } from '../hooks/useHabits'
import './HabitTracker.css'

const HabitTracker = () => {
    const { habits, logs, loading, toggleHabit, saveHabit, deleteHabit, calculateStreak } = useHabits()
    const [isAdding, setIsAdding] = useState(false)
    const [editingHabit, setEditingHabit] = useState(null)
    const [selectedHabitHistory, setSelectedHabitHistory] = useState(null)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showFreqPicker, setShowFreqPicker] = useState(false)
    const [newHabit, setNewHabit] = useState({
        title: '',
        icon: '✨',
        color: '#10b981',
        frequency: 'daily',
        goal: 1,
        days_of_week: [0, 1, 2, 3, 4, 5, 6],
        description: ''
    })

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    const stats = useMemo(() => {
        const currentDayIndex = new Date().getDay();
        const habitsScheduledToday = habits.filter(h => (h.days_of_week || [0,1,2,3,4,5,6]).includes(currentDayIndex));
        
        let totalGoalItems = 0;
        let completedGoalItems = 0;
        let fullyCompletedHabits = 0;

        habitsScheduledToday.forEach(h => {
            const goal = h.goal || 1;
            totalGoalItems += goal;
            
            const habitLogs = logs.filter(l => l.habit_id === h.id && l.completed_at.startsWith(today));
            const done = Math.min(habitLogs.length, goal);
            
            completedGoalItems += done;
            if (done >= goal) {
                fullyCompletedHabits += 1;
            }
        });
        
        const percent = totalGoalItems > 0 ? Math.round((completedGoalItems / totalGoalItems) * 100) : 0;
        
        return { 
            totalHabits: habits.length, 
            totalToday: habitsScheduledToday.length, 
            completedToday: fullyCompletedHabits, 
            percent 
        };
    }, [habits, logs, today])

    const handleToggle = async (habitId) => {
        await toggleHabit(habitId)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const success = await saveHabit(editingHabit || newHabit)
        if (success) {
            setIsAdding(false)
            setEditingHabit(null)
            setNewHabit({ title: '', icon: '✨', color: '#10b981', frequency: 'daily', goal: 1, days_of_week: [0, 1, 2, 3, 4, 5, 6], description: '' })
        }
    }

    if (loading && habits.length === 0) {
        return (
            <div className="habits-loading">
                <div className="habits-loader"></div>
                <p>Sincronizando seus hábitos...</p>
            </div>
        )
    }

    return (
        <div className="habits-root">
            <div className="habits-glass-bg" />
            
            <div className="habits-content">
                <header className="habits-hero">
                    <div className="hero-left">
                        <motion.h1 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            Meus Hábitos
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            Construindo uma versão melhor de mim mesmo, um dia de cada vez.
                        </motion.p>
                    </div>
                    <motion.button 
                        className="habits-primary-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(true)}
                    >
                        <span className="btn-icon">+</span>
                        Novo Hábito
                    </motion.button>
                </header>

                <div className="habits-stats-grid">
                    <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <div className="stat-icon income">📊</div>
                        <div className="stat-info">
                            <span className="stat-label">Progresso Hoje</span>
                            <span className="stat-value">{stats.percent}%</span>
                            <div className="stat-progress-bar">
                                <motion.div 
                                    className="stat-progress-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.percent}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="stat-icon expense">🎯</div>
                        <div className="stat-info">
                            <span className="stat-label">Hábitos de Hoje</span>
                            <span className="stat-value">{stats.totalToday}</span>
                        </div>
                    </motion.div>

                    <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="stat-icon balance">🔥</div>
                        <div className="stat-info">
                            <span className="stat-label">Concluídos Hoje</span>
                            <span className="stat-value">{stats.completedToday}</span>
                        </div>
                    </motion.div>
                </div>

                <div className="habits-sections-container">
                    {(() => {
                        const currentDayIndex = new Date().getDay();
                        const habitsToday = habits.filter(h => (h.days_of_week || [0,1,2,3,4,5,6]).includes(currentDayIndex));
                        const habitsResting = habits.filter(h => !(h.days_of_week || [0,1,2,3,4,5,6]).includes(currentDayIndex));

                        const renderHabitCard = (habit, index) => {
                            const habitTodayLogs = logs.filter(l => l.habit_id === habit.id && l.completed_at.startsWith(today))
                            const doneCount = habitTodayLogs.length
                            const isFullyDone = doneCount >= habit.goal
                            const progress = Math.min(100, (doneCount / habit.goal) * 100)
                            const streak = calculateStreak(habit.id)
                            
                                                        const isScheduledToday = (habit.days_of_week || [0,1,2,3,4,5,6]).includes(currentDayIndex)
                            
                            return (
                                <motion.div 
                                    key={habit.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`habit-item ${isFullyDone ? 'is-done' : ''} ${!isScheduledToday ? 'is-off-day' : ''}`}
                                    onClick={() => setSelectedHabitHistory(habit)}
                                >
                                    <div className="habit-item__header">
                                        <div 
                                            className="habit-item__icon"
                                            style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                                        >
                                            {habit.icon}
                                        </div>
                                        <div className="habit-item__actions">
                                            {!isScheduledToday && (
                                                <div className="off-day-badge">
                                                    <span>☕</span> Descanso
                                                </div>
                                            )}
                                            <button className="action-btn edit" title="Editar" onClick={(e) => { e.stopPropagation(); setEditingHabit(habit); }}>✎</button>
                                            <button className="action-btn delete" title="Excluir" onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}>×</button>
                                        </div>
                                    </div>

                                    <div className="habit-item__body">
                                        <div className="title-row">
                                            <h3>{habit.title}</h3>
                                            {habit.goal > 1 && (
                                                <span className="goal-badge">{doneCount}/{habit.goal}</span>
                                            )}
                                        </div>
                                        
                                        <div className="habit-item__streak">
                                            <span className="streak-flame">🔥</span>
                                            <span>{streak} dias de sequência</span>
                                        </div>

                                        <div className="progress-container">
                                            <div className="progress-bg">
                                                <motion.div 
                                                    className="progress-fill"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    style={{ 
                                                        backgroundColor: isFullyDone ? '#10b981' : (habit.color === '#3b82f6' ? '#10b981' : habit.color) 
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="habit-item__footer">
                                        <button 
                                            className={`check-btn ${isFullyDone ? 'active' : ''} ${!isScheduledToday ? 'is-off-day' : ''}`}
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                if (isScheduledToday) handleToggle(habit.id); 
                                            }}
                                            style={{ 
                                                '--habit-color': isFullyDone ? '#10b981' : (habit.color === '#3b82f6' ? '#10b981' : habit.color),
                                                borderColor: isFullyDone ? '#10b981' : (!isScheduledToday ? 'rgba(255,255,255,0.1)' : (habit.color === '#3b82f6' ? '#10b981' : habit.color)),
                                                color: isFullyDone ? '#fff' : (!isScheduledToday ? '#64748b' : (habit.color === '#3b82f6' ? '#10b981' : habit.color)),
                                                backgroundColor: isFullyDone ? '#10b981' : 'transparent'
                                            }}
                                        >
                                            <AnimatePresence mode="wait">
                                                {isFullyDone ? (
                                                    <motion.span 
                                                        key="done"
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className="check-text"
                                                    >
                                                        ✓ Concluído
                                                    </motion.span>
                                                ) : !isScheduledToday ? (
                                                    <motion.span 
                                                        key="off"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="check-text"
                                                    >
                                                        Dia de Descanso
                                                    </motion.span>
                                                ) : (
                                                    <motion.span 
                                                        key="todo"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="check-text"
                                                    >
                                                        {habit.goal > 1 ? `Marcar +1 (${doneCount}/${habit.goal})` : 'Marcar como Feito'}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        }

                        return (
                            <>
                                {habitsToday.length > 0 && (
                                    <div className="habits-section">
                                        <h2 className="habits-section-title">Hábitos de Hoje</h2>
                                        <div className="habits-main-grid">
                                            <AnimatePresence mode="popLayout">
                                                {habitsToday.map((habit, index) => renderHabitCard(habit, index))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}

                                {habitsResting.length > 0 && (
                                    <div className="habits-section habits-resting-section">
                                        <h2 className="habits-section-title">Descanso Hoje</h2>
                                        <div className="habits-main-grid resting-grid">
                                            <AnimatePresence mode="popLayout">
                                                {habitsResting.map((habit, index) => renderHabitCard(habit, index))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}

                                {habits.length === 0 && (
                                    <motion.div 
                                        className="habits-empty-state"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div className="empty-state-visual">✨</div>
                                        <h3>Sua jornada começa aqui</h3>
                                        <p>Você ainda não criou nenhum hábito. Que tal começar um novo hoje?</p>
                                        <button onClick={() => setIsAdding(true)}>Criar Meu Primeiro Hábito</button>
                                    </motion.div>
                                )}
                            </>
                        )
                    })()}
                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {(isAdding || editingHabit) && (
                    <div className="habit-modal-overlay">
                        <motion.div 
                            className="habit-modal"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className="modal-header">
                                <h2>{editingHabit ? 'Editar Hábito' : 'Novo Hábito'}</h2>
                                <button className="close-modal" onClick={() => { setIsAdding(false); setEditingHabit(null); }}>×</button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-field">
                                    <label>O que você quer rastrear?</label>
                                    <input 
                                        type="text" 
                                        className="modal-input"
                                        required
                                        placeholder="Ex: Meditação diária"
                                        value={editingHabit ? editingHabit.title : newHabit.title}
                                        onChange={e => editingHabit ? setEditingHabit({...editingHabit, title: e.target.value}) : setNewHabit({...newHabit, title: e.target.value})}
                                    />
                                </div>
                                <div className="modal-field">
                                    <label>Descrição (opcional)</label>
                                    <textarea 
                                        className="modal-input modal-textarea"
                                        placeholder="Ex: Pelo menos 10 minutos focados"
                                        rows="2"
                                        value={editingHabit ? (editingHabit.description || '') : newHabit.description}
                                        onChange={e => editingHabit ? setEditingHabit({...editingHabit, description: e.target.value}) : setNewHabit({...newHabit, description: e.target.value})}
                                    />
                                </div>
                                <div className="modal-row">
                                    <div className="modal-field">
                                        <label>Emoji</label>
                                        <div className="emoji-selector-wrapper">
                                            <button 
                                                type="button" 
                                                className="selected-emoji-btn"
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            >
                                                {editingHabit ? editingHabit.icon : newHabit.icon}
                                            </button>
                                            <AnimatePresence>
                                                {showEmojiPicker && (
                                                    <motion.div 
                                                        className="emoji-picker-popover"
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    >
                                                        {['✨', '🏋️', '📖', '💧', '🥗', '🧘', '🍎', '🏃', '💤', '🧠', '💸', '🎸', '💻', '🎨', '🌱', '☀️'].map(emoji => (
                                                            <button 
                                                                key={emoji}
                                                                type="button"
                                                                className="emoji-option"
                                                                onClick={() => {
                                                                    if (editingHabit) {
                                                                        setEditingHabit({...editingHabit, icon: emoji})
                                                                    } else {
                                                                        setNewHabit({...newHabit, icon: emoji})
                                                                    }
                                                                    setShowEmojiPicker(false)
                                                                }}
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div className="modal-field">
                                        <label>Cor</label>
                                        <div className="color-picker-container">
                                            <input 
                                                type="color" 
                                                className="hidden-color-input"
                                                value={editingHabit ? editingHabit.color : newHabit.color}
                                                onChange={e => editingHabit ? setEditingHabit({...editingHabit, color: e.target.value}) : setNewHabit({...newHabit, color: e.target.value})}
                                                id="habit-color-input"
                                            />
                                            <label htmlFor="habit-color-input" className="color-preview-btn" style={{ backgroundColor: editingHabit ? editingHabit.color : newHabit.color }}>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-field">
                                    <label>Repetir nos dias</label>
                                    <div className="days-selector">
                                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => {
                                            const currentDays = (editingHabit ? editingHabit.days_of_week : newHabit.days_of_week) || [0,1,2,3,4,5,6]
                                            const isSelected = currentDays.includes(i)
                                            const habitColor = editingHabit ? editingHabit.color : newHabit.color
                                            
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    className={`day-btn ${isSelected ? 'selected' : ''}`}
                                                    style={{ 
                                                        '--habit-color': habitColor,
                                                        '--habit-color-alpha': `${habitColor}40`
                                                    }}
                                                    onClick={() => {
                                                        let nextDays
                                                        if (isSelected) {
                                                            nextDays = currentDays.filter(d => d !== i)
                                                        } else {
                                                            nextDays = [...currentDays, i].sort()
                                                        }
                                                        
                                                        if (editingHabit) {
                                                            setEditingHabit({...editingHabit, days_of_week: nextDays})
                                                        } else {
                                                            setNewHabit({...newHabit, days_of_week: nextDays})
                                                        }
                                                    }}
                                                >
                                                    {day}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <button 
                                        type="button" 
                                        className="select-all-days"
                                        onClick={() => {
                                            const allDays = [0,1,2,3,4,5,6]
                                            if (editingHabit) setEditingHabit({...editingHabit, days_of_week: allDays})
                                            else setNewHabit({...newHabit, days_of_week: allDays})
                                        }}
                                    >
                                        Selecionar todos os dias
                                    </button>
                                </div>

                                <div className="modal-row">
                                    <div className="modal-field">
                                        <label>Meta Diária (vezes)</label>
                                        <div className="number-input-wrapper">
                                            <button 
                                                type="button" 
                                                className="num-adjust-btn"
                                                onClick={() => {
                                                    const val = Math.max(1, (editingHabit ? editingHabit.goal : newHabit.goal) - 1)
                                                    editingHabit ? setEditingHabit({...editingHabit, goal: val}) : setNewHabit({...newHabit, goal: val})
                                                }}
                                            >–</button>
                                            <input 
                                                type="number" 
                                                min="1"
                                                value={editingHabit ? editingHabit.goal : newHabit.goal}
                                                readOnly
                                                className="modal-number-input"
                                            />
                                            <button 
                                                type="button" 
                                                className="num-adjust-btn"
                                                onClick={() => {
                                                    const val = (editingHabit ? editingHabit.goal : newHabit.goal) + 1
                                                    editingHabit ? setEditingHabit({...editingHabit, goal: val}) : setNewHabit({...newHabit, goal: val})
                                                }}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={() => { setIsAdding(false); setEditingHabit(null); }}>Cancelar</button>
                                    <button type="submit" className="save-btn">Salvar Hábito</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {selectedHabitHistory && (
                    <HabitHistoryModal 
                        habit={selectedHabitHistory}
                        logs={logs.filter(l => l.habit_id === selectedHabitHistory.id)}
                        onClose={() => setSelectedHabitHistory(null)}
                        calculateStreak={calculateStreak}
                        onToggle={async (date) => await toggleHabit(selectedHabitHistory.id, date)}
                        onEdit={() => {
                            setSelectedHabitHistory(null)
                            setEditingHabit(selectedHabitHistory)
                        }}
                        onDelete={async () => {
                            if (window.confirm('Excluir este hábito e todo seu histórico?')) {
                                await deleteHabit(selectedHabitHistory.id)
                                setSelectedHabitHistory(null)
                            }
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

const HabitHistoryModal = ({ habit, logs, onClose, calculateStreak, onEdit, onDelete, onToggle }) => {
    const [viewMode, setViewMode] = useState('monthly') // changed default to monthly as it looks better for github style grid
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const startDate = new Date(habit.created_at)
    startDate.setHours(0, 0, 0, 0)
    
    const getMonday = (d) => {
        const date = new Date(d)
        const day = date.getDay()
        const diff = date.getDate() - day + (day === 0 ? -6 : 1)
        return new Date(date.setDate(diff))
    }

    const getSunday = (d) => {
        const date = new Date(d)
        const day = date.getDay()
        const diff = date.getDate() + (day === 0 ? 0 : 7 - day)
        return new Date(date.setDate(diff))
    }

    const firstMonday = getMonday(startDate)
    const lastSunday = getSunday(today)
    
    const days = []
    const currentDate = new Date(firstMonday)
    currentDate.setHours(0, 0, 0, 0)
    
    while (currentDate <= lastSunday) {
        days.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
    }

    const scheduledDays = habit.days_of_week || [0,1,2,3,4,5,6]
    
    const allDayHeaders = [
        { id: 1, label: 'Seg' },
        { id: 2, label: 'Ter' },
        { id: 3, label: 'Qua' },
        { id: 4, label: 'Qui' },
        { id: 5, label: 'Sex' },
        { id: 6, label: 'Sáb' },
        { id: 0, label: 'Dom' }
    ]
    const filteredDayHeaders = allDayHeaders.filter(h => scheduledDays.includes(h.id))
    const filteredDays = days.filter(d => scheduledDays.includes(d.getDay()))

    const getDayStatus = (date) => {
        const dateStr = date.toISOString().split('T')[0]
        const todayStr = today.toISOString().split('T')[0]
        
        if (date > today) return 'future'
        if (date < startDate) return 'pre-creation'
        
        const isScheduled = scheduledDays.includes(date.getDay())
        const dayLogs = logs.filter(l => l.completed_at.startsWith(dateStr))
        const isDone = dayLogs.length >= habit.goal
        
        if (isDone) return 'completed'
        if (!isScheduled) return 'rest'
        if (dateStr === todayStr) return 'in-progress'
        return 'failed'
    }

    const totalCompletions = logs.length
    const streak = calculateStreak(habit.id)
    
    const activeScheduledDaysCount = filteredDays.filter(d => d >= startDate && d <= today).length
    const completedDaysCount = filteredDays.filter(d => getDayStatus(d) === 'completed').length
    const missedDaysCount = filteredDays.filter(d => getDayStatus(d) === 'failed').length
    const successRate = Math.min(100, Math.round((completedDaysCount / Math.max(1, activeScheduledDaysCount)) * 100))

    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1))
    
    const weeklyTotalDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek)
        d.setDate(startOfWeek.getDate() + i)
        return d
    }).filter(d => d >= startDate && scheduledDays.includes(d.getDay())).length
    
    const weeklyDone = filteredDays.filter(d => d >= startOfWeek && d <= today && getDayStatus(d) === 'completed').length
    const weeklyRate = weeklyTotalDays > 0 ? Math.round((weeklyDone / weeklyTotalDays) * 100) : 0
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const monthlyTotalDays = Array.from({ length: endOfMonth.getDate() }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth(), 1 + i)
        return d
    }).filter(d => d >= startDate && scheduledDays.includes(d.getDay())).length
    
    const monthlyDone = filteredDays.filter(d => d >= startOfMonth && d <= today && getDayStatus(d) === 'completed').length
    const monthlyRate = monthlyTotalDays > 0 ? Math.round((monthlyDone / monthlyTotalDays) * 100) : 0

    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    const calStart = getMonday(currentMonthStart)
    const calEnd = getSunday(currentMonthEnd)
    
    const monthlyCalendarDays = []
    const mCurr = new Date(calStart)
    mCurr.setHours(0, 0, 0, 0)
    while (mCurr <= calEnd) {
        monthlyCalendarDays.push(new Date(mCurr))
        mCurr.setDate(mCurr.getDate() + 1)
    }

    const currentWeekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek)
        d.setDate(startOfWeek.getDate() + i)
        d.setHours(0, 0, 0, 0)
        return d
    })

    const handleDayClick = (date, status) => {
        if (status !== 'future' && onToggle) {
            const d = new Date(date)
            const year = d.getFullYear()
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            onToggle(`${year}-${month}-${day}`)
        }
    }

    return (
        <div className="habit-modal-overlay" onClick={onClose}>
            <motion.div 
                className="habit-history-modal"
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
                <div className="history-header">
                    <div className="header-main">
                        <div className="habit-icon-large" style={{ backgroundColor: `${habit.color}20`, color: habit.color }}>
                            {habit.icon}
                        </div>
                        <div>
                            <h2>{habit.title}</h2>
                            <p>Desde {new Date(habit.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button className="close-history" onClick={onClose}>×</button>
                </div>

                <div className="history-view-selector">
                    <button 
                        className={viewMode === 'weekly' ? 'active' : ''} 
                        onClick={() => setViewMode('weekly')}
                    >
                        Vista Semanal
                    </button>
                    <button 
                        className={viewMode === 'monthly' ? 'active' : ''} 
                        onClick={() => setViewMode('monthly')}
                    >
                        Vista Mensal
                    </button>
                </div>

                {viewMode === 'weekly' ? (
                    <div className="history-calendar-grid weekly-single">
                        <div className="calendar-day-names" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                            {allDayHeaders.map(h => <span key={h.id}>{h.label}</span>)}
                        </div>
                        <div className="calendar-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                            {currentWeekDays.map((date, i) => {
                                const status = getDayStatus(date)
                                const isToday = date.toISOString().split('T')[0] === today.toISOString().split('T')[0]
                                
                                return (
                                    <motion.div 
                                        key={i}
                                        className={`calendar-day ${status} ${isToday ? 'is-today' : ''} ${status !== 'future' ? 'is-clickable' : ''}`}
                                        style={{ '--habit-color': habit.color }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        title={`${date.toLocaleDateString()} - Clique para marcar/desmarcar`}
                                        onClick={() => handleDayClick(date, status)}
                                        whileHover={status !== 'future' ? { scale: 1.1 } : {}}
                                        whileTap={status !== 'future' ? { scale: 0.9 } : {}}
                                    >
                                        <span className="day-number">{date.getDate()}</span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="history-calendar-grid monthly-mode">
                        <div className="calendar-day-names" style={{ gridTemplateColumns: `repeat(7, 1fr)` }}>
                            {allDayHeaders.map(h => <span key={h.id}>{h.label}</span>)}
                        </div>
                        <div className="calendar-grid" style={{ gridTemplateColumns: `repeat(7, 1fr)` }}>
                            {monthlyCalendarDays.map((date, i) => {
                                const isCurrentMonth = date.getMonth() === today.getMonth()
                                const status = getDayStatus(date)
                                const isToday = date.toISOString().split('T')[0] === today.toISOString().split('T')[0]
                                
                                return (
                                    <motion.div 
                                        key={i}
                                        className={`calendar-day ${status} ${isToday ? 'is-today' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${status !== 'future' && isCurrentMonth ? 'is-clickable' : ''}`}
                                        style={{ '--habit-color': habit.color }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.005 }}
                                        title={`${date.toLocaleDateString()} - Clique para marcar/desmarcar`}
                                        onClick={() => isCurrentMonth && handleDayClick(date, status)}
                                        whileHover={status !== 'future' && isCurrentMonth ? { scale: 1.1 } : {}}
                                        whileTap={status !== 'future' && isCurrentMonth ? { scale: 0.9 } : {}}
                                    >
                                        <span className="day-number">{date.getDate()}</span>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className="history-legend">
                    <div className="legend-item"><span className="l-dot completed" /> Concluído</div>
                    <div className="legend-item"><span className="l-dot failed" /> Falhou</div>
                    <div className="legend-item"><span className="l-dot empty" /> Sem registro / Futuro</div>
                </div>

                <div className="history-stats" style={{ marginTop: '24px' }}>
                    <div className="h-stat">
                        <span className="h-label">Sequência</span>
                        <span className="h-value" style={{ color: '#fbbf24' }}>🔥 {streak}d</span>
                    </div>
                    <div className="h-stat">
                        <span className="h-label">Taxa Geral</span>
                        <span className="h-value" style={{ color: '#10b981' }}>📈 {successRate}%</span>
                    </div>
                    <div className="h-stat">
                        <span className="h-label">Meta Semanal</span>
                        <span className="h-value" style={{ color: '#8b5cf6' }}>📅 {weeklyRate}%</span>
                    </div>
                    <div className="h-stat">
                        <span className="h-label">Meta Mensal</span>
                        <span className="h-value" style={{ color: '#ec4899' }}>🗓️ {monthlyRate}%</span>
                    </div>
                    <div className="h-stat">
                        <span className="h-label">Total Checks</span>
                        <span className="h-value" style={{ color: habit.color }}>🎯 {totalCompletions}</span>
                    </div>
                    <div className="h-stat">
                        <span className="h-label">Dias Perdidos</span>
                        <span className="h-value" style={{ color: '#ef4444' }}>❌ {missedDaysCount}</span>
                    </div>
                </div>

                <div className="history-footer-actions">
                    {onEdit && <button className="h-footer-btn edit" onClick={onEdit}>✎ Editar Hábito</button>}
                    {onDelete && <button className="h-footer-btn delete" onClick={onDelete}>× Excluir</button>}
                </div>
            </motion.div>
        </div>
    )
}

export default HabitTracker
