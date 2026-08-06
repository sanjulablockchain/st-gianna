"use client";

import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof window.matchMedia !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.12, 60);
        wrap.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="top" className={styles.hero} data-dark="1">
      <div ref={wrapRef} className={styles.videoLayer}>
        <video
          ref={videoRef}
          className={styles.video}
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <span className={styles.gradient} />
      <span className={styles.scanlines} />

      <span
        role="img"
        aria-label="St. Gianna Medical Group"
        className={styles.logo}
      />

      <div className={styles.content}>
        <span className={styles.eyebrow}>
          <span className={styles.liveDot} />
          Los Angeles &middot; Pediatric &amp; family medicine
        </span>
        <h1 className={styles.headline}>
          Care that
          <br />
          keeps up
          <br />
          with <span className={styles.headlineItalic}>childhood.</span>
        </h1>
        <div className={styles.subrow}>
          <p className={styles.subcopy}>
            Same-day sick visits, round-the-clock booking, telehealth after dinner, and one chart
            that follows your child to every office we run.
          </p>
          <div className={styles.stats}>
            <span className={styles.stat}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>LA clinics</span>
            </span>
            <span className={styles.stat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Booking</span>
            </span>
            <span className={styles.stat}>
              <span className={styles.statNumber}>4.9</span>
              <span className={styles.statLabel}>Parent rating</span>
            </span>
          </div>
        </div>
      </div>

      <span className={styles.scrollHint}>
        <span className={styles.scrollHintLabel}>Scroll</span>
        <span className={styles.scrollHintTrack}>
          <span className={styles.scrollHintFill} />
        </span>
      </span>
    </section>
  );
}
