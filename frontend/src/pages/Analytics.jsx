import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PageHeader, Icon, StatCard, Loader } from "@/components/common/ui";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

export default function Analytics() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: async () => (await api.get("/dashboard")).data });
  if (isLoading || !data) return <Loader />;
  const s = data.stats;
  const unlocked = data.achievements.filter((a) => a.unlocked).length;
  const goalData = [{ name: "goal", value: unlocked, fill: "hsl(var(--primary))" }];

  return (
    <div>
      <PageHeader eyebrow="Analytics" icon="bar-chart-3" title="Learning Analytics" subtitle="Track your study time, quiz performance and overall progress." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="clock" label="Total study time" value={`${s.studyHours} h`} accent="secondary" />
        <StatCard icon="target" label="Avg quiz score" value={`${s.avgQuizScore}%`} accent="success" />
        <StatCard icon="flame" label="Best streak" value={`${s.bestStreak} d`} accent="streak" />
        <StatCard icon="zap" label="Total XP" value={s.xp} accent="ai" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-surface p-6">
          <h2 className="font-display text-lg font-semibold mb-5">Quiz scores over time</h2>
          {data.quizTrend.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">Take quizzes to see analytics.</p> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.quizTrend}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card-surface p-6 flex flex-col items-center">
          <h2 className="font-display text-lg font-semibold mb-2 self-start">Badges unlocked</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={goalData} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, data.achievements.length]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={12} background={{ fill: "hsl(var(--muted))" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="font-display text-3xl font-bold -mt-24">{unlocked}<span className="text-lg text-muted-foreground">/{data.achievements.length}</span></div>
          <div className="text-sm text-muted-foreground mt-20">achievements earned</div>
        </div>
      </div>

      <div className="card-surface p-6 mt-6">
        <h2 className="font-display text-lg font-semibold mb-5">Course progress</h2>
        {data.coursesInProgress.length === 0 ? <p className="text-sm text-muted-foreground">No active courses yet.</p> : (
          <div className="space-y-4">
            {data.coursesInProgress.map((c) => (
              <div key={c.id}>
                <div className="flex justify-between text-sm mb-1.5"><span className="font-medium">{c.title}</span><span className="text-muted-foreground">{c.progressPct}%</span></div>
                <Progress value={c.progressPct} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
