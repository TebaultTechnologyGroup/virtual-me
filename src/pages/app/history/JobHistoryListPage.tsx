import { useEffect, useState } from "react";
import { useAuth } from "@/guards/AppContext";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Loader2, Plus, Building2, ChevronRight } from "lucide-react";

interface JobDef {
  id: string;
  company: string;
  job_title: string;
  job_location?: string;
  start_year?: string;
  end_year?: string;
  is_current?: boolean;
}

const ICON_COLORS = [
  { bg: "bg-blue-50", icon: "text-blue-600" },
  { bg: "bg-violet-50", icon: "text-violet-600" },
  { bg: "bg-orange-50", icon: "text-orange-700" },
  { bg: "bg-teal-50", icon: "text-teal-600" },
  { bg: "bg-pink-50", icon: "text-pink-600" },
];

export default function JobHistoryListPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<JobDef[]>([]);

  async function fetchJobs() {
    if (!user) throw "Invalid User";
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_job_history")
        .select(
          "id, company, job_title, job_location, start_year, end_year, is_current",
        )
        .eq("user_id", user.userId)
        .order("is_current", { ascending: false })
        .order("start_year", { ascending: false });

      if (error) throw error;
      setJobs((data || []) as unknown as JobDef[]);
    } catch (error) {
      console.error("Load failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="flex justify-between items-start mb-8">
        <div>
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-1">
            Career profile
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Job history</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your work history trains your AI and powers resume generation.
          </p>
        </div>
        <Link to="/app/job-history/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
            <Plus className="w-4 h-4" />
            Add job
          </Button>
        </Link>
      </header>

      <div className="flex flex-col gap-3">
        {jobs.map((job, i) => {
          const color = ICON_COLORS[i % ICON_COLORS.length];
          const dateRange = job.is_current
            ? null
            : job.start_year && job.end_year
              ? `${job.start_year} – ${job.end_year}`
              : (job.start_year ?? null);

          return (
            <Link
              key={job.id}
              to={`/app/job-history/${job.id}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${color.bg}`}
              >
                <Building2 className={`h-5 w-5 ${color.icon}`} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {job.job_title}
                </p>
                <p className="truncate text-xs text-muted-foreground mt-0.5">
                  {job.company}
                  {job.job_location ? ` · ${job.job_location}` : ""}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {job.is_current ? (
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Current
                  </span>
                ) : dateRange ? (
                  <span className="text-xs text-muted-foreground">
                    {dateRange}
                  </span>
                ) : null}
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}

        <Link
          to="/app/job-history/new"
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-5 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add another job
        </Link>
      </div>
    </div>
  );
}
