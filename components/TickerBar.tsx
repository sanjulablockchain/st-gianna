import styles from "./TickerBar.module.css";

const MARQUEE_ITEMS = [
  "Same-day appointments",
  "24/7 online booking",
  "Telehealth tonight",
  "Most HMO & IPA plans",
  "Board-certified pediatricians",
  "One chart, three clinics",
];

const LOOPED_ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

export default function TickerBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.track}>
        {LOOPED_ITEMS.map((label, index) => (
          <span key={`${label}-${index}`} className={styles.item}>
            {label}
            <span className={styles.dot} />
          </span>
        ))}
      </div>
    </div>
  );
}
