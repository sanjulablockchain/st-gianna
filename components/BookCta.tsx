import styles from "./BookCta.module.css";
import { ArrowOutwardIcon } from "@/components/icons";

export default function BookCta() {
  return (
    <a
      href="https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=a8gDE7vnNqvjwXe2"
      className={styles.pill}
    >
      Book a visit <ArrowOutwardIcon size={18} />
    </a>
  );
}
