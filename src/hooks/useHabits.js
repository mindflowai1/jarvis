import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

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
            const dateString = sixtyDaysAgo.toISOString().split('T')[0]

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

    const toggleHabit = async (habitId, date = new Date().toISOString().split('T')[0]) => {
        const habit = habits.find(h => h.id === habitId)
        if (!habit) return

        const habitTodayLogs = logs.filter(l => l.habit_id === habitId && l.completed_at === date)
        const isFullyDone = habitTodayLogs.length >= habit.goal

        // --- OPTIMISTIC UPDATE ---
        const oldLogs = [...logs]
        if (isFullyDone) {
            // Remove all logs for this habit today (reset progress)
            setLogs(prev => prev.filter(l => !(l.habit_id === habitId && l.completed_at === date)))
        } else {
            // Add one temporary log
            const tempLog = { 
                id: `temp-${Math.random()}`, 
                habit_id: habitId, 
                completed_at: date,
                is_optimistic: true 
            }
            setLogs(prev => [...prev, tempLog])
        }

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("User not authenticated")

            if (isFullyDone) {
                const { error } = await supabase
                    .from('habit_logs')
                    .delete()
                    .eq('habit_id', habitId)
                    .eq('completed_at', date)
                    .eq('user_id', user.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('habit_logs')
                    .insert([{
                        habit_id: habitId,
                        user_id: user.id,
                        completed_at: date
                    }])
                if (error) throw error
            }

            // Sync with server in background (silent)
            fetchHabits(true)
        } catch (error) {
            console.error('Error toggling habit:', error)
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
            .map(l => l.completed_at)
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
        
        const currentStr = currentDate.toISOString().split('T')[0]
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
            const checkDateStr = currentDate.toISOString().split('T')[0]
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
