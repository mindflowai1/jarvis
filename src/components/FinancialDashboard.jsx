import { useFinancialData } from '../hooks/useFinancialData'
import DesktopFinancialDashboard from './FinancialDashboard/DesktopFinancialDashboard'
import MobileFinancialDashboard from './FinancialDashboard/MobileFinancialDashboard'
import './FinancialDashboard.css'

const FinancialDashboard = () => {
    const financialData = useFinancialData()

    return (
        <div className="financial-dashboard-container">
            {/* 
              Both components are rendered, but CSS handles visibility. 
              This prevents hydration issues and makes resizing smoother.
              If performance becomes an issue with many DOM nodes, we can use 
              window.matchMedia in the hook to conditionally render.
            */}
            <div className="desktop-wrapper">
                <DesktopFinancialDashboard {...financialData} />
            </div>
            <div className="mobile-wrapper">
                <MobileFinancialDashboard {...financialData} />
            </div>
        </div>
    )
}

export default FinancialDashboard
