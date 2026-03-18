import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChefHat, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [expanded, setExpanded] = useState<number | null>(null);
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
            onClick={() => { setActivePhase(p.phase); setExpanded(null); }}
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
        {phase.recipes.map((recipe, i) => {
          const isOpen = expanded === i;
          return (
            <div key={i} className="bg-em-surface rounded-2xl border border-em-border overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full p-5 text-left flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <p className="font-medium text-em-text">{recipe.name}</p>
                  <p className="text-sm text-em-muted mt-0.5 leading-relaxed">{recipe.description}</p>
                </div>
                {isOpen
                  ? <ChevronUp size={16} className="text-em-muted flex-shrink-0 mt-0.5" />
                  : <ChevronDown size={16} className="text-em-muted flex-shrink-0 mt-0.5" />
                }
              </button>

              {isOpen && recipe.ingredients && recipe.steps && (
                <div className="px-5 pb-5 space-y-4 border-t border-em-border pt-4">
                  <div>
                    <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-2">Ingredients</p>
                    <ul className="space-y-1">
                      {recipe.ingredients.map((ing, j) => (
                        <li key={j} className="text-sm text-em-text flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: phase.color }} />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-2">Method</p>
                    <ol className="space-y-2">
                      {recipe.steps.map((step, j) => (
                        <li key={j} className="text-sm text-em-text flex items-start gap-3">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 text-white"
                            style={{ backgroundColor: phase.color }}
                          >
                            {j + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
