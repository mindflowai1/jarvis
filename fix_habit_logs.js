import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hebdwwedyttlxyabiiva.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmR3d2VkeXR0bHh5YWJpaXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0ODc4NjIsImV4cCI6MjA4MzA2Mzg2Mn0.fovg0nu6d6oLJL_fqq4QYebTqGi6TPsl2OXyIvO_ryI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLogs() {
    console.log('Fetching logs for 2026-05-06...');
    
    // 1. Fetch logs with completed_at = '2026-05-06'
    const { data: logs, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('completed_at', '2026-05-06');

    if (error) {
        console.error('Error fetching logs:', error);
        return;
    }

    console.log(`Found ${logs.length} logs for today.`);

    const logsToFix = logs.filter(log => {
        if (!log.created_at) return true;
        
        const createdAt = new Date(log.created_at);
        const hoursUTC = createdAt.getUTCHours();
        // If hours are between 0 and 3 UTC, it was likely marked between 21:00 and 00:00 local time (UTC-3)
        // Adjust this if you know the user's specific timezone better, but UTC 0-3 covers BRT night.
        return hoursUTC < 3; 
    });

    console.log(`Found ${logsToFix.length} logs to fix.`);

    for (const log of logsToFix) {
        console.log(`Updating log ID ${log.id} for habit ${log.habit_id}...`);
        const { error: updateError } = await supabase
            .from('habit_logs')
            .update({ completed_at: '2026-05-05' })
            .eq('id', log.id);
        
        if (updateError) {
            console.error(`Error updating log ${log.id}:`, updateError);
        } else {
            console.log(`Log ${log.id} updated to 2026-05-05.`);
        }
    }
    
    console.log('Fix complete.');
}

fixLogs();
