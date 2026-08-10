import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandColumn}>
          <span
            role="img"
            aria-label="St. Gianna Medical Group"
            className={styles.logo}
          />
          <p className={styles.tagline}>
            Pediatric and family healthcare across Los Angeles. Same-day, telehealth, after
            hours.
          </p>
        </div>
        <div className={styles.column}>
          <span className={styles.columnHeading}>Explore</span>
          <Link href="/about" className={styles.link}>About us</Link>
          <Link href="/services" className={styles.link}>Services</Link>
          <Link href="/#why" className={styles.link}>Why us</Link>
          <Link href="/#locations" className={styles.link}>Locations</Link>
          <Link href="/#insight" className={styles.link}>Journal</Link>
        </div>
        <div className={styles.column}>
          <span className={styles.columnHeading}>Patients</span>
          <Link href="/#book" className={styles.link}>Book appointment</Link>
          <Link href="/#footer" className={styles.link}>Patient portal</Link>
          <Link href="/#footer" className={styles.link}>Insurance &amp; billing</Link>
          <Link href="/#footer" className={styles.link}>Careers</Link>
        </div>
        <div className={styles.column}>
          <span className={styles.columnHeading}>Contact</span>
          <a href="tel:+18183084100" className={styles.link}>Santa Monica &middot; 818-308-4100</a>
          <a href="tel:+18182757006" className={styles.link}>Hollywood &middot; 818-275-7006</a>
          <a href="tel:+15629419853" className={styles.link}>La Mirada &middot; 562-941-9853</a>
          <a href="mailto:contact@sgmdoctor.com" className={styles.emailLink}>
            contact@sgmdoctor.com
          </a>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <span>&copy; 2026 St. Gianna Medical Group. All rights reserved.</span>
        <span className={styles.legalLinks}>
          <Link href="/#footer">Privacy</Link>
          <Link href="/#footer">Terms</Link>
          <Link href="/#footer">Accessibility</Link>
        </span>
      </div>
    </footer>
  );
}
