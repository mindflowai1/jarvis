import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import TaskModal from './TaskModal'
import MobileTasksBoard from './Tasks/MobileTasksBoard'
import '../Tasks.css'

export default function Tasks({ session }) {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [draggingId, setDraggingId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [filterDate, setFilterDate] = useState('')

    useEffect(() => {
        fetchNotes()
    }, [session])

    const fetchNotes = async () => {
        try {
            setLoading(true)
            let query = supabase
                .from('notes')
                .select('*')
                // Always order by deadline (prazo) closest first, then Created most recent
                .order('prazo', { ascending: true, nullsFirst: false })
                .order('created_at', { ascending: false })

            const { data, error } = await query

            if (error) throw error

            setNotes(data || [])
        } catch (error) {
            console.error('Error fetching notes:', error)
            setError('Erro ao carregar notas. Tente novamente mais tarde.')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveTask = async (taskData) => {
        try {
            const user = session?.user

            if (editingTask) {
                // Update
                const { error } = await supabase
                    .from('notes')
                    .update({
                        content: taskData.text,
                        prazo: taskData.prazo
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
                        prazo: taskData.prazo
                    })

                if (error) throw error
            }
            fetchNotes()
            setIsModalOpen(false)
            setEditingTask(null)
        } catch (error) {
            console.error('Error saving task:', error)
            alert('Erro ao salvar tarefa')
            throw error
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
            fetchNotes() // Revert by fetching
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
            fetchNotes() // Revert
            alert('Erro ao excluir tarefa')
        }
    }

    const handleClearCompleted = async () => {
        if (doneNotes.length === 0) return

        const confirmed = confirm(
            `Tem certeza que deseja excluir permanentemente ${doneNotes.length} tarefa(s) concluída(s)? Esta ação não pode ser desfeita.`
        )

        if (!confirmed) return

        // Optimistic update
        const idsToDelete = doneNotes.map(n => n.id)
        setNotes(prev => prev.filter(n => !n.is_completed))

        try {
            const { error } = await supabase
                .from('notes')
                .delete()
                .in('id', idsToDelete)

            if (error) throw error
        } catch (error) {
            console.error('Error clearing completed tasks:', error)
            fetchNotes() // Revert on error
            alert('Erro ao limpar tarefas concluídas')
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        const [year, month, day] = dateString.toString().split('T')[0].split('-')
        return `${day}/${month}/${year}`
    }

    // Filter notes locally
    const filteredNotes = filterDate
        ? notes.filter(n => n.prazo === filterDate)
        : notes

    // Separate notes into columns
    const todoNotes = filteredNotes.filter(n => !n.is_completed)
    const doneNotes = filteredNotes.filter(n => n.is_completed)

    if (loading) {
        return (
            <div className="tasks-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Carregando suas anotações...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="tasks-container">
            {/* ===== DESKTOP VIEW ===== */}
            <div className="tasks-desktop-wrapper">
                <div className="tasks-header">
                    <h2>Meus Afazeres</h2>
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

                        <button className="add-btn" onClick={() => {
                            setEditingTask(null)
                            setIsModalOpen(true)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Nova Tarefa
                        </button>
                        <button className="refresh-btn" onClick={fetchNotes} title="Atualizar">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="kanban-board">
                    {/* Column: To Do */}
                    <div
                        className="kanban-column todo-column"
                        style={{ zIndex: todoNotes.some(n => n.id === draggingId) ? 20 : 1 }}
                    >
                        <div className="column-header">
                            <h3>A Fazer</h3>
                            <span className="count-badge">{todoNotes.length}</span>
                        </div>
                        <motion.div className="column-content">
                            <AnimatePresence>
                                {todoNotes.map((note) => (
                                    <KanbanCard
                                        key={note.id}
                                        note={note}
                                        formatDate={formatDate}
                                        setDraggingId={setDraggingId}
                                        onEdit={() => {
                                            setEditingTask(note)
                                            setIsModalOpen(true)
                                        }}
                                        onDelete={() => handleDeleteTask(note.id)}
                                        onDragEnd={(e, info) => {
                                            if (info.offset.x > 100) updateTaskStatus(note.id, true)
                                        }}
                                    />
                                ))}
                            </AnimatePresence>
                            {todoNotes.length === 0 && (
                                <div className="empty-column-state">
                                    <p>{filterDate ? 'Nenhuma tarefa para esta data' : 'Tudo feito! 🎉'}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Column: Done */}
                    <div
                        className="kanban-column done-column"
                        style={{ zIndex: doneNotes.some(n => n.id === draggingId) ? 20 : 1 }}
                    >
                        <div className="column-header">
                            <div className="column-header-left">
                                <h3>Concluído</h3>
                                <span className="count-badge">{doneNotes.length}</span>
                            </div>
                            {doneNotes.length > 0 && (
                                <button
                                    className="clear-completed-btn"
                                    onClick={handleClearCompleted}
                                    title="Esvaziar tarefas concluídas"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Esvaziar
                                </button>
                            )}
                        </div>
                        <motion.div className="column-content">
                            <AnimatePresence>
                                {doneNotes.map((note) => (
                                    <KanbanCard
                                        key={note.id}
                                        note={note}
                                        formatDate={formatDate}
                                        isDone={true}
                                        setDraggingId={setDraggingId}
                                        onEdit={() => {
                                            setEditingTask(note)
                                            setIsModalOpen(true)
                                        }}
                                        onDelete={() => handleDeleteTask(note.id)}
                                        onDragEnd={(e, info) => {
                                            if (info.offset.x < -100) updateTaskStatus(note.id, false)
                                        }}
                                    />
                                ))}
                            </AnimatePresence>
                            {doneNotes.length === 0 && (
                                <div className="empty-column-state">
                                    <p>{filterDate ? 'Nenhuma tarefa concluída nesta data' : 'Nenhuma tarefa concluída'}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ===== MOBILE VIEW ===== */}
            <div className="tasks-mobile-wrapper">
                <MobileTasksBoard
                    todoNotes={todoNotes}
                    doneNotes={doneNotes}
                    updateTaskStatus={updateTaskStatus}
                    handleDeleteTask={handleDeleteTask}
                    handleClearCompleted={handleClearCompleted}
                    formatDate={formatDate}
                    setIsModalOpen={setIsModalOpen}
                    setEditingTask={setEditingTask}
                    filterDate={filterDate}
                    setFilterDate={setFilterDate}
                />
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={editingTask}
            />
        </div>
    )
}

function KanbanCard({ note, formatDate, isDone, onDragEnd, setDraggingId, onEdit, onDelete }) {
    const isDragging = useRef(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            drag
            dragSnapToOrigin={true}
            dragMomentum={false}
            dragElastic={0.1}
            onDragStart={() => {
                isDragging.current = true
                setDraggingId(note.id)
            }}
            onDragEnd={(e, info) => {
                setDraggingId(null)
                onDragEnd(e, info)
                // Small delay to ensure onClick sees the drag state before resetting
                setTimeout(() => {
                    isDragging.current = false
                }, 100)
            }}
            whileDrag={{ scale: 1.05, zIndex: 100, cursor: 'grabbing', boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            whileHover={{ scale: 1.02, zIndex: 5 }}
            className={`note-card ${isDone ? 'completed' : ''}`}
            onClick={(e) => {
                // Prevent editing if dragging occurred
                if (isDragging.current) return;
                // Prevent editing when clicking buttons
                if (e.target.closest('.card-actions')) return;
                onEdit();
            }}
        >
            <div className="note-content">
                <p>{note.text || note.content || 'Sem conteúdo'}</p>
            </div>
            <div className="note-footer">
                <span className="note-date" title="Prazo">
                    {note.prazo && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px', marginRight: '4px', display: 'inline-block', verticalAlign: 'text-bottom' }}>
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                        </svg>
                    )}
                    {note.prazo ? formatDate(note.prazo) : 'Sem prazo'}
                </span>
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
            </div>
        </motion.div>
    )
}
