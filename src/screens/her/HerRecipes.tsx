import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCycle } from '../../hooks/useCycle';
import { phases, getPhase } from '../../lib/phases';
import type { CyclePhase } from '../../types';

export default function HerRecipes() {
  const { profile } = useAuth();
  const { currentPhase } = useCycle(profile);
  const location = useLocation();
  const navigate = useNavigate();

  const initialPhase: CyclePhase = location.state?.phase ?? currentPhase;
  const [activePhase, setActivePhase] = useState<CyclePhase>(initialPhase);
  const phase = getPhase(activePhase);

  return (
    <div className="px-6 pt-12 pb-8">
      <button onClick={() => navigate(-1)} className="text-em-muted text-sm mb-6 block">← Back</button>

      <h1 className="font-heading text-4xl text-em-text mb-6">Recipe ideas</h1>

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

      {/* Phase banner */}
      <div className="rounded-3xl p-4 mb-6 flex items-center gap-3" style={{ backgroundColor: phase.bgColor }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: phase.color }}
        >
          <ChefHat size={16} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: phase.color }}>{phase.name} phase</p>
          <p className="text-sm text-em-text font-medium">{phase.description.split('.')[0]}.</p>
        </div>
      </div>

      {/* Recipes */}
      <div className="space-y-3">
        {phase.recipes.map((recipe, i) => (
          <div key={i} className="bg-em-surface rounded-2xl p-5 border border-em-border">
            <p className="font-medium text-em-text mb-1">{recipe.name}</p>
            <p className="text-sm text-em-muted leading-relaxed">{recipe.description}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-em-muted mt-8">
        Recipes update with each phase.
      </p>
    </div>
  );
}
