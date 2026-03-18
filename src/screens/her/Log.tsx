import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useCycle } from '../../hooks/useCycle';

interface Medication {
  id: string;
  name: string;
  dosage: string;
}

const FLOW_OPTIONS = ['Spotting', 'Light', 'Medium', 'Heavy'] as const;
const PHYSICAL = ['Cramps', 'Bloating', 'Headache', 'Fatigue', 'Breast tenderness', 'Acne', 'Back pain', 'Nausea'];
const EMOTIONAL = ['Anxious', 'Irritable', 'Low mood', 'Emotional', 'Calm', 'Happy', 'Brain fog', 'Unmotivated'];

function Chip({
  label,
  selected,
  onClick,
  onRemove,
  selectedStyle,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  onRemove?: () => void;
  selectedStyle?: { bg: string; text: string; border: string };
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm transition-all border flex items-center gap-1.5"
      style={
        selected && selectedStyle
          ? { backgroundColor: selectedStyle.bg, color: selectedStyle.text, borderColor: selectedStyle.border }
          : { backgroundColor: 'white', color: '#9A8080', borderColor: '#E8DADA' }
      }
    >
      {label}
      {selected && onRemove && (
        <X size={12} onClick={e => { e.stopPropagation(); onRemove(); }} />
      )}
    </button>
  );
}

