"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";
import { useTheme } from "@/hooks/useTheme";
import {
  HomeIcon,
  DiversityIcon,
  StethoscopeIcon,
  FavoriteIcon,
  NearMeIcon,
  MenuBookIcon,
  HandshakeIcon,
  ChatBubbleIcon,
  CallIcon,
  LightModeIcon,
  DarkModeIcon,
} from "@/components/icons";

export default function Nav() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [hoverIndex, setHoverIndex] = useState(-1);

  const items = [
    { label: "Home", href: "/", icon: <HomeIcon size={23} />, primary: true },
    { label: "About us", href: "/about", icon: <DiversityIcon size={23} />, primary: true },
    { label: "Services", href: "/services", icon: <StethoscopeIcon size={23} />, primary: true },
    { label: "Why us", href: "/why-us", icon: <FavoriteIcon size={23} />, primary: false },
    { label: "Locations", href: "/locations", icon: <NearMeIcon size={23} />, primary: true },
    { label: "Journal", href: "/journal", icon: <MenuBookIcon size={23} />, primary: false },
    { label: "Partners", href: "/partners", icon: <HandshakeIcon size={23} />, primary: false },
    { label: "Contact", href: "/contact", icon: <ChatBubbleIcon size={23} />, primary: false },
    { label: "Call us", href: "tel:+18183084100", icon: <CallIcon size={23} />, primary: true },
    {
      label: theme === "dark" ? "Light mode" : "Dark mode",
      icon: theme === "dark" ? <LightModeIcon size={23} /> : <DarkModeIcon size={23} />,
      primary: true,
      onClick: toggleTheme,
    },
  ];

  return (
    <nav className={styles.nav} onMouseLeave={() => setHoverIndex(-1)}>
      <div className={styles.blobLayer} aria-hidden="true">
        {items.map((item, i) => {
          const distance = hoverIndex < 0 ? Infinity : Math.abs(i - hoverIndex);
          const width = distance === 0 ? 184 : distance === 1 ? 92 : distance === 2 ? 64 : 52;
          return (
            <div
              key={item.label}
              className={`${styles.blob} ${distance === 0 ? styles.blobActive : ""} ${
                item.primary ? "" : styles.extraOnly
              }`}
              style={{ width: `${width}px` }}
            />
          );
        })}
      </div>
      <ul className={styles.list}>
        {items.map((item, i) => {
          const content = (
            <>
              <span className={styles.iconWrap}>{item.icon}</span>
              <span className={`${styles.label} ${hoverIndex === i ? styles.labelVisible : ""}`}>
                {item.label}
              </span>
            </>
          );

          // The theme toggle is a control, not a destination.
          const control = item.onClick ? (
            <button
              type="button"
              className={styles.link}
              onMouseEnter={() => setHoverIndex(i)}
              onClick={item.onClick}
            >
              {content}
            </button>
          ) : item.href.startsWith("tel:") || item.href.startsWith("http") ? (
            <a href={item.href} className={styles.link} onMouseEnter={() => setHoverIndex(i)}>
              {content}
            </a>
          ) : (
            <Link
              href={item.href}
              className={styles.link}
              aria-current={pathname === item.href ? "page" : undefined}
              onMouseEnter={() => setHoverIndex(i)}
            >
              {content}
            </Link>
          );

          return (
            <li
              key={item.label}
              className={item.primary ? undefined : styles.extraOnly}
              style={{ listStyle: "none" }}
            >
              {control}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
