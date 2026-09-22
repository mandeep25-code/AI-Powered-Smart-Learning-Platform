import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PageHeader, Icon, StatCard } from "@/components/common/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "", bio: user?.bio || "", careerGoal: user?.careerGoal || "",
    careerTrack: user?.careerTrack || "", dailyGoalMinutes: user?.dailyGoalMinutes || 30,
  });
  const [saving, setSaving] = useState(false);
  const { data: tracks } = useQuery({ queryKey: ["tracks"], queryFn: async () => (await api.get("/content/tracks")).data });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try { const { data } = await api.put("/users/profile", form); updateUser(data.user); toast.success("Profile updated"); }
    catch (_) { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader eyebrow="Account" icon="user" title="Your Profile" subtitle="Manage your details, career goal and daily learning target." />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-surface p-6 text-center">
          <Avatar className="h-24 w-24 mx-auto border-2 border-primary/30"><AvatarFallback className="bg-primary/15 text-primary font-display text-2xl font-bold">{(user?.name || "U").slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
          <h2 className="font-display text-xl font-bold mt-4">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <span className="glow-badge inline-flex rounded-full px-3 py-1 text-xs mt-3 capitalize">{user?.role}</span>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <StatCard icon="zap" label="XP" value={user?.xp || 0} accent="ai" />
            <StatCard icon="flame" label="Streak" value={user?.streak?.count || 0} accent="streak" />
          </div>
        </div>

        <div className="lg:col-span-2 card-surface p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Full name</label>
            <Input value={form.name} onChange={set("name")} data-testid="profile-name" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Bio</label>
            <textarea value={form.bio} onChange={set("bio")} rows={3} className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="profile-bio" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Career goal</label>
            <Input value={form.careerGoal} onChange={set("careerGoal")} placeholder="e.g. Become a Full Stack Developer" data-testid="profile-goal" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Career track</label>
              <Select value={form.careerTrack} onValueChange={(v) => setForm((f) => ({ ...f, careerTrack: v }))}>
                <SelectTrigger data-testid="profile-track"><SelectValue placeholder="Select track" /></SelectTrigger>
                <SelectContent>{tracks?.tracks?.map((t) => <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Daily goal (minutes)</label>
              <Input type="number" value={form.dailyGoalMinutes} onChange={(e) => setForm((f) => ({ ...f, dailyGoalMinutes: Number(e.target.value) }))} data-testid="profile-goal-mins" />
            </div>
          </div>
          <Button onClick={save} disabled={saving} data-testid="profile-save-btn">
            {saving ? <Icon name="loader-2" className="h-4 w-4 animate-spin" /> : <><Icon name="save" className="mr-2 h-4 w-4" /> Save changes</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
