import PageHero from "./PageHero";
import { TIP_TOPICS } from "@/components/tips/tips";

const TIP_COUNT = TIP_TOPICS.reduce((total, topic) => total + topic.tips.length, 0);

const STATS = [
  { n: String(TIP_COUNT), l: "Practical tips" },
  { n: String(TIP_TOPICS.length), l: "Everyday topics" },
  { n: "After hours", l: "Clinician on call" },
];

export default function TipsHero() {
  return (
    <PageHero
      breadcrumb="Medical tips"
      headline="Good to know,"
      italic="before you call."
      subcopy="Short, practical answers to the questions parents ask us most: what to do about a fever, how to get fluids into a child with a stomach bug, when a cut needs stitches, and which signs mean you should stop reading and get help now. Each topic ends with when to call us."
      stats={STATS}
      image="/images/photo-pediatric-checkup.jpg"
      imageAlt=""
    />
  );
}
