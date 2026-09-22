import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Icon } from "@/components/common/ui";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const typeIcon = { course: "book-open", track: "compass", dsa: "code", resource: "folder", quickrev: "zap" };

export default function GlobalSearch({ open, setOpen }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get(`/search`, { params: { q } });
        setResults(data.results || []);
      } catch (_) {}
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const go = (link) => { setOpen(false); setQ(""); navigate(link); };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search courses, tracks, DSA, resources…" value={q} onValueChange={setQ} data-testid="global-search-input" />
      <CommandList>
        <CommandEmpty>{q ? "No results found." : "Type to search across SmartLearn."}</CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map((r, i) => (
              <CommandItem key={i} value={`${r.title}-${i}`} onSelect={() => go(r.link)} data-testid={`search-result-${i}`}>
                <Icon name={typeIcon[r.type] || "search"} className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium">{r.title}</span>
                <span className="ml-2 text-xs text-muted-foreground">{r.subtitle}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
