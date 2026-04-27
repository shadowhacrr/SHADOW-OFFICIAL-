import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { themes } from "@/themes/themeConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import {
  Shield, Lock, FolderPlus, Trash2, Palette, Settings, ChevronLeft,
  LogOut, User, Mail, Globe, Github, Linkedin, Twitter, Instagram,
  Eye, KeyRound, Sparkles, Plus, X, Save, Check
} from "lucide-react";
import gsap from "gsap";

export default function Admin() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("adminToken"));
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();

  const { data: verifyData } = trpc.admin.verify.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  useEffect(() => {
    if (verifyData) {
      setIsVerifying(false);
      if (!verifyData.valid) {
        localStorage.removeItem("adminToken");
        setToken(null);
      }
    } else if (!token) {
      setIsVerifying(false);
    }
  }, [verifyData, token]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!token || !verifyData?.valid) {
    return <LoginScreen onLogin={setToken} />;
  }

  return <AdminDashboard token={token} onLogout={() => { localStorage.removeItem("adminToken"); setToken(null); }} />;
}

// ============ LOGIN SCREEN ============
function LoginScreen({ onLogin }: { onLogin: (t: string) => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const loginMutation = trpc.admin.login.useMutation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.from(containerRef.current.querySelectorAll(".login-anim"), {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
    });
  }, []);

  const handleLogin = async () => {
    if (!password) { toast.error("Enter password"); return; }
    setLoading(true);
    try {
      const result = await loginMutation.mutateAsync({ password });
      if (result.success && result.token) {
        localStorage.setItem("adminToken", result.token);
        onLogin(result.token);
        toast.success("Welcome, Admin!");
      } else {
        toast.error(result.error || "Invalid password");
      }
    } catch {
      toast.error("Login failed");
    }
    setLoading(false);
  };

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <Toaster position="top-center" />
      <div
        className="w-full max-w-md p-8 rounded-3xl"
        style={{
          background: "#1e293b",
          border: "1px solid #334155",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div className="login-anim text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-sm text-slate-400 mt-1">Enter password to access dashboard</p>
        </div>

        <div className="login-anim space-y-4">
          <div>
            <Label className="text-slate-300 mb-2 block">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="pl-10 bg-[#0f172a] border-[#334155] text-white placeholder:text-slate-600 h-12 rounded-xl"
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
          >
            {loading ? "Verifying..." : "Login to Dashboard"}
            {!loading && <ChevronLeft className="w-4 h-4 ml-2 rotate-180" />}
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Button>
        </div>

        <p className="login-anim text-center text-xs text-slate-600 mt-6">
          Default password: <span className="text-slate-400">admin123</span>
        </p>
      </div>
    </div>
  );
}

