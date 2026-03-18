import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  active: boolean;
}

export default function Medications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (user) loadMedications();
  }, [user]);

  async function loadMedications() {
    const { data } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user!.id)
      .eq('active', true)
      .order('created_at', { ascending: true });
    setMedications(data ?? []);
    setLoading(false);
  }

  async function addMedication() {
    if (!name.trim() || !user) return;
    setAdding(true);
    const { data } = await supabase
      .from('medications')
      .insert({ user_id: user.id, name: name.trim(), dosage: dosage.trim() })
      .select()
      .single();
    if (data) setMedications(prev => [...prev, data]);
    setName('');
    setDosage('');
    setAdding(false);
  }

  async function removeMedication(id: string) {
    await supabase.from('medications').update({ active: false }).eq('id', id);
    setMedications(prev => prev.filter(m => m.id !== id));
  }

  if (loading) return null;

  return (
    <div className="px-6 pt-12 pb-8">
      <button onClick={() => navigate('/')} className="text-em-muted text-sm mb-6 block">← Back</button>

      <h1 className="font-heading text-4xl text-em-text mb-2">Medications</h1>
      <p className="text-em-muted text-sm leading-relaxed mb-8">
        Add anything you take regularly. Em will factor these in when you chat, and you can log whether you've taken them each day.
      </p>

      {/* Current medications */}
      {medications.length > 0 && (
        <div className="space-y-2.5 mb-8">
          {medications.map(med => (
            <div
              key={med.id}
              className="bg-em-surface rounded-2xl px-4 py-3.5 border border-em-border flex items-center gap-3"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-em-text">{med.name}</p>
                {med.dosage && (
                  <p className="text-xs text-em-muted mt-0.5">{med.dosage}</p>
                )}
              </div>
              <button
                onClick={() => removeMedication(med.id)}
                className="w-8 h-8 rounded-xl bg-em-rose-light flex items-center justify-center flex-shrink-0"
              >
                <Trash2 size={14} className="text-em-rose-dark" />
              </button>
            </div>
          ))}
        </div>
      )}

      {medications.length === 0 && (
        <div className="bg-em-surface rounded-2xl px-4 py-6 border border-em-border text-center mb-8">
          <p className="text-em-muted text-sm">No medications added yet.</p>
        </div>
      )}

      {/* Add new */}
      <div className="bg-em-surface rounded-3xl p-5 border border-em-border space-y-3">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest">Add medication</p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addMedication()}
          className="w-full px-4 py-3 rounded-2xl border border-em-border bg-white text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-rose transition-colors text-sm"
          placeholder="Medication name"
        />
        <input
          type="text"
          value={dosage}
          onChange={e => setDosage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addMedication()}
          className="w-full px-4 py-3 rounded-2xl border border-em-border bg-white text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-rose transition-colors text-sm"
          placeholder="Dosage (optional, e.g. 10mg)"
        />
        <button
          onClick={addMedication}
          disabled={!name.trim() || adding}
          className="w-full py-3 rounded-2xl bg-em-rose text-white font-medium text-sm disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          {adding ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  );
}
