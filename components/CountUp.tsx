"use client";

import { useCountUp, parseStat, formatStat } from "@/hooks/useCountUp";

type CountUpProps = {
  /** The finished label, e.g. "18,000+", "94%", "2 hrs", or "All ages". */
  value: string;
  /** Usually the section's scroll-reveal state, so counting starts on entry. */
  active: boolean;
  className?: string;
};

export default function CountUp({ value, active, className }: CountUpProps) {
  const parsed = parseStat(value);
  // Hooks cannot be conditional, so this always runs and is simply ignored
  // for labels that should not count.
  const current = useCountUp(parsed?.target ?? 0, active && parsed !== null);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span className={className} aria-label={value}>
      {formatStat(current, parsed)}
    </span>
  );
}
