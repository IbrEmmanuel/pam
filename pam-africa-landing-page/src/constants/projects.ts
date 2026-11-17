export type Project = {
  slug: string;
  title: string;
  year: string | number;
  blurb?: string;
  cover: string; // list page image
  gallery: string[]; // detail page images
  info?: string; // long “Project info” text (markdown-friendly)
};

export const projects: Project[] = [
  {
    slug: "net-zero-villages",
    title: "Net Zero Villages",
    year: 2024,
    blurb: "NVZ1 - Net Zero Villages (Osun State, Nigeria)",
    cover: "/projects/solar-roof.png",
    gallery: [
      "/projects/netzero/1.png",
      "/projects/netzero/2.png",
      "/projects/netzero/3.png",
      "/projects/netzero/4.png",
      "/projects/netzero/5.png",
    ],
    info: `
**Overview**  
Net Zero Villages (NVZ) is a pilot for decentralized clean energy in rural communities. The program combines rooftop solar, small community hubs, and micro-utility operations to supply reliable power for homes and productive use (agriculture, health, education, and small trade). Power can also be shared with nearby households and businesses, extending impact within each community.

**Affordability Model**  
Flexible payment options include daily/weekly pay-as-you-go as well as lease-to-own and purchase paths, ensuring inclusivity.

**PAM’s Role**  
- **Feasibility** – Community assessments to understand needs, affordability, and technical requirements.  
- **Design** – Right-sizing rooftop systems and shared hubs for reliability and safety.  
- **Pilots** – Real-world deployments with user feedback loops to validate performance and UX.  
- **Venture Building** – Local operator training, after-sales support, and micro-utility processes.  

**Early Outcomes**  
Households cut energy spend, businesses extend working hours, and critical services gain reliable power. NVZ1 in Osun State provides the template for scale across additional villages.
`,
  },
  {
    slug: "solar-battery-hub-sbh",
    title: "Solar Battery Hub - SBH",
    year: 2024,
    blurb:
      "More than 90 million Nigerians still live without reliable electricity, relying on expensive and polluting generators to power their daily lives",
    cover: "/projects/projects2.png",
    gallery: [
      "/projects/solarbattery/1.png",
      "/projects/solarbattery/2.png",
      "/projects/solarbattery/3.png",
      "/projects/solarbattery/4.png",
      "/projects/solarbattery/5.png",
    ],
    info: `
**Overview**  
More than 90 million Nigerians live without reliable electricity, relying on expensive and polluting generators. The Solar Battery Hub (SBH) reimagines how off-grid electricity is produced, stored, and delivered. Developed with the Centre for Energy Equality (CEE), SBH is a scalable, data-driven model that uses a central solar array to charge **portable batteries** distributed to households, businesses, schools, and health facilities.

**PAM’s Role**  
- **Feasibility Study** – Detailed market assessments in off-grid communities to understand user needs, affordability, and technical constraints.  
- **Design** – Modular, scalable system architecture integrating solar arrays, portable batteries, and monitoring tools for efficiency and reliability.  
- **Pilot Developments (SBH1–3)** – Three hubs deployed and tested in real-world conditions; pilots delivered insights into user behavior, system performance, and commercial viability to inform large-scale replication.

**Impact**  
Reliable power extends trading hours, reduces food spoilage, and grows income for market traders and MSMEs. Health facilities preserve vaccines/medicines and can run safe night-time operations. Schools benefit from improved learning environments. Women—who form the majority of market stall operators—gain economic opportunity, narrowing the rural–urban equity gap.

**Broader Benefits**  
By displacing diesel generators, SBH reduces emissions and improves air quality. The infrastructure lays foundations for **e-mobility** (electric bikes/vehicles), and the affordability + scalability make the model ready to expand across sub-Saharan Africa—unlocking opportunities and accelerating the clean-energy transition.
`,
  },
  {
    slug: "so-cool",
    title: "So-Cool",
    year: 2024,
    blurb:
      "Cold-chain pods for off-grid areas: enables productivity, reduces food/medical waste, and supports MSMEs.",
    cover: "/projects/projects3.png",
    gallery: [
      "/projects/socool/1.png",
      "/projects/socool/2.png",
      "/projects/socool/3.png",
      "/projects/socool/4.png",
      "/projects/socool/5.png",
    ],
    info: `
**Overview**  
So-Cool addresses critical challenges in off-grid and underserved areas by delivering 24-hour electricity and **cooling** for agriculture, healthcare, and trade. Each unit can share power with up to three nearby businesses or homes, amplifying community impact.

**Affordability (SCaaS)**  
With **So-Cool-as-a-Service (SCaaS)**, customers can pay daily or weekly, with lease-to-own or purchase options—ensuring inclusivity.

**PAM’s Role**  
- **Feasibility Study** – Research on needs, affordability, and technical requirements for small businesses and households.  
- **Design** – Durable, portable unit combining solar power and cooling technology for reliable productive energy.  
- **Pilot Developments** – Field tests with real users to validate performance and collect feedback.  
- **Venture Building** – Business model setup (lease-to-own/purchase), pricing, and operations.  
- **PAM-AI Integration** – Smart payments and insights to support flexibility and improve affordability.

**Impact**  
Already operating in Lagos, Osun, and Delta States as a cleaner, more reliable alternative to diesel. In communities like Lafiji Town (Lagos), small businesses report **up to 60%** lower energy costs, **~50%** longer working hours, and more stable incomes thanks to reliable cooling and power.
`,
  },
  {
    slug: "punch-newspaper",
    title: "Punch Newspaper",
    year: 2024,
    blurb:
      "We support leading Nigerian newspapers on the journey to cleaner, more reliable energy.",
    cover: "/projects/newspaper/1.png",
    gallery: [
      "/projects/newspaper/1.png",
      "/projects/newspaper/2.png",
      "/projects/newspaper/3.png",
      "/projects/newspaper/4.png",
      "/projects/newspaper/5.png",
    ],
    info: `
**Overview**  
PAM supports leading Nigerian newspapers in their transition to cleaner, more reliable energy. A key milestone is the completion of a **100 kW** solar energy system for *Punch Newspapers*, significantly reducing diesel use and operating costs while cutting emissions.

**Technology**  
At the core is our locally developed **PAM/EBAM lithium-ion battery** system, engineered in Nigeria to improve efficiency and storage capacity—bringing Punch to the brink of **Net-Zero** operations.

**Beyond Punch**  
Working with major media houses (including New Telegraph), PAM is helping reshape how Nigerian newsrooms are powered, improving reliability for mission-critical publishing workflows.
`,
  },
  {
    slug: "new-telegraph",
    title: "New Telegraph",
    year: 2024,
    blurb: "..",
    cover: "/projects/projects5.png",
    gallery: [
      "/projects/telegraph/1.png",
      "/projects/telegraph/2.png",
      "/projects/telegraph/3.png",
      "/projects/telegraph/4.png",
      "/projects/telegraph/5.png",
    ],
    info: `
**Overview**  
New Telegraph partners with PAM to replace diesel with cleaner, dependable power—mirroring the So-Cool ethos of enabling productivity, reducing waste, and strengthening MSME livelihoods in underserved areas.

**PAM’s Role**  
- Community/operations assessments for affordability and technical fit.  
- System design and deployment with robust after-sales support.  
- Flexible payment options (including lease-to-own) to ensure scalability.

**Impact**  
By improving reliability and lowering energy costs, newsroom and printing operations become more resilient—supporting a steady transition toward low-carbon media operations.
`,
  },
];
