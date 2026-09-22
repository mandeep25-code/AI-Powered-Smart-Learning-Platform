import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Icon } from "@/components/common/ui";
import GlobalSearch from "@/components/GlobalSearch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV = [
  { section: "Main", items: [
    { to: "/app", icon: "layout-dashboard", label: "Dashboard", end: true },
    { to: "/app/courses", icon: "book-open", label: "Learning Hub" },
    { to: "/app/tutor", icon: "sparkles", label: "AI Tutor" },
  ]},
  { section: "Learning", items: [
    { to: "/app/tracks", icon: "compass", label: "Career Tracks" },
    { to: "/app/roadmaps", icon: "route", label: "Roadmaps" },
    { to: "/app/quizzes", icon: "list-checks", label: "Quizzes" },
    { to: "/app/flashcards", icon: "layers", label: "Flashcards" },
  ]},
  { section: "Practice", items: [
    { to: "/app/coding", icon: "code", label: "Coding Arena" },
    { to: "/app/code-lab", icon: "terminal", label: "Code Lab" },
    { to: "/app/planner", icon: "calendar-check", label: "Study Planner" },
  ]},
  { section: "Career", items: [
    { to: "/app/placement", icon: "briefcase", label: "Placement Hub" },
    { to: "/app/aptitude", icon: "calculator", label: "Aptitude Arena" },
    { to: "/app/interview", icon: "mic", label: "Interview Prep" },
    { to: "/app/resume", icon: "file-text", label: "Resume Studio" },
  ]},
  { section: "Premium", items: [
    { to: "/app/premium", icon: "crown", label: "Premium Vault" },
    { to: "/app/resources", icon: "folder-open", label: "Resource Vault" },
    { to: "/app/launchpad", icon: "rocket", label: "Career Launchpad" },
  ]},
  { section: "Account", items: [
    { to: "/app/analytics", icon: "bar-chart-3", label: "Analytics" },
    { to: "/app/achievements", icon: "trophy", label: "Achievements" },
    { to: "/app/profile", icon: "user", label: "Profile" },
  ]},
];

function NavItems({ role, onNavigate }) {
  const nav = [...NAV];
  if (role === "teacher" || role === "admin") {
    nav.splice(1, 0, { section: "Teach", items: [{ to: "/app/instructor", icon: "presentation", label: "Instructor Studio" }] });
  }
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-8">
      {nav.map((group) => (
        <div key={group.section}>
          <div className="eyebrow text-muted-foreground/60 px-3 mb-3 text-xs font-semibold tracking-wider">{group.section}</div>
          <div className="space-y-1">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-ai/10 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )
                }
              >
                <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <NavLink to="/app" end className="brand-link flex items-center gap-3 px-6 h-20 border-b border-border/50 shrink-0 bg-gradient-to-b from-card to-card/50" data-testid="smartlearn-home">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-ai text-white shadow-lg shadow-primary/25">
        <Icon name="graduation-cap" className="h-5 w-5" />
      </div>
      <div>
        <div className="font-display font-extrabold text-lg leading-none tracking-tight text-foreground">SmartLearn</div>
        <div className="text-[10px] text-muted-foreground tracking-widest font-medium">AI LEARNING OS</div>
      </div>
    </NavLink>
  );
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const xpPct = Math.min(100, Math.round(((user?.xp || 0) % 500) / 500 * 100));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col border-r border-border/50 bg-card/80 backdrop-blur-xl z-30">
        <Brand />
        <NavItems role={user?.role} />
        <div className="p-4 border-t border-border/50">
          <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-ai/10 border border-primary/20 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold flex items-center gap-1.5 text-foreground"><Icon name="zap" className="h-4 w-4 text-primary" /> Level {user?.level || 1}</span>
              <span className="text-muted-foreground font-medium">{user?.xp || 0} XP</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-ai rounded-full transition-all duration-500" style={{ width: `${xpPct}%` }} />
            </div>
            <div className="text-xs text-muted-foreground mt-2">{xpPct}% to next level</div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-20 glass border-b border-border/50 flex items-center gap-4 px-4 sm:px-6 bg-background/80 backdrop-blur-xl">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" data-testid="mobile-menu-btn">
                <Icon name="menu" className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80 flex flex-col">
              <Brand />
              <NavItems role={user?.role} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <button
            onClick={() => setSearchOpen(true)}
            data-testid="open-search-btn"
            className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm text-muted-foreground hover:border-primary/40 hover:bg-muted/50 transition-all w-full max-w-md"
          >
            <Icon name="search" className="h-4 w-4" />
            <span className="flex-1 text-left">Search anything…</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-background px-2 py-1 rounded-md border border-border/50">⌘K</kbd>
          </button>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-500" data-testid="streak-badge">
              <Icon name="flame" className="h-4 w-4" /> {user?.streak?.count || 0}
            </div>
            <Button variant="ghost" size="icon" onClick={toggle} data-testid="theme-toggle-btn" className="rounded-xl">
              <Icon name={theme === "dark" ? "sun" : "moon"} className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-xl hover:bg-muted/50 p-1.5 transition-colors" data-testid="user-menu-btn">
                  <Avatar className="h-9 w-9 border border-border/50">
                    <AvatarFallback className="bg-gradient-to-br from-primary/10 to-ai/10 text-primary font-semibold">
                      {(user?.name || "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/50">
                <DropdownMenuLabel>
                  <div className="font-semibold">{user?.name}</div>
                  <div className="text-xs text-muted-foreground font-normal capitalize">{user?.role}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app/profile")} data-testid="menu-profile">
                  <Icon name="user" className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/app/analytics")}>
                  <Icon name="bar-chart-3" className="mr-2 h-4 w-4" /> Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await logout(); navigate("/login"); }} data-testid="logout-btn" className="text-destructive focus:text-destructive">
                  <Icon name="log-out" className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
    </div>
  );
}
