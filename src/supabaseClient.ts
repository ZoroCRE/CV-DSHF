import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://teoyyxlgwnejhahbijvz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlb3l5eGxnd25lamhhaGJpanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTY1MjEsImV4cCI6MjA2OTQzMjUyMX0.zjQfD4hqUnlQW5Q25lIQf-09_6uXudxYHEusc3j6yoY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
