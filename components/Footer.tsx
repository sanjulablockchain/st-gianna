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
          <a href="#services" className={styles.link}>Services</a>
          <a href="#why" className={styles.link}>Why us</a>
          <a href="#locations" className={styles.link}>Locations</a>
          <a href="#insight" className={styles.link}>Journal</a>
        </div>
        <div className={styles.column}>
          <span className={styles.columnHeading}>Patients</span>
          <a href="#book" className={styles.link}>Book appointment</a>
          <a href="#footer" className={styles.link}>Patient portal</a>
          <a href="#footer" className={styles.link}>Insurance &amp; billing</a>
          <a href="#footer" className={styles.link}>Careers</a>
        </div>
        <div className={styles.column}>
          <span className={styles.columnHeading}>Contact</span>
          <span className={styles.link}>Santa Monica &middot; (310) 555-0123</span>
          <span className={styles.link}>Hollywood &middot; (323) 555-0199</span>
          <span className={styles.link}>La Mirada &middot; (562) 555-0144</span>
          <a href="mailto:contact@sgmdoctor.com" className={styles.emailLink}>
            contact@sgmdoctor.com
          </a>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <span>&copy; 2026 St. Gianna Medical Group. All rights reserved.</span>
        <span className={styles.legalLinks}>
          <a href="#footer">Privacy</a>
          <a href="#footer">Terms</a>
          <a href="#footer">Accessibility</a>
        </span>
      </div>
    </footer>
  );
}
