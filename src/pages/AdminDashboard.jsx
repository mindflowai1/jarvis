import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Users,
    Shield,
    LogOut,
    Search,
    MoreVertical,
    Trash2,
    UserPlus,
    ChevronLeft,
    Database,
    Activity
} from 'lucide-react'
// import './AdminDashboard.css' // Imported globally in index.css

const AdminDashboard = ({ session }) => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ totalContext: 0, admins: 0, newThisWeek: 0 })
    const [searchTerm, setSearchTerm] = useState('')

    // Estados dos Modais
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [newUserData, setNewUserData] = useState({ name: '', email: '' })
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        checkAdminAndFetch()
    }, [])

    const checkAdminAndFetch = async () => {
        try {
            // Verificar Status de Admin
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('is_admin')
                .eq('user_id', session.user.id)
                .single()

            if (!profile?.is_admin) {
                navigate('/dashboard')
                return
            }

            fetchUsers()
        } catch (error) {
            console.error('Erro:', error)
            navigate('/dashboard')
        }
    }

    const fetchUsers = async () => {
        setLoading(true)
        try {
            // Buscar todos os usuários
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            setUsers(data)
            calculateStats(data)
        } catch (error) {
            console.error('Erro ao buscar dados:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateStats = (data) => {
        const total = data.length
        const admins = data.filter(u => u.is_admin).length
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        const newUsers = data.filter(u => new Date(u.created_at) > oneWeekAgo).length

        setStats({ totalContext: total, admins, newThisWeek: newUsers })
    }

    const handleCreateUser = async (e) => {
        e.preventDefault()
        setProcessing(true)

        try {
            const { data, error } = await supabase.functions.invoke('invite-user', {
                body: {
                    email: newUserData.email,
                    name: newUserData.name
                }
            })

            if (error) throw error

            alert(`Convite enviado para ${newUserData.email} com sucesso!`)
            setShowCreateModal(false)
            setNewUserData({ name: '', email: '' })

            // Opcional: Atualizar lista (embora o usuário só apareça após aceitar, dependendo da config)
            // Se o gatilho de 'handle_new_user' rodar na criação da auth, ele já pode aparecer.
            fetchUsers()

        } catch (error) {
            console.error('Erro ao convidar usuário:', error)
            alert('Falha ao enviar convite. Verifique os logs e se a Edge Function está ativa.')
        } finally {
            setProcessing(false)
        }
    }

    const confirmDelete = (user) => {
        setSelectedUser(user)
        setShowDeleteModal(true)
    }

    const handleDeleteUser = async () => {
        if (!selectedUser) return
        setProcessing(true)

        // Implementação Mock
        setTimeout(() => {
            alert("⚠️ Requer Edge Function!\n\nExcluir um usuário da Autenticação requer privilégios de 'service_role'. Esta ação é atualmente simulada.")
            setProcessing(false)
            setShowDeleteModal(false)
            setSelectedUser(null)
        }, 1000)
    }

    const [filterRole, setFilterRole] = useState('all') // 'all', 'admin', 'user'

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.whatsapp_number?.includes(searchTerm)

        const matchesRole = filterRole === 'all'
            ? true
            : filterRole === 'admin' ? user.is_admin : !user.is_admin

        return matchesSearch && matchesRole
    })

    return (
        <div className="admin-dashboard-container">
            {/* Barra Lateral */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>Painel Admin</h2>
                </div>

                <nav className="admin-sidebar-nav">
                    <button className="admin-nav-item active">
                        <Users size={20} />
                        <span>Usuários</span>
                    </button>
                    {/* ... outros botões ... */}
                </nav>

                <button onClick={() => navigate('/dashboard')} className="admin-nav-item admin-back-btn">
                    <ChevronLeft size={20} />
                    <span>Voltar ao App</span>
                </button>
            </aside>

            {/* Conteúdo Principal */}
            <main className="admin-content">
                <header className="admin-header">
                    <div>
                        <h1>Gerenciamento de Usuários</h1>
                        <p>Gerencie o acesso e funções do sistema</p>
                    </div>
                    <button onClick={() => setShowCreateModal(true)} className="admin-create-user-btn">
                        <UserPlus size={18} />
                        Adicionar Usuário
                    </button>
                </header>

                {/* Estatísticas */}
                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <div className="admin-stat-header">
                            <div>
                                <div className="admin-stat-value">{stats.totalContext}</div>
                                <div className="admin-stat-label">Total</div>
                            </div>
                            <Users size={20} className="admin-stat-icon users" />
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-header">
                            <div>
                                <div className="admin-stat-value">{stats.admins}</div>
                                <div className="admin-stat-label">Admins</div>
                            </div>
                            <Shield size={20} className="admin-stat-icon admins" />
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="admin-stat-header">
                            <div>
                                <div className="admin-stat-value">+{stats.newThisWeek}</div>
                                <div className="admin-stat-label">Novos (Semana)</div>
                            </div>
                            <Activity size={20} className="admin-stat-icon new" />
                        </div>
                    </div>
                </div>

                {/* Barra de Ferramentas (Busca e Filtros) */}
                <div className="admin-toolbar">
                    <div className="admin-search-bar">
                        <Search size={18} className="admin-search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou WhatsApp..."
                            className="admin-form-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="admin-form-select"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">Todos os Usuários</option>
                        <option value="admin">Apenas Admins</option>
                        <option value="user">Apenas Usuários</option>
                    </select>
                </div>

                {/* Tabela de Usuários */}
                <div className="admin-table-container">
                    <table className="admin-users-table">
                        <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>WhatsApp</th>
                                <th>Status</th>
                                <th>Vencimento</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        Carregando usuários...
                                    </td>
                                </tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user.id} className={user.subscription_status === 'blocked' ? 'opacity-50' : ''}>
                                    <td>
                                        <div className="admin-user-cell">
                                            <div className="admin-user-avatar">
                                                {user.name ? user.name[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : '?')}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{user.name || 'Desconhecido'}</div>
                                                <div style={{ fontSize: '13px', color: '#94a3b8' }}>{user.email}</div>
                                                {user.is_admin && <span style={{ fontSize: '10px', background: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>Admin</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {user.whatsapp_number ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                                                <i className="fab fa-whatsapp" style={{ color: '#22c55e' }}></i>
                                                {user.whatsapp_number}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#64748b', fontSize: '13px' }}>-</span>
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            className="admin-status-select"
                                            value={user.subscription_status || 'active'}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value
                                                try {
                                                    await supabase
                                                        .from('user_profiles')
                                                        .update({ subscription_status: newStatus })
                                                        .eq('id', user.id)

                                                    // Otimistic update
                                                    setUsers(users.map(u => u.id === user.id ? { ...u, subscription_status: newStatus } : u))
                                                } catch (error) {
                                                    console.error('Erro ao atualizar status:', error)
                                                    alert('Erro ao atualizar status')
                                                }
                                            }}
                                            style={{
                                                background: user.subscription_status === 'blocked' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                                color: user.subscription_status === 'blocked' ? '#fca5a5' : '#86efac',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '6px',
                                                padding: '4px 8px',
                                                fontSize: '13px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="active">Liberado</option>
                                            <option value="blocked">Bloqueado</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            className="admin-date-input"
                                            value={user.subscription_expires_at ? new Date(user.subscription_expires_at).toISOString().split('T')[0] : ''}
                                            onChange={async (e) => {
                                                const newDate = e.target.value
                                                try {
                                                    await supabase
                                                        .from('user_profiles')
                                                        .update({ subscription_expires_at: newDate || null })
                                                        .eq('id', user.id)

                                                    setUsers(users.map(u => u.id === user.id ? { ...u, subscription_expires_at: newDate } : u))
                                                } catch (error) {
                                                    console.error('Erro ao atualizar data:', error)
                                                }
                                            }}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                color: user.subscription_expires_at && new Date(user.subscription_expires_at) < new Date() ? '#fca5a5' : '#e2e8f0', // Red if expired
                                                borderRadius: '6px',
                                                padding: '4px',
                                                fontSize: '13px'
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="admin-action-btn delete"
                                                title="Excluir Usuário"
                                                onClick={() => confirmDelete(user)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Modal de Criação */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-content"
                        >
                            <div className="modal-header">
                                <h2>Adicionar Novo Usuário</h2>
                            </div>
                            <form onSubmit={handleCreateUser}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <input
                                        type="email"
                                        placeholder="Endereço de Email"
                                        className="admin-form-input"
                                        required
                                        value={newUserData.email}
                                        onChange={e => setNewUserData({ ...newUserData, email: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Nome Completo"
                                        className="admin-form-input"
                                        required
                                        value={newUserData.name}
                                        onChange={e => setNewUserData({ ...newUserData, name: e.target.value })}
                                    />
                                </div>
                                <div className="admin-modal-actions">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="admin-btn-secondary">Cancelar</button>
                                    <button type="submit" disabled={processing} className="admin-btn-primary">
                                        {processing ? 'Criando...' : 'Criar Usuário'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Exclusão */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-content"
                        >
                            <div className="modal-header">
                                <h2>Confirmar Exclusão</h2>
                            </div>
                            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
                                Tem certeza que deseja excluir <strong>{selectedUser?.email}</strong>? Esta ação não pode ser desfeita.
                            </p>
                            <div className="admin-modal-actions">
                                <button onClick={() => setShowDeleteModal(false)} className="admin-btn-secondary">Cancelar</button>
                                <button onClick={handleDeleteUser} disabled={processing} className="admin-btn-primary" style={{ background: '#ef4444' }}>
                                    {processing ? 'Excluindo...' : 'Excluir Usuário'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminDashboard
