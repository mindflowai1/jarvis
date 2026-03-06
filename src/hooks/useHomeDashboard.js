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

            const [summaryRes, txRes, pendingRes, allTasksRes, remindersRes, calendarEvents] = await Promise.all([
                supabase.rpc('get_financial_summary', {
                    start_date: null, end_date: null, search_term: null,
                    filter_type: null, filter_category: null
                }),
                supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(5),
                supabase.from('notes').select('*').eq('is_completed', false).order('prazo', { ascending: true }).limit(6),
                supabase.from('notes').select('id, is_completed'),
                supabase.from('recurring_reminders').select('*').eq('is_active', true).order('due_day', { ascending: true }),
                fetchCalendarEvents()
            ])

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

            // Reminders
            const today = new Date().getDate()
            const mapped = (remindersRes.data || []).map(r => {
                let status = 'safe'
                if (r.due_day < today) status = 'past'
                else if (r.due_day - today <= 3) status = 'near'
                return { ...r, status }
            })
            setNearReminders(mapped)

            // Calendar
            setUpcomingEvents(calendarEvents)

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
        upcomingEvents, nearReminders, isCalendarConnected, refresh: loadDashboardData
    }
}
