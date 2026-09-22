import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "@/lib/api";
import { PageHeader, Icon, AIBanner } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const BLANK = {
  name: "Your Name", title: "Full Stack Developer", email: "you@email.com", phone: "+91 90000 00000",
  location: "Bengaluru, India", summary: "Results-driven CSE graduate passionate about building scalable web applications.",
  skills: "JavaScript, React, Node.js, MongoDB, Express, Git",
  experience: [{ role: "Software Intern", company: "TechCorp", period: "2024 – Present", desc: "Built REST APIs and React components; improved load time by 30%." }],
  education: [{ degree: "B.Tech Computer Science", school: "XYZ University", period: "2021 – 2025", detail: "CGPA: 8.6" }],
  projects: [{ name: "SmartLearn", desc: "AI learning platform built with the MERN stack." }],
};

const TEMPLATES = [
  { key: "modern", label: "Modern", accent: "hsl(var(--primary))" },
  { key: "emerald", label: "Emerald", accent: "hsl(var(--success))" },
  { key: "slate", label: "Slate", accent: "#334155" },
];

export default function ResumeStudio() {
  const qc = useQueryClient();
  const [data, setData] = useState(BLANK);
  const [template, setTemplate] = useState("modern");
  const [analysis, setAnalysis] = useState(null);
  const [busy, setBusy] = useState(false);
  const previewRef = useRef(null);

  const { data: status } = useQuery({ queryKey: ["ai-status"], queryFn: async () => (await api.get("/ai/status")).data });

  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));
  const setArr = (key, i, field) => (e) => setData((d) => ({ ...d, [key]: d[key].map((it, idx) => idx === i ? { ...it, [field]: e.target.value } : it) }));
  const addItem = (key, tmpl) => setData((d) => ({ ...d, [key]: [...d[key], tmpl] }));

  const save = async () => {
    try { await api.post("/resumes", { title: `${data.name} Resume`, template, data }); toast.success("Resume saved! +30 XP · Career Ready badge"); qc.invalidateQueries({ queryKey: ["dashboard"] }); }
    catch (_) { toast.error("Save failed"); }
  };

  const analyze = async () => {
    setBusy(true);
    try {
      const text = `${data.name}\n${data.title}\n${data.summary}\nSkills: ${data.skills}\n` +
        data.experience.map((e) => `${e.role} at ${e.company}: ${e.desc}`).join("\n");
      const { data: res } = await api.post("/ai/resume-analysis", { resumeText: text });
      setAnalysis(res.analysis);
    } catch (_) { toast.error("Analysis failed"); }
    finally { setBusy(false); }
  };

  const downloadPDF = async () => {
    const el = previewRef.current;
    if (!el) return;
    toast.info("Generating PDF…");
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save(`${data.name.replace(/\s+/g, "_")}_Resume.pdf`);
    toast.success("PDF downloaded!");
  };

  const accent = TEMPLATES.find((t) => t.key === template).accent;

  return (
    <div>
      <PageHeader eyebrow="Resume Studio" icon="file-text" title="ATS Resume Builder" subtitle="Build a clean, ATS-friendly resume, improve it with AI, and export to PDF."
        actions={<div className="flex gap-2">
          <Button variant="outline" onClick={save} data-testid="resume-save-btn"><Icon name="save" className="mr-2 h-4 w-4" /> Save</Button>
          <Button onClick={downloadPDF} data-testid="resume-download-btn"><Icon name="download" className="mr-2 h-4 w-4" /> PDF</Button>
        </div>} />
      <AIBanner configured={status?.configured} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-5">
          <div className="card-surface p-5">
            <div className="flex items-center gap-2 mb-3">
              {TEMPLATES.map((t) => (
                <button key={t.key} onClick={() => setTemplate(t.key)} className={cn("rounded-lg border px-3 py-1.5 text-sm", template === t.key ? "border-primary bg-primary/10 text-primary" : "border-border")} data-testid={`tpl-${t.key}`}>{t.label}</button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Name" value={data.name} onChange={set("name")} data-testid="r-name" />
              <Input placeholder="Title" value={data.title} onChange={set("title")} />
              <Input placeholder="Email" value={data.email} onChange={set("email")} />
              <Input placeholder="Phone" value={data.phone} onChange={set("phone")} />
              <Input placeholder="Location" value={data.location} onChange={set("location")} className="sm:col-span-2" />
            </div>
          </div>

          <div className="card-surface p-5">
            <label className="text-sm font-semibold mb-2 block">Summary</label>
            <textarea value={data.summary} onChange={set("summary")} rows={3} className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <label className="text-sm font-semibold mb-2 mt-4 block">Skills (comma separated)</label>
            <Input value={data.skills} onChange={set("skills")} />
          </div>

          {[
            { key: "experience", label: "Experience", tmpl: { role: "", company: "", period: "", desc: "" }, fields: [["role", "Role"], ["company", "Company"], ["period", "Period"], ["desc", "Description"]] },
            { key: "education", label: "Education", tmpl: { degree: "", school: "", period: "", detail: "" }, fields: [["degree", "Degree"], ["school", "School"], ["period", "Period"], ["detail", "Detail"]] },
            { key: "projects", label: "Projects", tmpl: { name: "", desc: "" }, fields: [["name", "Name"], ["desc", "Description"]] },
          ].map((sec) => (
            <div key={sec.key} className="card-surface p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{sec.label}</h3>
                <Button size="sm" variant="ghost" onClick={() => addItem(sec.key, sec.tmpl)} data-testid={`add-${sec.key}`}><Icon name="plus" className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-4">
                {data[sec.key].map((it, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    {sec.fields.map(([f, ph]) => (
                      <Input key={f} placeholder={ph} value={it[f]} onChange={setArr(sec.key, i, f)} className={f === "desc" ? "col-span-2" : ""} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full" onClick={analyze} disabled={busy} data-testid="resume-analyze-btn">
            {busy ? <Icon name="loader-2" className="h-4 w-4 animate-spin" /> : <><Icon name="sparkles" className="mr-2 h-4 w-4" /> Analyze ATS score with AI</>}
          </Button>

          {analysis && (
            <div className="card-surface p-5 bg-ai/5 border-ai/30" data-testid="ats-result">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-14 w-14 rounded-full bg-ai/15 text-ai flex items-center justify-center font-display font-bold">{analysis.atsScore}</div>
                <div><div className="font-semibold">ATS Score</div><div className="text-sm text-muted-foreground">out of 100</div></div>
              </div>
              {analysis.improvements && <div className="text-sm"><div className="font-semibold mb-1">Improvements</div><ul className="space-y-1 text-muted-foreground">{analysis.improvements.map((x, i) => <li key={i} className="flex gap-1.5"><Icon name="arrow-right" className="h-4 w-4 text-ai shrink-0 mt-0.5" /> {x}</li>)}</ul></div>}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-24 self-start">
          <div ref={previewRef} className="bg-white text-slate-900 rounded-xl border border-border p-8 shadow-lg" data-testid="resume-preview" style={{ minHeight: 600 }}>
            <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: 12, marginBottom: 16 }}>
              <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: accent }}>{data.name}</h1>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#334155" }}>{data.title}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{data.email} · {data.phone} · {data.location}</div>
            </div>
            <Section title="Summary" accent={accent}><p style={{ fontSize: 13, color: "#334155" }}>{data.summary}</p></Section>
            <Section title="Skills" accent={accent}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.skills.split(",").map((s, i) => <span key={i} style={{ fontSize: 11, background: `${accent}18`, color: accent, padding: "2px 8px", borderRadius: 4 }}>{s.trim()}</span>)}
              </div>
            </Section>
            <Section title="Experience" accent={accent}>
              {data.experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><b>{e.role}</b><span style={{ color: "#64748b" }}>{e.period}</span></div>
                  <div style={{ fontSize: 12, color: accent }}>{e.company}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{e.desc}</div>
                </div>
              ))}
            </Section>
            <Section title="Education" accent={accent}>
              {data.education.map((e, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><b>{e.degree}</b><span style={{ color: "#64748b" }}>{e.period}</span></div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{e.school} · {e.detail}</div>
                </div>
              ))}
            </Section>
            <Section title="Projects" accent={accent}>
              {data.projects.map((p, i) => (
                <div key={i} style={{ marginBottom: 6, fontSize: 12 }}><b>{p.name}</b> — <span style={{ color: "#475569" }}>{p.desc}</span></div>
              ))}
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: accent, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}
