import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export const usePlanningData = () => {
    const [loading, setLoading] = useState(true)
    const [planningItems, setPlanningItems] = useState([])
    const [currentMonth, setCurrentMonth] = useState(new Date()) // Mês em visualização

    const loadPlanning = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('financial_planning')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setPlanningItems(data || [])
        } catch (error) {
            console.error('Error loading planning:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadPlanning()
    }, [loadPlanning])

    const getMonthKey = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        return `${year}-${month}`
    }

    const nextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    }

    const prevMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    }

    // Lógica para determinar se um item deve aparecer no mês selecionado
    const getItemsForCurrentMonth = () => {
        const viewMonthKey = getMonthKey(currentMonth)
        const [viewYear, viewMonth] = viewMonthKey.split('-').map(Number)

        return planningItems.filter(item => {
            const startDate = new Date(item.start_date)
            const startYear = startDate.getFullYear()
            const startMonth = startDate.getMonth() + 1
            const startKey = getMonthKey(startDate)

            // 1. Gasto Futuro Único: Deve bater o mês exatamente
            if (item.tipo === 'future_expense') {
                return startKey === viewMonthKey
            }

            // 2. Assinatura: Começou no passado ou agora e está ativa
            if (item.tipo === 'subscription') {
                const itemDate = new Date(startYear, startMonth - 1, 1)
                const viewDate = new Date(viewYear, viewMonth - 1, 1)
                return itemDate <= viewDate && item.is_active
            }

            // 3. Parcelado: Calcula se o mês de visualização está dentro do intervalo
            if (item.tipo === 'installment') {
                const monthsDiff = (viewYear - startYear) * 12 + (viewMonth - startMonth)
                return monthsDiff >= 0 && monthsDiff < item.installments_total
            }

            return false
        }).map(item => {
            // Adiciona metadados úteis para a UI
            const isPaid = item.paid_months?.includes(viewMonthKey)
            
            // Calcula qual é a parcela atual (se for parcelado)
            let currentInstallment = null
            if (item.tipo === 'installment') {
                const startDate = new Date(item.start_date)
                const monthsDiff = (viewYear - startDate.getFullYear()) * 12 + (viewMonth - (startDate.getMonth() + 1))
                currentInstallment = monthsDiff + 1
            }

            return { ...item, isPaid, currentInstallment }
        })
    }

    const togglePaidStatus = async (item, monthKey) => {
        try {
            const currentPaidMonths = item.paid_months || []
            const isMarkingPaid = !currentPaidMonths.includes(monthKey)
            let newPaidMonths

            let { data: { session }, error: authError } = await supabase.auth.getSession()
            let user = session?.user

            if (!user) {
                const response = await supabase.auth.getUser()
                user = response.data?.user
                if (response.error) authError = response.error
            }

            if (authError) throw authError
            if (!user) throw new Error('Usuário não autenticado')

            // Marcador único para identificar esta transação vinculada ao planejamento
            const planningMarker = `[Ref: ${item.id}] [Mês: ${monthKey}]`

            if (isMarkingPaid) {
                // 1. Criar Transação Real
                newPaidMonths = [...currentPaidMonths, monthKey]
                
                // Montar a data da transação baseada no mês e dia de vencimento
                const [year, month] = monthKey.split('-')
                const transactionDate = new Date(year, parseInt(month) - 1, item.due_day || 1, 12, 0, 0).toISOString()

                // Formatar metadados ocultos para o Front-end
                let displayDescription = item.description
                let parcMarker = ''

                if (item.tipo === 'installment' && item.installments_total) {
                    const viewYear = parseInt(year)
                    const viewMonth = parseInt(month)
                    const startDate = new Date(item.start_date)
                    const startYear = startDate.getFullYear()
                    const startMonth = startDate.getMonth() + 1
                    const currentInstallment = (viewYear - startYear) * 12 + (viewMonth - startMonth) + 1
                    parcMarker = ` [Parc: ${currentInstallment}/${item.installments_total}]`
                }

                const { error: txError } = await supabase
                    .from('transactions')
                    .insert({
                        user_id: user.id,
                        valor: item.valor,
                        tipo: 'saida', // Itens de planejamento são geralmente saídas/gastos
                        categoria: item.categoria,
                        payment_method: item.payment_method || 'Dinheiro',
                        summary: `${displayDescription} ${planningMarker}${parcMarker}`,
                        created_at: transactionDate
                    })

                if (txError) throw txError
            } else {
                // 2. Remover Transação Real (Estorno)
                newPaidMonths = currentPaidMonths.filter(m => m !== monthKey)

                const { error: deleteTxError } = await supabase
                    .from('transactions')
                    .delete()
                    .eq('user_id', user.id)
                    .ilike('summary', `%${planningMarker}%`)

                if (deleteTxError) throw deleteTxError
            }

            // 3. Atualizar Status no Planejamento
            const { error: planError } = await supabase
                .from('financial_planning')
                .update({ paid_months: newPaidMonths })
                .eq('id', item.id)

            if (planError) throw planError
            
            // Atualiza localmente para feedback instantâneo
            setPlanningItems(prev => prev.map(p => 
                p.id === item.id ? { ...p, paid_months: newPaidMonths } : p
            ))

            return true
        } catch (error) {
            console.error('Error toggling paid status:', error)
            return false
        }
    }

    const savePlanningItem = async (data) => {
        try {
            // Usa getSession que é mais rápido e usa cache local, útil caso a rede falhe brevemente
            let { data: { session }, error: authError } = await supabase.auth.getSession()
            let user = session?.user

            // Se não tiver sessão (talvez expirada localmente), tenta getUser
            if (!user) {
                const response = await supabase.auth.getUser()
                user = response.data?.user
                if (response.error) authError = response.error
            }

            if (authError) throw authError
            if (!user) throw new Error('Usuário não autenticado. Por favor, faça login novamente.')
            
            if (data.id) {
                // Update
                const { error } = await supabase
                    .from('financial_planning')
                    .update({
                        ...data,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', data.id)
                    .eq('user_id', user.id)

                if (error) throw error
            } else {
                // Insert - Remove id from data to allow auto-generation
                const { id, ...insertData } = data;
                const { error } = await supabase
                    .from('financial_planning')
                    .insert([{ 
                        ...insertData, 
                        user_id: user.id,
                        payment_method: data.payment_method || 'Dinheiro'
                    }])

                if (error) throw error
            }

            loadPlanning()
            return true
        } catch (error) {
            console.error('Error saving planning item:', error)
            throw error
        }
    }

    const deletePlanningItem = async (id) => {
        try {
            // Primeiro, busca o item para ver se tem lembrete
            const { data: item } = await supabase
                .from('financial_planning')
                .select('reminder_id')
                .eq('id', id)
                .single()

            // Se tiver lembrete, remove-o primeiro
            if (item?.reminder_id) {
                await supabase
                    .from('recurring_reminders')
                    .delete()
                    .eq('id', item.reminder_id)
            }

            const { error } = await supabase
                .from('financial_planning')
                .delete()
                .eq('id', id)

            if (error) throw error
            loadPlanning()
            return true
        } catch (error) {
            console.error('Error deleting planning item:', error)
            return false
        }
    }

    const toggleReminder = async (item) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            
            if (item.reminder_id) {
                // Desativar: Deleta o lembrete
                const { error: deleteError } = await supabase
                    .from('recurring_reminders')
                    .delete()
                    .eq('id', item.reminder_id)

                if (deleteError) throw deleteError

                // Limpa o ID no planejamento
                const { error: updateError } = await supabase
                    .from('financial_planning')
                    .update({ reminder_id: null })
                    .eq('id', item.id)

                if (updateError) throw updateError
            } else {
                // Ativar: Cria o lembrete
                const { data: newReminder, error: insertError } = await supabase
                    .from('recurring_reminders')
                    .insert([{
                        user_id: user.id,
                        summary: item.description,
                        due_day: item.due_day || 15,
                        amount: item.valor,
                        is_active: true
                    }])
                    .select()
                    .single()

                if (insertError) throw insertError

                // Salva o ID no planejamento
                const { error: updateError } = await supabase
                    .from('financial_planning')
                    .update({ reminder_id: newReminder.id })
                    .eq('id', item.id)

                if (updateError) throw updateError
            }

            loadPlanning()
            return true
        } catch (error) {
            console.error('Error toggling reminder:', error)
            return false
        }
    }

    return {
        loading,
        currentMonth,
        getMonthKey,
        nextMonth,
        prevMonth,
        items: getItemsForCurrentMonth(),
        togglePaidStatus,
        savePlanningItem,
        deletePlanningItem,
        toggleReminder,
        refresh: loadPlanning
    }
}
