import './MobileHeader.css'

/**
 * MobileHeader - Header padrão premium para TODAS as abas em mobile.
 * Renderizado pelo Dashboard.jsx, não pelos componentes filhos.
 * 
 * @param {string} title - Nome da aba (Início, Agenda, etc.)
 */
export default function MobileHeader({ title }) {
    return (
        <header className="mh-premium-container">
            <div className="mh-premium-inner">
                <div className="mh-brand">
                    <img
                        src="/logo-controle-c.png"
                        alt="Controle-C"
                        className="mh-logo-premium"
                    />
                    <h1 className="mh-title-premium">{title}</h1>
                </div>
            </div>
            <div className="mh-glass-bottom-line"></div>
        </header>
    )
}
