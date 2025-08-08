import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Dashboard from './Dashboard' // We will create this file in the next step

function App() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    // Check for an active session initially
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for changes in authentication state (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="w-full min-h-screen bg-slate-900">
      {!session ? (
        // If no session, show the Supabase Auth UI for login/registration
        <div className="flex justify-center items-center h-screen">
          <div className="w-full max-w-md p-8">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              providers={['google', 'github']} // Optional: Add social logins
            />
          </div>
        </div>
      ) : (
        // If session exists, show the main dashboard
        <Dashboard key={session.user.id} session={session} />
      )}
    </div>
  )
}

export default App
