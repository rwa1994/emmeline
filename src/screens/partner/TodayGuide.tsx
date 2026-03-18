import { useState, useEffect } from 'react';
import { Heart, AlertCircle, MessageCircle, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePartnerLink } from '../../hooks/usePartnerLink';
import { useCycle } from '../../hooks/useCycle';
import { getPartnerPhase, partnerPhases } from '../../lib/partnerPhases';
import type { CyclePhase } from '../../types';

type Tab = 'help' | 'avoid' | 'say';

export default function TodayGuide() {
  const { user, profile } = useAuth();
  const { herProfile, loading } = usePartnerLink(user?.id);
  const { currentPhase, dayOfCycle } = useCycle(herProfile);
  const [activePhase, setActivePhase] = useState<CyclePhase>(currentPhase);
  const [activeTab, setActiveTab] = useState<Tab>('help');

  const [sheetItem, setSheetItem] = useState<string | null>(null);
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!loading) setActivePhase(currentPhase);
  }, [loading, currentPhase]);

  const phase = getPartnerPhase(activePhase);

  const sharedInterests: string[] = (profile as any)?.shared_interests ?? [];
  const soloInterests: string[] = (profile as any)?.solo_interests ?? [];

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'help', label: 'How to help', icon: <Heart size={14} /> },
    { key: 'avoid', label: 'What to avoid', icon: <AlertCircle size={14} /> },
    { key: 'say', label: 'Things to say', icon: <MessageCircle size={14} /> },
  ];

  const content: Record<Tab, string[]> = {
    help: phase.howToHelp,
    avoid: phase.whatToAvoid,
    say: phase.thingsToSay,
  };

  async function openSuggestion(item: string) {
    setSheetItem(item);
    setAiText('');
    setAiLoading(true);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestion: item,
          phase: activePhase,
          dayOfCycle,
          herName: herProfile?.name ?? 'her',
          sharedInterests,
          soloInterests,
          type: 'help',
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

  return (
    <div className="px-6 pt-12 pb-6">
      <h1 className="font-heading text-4xl text-em-text mb-6">Today's guide</h1>

      {/* Phase selector */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {partnerPhases.map(p => (
          <button
            key={p.phase}
            onClick={() => setActivePhase(p.phase)}
            className="py-2.5 px-1 rounded-2xl text-xs font-medium transition-all text-center relative"
            style={
              activePhase === p.phase
                ? { backgroundColor: p.color, color: 'white' }
                : { backgroundColor: 'white', color: '#9A8080', border: '1px solid #E8DADA' }
            }
          >
            {p.name}
            {currentPhase === p.phase && (
              <span
                className="block w-1 h-1 rounded-full mx-auto mt-1"
                style={{ backgroundColor: activePhase === p.phase ? 'rgba(255,255,255,0.7)' : p.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Phase header */}
      <div className="rounded-3xl p-5 mb-5" style={{ backgroundColor: phase.bgColor }}>
        <h2 className="font-heading text-2xl text-em-text mb-1">{phase.name} phase</h2>
        <p className="text-sm font-medium" style={{ color: phase.color }}>{phase.headline}</p>
        {currentPhase === activePhase && (
          <p className="text-xs mt-2 font-medium" style={{ color: phase.color }}>● She is here now</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap"
            style={
              activeTab === tab.key
                ? { backgroundColor: phase.color, color: 'white' }
                : { backgroundColor: 'white', color: '#9A8080', border: '1px solid #E8DADA' }
            }
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-2.5">
        {content[activeTab].map((item, i) =>
          activeTab === 'help' ? (
            <button
              key={i}
              onClick={() => openSuggestion(item)}
              className="w-full bg-em-surface rounded-2xl px-4 py-3.5 border border-em-border text-left flex items-start justify-between gap-3 active:opacity-70 transition-opacity"
            >
              <p className="text-sm text-em-text leading-relaxed">{item}</p>
              <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: phase.color }} />
            </button>
          ) : (
            <div key={i} className="bg-em-surface rounded-2xl px-4 py-3.5 border border-em-border">
              <p className="text-sm text-em-text leading-relaxed">{item}</p>
            </div>
          )
        )}
      </div>

      {/* AI suggestion bottom sheet */}
      {sheetItem && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={closeSheet} />
          <div className="relative bg-white rounded-t-3xl px-6 pt-5 pb-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-medium text-em-text pr-6 leading-relaxed">{sheetItem}</p>
              <button onClick={closeSheet} className="flex-shrink-0 w-8 h-8 rounded-full bg-em-surface flex items-center justify-center">
                <X size={16} className="text-em-muted" />
              </button>
            </div>
            <div className="w-full h-px bg-em-border mb-4" />
            {aiLoading ? (
              <div className="flex items-center gap-3 py-4">
                <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: phase.color, borderTopColor: 'transparent' }} />
                <p className="text-sm text-em-muted">Getting suggestions...</p>
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
