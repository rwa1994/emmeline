import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const CATEGORIES = [
  { key: 'love', label: 'Love something' },
  { key: 'suggestion', label: 'Suggestion' },
  { key: 'bug', label: 'Something broke' },
  { key: 'general', label: 'General' },
];

export default function Feedback() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState('general');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!content.trim() || !user) return;
    setSaving(true);
    setError('');

    const { error } = await supabase.from('feedback').insert({
      user_id: user.id,
      user_name: profile?.name ?? 'Unknown',
      category,
      content: content.trim(),
    });

    if (error) {
      setError('Something went wrong. Please try again.');
      setSaving(false);
      return;
    }

    setDone(true);
    setSaving(false);
  }

  if (done) {
    return (
      <div className="min-h-svh bg-em-cream flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-16 h-16 rounded-full bg-em-sage-light flex items-center justify-center">
          <Check size={28} className="text-em-sage-dark" />
        </div>
        <p className="font-heading text-3xl text-em-text">Thank you.</p>
        <p className="text-em-muted text-sm text-center">Your feedback means a lot. It goes straight to Ryan.</p>
        <button onClick={() => navigate('/')} className="text-em-rose text-sm font-medium mt-2">Back to home</button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 pb-8">
      <button onClick={() => navigate(-1)} className="text-em-muted text-sm mb-6 block">← Back</button>

      <h1 className="font-heading text-4xl text-em-text mb-2">Give feedback</h1>
      <p className="text-em-muted text-sm leading-relaxed mb-8">
        This goes directly to Ryan, who built Emmeline. Good or bad, it all helps.
      </p>

      {/* Category */}
      <div className="mb-6">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">What kind of feedback?</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className="py-2.5 px-3 rounded-2xl text-sm font-medium transition-all text-left border"
              style={
                category === c.key
                  ? { backgroundColor: '#C49A9E', color: 'white', borderColor: '#C49A9E' }
                  : { backgroundColor: 'white', color: '#9A8080', borderColor: '#E8DADA' }
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Your feedback</p>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          autoFocus
          className="w-full px-4 py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-rose transition-colors resize-none text-sm leading-relaxed"
          placeholder="Tell us what you think..."
          rows={6}
        />
      </div>

      {error && (
        <p className="text-em-rose text-sm text-center bg-em-rose-light px-4 py-2 rounded-xl mb-4">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!content.trim() || saving}
        className="w-full py-3.5 rounded-2xl bg-em-rose text-white font-medium disabled:opacity-40 transition-opacity"
      >
        {saving ? 'Sending...' : 'Send feedback'}
      </button>
    </div>
  );
}
