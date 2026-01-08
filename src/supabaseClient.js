import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hebdwwedyttlxyabiiva.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYmR3d2VkeXR0bHh5YWJpaXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0ODc4NjIsImV4cCI6MjA4MzA2Mzg2Mn0.fovg0nu6d6oLJL_fqq4QYebTqGi6TPsl2OXyIvO_ryI'

export const supabase = createClient(supabaseUrl, supabaseKey)
