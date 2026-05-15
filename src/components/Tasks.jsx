import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import TaskModal from './TaskModal'
import ProjectModal from './ProjectModal'
import MobileTasksBoard from './Tasks/MobileTasksBoard'
import '../Tasks.css'

export default function Tasks({ session }) {
    const [notes, setNotes] = useState([])
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [editingProject, setEditingProject] = useState(null)
    const [filterDate, setFilterDate] = useState('')
    const [projectFilters, setProjectFilters] = useState({}) // Novo estado para filtros individuais
    const [expandedProjects, setExpandedProjects] = useState({}) // For "Show Completed" toggle

    useEffect(() => {
        fetchData()
    }, [session])

    const fetchData = async () => {
        try {
            setLoading(true)

            // 1. Fetch Projects
            const { data: projectsData, error: projectsError } = await supabase
                .from('task_projects')
                .select('*')
                .order('created_at', { ascending: true })

            if (projectsError) throw projectsError

            // 2. Fetch Tasks
            let query = supabase
                .from('notes')
                .select('*')
                .order('prazo', { ascending: true, nullsFirst: false })
                .order('created_at', { ascending: false })

            const { data: tasksData, error: tasksError } = await query

            if (tasksError) throw tasksError

            setProjects(projectsData || [])
            setNotes(tasksData || [])
        } catch (error) {
            console.error('Error fetching tasks data:', error)
            setError('Erro ao carregar dados. Tente novamente mais tarde.')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveTask = async (taskData) => {
        try {
            const user = session?.user

            if (editingTask && editingTask.id) {
                // Update
                const { error } = await supabase
                    .from('notes')
                    .update({
                        content: taskData.text,
                        prazo: taskData.prazo,
                        project_id: taskData.project_id,
                        recurrence_period: taskData.recurrence_period || null,
                        recurrence_day: taskData.recurrence_day != null ? taskData.recurrence_day : null
                    })
                    .eq('id', editingTask.id)

                if (error) throw error
            } else {
                // Insert
                const { error } = await supabase
                    .from('notes')
                    .insert({
                        user_id: user?.id,
                        content: taskData.text,
                        is_completed: false,
                        prazo: taskData.prazo,
                        project_id: taskData.project_id,
                        recurrence_period: taskData.recurrence_period || null,
                        recurrence_day: taskData.recurrence_day != null ? taskData.recurrence_day : null
                    })

                if (error) throw error
            }
            fetchData()
            setIsModalOpen(false)
            setEditingTask(null)
        } catch (error) {
            console.error('Error saving task:', error)
            alert('Erro ao salvar tarefa')
            throw error
        }
    }

    const handleSaveProject = async (projectData) => {
        try {
            if (editingProject) {
                // Update
                const { error } = await supabase
                    .from('task_projects')
                    .update({
                        name: projectData.name,
                        color: projectData.color
                    })
                    .eq('id', editingProject.id)

                if (error) throw error
            } else {
                // Insert
                const { error } = await supabase
                    .from('task_projects')
                    .insert({
                        user_id: session?.user?.id,
                        name: projectData.name,
                        color: projectData.color
                    })

                if (error) throw error
            }
            fetchData()
            setIsProjectModalOpen(false)
            setEditingProject(null)
        } catch (error) {
            console.error('Error saving project:', error)
            alert('Erro ao salvar projeto')
        }
    }

    const handleDeleteProject = async (projectId, projectName) => {
        if (!confirm(`Tem certeza que deseja excluir o projeto "${projectName}"? Todas as tarefas vinculadas a ele serão afetadas.`)) return

        try {
            const { error } = await supabase
                .from('task_projects')
                .delete()
                .eq('id', projectId)

            if (error) throw error
            fetchData()
        } catch (error) {
            console.error('Error deleting project:', error)
            alert('Erro ao excluir projeto')
        }
    }

    const updateTaskStatus = async (id, newStatus) => {
        setNotes(prevNotes => prevNotes.map(note =>
            note.id === id ? { ...note, is_completed: newStatus } : note
        ))

        try {
            const { error } = await supabase
                .from('notes')
                .update({ is_completed: newStatus })
                .eq('id', id)

            if (error) throw error
        } catch (error) {
            console.error('Error updating task:', error)
            fetchData()
            alert('Erro ao atualizar tarefa')
        }
    }

    const handleDeleteTask = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return

        setNotes(prev => prev.filter(n => n.id !== id))

        try {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', id)

            if (error) throw error
        } catch (error) {
            console.error('Error deleting task:', error)
            fetchData() // Revert
            alert('Erro ao excluir tarefa')
        }
    }

    const toggleProjectExpanded = (projectId) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }))
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        const [year, month, day] = dateString.toString().split('T')[0].split('-')
        return `${day}/${month}/${year}`
    }

    // Filter notes locally
    const getFilteredNotes = () => {
        let result = notes;

        // Aplica filtro global se existir
        if (filterDate) {
            result = result.filter(n => n.prazo === filterDate);
        }

        return result;
    }

    const filteredNotes = getFilteredNotes();

    if (loading) {
        return (
            <div className="tasks-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Carregando suas tarefas...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="tasks-container">
            {/* ===== DESKTOP VIEW ===== */}
            <div className="tasks-desktop-wrapper">
                <div className="tasks-header">
                    <h2>Minhas Tarefas</h2>
                    <div className="tasks-actions">
                        <div className="filter-container">
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

                        <button className="add-project-btn" onClick={() => {
                            setEditingProject(null)
                            setIsProjectModalOpen(true)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Novo Projeto
                        </button>

                        <button className="add-btn" onClick={() => {
                            setEditingTask(null)
                            setIsModalOpen(true)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Nova Tarefa
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="projects-grid">
                    {projects.length === 0 ? (
                        <div className="empty-projects-state">
                            <p>Você ainda não tem projetos. Crie um para começar a organizar suas tarefas!</p>
                            <button className="btn-create-first" onClick={() => {
                                setEditingProject(null)
                                setIsProjectModalOpen(true)
                            }}>Criar Primeiro Projeto</button>
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
                                <div key={project.id} className="project-column">
                                    <div className="project-header">
                                        <div className="project-title-group">
                                            <span className="project-dot" style={{ backgroundColor: project.color }}></span>
                                            <h3>{project.name}</h3>
                                            <span className="count-badge">{todoTasks.length}</span>
                                        </div>
                                        <div className="project-actions">
                                            <div className={`project-filter-mini ${projectSpecificDate ? 'active' : ''}`}>
                                                <input
                                                    type="date"
                                                    value={projectSpecificDate}
                                                    onChange={(e) => setProjectFilters(prev => ({
                                                        ...prev,
                                                        [project.id]: e.target.value
                                                    }))}
                                                    title="Filtrar este projeto"
                                                />
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                </svg>
                                                {projectSpecificDate && (
                                                    <button
                                                        className="clear-project-filter"
                                                        onClick={() => setProjectFilters(prev => ({
                                                            ...prev,
                                                            [project.id]: ''
                                                        }))}
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                            <button className="project-action-btn" onClick={() => {
                                                setEditingProject(project)
                                                setIsProjectModalOpen(true)
                                            }} title="Editar Projeto">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                            </button>
                                            <button className="project-action-btn delete" onClick={() => handleDeleteProject(project.id, project.name)} title="Excluir Projeto">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="project-tasks-list">
                                        <AnimatePresence>
                                            {todoTasks.map(task => (
                                                <KanbanCard
                                                    key={task.id}
                                                    note={task}
                                                    formatDate={formatDate}
                                                    onEdit={() => {
                                                        setEditingTask(task)
                                                        setIsModalOpen(true)
                                                    }}
                                                    onDelete={() => handleDeleteTask(task.id)}
                                                    onToggleStatus={() => updateTaskStatus(task.id, true)}
                                                />
                                            ))}
                                        </AnimatePresence>

                                        {todoTasks.length === 0 && !isExpanded && (
                                            <div className="empty-project-tasks">
                                                <p>Nenhuma tarefa pendente</p>
                                            </div>
                                        )}

                                        {doneTasks.length > 0 && (
                                            <div className="done-tasks-section">
                                                <button className="toggle-done-btn" onClick={() => toggleProjectExpanded(project.id)}>
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
                                                            className="done-tasks-list"
                                                        >
                                                            {doneTasks.map(task => (
                                                                <KanbanCard
                                                                    key={task.id}
                                                                    note={task}
                                                                    isDone={true}
                                                                    formatDate={formatDate}
                                                                    onEdit={() => {
                                                                        setEditingTask(task)
                                                                        setIsModalOpen(true)
                                                                    }}
                                                                    onDelete={() => handleDeleteTask(task.id)}
                                                                    onToggleStatus={() => updateTaskStatus(task.id, false)}
                                                                />
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>

                                    <button className="add-task-inline" onClick={() => {
                                        setEditingTask({ project_id: project.id })
                                        setIsModalOpen(true)
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="14" height="14">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Adicionar tarefa
                                    </button>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* ===== MOBILE VIEW ===== */}
            <div className="tasks-mobile-wrapper">
                <MobileTasksBoard
                    projects={projects}
                    filteredNotes={filteredNotes}
                    updateTaskStatus={updateTaskStatus}
                    handleDeleteTask={handleDeleteTask}
                    formatDate={formatDate}
                    setIsModalOpen={setIsModalOpen}
                    setEditingTask={setEditingTask}
                    filterDate={filterDate}
                    setFilterDate={setFilterDate}
                    projectFilters={projectFilters}
                    setProjectFilters={setProjectFilters}
                    setIsProjectModalOpen={setIsProjectModalOpen}
                    setEditingProject={setEditingProject}
                    handleDeleteProject={handleDeleteProject}
                />
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={editingTask}
                projects={projects}
            />

            <ProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onSave={handleSaveProject}
                project={editingProject}
            />
        </div>
    )
}

function KanbanCard({ note, formatDate, isDone, onEdit, onDelete, onToggleStatus }) {
    const isOverdue = !isDone && note.prazo && new Date(note.prazo + 'T23:59:59') < new Date();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01 }}
            className={`note-card project-task-card ${isDone ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
            onClick={(e) => {
                if (e.target.closest('.card-actions') || e.target.closest('.task-check') || e.target.closest('.task-check-circle')) return;
                onEdit();
            }}
        >
            <div className="task-body">
                <button
                    className={`task-check ${isDone ? 'checked' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus();
                    }}
                >
                    {isDone && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
                <div className="note-content">
                    <p>{note.text || note.content || 'Sem conteúdo'}</p>
                    {note.prazo && (
                        <span className="note-date">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                            </svg>
                            {formatDate(note.prazo)}
                            {note.recurrence_period && (
                                <span className="recurrence-badge" title={{
                                    daily: 'Repete diariamente',
                                    weekly: 'Repete semanalmente',
                                    monthly: 'Repete mensalmente'
                                }[note.recurrence_period] || ''}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
                                        <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                            {isOverdue && <span className="overdue-label">Vencida</span>}
                        </span>
                    )}
                </div>
            </div>

            <div className="card-actions">
                <button className="icon-btn delete-btn" onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }} title="Excluir">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </div>
        </motion.div>
    )
}
