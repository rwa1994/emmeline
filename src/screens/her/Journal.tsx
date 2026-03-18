import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useCycle } from '../../hooks/useCycle';
import { getPhase } from '../../lib/phases';

interface JournalEntry {
  id: string;
  content: string;
  phase: string;
  created_at: string;
}

export default function Journal() {
  const { user, profile } = useAuth();
  const { currentPhase } = useCycle(profile);
  const phase = getPhase(currentPhase);
  const navigate = useNavigate();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadEntries();
  }, [user]);

  async function loadEntries() {
    const { data } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setEntries(data ?? []);
    setLoading(false);
  }

  async function saveEntry() {
    if (!draft.trim() || !user) return;
    setSaving(true);
    const { data } = await supabase
      .from('journals')
      .insert({ user_id: user.id, content: draft.trim(), phase: currentPhase })
      .select()
      .single();
    if (data) setEntries(prev => [data, ...prev]);
    setDraft('');
    setComposing(false);
    setSaving(false);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short',
    });
  }

  const phaseColors: Record<string, { bg: string; text: string }> = {
    menstrual:  { bg: '#EDD5D7', text: '#9E6F73' },
    follicular: { bg: '#D4E8D1', text: '#4A6945' },
    ovulatory:  { bg: '#FAE8EB', text: '#C47A84' },
    luteal:     { bg: '#DDD9EE', text: '#7A6FA8' },
  };

  if (loading) return null;

  return (
    <div className="px-6 pt-12 pb-8">
      <button onClick={() => navigate('/')} className="text-em-muted text-sm mb-6 block">← Back</button>

      <div className="flex items-center justify-between mb-2">
        <h1 className="font-heading text-4xl text-em-text">Journal</h1>
        {!composing && entries.length > 0 && (
          <button
            onClick={() => setComposing(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: '#D4E8D1' }}
          >
            <Plus size={20} style={{ color: '#4A6945' }} />
          </button>
        )}
      </div>
      <p className="text-em-muted text-sm mb-8">A private space to write. Each entry is tagged with your phase.</p>

      {/* Compose */}
      {composing && (
        <div className="bg-em-surface rounded-3xl p-5 border border-em-border mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: phase.bgColor, color: phase.color }}
            >
              {phase.name} phase
            </span>
            <button onClick={() => { setComposing(false); setDraft(''); }}>
              <X size={16} className="text-em-muted" />
            </button>
          </div>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-em-text text-sm leading-relaxed placeholder:text-em-muted focus:outline-none resize-none"
            placeholder="What's on your mind?"
            rows={6}
          />
          <button
            onClick={saveEntry}
            disabled={!draft.trim() || saving}
            className="w-full py-3 rounded-2xl text-white text-sm font-medium disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: phase.color }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      {/* Entries */}
      {entries.length === 0 && !composing && (
        <button
          onClick={() => setComposing(true)}
          className="w-full bg-em-surface rounded-2xl px-4 py-8 border border-em-border text-center"
        >
          <p className="text-em-muted text-sm">Nothing written yet.</p>
          <p className="text-em-muted text-xs mt-1">Tap here to write your first entry.</p>
        </button>
      )}

      <div className="space-y-3">
        {entries.map(entry => {
          const colors = phaseColors[entry.phase] ?? phaseColors.menstrual;
          const isExpanded = expanded === entry.id;
          const preview = entry.content.slice(0, 120) + (entry.content.length > 120 ? '...' : '');

          return (
            <button
              key={entry.id}
              onClick={() => setExpanded(isExpanded ? null : entry.id)}
              className="w-full bg-em-surface rounded-2xl p-4 border border-em-border text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {entry.phase}
                </span>
                <span className="text-xs text-em-muted">{formatDate(entry.created_at)}</span>
              </div>
              <p className="text-sm text-em-text leading-relaxed whitespace-pre-wrap">
                {isExpanded ? entry.content : preview}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
