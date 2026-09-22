import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { PageHeader, Icon, SkeletonGrid } from "@/components/common/ui";
import { Badge } from "@/components/ui/badge";

export default function CareerTracks() {
  const { data, isLoading } = useQuery({ queryKey: ["tracks"], queryFn: async () => (await api.get("/content/tracks")).data });

  return (
    <div>
      <PageHeader eyebrow="Career Tracks" icon="compass" title="Choose your path" subtitle="Explore in-demand careers, the skills they need, and generate an AI roadmap for any track." />
      {isLoading ? <SkeletonGrid /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.tracks.map((t, i) => (
            <motion.div key={t.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link to={`/app/tracks/${t.slug}`} className="card-surface card-hover p-6 block h-full" data-testid={`track-card-${t.slug}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: `${t.color}22`, color: t.color }}>
                    <Icon name={t.icon} className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-xs">{t.demand}</Badge>
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{t.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{t.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.skills.slice(0, 4).map((s) => <span key={s} className="text-xs rounded-md bg-muted px-2 py-0.5">{s}</span>)}
                </div>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
                  <span className="text-muted-foreground">{t.category}</span>
                  <span className="font-semibold text-success">{t.avgSalary}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
