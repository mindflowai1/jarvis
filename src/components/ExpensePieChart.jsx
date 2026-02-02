import { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import './ExpensePieChart.css'

const ExpensePieChart = ({ transactions }) => {
    // Estado para alternar entre visualizações
    const [viewMode, setViewMode] = useState('pie') // 'pie' ou 'line'

    // Cores vibrantes para as categorias
    const COLORS = [
        '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
        '#06b6d4', '#f97316', '#6366f1', '#ef4444', '#14b8a6',
    ]

    // Processar dados: agrupar saídas por categoria
    const chartData = useMemo(() => {
        if (!transactions || transactions.length === 0) return []

        // Filtrar apenas saídas
        const expenses = transactions.filter(t => t.tipo === 'saida')

        if (expenses.length === 0) return []

        // Agrupar por categoria
        const categoryTotals = {}

        expenses.forEach(transaction => {
            const category = transaction.categoria || 'Outros'
            const valor = parseFloat(transaction.valor) || 0
            categoryTotals[category] = (categoryTotals[category] || 0) + valor
        })

        // Converter para array e ordenar
        return Object.entries(categoryTotals)
            .map(([name, value]) => ({
                name,
                value: parseFloat(value.toFixed(2))
            }))
            .sort((a, b) => b.value - a.value)
    }, [transactions])

    // Processar dados: evolução do saldo por dia
    const balanceData = useMemo(() => {
        if (!transactions || transactions.length === 0) return []

        // Ordenar transações por data
        const sorted = [...transactions].sort((a, b) =>
            new Date(a.created_at) - new Date(b.created_at)
        )

        // Agrupar por dia e calcular saldo acumulado
        const dailyBalances = new Map()
        let runningBalance = 0

        sorted.forEach(transaction => {
            const valor = parseFloat(transaction.valor) || 0

            // Calcular saldo: entrada soma, saída subtrai
            if (transaction.tipo === 'entrada') {
                runningBalance += valor
            } else {
                runningBalance -= valor
            }

            // Extrair data no formato YYYY-MM-DD
            const dateObj = new Date(transaction.created_at)
            const dateKey = dateObj.toISOString().split('T')[0]

            // Guardar o último saldo do dia
            dailyBalances.set(dateKey, runningBalance)
        })

        // Converter para array de dados do gráfico
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

    // Tooltip customizado para gráfico de pizza
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const total = chartData.reduce((sum, item) => sum + item.value, 0)
            const percentage = ((payload[0].value / total) * 100).toFixed(1)

            return (
                <div className="expense-chart-tooltip">
                    <p className="tooltip-category">{payload[0].name}</p>
                    <p className="tooltip-value">
                        R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="tooltip-percentage">{percentage}% do total</p>
                </div>
            )
        }
        return null
    }

    // Tooltip customizado para gráfico de linha
    const LineTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="expense-chart-tooltip">
                    <p className="tooltip-category">{data.fullDate}</p>
                    <p className="tooltip-value">
                        Saldo: R$ {data.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            )
        }
        return null
    }

    // Se não houver dados de saída
    if (!chartData || chartData.length === 0) {
        return (
            <div className="expense-chart-empty">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
                <p>Nenhuma despesa encontrada com os filtros aplicados</p>
            </div>
        )
    }

    return (
        <div className="expense-pie-chart">
            <div className="chart-header">
                <div className="chart-title-section">
                    <h3>
                        {viewMode === 'pie' ? '💰 Gastos por Categoria' : '📈 Evolução do Saldo'}
                    </h3>
                    <p>
                        {viewMode === 'pie'
                            ? 'Distribuição das suas despesas filtradas'
                            : 'Acompanhe seu saldo ao longo do tempo'}
                    </p>
                </div>

                <div className="chart-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'pie' ? 'active' : ''}`}
                        onClick={() => setViewMode('pie')}
                        title="Gráfico de Pizza"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                        </svg>
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'line' ? 'active' : ''}`}
                        onClick={() => setViewMode('line')}
                        title="Gráfico de Linha"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                    </button>
                </div>
            </div>

            {viewMode === 'pie' ? (
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            innerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                            animationEasing="ease-out"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={60}
                            iconType="circle"
                            formatter={(value) => (
                                <span style={{ color: '#cbd5e1', fontSize: '13px' }}>
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            ) : balanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={balanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            ) : (
                <div className="chart-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                    <p>Sem dados suficientes</p>
                    <span>Adicione mais transações para ver a evolução</span>
                </div>
            )}
        </div>
    )
}

export default ExpensePieChart
