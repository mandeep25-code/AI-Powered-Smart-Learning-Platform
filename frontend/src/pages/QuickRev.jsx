import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PageHeader, Icon, Loader } from "@/components/common/ui";

const catColor = { Web: "primary", "CS Core": "secondary", Frontend: "ai", Career: "success", Reference: "streak" };

export default function QuickRev() {
  const { data, isLoading } = useQuery({ queryKey: ["quickrev"], queryFn: async () => (await api.get("/content/quickrev")).data });

  return (
    <div>
      <PageHeader eyebrow="QuickRev Hub" icon="zap" title="Fast Revision Resources" subtitle="Jump straight to W3Schools, MDN, GeeksforGeeks and other quick-reference sites." />
      {isLoading ? <Loader /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.resources.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noreferrer" className="card-surface card-hover p-6 block" data-testid={`quickrev-${i}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center bg-${catColor[r.category] || "primary"}/10 text-${catColor[r.category] || "primary"}`}><Icon name="zap" className="h-5 w-5" /></div>
                <Icon name="arrow-up-right" className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold mb-1">{r.name}</h3>
              <p className="text-sm text-muted-foreground">{r.description}</p>
              <div className="mt-3 text-xs font-medium text-primary">{r.category}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
