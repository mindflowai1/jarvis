import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'

export default function Tasks({ session }) {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [draggingId, setDraggingId] = useState(null)

    // CRUD State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentTask, setCurrentTask] = useState(null) // null = new, object = edit

    useEffect(() => {
        fetchNotes()
    }, [session])

    const fetchNotes = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            setNotes(data || [])
        } catch (error) {
            console.error('Error fetching notes:', error)
            setError('Erro ao carregar notas. Tente novamente mais tarde.')
        } finally {
            setLoading(false)
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

    const handleSaveTask = async (taskText) => {
        if (!taskText.trim()) return

        try {
            if (currentTask) {
                // Update existing
                const { error } = await supabase
                    .from('notes')
                    .update({ content: taskText, updated_at: new Date() })
                    .eq('id', currentTask.id)

                if (error) throw error

                setNotes(prev => prev.map(n =>
                    n.id === currentTask.id ? { ...n, content: taskText, text: taskText } : n
                ))
            } else {
                // Create new
                const { data, error } = await supabase
                    .from('notes')
                    .insert([{
                        user_id: session?.user?.id,
                        content: taskText,
                        is_completed: false
                    }])
                    .select()

                if (error) throw error

                if (data) setNotes(prev => [data[0], ...prev])
            }
            setIsModalOpen(false)
            setCurrentTask(null)
        } catch (error) {
            console.error('Error saving task:', error)
            alert('Erro ao salvar tarefa')
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

    const openModal = (task = null) => {
        setCurrentTask(task)
        setIsModalOpen(true)
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Separate notes into columns
    const todoNotes = notes.filter(n => !n.is_completed)
    const doneNotes = notes.filter(n => n.is_completed)

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
            <div className="tasks-header">
                <h2>Meus Afazeres</h2>
                <div className="tasks-actions">
                    <button className="add-btn" onClick={() => openModal()}>
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
                    <motion.div className="column-content" layout>
                        <AnimatePresence>
                            {todoNotes.map((note) => (
                                <KanbanCard
                                    key={note.id}
                                    note={note}
                                    formatDate={formatDate}
                                    setDraggingId={setDraggingId}
                                    onEdit={() => openModal(note)}
                                    onDelete={() => handleDeleteTask(note.id)}
                                    onDragEnd={(e, info) => {
                                        if (info.offset.x > 100) updateTaskStatus(note.id, true)
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                        {todoNotes.length === 0 && (
                            <div className="empty-column-state">
                                <p>Tudo feito! 🎉</p>
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
                    <motion.div className="column-content" layout>
                        <AnimatePresence>
                            {doneNotes.map((note) => (
                                <KanbanCard
                                    key={note.id}
                                    note={note}
                                    formatDate={formatDate}
                                    isDone={true}
                                    setDraggingId={setDraggingId}
                                    onEdit={() => openModal(note)}
                                    onDelete={() => handleDeleteTask(note.id)}
                                    onDragEnd={(e, info) => {
                                        if (info.offset.x < -100) updateTaskStatus(note.id, false)
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                        {doneNotes.length === 0 && (
                            <div className="empty-column-state">
                                <p>Nenhuma tarefa concluída</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                initialTask={currentTask}
            />
        </div>
    )
}

function KanbanCard({ note, formatDate, isDone, onDragEnd, setDraggingId, onEdit, onDelete }) {
    const isDragging = useRef(false)

    return (
        <motion.div
            layout
            layoutId={note.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            drag
            dragSnapToOrigin={true}
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
                <span className="note-date">
                    {formatDate(note.created_at || note.date)}
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

function TaskModal({ isOpen, onClose, onSave, initialTask }) {
    const [content, setContent] = useState('')

    useEffect(() => {
        if (isOpen) {
            setContent(initialTask ? (initialTask.content || initialTask.text || '') : '')
        }
    }, [isOpen, initialTask])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(content)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="modal-container"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                        <h3>{initialTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                autoFocus
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="O que precisa ser feito?"
                                maxLength={500}
                            />
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={onClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="save-btn" disabled={!content.trim()}>
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
