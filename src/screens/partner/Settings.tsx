import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const SOLO_SUGGESTIONS = ['Reading', 'Gaming', 'Gym', 'Cycling', 'Cooking', 'Music', 'Running', 'Football'];
const TOGETHER_SUGGESTIONS = ['Hiking', 'Cooking together', 'Movies', 'Travel', 'Eating out', 'Live music', 'Board games', 'Walks'];

export default function PartnerSettings() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [soloInterests, setSoloInterests] = useState<string[]>([]);
  const [sharedInterests, setSharedInterests] = useState<string[]>([]);
  const [customSolo, setCustomSolo] = useState('');
  const [customShared, setCustomShared] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName((profile as any).name ?? '');
      setSoloInterests((profile as any).solo_interests ?? []);
      setSharedInterests((profile as any).shared_interests ?? []);
    }
  }, [profile]);

  function toggleSolo(item: string) {
    setSoloInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }
  function toggleShared(item: string) {
    setSharedInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }
  function addCustom(val: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) {
    const t = val.trim();
    if (t && !list.includes(t)) setList([...list, t]);
    setInput('');
  }

  async function handleSave() {
    if (!user || !name.trim()) return;
    setSaving(true);
    await supabase.from('profiles').update({
      name: name.trim(),
      solo_interests: soloInterests,
      shared_interests: sharedInterests,
    }).eq('id', user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { window.location.href = '/partner'; }, 1200);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  const chipStyle = (selected: boolean) => selected
    ? { backgroundColor: '#DDD9EE', color: '#7A6FA8', borderColor: '#B0A8CE' }
    : { backgroundColor: 'white', color: '#9A8080', borderColor: '#E8DADA' };

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
          className="w-full px-4 py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-lavender transition-colors"
        />
      </section>

      {/* Solo interests */}
      <section className="mb-8">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Things you enjoy on your own</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {SOLO_SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => toggleSolo(s)}
              className="px-4 py-2 rounded-full text-sm border transition-all"
              style={chipStyle(soloInterests.includes(s))}
            >{s}</button>
          ))}
          {soloInterests.filter(i => !SOLO_SUGGESTIONS.includes(i)).map(s => (
            <button
              key={s}
              onClick={() => toggleSolo(s)}
              className="px-4 py-2 rounded-full text-sm border transition-all"
              style={chipStyle(true)}
            >{s}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSolo}
            onChange={e => setCustomSolo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom(customSolo, soloInterests, setSoloInterests, setCustomSolo)}
            className="flex-1 px-3 py-2 rounded-xl border border-em-border bg-em-surface text-sm text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-lavender transition-colors"
            placeholder="Add your own..."
          />
          <button
            onClick={() => addCustom(customSolo, soloInterests, setSoloInterests, setCustomSolo)}
            className="px-3 py-2 rounded-xl bg-em-lavender-light text-em-lavender-dark text-sm font-medium"
          >Add</button>
        </div>
      </section>

      {/* Shared interests */}
      <section className="mb-8">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Things you enjoy together</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {TOGETHER_SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => toggleShared(s)}
              className="px-4 py-2 rounded-full text-sm border transition-all"
              style={chipStyle(sharedInterests.includes(s))}
            >{s}</button>
          ))}
          {sharedInterests.filter(i => !TOGETHER_SUGGESTIONS.includes(i)).map(s => (
            <button
              key={s}
              onClick={() => toggleShared(s)}
              className="px-4 py-2 rounded-full text-sm border transition-all"
              style={chipStyle(true)}
            >{s}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customShared}
            onChange={e => setCustomShared(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom(customShared, sharedInterests, setSharedInterests, setCustomShared)}
            className="flex-1 px-3 py-2 rounded-xl border border-em-border bg-em-surface text-sm text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-lavender transition-colors"
            placeholder="Add your own..."
          />
          <button
            onClick={() => addCustom(customShared, sharedInterests, setSharedInterests, setCustomShared)}
            className="px-3 py-2 rounded-xl bg-em-lavender-light text-em-lavender-dark text-sm font-medium"
          >Add</button>
        </div>
      </section>

      {/* Account */}
      <section className="mb-8">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Account</p>
        <div className="bg-em-surface rounded-2xl px-4 py-3.5 border border-em-border">
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
          className="w-full py-3.5 rounded-2xl font-medium disabled:opacity-40 transition-opacity mb-4 text-white"
          style={{ backgroundColor: '#B0A8CE' }}
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
