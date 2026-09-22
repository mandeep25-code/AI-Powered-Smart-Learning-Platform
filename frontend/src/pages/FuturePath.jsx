import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { PageHeader, Icon, Loader } from "@/components/common/ui";
import { Badge } from "@/components/ui/badge";

export default function FuturePath() {
  const { data, isLoading } = useQuery({ queryKey: ["future"], queryFn: async () => (await api.get("/content/future-path")).data });

  return (
    <div>
      <PageHeader eyebrow="Future Path" icon="milestone" title="Life After B.Tech CSE" subtitle="Explore your options — jobs, higher studies, MS abroad, startups and government careers." />
      {isLoading ? <Loader /> : (
        <div className="grid md:grid-cols-2 gap-6">
          {data.paths.map((p, i) => (
            <motion.div key={p.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-surface card-hover p-6" data-testid={`path-${p.key}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 to-ai/15 text-primary flex items-center justify-center"><Icon name={p.icon} className="h-6 w-6" /></div>
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{p.summary}</p>
              <div className="mb-4">
                <div className="eyebrow text-muted-foreground mb-2">How to prepare</div>
                <ul className="space-y-1.5">
                  {p.points.map((pt) => <li key={pt} className="flex items-start gap-2 text-sm"><Icon name="check-circle-2" className="h-4 w-4 text-success shrink-0 mt-0.5" /> {pt}</li>)}
                </ul>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="eyebrow text-muted-foreground mb-2">Possible outcomes</div>
                <div className="flex flex-wrap gap-1.5">{p.outcomes.map((o) => <Badge key={o} variant="outline">{o}</Badge>)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
