import { useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SOLO_SUGGESTIONS = ['Reading', 'Gaming', 'Gym', 'Cycling', 'Cooking', 'Music', 'Running', 'Football'];
const TOGETHER_SUGGESTIONS = ['Hiking', 'Cooking together', 'Movies', 'Travel', 'Eating out', 'Live music', 'Board games', 'Walks'];

export default function PartnerOnboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState(
    () => localStorage.getItem('emmeline_invite_code') ?? ''
  );
  const [soloInterests, setSoloInterests] = useState<string[]>([]);
  const [sharedInterests, setSharedInterests] = useState<string[]>([]);
  const [customSolo, setCustomSolo] = useState('');
  const [customShared, setCustomShared] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  async function handleComplete() {
    if (!inviteCode.trim()) {
      setError('Please enter the invite code your partner shared with you.');
      return;
    }
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Create partner profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      name: name.trim(),
      role: 'partner',
      solo_interests: soloInterests,
      shared_interests: sharedInterests,
      cycle_length: 28,
      period_length: 5,
    });

    if (profileError) {
      setError('Something went wrong creating your profile.');
      setLoading(false);
      return;
    }

    // Accept the invite
    const { error: linkError } = await supabase
      .from('partner_links')
      .update({ partner_id: user.id, status: 'active' })
      .eq('invite_code', inviteCode.trim().toUpperCase())
      .eq('status', 'pending')
      .is('partner_id', null);

    if (linkError) {
      setError('That invite code didn\'t work. Check it with your partner and try again.');
      setLoading(false);
      return;
    }

    localStorage.removeItem('emmeline_invite_code');
    window.location.href = '/partner';
  }

  return (
    <div className="min-h-svh bg-em-cream flex flex-col px-6 py-12">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">

        {/* Progress */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-500"
              style={{ backgroundColor: i <= step ? '#B0A8CE' : '#E8DADA' }}
            />
          ))}
        </div>

        {/* Step 1 — Name */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <p className="text-em-muted text-sm mb-2">Welcome to Emmeline</p>
              <h2 className="font-heading text-4xl text-em-text leading-tight">Hi, I'm Em.</h2>
              <p className="text-em-muted mt-3 leading-relaxed">
                I'm going to help you support your partner through their cycle. What can I call you?
              </p>
            </div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-lavender transition-colors text-lg"
              placeholder="Your first name"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full py-3.5 rounded-2xl bg-em-lavender text-white font-medium disabled:opacity-40 transition-opacity"
            >
              Nice to meet you
            </button>
          </div>
        )}

        {/* Step 2 — Interests */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="text-em-muted text-sm mb-2">Step 2 of 3</p>
              <h2 className="font-heading text-4xl text-em-text leading-tight">Tell me about you.</h2>
              <p className="text-em-muted mt-3 leading-relaxed">
                This helps me make suggestions that actually fit your life — not just generic advice.
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Things you enjoy on your own</p>
              <div className="flex flex-wrap gap-2">
                {SOLO_SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSolo(s)}
                    className="px-4 py-2 rounded-full text-sm border transition-all"
                    style={soloInterests.includes(s)
                      ? { backgroundColor: '#DDD9EE', color: '#7A6FA8', borderColor: '#B0A8CE' }
                      : { backgroundColor: 'white', color: '#9A8080', borderColor: '#E8DADA' }
                    }
                  >{s}</button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
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
            </div>

            <div>
              <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-3">Things you enjoy together</p>
              <div className="flex flex-wrap gap-2">
                {TOGETHER_SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleShared(s)}
                    className="px-4 py-2 rounded-full text-sm border transition-all"
                    style={sharedInterests.includes(s)
                      ? { backgroundColor: '#DDD9EE', color: '#7A6FA8', borderColor: '#B0A8CE' }
                      : { backgroundColor: 'white', color: '#9A8080', borderColor: '#E8DADA' }
                    }
                  >{s}</button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
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
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-3.5 rounded-2xl bg-em-lavender text-white font-medium transition-opacity"
            >
              Continue
            </button>
            <button onClick={() => setStep(1)} className="w-full text-em-muted text-sm py-2">Back</button>
          </div>
        )}

        {/* Step 3 — Invite code */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <p className="text-em-muted text-sm mb-2">Last step</p>
              <h2 className="font-heading text-4xl text-em-text leading-tight">Connect to your partner.</h2>
              <p className="text-em-muted mt-3 leading-relaxed">
                Enter the invite code your partner shared with you from their Emmeline app.
              </p>
            </div>

            <div>
              <label className="text-xs text-em-muted block mb-1.5 font-medium uppercase tracking-wide">Invite code</label>
              <input
                type="text"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-lavender transition-colors text-xl tracking-widest font-medium text-center uppercase"
                placeholder="ABCD1234"
                maxLength={8}
                autoFocus
              />
            </div>

            {error && (
              <p className="text-em-rose text-sm text-center bg-em-rose-light px-4 py-2 rounded-xl">{error}</p>
            )}

            <button
              onClick={handleComplete}
              disabled={loading || !inviteCode.trim()}
              className="w-full py-3.5 rounded-2xl bg-em-lavender text-white font-medium disabled:opacity-40 transition-opacity"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
            <button onClick={() => setStep(2)} className="w-full text-em-muted text-sm py-2">Back</button>
          </div>
        )}
      </div>
    </div>
  );
}
