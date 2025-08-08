import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

interface AuthPageProps {
  view: 'sign_in' | 'sign_up' | 'forgotten_password';
}

const AuthPage: React.FC<AuthPageProps> = ({ view }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          view={view}
          providers={[]} // FIX: Removed 'google' and 'github' to disable social logins
        />
      </div>
    </div>
  )
}

export default AuthPage
