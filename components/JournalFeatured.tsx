"use client";

import Image from "next/image";
import styles from "./JournalFeatured.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";

const META = {
  category: "Preventive care",
  readTime: "5 min read",
  date: "24 August 2026",
  title: "10 essential habits for a healthier family year",
  standfirst:
    "Preventive care, sleep, screen time, and nutrition. What our pediatricians actually recommend, and what we quietly ignore.",
};

const BODY = [
  {
    heading: "Book the well visit before you need it",
    paragraphs: [
      "The single highest-value appointment of the year is the one nobody feels urgency about. A well visit is where growth curves get plotted, hearing and vision get checked, and the small things that only show up over time get caught while they are still small.",
      "Book it at the same point every year and it stops competing with everything else in the calendar. Families who anchor it to a birthday month almost never miss one.",
    ],
  },
  {
    heading: "Protect sleep before you optimise anything else",
    paragraphs: [
      "Most of what parents come to us worried about, from attention at school to appetite to mood, improves measurably when sleep improves. School-age children need nine to twelve hours, and teenagers need eight to ten. Very few get it.",
      "The change that helps most is not a new bedtime, it is a consistent wake time, including at weekends. A steady wake time drags the whole rhythm into place on its own.",
    ],
  },
  {
    heading: "Treat screens as a schedule question, not a morality question",
    paragraphs: [
      "The research on screen time is far less dramatic than the headlines suggest. What matters is what the screen displaces. An hour of video that replaces an hour of sitting still is neutral. An hour that replaces sleep, movement, or conversation is not.",
      "Rather than counting minutes, protect the three things worth protecting: sleep, daily physical activity, and at least one meal a day where nobody is holding a device.",
    ],
  },
  {
    heading: "Make the default food the easy food",
    paragraphs: [
      "Nutrition advice fails when it depends on willpower at the moment of hunger. It works when the easy option is already the reasonable one. Cut fruit sitting at eye level gets eaten. Fruit in the drawer does not.",
      "We do not ask families to eliminate anything. We ask them to make one swap that survives a bad week, because a habit that only holds on good weeks is not a habit.",
    ],
  },
  {
    heading: "Keep immunizations on schedule, and keep the record",
    paragraphs: [
      "Staying on schedule matters more than catching up later, because the schedule is built around when children are most vulnerable. If you have fallen behind, catch-up schedules exist and work. Tell us and we will build one.",
      "Keep your own copy of the record. Ours follows you between all three offices, but schools, camps, and sports leagues all ask separately and always at the last minute.",
    ],
  },
  {
    heading: "Know what actually warrants a same-day call",
    paragraphs: [
      "Trust the change more than the number. A fever in a child who is drinking, playing, and responding normally is usually less concerning than a lower temperature in a child who has gone quiet and floppy.",
      "Call the same day for breathing that looks like work, for a baby under three months with any fever, for dehydration, or for a child who is much harder to rouse than usual. When you are unsure, call. Sorting that out is the job.",
    ],
  },
];

export default function JournalFeatured() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: parallaxRef, offset } = useParallax<HTMLSpanElement>(0.08, 28);

  return (
    <section
      id="featured"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <p className={styles.meta}>
        <span className={styles.metaTag}>Featured</span>
        <span>{META.category}</span>
        <span>{META.readTime}</span>
        <span>{META.date}</span>
      </p>
      <h2 className={styles.title}>{META.title}</h2>
      <p className={styles.standfirst}>{META.standfirst}</p>

      <span className={styles.imageWrap} ref={parallaxRef}>
        <span className={styles.imageLayer} style={{ transform: `translateY(${offset}px)` }}>
          <Image
            src="/images/journal-featured.jpg"
            alt="A family at home together"
            fill
            className={styles.image}
          />
        </span>
      </span>

      <div className={styles.body}>
        {BODY.map((block) => (
          <div key={block.heading}>
            <h3 className={styles.blockHeading}>{block.heading}</h3>
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
