import Image from "next/image";
import styles from "./PartnerLogo.module.css";

type PartnerLogoProps = {
  src: string;
  name: string;
};

/**
 * A partner's real logo on a light chip.
 *
 * The chip is deliberately light in both themes: most of these logos are dark
 * navy wordmarks on transparent backgrounds, which would disappear entirely
 * against the dark theme's card. A consistent light plate is also how logo
 * walls normally read, so mixed logo styles sit together without clashing.
 */
export default function PartnerLogo({ src, name }: PartnerLogoProps) {
  return (
    <span className={styles.chip}>
      <Image
        src={src}
        alt={`${name} logo`}
        width={120}
        height={60}
        className={styles.image}
      />
    </span>
  );
}
