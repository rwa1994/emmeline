import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Droplets } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getPhase, phases } from '../../lib/phases';
import { supabase } from '../../lib/supabase';
import { getPhaseForDay, parseLocalDate, formatLocalDate, getPhaseRanges } from '../../lib/cycleUtils';
import type { CyclePhase } from '../../types';

interface DayDetail {
  date: Date;
  dayOfCycle: number;
  phase: CyclePhase;
  isPredicted: boolean;
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
  today.setHours(0, 0, 0, 0);

  const cycleLength = profile?.cycle_length ?? 28;
  const periodLength = profile?.period_length ?? 5;
  const periodStartStr = periodOverride ?? profile?.last_period_start ?? null;
  const lastPeriodStart = periodStartStr ? parseLocalDate(periodStartStr) : null;
  const phaseRanges = getPhaseRanges(periodLength, cycleLength);

  function getDayInfo(date: Date): { phase: CyclePhase; dayOfCycle: number } | null {
    if (!lastPeriodStart) return null;
    const msPerDay = 1000 * 60 * 60 * 24;
    const diff = Math.floor((date.getTime() - lastPeriodStart.getTime()) / msPerDay);
    const cycleDay = ((diff % cycleLength) + cycleLength) % cycleLength + 1;
    return { phase: getPhaseForDay(cycleDay, periodLength, cycleLength), dayOfCycle: cycleDay };
  }

  // Next predicted period start
  const nextPeriodDate = (() => {
    if (!lastPeriodStart) return null;
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.floor((today.getTime() - lastPeriodStart.getTime()) / msPerDay);
    const cyclesCompleted = Math.floor(diffDays / cycleLength);
    return new Date(lastPeriodStart.getTime() + (cyclesCompleted + 1) * cycleLength * msPerDay);
  })();

  const nextPeriodLabel = nextPeriodDate
    ? nextPeriodDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
    : null;

  function handleDayTap(day: number) {
    const date = new Date(year, month, day);
    const result = getDayInfo(date);
    if (!result) return;
    const isPredicted = date > today;
    setSelectedDay({ date, ...result, isPredicted });
  }

  async function setPeriodStartDate(date: Date) {
    if (!user) return;
    setUpdatingPeriod(true);
    const dateStr = formatLocalDate(date);
    await supabase.from('profiles').update({ last_period_start: dateStr }).eq('id', user.id);
    setPeriodOverride(dateStr);
    setSelectedDay(null);
    setUpdatingPeriod(false);
  }

  const monthLabel = viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="px-6 pt-12 pb-6">
      <h1 className="font-heading text-4xl text-em-text mb-4">Calendar</h1>

      {/* Next period prediction banner */}
      {nextPeriodLabel && (
        <div className="flex items-center gap-2.5 bg-em-rose-light rounded-2xl px-4 py-3 mb-5 border border-em-border">
          <Droplets size={16} className="text-em-rose flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-em-rose-dark">Next period predicted</p>
            <p className="text-sm text-em-text font-medium">{nextPeriodLabel}</p>
          </div>
        </div>
      )}

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
          const isPast = date < today;
          const isToday = date.getTime() === today.getTime();
          const isFuture = date > today;
          const result = getDayInfo(date);
          const phaseInfo = result ? getPhase(result.phase) : null;
          const isPredictedPeriodStart = isFuture && result?.dayOfCycle === 1;
          const isSelected = selectedDay?.date.toDateString() === date.toDateString();

          return (
            <div key={day} className="flex flex-col items-center">
              <button
                onClick={() => handleDayTap(day)}
                disabled={!result}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm transition-all
                  ${isToday ? 'ring-2 ring-offset-1 ring-em-rose font-semibold' : ''}
                  ${isPast ? 'active:scale-95' : ''}
                  ${isFuture ? 'active:scale-95' : ''}
                  ${isSelected ? 'ring-2 ring-offset-1 ring-em-text' : ''}
                `}
                style={phaseInfo ? {
                  backgroundColor: phaseInfo.bgColor,
                  opacity: isFuture ? 0.5 : 1,
                  border: isPredictedPeriodStart ? `2px dashed ${phaseInfo.color}` : undefined,
                } : {}}
              >
                <span style={{ color: '#2E1F1F' }}>{day}</span>
              </button>
              {/* Period start dot */}
              {isPredictedPeriodStart && (
                <span className="w-1 h-1 rounded-full mt-0.5 bg-em-rose opacity-60" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-y-2.5 gap-x-4">
        {phases.map(p => (
          <div key={p.phase} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            <span className="text-xs text-em-muted">{p.name} · {phaseRanges[p.phase]}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2.5">
        <div className="w-3 h-3 rounded-full border-2 border-dashed border-em-rose flex-shrink-0 opacity-60" />
        <span className="text-xs text-em-muted">Predicted period start</span>
      </div>
      <p className="text-xs text-em-muted mt-2 opacity-70">Future phases are predicted based on your cycle length.</p>

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
                  {selectedDay.isPredicted && ' · predicted'}
                </p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full bg-em-surface flex items-center justify-center"
              >
                <X size={16} className="text-em-muted" />
              </button>
            </div>

            {(() => {
              const phaseInfo = getPhase(selectedDay.phase);
              return (
                <>
                  <div
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-3"
                    style={{ backgroundColor: phaseInfo.bgColor, color: phaseInfo.color }}
                  >
                    {phaseInfo.name} phase
                  </div>
                  <p className="text-sm text-em-muted leading-relaxed mb-5">{phaseInfo.description}</p>
                </>
              );
            })()}

            {!selectedDay.isPredicted && (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
