import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getPhase, phases } from '../../lib/phases';
import type { CyclePhase } from '../../types';

function getDayPhase(dayOfCycle: number, periodLength: number): CyclePhase {
  if (dayOfCycle <= periodLength) return 'menstrual';
  if (dayOfCycle <= 13) return 'follicular';
  if (dayOfCycle <= 16) return 'ovulatory';
  return 'luteal';
}

export default function Calendar() {
  const { profile } = useAuth();
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const lastPeriodStart = profile?.last_period_start ? new Date(profile.last_period_start) : null;
  const periodLength = profile?.period_length ?? 5;
  const cycleLength = profile?.cycle_length ?? 28;

  function getPhaseForDate(date: Date): CyclePhase | null {
    if (!lastPeriodStart) return null;
    const diff = Math.floor((date.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = ((diff % cycleLength) + cycleLength) % cycleLength + 1;
    return getDayPhase(cycleDay, periodLength);
  }

  const monthLabel = viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="px-6 pt-12 pb-6">
      <h1 className="font-heading text-4xl text-em-text mb-6">Calendar</h1>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-em-rose-light transition-colors"
        >
          <ChevronLeft size={18} className="text-em-muted" />
        </button>
        <span className="font-medium text-em-text">{monthLabel}</span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-em-rose-light transition-colors"
        >
          <ChevronRight size={18} className="text-em-muted" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map(d => (
          <div key={d} className="text-center text-xs text-em-muted py-2 font-medium">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1.5">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const isToday = date.toDateString() === today.toDateString();
          const isFuture = date > today;
          const phase = isFuture ? null : getPhaseForDate(date);
          const phaseInfo = phase ? getPhase(phase) : null;

          return (
            <div key={day} className="flex items-center justify-center">
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm transition-all
                  ${isToday ? 'ring-2 ring-offset-1 ring-em-rose font-semibold' : ''}
                  ${isFuture ? 'opacity-30' : ''}
                `}
                style={phaseInfo ? { backgroundColor: phaseInfo.bgColor } : {}}
              >
                <span className="text-em-text">{day}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-y-2.5 gap-x-4">
        {phases.map(p => (
          <div key={p.phase} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            <span className="text-xs text-em-muted">{p.name} · {p.dayRange}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
