import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import { Session } from '@supabase/supabase-js'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      // If user logs out, redirect them to the login page
      if (!session && location.pathname !== '/login') {
        navigate('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, location.pathname])

  return (
    <div className="w-full min-h-screen bg-slate-900">
      <Routes>
        <Route path="/login" element={!session ? <AuthPage view="sign_in" /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!session ? <AuthPage view="sign_up" /> : <Navigate to="/dashboard" />} />
        <Route path="/reset-password" element={!session ? <AuthPage view="forgotten_password" /> : <Navigate to="/dashboard" />} />

        {/* Protected Route for Dashboard */}
        <Route path="/dashboard" element={session ? <DashboardPage session={session} /> : <Navigate to="/login" />} />

        {/* Default Route */}
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  )
}

export default App
