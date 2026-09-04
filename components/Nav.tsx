"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";
import { useTheme } from "@/hooks/useTheme";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useWheelPicker } from "@/hooks/useWheelPicker";
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

/* Wheel tuning, all in one place.
   CURVE   how hard items rotate away from centre, in degrees per step
   SPACING horizontal distance between neighbours, in px
   DEPTH   how far off-centre items sink back, in px
   Chip shape lives in Nav.module.css as --wheel-chip-radius
   (50% for a circle, 34% for the squircle used now). */
const CURVE = 26;
const SPACING = 58;
const DEPTH = 46;
const VISIBLE = 3;

export default function Nav() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [hoverIndex, setHoverIndex] = useState(-1);
  const isMobile = useMediaQuery("(max-width: 859px)");

  // Every entry is a real destination, so every entry shows at every width.
  const items = [
    { label: "Home", href: "/", icon: <HomeIcon size={23} /> },
    { label: "About us", href: "/about", icon: <DiversityIcon size={23} /> },
    { label: "Services", href: "/services", icon: <StethoscopeIcon size={23} /> },
    { label: "Why us", href: "/why-us", icon: <FavoriteIcon size={23} /> },
    { label: "Locations", href: "/locations", icon: <NearMeIcon size={23} /> },
    { label: "Journal", href: "/journal", icon: <MenuBookIcon size={23} /> },
    { label: "Partners", href: "/partners", icon: <HandshakeIcon size={23} /> },
    { label: "Contact", href: "/contact", icon: <ChatBubbleIcon size={23} /> },
    { label: "Call us", href: "tel:+18183084100", icon: <CallIcon size={23} /> },
    {
      label: theme === "dark" ? "Light mode" : "Dark mode",
      icon: theme === "dark" ? <LightModeIcon size={23} /> : <DarkModeIcon size={23} />,
      onClick: toggleTheme,
    },
  ];

  // Open the wheel on whichever page you are actually looking at. Seeding the
  // wheel's initial position with this (instead of always starting at 0 and
  // settling over to it once mounted) means a deep link straight to, say,
  // Partners never shows Home centred for a frame before sliding away.
  const routeIndex = items.findIndex((item) => item.href === pathname);
  const wheel = useWheelPicker(items.length, SPACING, routeIndex >= 0 ? routeIndex : 0);
  const { settleTo } = wheel;

  // Route changes after mount (clicking to a new page) still animate over.
  useEffect(() => {
    if (routeIndex >= 0) settleTo(routeIndex);
  }, [routeIndex, settleTo]);

  const centred = items[wheel.activeIndex];

  /* Tapping a chip focuses it before it fires click. If focus centred the chip,
     that same tap would then commit, collapsing the deliberate two-tap flow.
     So focus only turns the wheel when no pointer is involved, which is
     exactly the keyboard case. */
  const pointerFocus = useRef(false);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      pointerFocus.current = true;
      wheel.onPointerDown(event);
    },
    [wheel],
  );

  const handlePointerUp = useCallback(() => {
    wheel.onPointerUp();
    pointerFocus.current = false;
  }, [wheel]);

  const centreOnKeyboardFocus = useCallback(
    (index: number) => {
      if (!isMobile || pointerFocus.current) return;
      settleTo(index);
    },
    [isMobile, settleTo],
  );

  /* The wheel/readout/dots markup below is always rendered, regardless of
     `isMobile`. That flag comes from a media-query hook that (by design,
     see useMediaQuery) starts out "not yet known" on the very first paint,
     so it must never gate which DOM shows up - only real CSS media queries
     may do that, or the nav briefly renders as the desktop list even on a
     phone. `isMobile` still gates pure behaviour (drag handlers, keyboard
     centring) where a frame of lag is harmless. */
  return (
    <nav className={styles.nav} onMouseLeave={() => setHoverIndex(-1)} aria-label="Main">
      <span className={styles.readout} aria-hidden="true">
        {centred?.label}
      </span>

      <div className={styles.blobLayer} aria-hidden="true">
        {items.map((item, i) => {
          const distance = hoverIndex < 0 ? Infinity : Math.abs(i - hoverIndex);
          const width = distance === 0 ? 184 : distance === 1 ? 92 : distance === 2 ? 64 : 52;
          return (
            <div
              key={item.label}
              className={`${styles.blob} ${distance === 0 ? styles.blobActive : ""}`}
              style={{ width: `${width}px` }}
            />
          );
        })}
      </div>

      <ul
        className={`${styles.list} ${styles.wheel} ${wheel.dragging ? styles.dragging : ""}`}
        onPointerDown={isMobile ? handlePointerDown : undefined}
        onPointerMove={isMobile ? wheel.onPointerMove : undefined}
        onPointerUp={isMobile ? handlePointerUp : undefined}
        onPointerCancel={isMobile ? handlePointerUp : undefined}
      >
        {items.map((item, i) => {
          const offset = i - wheel.position;
          const capped = Math.max(-VISIBLE, Math.min(VISIBLE, offset));
          const fade = Math.min(Math.abs(offset), VISIBLE);
          const isCentred = i === wheel.activeIndex;

          // Set as CSS custom properties, not direct style props, so they only
          // ever take visual effect through the `.wheelItem` rule scoped
          // inside the mobile media query - see the comment above the <nav>.
          const hidden = Math.abs(offset) > VISIBLE;
          const wheelStyle = {
            "--wheel-transform": `translateX(${offset * SPACING}px) translateZ(${
              -Math.abs(capped) * DEPTH
            }px) rotateY(${-capped * CURVE}deg) scale(${1 - fade * 0.13})`,
            "--wheel-opacity": hidden ? 0 : 1 - fade * 0.26,
            "--wheel-pointer": hidden ? "none" : "auto",
            "--wheel-z": 100 - Math.round(Math.abs(offset) * 10),
          } as React.CSSProperties;

          const content = (
            <>
              <span className={styles.iconWrap}>{item.icon}</span>
              <span className={`${styles.label} ${hoverIndex === i ? styles.labelVisible : ""}`}>
                {item.label}
              </span>
            </>
          );

          // On the wheel the first tap centres an item; only the centred item
          // commits. That is the deliberate second-tap cost.
          const needsCentring = isMobile && !isCentred;

          const linkClass = `${styles.link} ${isCentred ? styles.centred : ""}`;

          const control = item.onClick ? (
            <button
              type="button"
              className={linkClass}
              onMouseEnter={() => setHoverIndex(i)}
              onFocus={() => centreOnKeyboardFocus(i)}
              onClick={() => {
                if (needsCentring) {
                  settleTo(i);
                  return;
                }
                item.onClick?.();
              }}
            >
              {content}
            </button>
          ) : item.href.startsWith("tel:") || item.href.startsWith("http") ? (
            <a
              href={item.href}
              className={linkClass}
              onMouseEnter={() => setHoverIndex(i)}
              onFocus={() => centreOnKeyboardFocus(i)}
              onClick={(event) => {
                if (needsCentring) {
                  event.preventDefault();
                  settleTo(i);
                }
              }}
            >
              {content}
            </a>
          ) : (
            <Link
              href={item.href}
              className={linkClass}
              aria-current={pathname === item.href ? "page" : undefined}
              onMouseEnter={() => setHoverIndex(i)}
              onFocus={() => centreOnKeyboardFocus(i)}
              onClick={(event) => {
                if (needsCentring) {
                  event.preventDefault();
                  settleTo(i);
                }
              }}
            >
              {content}
            </Link>
          );

          return (
            <li
              key={item.label}
              className={styles.wheelItem}
              style={{ listStyle: "none", ...wheelStyle }}
            >
              {control}
            </li>
          );
        })}
      </ul>

      <span className={styles.dots} aria-hidden="true">
        {items.map((item, i) => (
          <span
            key={item.label}
            className={`${styles.dot} ${i === wheel.activeIndex ? styles.dotActive : ""}`}
          />
        ))}
      </span>
    </nav>
  );
}
