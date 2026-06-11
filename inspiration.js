const KEY_TERMS = [
  "Reveal-and-React",
  "reveal-and-react",
  "Inhibitory Control",
  "inhibitory control",
  "Microworlds",
  "microworlds",
];

function boldTerms(text) {
  let result = text;
  for (const term of KEY_TERMS) {
    const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "g");
    result = result.replace(re, '<strong class="font-semibold text-slate-900">$1</strong>');
  }
  return result;
}

function paragraph(text) {
  return `<p class="text-slate-600 leading-relaxed">${boldTerms(text)}</p>`;
}

function labelRow(label, content) {
  return `
    <div class="space-y-1.5">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-indigo-600">${label}</h4>
      <p class="text-slate-600 leading-relaxed">${boldTerms(content)}</p>
    </div>
  `;
}

function examplesList(games) {
  return `
    <ul class="mt-2 flex flex-wrap gap-2">
      ${games.map((g) => `<li class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">${g}</li>`).join("")}
    </ul>
  `;
}

const PEDAGOGY_SECTIONS = [
  {
    number: 1,
    title: "Self-Regulation",
    mechanic:
      '"Reveal-and-React" (Immediate responses to unpredictable stimuli, simultaneous rules, fast visual search) (Charifa & Apriliani, 2025).',
    impact:
      'These fast-paced mechanics mimic neurological cognitive training paradigms like "go/no-go" tasks (Charifa & Apriliani, 2025). They actively condition the brain by challenging inhibitory control (the ability to suppress an automatic, impulsive urge to act incorrectly), boosting working memory updating, and demanding high cognitive flexibility under time pressure (Charifa & Apriliani, 2025).',
    examples: ["Ghost Blitz", "Dobble (Spot It!)", "Speed Cups", "Bee Alert", "Set"],
    citation: "Charifa & Apriliani, 2025",
  },
  {
    number: 2,
    title: "Creativity & Metaphorical Thinking",
    mechanic:
      "Abstract stimuli interpretation, collaborative storytelling, and creative constraint practices (Bayeck, 2020).",
    impact:
      'Fosters lateral thinking, imagination, and out-of-the-box conceptualization (Gonzalo-Iglesia et al., 2018). By engaging in narrative building and associating random concepts without the paralyzing pressure of a single "correct" answer, players dramatically expand their imaginative capacity and emotional engagement (Bayeck, 2020; Gonzalo-Iglesia et al., 2018).',
    examples: ["Dixit", "Warhammer 40,000"],
    citation: "Bayeck, 2020; Gonzalo-Iglesia et al., 2018",
  },
  {
    number: 3,
    title: "Civic Responsibility & Systems Thinking",
    mechanic:
      "Built-in social dilemmas, systemic simulation loops, and tangible tracking components (e.g., physical emission markers or train miniatures) (Fjællingsdal & Klöckner, 2020).",
    impact:
      "Transforms overwhelming global crises into highly visible, micro-level realities (Fjællingsdal & Klöckner, 2020). Tangible tracking components force immediate personal accountability by physically visualizing an individual's direct ecological footprint (Fjællingsdal & Klöckner, 2020). Furthermore, social dilemma mechanics require perspective-shifting; players must balance zero-sum personal financial gains against the collective survival of the common good, naturally building empathy and environmental consciousness (Fjællingsdal & Klöckner, 2020; Tsai et al., 2021).",
    examples: [
      "The Settlers of Catan: Oil Springs",
      "Keep Cool",
      "Global Warming",
      "Evolution: Climate",
      "Be Blessed Taiwan",
    ],
    citation: "Fjællingsdal & Klöckner, 2020; Tsai et al., 2021",
  },
  {
    number: 4,
    title: "Critical Thinking & Decision Processing",
    mechanic:
      'Strategic resource management, "what-if" trial-and-error simulation, and multi-role mechanics (Radzi et al., 2020).',
    impact:
      "Sharpens structured thinking by forcing players to critically filter incoming data, weigh the pros and cons of multiple alternatives, and make highly meaningful choices (Radzi et al., 2020). The continuous, rapid feedback loop of the changing game state systematically encourages dynamic strategic adjustment, logical reasoning, and complex conceptualization (Radzi et al., 2020; Tsai et al., 2021).",
    examples: ["5-ST☆R: The Hotel Management Game", "Element Enterprise Tycoon"],
    citation: "Radzi et al., 2020; Tsai et al., 2021",
  },
  {
    number: 5,
    title: "Collaboration & Active Dialogue",
    mechanic:
      "Purely cooperative rulesets, shared win/lose goals, and inter-group negotiation rules (Eriksson et al., 2021; Radzi et al., 2020).",
    impact:
      "Cultivates collective problem-solving, active verbal communication, and peer-to-peer tutoring (Radzi et al., 2020). It directly trains frustration tolerance and active social interaction by requiring players to pool asymmetric resources or role-specific abilities to overcome a unified, systemic threat (Radzi et al., 2020).",
    examples: ["Pandemic", "Parkopolis", "5-ST☆R: The Hotel Management Game"],
    citation: "Eriksson et al., 2021; Radzi et al., 2020",
  },
];

const INSPIRATION_REFERENCES = [
  "21st Century Skills and Competences for New Millennium Learners in OECD Countries. Vol. 41, OECD Education Working Papers no. 41, 18 Dec. 2009. OECD Education Working Papers. DOI.org (Crossref), https://doi.org/10.1787/218525261154.",
  "Amaro, Salvatore, et al. “Kalèdo, a New Educational Board-Game, Gives Nutritional Rudiments and Encourages Healthy Eating in Children: A Pilot Cluster Randomized Trial.” European Journal of Pediatrics, vol. 165, no. 9, Sept. 2006, pp. 630–35. DOI.org (Crossref), https://doi.org/10.1007/s00431-006-0153-9.",
  "Ashraf, Tayyaba. “Analysis of Social Responsibility Skills with Reference to Life Skills in Secondary School Curriculum.” Pakistan Social Sciences Review, vol. 5, no. IV, Dec. 2021, pp. 368–81. DOI.org (Crossref), https://doi.org/10.35484/pssr.2021(5-IV)29.",
  "Bartfay, Wally J., and Emma Bartfay. “Promoting Health in Schools through a Board Game.” Western Journal of Nursing Research, vol. 16, no. 4, Aug. 1994, pp. 438–46. DOI.org (Crossref), https://doi.org/10.1177/019394599401600408.",
  "Barton, Erin E., et al. “An Empirical Examination of Effective Practices for Teaching Board Game Play to Young Children.” Journal of Positive Behavior Interventions, vol. 20, no. 3, July 2018, pp. 138–48. DOI.org (Crossref), https://doi.org/10.1177/1098300717753833.",
  "Bayeck, Rebecca Yvonne. “Examining Board Gameplay and Learning: A Multidisciplinary Review of Recent Research.” Simulation & Gaming, vol. 51, no. 4, Aug. 2020, pp. 411–31. DOI.org (Crossref), https://doi.org/10.1177/1046878119901286.",
  "Brunscheen-Cartagena, Elizabeth, and K.-State Research. Bonding Thru Board Games: Developing Soft Skills.",
  "Charifa, Prisyafandiafif, and Ima Apriliani. “Playing to Focus: A Systematic Review of Reveal-and-React Board and Card Games for Executive Function Development in Children.” Bulletin of Counseling and Psychotherapy, vol. 7, no. 2, July 2025. DOI.org (Crossref), https://doi.org/10.51214/002025071524000.",
  "Chen, Fong-Han, and Shin-Jia Ho. “Designing a Board Game about the United Nations’ Sustainable Development Goals.” Sustainability, vol. 14, no. 18, Sept. 2022, p. 11197. DOI.org (Crossref), https://doi.org/10.3390/su141811197.",
  "Crosta, Lucilla, et al. “21st Century Skills Development among Young Graduates: A European Perspective.” GiLE Journal of Skills Development, vol. 3, no. 1, Apr. 2023, pp. 40–56. DOI.org (Crossref), https://doi.org/10.52398/gjsd.2023.v3.i1.pp40-56.",
  "De Blas-Zapata, Ana, et al. “Emerging Cardiovascular Risk Factors in Childhood and Adolescence: A Narrative Review.” European Journal of Pediatrics, vol. 184, no. 5, Apr. 2025, p. 298. DOI.org (Crossref), https://doi.org/10.1007/s00431-025-06102-y.",
  "Eriksson, Malin, et al. “The Behavioral Effects of Cooperative and Competitive Board Games in Preschoolers.” Scandinavian Journal of Psychology, vol. 62, no. 3, June 2021, pp. 355–64. DOI.org (Crossref), https://doi.org/10.1111/sjop.12708.",
  "Fjællingsdal, Kristoffer S., and Christian A. Klöckner. “Green Across the Board: Board Games as Tools for Dialogue and Simplified Environmental Communication.” Simulation & Gaming, vol. 51, no. 5, Oct. 2020, pp. 632–52. DOI.org (Crossref), https://doi.org/10.1177/1046878120925133.",
  "González-Pérez, Laura Icela, and María Soledad Ramírez-Montoya. “Components of Education 4.0 in 21st Century Skills Frameworks: Systematic Review.” Sustainability, vol. 14, no. 3, Jan. 2022, p. 1493. DOI.org (Crossref), https://doi.org/10.3390/su14031493.",
  "González-Salamanca, Juan Carlos, et al. “Key Competences, Education for Sustainable Development and Strategies for the Development of 21st Century Skills. A Systematic Literature Review.” Sustainability, vol. 12, no. 24, Dec. 2020, p. 10366. DOI.org (Crossref), https://doi.org/10.3390/su122410366.",
  "Gonzalo-Iglesia, Juan Luis, et al. “Noneducational Board Games in University Education. Perceptions of Students Experiencing Game-Based Learning Methodologies.” Revista Lusófona de Educação, Nov. 2018, p. Vol. 41 No. 41 (2018): REVISTA LUSÓFONA DE EDUCAÇÃO. DOI.org (Datacite), https://doi.org/10.24140/ISSN.1645-7250.RLE41.03.",
  "Heckman, James J., and Tim Kautz. “Hard Evidence on Soft Skills.” Labour Economics, vol. 19, no. 4, Aug. 2012, pp. 451–64. DOI.org (Crossref), https://doi.org/10.1016/j.labeco.2012.05.014.",
  "McLennan, Marsh, and SK Group. The Global Risks Report 2021 16th Edition.",
  "Noda, Shota, et al. “The Effectiveness of Intervention with Board Games: A Systematic Review.” BioPsychoSocial Medicine, vol. 13, no. 1, Dec. 2019, p. 22. DOI.org (Crossref), https://doi.org/10.1186/s13030-019-0164-1.",
  "OECD. Skills That Matter for Success and Well-Being in Adulthood: Evidence on Adults’ Social and Emotional Skills from the 2023 Survey of Adult Skills. OECD Publishing, 2025. OECD Skills Studies. DOI.org (Crossref), https://doi.org/10.1787/6e318286-en.",
  "Othman, Mohd Kamal, et al. “A Systematic Review of Paper‐based and Digital Board Games for Collaborative Science Learning.” Review of Education, vol. 13, no. 3, Dec. 2025, p. e70107. DOI.org (Crossref), https://doi.org/10.1002/rev3.70107.",
  "Sousa, Carla, et al. “Playing at the School Table: Systematic Literature Review of Board, Tabletop, and Other Analog Game-Based Learning Approaches.” Frontiers in Psychology, vol. 14, June 2023, p. 1160591. DOI.org (Crossref), https://doi.org/10.3389/fpsyg.2023.1160591.",
  "Tsai, Jen-Che, et al. “Using a Board Game to Teach about Sustainable Development.” Sustainability, vol. 13, no. 9, Apr. 2021, p. 4942. DOI.org (Crossref), https://doi.org/10.3390/su13094942.",
];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkifyReference(text) {
  return escapeHtml(text).replace(
    /(https?:\/\/[^\s,&]+)/g,
    '<a href="$1" class="inspiration-references__link" target="_blank" rel="noopener noreferrer">$1</a>'
  );
}

function renderReferencesSection() {
  const items = INSPIRATION_REFERENCES.map(
    (ref) => `<li class="inspiration-references__item">${linkifyReference(ref)}</li>`
  ).join("");

  return `
    <details class="inspiration-references">
      <summary class="inspiration-references__summary">
        <span class="inspiration-references__title">References</span>
        <span class="inspiration-references__count">${INSPIRATION_REFERENCES.length} sources</span>
      </summary>
      <ol class="inspiration-references__list">
        ${items}
      </ol>
    </details>
  `;
}

const DIVERSE_LEARNERS = [
  {
    title: "Early Childhood & Preschool Development",
    body: "Interestingly, research shows that the explicit framework of a board game—whether purely cooperative or highly competitive—does not inherently change baseline prosocial or antisocial behavior in preschoolers (Eriksson et al., 2021). Both game styles elicit equal amounts of cooperative and prosocial interactions, proving that tabletop games as a medium broadly benefit early childhood social behaviors (Eriksson et al., 2021). However, preschoolers explicitly report higher levels of enjoyment when playing cooperative games, making them an excellent choice for baseline engagement (Eriksson et al., 2021).",
  },
  {
    title: "Supporting Neurodiversity (ADHD)",
    body: 'Tabletop games provide exceptional, targeted interventions for neurodiverse students. Children diagnosed with ADHD who regularly played "reveal-and-react" games (such as Ghost Blitz and Dobble) demonstrated significant, measurable acute improvements in short-term verbal memory and exhibited substantially greater control over impulsive cognitive responses compared to their control-group peers (Charifa & Apriliani, 2025).',
  },
  {
    title: "Special Needs & Universal Social Inclusion",
    body: "Board games create an unparalleled level playing field that actively supports true social inclusion (Bayeck, 2020). Playing face-to-face tabletop games helps children with or at risk for developmental disabilities acquire nuanced social skills—such as cultivating a healthy tolerance for losing and taking other players' viewpoints into account—in a completely organic, inclusive environment alongside their typically developing peers (Bayeck, 2020).",
  },
];

function renderPedagogyCard(section) {
  return `
    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-display text-lg font-bold text-indigo-700" aria-hidden="true">${section.number}</span>
        <div class="min-w-0 flex-1 space-y-5">
          <div>
            <h3 class="font-display text-xl font-bold text-slate-900 md:text-2xl">${section.title}</h3>
            <span class="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">Psychological Outcome</span>
          </div>
          ${labelRow("Game Mechanic / Trait", section.mechanic)}
          ${labelRow("Psychological & Behavioral Impact", section.impact)}
          <div class="space-y-1.5">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-indigo-600">Classroom Examples</h4>
            ${examplesList(section.examples)}
            <p class="mt-2 text-xs text-slate-400">(${section.citation})</p>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderInspiration(container) {
  container.innerHTML = `
    <div class="inspiration-page mx-auto max-w-4xl px-6 pb-4 pt-10 md:pt-14">
      <header class="mb-12 text-center md:mb-16">
        <span class="mb-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700">Research & Pedagogy</span>
        <h1 class="font-display text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">Inspiration</h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-slate-500">Evidence-based insights for K–12 educators bridging play, psychology, and classroom outcomes.</p>
      </header>

      <article class="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <h2 class="font-display text-2xl font-bold text-slate-900 md:text-3xl">Why Board Games? The Science of the Scaffold</h2>

        <section class="mt-8 space-y-4">
          <h3 class="border-l-4 border-indigo-500 pl-4 font-display text-lg font-semibold text-slate-800 md:text-xl">The Dual Crises: Behavioral Gaps & Passive Classrooms</h3>
          ${paragraph("We are currently facing two critical societal bottlenecks. First, while public awareness of global threats like climate change is at an all-time high, there remains a massive gap between what people believe and how they actually behave (Fjællingsdal & Klöckner, 2020). Traditional environmental communication is often perceived as too complex, distant, or abstract, creating a barrier to real-world pro-environmental action (Fjællingsdal & Klöckner, 2020).")}
          ${paragraph("Second, there is a global crisis in education regarding workforce readiness and soft skills (Radzi et al., 2020). Core human competencies—such as structured problem-solving, communication, self-regulation, and creativity—are the foundational building blocks of a successful society (Radzi et al., 2020). Yet, traditional module-guided, lecture-based learning environments often relegate students to passive roles, failing to effectively train these vital behavioral habits (Radzi et al., 2020).")}
        </section>

        <section class="mt-8 space-y-4">
          <h3 class="border-l-4 border-indigo-500 pl-4 font-display text-lg font-semibold text-slate-800 md:text-xl">The Solution: Games as Cognitive "Microworlds"</h3>
          ${paragraph('Board games offer a brilliant, scientifically sound intervention. They act as engaging "microworlds" that simplify complex global systems and actively train human behavioral skills within a safe, non-threatening environment (Fjællingsdal & Klöckner, 2020; Radzi et al., 2020). By shifting a student\'s role from a passive listener to an active decision-maker, we can bridge the gap between abstract knowledge and concrete behavioral changes. This platform is built to help educators find the exact game mechanics needed to foster these changes in their classrooms.')}
        </section>
      </article>

      <article class="mb-10">
        <header class="mb-8">
          <h2 class="font-display text-2xl font-bold text-slate-900 md:text-3xl">The Pedagogy of Play</h2>
          <p class="mt-2 text-slate-500">Mapping Mechanics to Psychological Outcomes</p>
        </header>
        <div class="space-y-6">
          ${PEDAGOGY_SECTIONS.map(renderPedagogyCard).join("")}
        </div>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 shadow-sm md:p-10">
        <header class="mb-8">
          <h2 class="font-display text-2xl font-bold text-slate-900 md:text-3xl">Deep Insights</h2>
          <p class="mt-2 text-slate-500">Tailoring Play to Diverse Learners</p>
        </header>
        <div class="space-y-8">
          ${DIVERSE_LEARNERS.map(
            (item) => `
            <section class="rounded-xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-sm md:p-6">
              <h3 class="font-display text-lg font-semibold text-indigo-800 md:text-xl">${item.title}</h3>
              <div class="mt-3">${paragraph(item.body)}</div>
            </section>
          `
          ).join("")}
        </div>
      </article>

      ${renderReferencesSection()}
    </div>
  `;
}
