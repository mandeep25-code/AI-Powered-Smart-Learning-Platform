import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { PageHeader, Icon, Loader } from "@/components/common/ui";

export default function Achievements() {
  const { data, isLoading } = useQuery({ queryKey: ["achievements"], queryFn: async () => (await api.get("/gamification/achievements")).data });
  const { data: lb } = useQuery({ queryKey: ["leaderboard"], queryFn: async () => (await api.get("/gamification/leaderboard")).data });

  if (isLoading) return <Loader />;
  const unlocked = data.achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      <PageHeader eyebrow="Gamification" icon="trophy" title="Achievements & Leaderboard" subtitle={`You've unlocked ${unlocked} of ${data.achievements.length} badges. Keep the streak alive!`} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold mb-4">Badges</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.achievements.map((a, i) => (
              <motion.div key={a.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`card-surface p-5 flex items-center gap-4 ${a.unlocked ? "border-streak/40" : "opacity-60"}`} data-testid={`badge-${a.key}`}>
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 ${a.unlocked ? "bg-gradient-to-br from-streak/20 to-primary/20 text-streak" : "bg-muted text-muted-foreground/40"}`}>
                  <Icon name={a.unlocked ? a.icon : "lock"} className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold flex items-center gap-2">{a.title} {a.unlocked && <Icon name="check-circle-2" className="h-4 w-4 text-success" />}</div>
                  <div className="text-sm text-muted-foreground">{a.description}</div>
                  {a.xp > 0 && <div className="text-xs text-primary font-medium mt-1">+{a.xp} XP</div>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold mb-4">Leaderboard</h2>
          <div className="card-surface divide-y divide-border">
            {lb?.leaderboard?.map((u) => (
              <div key={u.rank} className={`flex items-center gap-3 p-3.5 ${u.isMe ? "bg-primary/5" : ""}`} data-testid={`lb-${u.rank}`}>
                <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${u.rank <= 3 ? "bg-streak/15 text-streak" : "bg-muted text-muted-foreground"}`}>{u.rank}</span>
                <div className="flex-1 min-w-0"><div className="font-medium text-sm truncate">{u.name} {u.isMe && <span className="text-xs text-primary">(you)</span>}</div><div className="text-xs text-muted-foreground">Level {u.level} · {u.streak}🔥</div></div>
                <span className="text-sm font-semibold text-primary">{u.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
