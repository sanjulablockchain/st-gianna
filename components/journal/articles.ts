export type ArticleBlock = {
  heading: string;
  paragraphs: string[];
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  standfirst: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  /** Shown as a summary panel at the top of the article. */
  keyPoints: string[];
  body: ArticleBlock[];
  featured?: boolean;
};

export const CATEGORIES = [
  "All",
  "Preventive care",
  "Parenting",
  "Nutrition",
  "Seasonal",
  "Chronic care",
  "Clinic news",
];

export const ARTICLES: Article[] = [
  {
    slug: "10-essential-habits",
    title: "10 essential habits for a healthier family year",
    excerpt:
      "Preventive care, sleep, screen time, and nutrition. What our pediatricians actually recommend, and what we quietly ignore.",
    standfirst:
      "Preventive care, sleep, screen time, and nutrition. What our pediatricians actually recommend, and what we quietly ignore.",
    category: "Preventive care",
    readTime: "5 min read",
    date: "24 August 2026",
    image: "/images/journal-featured.jpg",
    featured: true,
    keyPoints: [
      "Book the well visit at the same point every year so it stops competing with everything else",
      "A consistent wake time fixes more than a new bedtime does",
      "What a screen displaces matters more than how long it is on",
      "Make the easy food the reasonable food, rather than relying on willpower",
      "Trust how your child looks and behaves over the number on the thermometer",
    ],
    body: [
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
    ],
  },
  {
    slug: "reading-a-growth-chart",
    title: "How to read a growth chart without panicking",
    excerpt:
      "Percentiles are a position, not a grade. What the curve is doing over time matters far more than the number on any single visit.",
    standfirst:
      "Percentiles are a position, not a grade. Here is what we are actually looking at when we plot your child, and the handful of patterns that genuinely prompt a conversation.",
    category: "Preventive care",
    readTime: "6 min read",
    date: "18 August 2026",
    image: "/images/photo-pediatric-checkup.jpg",
    keyPoints: [
      "A percentile is a ranking against other children, not a score to improve",
      "The shape of the curve over time matters far more than any single point",
      "The 5th percentile is not a problem if your child has always been there",
      "Crossing several percentile bands in either direction is worth a look",
      "Weight and height are read together, not separately",
    ],
    body: [
      {
        heading: "What a percentile actually means",
        paragraphs: [
          "If your child is on the 40th percentile for height, it means that out of a hundred children the same age and sex, roughly forty would be shorter and sixty taller. That is the whole claim. It is a position in a distribution, not a grade, and it is not a target.",
          "Somebody has to be on the 10th percentile. Somebody has to be on the 90th. Both can be entirely healthy children who are growing exactly as they should.",
        ],
      },
      {
        heading: "The curve matters more than the point",
        paragraphs: [
          "What we are really reading is the shape over time. A child who has tracked steadily along the 25th percentile since birth is doing precisely what we want, because they are following their own line.",
          "A single measurement tells us very little. This is one of the quieter reasons the annual visit matters: one point is a dot, but three or four points are a trajectory, and a trajectory is something we can actually interpret.",
        ],
      },
      {
        heading: "When crossing lines matters",
        paragraphs: [
          "Growth charts are printed with percentile bands, and drifting across them is what draws our attention. A child who falls from the 75th to the 25th over a couple of years, or climbs equally fast, is worth understanding rather than worrying about.",
          "Often there is an ordinary explanation: a growth spurt arriving early or late, a period of illness, a change in appetite, or simply catch-up growth after a small start. Sometimes it points at something worth testing for. Either way, the answer comes from looking, not from guessing at home.",
        ],
      },
      {
        heading: "Weight and height are read together",
        paragraphs: [
          "Neither number means much alone. A weight on the 90th percentile reads very differently for a child whose height is also on the 90th than for a child whose height is on the 20th.",
          "For children over two we also plot body mass index, which is a rough combination of the two. It is a screening tool, not a diagnosis, and we treat it as the start of a conversation rather than the end of one.",
        ],
      },
      {
        heading: "Head circumference, and why we measure it",
        paragraphs: [
          "For the first two or three years we also measure around the head at every visit. It grows fastest in the first year, and its curve is one of the more useful early signals we have about development.",
          "As with the others, we care about the pattern. A head that tracks its own line is reassuring even if that line sits high or low.",
        ],
      },
      {
        heading: "What to do with all this at home",
        paragraphs: [
          "Mostly, nothing. Growth charts are a clinical tool and they are easy to over-read. If your child eats reasonably, has energy, and is meeting milestones, the chart is almost always confirming that rather than contradicting it.",
          "Ask us to show you the curve at the next visit. Seeing your own child's line is far more reassuring than reading about percentiles in the abstract, and it takes about a minute.",
        ],
      },
    ],
  },
  {
    slug: "fever-without-fear",
    title: "Fever without fear: what the number does and does not tell you",
    excerpt:
      "How your child looks and behaves is a better guide than the thermometer. Here is what we actually assess, and the handful of situations that warrant a call today.",
    standfirst:
      "Parents are taught to fear a number. We assess a child. Here is the difference, and the short list of situations where the number really does change what we do.",
    category: "Preventive care",
    readTime: "5 min read",
    date: "11 August 2026",
    image: "/images/journal-4.jpg",
    keyPoints: [
      "Fever is the immune response working, not the illness itself",
      "How your child looks and behaves beats the reading on the thermometer",
      "Any fever in a baby under three months is a same-day call, no exceptions",
      "Treat discomfort, not the number",
      "Height of fever does not reliably predict how serious the cause is",
    ],
    body: [
      {
        heading: "Fever is a response, not a disease",
        paragraphs: [
          "Raising body temperature is one of the immune system's tools. It is unpleasant, and it makes children miserable, but the fever itself is rarely the thing doing harm. It is the sign that a response is under way.",
          "This is why we rarely chase a number down for its own sake. We are far more interested in what is causing it and in how the child is coping.",
        ],
      },
      {
        heading: "Look at the child, not the thermometer",
        paragraphs: [
          "A child at 39C who is drinking, complaining, and irritated by the thermometer is usually in better shape than a child at 38C who has gone quiet, floppy, and uninterested in anything.",
          "The questions we ask ourselves are simple. Are they drinking? Are they making wet nappies or going to the toilet? Do they respond and engage when you talk to them? Can they be roused easily? Those answers tell us more than any single reading.",
        ],
      },
      {
        heading: "The situations that change the plan",
        paragraphs: [
          "There is one hard rule: any fever in a baby under three months old is a same-day call, every time, even if the baby seems fine. Their immune systems and their ability to show us they are unwell are both still immature.",
          "Otherwise, call the same day for breathing that looks like effort, for signs of dehydration, for a fever lasting more than three days, for a rash that does not fade when pressed, for a stiff neck, or for a child who is much harder to wake than usual.",
        ],
      },
      {
        heading: "Treating discomfort rather than numbers",
        paragraphs: [
          "Paracetamol and ibuprofen are for comfort. If your child has a temperature of 38.5C and is playing happily, there is no obligation to medicate. If they are wretched at 38C, treating them is entirely reasonable.",
          "Dose by weight rather than age where you can, and write down what you gave and when. In the middle of a bad night that note is worth a great deal, especially if two adults are taking turns.",
        ],
      },
      {
        heading: "Febrile seizures, briefly",
        paragraphs: [
          "They are frightening to witness and much less dangerous than they look. They happen in a small minority of young children, usually as the temperature rises quickly, and most last under a few minutes.",
          "Keep the child safe on their side, do not put anything in their mouth, and time it. A first seizure always warrants being seen, and anything lasting more than five minutes is a 911 call.",
        ],
      },
    ],
  },
  {
    slug: "sleep-regressions",
    title: "Sleep regressions are developmental, not disciplinary",
    excerpt:
      "The four month, eight month, and eighteen month disruptions are your child's brain reorganising. Knowing that changes how you respond at 3am.",
    standfirst:
      "The classic disruptions arrive alongside developmental leaps, not bad habits. Understanding why changes what you do about it, and how guilty you feel doing it.",
    category: "Parenting",
    readTime: "7 min read",
    date: "4 August 2026",
    image: "/images/journal-2.jpg",
    keyPoints: [
      "Regressions cluster around developmental leaps, not around parenting mistakes",
      "The four month change is permanent maturation of sleep architecture, not a phase",
      "Most regressions settle within two to six weeks",
      "Consistency matters more than which method you choose",
      "Persistent snoring or pauses in breathing are worth a visit, not a sleep plan",
    ],
    body: [
      {
        heading: "Why they happen when they happen",
        paragraphs: [
          "The well-known disruptions cluster at around four months, eight to ten months, and eighteen months. Those windows line up with major developmental change: sleep architecture maturing, crawling and standing arriving, and language switching on.",
          "A brain that is busy consolidating a new skill wakes more easily and rehearses that skill at unhelpful hours. Parents who have changed nothing at all still get hit, which is the clearest evidence that this is development rather than discipline.",
        ],
      },
      {
        heading: "The four month change is not really a regression",
        paragraphs: [
          "At around four months, infant sleep permanently reorganises into cycles closer to the adult pattern, with lighter phases between deeper ones. A baby who used to sink into a long unbroken block now surfaces between cycles.",
          "That is a one-way change. The skill worth building here is not sleeping through, it is being able to resettle at the surfacing point. Everything else follows from that.",
        ],
      },
      {
        heading: "What actually helps",
        paragraphs: [
          "A short, boring, identical wind-down sequence does more work than any single technique. Children read sequence better than clocks, and the predictability itself is the signal.",
          "Whatever approach you choose, apply it consistently for a couple of weeks before judging it. Switching methods every third night teaches inconsistency, which is the one thing that reliably makes sleep worse.",
        ],
      },
      {
        heading: "How long to expect",
        paragraphs: [
          "Most regressions settle within two to six weeks. That is genuinely a long time when you are inside it at 3am, and it is worth saying plainly rather than pretending otherwise.",
          "Share the nights if there are two of you. Exhaustion makes everything harder to respond to calmly, and a rested adult handles a difficult night far better than two half-broken ones.",
        ],
      },
      {
        heading: "When it is not a regression",
        paragraphs: [
          "Some things masquerade as sleep problems. Reflux, a cow's milk protein allergy, eczema that flares at night, obstructive sleep apnoea, and iron deficiency can all wreck sleep and none of them respond to a sleep plan.",
          "Bring your child in if they snore most nights, if you see pauses in their breathing, if they are unusually sweaty asleep, or if the disruption has run well past six weeks with no sign of shifting.",
        ],
      },
    ],
  },
  {
    slug: "screens-and-schedules",
    title: "Screens, schedules, and the things worth protecting",
    excerpt:
      "Counting minutes is the wrong question. Protect sleep, movement, and one device-free meal, and the rest mostly sorts itself out.",
    standfirst:
      "The evidence on screen time is far less alarming than the headlines. What matters is displacement: what the screen is taking the place of.",
    category: "Parenting",
    readTime: "6 min read",
    date: "28 July 2026",
    image: "/images/journal-3.jpg",
    keyPoints: [
      "Displacement matters more than duration",
      "Protect sleep, daily movement, and one device-free meal",
      "Content and company change the value of the same hour",
      "Screens within an hour of bed are the most reliably harmful use",
      "Rules you can actually hold beat ideal rules you abandon",
    ],
    body: [
      {
        heading: "Why the minute count is the wrong metric",
        paragraphs: [
          "Two hours of video calls with grandparents and two hours of autoplay before bed are not the same exposure, and no minute counter can tell them apart. The number on a screen-time report is one of the least informative pieces of data a parent can have.",
          "The useful question is what the screen replaced. If it replaced staring out of a car window, very little was lost. If it replaced sleep, exercise, or talking to another human being, something real was.",
        ],
      },
      {
        heading: "The three things worth defending",
        paragraphs: [
          "Sleep first. Screens in the hour before bed delay sleep onset both through light and, more powerfully, through content that is designed not to let you stop.",
          "Then daily physical movement, and then at least one meal a day where nobody at the table is holding a device. Defend those three and the remaining hours mostly take care of themselves.",
        ],
      },
      {
        heading: "Content and company",
        paragraphs: [
          "A child watching something with an adult who occasionally talks about it is having a different experience from a child alone with an algorithm optimised for retention. Co-viewing turns passive consumption into something closer to conversation.",
          "For younger children in particular, video calls with people they love do not belong in the same category as entertainment, and it is reasonable not to count them at all.",
        ],
      },
      {
        heading: "Age brackets, held loosely",
        paragraphs: [
          "Under eighteen months, video calls aside, there is little benefit to screens. Between two and five, a modest amount of good-quality content watched together is fine. From school age onward the specific limit matters less than whether sleep, school, movement, and friendships are intact.",
          "If all four of those are healthy, the number is probably fine. If one is suffering, that is where to look, and the screen may or may not be the cause.",
        ],
      },
      {
        heading: "Making a rule that survives contact with a bad week",
        paragraphs: [
          "The best rule is the one you will still be enforcing during a hard week, when someone is ill or work is overwhelming. An ambitious rule abandoned after nine days teaches your child that rules dissolve under pressure.",
          "Pick one change. Charge devices outside bedrooms overnight is the single highest-yield rule most families can adopt, and it survives almost anything.",
        ],
      },
    ],
  },
  {
    slug: "picky-eating",
    title: "Picky eating is a phase you can shorten but not skip",
    excerpt:
      "Food neophobia peaks between two and six and it is entirely normal. What helps is repeated low-pressure exposure, not negotiation at the table.",
    standfirst:
      "Wariness of new food is a normal developmental stage with an evolutionary logic. It responds to patience and repetition, and it gets worse under pressure.",
    category: "Nutrition",
    readTime: "6 min read",
    date: "21 July 2026",
    image: "/images/journal-1.jpg",
    keyPoints: [
      "Food neophobia peaks between two and six and is developmentally normal",
      "It can take ten or more neutral exposures before a food is accepted",
      "Pressure, bribery and bargaining all reliably backfire",
      "You choose what is offered; your child chooses whether and how much",
      "Weight loss, a shrinking list of foods, or gagging warrant a visit",
    ],
    body: [
      {
        heading: "Why it happens at all",
        paragraphs: [
          "Wariness of unfamiliar food appears in most children around the time they become mobile enough to put things in their mouths unsupervised. It is a protective instinct, and it peaks between roughly two and six years old.",
          "Knowing it is a stage rather than a preference changes how you respond. You are waiting out a developmental window, not losing an argument.",
        ],
      },
      {
        heading: "Exposure, and how much of it",
        paragraphs: [
          "It commonly takes ten or more encounters with a new food before a young child accepts it, and an encounter counts even when nothing is eaten. Seeing it, touching it, and having it on the plate all count.",
          "This is why serving something once, meeting refusal, and never serving it again is the most common way families accidentally shrink the list of accepted foods.",
        ],
      },
      {
        heading: "Why pressure backfires",
        paragraphs: [
          "Bribery, bargaining, and dessert-conditional-on-vegetables all reliably work in the short term and reliably fail over months. They teach that the food is a cost to be paid rather than something worth eating.",
          "The more useful division is that you decide what is offered, when, and where. Your child decides whether to eat and how much. Holding that line removes most of the conflict from the table.",
        ],
      },
      {
        heading: "Practical things that help",
        paragraphs: [
          "Serve the new food alongside something reliably accepted, in a small quantity, with no commentary. Eat it yourself in front of them without making a performance of it.",
          "Involve them in preparing it where you can. Children who have washed, torn, or stirred something are meaningfully more likely to try it, and it costs nothing but mess.",
        ],
      },
      {
        heading: "When it is more than pickiness",
        paragraphs: [
          "Come and see us if your child is losing weight or falling off their growth curve, if their list of accepted foods is steadily shrinking rather than slowly growing, if they gag or choke regularly, or if mealtimes have become genuinely distressing for the whole household.",
          "Those patterns point at something other than a phase, including sensory difficulties, swallowing problems, or restrictive eating, and all of them respond much better to early help than to waiting.",
        ],
      },
    ],
  },
  {
    slug: "lunchboxes-that-get-eaten",
    title: "Building a lunchbox that comes home empty",
    excerpt:
      "Protein, something crunchy, something familiar, and one thing they genuinely like. The nutritional ideal that returns uneaten is worth nothing.",
    standfirst:
      "A lunchbox is judged on what gets eaten, not on what goes in. That single shift solves most of the problem.",
    category: "Nutrition",
    readTime: "4 min read",
    date: "14 July 2026",
    image: "/images/journal-7.jpg",
    keyPoints: [
      "Food that comes home uneaten has zero nutritional value, however good it was",
      "Aim for protein, something crunchy, something familiar, and something liked",
      "Lunch is short and social; children eat what is fast to eat",
      "Involve your child in packing to raise the odds it is eaten",
      "One reliable lunch on repeat is perfectly acceptable",
    ],
    body: [
      {
        heading: "The only measure that counts",
        paragraphs: [
          "A beautifully balanced lunch that returns home intact has fed nobody. It is worth being ruthless about this, because it reframes the whole exercise away from what you feel you ought to pack.",
          "Start from what your child actually eats and improve it incrementally. That produces better nutrition over a term than an ideal box that gets traded or binned.",
        ],
      },
      {
        heading: "A structure that works",
        paragraphs: [
          "Something with protein to carry them through the afternoon, something crunchy for texture, something familiar so the box is never intimidating, and one thing they genuinely enjoy.",
          "That last item is not a concession. A box with nothing enjoyable in it gets opened with less enthusiasm, and enthusiasm is most of what determines whether the rest is eaten.",
        ],
      },
      {
        heading: "Remember how short lunch actually is",
        paragraphs: [
          "School lunch is brief, loud, and socially interesting. Children want to get outside. Anything requiring effort, cutlery, or unwrapping is competing with their friends and will usually lose.",
          "Cut things up. Choose what can be eaten with one hand. Avoid anything that needs assembling at the table.",
        ],
      },
      {
        heading: "Let them pack it",
        paragraphs: [
          "Give a constrained choice: pick one from each of these groups. It takes a couple of extra minutes and dramatically raises the chance the box comes back empty, because the child has already committed to the contents.",
          "It also quietly teaches the structure of a balanced meal without anyone having to give a lecture about it.",
        ],
      },
      {
        heading: "On repetition",
        paragraphs: [
          "If your child wants the same lunch every day for a term, that is fine. Variety across a week matters more than variety within a day, and dinner is where you can widen the range.",
          "One dependable lunch that is always eaten is a solved problem, not a failure of imagination.",
        ],
      },
    ],
  },
  {
    slug: "flu-season-plan",
    title: "Your flu season plan, written in September",
    excerpt:
      "Vaccination timing, when to keep a child home, and how to stop one household infection becoming five.",
    standfirst:
      "Flu season is predictable, which means it can be planned for. Decisions made in September are far better than decisions made at 6am on a school day in January.",
    category: "Seasonal",
    readTime: "5 min read",
    date: "7 July 2026",
    image: "/images/service-immunizations.jpg",
    keyPoints: [
      "Vaccinate in early autumn, before the season builds",
      "Everyone from six months up should be vaccinated, every year",
      "Keep a child home until 24 hours fever-free without medication",
      "Decide your childcare fallback before you need it",
      "Antivirals only help if started within about 48 hours",
    ],
    body: [
      {
        heading: "Timing the vaccine",
        paragraphs: [
          "Early autumn is the sweet spot. It gives the immune response the couple of weeks it needs to develop before the season builds, without the protection fading before the season ends.",
          "If you miss that window, vaccinate anyway. A vaccine in December is far better than no vaccine, and flu seasons frequently run well into spring.",
        ],
      },
      {
        heading: "Who should have one",
        paragraphs: [
          "Everyone from six months of age upward, every year. Children under nine getting their first ever flu vaccine need two doses about four weeks apart, which is worth planning for.",
          "It matters most for children with asthma or other chronic conditions, and for anyone in the house who is around a baby too young to be vaccinated themselves. Vaccinating the adults is genuinely how you protect the newborn.",
        ],
      },
      {
        heading: "When to keep them home",
        paragraphs: [
          "The practical rule is 24 hours fever-free without paracetamol or ibuprofen doing the work. A child who is only comfortable because they were medicated an hour ago is still infectious and still miserable.",
          "That rule is often inconvenient and it is the single most effective thing you can do to stop the rest of the class, and then the rest of your household, getting it.",
        ],
      },
      {
        heading: "Stopping it spreading at home",
        paragraphs: [
          "Complete separation is unrealistic with children and not worth attempting. What does help is not sharing cups and towels, washing hands after contact, and keeping the unwell child out of the shared bed if you can manage it.",
          "Ventilation helps more than most people expect. Opening a window for a few minutes several times a day is easy and effective.",
        ],
      },
      {
        heading: "Antivirals, and the 48-hour window",
        paragraphs: [
          "Antiviral medication can shorten flu and reduce complications, but essentially only if started within roughly 48 hours of symptoms beginning. After that the benefit falls away sharply.",
          "That narrow window is exactly why we hold same-day slots. If your child has a sudden high fever with aches and exhaustion during flu season, call that day rather than waiting to see how it goes.",
        ],
      },
      {
        heading: "Have the plan before you need it",
        paragraphs: [
          "Decide now who can take a day off, where the thermometer lives, and whether you have working supplies of children's paracetamol and ibuprofen in date.",
          "Every one of those decisions is easier in September than at 6am on a school morning with a feverish child and a meeting you cannot move.",
        ],
      },
    ],
  },
  {
    slug: "asthma-action-plan",
    title: "What a good asthma action plan actually contains",
    excerpt:
      "Green, yellow, and red zones, written down, with doses. If your plan lives only in your memory, it is not a plan.",
    standfirst:
      "An asthma action plan is a written document that tells anyone caring for your child what to do as symptoms change. Most families we meet have a vague version in their head. That is not the same thing.",
    category: "Chronic care",
    readTime: "8 min read",
    date: "30 June 2026",
    image: "/images/journal-5.jpg",
    keyPoints: [
      "Written down, with doses, and copied to school and anyone else caring for your child",
      "Three zones: green for well, yellow for worsening, red for emergency",
      "Preventer daily even when completely well; reliever for symptoms",
      "Check inhaler technique at every visit, because it drifts",
      "Review after any emergency visit, and at least once a year",
    ],
    body: [
      {
        heading: "Why written down matters",
        paragraphs: [
          "The point of a plan is that it works when you are frightened, when it is the middle of the night, or when the person caring for your child is not you. Memory does not survive those conditions well.",
          "A plan that exists only in a parent's head cannot be handed to a grandparent, a school office, or a babysitter. Copies should live wherever your child does.",
        ],
      },
      {
        heading: "The green zone",
        paragraphs: [
          "Green means well: no cough at night, no wheeze, no breathlessness with normal play, and no need for the reliever inhaler beyond perhaps before exercise.",
          "The green zone still has instructions, and this is where most plans quietly fail. The preventer inhaler is taken every day in the green zone precisely because things are going well. It is what keeps them that way.",
        ],
      },
      {
        heading: "The yellow zone",
        paragraphs: [
          "Yellow means something is worsening: coughing at night, wheeze, needing the reliever more than usual, or struggling to keep up with activity that is normally easy.",
          "This zone should specify exactly what to do, with actual numbers: how many puffs of which inhaler, how often, and at what point to call us. Vague instructions to increase treatment are not usable at 2am.",
        ],
      },
      {
        heading: "The red zone",
        paragraphs: [
          "Red means emergency: severe breathlessness, difficulty speaking in full sentences, the reliever not working or not lasting, lips or face turning blue, or a child who is frightened and struggling.",
          "The red zone instruction is to give the reliever and call 911. It should say that explicitly, because in the moment nobody wants to be the one deciding whether it is bad enough.",
        ],
      },
      {
        heading: "Technique beats prescription",
        paragraphs: [
          "A significant share of poor asthma control is not the medication, it is how it is taken. Inhaler technique drifts over months, and most people are worse at it than they believe.",
          "Use a spacer with a metered dose inhaler, always, at every age. Bring the actual inhaler to appointments and demonstrate it. We would far rather spend three minutes watching than change a prescription that was never the problem.",
        ],
      },
      {
        heading: "Triggers, honestly assessed",
        paragraphs: [
          "Common triggers are viral infections, exercise, cold air, pollen, dust mite, animals, and smoke. Most children have several, and infections are by far the most common.",
          "Be realistic about which ones you can actually change. Rehoming a beloved pet is a serious ask that families often will not follow through on. Managing dust in one bedroom is achievable, and an achievable change beats an ideal one.",
        ],
      },
      {
        heading: "Reviewing it",
        paragraphs: [
          "Plans go stale. Doses change with growth, control changes with the seasons, and a plan written two years ago may no longer describe your child.",
          "Review at least annually, and always after any emergency department visit or course of oral steroids. Those events are the clearest possible signal that the current plan did not hold.",
        ],
      },
    ],
  },
  {
    slug: "one-chart-three-offices",
    title: "Why we put one chart across all three offices",
    excerpt:
      "The change took a year and was worth every week of it. What it means in practice when you walk into a location you have never visited.",
    standfirst:
      "Moving three offices onto a single shared record was the least glamorous project we have done and probably the most useful. Here is what actually changed.",
    category: "Clinic news",
    readTime: "4 min read",
    date: "23 June 2026",
    image: "/images/journal-6.jpg",
    keyPoints: [
      "Any of our clinicians sees your full history at any office",
      "Immunization records follow you, so school forms stop being a scavenger hunt",
      "Referrals leave with the chart attached",
      "Fewer repeated tests, because previous results are visible",
      "Access is logged, and limited to staff involved in your care",
    ],
    body: [
      {
        heading: "What it was like before",
        paragraphs: [
          "Each office kept its own records. If you usually came to Hollywood but needed a same-day appointment in Santa Monica, the clinician seeing you started from what you could remember and tell them.",
          "That is a bad way to practise medicine. It produces repeated tests, missed context, and a lot of parents patiently reciting their child's history to strangers.",
        ],
      },
      {
        heading: "What changed",
        paragraphs: [
          "There is now one record per patient, live at all three offices. Whichever door you walk through, the clinician sees the same history, the same allergy list, the same medications, and the notes from your last visit wherever it happened.",
          "In practice this means you can take the first available appointment across three locations instead of waiting for one, which is the single biggest reason we did it.",
        ],
      },
      {
        heading: "The parts we did not expect to matter as much",
        paragraphs: [
          "Immunization records turned out to be the thing families mention most. Schools, camps, and sports leagues all ask separately and always at short notice, and we can now produce a complete record immediately rather than assembling it from three places.",
          "Referrals improved too. When we send you to a therapist or specialist inside our partner network, the chart goes with the referral, so the first appointment is spent on your child rather than on history-taking.",
        ],
      },
      {
        heading: "Privacy, since it is a fair question",
        paragraphs: [
          "One shared record means more people can technically reach it, so access is limited to staff involved in your care and every access is logged.",
          "This is all governed by HIPAA and by our Notice of Privacy Practices, and none of it changed when the records merged. If you want to know who has looked at your record, you are entitled to ask and we will tell you.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export const FEATURED = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];
/** Everything the archive grid lists: the featured piece has its own block. */
export const ARCHIVE = ARTICLES.filter((a) => !a.featured);
