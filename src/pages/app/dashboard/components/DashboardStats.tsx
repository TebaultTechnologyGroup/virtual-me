"use client";
import {
  Bot,
  Clock,
  FileText,
  TrendingUp,
  Star,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import type { DashboardData, EventEntry, JobEntry } from "./DashboardTypes";

const STATUS_STYLES: Record<
  JobEntry["status"],
  { pill: string; dot?: string }
> = {
  Interviewing: { pill: "bg-blue-50 text-blue-700" },
  Applied: { pill: "bg-amber-50 text-amber-700" },
  Offer: { pill: "bg-green-50 text-green-700" },
  Screening: { pill: "bg-purple-50 text-purple-700" },
  Rejected: { pill: "bg-red-50 text-red-600" },
};

const EVENT_STYLES: Record<EventEntry["type"], { dot: string; badge: string }> =
  {
    interview: { dot: "bg-blue-400", badge: "bg-blue-50 text-blue-700" },
    action: { dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700" },
    offer: { dot: "bg-green-400", badge: "bg-green-50 text-green-700" },
    prep: { dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700" },
    deadline: { dot: "bg-orange-400", badge: "bg-orange-50 text-orange-700" },
  };

const BAR_COLORS = ["bg-blue-200", "bg-blue-400", "bg-blue-600", "bg-blue-800"];

function StatCard({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
      <p className="text-2xl font-medium text-foreground leading-none">
        {value}
      </p>
      {trend && (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </p>
      )}
      {sub && !trend && (
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function DashboardStats({ data }: { data: DashboardData }) {
  const totalInterviewMinutes = data.twin_total_minutes;
  const hours = Math.floor(totalInterviewMinutes / 60);
  const mins = totalInterviewMinutes % 60;
  const twinTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="mt-6 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-foreground">
            Your job search
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI twin is active · tracking {data.jobs_tracked} roles
          </p>
        </div>
        <button
          className="flex items-center gap-2 text-sm border border-border rounded-lg px-3 py-2 bg-card hover:bg-muted/50 transition-colors"
          onClick={() => {}}
        >
          <Bot className="w-4 h-4 text-blue-600" />
          Ask my twin
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      {/* Top stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <StatCard
          label="Jobs tracked"
          value={data.jobs_tracked}
          trend={`+${data.jobs_added_this_week} this week`}
        />
        <StatCard
          label="Applications sent"
          value={data.applications_sent}
          sub={`${data.applications_awaiting} awaiting response`}
        />
        <StatCard
          label="Virtual interviews"
          value={data.interviews_total}
          sub={`${data.interviews_scheduled} scheduled`}
        />
        <StatCard
          label="Avg. duration"
          value={`${data.avg_interview_minutes}m`}
          sub={`longest: ${data.longest_interview_minutes}m`}
        />
        <StatCard
          label="Resumes created"
          value={data.resumes_created}
          sub={`${data.resumes_this_week} tailored this week`}
        />
      </div>

      {/* Middle two-col: events + jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Upcoming events */}
        <SectionCard title="Upcoming events">
          <div className="space-y-2.5">
            {(data.events ?? []).map((ev) => {
              const s = EVENT_STYLES[ev.type];
              return (
                <div key={ev.id} className="flex items-start gap-2.5">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${s.dot}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{ev.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ev.company} · {ev.date_label}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${s.badge}`}
                  >
                    {ev.date_label === "Today"
                      ? "Today"
                      : ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Active jobs */}
        <SectionCard title="Active jobs">
          <div className="space-y-2">
            {(data.jobs ?? []).map((job) => {
              const initials = job.company.slice(0, 2);
              const s = STATUS_STYLES[job.status];
              return (
                <div
                  key={job.id}
                  className="flex items-center gap-2.5 bg-muted/40 rounded-lg px-2.5 py-2"
                >
                  <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-medium shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {job.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {job.company}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${s.pill}`}
                  >
                    {job.status}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Bottom two-col: interview stages + twin activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Interview stages */}
        <SectionCard title="Interviews by stage">
          <div className="space-y-2.5 mt-1">
            {(data.interview_stages ?? []).map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-2.5">
                <p className="text-xs text-muted-foreground w-24 text-right shrink-0">
                  {stage.label}
                </p>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                    style={{ width: `${(stage.count / stage.max) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground w-4 text-right shrink-0">
                  {stage.count}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Twin activity */}
        <SectionCard title="AI twin activity">
          <div className="divide-y divide-border">
            {[
              {
                icon: <Bot className="w-4 h-4" />,
                label: "Sessions hosted",
                value: data.twin_sessions,
              },
              {
                icon: <Clock className="w-4 h-4" />,
                label: "Total time",
                value: twinTime,
              },
              {
                icon: <MessageSquare className="w-4 h-4" />,
                label: "Questions answered",
                value: data.twin_questions_answered,
              },
              {
                icon: <Star className="w-4 h-4" />,
                label: "Avg. recruiter rating",
                value: `${data.twin_avg_rating.toFixed(1)} / 5`,
              },
              {
                icon: <FileText className="w-4 h-4" />,
                label: "Resumes sent",
                value: data.resumes_created,
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2"
              >
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  {icon}
                  {label}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
