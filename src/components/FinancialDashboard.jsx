import { useState, useEffect } from 'react'
import { useFinancialData } from '../hooks/useFinancialData'
import { usePlanningData } from '../hooks/usePlanningData'
import DesktopFinancialDashboard from './FinancialDashboard/DesktopFinancialDashboard'
import MobileFinancialDashboard from './FinancialDashboard/MobileFinancialDashboard'
import PlanningDashboard from './PlanningDashboard'
import PlanningModal from './PlanningModal'
import './FinancialDashboard.css'

const FinancialDashboard = ({ userName }) => {
    const [activeSubTab, setActiveSubTab] = useState('transactions')
    const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false)
    const [planningInitialData, setPlanningInitialData] = useState(null)
    
    const financialData = useFinancialData()
    const planningData = usePlanningData()

    // Sincroniza os dados financeiros ao trocar de aba para garantir que 
    // pagamentos feitos no planejamento apareçam nas transações
    useEffect(() => {
        if (activeSubTab === 'transactions') {
            financialData.refreshData()
        }
    }, [activeSubTab])

    // Global redirect handler
    useEffect(() => {
        window.onRedirectToPlanning = (data) => {
            setPlanningInitialData(data)
            setIsPlanningModalOpen(true)
            setActiveSubTab('planning') // Switch to planning tab to see results
        }
        return () => delete window.onRedirectToPlanning
    }, [])

    return (
        <div className="financial-dashboard-wrapper">
            <header className="financial-header">
                <div className="header-main-row">
                    <h1>Financeiro</h1>
                    
                    <div className="sub-tabs-container">
                        <button 
                            className={`sub-tab-btn ${activeSubTab === 'transactions' ? 'active' : ''}`}
                            onClick={() => setActiveSubTab('transactions')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                            Transações
                        </button>
                        <button 
                            className={`sub-tab-btn ${activeSubTab === 'planning' ? 'active' : ''}`}
                            onClick={() => setActiveSubTab('planning')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                            Planejamento
                        </button>
                    </div>
                </div>
            </header>

            <div className="financial-content-area">
                {activeSubTab === 'transactions' ? (
                    <div className="financial-dashboard-container">
                        <div className="desktop-wrapper">
                            <DesktopFinancialDashboard {...financialData} userName={userName} />
                        </div>
                        <div className="mobile-wrapper">
                            <MobileFinancialDashboard {...financialData} userName={userName} />
                        </div>
                    </div>
                ) : (
                    <PlanningDashboard {...planningData} />
                )}
            </div>

            <PlanningModal 
                isOpen={isPlanningModalOpen}
                onClose={() => {
                    setIsPlanningModalOpen(false)
                    setPlanningInitialData(null)
                }}
                onSave={planningData.savePlanningItem}
                onDelete={planningData.deletePlanningItem}
                initialData={planningInitialData}
            />
        </div>
    )
}

export default FinancialDashboard
