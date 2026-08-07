"use client";

import { useState } from "react";
import styles from "./Nav.module.css";
import { useTheme } from "@/hooks/useTheme";
import {
  HomeIcon,
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
  const [hoverIndex, setHoverIndex] = useState(-1);

  const items = [
    { label: "Home", href: "/", icon: <HomeIcon size={23} />, primary: true },
    { label: "Services", href: "/services", icon: <StethoscopeIcon size={23} />, primary: true },
    { label: "Why us", href: "/#why", icon: <FavoriteIcon size={23} />, primary: false },
    { label: "Locations", href: "/#locations", icon: <NearMeIcon size={23} />, primary: true },
    { label: "Journal", href: "/#insight", icon: <MenuBookIcon size={23} />, primary: false },
    { label: "Partners", href: "/#partners", icon: <HandshakeIcon size={23} />, primary: false },
    { label: "Contact", href: "/#footer", icon: <ChatBubbleIcon size={23} />, primary: false },
    { label: "Call us", href: "tel:13105550123", icon: <CallIcon size={23} />, primary: true },
    {
      label: theme === "dark" ? "Light mode" : "Dark mode",
      href: "/#top",
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
        {items.map((item, i) => (
          <li
            key={item.label}
            className={item.primary ? undefined : styles.extraOnly}
            style={{ listStyle: "none" }}
          >
            <a
              href={item.href}
              className={styles.link}
              onMouseEnter={() => setHoverIndex(i)}
              onClick={
                item.onClick
                  ? (event) => {
                      event.preventDefault();
                      item.onClick?.();
                    }
                  : undefined
              }
            >
              <span className={styles.iconWrap}>{item.icon}</span>
              <span className={`${styles.label} ${hoverIndex === i ? styles.labelVisible : ""}`}>
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
