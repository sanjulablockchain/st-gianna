// Content for /medical-tips. Short, practical guidance grouped by topic. Each
// topic can point to a longer journal article for the full picture.

export type Tip = { title: string; body: string };

export type TipTopic = {
  id: string;
  title: string;
  intro: string;
  tips: Tip[];
  /** Reasons to call the office rather than wait it out. */
  callUs: string[];
  /** Slug of a journal article that covers the topic in depth. */
  articleSlug?: string;
};

/** Signs that need 911 or an emergency department, not a message or a callback. */
export const EMERGENCY_SIGNS: string[] = [
  "Struggling to breathe, breathing very fast, or the skin between the ribs pulling in with each breath",
  "Blue or grey lips, tongue or face",
  "A seizure, or a child who is hard to wake, floppy or not responding normally",
  "A fever of 100.4°F or higher in a baby under three months old",
  "Swelling of the lips, tongue or throat, or hives with trouble breathing after a food, sting or medicine",
  "A head injury followed by repeated vomiting, confusion, unusual sleepiness or loss of consciousness",
  "Bleeding that does not slow after ten minutes of firm, steady pressure",
  "A possible poisoning or medicine overdose with any symptoms at all",
];

export const POISON_CONTROL = { label: "1-800-222-1222", tel: "+18002221222" };

