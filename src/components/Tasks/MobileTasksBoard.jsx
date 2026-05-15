import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './MobileTasksBoard.css'

export default function MobileTasksBoard({
    projects,
    filteredNotes,
    updateTaskStatus,
    handleDeleteTask,
    formatDate,
    setIsModalOpen,
    setEditingTask,
    filterDate,
    setFilterDate,
    projectFilters,
    setProjectFilters,
    setIsProjectModalOpen,
    setEditingProject,
    handleDeleteProject,
}) {
    const [expandedProjects, setExpandedProjects] = useState({})

    const toggleProjectExpanded = (projectId) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }))
    }

    return (
        <div className="mtk-container">
            {/* ===== CONTROLS ===== */}
            <div className="mtk-toolbar">
                <div className="mtk-toolbar-row">
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

                    <div className="mtk-toolbar-actions">
                        <button
                            className="mtk-icon-btn mtk-add-btn"
                            onClick={() => {
                                setEditingProject(null)
                                setIsProjectModalOpen(true)
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== PROJECTS LIST ===== */}
            <div className="mtk-projects-list">
                {projects.length === 0 ? (
                    <div className="mtk-empty">
                        <span className="mtk-empty-icon">📋</span>
                        <p className="mtk-empty-text">Nenhum projeto encontrado.</p>
                    </div>
                ) : (
                    projects.map(project => {
                        const projectSpecificDate = projectFilters[project.id] || ''

                        // Filtra tarefas deste projeto e aplica o filtro de data específico do projeto
                        const projectTasks = filteredNotes.filter(n => {
                            const isProjectTask = n.project_id === project.id
                            if (!isProjectTask) return false

                            if (projectSpecificDate) {
                                return n.prazo === projectSpecificDate
                            }
                            return true
                        })

                        const todoTasks = projectTasks.filter(n => !n.is_completed)
                        const doneTasks = projectTasks.filter(n => n.is_completed)
                        const isExpanded = expandedProjects[project.id]

                        return (
                            <div key={project.id} className="mtk-project-section">
                                <div className="mtk-project-header">
                                    <div className="mtk-project-info">
                                        <span className="mtk-project-dot" style={{ backgroundColor: project.color }}></span>
                                        <h3
                                            className="mtk-project-name"
                                            onClick={() => {
                                                setEditingProject(project)
                                                setIsProjectModalOpen(true)
                                            }}
                                        >
                                            {project.name}
                                        </h3>
                                        <span className="mtk-project-count">{todoTasks.length}</span>
                                        <button
                                            className="mtk-delete-project-btn"
                                            onClick={() => handleDeleteProject(project.id, project.name)}
                                            title="Excluir Projeto"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5 0v8.25a.75.75 0 101.5 0v-8.25zm4.5 0a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0v-8.25z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="mtk-project-header-actions">
                                        <div className={`mtk-project-filter ${projectSpecificDate ? 'active' : ''}`}>
                                            <input
                                                type="date"
                                                value={projectSpecificDate}
                                                onChange={(e) => setProjectFilters(prev => ({
                                                    ...prev,
                                                    [project.id]: e.target.value
                                                }))}
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                            </svg>
                                            {projectSpecificDate && (
                                                <button
                                                    className="mtk-clear-project-filter"
                                                    onClick={() => setProjectFilters(prev => ({
                                                        ...prev,
                                                        [project.id]: ''
                                                    }))}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            className="mtk-add-task-inline"
                                            onClick={() => {
                                                setEditingTask({ project_id: project.id })
                                                setIsModalOpen(true)
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="mtk-tasks-container">
                                    {todoTasks.map((task, idx) => (
                                        <MobileTaskCard
                                            key={task.id}
                                            note={task}
                                            index={idx}
                                            isDone={false}
                                            formatDate={formatDate}
                                            updateTaskStatus={updateTaskStatus}
                                            handleDeleteTask={handleDeleteTask}
                                            setEditingTask={setEditingTask}
                                            setIsModalOpen={setIsModalOpen}
                                        />
                                    ))}

                                    {todoTasks.length === 0 && !isExpanded && (
                                        <p className="mtk-no-tasks">Nenhuma tarefa pendente</p>
                                    )}

                                    {doneTasks.length > 0 && (
                                        <div className="mtk-done-section">
                                            <button
                                                className="mtk-toggle-done"
                                                onClick={() => toggleProjectExpanded(project.id)}
                                            >
                                                {isExpanded ? 'Ocultar concluídas' : `Ver concluídas (${doneTasks.length})`}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    width="12"
                                                    height="12"
                                                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </button>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mtk-done-list"
                                                    >
                                                        {doneTasks.map((task, idx) => (
                                                            <MobileTaskCard
                                                                key={task.id}
                                                                note={task}
                                                                index={idx}
                                                                isDone={true}
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
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.02 }}
            className={`mtk-card ${isDone ? 'mtk-card-done' : ''} ${getDeadlineClass()}`}
            onClick={handleEdit}
        >
            <div
                className={`mtk-checkbox ${isDone ? 'checked' : ''}`}
                onClick={(e) => {
                    e.stopPropagation()
                    updateTaskStatus(note.id, !isDone)
                }}
            >
                {isDone && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                )}
            </div>

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
                        {note.recurrence_period && (
                            <span className="mtk-recurrence-badge" title={`Repete: ${note.recurrence_period}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
                                    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                                </svg>
                            </span>
                        )}
                        {getDeadlineClass() === 'mtk-overdue' && <span className="mtk-overdue-label">Vencida</span>}
                    </span>
                )}
            </div>

            <button className="mtk-delete-btn" onClick={handleDelete}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </motion.div>
    )
}
