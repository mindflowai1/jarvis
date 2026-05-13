import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

const getLocalYMD = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const useHabits = () => {
    const [habits, setHabits] = useState([])
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchHabits = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Fetch active habits
            const { data: habitsData, error: habitsError } = await supabase
                .from('habits')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true })

            if (habitsError) throw habitsError

            // 2. Fetch logs for the last 60 days (to calculate streaks)
            const sixtyDaysAgo = new Date()
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
            const dateString = getLocalYMD(sixtyDaysAgo)

            const { data: logsData, error: logsError } = await supabase
                .from('habit_logs')
                .select('*')
                .gte('completed_at', dateString)

            if (logsError) throw logsError

            setHabits(habitsData)
            setLogs(logsData)
        } catch (error) {
            console.error('Error fetching habits:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchHabits()
    }, [fetchHabits])

    const toggleHabit = async (habitId, date = getLocalYMD()) => {
        const habit = habits.find(h => h.id === habitId)
        if (!habit) return

        // Filtra os logs ignorando a hora (caso o completed_at seja timestamptz)
        const habitTodayLogs = logs.filter(l => l.habit_id === habitId && l.completed_at.startsWith(date))
        const isFullyDone = habitTodayLogs.length >= habit.goal

        // --- OPTIMISTIC UPDATE ---
        const oldLogs = [...logs]
        let logToRemove = null
        // Build an ISO string for the target date (noon to avoid timezone edge cases)
        const targetIso = `${date}T12:00:00.000Z`

        if (isFullyDone) {
            // Zera todos os logs desse dia (remove todos de uma vez)
            const logIdsToRemove = habitTodayLogs.map(l => l.id)
            setLogs(prev => prev.filter(l => !logIdsToRemove.includes(l.id)))
        } else {
            // Adiciona um log temporário usando a data-alvo, não a data de agora
            const tempLog = { 
                id: `temp-${Math.random()}`, 
                habit_id: habitId, 
                completed_at: targetIso,
                is_optimistic: true 
            }
            setLogs(prev => [...prev, tempLog])
        }

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("User not authenticated")

            if (isFullyDone) {
                // Deleta TODOS os logs desse hábito nesse dia
                const { error } = await supabase
                    .from('habit_logs')
                    .delete()
                    .eq('habit_id', habitId)
                    .eq('user_id', user.id)
                    .gte('completed_at', `${date}T00:00:00.000Z`)
                    .lt('completed_at', `${date}T23:59:59.999Z`)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('habit_logs')
                    .insert([{
                        habit_id: habitId,
                        user_id: user.id,
                        completed_at: targetIso
                    }])
                if (error) throw error
            }

            // Sync with server in background (silent)
            fetchHabits(true)
        } catch (error) {
            console.error('Error toggling habit:', error)
            alert("Erro ao salvar no banco de dados: " + (error.message || error.toString()) + "\n\nPossivelmente o Supabase está bloqueando múltiplos registros no mesmo dia devido a uma restrição (Unique Constraint).")
            setLogs(oldLogs) // Rollback on error
        }
    }

    const saveHabit = async (habitData) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            const payload = {
                ...habitData,
                user_id: user.id
            }

            if (habitData.id) {
                const { error } = await supabase
                    .from('habits')
                    .update(payload)
                    .eq('id', habitData.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('habits')
                    .insert([payload])
                if (error) throw error
            }

            fetchHabits()
            return true
        } catch (error) {
            console.error('Error saving habit:', error)
            return false
        }
    }

    const deleteHabit = async (id) => {
        try {
            const { error } = await supabase
                .from('habits')
                .delete()
                .eq('id', id)
            if (error) throw error
            fetchHabits()
            return true
        } catch (error) {
            console.error('Error deleting habit:', error)
            return false
        }
    }

    const calculateStreak = (habitId) => {
        const habit = habits.find(h => h.id === habitId)
        if (!habit) return 0

        const habitLogs = logs
            .filter(l => l.habit_id === habitId)
            .map(l => l.completed_at.split('T')[0])
            .sort((a, b) => new Date(b) - new Date(a))

        if (habitLogs.length === 0) return 0

        // Default to all days if days_of_week is missing (legacy)
        const scheduledDays = habit.days_of_week || [0, 1, 2, 3, 4, 5, 6]
        
        let streak = 0
        let today = new Date()
        today.setHours(0, 0, 0, 0)
        
        let currentDate = new Date(today)
        
        // Find the most recent scheduled day (could be today)
        while (!scheduledDays.includes(currentDate.getDay())) {
            currentDate.setDate(currentDate.getDate() - 1)
        }
        
        const currentStr = getLocalYMD(currentDate)
        const isDoneOnCurrent = habitLogs.includes(currentStr)
        
        // If it's a scheduled day and not done today, the streak is still alive if we completed the previous scheduled day
        // EXCEPT if the "currentDate" is already in the past (i.e., today is a scheduled day but not done yet)
        if (!isDoneOnCurrent && currentDate.getTime() === today.getTime()) {
            // Check if we still have time to complete it today
            // For now, let's look at the previous scheduled day to see if the streak is still active
            currentDate.setDate(currentDate.getDate() - 1)
            while (!scheduledDays.includes(currentDate.getDay())) {
                currentDate.setDate(currentDate.getDate() - 1)
            }
        }

        // Now currentDate is the last day that MUST have been completed
        while (streak < 365) {
            const checkDateStr = getLocalYMD(currentDate)
            if (habitLogs.includes(checkDateStr)) {
                streak++
                // Move to previous scheduled day
                currentDate.setDate(currentDate.getDate() - 1)
                while (!scheduledDays.includes(currentDate.getDay())) {
                    currentDate.setDate(currentDate.getDate() - 1)
                }
            } else {
                break
            }
        }

        return streak
    }

    return {
        habits,
        logs,
        loading,
        toggleHabit,
        saveHabit,
        deleteHabit,
        calculateStreak,
        refresh: fetchHabits
    }
}
