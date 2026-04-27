import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useTheme } from "@/themes/ThemeProvider";
import { AnimationBackground } from "@/animations/AnimationBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Code2, FolderOpen, Sparkles, Mail, Github, Linkedin, Twitter, Instagram,
  ExternalLink, Shield, Rocket, Zap, Globe, Layers, Star, Heart,
  Layout, Cpu, Palette, Terminal, ChevronRight, Menu, X
} from "lucide-react";
import gsap from "gsap";

export default function Home() {
  const { theme, themeId } = useTheme();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      });
      gsap.from(".hero-subtitle", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5,
      });
      gsap.from(".hero-desc", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.8,
      });
      gsap.from(".hero-buttons", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 1.0,
      });
      gsap.from(".tab-section", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 1.2,
      });
    });
    return () => ctx.revert();
  }, []);

  // Double-click secret access to admin
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleSecretClick = () => {
    clickCount.current++;
    if (clickCount.current === 1) {
      clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 500);
    } else if (clickCount.current >= 5) {
      navigate("/admin");
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
    }
  };

  const { data: settings } = trpc.settings.get.useQuery();
  const { data: projects } = trpc.projects.list.useQuery();

  const skillIcons = [
    <Code2 key="1" />, <Zap key="2" />, <Globe key="3" />, <Layers key="4" />,
    <Star key="5" />, <Layout key="6" />, <Cpu key="7" />, <Palette key="8" />,
    <Terminal key="9" />, <Rocket key="10" />, <Sparkles key="11" />, <Heart key="12" />,
  ];

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <AnimationBackground themeId={themeId} />

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
        style={{
          background: theme.colors.surface + "90",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${theme.colors.border}40`,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={handleSecretClick}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: theme.colors.gradient }}
            >
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: theme.colors.text }}>
              {settings?.name || "DevPortfolio"}
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#home" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: theme.colors.textMuted }}>
              Home
            </a>
            <a href="#projects" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: theme.colors.textMuted }}>
              Projects
            </a>
            <a href="#skills" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: theme.colors.textMuted }}>
              Skills
            </a>
            <a href="#contact" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: theme.colors.textMuted }}>
              Contact
            </a>
          </div>

          <div className="hidden md:block">
            <Button
              size="sm"
              className="rounded-full px-4"
              style={{ background: theme.colors.gradient, color: "#fff" }}
              onClick={() => window.open("mailto:" + (settings?.email || ""), "_blank")}
            >
              <Mail className="w-4 h-4 mr-2" />
              Hire Me
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden mt-3 p-4 rounded-xl space-y-3"
            style={{ background: theme.colors.surface }}
          >
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block py-2" style={{ color: theme.colors.text }}>Home</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="block py-2" style={{ color: theme.colors.text }}>Projects</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="block py-2" style={{ color: theme.colors.text }}>Skills</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2" style={{ color: theme.colors.text }}>Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="pt-28 pb-12 px-4 md:pt-40 md:pb-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="hero-title mb-4">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{
                background: theme.colors.primary + "20",
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}40`,
              }}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              {settings?.subtitle || "Full Stack Developer"}
            </span>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight"
              style={{ color: theme.colors.text }}
            >
              Crafting Digital{" "}
              <span style={{ background: theme.colors.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Experiences
              </span>
              <br />
              That Matter
            </h1>
          </div>

          <p
            className="hero-desc text-base md:text-lg max-w-2xl mx-auto mb-8"
            style={{ color: theme.colors.textMuted }}
          >
            {settings?.description || "I create stunning web experiences with modern technologies. Specializing in React, Node.js, and everything in between."}
          </p>

          <div className="hero-buttons flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold"
              style={{ background: theme.colors.gradient, color: "#fff" }}
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              <FolderOpen className="w-5 h-5 mr-2" />
              View Projects
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 text-base font-semibold"
              style={{ borderColor: theme.colors.border, color: theme.colors.text }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Mail className="w-5 h-5 mr-2" />
              Get in Touch
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 md:mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto">
            {[
              { value: (projects?.length || 0) + "+", label: "Projects" },
              { value: "30+", label: "Themes" },
              { value: "100%", label: "Satisfaction" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl"
                style={{
                  background: theme.colors.surface + "80",
                  border: `1px solid ${theme.colors.border}40`,
                }}
              >
                <div className="text-2xl md:text-3xl font-black" style={{ color: theme.colors.primary }}>
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm" style={{ color: theme.colors.textMuted }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section id="projects" className="px-4 pb-20">
        <div ref={contentRef} className="tab-section max-w-6xl mx-auto">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList
              className="w-full max-w-md mx-auto mb-8 p-1 rounded-2xl"
              style={{
                background: theme.colors.surface + "80",
                border: `1px solid ${theme.colors.border}40`,
              }}
            >
              <TabsTrigger
                value="projects"
                className="flex-1 rounded-xl data-[state=active]:text-white transition-all"
                style={{
                  color: theme.colors.textMuted,
                }}
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="flex-1 rounded-xl data-[state=active]:text-white transition-all"
                style={{
                  color: theme.colors.textMuted,
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="flex-1 rounded-xl data-[state=active]:text-white transition-all"
                style={{
                  color: theme.colors.textMuted,
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <ProjectsTab projects={projects || []} theme={theme} />
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills">
              <SkillsTab settings={settings} theme={theme} skillIcons={skillIcons} />
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact">
              <ContactTab settings={settings} theme={theme} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 text-center"
        style={{
          borderTop: `1px solid ${theme.colors.border}30`,
          background: theme.colors.surface + "50",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-4 mb-4">
            {settings?.social?.github && (
              <a href={settings.social.github} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-xl transition-all hover:scale-110"
                style={{ background: theme.colors.surface, color: theme.colors.textMuted }}>
                <Github className="w-5 h-5" />
              </a>
            )}
            {settings?.social?.linkedin && (
              <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-xl transition-all hover:scale-110"
                style={{ background: theme.colors.surface, color: theme.colors.textMuted }}>
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {settings?.social?.twitter && (
              <a href={settings.social.twitter} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-xl transition-all hover:scale-110"
                style={{ background: theme.colors.surface, color: theme.colors.textMuted }}>
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {settings?.social?.instagram && (
              <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-xl transition-all hover:scale-110"
                style={{ background: theme.colors.surface, color: theme.colors.textMuted }}>
                <Instagram className="w-5 h-5" />
              </a>
            )}
          </div>
          <p className="text-sm" style={{ color: theme.colors.textMuted }}>
            Crafted with <Heart className="w-4 h-4 inline text-red-500" /> by {settings?.name || "Developer"}
          </p>
          <p className="text-xs mt-1" style={{ color: theme.colors.textMuted + "80" }}>
            Tip: Click the logo 5 times fast for admin access
          </p>
        </div>
      </footer>

      {/* Admin shortcut button - hidden */}
      <div
        className="fixed bottom-4 right-4 z-40 opacity-0 hover:opacity-30 transition-opacity cursor-pointer"
        onClick={handleSecretClick}
        title="Admin Panel"
      >
        <Shield className="w-6 h-6" style={{ color: theme.colors.textMuted }} />
      </div>
    </div>
  );
}

// ============ SUB-COMPONENTS ============

function ProjectsTab({ projects, theme }: { projects: any[]; theme: any }) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll(".project-card");
    gsap.fromTo(cards,
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      }
    );
  }, [projects]);

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-20">
        <FolderOpen className="w-16 h-16 mx-auto mb-4" style={{ color: theme.colors.textMuted }} />
        <p style={{ color: theme.colors.textMuted }}>No projects yet. Add some from the admin panel!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.colors.text }}>
          My Projects
        </h2>
        <p className="mt-2" style={{ color: theme.colors.textMuted }}>
          Click on any project to visit the live website
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <a
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card group block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: theme.colors.surface + "80",
              border: `1px solid ${theme.colors.border}40`,
              boxShadow: hoveredProject === project.id ? `0 20px 40px ${theme.colors.primary}20` : "none",
            }}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Banner Image */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' fill='%23333'%3E%3Crect width='400' height='225' fill='%23222'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='18'%3EProject Preview%3C/text%3E%3C/svg%3E";
                }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: theme.colors.primary + "60" }}
              >
                <ExternalLink className="w-10 h-10 text-white" />
              </div>
              <div
                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: theme.colors.primary + "90",
                  color: "#fff",
                  backdropFilter: "blur(10px)",
                }}
              >
                {project.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3
                className="text-lg font-bold mb-1 group-hover:underline transition-all"
                style={{ color: theme.colors.text }}
              >
                {project.title}
              </h3>
              <p className="text-sm" style={{ color: theme.colors.textMuted }}>
                {project.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function SkillsTab({ settings, theme, skillIcons }: { settings: any; theme: any; skillIcons: any[] }) {
  const skills = settings?.skills || ["React", "Node.js", "TypeScript", "Next.js", "Tailwind CSS", "MongoDB", "Express", "GSAP"];
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const items = cardsRef.current.querySelectorAll(".skill-item");
    gsap.fromTo(items,
      { scale: 0, opacity: 0 },
      {
        scale: 1, opacity: 1,
        duration: 0.5,
        stagger: { amount: 0.8, from: "random" },
        ease: "back.out(1.7)",
      }
    );
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.colors.text }}>
          My Skills
        </h2>
        <p className="mt-2" style={{ color: theme.colors.textMuted }}>
          Technologies I work with
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {skills.map((skill: string, idx: number) => (
          <div
            key={skill}
            className="skill-item p-5 rounded-2xl text-center transition-all duration-300 hover:scale-105 cursor-default"
            style={{
              background: theme.colors.surface + "80",
              border: `1px solid ${theme.colors.border}40`,
            }}
          >
            <div
              className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
              style={{ background: theme.colors.primary + "20", color: theme.colors.primary }}
            >
              {skillIcons[idx % skillIcons.length]}
            </div>
            <span className="font-semibold text-sm" style={{ color: theme.colors.text }}>
              {skill}
            </span>
          </div>
        ))}
      </div>

      {/* Services */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <Globe className="w-6 h-6" />, title: "Web Development", desc: "Full-stack web applications" },
          { icon: <Palette className="w-6 h-6" />, title: "UI/UX Design", desc: "Beautiful user interfaces" },
          { icon: <Rocket className="w-6 h-6" />, title: "Performance", desc: "Optimized & scalable code" },
        ].map((service) => (
          <div
            key={service.title}
            className="p-5 rounded-2xl text-center"
            style={{
              background: theme.colors.surface + "60",
              border: `1px solid ${theme.colors.border}30`,
            }}
          >
            <div className="mb-2" style={{ color: theme.colors.primary }}>
              {service.icon}
            </div>
            <h4 className="font-semibold" style={{ color: theme.colors.text }}>
              {service.title}
            </h4>
            <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>
              {service.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactTab({ settings, theme }: { settings: any; theme: any }) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.colors.text }}>
          Get in Touch
        </h2>
        <p className="mt-2" style={{ color: theme.colors.textMuted }}>
          Let&apos;s work together on your next project
        </p>
      </div>

      <div className="space-y-4">
        {[
          { icon: <Mail className="w-5 h-5" />, label: "Email", value: settings?.email || "your@email.com", href: `mailto:${settings?.email || ""}` },
          { icon: <Globe className="w-5 h-5" />, label: "Location", value: settings?.location || "Your Location", href: "#" },
          { icon: <Code2 className="w-5 h-5" />, label: "GitHub", value: settings?.social?.github ? "github.com" : "Not set", href: settings?.social?.github || "#" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02]"
            style={{
              background: theme.colors.surface + "80",
              border: `1px solid ${theme.colors.border}40`,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: theme.colors.primary + "20", color: theme.colors.primary }}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                {item.label}
              </p>
              <p className="font-semibold" style={{ color: theme.colors.text }}>
                {item.value}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Message Card */}
      <div
        className="mt-6 p-6 rounded-2xl text-center"
        style={{
          background: theme.colors.gradient,
          color: "#fff",
        }}
      >
        <Rocket className="w-10 h-10 mx-auto mb-3" />
        <h3 className="text-lg font-bold mb-2">Ready to start a project?</h3>
        <p className="text-sm opacity-90 mb-4">
          I&apos;m available for freelance work and open to new opportunities.
        </p>
        <Button
          className="rounded-full px-6"
          style={{ background: "#fff", color: theme.colors.primary }}
          onClick={() => window.open(`mailto:${settings?.email || ""}`, "_blank")}
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Message
        </Button>
      </div>
    </div>
  );
}
