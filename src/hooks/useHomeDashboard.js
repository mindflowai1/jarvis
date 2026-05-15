import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

export const useHomeDashboard = (session) => {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 })
    const [recentTransactions, setRecentTransactions] = useState([])
    const [pendingTasks, setPendingTasks] = useState([])
    const [taskProgress, setTaskProgress] = useState({ done: 0, total: 0 })
    const [upcomingEvents, setUpcomingEvents] = useState([])
    const [nearReminders, setNearReminders] = useState([])
    const [habitProgress, setHabitProgress] = useState({ done: 0, total: 0, percent: 0 })
    const [isCalendarConnected, setIsCalendarConnected] = useState(false)
    const accessTokenCache = useRef(null)

    const fetchCalendarEvents = useCallback(async () => {
        if (!session?.user?.id) return []

        try {
            const { data: integration } = await supabase
                .from('user_integrations')
                .select('refresh_token')
                .eq('user_id', session.user.id)
                .eq('provider', 'google')
                .maybeSingle()

            if (!integration?.refresh_token) {
                setIsCalendarConnected(false)
                return []
            }
            setIsCalendarConnected(true)

            let token = accessTokenCache.current
            if (!token) {
                const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
                const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET

                const response = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        client_id: clientId,
                        client_secret: clientSecret,
                        refresh_token: integration.refresh_token,
                        grant_type: 'refresh_token'
                    })
                })
                const data = await response.json()
                token = data.access_token
                accessTokenCache.current = token
            }

            const now = new Date()
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString()
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString()

            const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay}&timeMax=${endOfDay}&singleEvents=true&orderBy=startTime`
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                const data = await res.json()
                return (data.items || []).filter(e => e.eventType !== 'birthday')
            }
            return []
        } catch (err) {
            console.error('Error fetching dashboard calendar:', err)
            return []
        }
    }, [session])

    const loadDashboardData = useCallback(async () => {
        if (!session?.user?.id) return

        try {
            setLoading(true)

            const now = new Date()
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString()
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString()

            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;

            const [summaryRes, txRes, pendingRes, allTasksRes, remindersRes, habitsRes, habitLogsRes, calendarEvents] = await Promise.all([
                supabase.rpc('get_financial_summary', {
                    start_date: firstDay,
                    end_date: lastDay,
                    search_term: null,
                    filter_type: null,
                    filter_category: null,
                    filter_payment_method: null
                }),
                supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(10),
                supabase.from('notes').select('*').eq('is_completed', false).order('prazo', { ascending: true }).limit(6),
                supabase.from('notes').select('id, is_completed'),
                supabase.from('recurring_reminders').select('*').eq('is_active', true).order('due_day', { ascending: true }),
                supabase.from('habits').select('id, goal, days_of_week').eq('is_active', true),
                supabase.from('habit_logs').select('habit_id, completed_at').gte('completed_at', todayStr),
                fetchCalendarEvents()
            ])

            if (summaryRes.error) console.error('Dashboard Summary Error:', summaryRes.error)
            if (txRes.error) console.error('Dashboard TX Error:', txRes.error)

            // Stats
            if (summaryRes.data?.[0]) {
                setStats({
                    income: summaryRes.data[0].total_income || 0,
                    expense: summaryRes.data[0].total_expense || 0,
                    balance: summaryRes.data[0].balance || 0
                })
            }

            // Transactions
            setRecentTransactions(txRes.data || [])

            // Tasks
            setPendingTasks(pendingRes.data || [])
            const allTasks = allTasksRes.data || []
            const doneCount = allTasks.filter(t => t.is_completed).length
            setTaskProgress({ done: doneCount, total: allTasks.length })

            // Reminders: Only future due dates within the next 7 days
            const today = new Date().getDate()
            const filteredReminders = (remindersRes.data || [])
                .filter(r => r.due_day >= today && (r.due_day - today) < 7)
                .map(r => ({ ...r, status: 'near' }))
            setNearReminders(filteredReminders)

            // Calendar
            setUpcomingEvents(calendarEvents)

            // Habit Progress (Mirroring HabitTracker logic)
            const activeHabits = habitsRes.data || []
            const todayLogs = habitLogsRes.data || []
            const currentDayIndex = now.getDay()
            
            const habitsScheduledToday = activeHabits.filter(h => (h.days_of_week || [0,1,2,3,4,5,6]).includes(currentDayIndex))
            
            let totalGoalItems = 0;
            let completedGoalItems = 0;
            let fullyCompletedHabits = 0;

            habitsScheduledToday.forEach(h => {
                const goal = h.goal || 1;
                totalGoalItems += goal;
                
                const logsForHabit = todayLogs.filter(l => l.habit_id === h.id && l.completed_at.startsWith(todayStr));
                const done = Math.min(logsForHabit.length, goal);
                
                completedGoalItems += done;
                if (done >= goal) {
                    fullyCompletedHabits += 1;
                }
            });

            setHabitProgress({
                done: fullyCompletedHabits,
                total: habitsScheduledToday.length,
                percent: totalGoalItems > 0 ? Math.round((completedGoalItems / totalGoalItems) * 100) : 0
            })

        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }, [session, fetchCalendarEvents])

    useEffect(() => {
        loadDashboardData()
    }, [loadDashboardData])

    return {
        loading, stats, recentTransactions, pendingTasks, taskProgress,
        upcomingEvents, nearReminders, habitProgress, isCalendarConnected, refresh: loadDashboardData
    }
}
