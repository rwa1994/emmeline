import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface PeriodEntry {
  id: number;
  startDate: string;
  periodLength: string;
}

export default function ImportHistory() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<PeriodEntry[]>([
    { id: 1, startDate: '', periodLength: '' },
  ]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function addEntry() {
    if (entries.length >= 6) return;
    setEntries(prev => [...prev, { id: Date.now(), startDate: '', periodLength: '' }]);
  }

  function removeEntry(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  function updateEntry(id: number, field: 'startDate' | 'periodLength', value: string) {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  }

  async function handleSave() {
    if (!user || !profile) return;
    const valid = entries.filter(e => e.startDate);
    if (valid.length === 0) return;

    setSaving(true);

    // Insert cycle records
    await supabase.from('cycles').upsert(
      valid.map(e => ({
        user_id: user.id,
        start_date: e.startDate,
        period_length: e.periodLength ? parseInt(e.periodLength) : profile.period_length,
      })),
      { onConflict: 'user_id,start_date' }
    );

    // Calculate average cycle length if we have 2+ entries
    const sorted = valid
      .map(e => new Date(e.startDate))
      .sort((a, b) => a.getTime() - b.getTime());

    if (sorted.length >= 2) {
      const gaps: number[] = [];
      for (let i = 1; i < sorted.length; i++) {
        const diff = Math.round((sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24));
        if (diff > 15 && diff < 50) gaps.push(diff);
      }
      if (gaps.length > 0) {
        const avg = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
        await supabase
          .from('profiles')
          .update({ cycle_length: avg })
          .eq('id', user.id);
      }
    }

    // Update last_period_start to the most recent entry
    const mostRecent = sorted[sorted.length - 1].toISOString().split('T')[0];
    await supabase
      .from('profiles')
      .update({ last_period_start: mostRecent })
      .eq('id', user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => window.location.href = '/', 1500);
  }

  const today = new Date().toISOString().split('T')[0];
  const hasValid = entries.some(e => e.startDate);

  if (saved) {
    return (
      <div className="min-h-svh bg-em-cream flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-em-sage-light flex items-center justify-center">
          <Check size={28} className="text-em-sage-dark" />
        </div>
        <p className="font-heading text-3xl text-em-text">History saved.</p>
        <p className="text-em-muted text-sm">Em knows you better already.</p>
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 pb-8">
      <button
        onClick={() => navigate('/')}
        className="text-em-muted text-sm mb-6 block"
      >
        ← Back
      </button>

      <h1 className="font-heading text-4xl text-em-text mb-2">Period history</h1>
      <p className="text-em-muted text-sm leading-relaxed mb-8">
        Add your past periods so Em can spot your patterns and give you more accurate predictions. You can add up to 6.
      </p>

      <div className="space-y-3 mb-5">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-em-surface rounded-2xl p-4 border border-em-border"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-em-muted uppercase tracking-widest">
                Period {index + 1}
              </p>
              {entries.length > 1 && (
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="text-em-muted hover:text-em-rose transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-em-muted block mb-1">Start date</label>
                <input
                  type="date"
                  value={entry.startDate}
                  max={today}
                  onChange={e => updateEntry(entry.id, 'startDate', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-em-border bg-em-cream text-em-text text-sm focus:outline-none focus:border-em-rose transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-em-muted block mb-1">Length (days)</label>
                <input
                  type="number"
                  value={entry.periodLength}
                  min={1}
                  max={14}
                  placeholder={String(profile?.period_length ?? 5)}
                  onChange={e => updateEntry(entry.id, 'periodLength', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-em-border bg-em-cream text-em-text text-sm focus:outline-none focus:border-em-rose transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {entries.length < 6 && (
        <button
          onClick={addEntry}
          className="w-full py-3 rounded-2xl border border-dashed border-em-border text-em-muted text-sm flex items-center justify-center gap-2 hover:border-em-rose hover:text-em-rose transition-colors mb-8"
        >
          <Plus size={16} />
          Add another period
        </button>
      )}

      <button
        onClick={handleSave}
        disabled={!hasValid || saving}
        className="w-full py-3.5 rounded-2xl bg-em-rose text-white font-medium disabled:opacity-40 transition-opacity"
      >
        {saving ? 'Saving...' : 'Save history'}
      </button>

      <button
        onClick={() => navigate('/')}
        className="w-full py-3 text-em-muted text-sm mt-3"
      >
        Skip for now
      </button>
    </div>
  );
}
