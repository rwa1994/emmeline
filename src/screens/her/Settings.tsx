import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function Settings() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setCycleLength(profile.cycle_length ?? 28);
      setPeriodLength(profile.period_length ?? 5);
    }
  }, [profile]);

  async function handleSave() {
    if (!user || !name.trim()) return;
    setSaving(true);
    await supabase.from('profiles').update({
      name: name.trim(),
      cycle_length: cycleLength,
      period_length: periodLength,
    }).eq('id', user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { window.location.href = '/'; }, 1200);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <div className="px-6 pt-12 pb-8">
      <button onClick={() => navigate(-1)} className="text-em-muted text-sm mb-6 block">← Back</button>

      <h1 className="font-heading text-4xl text-em-text mb-8">Settings</h1>

      {/* Name */}
      <section className="mb-8">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Your name</p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-rose transition-colors"
        />
      </section>

      {/* Cycle details */}
      <section className="mb-8">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-5">Cycle details</p>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-em-text">Average cycle length</label>
              <span className="text-em-rose font-medium">{cycleLength} days</span>
            </div>
            <input
              type="range" min={21} max={40} value={cycleLength}
              onChange={e => setCycleLength(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-em-muted mt-1">
              <span>21 days</span><span>40 days</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-em-text">Average period length</label>
              <span className="text-em-rose font-medium">{periodLength} days</span>
            </div>
            <input
              type="range" min={2} max={10} value={periodLength}
              onChange={e => setPeriodLength(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-em-muted mt-1">
              <span>2 days</span><span>10 days</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-em-muted mt-4 leading-relaxed">
          To correct your period start date, tap any day on the Calendar.
        </p>
      </section>

      {/* Account */}
      <section className="mb-8">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Account</p>
        <div className="bg-em-surface rounded-2xl px-4 py-3.5 border border-em-border mb-2">
          <p className="text-xs text-em-muted mb-0.5">Email</p>
          <p className="text-sm text-em-text">{user?.email}</p>
        </div>
      </section>

      {/* Save */}
      {saved ? (
        <div className="w-full py-3.5 rounded-2xl bg-em-sage-light flex items-center justify-center gap-2 mb-4">
          <Check size={16} className="text-em-sage-dark" />
          <span className="text-em-sage-dark font-medium text-sm">Saved</span>
        </div>
      ) : (
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="w-full py-3.5 rounded-2xl bg-em-rose text-white font-medium disabled:opacity-40 transition-opacity mb-4"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      )}

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-muted font-medium flex items-center justify-center gap-2"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  );
}
