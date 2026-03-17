import { useMemo } from 'react';
import type { CyclePhase, Profile } from '../types';

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
    const diffMs = today.getTime() - lastPeriod.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const cycleLength = profile.cycle_length || 28;
    const periodLength = profile.period_length || 5;

    const currentDay = (diffDays % cycleLength) + 1;
    const daysUntilPeriod = cycleLength - currentDay;
    const cycleProgress = currentDay / cycleLength;

    // Evidence-based phase calculation:
    // Luteal phase is consistent at ~14 days before next period.
    // Ovulation occurs around cycleLength - 14, with a ~3-day window.
    const ovulationDay = cycleLength - 14;
    const ovulatoryEnd = ovulationDay + 2;

    let currentPhase: CyclePhase;
    if (currentDay <= periodLength) {
      currentPhase = 'menstrual';
    } else if (currentDay < ovulationDay) {
      currentPhase = 'follicular';
    } else if (currentDay <= ovulatoryEnd) {
      currentPhase = 'ovulatory';
    } else {
      currentPhase = 'luteal';
    }

    return { currentPhase, dayOfCycle: currentDay, daysUntilPeriod, cycleProgress };
  }, [profile]);
}
