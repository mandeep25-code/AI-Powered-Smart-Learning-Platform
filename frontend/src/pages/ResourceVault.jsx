import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageHeader, Icon, AIBanner, EmptyState, Loader } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function ResourceVault() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", type: "link", url: "", text: "", category: "General" });
  const [docText, setDocText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  const { data: status } = useQuery({ queryKey: ["ai-status"], queryFn: async () => (await api.get("/ai/status")).data });
  const { data, isLoading } = useQuery({ queryKey: ["resources"], queryFn: async () => (await api.get("/resources")).data });

  const add = async () => {
    if (!form.title) return toast.error("Title required");
    try { await api.post("/resources", form); toast.success("Resource added"); setOpen(false); setForm({ title: "", type: "link", url: "", text: "", category: "General" }); qc.invalidateQueries({ queryKey: ["resources"] }); }
    catch (_) { toast.error("Failed"); }
  };

  const ask = async () => {
    if (!docText.trim() || !question.trim()) return toast.error("Provide document text and a question");
    setAsking(true);
    try { const { data: res } = await api.post("/ai/doc-qa", { docText, question }); setAnswer(res.reply); }
    catch (_) { toast.error("Q&A failed"); }
    finally { setAsking(false); }
  };

  return (
    <div>
      <PageHeader eyebrow="Resource Vault" icon="folder-open" title="Resources & Document Q&A" subtitle="Save links & notes, and ask AI questions about any document you paste."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button data-testid="add-resource-btn"><Icon name="plus" className="mr-2 h-4 w-4" /> Add resource</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add a resource</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="res-title" />
                <Input placeholder="URL (for links)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} data-testid="res-url" />
                <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <textarea placeholder="Or paste notes / text…" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value, type: e.target.value ? "doc" : "link" })} rows={3} className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <DialogFooter><Button onClick={add} data-testid="save-resource-btn">Save</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        } />

      <Tabs defaultValue="vault">
        <TabsList className="mb-6">
          <TabsTrigger value="vault" data-testid="tab-vault">My Vault</TabsTrigger>
          <TabsTrigger value="qa" data-testid="tab-qa">AI Document Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="vault">
          {isLoading ? <Loader /> : !data?.resources?.length ? (
            <EmptyState icon="folder-open" title="Your vault is empty" desc="Add links, PDFs or notes to keep everything in one place." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.resources.map((r) => (
                <div key={r._id} className="card-surface card-hover p-5" data-testid={`resource-${r._id}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={r.type === "link" ? "link" : r.type === "pdf" ? "file-text" : "sticky-note"} className="h-4 w-4 text-primary" />
                    <span className="glow-badge rounded-full px-2 py-0.5 text-xs">{r.category}</span>
                  </div>
                  <h3 className="font-medium mb-1">{r.title}</h3>
                  {r.description && <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>}
                  {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-2">Open <Icon name="external-link" className="h-3.5 w-3.5" /></a>}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="qa">
          <AIBanner configured={status?.configured} />
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-surface p-5">
              <label className="text-sm font-semibold mb-2 block">Paste document text</label>
              <textarea value={docText} onChange={(e) => setDocText(e.target.value)} rows={10} placeholder="Paste content from a PDF, article or notes…" className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm" data-testid="doc-text" />
            </div>
            <div className="card-surface p-5">
              <label className="text-sm font-semibold mb-2 block">Ask a question</label>
              <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. Summarize the key points" className="mb-3" data-testid="doc-question" />
              <Button onClick={ask} disabled={asking} data-testid="doc-ask-btn">{asking ? <Icon name="loader-2" className="h-4 w-4 animate-spin" /> : <><Icon name="sparkles" className="mr-2 h-4 w-4" /> Ask AI</>}</Button>
              {answer && <div className="mt-4 rounded-lg bg-muted p-4 text-sm whitespace-pre-wrap leading-relaxed" data-testid="doc-answer">{answer}</div>}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
