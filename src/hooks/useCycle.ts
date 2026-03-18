import { useMemo } from 'react';
import type { CyclePhase, Profile } from '../types';
import { getPhaseForDay } from '../lib/cycleUtils';

interface CycleState {
  currentPhase: CyclePhase;
  dayOfCycle: number;
  daysUntilPeriod: number;
  cycleProgress: number;
}

export function useCycle(profile: Profile | null): CycleState {
  return useMemo(() => {
    if (!profile?.last_period_start) {
      return {
        currentPhase: 'menstrual',
        dayOfCycle: 1,
        daysUntilPeriod: 28,
        cycleProgress: 0,
      };
    }

    const lastPeriod = new Date(profile.last_period_start);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));

    const cycleLength = profile.cycle_length || 28;
    const periodLength = profile.period_length || 5;

    const dayOfCycle = (diffDays % cycleLength) + 1;
    const daysUntilPeriod = cycleLength - dayOfCycle;
    const cycleProgress = dayOfCycle / cycleLength;

    const currentPhase = getPhaseForDay(dayOfCycle, periodLength, cycleLength);

    return { currentPhase, dayOfCycle, daysUntilPeriod, cycleProgress };
  }, [profile]);
}
