import styles from "./BookCta.module.css";
import { ArrowOutwardIcon } from "@/components/icons";

export default function BookCta() {
  return (
    <a href="#book" className={styles.pill}>
      Book a visit <ArrowOutwardIcon size={18} />
    </a>
  );
}