// ============ ADMIN DASHBOARD ============
function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const { data: projects } = trpc.projects.list.useQuery();
  const { data: settings } = trpc.settings.get.useQuery();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3 bg-[#1e293b]/90 backdrop-blur-xl border-b border-[#334155]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Manage your portfolio</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open("/", "_blank")}
              className="text-slate-400 hover:text-white"
            >
              <Eye className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">View Site</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Projects", value: projects?.length || 0, icon: <FolderPlus className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
            { label: "Current Theme", value: `Theme ${(settings?.theme || 0) + 1}`, icon: <Palette className="w-5 h-5" />, color: "from-purple-500 to-pink-500" },
            { label: "Themes Available", value: themes.length, icon: <Sparkles className="w-5 h-5" />, color: "from-orange-500 to-yellow-500" },
            { label: "Skills Listed", value: settings?.skills?.length || 0, icon: <Settings className="w-5 h-5" />, color: "from-green-500 to-emerald-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-2xl bg-[#1e293b] border border-[#334155]"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-[#1e293b] border border-[#334155] p-1 rounded-xl">
            <TabsTrigger value="projects" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FolderPlus className="w-4 h-4 mr-1" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="themes" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Palette className="w-4 h-4 mr-1" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <KeyRound className="w-4 h-4 mr-1" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="themes">
            <ThemesManager />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManager />
          </TabsContent>

          <TabsContent value="security">
            <SecurityManager token={token} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ============ PROJECTS MANAGER ============
function ProjectsManager() {
  const utils = trpc.useUtils();
  const { data: projects } = trpc.projects.list.useQuery();
  const [showAdd, setShowAdd] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "", category: "General" });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMutation = trpc.projects.add.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      toast.success("Project added!");
      setShowAdd(false);
      setNewProject({ title: "", description: "", link: "", category: "General" });
      setPreviewImage(null);
    },
  });

  const deleteMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      toast.success("Project deleted!");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!newProject.title || !newProject.link) {
      toast.error("Title and Link are required!");
      return;
    }
    addMutation.mutate({
      ...newProject,
      image: previewImage || "/projects/default.jpg",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Your Projects</h2>
        <Button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-500 rounded-xl">
          <Plus className="w-4 h-4 mr-1" />
          Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project: any) => (
          <div
            key={project.id}
            className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden group"
          >
            <div className="relative aspect-video">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' fill='%23333'%3E%3Crect width='400' height='225' fill='%23222'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='18'%3EProject Preview%3C/text%3E%3C/svg%3E";
                }}
              />
              <button
                onClick={() => {
                  if (confirm("Delete this project?")) {
                    deleteMutation.mutate({ id: project.id });
                  }
                }}
                className="absolute top-2 right-2 p-2 rounded-xl bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">
                  {project.category}
                </span>
              </div>
              <h3 className="font-bold text-sm">{project.title}</h3>
              <p className="text-xs text-slate-400 mt-1 truncate">{project.link}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-[#1e293b] border-[#334155] text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-blue-400" />
              Add New Project
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Fill in the details below to add a new project to your portfolio.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Image Upload */}
            <div>
              <Label className="text-slate-300 mb-2 block">Project Banner Image</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#334155] rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                ) : (
                  <div className="py-4">
                    <FolderPlus className="w-10 h-10 mx-auto mb-2 text-slate-500" />
                    <p className="text-sm text-slate-400">Click to upload image</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-300 mb-2 block">Project Title *</Label>
              <Input
                placeholder="e.g. E-Commerce Platform"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="bg-[#0f172a] border-[#334155] text-white h-11 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-slate-300 mb-2 block">Description</Label>
              <Input
                placeholder="Short description of the project"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="bg-[#0f172a] border-[#334155] text-white h-11 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-slate-300 mb-2 block">Website Link *</Label>
              <Input
                placeholder="https://example.com"
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                className="bg-[#0f172a] border-[#334155] text-white h-11 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-slate-300 mb-2 block">Category</Label>
              <Input
                placeholder="e.g. Full Stack, Frontend, Mobile"
                value={newProject.category}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                className="bg-[#0f172a] border-[#334155] text-white h-11 rounded-xl"
              />
            </div>

            <Button
              onClick={handleAdd}
              disabled={addMutation.isPending}
              className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold"
            >
              {addMutation.isPending ? "Adding..." : "Add Project"}
              {!addMutation.isPending && <Plus className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ THEMES MANAGER ============
function ThemesManager() {
  const utils = trpc.useUtils();
  const { data: settings } = trpc.settings.get.useQuery();
  const [activeTheme, setActiveTheme] = useState(settings?.theme || 0);
  const themeMutation = trpc.settings.updateTheme.useMutation({
    onSuccess: () => {
      utils.settings.get.invalidate();
      toast.success("Theme updated! Refresh to see changes.");
    },
  });

  const handleThemeChange = (themeId: number) => {
    setActiveTheme(themeId);
    themeMutation.mutate({ theme: themeId });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Choose Theme</h2>
          <p className="text-sm text-slate-400">Select from {themes.length} unique themes with custom animations</p>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{
            background: themes[activeTheme]?.colors.gradient,
            color: "#fff",
          }}
        >
          {themes[activeTheme]?.name}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => handleThemeChange(t.id)}
            className={`relative p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
              activeTheme === t.id ? "border-white shadow-lg shadow-white/20" : "border-transparent"
            }`}
            style={{
              background: t.colors.surface,
            }}
          >
            {/* Color Preview */}
            <div
              className="w-full h-12 rounded-xl mb-3"
              style={{ background: t.colors.gradient }}
            />
            <div className="flex gap-1 mb-2 justify-center">
              <div className="w-4 h-4 rounded-full" style={{ background: t.colors.primary }} />
              <div className="w-4 h-4 rounded-full" style={{ background: t.colors.secondary }} />
              <div className="w-4 h-4 rounded-full" style={{ background: t.colors.accent }} />
            </div>
            <p className="text-xs font-semibold text-white">{t.name}</p>
            <p className="text-[10px] text-slate-400 capitalize">{t.animation} anim</p>

            {activeTheme === t.id && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ SETTINGS MANAGER ============
function SettingsManager() {
  const utils = trpc.useUtils();
  const { data: settings } = trpc.settings.get.useQuery();
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    description: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    skills: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        name: settings.name || "",
        subtitle: settings.subtitle || "",
        description: settings.description || "",
        email: settings.email || "",
        phone: settings.phone || "",
        location: settings.location || "",
        github: settings.social?.github || "",
        linkedin: settings.social?.linkedin || "",
        twitter: settings.social?.twitter || "",
        instagram: settings.social?.instagram || "",
        skills: (settings.skills || []).join(", "),
      });
    }
  }, [settings]);

  const updateMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      utils.settings.get.invalidate();
      toast.success("Settings saved!");
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      name: form.name,
      subtitle: form.subtitle,
      description: form.description,
      email: form.email,
      phone: form.phone,
      location: form.location,
      social: {
        github: form.github,
        linkedin: form.linkedin,
        twitter: form.twitter,
        instagram: form.instagram,
      },
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Portfolio Settings</h2>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-500 rounded-xl">
          <Save className="w-4 h-4 mr-1" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SettingCard title="Basic Info" icon={<User className="w-5 h-5" />}>
          <div className="space-y-3">
            <div>
              <Label className="text-slate-400 text-xs mb-1 block">Your Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#0f172a] border-[#334155] text-white h-10 rounded-lg" />
            </div>
            <div>
              <Label className="text-slate-400 text-xs mb-1 block">Subtitle</Label>
              <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="bg-[#0f172a] border-[#334155] text-white h-10 rounded-lg" placeholder="e.g. Full Stack Developer" />
            </div>
            <div>
              <Label className="text-slate-400 text-xs mb-1 block">Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-[#0f172a] border-[#334155] text-white h-10 rounded-lg" />
            </div>
          </div>
        </SettingCard>

        <SettingCard title="Contact" icon={<Mail className="w-5 h-5" />}>
          <div className="space-y-3">
            <div>
              <Label className="text-slate-400 text-xs mb-1 block">Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-[#0f172a] border-[#334155] text-white h-10 rounded-lg" />
            </div>
            <div>
              <Label className="text-slate-400 text-xs mb-1 block">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-[#0f172a] border-[#334155] text-white h-10 rounded-lg" />
            </div>
            <div>
              <Label className="text-slate-400 text-xs mb-1 block">Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-[#0f172a] border-[#334155] text-white h-10 rounded-lg" />
            </div>
          </div>
        </SettingCard>

        <SettingCard title="Social Links" icon={<Globe className="w-5 h-5" />}>
          <div className="space-y-3">
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} className="pl-9 bg-[#0f172a] border-[#334155] text-white h-10 rounded-lg" placeholder="GitHub URL" />
            </div>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="pl-9 bg-[#0f172a] border-[#334155] text-white h-10 rounded-lg" placeholder="LinkedIn URL" />
            </div>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} className="pl-9 bg-[#0f172a] border-[#334155] text-white h-10 rounded-lg" placeholder="Twitter URL" />
            </div>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="pl-9 bg-[#0f172a] border-[#334155] text-white h-10 rounded-lg" placeholder="Instagram URL" />
            </div>
          </div>
        </SettingCard>

        <SettingCard title="Skills" icon={<Sparkles className="w-5 h-5" />}>
          <div>
            <Label className="text-slate-400 text-xs mb-1 block">Skills (comma separated)</Label>
            <textarea
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full h-28 p-3 bg-[#0f172a] border border-[#334155] text-white rounded-lg resize-none text-sm"
              placeholder="React, Node.js, TypeScript, ..."
            />
            <p className="text-xs text-slate-500 mt-1">Separate each skill with a comma</p>
          </div>
        </SettingCard>
      </div>
    </div>
  );
}

function SettingCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4 text-blue-400">
        {icon}
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ============ SECURITY MANAGER ============
function SecurityManager({ token }: { token: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changeMutation = trpc.admin.changePassword.useMutation({
    onSuccess: (data) => {
      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to change password");
      }
    },
  });

  const handleChange = () => {
    if (!currentPassword || !newPassword) {
      toast.error("Fill all fields!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    changeMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-bold mb-6">Change Password</h2>

      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 space-y-4">
        <div>
          <Label className="text-slate-400 text-xs mb-1 block">Current Password</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="bg-[#0f172a] border-[#334155] text-white h-11 rounded-xl"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1 block">New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-[#0f172a] border-[#334155] text-white h-11 rounded-xl"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs mb-1 block">Confirm New Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChange()}
            className="bg-[#0f172a] border-[#334155] text-white h-11 rounded-xl"
          />
        </div>
        <Button
          onClick={handleChange}
          disabled={changeMutation.isPending}
          className="w-full h-11 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-semibold"
        >
          {changeMutation.isPending ? "Changing..." : "Change Password"}
          {!changeMutation.isPending && <KeyRound className="w-4 h-4 ml-2" />}
        </Button>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
        <p className="text-sm text-yellow-400">
          <KeyRound className="w-4 h-4 inline mr-1" />
          <strong>Security Tip:</strong> Choose a strong password and keep it safe. If you forget your password, you&apos;ll need to manually edit the admin.json file on the server.
        </p>
      </div>
    </div>
  );
}
