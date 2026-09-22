import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PageHeader, Icon, Loader } from "@/components/common/ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const catIcon = { Quantitative: "calculator", "Logical Reasoning": "puzzle", "Verbal Ability": "book-a", "Data Interpretation": "bar-chart-3" };

export default function AptitudeArena() {
  const { data, isLoading } = useQuery({ queryKey: ["aptitude"], queryFn: async () => (await api.get("/content/aptitude")).data });

  return (
    <div>
      <PageHeader eyebrow="Aptitude Arena" icon="calculator" title="Aptitude Preparation" subtitle="Master quantitative, logical, verbal and data interpretation with curated resources & videos." />
      {isLoading ? <Loader /> : (
        <><div className="grid sm:grid-cols-3 gap-4 mb-6">{[["Practice", "IndiaBIX + topic tests", "target"], ["Learn", "Playlists + one-shots", "play-circle"], ["Company prep", "PrepInsta patterns", "building-2"]].map(([title, copy, icon]) => <div key={title} className="card-surface p-4 flex gap-3 items-center"><div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Icon name={icon} className="h-5 w-5" /></div><div><div className="font-semibold text-sm">{title}</div><div className="text-xs text-muted-foreground">{copy}</div></div></div>)}</div><div className="grid lg:grid-cols-2 gap-6">
          {data.categories.map((c, i) => (
            <div key={i} className="card-surface p-6" data-testid={`apt-cat-${i}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Icon name={catIcon[c.category] || "calculator"} className="h-5 w-5" /></div>
                <h3 className="font-display text-lg font-semibold">{c.category}</h3>
              </div>
              <Accordion type="single" collapsible className="mb-4">
                <AccordionItem value="topics" className="border-border">
                  <AccordionTrigger className="text-sm">{c.topics.length} topics covered</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-1.5">{c.topics.map((t) => <span key={t} className="text-xs rounded-md bg-muted px-2 py-1">{t}</span>)}</div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="space-y-2">
                {c.resources.map((r, ri) => (
                  <a key={ri} href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm hover:border-primary/40 transition-colors" data-testid={`apt-res-${i}-${ri}`}>
                    <Icon name={r.title.includes("YouTube") ? "youtube" : "external-link"} className="h-4 w-4 text-primary" />
                    <span className="flex-1">{r.title}</span>
                    <Icon name="arrow-up-right" className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div><div className="card-surface mt-6 p-6"><div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"><div><div className="eyebrow text-streak mb-1">Optional structured learning</div><h2 className="font-display text-lg font-semibold">Want a paid, mentor-led path?</h2><p className="text-sm text-muted-foreground mt-1">Compare curriculum, mock-test access and refund policies before paying. Use the free resources above first to identify your weak areas.</p></div><div className="flex gap-2"><a href="https://prepinsta.com/" target="_blank" rel="noreferrer" className="rounded-lg border px-3 py-2 text-sm font-medium">PrepInsta</a><a href="https://talentsprint.com/" target="_blank" rel="noreferrer" className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">TalentSprint</a></div></div></div></>
      )}
    </div>
  );
}
