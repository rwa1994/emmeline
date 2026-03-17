import { useAuth } from '../../hooks/useAuth';
import { usePartnerLink } from '../../hooks/usePartnerLink';
import { useCycle } from '../../hooks/useCycle';
import { getPartnerPhase } from '../../lib/partnerPhases';
import { Users, User } from 'lucide-react';

export default function Activities() {
  const { user, profile } = useAuth();
  const { herProfile, loading } = usePartnerLink(user?.id);
  const { currentPhase } = useCycle(herProfile);
  const phase = getPartnerPhase(currentPhase);

  const soloInterests: string[] = (profile as any)?.solo_interests ?? [];
  const sharedInterests: string[] = (profile as any)?.shared_interests ?? [];

  if (loading) return null;

  const together = phase.activities.filter(a => a.type === 'together');
  const solo = phase.activities.filter(a => a.type === 'solo');

  return (
    <div className="px-6 pt-12 pb-6">
      <h1 className="font-heading text-4xl text-em-text mb-2">Activities</h1>
      <p className="text-em-muted text-sm mb-6">
        What to do together and what to do solo — tailored to her current phase.
      </p>

      {/* Together */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} className="text-em-lavender" />
          <p className="text-xs font-medium text-em-muted uppercase tracking-widest">Do together</p>
        </div>
        <div className="space-y-2.5">
          {together.map((activity, i) => (
            <div key={i} className="bg-em-surface rounded-2xl p-4 border border-em-border">
              <p className="font-medium text-em-text text-sm">{activity.name}</p>
              <p className="text-xs text-em-muted mt-0.5 leading-relaxed">{activity.description}</p>
            </div>
          ))}
          {sharedInterests.length > 0 && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: '#DDD9EE' }}>
              <p className="text-xs font-medium text-em-lavender-dark mb-2">Based on your shared interests</p>
              <div className="flex flex-wrap gap-2">
                {sharedInterests.map(i => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs bg-white text-em-lavender-dark border border-em-lavender">
                    {i}
                  </span>
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
          <p className="text-xs font-medium text-em-muted uppercase tracking-widest">Give her space — do your own thing</p>
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
    </div>
  );
}
