import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function JoinInvite() {
  const { code } = useParams<{ code: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) return;
    localStorage.setItem('emmeline_invite_code', code.toUpperCase());
    if (!loading) {
      if (user) {
        navigate('/partner-onboarding');
      } else {
        navigate('/signup');
      }
    }
  }, [code, user, loading]);

  return (
    <div className="min-h-svh bg-em-cream flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-em-lavender border-t-transparent animate-spin" />
    </div>
  );
}
