import './MobileHeader.css'

/**
 * MobileHeader - Componente padronizado para headers mobile do dashboard
 * 
 * Uso:
 * <MobileHeader title="Agenda" />
 * <MobileHeader title="Financeiro" rightContent={<BotaoOlho />} />
 */
export default function MobileHeader({ title, rightContent }) {
    return (
        <header className="mobile-header-standard">
            <div className="mobile-header-inner">
                <div className="mobile-header-brand">
                    <img
                        src="/logo-controle-c.png"
                        alt="Controle-C"
                        className="mobile-header-logo"
                    />
                    <h1 className="mobile-header-title">{title}</h1>
                </div>
                {rightContent && (
                    <div className="mobile-header-actions">
                        {rightContent}
                    </div>
                )}
            </div>
        </header>
    )
}
