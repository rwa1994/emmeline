import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, MessageCircle, ChevronRight, Droplets, Pill, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCycle } from '../../hooks/useCycle';
import { getPhase } from '../../lib/phases';
import { supabase } from '../../lib/supabase';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const { currentPhase, dayOfCycle, daysUntilPeriod, cycleProgress } = useCycle(profile);
  const phase = getPhase(currentPhase);
  const [periodStarted, setPeriodStarted] = useState(false);
  const [moodInsights, setMoodInsights] = useState<string[]>([]);

  useEffect(() => {
    if (!user || !profile?.last_period_start) return;
    supabase
      .from('daily_logs')
      .select('emotional_symptoms')
      .eq('user_id', user.id)
      .gte('log_date', profile.last_period_start)
      .then(({ data }) => {
        if (!data) return;
        const counts: Record<string, number> = {};
        for (const log of data) {
          for (const s of log.emotional_symptoms ?? []) {
            counts[s] = (counts[s] ?? 0) + 1;
          }
        }
        const top = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([s]) => s);
        setMoodInsights(top);
      });
  }, [user, profile?.last_period_start]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - cycleProgress * circumference;

  const periodText =
    daysUntilPeriod === 0
      ? 'Period due today'
      : daysUntilPeriod === 1
      ? 'Period due tomorrow'
      : `${daysUntilPeriod} days until next period`;

  async function handlePeriodStarted() {
    if (!user || !profile) return;
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('profiles')
      .update({ last_period_start: today })
      .eq('id', user.id);
    setPeriodStarted(true);
    // Reload so cycle ring updates
    setTimeout(() => window.location.reload(), 800);
  }

  return (
    <div className="px-6 pt-12 pb-6">
      {/* Greeting */}
      <p className="text-em-muted text-sm">{greeting()}</p>
      <h1 className="font-heading text-4xl text-em-text mt-0.5 mb-8">{profile?.name}</h1>

      {/* Cycle ring */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke={phase.bgColor}
              strokeWidth="7"
            />
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke={phase.color}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-light text-em-text">{dayOfCycle}</span>
            <span className="text-xs text-em-muted">day {dayOfCycle}</span>
          </div>
        </div>

        <div className="mt-5 text-center">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: phase.bgColor, color: phase.color }}
          >
            {phase.name} phase
          </span>
          <p className="text-em-muted text-sm mt-2">{periodText}</p>
        </div>
      </div>

      {/* Period started button — shown when not currently in menstrual phase */}
      {currentPhase !== 'menstrual' && (
        <button
          onClick={handlePeriodStarted}
          disabled={periodStarted}
          className="w-full py-3.5 rounded-2xl border-2 border-em-rose text-em-rose font-medium flex items-center justify-center gap-2 mb-4 hover:bg-em-rose-light transition-colors disabled:opacity-50"
        >
          <Droplets size={18} />
          {periodStarted ? 'Period logged' : 'My period started today'}
        </button>
      )}

      {/* Phase card */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{ backgroundColor: phase.bgColor }}
      >
        <p className="text-sm text-em-text leading-relaxed">{phase.description}</p>
        <Link
          to="/guide"
          className="flex items-center gap-1 text-sm font-medium mt-3"
          style={{ color: phase.color }}
        >
          See your full guide <ChevronRight size={14} />
        </Link>
      </div>

      {/* Today's tip */}
      <div className="bg-em-surface rounded-3xl p-5 mb-4 border border-em-border">
        <p className="text-[10px] text-em-muted mb-2 uppercase tracking-widest font-medium">Today's tip</p>
        <p className="text-sm text-em-text leading-relaxed">{phase.nutrition[0]}</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Link
          to="/log"
          className="bg-em-surface rounded-3xl p-5 border border-em-border flex flex-col gap-3"
        >
          <PenLine size={20} className="text-em-rose" />
          <div>
            <p className="text-sm font-medium text-em-text">Log today</p>
            <p className="text-xs text-em-muted mt-0.5">How are you feeling?</p>
          </div>
        </Link>

        <Link
          to="/chat"
          className="rounded-3xl p-5 flex flex-col gap-3"
          style={{ backgroundColor: phase.bgColor }}
        >
          <MessageCircle size={20} style={{ color: phase.color }} />
          <div>
            <p className="text-sm font-medium text-em-text">Ask Em</p>
            <p className="text-xs text-em-muted mt-0.5">Chat, advice, support</p>
          </div>
        </Link>
      </div>
      {/* Mood insights */}
      {moodInsights.length > 0 && (
        <div className="bg-em-surface rounded-3xl p-4 border border-em-border mb-3">
          <p className="text-[10px] text-em-muted mb-2.5 uppercase tracking-widest font-medium">This cycle, you've most often felt</p>
          <div className="flex flex-wrap gap-2">
            {moodInsights.map(mood => (
              <span
                key={mood}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: phase.bgColor, color: phase.color }}
              >
                {mood}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Medications */}
      <Link
        to="/medications"
        className="w-full bg-em-surface rounded-3xl p-4 border border-em-border flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-em-sage-light flex items-center justify-center flex-shrink-0">
          <Pill size={16} className="text-em-sage-dark" />
        </div>
        <div>
          <p className="text-sm font-medium text-em-text">Medications</p>
          <p className="text-xs text-em-muted mt-0.5">Track what you take</p>
        </div>
        <ChevronRight size={16} className="text-em-muted ml-auto" />
      </Link>


      {/* Feedback */}
      <Link to="/feedback" className="w-full text-center text-xs text-em-muted py-3 block">
        Give feedback on Emmeline
      </Link>
    </div>
  );
}
