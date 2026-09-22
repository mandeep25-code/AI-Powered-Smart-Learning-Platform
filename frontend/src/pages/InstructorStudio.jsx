import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageHeader, Icon, StatCard, Loader, EmptyState } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function InstructorStudio() {
  const qc = useQueryClient();
  const [courseOpen, setCourseOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(null); // courseId
  const [cForm, setCForm] = useState({ title: "", description: "", category: "Software", level: "Beginner" });
  const [tForm, setTForm] = useState({ title: "", content: "", durationMin: 15 });

  const { data: dash, isLoading } = useQuery({ queryKey: ["instructor-dash"], queryFn: async () => (await api.get("/instructor/dashboard")).data });
  const { data: students } = useQuery({ queryKey: ["instructor-students"], queryFn: async () => (await api.get("/instructor/students")).data });

  const createCourse = async () => {
    if (!cForm.title) return toast.error("Title required");
    try { await api.post("/instructor/courses", cForm); toast.success("Course created"); setCourseOpen(false); setCForm({ title: "", description: "", category: "Software", level: "Beginner" }); qc.invalidateQueries({ queryKey: ["instructor-dash"] }); }
    catch (_) { toast.error("Failed"); }
  };
  const addTopic = async () => {
    if (!tForm.title) return toast.error("Title required");
    try { await api.post(`/instructor/courses/${topicOpen}/topics`, tForm); toast.success("Topic added"); setTopicOpen(null); setTForm({ title: "", content: "", durationMin: 15 }); }
    catch (_) { toast.error("Failed"); }
  };
  const del = async (id) => { try { await api.delete(`/instructor/courses/${id}`); toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["instructor-dash"] }); } catch (_) {} };

  if (isLoading || !dash) return <Loader />;
  const s = dash.stats;

  return (
    <div>
      <PageHeader eyebrow="Instructor Studio" icon="presentation" title="Teacher Dashboard" subtitle="Create courses, add topics and track your students' progress."
        actions={
          <Dialog open={courseOpen} onOpenChange={setCourseOpen}>
            <DialogTrigger asChild><Button data-testid="create-course-btn"><Icon name="plus" className="mr-2 h-4 w-4" /> New course</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create a course</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Course title" value={cForm.title} onChange={(e) => setCForm({ ...cForm, title: e.target.value })} data-testid="course-title-input" />
                <textarea placeholder="Description" value={cForm.description} onChange={(e) => setCForm({ ...cForm, description: e.target.value })} rows={3} className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Category" value={cForm.category} onChange={(e) => setCForm({ ...cForm, category: e.target.value })} />
                  <Input placeholder="Level" value={cForm.level} onChange={(e) => setCForm({ ...cForm, level: e.target.value })} />
                </div>
              </div>
              <DialogFooter><Button onClick={createCourse} data-testid="save-course-btn">Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        } />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="book-open" label="Courses" value={s.courses} accent="primary" />
        <StatCard icon="users" label="Students" value={s.totalStudents} accent="secondary" />
        <StatCard icon="user-check" label="Enrollments" value={s.totalEnrollments} accent="ai" />
        <StatCard icon="trending-up" label="Avg progress" value={`${s.avgProgress}%`} accent="success" />
      </div>

      <Tabs defaultValue="courses">
        <TabsList className="mb-6">
          <TabsTrigger value="courses" data-testid="tab-my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="students" data-testid="tab-students">Student Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          {!dash.courses.length ? (
            <EmptyState icon="book-open" title="No courses yet" desc="Create your first course to get started." />
          ) : (
            <div className="space-y-3">
              {dash.courses.map((c) => (
                <div key={c._id} className="card-surface p-5 flex items-center gap-4" data-testid={`inst-course-${c._id}`}>
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Icon name="book-open" className="h-5 w-5" /></div>
                  <div className="flex-1"><div className="font-medium">{c.title}</div><div className="text-xs text-muted-foreground">{c.category} · {c.level} · {c.enrolledCount} enrolled</div></div>
                  <Button size="sm" variant="outline" onClick={() => setTopicOpen(c._id)} data-testid={`add-topic-${c._id}`}><Icon name="plus" className="h-4 w-4 mr-1" /> Topic</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => del(c._id)} data-testid={`del-course-${c._id}`}><Icon name="trash-2" className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="students">
          {!students?.students?.length ? (
            <EmptyState icon="users" title="No students yet" desc="Once students enroll, their progress appears here." />
          ) : (
            <div className="card-surface divide-y divide-border">
              {students.students.map((st, i) => (
                <div key={i} className="flex items-center gap-4 p-4" data-testid={`student-${i}`}>
                  <div className="h-9 w-9 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-semibold text-sm">{st.name?.slice(0, 2).toUpperCase()}</div>
                  <div className="flex-1 min-w-0"><div className="font-medium">{st.name}</div><div className="text-xs text-muted-foreground">{st.course}</div></div>
                  <div className="w-32"><Progress value={st.progressPct} className="h-1.5" /></div>
                  <span className="text-sm font-semibold w-10 text-right">{st.progressPct}%</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!topicOpen} onOpenChange={() => setTopicOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add a topic</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Topic title" value={tForm.title} onChange={(e) => setTForm({ ...tForm, title: e.target.value })} data-testid="topic-title-input" />
            <textarea placeholder="Content / notes" value={tForm.content} onChange={(e) => setTForm({ ...tForm, content: e.target.value })} rows={4} className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <Input type="number" placeholder="Duration (min)" value={tForm.durationMin} onChange={(e) => setTForm({ ...tForm, durationMin: Number(e.target.value) })} />
          </div>
          <DialogFooter><Button onClick={addTopic} data-testid="save-topic-btn">Add topic</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