export const TIP_TOPICS: TipTopic[] = [
  {
    id: "fever",
    title: "Fever",
    intro:
      "Fever is the body doing its job against an infection. It is rarely dangerous on its own, and the way your child looks and acts tells us more than the number.",
    tips: [
      {
        title: "Treat the child, not the thermometer",
        body: "A child who is drinking, playing in between naps and making wet diapers is usually fine, even at 103°F. A child who is listless, hard to wake or refusing all fluids needs to be seen, whatever the reading.",
      },
      {
        title: "Measure it the right way for their age",
        body: "Under three months, a rectal temperature is the most accurate. For older babies and toddlers, rectal or a well placed armpit reading works. From about four years, an oral thermometer is reliable if they can hold it under the tongue.",
      },
      {
        title: "Medicine is for comfort, not a cure",
        body: "Acetaminophen or ibuprofen can help a miserable child rest and drink. Dose by weight, not age, using the syringe that comes with the bottle. Ibuprofen is not for babies under six months, and never give aspirin to anyone under 18.",
      },
      {
        title: "Fluids matter more than food",
        body: "Fever raises how much water the body loses. Offer small, frequent drinks of water, milk or an oral rehydration solution. Appetite usually comes back once the fever settles.",
      },
      {
        title: "Dress them lightly",
        body: "Bundling a feverish child traps heat. A single light layer and a comfortable room are enough. Skip cold baths and rubbing alcohol, which cause shivering and can make things worse.",
      },
    ],
    callUs: [
      "Any fever in a baby under three months (go to the ER)",
      "Fever lasting more than 24 hours in a child under two, or more than three days at any age",
      "Fever above 104°F that does not come down with medicine",
      "Fever with a stiff neck, a rash that does not fade when pressed, or ear pain",
      "Fewer than three wet diapers a day, or no urine in eight hours",
    ],
    articleSlug: "fever-without-fear",
  },
  {
    id: "colds",
    title: "Colds, coughs and flu",
    intro:
      "Young children can catch eight or more colds a year, especially in their first year of daycare or school. Most get better on their own with time and comfort care.",
    tips: [
      {
        title: "Expect it to take a while",
        body: "A typical cold lasts seven to ten days, and the cough can linger for two to three weeks after everything else clears. Green or yellow mucus is normal and does not mean antibiotics are needed.",
      },
      {
        title: "Skip cough and cold medicines for young children",
        body: "Over the counter cough and cold medicines are not recommended under age four. They do not work well in children and can cause serious side effects. Ask us before using them in older children.",
      },
      {
        title: "Honey for coughs, but only after the first birthday",
        body: "Half a teaspoon to a teaspoon of honey can calm a night time cough in children over one year old. Never give honey to a baby under 12 months because of the risk of infant botulism.",
      },
      {
        title: "Clear the nose",
        body: "Saline drops followed by gentle suction help babies feed and sleep. A cool mist humidifier in the bedroom can ease congestion. Clean it daily so it does not grow mould.",
      },
      {
        title: "Know when it might be flu",
        body: "Flu tends to start suddenly with high fever, body aches and exhaustion. Antiviral medicine works best within the first 48 hours, so call early if you suspect flu, especially for children under five or with asthma.",
      },
    ],
    callUs: [
      "Breathing that is fast, noisy or looks like hard work",
      "A cough that lasts longer than three weeks, or comes in fits that end in vomiting",
      "Ear pain, or pus draining from the ear",
      "Symptoms that improve and then suddenly get worse, with a new fever",
      "Signs of dehydration, such as very few wet diapers",
    ],
    articleSlug: "flu-season-plan",
  },
  {
    id: "stomach",
    title: "Vomiting, diarrhea and dehydration",
    intro:
      "Stomach bugs are unpleasant but usually pass in a few days. The job at home is to keep fluids going in faster than they are coming out.",
    tips: [
      {
        title: "Small sips, often",
        body: "After vomiting, wait about 30 minutes, then offer a teaspoon or two of oral rehydration solution every few minutes. Slowly increase the amount if it stays down. Big gulps tend to come straight back up.",
      },
      {
        title: "Use the right drink",
        body: "Oral rehydration solutions have the balance of salt and sugar the body needs. Sports drinks, juice and soda have too much sugar and can make diarrhea worse in young children. Keep breastfeeding or formula feeding babies as normal.",
      },
      {
        title: "Food when they are ready",
        body: "There is no need for a strict diet. Once vomiting settles, offer normal, simple foods your child likes. Starving a stomach bug does not shorten it.",
      },
      {
        title: "Wash hands with soap",
        body: "Stomach viruses such as norovirus spread easily through a household. Hand sanitizer is less effective against them, so wash with soap and water, especially after diaper changes and before preparing food.",
      },
    ],
    callUs: [
      "No urine in eight hours, no tears when crying, a very dry mouth, or a sunken soft spot on a baby's head",
      "Vomiting that lasts more than 24 hours, or diarrhea that lasts more than a week",
      "Green vomit, blood in the vomit, or blood in the stool",
      "Severe belly pain, especially low on the right side",
      "Any vomiting and diarrhea in a baby under three months",
    ],
  },
  {
    id: "sleep",
    title: "Sleep",
    intro:
      "Sleep affects mood, attention, growth and immunity. A few steady habits make a bigger difference than any product.",
    tips: [
      {
        title: "Safe sleep for babies: alone, on the back, in a crib",
        body: "Put babies to sleep on their back on a firm, flat surface with only a fitted sheet. No pillows, bumpers, blankets or soft toys. Room sharing without bed sharing is recommended for at least the first six months.",
      },
      {
        title: "Anchor the wake time",
        body: "A consistent wake time, even on weekends, sets the body clock more reliably than an earlier bedtime. Bedtime tends to settle on its own once mornings are steady.",
      },
      {
        title: "Know how much sleep is normal",
        body: "As a rough guide in 24 hours: toddlers need 11 to 14 hours including naps, preschoolers 10 to 13, school age children 9 to 12, and teenagers 8 to 10. Most teens get far less.",
      },
      {
        title: "Screens out of the bedroom",
        body: "Turn screens off at least an hour before bed and charge phones and tablets outside the bedroom. The light and the content both keep the brain awake.",
      },
      {
        title: "Regressions pass",
        body: "Babies and toddlers often sleep worse for a few weeks around developmental leaps, illness or travel. Keep the routine steady and it usually resolves.",
      },
    ],
    callUs: [
      "Loud snoring most nights, or pauses in breathing during sleep",
      "Daytime sleepiness that affects school, mood or behaviour",
      "Night waking with pain, or frequent night terrors",
      "Sleep problems that last more than a month despite a steady routine",
    ],
    articleSlug: "sleep-regressions",
  },
  {
    id: "nutrition",
    title: "Nutrition and picky eating",
    intro:
      "Most picky eating is a normal phase. Your job is what, when and where food is offered. Your child's job is whether and how much to eat.",
    tips: [
      {
        title: "Offer, then offer again",
        body: "Children may need to see and taste a new food ten to fifteen times before they accept it. Put a small amount on the plate next to something they already like, without pressure or bribes.",
      },
      {
        title: "Water and milk are the main drinks",
        body: "Skip juice entirely before the first birthday and limit it after. Toddlers need only about two to three cups of milk a day; more than that can crowd out iron rich foods.",
      },
      {
        title: "Eat together when you can",
        body: "Regular family meals, even a few times a week, are linked with better eating habits. Keep screens off the table so everyone notices when they are full.",
      },
      {
        title: "Plan snacks like small meals",
        body: "Schedule snacks rather than grazing all day. Pair a fruit or vegetable with a protein, such as apple with cheese or carrots with hummus, so they arrive at dinner hungry but not starving.",
      },
    ],
    callUs: [
      "Weight loss, or a child dropping across lines on the growth chart",
      "Choking, gagging or coughing with most meals",
      "A very short list of accepted foods that keeps shrinking",
      "Signs of an eating disorder in an older child or teenager",
    ],
    articleSlug: "picky-eating",
  },
  {
    id: "skin-injuries",
    title: "Cuts, burns, bumps and sun",
    intro:
      "Most everyday injuries can be handled at home with good first aid. Knowing which ones need stitches or an X ray saves time and worry.",
    tips: [
      {
        title: "Cuts: pressure, then clean",
        body: "Press firmly with a clean cloth for ten minutes without peeking. Then rinse well with running water and cover with a bandage. A cut that gapes open, is deep, or is on the face should be seen the same day, ideally within a few hours.",
      },
      {
        title: "Burns: cool water, for longer than you think",
        body: "Hold a burn under cool running water for 20 minutes. Do not use ice, butter or ointments. Burns larger than your child's palm, or any burn on the face, hands, feet or genitals, need to be seen.",
      },
      {
        title: "Bumps to the head",
        body: "A goose egg after a fall is common and usually harmless. Watch your child closely for the next 24 hours. They can sleep, but should be easy to wake and act like themselves.",
      },
      {
        title: "Sun protection every day",
        body: "Use a broad spectrum sunscreen of SPF 30 or higher on children over six months, and reapply every two hours and after swimming. Keep babies under six months in the shade with hats and light clothing.",
      },
    ],
    callUs: [
      "A cut that might need stitches, or one with dirt or glass you cannot remove",
      "Redness, warmth, swelling or pus around a wound a day or two later",
      "A burn that blisters and is larger than a coin, or any burn on a baby",
      "A limb your child will not use or put weight on after a fall",
      "A rash with fever, or a rash that does not fade when you press a glass against it (go to the ER)",
    ],
  },
  {
    id: "medicine-safety",
    title: "Medicine safety",
    intro:
      "Most medicine mistakes at home come from measuring, doubling up or storage. A few habits prevent nearly all of them.",
    tips: [
      {
        title: "Dose by weight with the right tool",
        body: "Use the syringe or cup that comes with the medicine, never a kitchen spoon. Children's doses depend on weight, so ask us for a dosing chart and keep your child's current weight handy.",
      },
      {
        title: "Check for doubled ingredients",
        body: "Many combination cold and flu products already contain acetaminophen. Giving them alongside plain acetaminophen can lead to an accidental overdose. Read the active ingredients on every label.",
      },
      {
        title: "Finish antibiotics as prescribed",
        body: "Give the full course even when your child feels better after a couple of days. Do not save leftovers or share them. Antibiotics do not treat colds or most coughs.",
      },
      {
        title: "Lock it up, up and away",
        body: "Store all medicines, vitamins and supplements up high and out of sight, ideally locked. Keep purses and visitors' bags off the floor. Save the Poison Control number in your phone: 1-800-222-1222.",
      },
    ],
    callUs: [
      "You are unsure of the right dose for your child's weight",
      "A new rash, swelling or vomiting after starting a medicine",
      "A missed or doubled dose of a prescription medicine",
      "Any swallowed medicine that was not meant for your child (call Poison Control first)",
    ],
  },
  {
    id: "allergies-asthma",
    title: "Allergies and asthma",
    intro:
      "Allergies and asthma are very manageable with a plan. The goal is a child who sleeps, plays and runs like everyone else.",
    tips: [
      {
        title: "Keep the action plan where people can see it",
        body: "A written asthma action plan tells you, the school and caregivers what to do on green, yellow and red days. Share a copy with every adult who looks after your child.",
      },
      {
        title: "Use a spacer with the inhaler",
        body: "A spacer gets much more medicine into the lungs than an inhaler alone, at every age. Bring the inhaler and spacer to visits so we can check the technique.",
      },
      {
        title: "Two epinephrine injectors, always together",
        body: "If your child has a prescribed epinephrine auto injector, keep two with them at all times and check the expiry dates. Use it first in a serious reaction, then call 911.",
      },
      {
        title: "Know the triggers",
        body: "Common triggers include colds, smoke, dust mites, pollen, pets and cold air. Keep the home smoke free, wash bedding in hot water weekly, and plan ahead for pollen season.",
      },
    ],
    callUs: [
      "Needing the rescue inhaler more than twice a week",
      "Waking at night with cough or wheeze",
      "Any use of the epinephrine auto injector, after calling 911",
      "A new food reaction, even a mild one, so we can plan testing",
    ],
    articleSlug: "asthma-action-plan",
  },
  {
    id: "prevention",
    title: "Checkups and vaccines",
    intro:
      "Prevention is the least dramatic and most effective care we give. Most of it happens at visits nobody feels urgent about.",
    tips: [
      {
        title: "Book the well visit every year",
        body: "Well visits are where growth, development, vision, hearing and emotional health are checked over time. Anchoring them to a birthday month makes them easy to remember.",
      },
      {
        title: "A flu shot for everyone over six months",
        body: "Annual flu vaccination protects your child and the babies and grandparents around them. Early fall is the best time, but it is still worth getting later in the season.",
      },
      {
        title: "Keep your own copy of the records",
        body: "Ask for a printed or digital copy of your child's immunization record. Schools, camps and sports teams will ask for it, usually at short notice.",
      },
      {
        title: "Bring your questions in writing",
        body: "Keep a running list in your phone between visits. Concerns about behaviour, sleep, school or mood are exactly what well visits are for.",
      },
    ],
    callUs: [
      "Your child is behind on vaccines and you want a catch up plan",
      "You need school, camp or sports forms completed",
      "You have concerns about development, speech or learning",
      "It has been more than a year since the last checkup",
    ],
    articleSlug: "10-essential-habits",
  },
];
