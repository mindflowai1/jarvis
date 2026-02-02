import { useMemo } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'
import './FinancialCharts.css'

const FinancialCharts = ({ transactions }) => {
    // Cores vibrantes para categorias
    const COLORS = [
        '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
        '#06b6d4', '#f97316', '#6366f1', '#ef4444', '#14b8a6',
    ]

    // Processar dados para gráfico de pizza (apenas saídas)
    const categoryData = useMemo(() => {
        if (!transactions || transactions.length === 0) return []

        const expenses = transactions.filter(t => t.tipo === 'saida')
        const categoryTotals = {}

        expenses.forEach(transaction => {
            const category = transaction.categoria || 'Outros'
            const valor = parseFloat(transaction.valor) || 0
            categoryTotals[category] = (categoryTotals[category] || 0) + valor
        })

        return Object.entries(categoryTotals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
    }, [transactions])

    // Processar dados para gráfico de linha (evolução do saldo)
    const balanceData = useMemo(() => {
        if (!transactions || transactions.length === 0) return []

        // Ordenar por created_at
        const sorted = [...transactions].sort((a, b) =>
            new Date(a.created_at) - new Date(b.created_at)
        )

        // Agrupar por dia (usando YYYY-MM-DD como chave)
        const dailyBalances = new Map()
        let runningBalance = 0

        sorted.forEach(transaction => {
            const valor = parseFloat(transaction.valor) || 0

            // Atualizar saldo acumulado
            if (transaction.tipo === 'entrada') {
                runningBalance += valor
            } else {
                runningBalance -= valor
            }

            // Obter apenas a data (sem hora) no formato YYYY-MM-DD
            const dateObj = new Date(transaction.created_at)
            const dateKey = dateObj.toISOString().split('T')[0] // YYYY-MM-DD

            // Guardar último saldo do dia
            dailyBalances.set(dateKey, runningBalance)
        })

        // Converter Map para array ordenado
        return Array.from(dailyBalances.entries())
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([dateKey, balance]) => {
                const dateObj = new Date(dateKey + 'T00:00:00')

                return {
                    date: dateObj.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short'
                    }),
                    fullDate: dateObj.toLocaleDateString('pt-BR'),
                    balance: parseFloat(balance.toFixed(2))
                }
            })
    }, [transactions])

    // Custom tooltip para gráfico de pizza
    const PieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const total = categoryData.reduce((sum, item) => sum + item.value, 0)
            const percentage = ((payload[0].value / total) * 100).toFixed(1)

            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{payload[0].name}</p>
                    <p className="tooltip-value">
                        R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="tooltip-percentage">{percentage}% do total</p>
                </div>
            )
        }
        return null
    }

    // Custom tooltip para gráfico de linha
    const LineTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-date">{data.date}</p>
                    <p className="tooltip-balance">
                        Saldo: R$ {data.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            )
        }
        return null
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="charts-empty">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                <p>Adicione transações para ver os gráficos</p>
            </div>
        )
    }

    return (
        <motion.section
            className="charts-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="charts-grid">
                {/* Gráfico de Pizza - Gastos por Categoria */}
                {categoryData.length > 0 && (
                    <motion.div
                        className="chart-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                    >
                        <div className="chart-header">
                            <h3>💰 Gastos por Categoria</h3>
                            <p>Distribuição das suas despesas</p>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    innerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={800}
                                    animationEasing="ease-out"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => (
                                        <span style={{ color: '#cbd5e1', fontSize: '13px' }}>
                                            {value}
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {/* Gráfico de Linha - Evolução do Saldo */}
                {balanceData.length > 0 && (
                    <motion.div
                        className="chart-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <div className="chart-header">
                            <h3>📈 Evolução do Saldo</h3>
                            <p>Acompanhe seu saldo ao longo do tempo</p>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={balanceData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94a3b8"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    style={{ fontSize: '12px' }}
                                    tickFormatter={(value) =>
                                        `R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
                                    }
                                />
                                <Tooltip content={<LineTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#1e293b' }}
                                    activeDot={{ r: 8, fill: '#60a5fa', stroke: '#1e293b', strokeWidth: 2 }}
                                    animationDuration={1000}
                                    animationEasing="ease-in-out"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}
            </div>
        </motion.section>
    )
}

export default FinancialCharts
