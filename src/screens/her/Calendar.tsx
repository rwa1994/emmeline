import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getPhase, phases } from '../../lib/phases';
import { supabase } from '../../lib/supabase';
import type { CyclePhase } from '../../types';

function getDayPhase(dayOfCycle: number, periodLength: number): CyclePhase {
  if (dayOfCycle <= periodLength) return 'menstrual';
  if (dayOfCycle <= 13) return 'follicular';
  if (dayOfCycle <= 16) return 'ovulatory';
  return 'luteal';
}

interface DayDetail {
  date: Date;
  dayOfCycle: number;
  phase: CyclePhase;
}

export default function Calendar() {
  const { profile, user } = useAuth();
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayDetail | null>(null);
  const [updatingPeriod, setUpdatingPeriod] = useState(false);
  const [periodOverride, setPeriodOverride] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cycleLength = profile?.cycle_length ?? 28;
  const periodLength = profile?.period_length ?? 5;
  const periodStartStr = periodOverride ?? profile?.last_period_start ?? null;
  const lastPeriodStart = periodStartStr ? new Date(periodStartStr) : null;

  function getPhaseForDate(date: Date): { phase: CyclePhase; dayOfCycle: number } | null {
    if (!lastPeriodStart) return null;
    const diff = Math.floor((date.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = ((diff % cycleLength) + cycleLength) % cycleLength + 1;
    return { phase: getDayPhase(cycleDay, periodLength), dayOfCycle: cycleDay };
  }

  function handleDayTap(day: number) {
    const date = new Date(year, month, day);
    if (date > today) return;
    const result = getPhaseForDate(date);
    if (!result) return;
    setSelectedDay({ date, ...result });
  }

  async function setPeriodStartDate(date: Date) {
    if (!user) return;
    setUpdatingPeriod(true);
    const dateStr = date.toISOString().split('T')[0];
    await supabase.from('profiles').update({ last_period_start: dateStr }).eq('id', user.id);
    setPeriodOverride(dateStr);
    setSelectedDay(null);
    setUpdatingPeriod(false);
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
          const result = isFuture ? null : getPhaseForDate(date);
          const phaseInfo = result ? getPhase(result.phase) : null;
          const isSelected = selectedDay?.date.toDateString() === date.toDateString();

          return (
            <div key={day} className="flex items-center justify-center">
              <button
                onClick={() => handleDayTap(day)}
                disabled={isFuture}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm transition-all
                  ${isToday ? 'ring-2 ring-offset-1 ring-em-rose font-semibold' : ''}
                  ${isFuture ? 'opacity-30 cursor-default' : 'active:scale-95'}
                  ${isSelected ? 'ring-2 ring-offset-1 ring-em-text' : ''}
                `}
                style={phaseInfo ? { backgroundColor: phaseInfo.bgColor } : {}}
              >
                <span className="text-em-text">{day}</span>
              </button>
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

      {/* Day detail panel */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedDay(null)} />
          <div className="relative bg-white rounded-t-3xl px-6 pt-5 pb-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-medium text-em-text">
                  {selectedDay.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-sm text-em-muted mt-0.5">
                  Day {selectedDay.dayOfCycle} of cycle
                </p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full bg-em-surface flex items-center justify-center"
              >
                <X size={16} className="text-em-muted" />
              </button>
            </div>

            {/* Phase badge */}
            {(() => {
              const phaseInfo = getPhase(selectedDay.phase);
              return (
                <div
                  className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-5"
                  style={{ backgroundColor: phaseInfo.bgColor, color: phaseInfo.color }}
                >
                  {phaseInfo.name} phase
                </div>
              );
            })()}

            <div className="w-full h-px bg-em-border mb-5" />

            <p className="text-xs text-em-muted mb-3">Was this the first day of your period?</p>
            <button
              onClick={() => setPeriodStartDate(selectedDay.date)}
              disabled={updatingPeriod}
              className="w-full py-3 rounded-2xl text-sm font-medium text-white disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: '#C49A9E' }}
            >
              {updatingPeriod ? 'Updating...' : 'Set as period start date'}
            </button>
            <p className="text-xs text-em-muted text-center mt-2">
              This will recalculate your cycle from this date.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
