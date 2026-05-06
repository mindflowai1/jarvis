import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hebdwwedyttlxyabiiva.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmR3d2VkeXR0bHh5YWJpaXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0ODc4NjIsImV4cCI6MjA4MzA2Mzg2Mn0.fovg0nu6d6oLJL_fqq4QYebTqGi6TPsl2OXyIvO_ryI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listLogs() {
    const { data: logs, error } = await supabase
        .from('habit_logs')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error(error);
        return;
    }

    console.log(JSON.stringify(logs, null, 2));
}

listLogs();
