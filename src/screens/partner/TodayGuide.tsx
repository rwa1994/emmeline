import { useState, useEffect } from 'react';
import { Heart, AlertCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePartnerLink } from '../../hooks/usePartnerLink';
import { useCycle } from '../../hooks/useCycle';
import { getPartnerPhase, partnerPhases } from '../../lib/partnerPhases';
import type { CyclePhase } from '../../types';

type Tab = 'help' | 'avoid' | 'say';

export default function TodayGuide() {
  const { user } = useAuth();
  const { herProfile, loading } = usePartnerLink(user?.id);
  const { currentPhase } = useCycle(herProfile);
  const [activePhase, setActivePhase] = useState<CyclePhase>(currentPhase);
  const [activeTab, setActiveTab] = useState<Tab>('help');

  useEffect(() => {
    if (!loading) setActivePhase(currentPhase);
  }, [loading, currentPhase]);

  const phase = getPartnerPhase(activePhase);

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
        {content[activeTab].map((item, i) => (
          <div key={i} className="bg-em-surface rounded-2xl px-4 py-3.5 border border-em-border">
            <p className="text-sm text-em-text leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
