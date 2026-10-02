export const site = {
  name: "Jericho de Guzman",
  discipline: "Full-stack engineer",
  location: "Irvine, CA",
  year: "2026",
} as const;

export const nav = [{ id: "projects", label: "Projects" }] as const;

export const hero = {
  title: "Building intricate, interactive, intelligent web systems",
  summary:
    "Hey, I'm Jericho! I'm a full-stack engineer specializing in crafting minimalist and intuitive applications and user experiences. I'm immensely passionate about creating well-designed software with real impact.",
  specs: [
    {
      label: "Skills",
      value: "Full-stack web development, UI/UX design, system design",
    },
    {
      label: "Languages",
      value: "Javascript, Typescript, Python, C++",
    },
    {
      label: "Tools/Frameworks",
      value: "Figma, React, Next.js, Tailwind, Cursor, MongoDB",
    },
  ],
} as const;

export type Project = {
  index: string;
  name: string;
  summary: string;
  year?: string;
  context?: string;
  status?: string;
  href?: string;
  hrefLabel?: string;
  details?: string;
  embed?: string;
  images?: readonly { src: string; alt: string }[];
};

export const projects: readonly Project[] = [
  {
    index: "01",
    name: "Javascript Game Engine",
    href: "https://js-game-engine.vercel.app",
    hrefLabel: "js-game-engine.vercel.app",
    embed: "https://js-game-engine.vercel.app",
    summary:
      "With AI-assistance, built a fully-fledged 2D game-development platform for web, where users can build complete games with physics and custom scripts, and can share and publish games publicly.",
    details:
      "Used Cursor to rapidly design, develop, and iterate features, and used React to construct a reactive and intuitive user interface.",
    year: "Sep. 2026",
  },
  {
    index: "02",
    name: "Bloom Health",
    summary:
      "At Bloom Health, helped develop the MVP for a free women’s health app, which tracks menstrual cycles over time along with health symptoms utilizing machine learning.",
    details:
      "Used React Native with Expo to build a front-end cycle calendar with user data input, then connected the calendar to the back-end AI prediction model, all taking advantage of Cursor for rapid development.",
    year: "Apr. – Sep. 2026",
    images: [
      {
        src: "/bloom/colors.jpg",
        alt: "Bloom Health calendar color legend",
      },
      {
        src: "/bloom/calendar.jpg",
        alt: "Bloom Health calendar with a day ready to log",
      },
      {
        src: "/bloom/log-flow.png",
        alt: "Bloom Health log flow screen for bleeding intensity",
      },
    ],
  },
  {
    index: "03",
    name: "HomePilot",
    href: "https://v0-homepilot.vercel.app/",
    hrefLabel: "v0-homepilot.vercel.app",
    embed: "https://v0-homepilot.vercel.app/",
    summary:
      "Worked with a team of 4 developers to develop and deploy HomePilot in under 36 hours: an AI-powered rental assistant that matches users to personalized listings from Zillow or Apartments.com, and provides powerful housing application guidance and optimization tools.",
    details:
      "Used Figma and React to design and build the front-end user interface, utilizing Cursor and Figma Make to discover and iterate solutions rapidly yet carefully.",
    year: "Sep. 2026",
  },
  {
    index: "04",
    name: "Kandor",
    href: "https://kandor.tech/",
    hrefLabel: "kandor.tech",
    embed: "https://kandor.tech/",
    context: "Hacktech",
    summary:
      "Worked with a team of 4 developers on Kandor, a browser extension that scans conversations for high-risk safety threats such as grooming, solicitation, or harassment, alerting the user to great concerns with risk level and recommended action.",
    details:
      "Used Figma and React to carefully craft the front-end interface, also taking advantage of Cursor to quickly develop and iterate designs.",
    year: "Apr. 2025",
  },
];

/** Greetings shown on the laptop screen; advances one entry after each full spin. */
export const laptopGreetings = [
  "hello world",
  "hola mundo",
  "bonjour le monde",
  "hallo welt",
  "ciao mondo",
  "olá mundo",
  "こんにちは 世界",
  "你好 世界",
  "привет мир",
  "안녕하세요 세계",
  "hej världen",
  "שלום עולם",
] as const;

export const contact = {
  label: "Let's connect",
  title: "Looking for a developer, or just want to chat? Let's talk.",
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jericho-de-guzman-046430285/",
      icon: "/icons/linkedin.png",
    },
    {
      label: "GitHub",
      href: "https://github.com/jericho-dg",
      icon: "/icons/github.png",
    },
    {
      label: "Email",
      href: "mailto:jericho.deguzman719@gmail.com",
      icon: "/icons/email.png",
    },
  ],
} as const;
