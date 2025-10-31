import { createClient } from '@supabase/supabase-js'

// 🔐 Usa tu URL y tu API Key de Supabase
const SUPABASE_URL = "https://cbasvhhldzyickbqesqo.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiYXN2aGhsZHp5aWNrYnFlc3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzEwMzIsImV4cCI6MjA3NjgwNzAzMn0.25PbpxVOspLQ7WNVUugIxpyp7c4z-v2xAPtYNM9mLK0"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
