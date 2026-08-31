"use client";

import styles from "./ContactChannels.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  CallIcon,
  ScheduleIcon,
  ChatBubbleIcon,
  MonitorHeartIcon,
  ArrowOutwardIcon,
} from "@/components/icons";

const CHANNELS = [
  {
    icon: CallIcon,
    title: "Call the office",
    body: "Fastest route for anything urgent or same-day. Each office has its own line, and reception can check all three for a slot before you hang up.",
    action: "Call the office",
    href: "tel:+18183084100",
  },
  {
    icon: ScheduleIcon,
    title: "Book online, any hour",
    body: "Scheduling never closes. Pick a slot, get an instant confirmation, and reschedule the same way if the week turns on you.",
    action: "Book online",
    href: "https://app.nexhealth.com/appt/ktdoctor?atid=275899,275901,275900,275904,275905,275903",
  },
  {
    icon: ChatBubbleIcon,
    title: "Email us",
    body: "Best for billing questions, records requests, and anything with an attachment. We reply within one business day.",
    action: "Email us",
    href: "mailto:contact@sgmdoctor.com",
  },
  {
    icon: MonitorHeartIcon,
    title: "See us by video",
    body: "Telehealth covers follow-ups, medication reviews, rashes, and plenty of sick visits. If we need you in the room, we will say so on the call.",
    action: "See telehealth options",
    href: "/services#catalog",
  },
];

export default function ContactChannels() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="channels"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>Four ways through.</h2>
      <div className={styles.grid}>
        {CHANNELS.map(({ icon: ChannelIcon, title, body, action, href }, i) => {
          const external = href.startsWith("http");
          return (
            <a
              key={title}
              href={href}
              className={styles.card}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
            >
              <span className={styles.iconWrap}>
                <ChannelIcon size={26} />
              </span>
              <h3 className={styles.title}>{title}</h3>
              <span className={styles.body}>{body}</span>
              <span className={styles.cta}>
                {action}
                <ArrowOutwardIcon size={18} />
              </span>
            </a>
          );
        })}
      </div>
      <p className={styles.assist}>
        Outside office hours a clinician answers the 24-hour assistance line on{" "}
        <a href="tel:+18183084100" className={styles.assistLink}>
          818-308-4100
        </a>
        . If this is an emergency, call 911 or go to your nearest emergency department.
      </p>
    </section>
  );
}
