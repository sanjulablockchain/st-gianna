import PageHero from "./PageHero";

const STATS = [
  { n: "10", l: "Pieces published" },
  { n: "6", l: "Topics covered" },
  { n: "Weekly", l: "New writing" },
];

export default function JournalHero() {
  return (
    <PageHero
      breadcrumb="Journal"
      headline="The"
      italic="journal."
      subcopy="Plain writing from the clinicians who see your family. No sponsored supplements, no scare pieces, and no advice we would not give you in the room. When the evidence is uncertain we say so, and when something is genuinely worth worrying about we say that too."
      stats={STATS}
      image="/images/hero-journal.jpg"
      imageAlt=""
    />
  );
}
