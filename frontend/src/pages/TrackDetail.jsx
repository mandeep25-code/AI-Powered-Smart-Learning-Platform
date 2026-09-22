import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Icon, Loader } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TrackDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ["track", slug], queryFn: async () => (await api.get(`/content/tracks/${slug}`)).data });

  if (isLoading || !data) return <Loader />;
  const t = data.track;

  return (
    <div>
      <Link to="/app/tracks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><Icon name="arrow-left" className="h-4 w-4" /> All tracks</Link>

      <div className="rounded-2xl border border-border p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(600px circle at 20% 20%, ${t.color}, transparent 50%)` }} />
        <div className="relative flex items-start gap-5">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${t.color}22`, color: t.color }}>
            <Icon name={t.icon} className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{t.category}</Badge>
              <Badge className="bg-success/10 text-success border-success/20">{t.demand} demand</Badge>
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">{t.name}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">{t.description}</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Button onClick={() => navigate(`/app/roadmaps?track=${t.slug}`)} data-testid="generate-roadmap-btn"><Icon name="sparkles" className="mr-2 h-4 w-4" /> Generate AI roadmap</Button>
              <Button variant="outline" onClick={() => navigate(`/app/courses`)}>Browse courses</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-surface p-6">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><Icon name="list-checks" className="h-5 w-5 text-primary" /> Core skills</h2>
          <div className="space-y-2">
            {t.skills.map((s, i) => (
              <div key={s} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><Icon name="briefcase" className="h-5 w-5 text-secondary" /> Roles you can target</h2>
            <div className="flex flex-wrap gap-2">
              {t.roles.map((r) => <span key={r} className="rounded-full border border-border px-3 py-1.5 text-sm">{r}</span>)}
            </div>
          </div>
          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-semibold mb-2 flex items-center gap-2"><Icon name="indian-rupee" className="h-5 w-5 text-success" /> Expected salary</h2>
            <div className="font-display text-3xl font-bold text-success">{t.avgSalary}</div>
            <p className="text-sm text-muted-foreground mt-1">Varies by company tier, skills and location.</p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 card-surface p-6">
          <div className="flex items-center justify-between mb-5"><div><h2 className="font-display text-lg font-semibold">Your 90-day launch plan</h2><p className="text-sm text-muted-foreground">A clear first sprint for becoming job-ready in {t.name}.</p></div><Badge className="bg-primary/10 text-primary border-primary/20">Personalise in Roadmaps</Badge></div>
          <div className="grid sm:grid-cols-3 gap-3">{[["01", "Build foundations", `Learn ${t.skills.slice(0, 2).join(" + ")} and complete guided modules.`], ["02", "Ship proof", "Build two portfolio-quality projects and publish clean documentation."], ["03", "Interview ready", "Practise core questions, mock interviews and tailored applications."]].map(([number, title, description]) => <div key={number} className="rounded-xl border border-border bg-muted/30 p-4"><div className="text-xs font-bold text-primary mb-3">WEEKS {number}</div><h3 className="font-semibold">{title}</h3><p className="text-sm text-muted-foreground mt-1 leading-6">{description}</p></div>)}</div>
        </div>
        <div className="card-surface p-6"><h2 className="font-display text-lg font-semibold mb-4">What hiring teams value</h2><div className="space-y-3">{["Strong fundamentals", "Visible project work", "Clear communication", "Consistent practice"].map((item, i) => <div key={item} className="flex items-center gap-3 text-sm"><span className="h-7 w-7 rounded-full bg-success/10 text-success flex items-center justify-center font-semibold">{i + 1}</span>{item}</div>)}</div></div>
      </div>
    </div>
  );
}