export default function Log() {
  const { user, profile } = useAuth();
  const { currentPhase } = useCycle(profile);
  const navigate = useNavigate();

  const [periodActive, setPeriodActive] = useState(currentPhase === 'menstrual');
  const [flow, setFlow] = useState('');
  const [physical, setPhysical] = useState<string[]>([]);
  const [customPhysical, setCustomPhysical] = useState<string[]>([]);
  const [customPhysicalInput, setCustomPhysicalInput] = useState('');
  const [emotional, setEmotional] = useState<string[]>([]);
  const [customEmotional, setCustomEmotional] = useState<string[]>([]);
  const [customEmotionalInput, setCustomEmotionalInput] = useState('');
  const [energy, setEnergy] = useState(3);
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationsTaken, setMedicationsTaken] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      supabase
        .from('medications')
        .select('id, name, dosage')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: true })
        .then(({ data }) => setMedications(data ?? []));
    }
  }, [user]);

  function toggle(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter(s => s !== item) : [...list, item]);
  }

  function addCustom(
    input: string,
    setInput: (v: string) => void,
    list: string[],
    setList: (v: string[]) => void
  ) {
    const trimmed = input.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput('');
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);

    const today = new Date().toISOString().split('T')[0];
    await supabase.from('daily_logs').upsert(
      {
        user_id: user.id,
        log_date: today,
        flow: periodActive && flow ? flow.toLowerCase() : 'none',
        physical_symptoms: [...physical, ...customPhysical],
        emotional_symptoms: [...emotional, ...customEmotional],
        energy,
        notes,
        medications_taken: medicationsTaken,
      },
      { onConflict: 'user_id,log_date' }
    );

    setSaving(false);
    setSaved(true);
    setTimeout(() => navigate('/'), 1500);
  }

  if (saved) {
    return (
      <div className="min-h-svh bg-em-cream flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-em-sage-light flex items-center justify-center">
          <Check size={28} className="text-em-sage-dark" />
        </div>
        <p className="font-heading text-3xl text-em-text">Logged.</p>
        <p className="text-em-muted text-sm">Take care of yourself today.</p>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div className="px-6 pt-12 pb-8">
      <h1 className="font-heading text-4xl text-em-text mb-1">How are you today?</h1>
      <p className="text-em-muted text-sm mb-8">{today}</p>

      {/* Period toggle */}
      <section className="mb-7">
        <button
          onClick={() => { setPeriodActive(v => !v); setFlow(''); }}
          className="w-full py-3.5 rounded-2xl font-medium text-sm transition-all flex items-center justify-center gap-2"
          style={
            periodActive
              ? { backgroundColor: '#EDD5D7', color: '#9E6F73', border: '2px solid #C49A9E' }
              : { backgroundColor: 'white', color: '#9A8080', border: '1px solid #E8DADA' }
          }
        >
          {periodActive ? '● Period is active' : 'My period has started'}
        </button>
      </section>

      {/* Flow — only shown when period is active */}
      {periodActive && (
        <section className="mb-7">
          <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Flow</p>
          <div className="flex flex-wrap gap-2">
            {FLOW_OPTIONS.map(f => (
              <Chip
                key={f}
                label={f}
                selected={flow === f}
                onClick={() => setFlow(flow === f ? '' : f)}
                selectedStyle={{ bg: '#EDD5D7', text: '#9E6F73', border: '#C49A9E' }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Physical symptoms */}
      <section className="mb-7">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Physical</p>
        <div className="flex flex-wrap gap-2">
          {PHYSICAL.map(s => (
            <Chip
              key={s}
              label={s}
              selected={physical.includes(s)}
              onClick={() => toggle(physical, setPhysical, s)}
              selectedStyle={{ bg: '#EDD5D7', text: '#9E6F73', border: '#C49A9E' }}
            />
          ))}
          {customPhysical.map(s => (
            <Chip
              key={s}
              label={s}
              selected={true}
              onClick={() => {}}
              onRemove={() => setCustomPhysical(customPhysical.filter(i => i !== s))}
              selectedStyle={{ bg: '#EDD5D7', text: '#9E6F73', border: '#C49A9E' }}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={customPhysicalInput}
            onChange={e => setCustomPhysicalInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom(customPhysicalInput, setCustomPhysicalInput, customPhysical, setCustomPhysical)}
            className="flex-1 px-3 py-2 rounded-xl border border-em-border bg-em-surface text-sm text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-rose transition-colors"
            placeholder="Add your own..."
          />
          <button
            onClick={() => addCustom(customPhysicalInput, setCustomPhysicalInput, customPhysical, setCustomPhysical)}
            className="w-9 h-9 rounded-xl bg-em-rose-light flex items-center justify-center"
          >
            <Plus size={16} className="text-em-rose-dark" />
          </button>
        </div>
      </section>

      {/* Emotional symptoms */}
      <section className="mb-7">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Mood & emotions</p>
        <div className="flex flex-wrap gap-2">
          {EMOTIONAL.map(s => (
            <Chip
              key={s}
              label={s}
              selected={emotional.includes(s)}
              onClick={() => toggle(emotional, setEmotional, s)}
              selectedStyle={{ bg: '#DDD9EE', text: '#7A6FA8', border: '#B0A8CE' }}
            />
          ))}
          {customEmotional.map(s => (
            <Chip
              key={s}
              label={s}
              selected={true}
              onClick={() => {}}
              onRemove={() => setCustomEmotional(customEmotional.filter(i => i !== s))}
              selectedStyle={{ bg: '#DDD9EE', text: '#7A6FA8', border: '#B0A8CE' }}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={customEmotionalInput}
            onChange={e => setCustomEmotionalInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom(customEmotionalInput, setCustomEmotionalInput, customEmotional, setCustomEmotional)}
            className="flex-1 px-3 py-2 rounded-xl border border-em-border bg-em-surface text-sm text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-rose transition-colors"
            placeholder="Add your own..."
          />
          <button
            onClick={() => addCustom(customEmotionalInput, setCustomEmotionalInput, customEmotional, setCustomEmotional)}
            className="w-9 h-9 rounded-xl bg-em-lavender-light flex items-center justify-center"
          >
            <Plus size={16} className="text-em-lavender-dark" />
          </button>
        </div>
      </section>

      {/* Energy */}
      <section className="mb-7">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Energy</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-em-muted w-6">Low</span>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setEnergy(n)}
              className="flex-1 h-10 rounded-2xl text-sm font-medium transition-all"
              style={
                energy === n
                  ? { backgroundColor: '#C49A9E', color: 'white', transform: 'scale(1.1)' }
                  : n < energy
                  ? { backgroundColor: '#EDD5D7', color: '#9E6F73' }
                  : { backgroundColor: 'white', color: '#9A8080', border: '1px solid #E8DADA' }
              }
            >
              {n}
            </button>
          ))}
          <span className="text-xs text-em-muted w-8 text-right">High</span>
        </div>
      </section>

      {/* Medications */}
      {medications.length > 0 && (
        <section className="mb-7">
          <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Medications taken today</p>
          <div className="space-y-2">
            {medications.map(med => {
              const taken = medicationsTaken.includes(med.name);
              return (
                <button
                  key={med.id}
                  onClick={() => setMedicationsTaken(prev =>
                    taken ? prev.filter(n => n !== med.name) : [...prev, med.name]
                  )}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left"
                  style={taken
                    ? { backgroundColor: '#D4E8D1', borderColor: '#8FAF88' }
                    : { backgroundColor: 'white', borderColor: '#E8DADA' }
                  }
                >
                  <div
                    className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={taken
                      ? { backgroundColor: '#5E8057', borderColor: '#5E8057' }
                      : { borderColor: '#E8DADA' }
                    }
                  >
                    {taken && <Check size={12} className="text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-em-text">{med.name}</p>
                    {med.dosage && <p className="text-xs text-em-muted">{med.dosage}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Notes */}
      <section className="mb-8">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Notes</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-rose transition-colors resize-none text-sm leading-relaxed"
          placeholder="Anything on your mind..."
          rows={3}
        />
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3.5 rounded-2xl bg-em-rose text-white font-medium disabled:opacity-50 transition-opacity"
      >
        {saving ? 'Saving...' : 'Save log'}
      </button>
    </div>
  );
}
