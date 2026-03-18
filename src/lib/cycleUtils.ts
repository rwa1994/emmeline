import type { CyclePhase } from '../types';

/**
 * Evidence-based phase calculation.
 *
 * Sources:
 *   Bull et al. (2019) npj Digital Medicine — 600,000+ cycles: luteal ~12 days average,
 *   follicular phase absorbs virtually all cycle-length variation.
 *   Henry et al. (2024) Human Reproduction — within-woman luteal variance ~3 days,
 *   follicular variance ~5 days; luteal significantly more stable.
 *   Grieger & Norman (2020) PLoS ONE — luteal mean 11.7 days (SD 2.8).
 *
 * Algorithm:
 *   - Luteal    = last 12 days of cycle (most consistent phase)
 *   - Ovulatory = 4 days immediately before luteal (peri-ovulatory fertile window)
 *   - Follicular = between end of period and start of ovulatory window (variable)
 *   - Menstrual = user's reported period length
 */
export function getPhaseForDay(
  dayOfCycle: number,
  periodLength: number,
  cycleLength: number,
): CyclePhase {
  const lutealStart = cycleLength - 11;                              // 12-day luteal
  const ovulatoryStart = Math.max(periodLength + 1, lutealStart - 4); // 4-day ovulatory window

  if (dayOfCycle <= periodLength) return 'menstrual';
  if (dayOfCycle < ovulatoryStart) return 'follicular';
  if (dayOfCycle < lutealStart) return 'ovulatory';
  return 'luteal';
}
