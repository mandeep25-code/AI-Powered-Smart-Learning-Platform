import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const toPascal = (s = "") =>
  s.split(/[-_ ]/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");

export function Icon({ name, className, ...props }) {
  const Cmp = Icons[toPascal(name)] || Icons.Circle;
  return <Cmp className={className} {...props} />;
}

export function PageHeader({ eyebrow, title, subtitle, icon, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div>
        {eyebrow && (
          <div className="eyebrow text-primary mb-2 flex items-center gap-2">
            {icon && <Icon name={icon} className="h-3.5 w-3.5" />} {eyebrow}
          </div>
        )}
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ icon, label, value, sub, accent = "primary", testId }) {
  const colors = {
    primary: "text-primary bg-primary/10 border-primary/20",
    streak: "text-streak bg-streak/10 border-streak/20",
    success: "text-success bg-success/10 border-success/20",
    ai: "text-ai bg-ai/10 border-ai/20",
    secondary: "text-secondary bg-secondary/10 border-secondary/20",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-surface card-hover p-5"
      data-testid={testId}
    >
      <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-lg border mb-3", colors[accent])}>
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {sub && <div className="text-xs text-muted-foreground/70 mt-1">{sub}</div>}
    </motion.div>
  );
}

export function EmptyState({ icon = "inbox", title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-6 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
        <Icon name={icon} className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {desc && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Loader({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-muted-foreground">
      <Icons.Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-surface p-5 animate-pulse">
          <div className="h-10 w-10 rounded-lg bg-muted mb-4" />
          <div className="h-4 w-2/3 bg-muted rounded mb-2" />
          <div className="h-3 w-full bg-muted rounded mb-1.5" />
          <div className="h-3 w-4/5 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export function AIBanner({ configured }) {
  if (configured) return null;
  return (
    <div
      className="mb-6 flex items-start gap-3 rounded-xl border border-streak/30 bg-streak/10 p-4"
      data-testid="ai-inactive-banner"
    >
      <Icon name="triangle-alert" className="h-5 w-5 text-streak shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-semibold text-foreground">AI is running in offline mode</p>
        <p className="text-muted-foreground">
          Add your <code className="text-streak">OPENROUTER_API_KEY</code> to the backend <code>.env</code> to activate
          live AI responses. You're currently seeing curated fallback content.
        </p>
      </div>
    </div>
  );
}
