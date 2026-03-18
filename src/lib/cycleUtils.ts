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
/**
 * Parse a YYYY-MM-DD date string as local midnight, not UTC.
 * new Date('2024-03-15') treats string as UTC which causes off-by-one
 * errors in timezones ahead of UTC (e.g. Australia).
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format a Date as YYYY-MM-DD in local time (not UTC).
 * toISOString() converts to UTC first which can shift the date.
 */
export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Compute dynamic phase day ranges for a given cycle/period length.
 * Returns a map of phase -> display string e.g. "Days 6–17"
 */
export function getPhaseRanges(
  periodLength: number,
  cycleLength: number,
): Record<CyclePhase, string> {
  const lutealStart = cycleLength - 11;
  const ovulatoryStart = Math.max(periodLength + 1, lutealStart - 4);
  const follicularEnd = ovulatoryStart - 1;

  return {
    menstrual:  `Days 1–${periodLength}`,
    follicular: follicularEnd >= periodLength + 1
      ? `Days ${periodLength + 1}–${follicularEnd}`
      : `Days ${periodLength + 1}`,
    ovulatory:  `Days ${ovulatoryStart}–${lutealStart - 1}`,
    luteal:     `Days ${lutealStart}–${cycleLength}`,
  };
}

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
