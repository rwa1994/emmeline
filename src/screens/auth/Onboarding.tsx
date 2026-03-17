import { useState } from 'react';
import { supabase } from '../../lib/supabase';

// Default to ~14 days ago if user doesn't know their last period date
function estimatedDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 14);
  return d.toISOString().split('T')[0];
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('profiles').insert({
      id: user.id,
      name: name.trim(),
      role: 'her',
      last_period_start: lastPeriod || estimatedDate(),
      cycle_length: cycleLength,
      period_length: periodLength,
    });

    window.location.href = '/';
  }

  return (
    <div className="min-h-svh bg-em-cream flex flex-col px-6 py-12">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">

        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-500"
              style={{ backgroundColor: i <= step ? '#C49A9E' : '#E8DADA' }}
            />
          ))}
        </div>

        {/* Step 1 — Name */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <p className="text-em-muted text-sm mb-2">Welcome to Emmeline</p>
              <h2 className="font-heading text-4xl text-em-text leading-tight">
                Hi, I'm Em.
              </h2>
              <p className="text-em-muted mt-3 leading-relaxed">
                I'm here to support you through your cycle — with knowledge, care, and a little warmth. What can I call you?
              </p>
            </div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-rose transition-colors text-lg"
              placeholder="Your first name"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full py-3.5 rounded-2xl bg-em-rose text-white font-medium disabled:opacity-40 transition-opacity"
            >
              Nice to meet you
            </button>
          </div>
        )}

        {/* Step 2 — Last period */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <p className="text-em-muted text-sm mb-2">Step 2 of 3</p>
              <h2 className="font-heading text-4xl text-em-text leading-tight">
                Nice to meet you, {name}.
              </h2>
              <p className="text-em-muted mt-3 leading-relaxed">
                When did your last period start? This helps me work out where you are in your cycle today.
              </p>
            </div>
            <div>
              <label className="text-xs text-em-muted block mb-1.5 font-medium uppercase tracking-wide">First day of last period</label>
              <input
                type="date"
                value={lastPeriod}
                onChange={e => setLastPeriod(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text focus:outline-none focus:border-em-rose transition-colors"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={!lastPeriod}
              className="w-full py-3.5 rounded-2xl bg-em-rose text-white font-medium disabled:opacity-40 transition-opacity"
            >
              Continue
            </button>
            <button
              onClick={() => { setLastPeriod(''); setStep(3); }}
              className="w-full py-2 text-sm text-em-muted hover:text-em-text transition-colors"
            >
              I'm not sure — skip this for now
            </button>
            <button onClick={() => setStep(1)} className="w-full text-em-muted text-sm py-2">
              Back
            </button>
          </div>
        )}

        {/* Step 3 — Cycle details */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <p className="text-em-muted text-sm mb-2">Almost there</p>
              <h2 className="font-heading text-4xl text-em-text leading-tight">
                Just a couple more things.
              </h2>
              <p className="text-em-muted mt-3 leading-relaxed">
                These help me personalise your experience. You can update them any time in your settings.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-em-text">Average cycle length</label>
                  <span className="text-em-rose font-medium">{cycleLength} days</span>
                </div>
                <input
                  type="range"
                  min={21}
                  max={40}
                  value={cycleLength}
                  onChange={e => setCycleLength(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-em-muted mt-1">
                  <span>21 days</span>
                  <span>40 days</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-em-text">Average period length</label>
                  <span className="text-em-rose font-medium">{periodLength} days</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={periodLength}
                  onChange={e => setPeriodLength(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-em-muted mt-1">
                  <span>2 days</span>
                  <span>10 days</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-em-rose text-white font-medium disabled:opacity-50 transition-opacity"
            >
              {loading ? 'Setting up...' : 'All done'}
            </button>
            <button onClick={() => setStep(2)} className="w-full text-em-muted text-sm py-2">
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
