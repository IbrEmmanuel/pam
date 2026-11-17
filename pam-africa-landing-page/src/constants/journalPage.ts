export type Article = {
  slug?: string;
  title: string;
  category: string;
  date: string;
  cover: string;
  excerpt: string;
  body: string;
  subtext?: string;
  gallery?: string[];
};

// basic, URL-safe slug generator
export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const journalArticles: Article[] = [
  {
    slug: "pam-day",
    title: "PAM DAY",
    category: "Event",
    date: "January 25, 2025",
    cover: "/journals/teamwide.png",
    excerpt:
      "PAM hosted the PAM day 2024, an in-house gathering that brings together staff, partners, and stakeholders to celebrate milestones, share knowledge, and align on future goals.",

    body: `The event served as a platform for knowledge sharing, team building, and showcasing PAM’s groundbreaking innovations in energy and technology. It included panel discussions, exhibitions, and interactive sessions designed to highlight progress and future projects.

    `,
    subtext: `During the day, The PAM team presented updates on flagship projects including the Net-zero village, So-cool, e.t.c. The event also provided an opportunity to strengthen partnerships and share experiences across different project teams. 
One of the Key takeaways from PAM Day 2024 was the reinforcement of the importance of collaboration, innovation, and celebrating progress as one team driving energy access and sustainability in Africa.`,
    gallery: ["/journals/talk1.png", "/journals/talk2.png"],
  },
  {
    slug: "pam-redefines-energy-for-nigerian-newspaper",
    title: "PAM redefines Energy for Nigerian Newspaper",
    category: "Energy",
    date: "January 20, 2025",
    cover: "/journals/redefined.png",
    excerpt:
      "At PAM , we are proud to support leading Nigerian newspapers in their journey toward cleaner, more reliable energy. Our most recent milestone is the successful completion of a 140KW solar energy system for Punch Newspapers.",
    body: `This system displaces 1.2 million liters of diesel annually, delivering significant cost savings and reducing environmental impact. At its core is our locally developed Novel PAMBAM lithium-ion battery system, designed in Nigeria to enhance efficiency and storage capacity. With this innovation, Punch.ng is now on the brink of Net Zero operations.
`,
    subtext:
      "Our commitment extends beyond Punch. By working with major media houses like Punch and New Telegraph, PAM is helping reshape how Nigerian newsrooms are powered, proving that sustainability and innovation can go hand in hand.",
  },
  {
    slug: "africa-energy-indaba-2025",
    title: "Africa Energy Indaba 2025",
    category: "Events",
    date: "January 24, 2025",
    cover: "/journals/Jounral-wide_new.png",
    excerpt:
      "PAM participated in the Africa Energy Indaba 2025 in Cape Town, one of Africa’s most influential energy conferences bringing together policymakers, investors, innovators, and industry leaders. The gathering served as a platform to exchange ideas and solutions around Africa’s energy transition, sustainability, and economic growth.",
    body: `
 At the event, PAM showcased its flagship initiatives including the Net-Zero Village, So-Cool, and Solar Battery Hub highlighting how innovation and affordability can expand access to clean, reliable energy. Through these projects, PAM demonstrated its ability to merge technology with social impact, supporting livelihoods while reducing emissions.
    `,
    subtext: `Participation at AEI 2025 reinforced PAM’s position as a trusted thought leader in Africa’s energy landscape. By engaging in critical conversations and presenting real-world solutions, PAM strengthened its role in shaping the future of energy across the continent.`,
    gallery: ["/journals/africaenergy2.png"],
  },
  {
    slug: "women-leading-energy-transition",
    title: "How women are leading the energy transition in PAM",
    category: "Projects",
    date: "January 25, 2025",
    cover: "/journals/teamwork.png",
    excerpt:
      "At PAM, women are not only participants in the energy transition, they are at the forefront of it. Across leadership, operations, and business development, women are shaping the future of clean energy in PAM by driving bold projects and ensuring that communities are equipped with sustainable solutions.",
    body: `
Take So-Cool, PAM’s revolutionary energy-and-cooling product, is a powerful example. With a woman at the helm as CEO (Mrs. Blessing Etoh), So-Cool is proving that women can lead breakthrough innovations that reduce waste, power small businesses, and transform rural livelihoods.

    `,
    subtext: `At PAM, women are driving change from the inside out. The Chief Operating Officer brings vision and execution together, guiding projects such as the Net-Zero Village and Solar Battery Hub from the drawing board to reality. Thanks to her leadership, PAM’s innovations reach communities where they create lasting impact.
The business development team largely composed of women drives partnerships, funding, and community engagement. By working closely with market women, SMEs, and government stakeholders, they ensure that PAM’s innovations respond directly to the needs of those they serve. This representation not only brings equity into the boardroom but also makes PAM’s solutions more human-centered and sustainable.
At PAM, women’s leadership is more than representation, it is proof that empowering  women in the energy sector accelerates the clean energy transition. Their voices, decisions, and innovations are shaping Africa’s energy future today.`,
  },
];

// normalized, guaranteed-slug list
export const articles: Article[] = journalArticles.map((a) => ({
  ...a,
  slug: a.slug && a.slug.length ? a.slug : toSlug(a.title),
}));

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getCategories() {
  return Array.from(new Set(articles.map((a) => a.category)));
}

// optional: “category slugs” for clean URLs like /articles/category/people
export function categoryToSlug(cat: string) {
  return toSlug(cat);
}
export function getArticlesByCategorySlug(catSlug: string) {
  return articles.filter((a) => categoryToSlug(a.category) === catSlug);
}
