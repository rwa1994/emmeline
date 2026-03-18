import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, ChefHat, Compass } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePartnerLink } from '../../hooks/usePartnerLink';
import { useCycle } from '../../hooks/useCycle';
import { getPartnerPhase } from '../../lib/partnerPhases';
import { supabase } from '../../lib/supabase';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function PartnerDashboard() {
  const { profile, user } = useAuth();
  const { herProfile, loading } = usePartnerLink(user?.id);
  const [inviteCode, setInviteCode] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState('');
  const { currentPhase, dayOfCycle, daysUntilPeriod } = useCycle(herProfile);
  const phase = getPartnerPhase(currentPhase);

  if (loading) {
    return (
      <div className="min-h-svh bg-em-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-em-lavender border-t-transparent animate-spin" />
      </div>
    );
  }

  async function handleConnect() {
    if (!inviteCode.trim() || !user) return;
    setConnecting(true);
    setConnectError('');

    const { data, error } = await supabase
      .from('partner_links')
      .update({ partner_id: user.id, status: 'active' })
      .eq('invite_code', inviteCode.trim().toUpperCase())
      .eq('status', 'pending')
      .is('partner_id', null)
      .select();

    if (error || !data || data.length === 0) {
      setConnectError('That code didn\'t work. Check it with your partner and try again.');
      setConnecting(false);
      return;
    }

    window.location.reload();
  }

  if (!herProfile) {
    return (
      <div className="min-h-svh bg-em-cream flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-em-lavender-light flex items-center justify-center mb-4">
          <span className="text-2xl">🔗</span>
        </div>
        <h2 className="font-heading text-2xl text-em-text mb-4">Connect to your partner</h2>
        <p className="text-em-muted text-sm leading-relaxed mb-8">
          Enter the invite code your partner shared with you from their Emmeline app.
        </p>
        <div className="w-full max-w-xs space-y-3">
          <input
            type="text"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value.toUpperCase())}
            className="w-full px-4 py-3.5 rounded-2xl border border-em-border bg-em-surface text-em-text placeholder:text-em-muted focus:outline-none focus:border-em-lavender transition-colors text-xl tracking-widest font-medium text-center uppercase"
            placeholder="ABCD1234"
            maxLength={8}
          />
          {connectError && (
            <p className="text-em-rose text-sm text-center">{connectError}</p>
          )}
          <button
            onClick={handleConnect}
            disabled={connecting || !inviteCode.trim()}
            className="w-full py-3.5 rounded-2xl bg-em-lavender text-white font-medium disabled:opacity-40 transition-opacity"
          >
            {connecting ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </div>
    );
  }

  const periodText =
    daysUntilPeriod === 0
      ? 'Period due today'
      : daysUntilPeriod === 1
      ? 'Period due tomorrow'
      : `${daysUntilPeriod} days until next period`;

  return (
    <div className="px-6 pt-12 pb-6">
      <p className="text-em-muted text-sm">{greeting()}</p>
      <h1 className="font-heading text-4xl text-em-text mt-0.5 mb-8">{profile?.name}</h1>

      {/* Her phase card */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{ backgroundColor: phase.bgColor }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: phase.color }}>Day {dayOfCycle} · {periodText}</p>
            <p className="font-medium text-em-text">{herProfile.name} is in her <span style={{ color: phase.color }}>{phase.name}</span> phase</p>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-medium text-lg"
            style={{ backgroundColor: phase.color }}
          >
            {dayOfCycle}
          </div>
        </div>
        <p className="text-sm text-em-text leading-relaxed opacity-80">{phase.headline}</p>
      </div>

      {/* Today's top tip */}
      <div className="bg-em-surface rounded-3xl p-5 mb-4 border border-em-border">
        <p className="text-[10px] text-em-muted mb-2 uppercase tracking-widest font-medium">Today's focus</p>
        <p className="text-sm text-em-text leading-relaxed">{phase.howToHelp[0]}</p>
        <Link
          to="/partner/guide"
          className="flex items-center gap-1 text-sm font-medium mt-3"
          style={{ color: phase.color }}
        >
          See today's full guide <ChevronRight size={14} />
        </Link>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3">
        <Link
          to="/partner/guide"
          className="bg-em-surface rounded-3xl p-4 border border-em-border flex flex-col gap-2 items-center text-center"
        >
          <BookOpen size={18} className="text-em-lavender" />
          <span className="text-xs font-medium text-em-text">Guide</span>
        </Link>
        <Link
          to="/partner/recipes"
          className="bg-em-surface rounded-3xl p-4 border border-em-border flex flex-col gap-2 items-center text-center"
        >
          <ChefHat size={18} className="text-em-lavender" />
          <span className="text-xs font-medium text-em-text">Recipes</span>
        </Link>
        <Link
          to="/partner/activities"
          className="bg-em-surface rounded-3xl p-4 border border-em-border flex flex-col gap-2 items-center text-center"
        >
          <Compass size={18} className="text-em-lavender" />
          <span className="text-xs font-medium text-em-text">Activities</span>
        </Link>
      </div>
    </div>
  );
}
