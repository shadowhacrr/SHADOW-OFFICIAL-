import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(import.meta.dirname);

function ensureFile(filename: string, defaultData: unknown) {
  const filepath = join(DATA_DIR, filename);
  if (!existsSync(filepath)) {
    writeFileSync(filepath, JSON.stringify(defaultData, null, 2), "utf-8");
  }
  return filepath;
}

export function readJson<T>(filename: string, defaultData: T): T {
  const filepath = ensureFile(filename, defaultData);
  try {
    const content = readFileSync(filepath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return defaultData;
  }
}

export function writeJson<T>(filename: string, data: T): void {
  const filepath = join(DATA_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
}

// Default admin password: "admin123"
// You should change this after first login
const DEFAULT_ADMIN = {
  password: "admin123",
  theme: 0,
};

const DEFAULT_SETTINGS = {
  theme: 0,
  title: "SHADOW OFFICIAL 👑",
  subtitle: "Full Stack Developer",
  description: "I create stunning web experiences with modern technologies.",
  name: "SHADOW OFFICIAL 👑",
  email: "shadowofficial667788@gmail.com",
  phone: "+923709515870",
  location: "Sangla hill zila nankana sahib",
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    instagram: "https://instagram.com/yourusername",
  },
  skills: ["React", "Node.js", "TypeScript", "Next.js", "Tailwind CSS", "MongoDB", "Express", "GSAP"],
};

const DEFAULT_PROJECTS = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce with payment integration",
    image: "/projects/project1.jpg",
    link: "https://example.com/ecommerce",
    category: "Full Stack",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Portfolio Dashboard",
    description: "Interactive analytics dashboard with real-time data",
    image: "/projects/project2.jpg",
    link: "https://example.com/dashboard",
    category: "Frontend",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Social Media App",
    description: "Social platform with real-time messaging",
    image: "/projects/project3.jpg",
    link: "https://example.com/social",
    category: "Full Stack",
    createdAt: new Date().toISOString(),
  },
];

export function initStorage() {
  ensureFile("admin.json", DEFAULT_ADMIN);
  ensureFile("settings.json", DEFAULT_SETTINGS);
  ensureFile("projects.json", DEFAULT_PROJECTS);
}

export { DEFAULT_ADMIN, DEFAULT_SETTINGS, DEFAULT_PROJECTS };
