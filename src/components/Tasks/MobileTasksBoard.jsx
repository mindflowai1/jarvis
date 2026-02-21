import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './MobileTasksBoard.css'

export default function MobileTasksBoard({
    todoNotes,
    doneNotes,
    updateTaskStatus,
    handleDeleteTask,
    handleClearCompleted,
    formatDate,
    setIsModalOpen,
    setEditingTask,
    filterDate,
    setFilterDate,
}) {
    const [activeTab, setActiveTab] = useState('todo')

    const currentNotes = activeTab === 'todo' ? todoNotes : doneNotes

    return (
        <div className="mtk-container">
            {/* ===== STICKY HEADER ===== */}
            <div className="mtk-header">
                <div className="mtk-header-top">
                    <h2 className="mtk-title">Afazeres</h2>
                    <div className="mtk-header-actions">
                        <div className="filter-container mobile-filter-container">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="filter-icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            <div className="filter-input-wrapper">
                                {!filterDate && <span className="filter-placeholder">Todos</span>}
                                <input
                                    type="date"
                                    className={`filter-date-input ${!filterDate ? 'transparent-input' : ''}`}
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    title="Filtrar por data"
                                />
                            </div>
                            {filterDate && (
                                <button
                                    className="clear-filter-btn"
                                    onClick={() => setFilterDate('')}
                                    title="Mostrar Todos"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        {activeTab === 'done' && doneNotes.length > 0 && (
                            <button
                                className="mtk-icon-btn mtk-clear-btn"
                                onClick={handleClearCompleted}
                                title="Esvaziar Lixeira"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        )}
                        <button
                            className="mtk-icon-btn mtk-add-btn"
                            onClick={() => {
                                setEditingTask(null)
                                setIsModalOpen(true)
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ===== TABS ===== */}
                <div className="mtk-tabs">
                    <button
                        className={`mtk-tab ${activeTab === 'todo' ? 'mtk-tab-active' : ''}`}
                        onClick={() => setActiveTab('todo')}
                    >
                        <span className="mtk-tab-dot mtk-dot-todo" />
                        A Fazer
                        <span className="mtk-tab-badge">{todoNotes.length}</span>
                    </button>
                    <button
                        className={`mtk-tab ${activeTab === 'done' ? 'mtk-tab-active' : ''}`}
                        onClick={() => setActiveTab('done')}
                    >
                        <span className="mtk-tab-dot mtk-dot-done" />
                        Concluídos
                        <span className="mtk-tab-badge">{doneNotes.length}</span>
                    </button>
                </div>
            </div>

            {/* ===== TASK LIST ===== */}
            <div className="mtk-list">
                <AnimatePresence mode="wait">
                    {currentNotes.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mtk-empty"
                        >
                            <span className="mtk-empty-icon">
                                {activeTab === 'todo' ? '🎉' : '📋'}
                            </span>
                            <p className="mtk-empty-text">
                                {activeTab === 'todo'
                                    ? 'Tudo feito! Nenhuma tarefa pendente.'
                                    : 'Nenhuma tarefa concluída ainda.'}
                            </p>
                            {activeTab === 'todo' && (
                                <button
                                    className="mtk-empty-cta"
                                    onClick={() => {
                                        setEditingTask(null)
                                        setIsModalOpen(true)
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                    </svg>
                                    Nova Tarefa
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: activeTab === 'todo' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mtk-cards"
                        >
                            {currentNotes.map((note, index) => (
                                <MobileTaskCard
                                    key={note.id}
                                    note={note}
                                    index={index}
                                    isDone={activeTab === 'done'}
                                    formatDate={formatDate}
                                    updateTaskStatus={updateTaskStatus}
                                    handleDeleteTask={handleDeleteTask}
                                    setEditingTask={setEditingTask}
                                    setIsModalOpen={setIsModalOpen}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function MobileTaskCard({
    note,
    index,
    isDone,
    formatDate,
    updateTaskStatus,
    handleDeleteTask,
    setEditingTask,
    setIsModalOpen,
}) {
    const isDragging = useRef(false)

    const handleEdit = () => {
        if (isDragging.current) return
        setEditingTask(note)
        setIsModalOpen(true)
    }

    const handleDelete = (e) => {
        e.stopPropagation()
        handleDeleteTask(note.id)
    }

    // Determine deadline urgency
    const getDeadlineClass = () => {
        if (!note.prazo || isDone) return ''
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const deadline = new Date(note.prazo + 'T00:00:00')
        const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
        if (diff < 0) return 'mtk-overdue'
        if (diff === 0) return 'mtk-due-today'
        if (diff <= 2) return 'mtk-due-soon'
        return ''
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.04 }}
            drag="x"
            dragSnapToOrigin
            dragMomentum={false}
            dragElastic={0.15}
            dragConstraints={{ left: -120, right: 120 }}
            onDragStart={() => { isDragging.current = true }}
            onDragEnd={(e, info) => {
                const threshold = 80
                if (!isDone && info.offset.x > threshold) {
                    updateTaskStatus(note.id, true)
                } else if (isDone && info.offset.x < -threshold) {
                    updateTaskStatus(note.id, false)
                }
                setTimeout(() => { isDragging.current = false }, 100)
            }}
            whileDrag={{ scale: 1.03, zIndex: 50, boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }}
            className={`mtk-card ${isDone ? 'mtk-card-done' : ''} ${getDeadlineClass()}`}
            onClick={handleEdit}
        >
            {/* Checkbox (visual only) */}
            <div className="mtk-checkbox">
                {isDone ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <circle cx="12" cy="12" r="9.75" />
                    </svg>
                )}
            </div>

            {/* Content */}
            <div className="mtk-card-body">
                <p className="mtk-card-text">
                    {note.text || note.content || 'Sem conteúdo'}
                </p>
                {note.prazo && (
                    <span className={`mtk-card-deadline ${getDeadlineClass()}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                        </svg>
                        {formatDate(note.prazo)}
                    </span>
                )}
            </div>

            {/* Delete */}
            <button className="mtk-delete-btn" onClick={handleDelete}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </motion.div>
    )
}
