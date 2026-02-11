import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { supabase } from '../supabaseClient'

const AccessDenied = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            color: 'white',
            gap: '20px'
        }}>
            <h1 style={{ fontSize: '3rem', margin: 0 }}>🚫</h1>
            <h2>Acesso Bloqueado</h2>
            <p style={{ color: '#94a3b8', textAlign: 'center', maxWidth: '400px' }}>
                Sua assinatura está inativa ou expirada. Entre em contato com o administrador para regularizar seu acesso.
            </p>
            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    cursor: 'pointer'
                }}
            >
                <LogOut size={18} />
                Sair
            </button>
        </div>
    )
}

export default AccessDenied
