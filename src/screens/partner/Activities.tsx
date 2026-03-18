import { useState } from 'react';
import { Users, User, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePartnerLink } from '../../hooks/usePartnerLink';
import { useCycle } from '../../hooks/useCycle';
import { getPartnerPhase } from '../../lib/partnerPhases';

export default function Activities() {
  const { user, profile } = useAuth();
  const { herProfile, loading } = usePartnerLink(user?.id);
  const { currentPhase, dayOfCycle } = useCycle(herProfile);
  const phase = getPartnerPhase(currentPhase);

  const soloInterests: string[] = (profile as any)?.solo_interests ?? [];
  const sharedInterests: string[] = (profile as any)?.shared_interests ?? [];

  const [sheetItem, setSheetItem] = useState<string | null>(null);
  const [sheetType, setSheetType] = useState<'activity' | 'interest'>('activity');
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  async function openSuggestion(item: string, type: 'activity' | 'interest') {
    setSheetItem(item);
    setSheetType(type);
    setAiText('');
    setAiLoading(true);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestion: type === 'interest' ? `Plan something around: ${item}` : item,
          phase: currentPhase,
          dayOfCycle,
          herName: herProfile?.name ?? 'her',
          sharedInterests,
          soloInterests,
          type: 'activity',
        }),
      });
      const data = await res.json();
      setAiText(data.text ?? '');
    } catch {
      setAiText('Something went wrong. Please try again.');
    }
    setAiLoading(false);
  }

  function closeSheet() {
    setSheetItem(null);
    setAiText('');
  }

  if (loading) return null;

  const together = phase.activities.filter(a => a.type === 'together');
  const solo = phase.activities.filter(a => a.type === 'solo');

  return (
    <div className="px-6 pt-12 pb-6">
      <h1 className="font-heading text-4xl text-em-text mb-2">Activities</h1>
      <p className="text-em-muted text-sm mb-6">
        What to do together and what to do solo, tailored to her current phase.
      </p>

      {/* Together */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} className="text-em-lavender" />
          <p className="text-xs font-medium text-em-muted uppercase tracking-widest">Do together</p>
        </div>
        <div className="space-y-2.5">
          {together.map((activity, i) => (
            <button
              key={i}
              onClick={() => openSuggestion(activity.name, 'activity')}
              className="w-full bg-em-surface rounded-2xl p-4 border border-em-border text-left flex items-start justify-between gap-3 active:opacity-70 transition-opacity"
            >
              <div className="flex-1">
                <p className="font-medium text-em-text text-sm">{activity.name}</p>
                <p className="text-xs text-em-muted mt-0.5 leading-relaxed">{activity.description}</p>
              </div>
              <Sparkles size={14} className="flex-shrink-0 mt-0.5 text-em-lavender" />
            </button>
          ))}
          {sharedInterests.length > 0 && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: '#DDD9EE' }}>
              <p className="text-xs font-medium text-em-lavender-dark mb-2">Based on your shared interests — tap to get ideas</p>
              <div className="flex flex-wrap gap-2">
                {sharedInterests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => openSuggestion(interest, 'interest')}
                    className="px-3 py-1 rounded-full text-xs bg-white text-em-lavender-dark border border-em-lavender active:opacity-70 transition-opacity"
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Solo */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <User size={14} className="text-em-muted" />
          <p className="text-xs font-medium text-em-muted uppercase tracking-widest">Give her space. Do your own thing.</p>
        </div>
        <div className="space-y-2.5">
          {solo.map((activity, i) => (
            <div key={i} className="bg-em-surface rounded-2xl p-4 border border-em-border">
              <p className="font-medium text-em-text text-sm">{activity.name}</p>
              <p className="text-xs text-em-muted mt-0.5 leading-relaxed">{activity.description}</p>
            </div>
          ))}
          {soloInterests.length > 0 && (
            <div className="rounded-2xl p-4 border border-em-border bg-em-surface">
              <p className="text-xs font-medium text-em-muted mb-2">Your solo interests</p>
              <div className="flex flex-wrap gap-2">
                {soloInterests.map(i => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs bg-em-cream text-em-muted border border-em-border">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AI suggestion bottom sheet */}
      {sheetItem && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={closeSheet} />
          <div className="relative bg-white rounded-t-3xl px-6 pt-5 pb-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-medium text-em-text pr-6 leading-relaxed">
                {sheetType === 'interest' ? `Ideas for: ${sheetItem}` : sheetItem}
              </p>
              <button onClick={closeSheet} className="flex-shrink-0 w-8 h-8 rounded-full bg-em-surface flex items-center justify-center">
                <X size={16} className="text-em-muted" />
              </button>
            </div>
            <div className="w-full h-px bg-em-border mb-4" />
            {aiLoading ? (
              <div className="flex items-center gap-3 py-4">
                <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: '#9B8BC4', borderTopColor: 'transparent' }} />
                <p className="text-sm text-em-muted">Putting something together...</p>
              </div>
            ) : (
              <p className="text-sm text-em-text leading-relaxed whitespace-pre-wrap">{aiText}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
