import { PageHeader, Icon } from "@/components/common/ui";
import { Badge } from "@/components/ui/badge";

const resources = [
  ["Take U Forward", "DSA roadmaps, interview sheets and structured problem-solving patterns.", "https://takeuforward.org/", "DSA"],
  ["CodeWithHarry", "Free beginner-friendly programming courses, projects and articles.", "https://www.codewithharry.com/", "Learn"],
  ["Love Babbar", "Placement-oriented DSA sheets and structured interview preparation.", "https://www.codehelp.in/", "Placement"],
  ["LeetCode", "The standard platform for algorithmic interview practice.", "https://leetcode.com/", "Practice"],
  ["GeeksforGeeks", "Reference material, company questions, CS fundamentals and practice.", "https://www.geeksforgeeks.org/", "Reference"],
  ["roadmap.sh", "Visual role-based developer roadmaps and skill checklists.", "https://roadmap.sh/", "Roadmaps"],
  ["freeCodeCamp", "Long-form free courses and real portfolio projects.", "https://www.freecodecamp.org/", "Learn"],
  ["MDN Web Docs", "Authoritative documentation for HTML, CSS and JavaScript.", "https://developer.mozilla.org/", "Docs"],
  ["HackerRank", "Language practice, SQL exercises and hiring assessments.", "https://www.hackerrank.com/", "Practice"],
  ["CodeChef", "Competitive programming contests and beginner learning paths.", "https://www.codechef.com/", "Practice"],
  ["NPTEL", "University-quality courses in CS, engineering and management.", "https://nptel.ac.in/", "Courses"],
  ["InterviewBit", "Guided interview preparation for programming and system design.", "https://www.interviewbit.com/", "Interview"],
];

export default function CareerLaunchpad() {
  return <div><PageHeader eyebrow="Curated tools" icon="rocket" title="Career Launchpad" subtitle="A quality-first collection of learning, practice and career tools — each chosen for a specific purpose." />
    <div className="rounded-2xl border border-ai/25 bg-gradient-to-r from-primary/10 via-ai/10 to-secondary/10 p-6 sm:p-8 mb-7"><div className="flex flex-col sm:flex-row gap-5 sm:items-center"><div className="h-14 w-14 rounded-2xl bg-ai/15 text-ai flex items-center justify-center"><Icon name="sparkles" className="h-7 w-7" /></div><div className="flex-1"><div className="eyebrow text-ai mb-1">Career partner</div><h2 className="font-display text-2xl font-bold">SkillMeet.AI</h2><p className="text-sm text-muted-foreground mt-1 max-w-2xl">A free, skills-focused career platform that brings verified jobs, projects, referrals, recruiter discovery, a public profile and a career roadmap together in one place.</p></div><a href="https://skillmeet.ai/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Explore SkillMeet.AI <Icon name="arrow-up-right" className="ml-2 h-4 w-4" /></a></div></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{resources.map(([name, description, url, type]) => <a key={name} href={url} target="_blank" rel="noreferrer" className="card-surface card-hover p-5 group"><div className="flex items-center justify-between mb-3"><div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Icon name="compass" className="h-5 w-5" /></div><Badge variant="outline">{type}</Badge></div><h3 className="font-display font-semibold">{name}</h3><p className="text-sm text-muted-foreground mt-1 leading-6">{description}</p><div className="text-sm text-primary mt-4 flex items-center gap-1">Visit resource <Icon name="arrow-up-right" className="h-4 w-4" /></div></a>)}</div></div>;
}
