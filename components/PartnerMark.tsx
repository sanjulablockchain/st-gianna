import styles from "./PartnerMark.module.css";

type PartnerMarkProps = {
  /** Two-letter monogram, e.g. "KT". */
  initials: string;
  /** Full organization name, used for the accessible label. */
  name: string;
};

/**
 * A monogram mark for a network organization.
 *
 * These are drawn rather than fetched on purpose. The real logos belong to
 * other companies, so redistributing them from this repo would be a
 * trademark problem, and hotlinking them would break the page whenever those
 * sites move a file. A consistent set of monograms is honest and never 404s.
 * Swap in a real asset per partner once written permission and the files are
 * in hand.
 */
export default function PartnerMark({ initials, name }: PartnerMarkProps) {
  return (
    <span className={styles.mark} role="img" aria-label={`${name} monogram`}>
      <span className={styles.initials}>{initials}</span>
    </span>
  );
}
