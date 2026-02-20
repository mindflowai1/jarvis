import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export const useFinancialData = () => {
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        search: '',
        type: 'all',
        category: 'all'
    })
    const [stats, setStats] = useState({
        income: 0,
        expense: 0,
        balance: 0
    })
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Debounce search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search)
        }, 500)
        return () => clearTimeout(timer)
    }, [filters.search])

    const loadData = useCallback(async () => {
        try {
            setLoading(true)

            // 1. Get Summary Stats (RPC)
            const { data: summaryData, error: summaryError } = await supabase
                .rpc('get_financial_summary', {
                    start_date: filters.startDate || null,
                    end_date: filters.endDate || null,
                    search_term: debouncedSearch || null,
                    filter_type: filters.type === 'all' ? null : filters.type,
                    filter_category: filters.category === 'all' ? null : filters.category
                })

            if (summaryError) throw summaryError

            if (summaryData && summaryData[0]) {
                setStats({
                    income: summaryData[0].total_income || 0,
                    expense: summaryData[0].total_expense || 0,
                    balance: summaryData[0].balance || 0
                })
            }

            // 2. Get Transactions List
            let query = supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)

            if (filters.startDate) query = query.gte('created_at', filters.startDate)
            if (filters.endDate) query = query.lte('created_at', filters.endDate + 'T23:59:59')
            if (filters.type !== 'all') query = query.eq('tipo', filters.type)
            if (filters.category !== 'all') query = query.eq('categoria', filters.category)
            if (debouncedSearch) {
                query = query.or(`summary.ilike.%${debouncedSearch}%,categoria.ilike.%${debouncedSearch}%`)
            }

            const { data: txData, error: txError } = await query

            if (txError) throw txError
            setTransactions(txData || [])

            // 3. Get unique categories
            if (filters.category === 'all') {
                const { data: catData } = await supabase
                    .from('transactions')
                    .select('categoria')
                    .order('categoria')

                if (catData) {
                    const uniqueCats = [...new Set(catData.map(item => item.categoria))]
                    setCategories(uniqueCats)
                }
            }

        } catch (error) {
            console.error('Error loading financial data:', error)
        } finally {
            setLoading(false)
        }
    }, [filters.startDate, filters.endDate, filters.type, filters.category, debouncedSearch])

    // Initial load
    useEffect(() => {
        loadData()
    }, [loadData])

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const deleteTransaction = async (id) => {
        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id)

            if (error) throw error
            loadData() // Reload
            return true
        } catch (error) {
            console.error('Error deleting transaction:', error)
            return false
        }
    }

    const saveTransaction = async (data, editingId = null) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('transactions')
                    .update({
                        valor: data.valor,
                        tipo: data.tipo,
                        categoria: data.categoria,
                        summary: data.summary,
                        created_at: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString()
                    })
                    .eq('id', editingId)

                if (error) throw error
            } else {
                // Insert
                const { error } = await supabase
                    .from('transactions')
                    .insert({
                        user_id: user.id,
                        valor: data.valor,
                        tipo: data.tipo,
                        categoria: data.categoria,
                        summary: data.summary,
                        created_at: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString()
                    })

                if (error) throw error
            }
            loadData()
            return true
        } catch (error) {
            console.error('Error saving transaction:', error)
            throw error
        }
    }

    return {
        loading,
        filters,
        stats,
        transactions,
        categories,
        handleFilterChange,
        deleteTransaction,
        saveTransaction,
        refreshData: loadData
    }
}
