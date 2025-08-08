import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Dashboard from './Dashboard'

function App() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="w-full min-h-screen bg-slate-900">
      {!session ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-full max-w-md p-8">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              providers={['google', 'github']}
            />
          </div>
        </div>
      ) : (
        <Dashboard key={session.user.id} session={session} />
      )}
    </div>
  )
}

export default App
