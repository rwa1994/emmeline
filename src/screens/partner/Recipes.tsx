import { useAuth } from '../../hooks/useAuth';
import { usePartnerLink } from '../../hooks/usePartnerLink';
import { useCycle } from '../../hooks/useCycle';
import { getPartnerPhase } from '../../lib/partnerPhases';
import { ChefHat } from 'lucide-react';

export default function Recipes() {
  const { user } = useAuth();
  const { herProfile, loading } = usePartnerLink(user?.id);
  const { currentPhase } = useCycle(herProfile);
  const phase = getPartnerPhase(currentPhase);

  if (loading) return null;

  return (
    <div className="px-6 pt-12 pb-6">
      <h1 className="font-heading text-4xl text-em-text mb-2">Recipe ideas</h1>
      <p className="text-em-muted text-sm mb-6">
        Phase-appropriate ideas for what to cook. Things her body will genuinely appreciate right now.
      </p>

      {/* Current phase */}
      <div className="rounded-3xl p-4 mb-6 flex items-center gap-3" style={{ backgroundColor: phase.bgColor }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: phase.color }}
        >
          <ChefHat size={16} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: phase.color }}>{phase.name} phase</p>
          <p className="text-sm text-em-text font-medium">{phase.headline}</p>
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
        Recipes update each time her phase changes.
      </p>
    </div>
  );
}
