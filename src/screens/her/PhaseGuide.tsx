import { useState, useEffect } from 'react';
import { Utensils, Activity, AlertCircle, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCycle } from '../../hooks/useCycle';
import { phases } from '../../lib/phases';
import type { CyclePhase } from '../../types';

type Tab = 'nutrition' | 'exercise' | 'avoid' | 'mental';

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'nutrition', label: 'Eat', icon: <Utensils size={14} /> },
  { key: 'exercise', label: 'Move', icon: <Activity size={14} /> },
  { key: 'avoid', label: 'Avoid', icon: <AlertCircle size={14} /> },
  { key: 'mental', label: 'Mind', icon: <Heart size={14} /> },
];

export default function PhaseGuide() {
  const { profile } = useAuth();
  const { currentPhase } = useCycle(profile);
  const [activePhase, setActivePhase] = useState<CyclePhase>(currentPhase);
  const [activeTab, setActiveTab] = useState<Tab>('nutrition');

  useEffect(() => {
    setActivePhase(currentPhase);
  }, [currentPhase]);

  const phase = phases.find(p => p.phase === activePhase)!;

  const content: Record<Tab, string[]> = {
    nutrition: phase.nutrition,
    exercise: phase.exercise,
    avoid: phase.avoid,
    mental: phase.mentalHealth,
  };

  return (
    <div className="px-6 pt-12 pb-6">
      <h1 className="font-heading text-4xl text-em-text mb-6">Your guide</h1>

      {/* Phase selector */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {phases.map(p => (
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
      <div
        className="rounded-3xl p-5 mb-5"
        style={{ backgroundColor: phase.bgColor }}
      >
        <p className="text-xs font-medium mb-1" style={{ color: phase.color }}>{phase.dayRange}</p>
        <h2 className="font-heading text-2xl text-em-text mb-2">{phase.name}</h2>
        <p className="text-sm text-em-text leading-relaxed opacity-80">{phase.description}</p>
        {currentPhase === activePhase && (
          <p className="text-xs mt-2 font-medium" style={{ color: phase.color }}>
            ● You are here
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0"
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
          <div
            key={i}
            className="bg-em-surface rounded-2xl px-4 py-3.5 border border-em-border"
          >
            <p className="text-sm text-em-text leading-relaxed">{item}</p>
          </div>
        ))}
      </div>

      {/* Recipes link on Eat tab */}
      {activeTab === 'nutrition' && (
        <Link
          to="/her-recipes"
          state={{ phase: activePhase }}
          className="mt-4 w-full py-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-medium text-sm transition-colors"
          style={{ borderColor: phase.color, color: phase.color }}
        >
          See recipe ideas for this phase
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
