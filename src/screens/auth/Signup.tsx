import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/onboarding');
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
  }

  return (
    <div className="min-h-svh bg-em-cream flex flex-col items-center justify-center px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-5xl text-em-text tracking-wide">emmeline</h1>
        <p className="text-em-muted text-sm mt-2">your cycle, understood</p>
      </div>

      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-em-muted block mb-1.5 font-medium uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-rose transition-colors"
              placeholder="you@email.com"
              required
            />
          </div>

          <div>
            <label className="text-xs text-em-muted block mb-1.5 font-medium uppercase tracking-wide">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-rose transition-colors"
              placeholder="min. 8 characters"
              minLength={8}
              required
            />
          </div>

          {error && (
            <p className="text-em-rose text-sm text-center bg-em-rose-light px-4 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-em-rose text-white font-medium hover:bg-em-rose-dark transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-em-border" />
          <span className="text-em-muted text-xs">or</span>
          <div className="flex-1 h-px bg-em-border" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text font-medium hover:bg-em-cream transition-colors flex items-center justify-center gap-2.5"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="text-center text-sm text-em-muted mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-em-rose font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
