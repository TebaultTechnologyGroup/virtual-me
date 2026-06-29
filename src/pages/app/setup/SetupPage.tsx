import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase-client";
import {
  BriefcaseBusiness,
  FileStack,
  FolderPen,
  Lightbulb,
  Check,
  Lock,
  ChevronRight,
  Loader2,
  Rocket,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/guards/AppContext";
import type { DashboardData } from "../dashboard/components/DashboardTypes";

interface CompletionState {
  general: boolean;
  jobHistory: boolean;
  credentials: boolean;
  skills: boolean;
  roles: boolean;
}

const SETUP_STEPS = [
  {
    key: "general" as const,
    title: "General information",
    description: "Contact details and location",
    icon: FolderPen,
    path: "/app/setup/general",
  },
  {
    key: "jobHistory" as const,
    title: "Job history",
    description: "Roles, companies, and accomplishments",
    icon: BriefcaseBusiness,
    path: "/app/job-history",
  },
  {
    key: "credentials" as const,
    title: "Credentials",
    description: "Education, certifications, and licenses",
    icon: FileStack,
    path: "/app/setup/credentials",
  },
  {
    key: "skills" as const,
    title: "Skills",
    description: "Expertise across different domains",
    icon: Lightbulb,
    path: "/app/setup/skills",
  },
  {
    key: "roles" as const,
    title: "Target Roles",
    description: "Create at least one Target Role",
    icon: Briefcase,
    path: "/app/role",
  },
];

export default function SetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  //const [data, setData] = useState<DashboardData | null>(null);
  const [completion, setCompletion] = useState<CompletionState>({
    general: false,
    jobHistory: false,
    credentials: false,
    skills: false,
    roles: false,
  });

  useEffect(() => {
    async function checkCompletion() {
      try {
        if (!user) throw "Invalid User";

        const { data: rpcData, error: rpcError } = await supabase
          .rpc("get_dashboard_data", { p_user_id: user.userId })
          .single();

        if (rpcError) throw rpcError;
        //  setData(rpcData as DashboardData);

        const d = rpcData as DashboardData;

        setCompletion({
          general: d?.personal_complete ?? false,
          jobHistory: d?.history_complete ?? false,
          credentials: d?.credentials_complete ?? false,
          skills: d?.skills_complete ?? false,
          roles: d?.roles_complete ?? false,
        });
      } catch (error) {
        console.error("Failed to check completion:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkCompletion();
  }, []);

  const completedCount = Object.values(completion).filter(Boolean).length;
  const totalCount = SETUP_STEPS.length;
  const allComplete = completedCount === totalCount;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  // First incomplete step gets "Up next" treatment
  const nextIncompleteKey =
    SETUP_STEPS.find((s) => !completion[s.key])?.key ?? null;

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-1">
          Onboarding
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Set up your profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1 mb-5">
          Complete all sections to unlock resume creation and agent training.
        </p>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {completedCount} of {totalCount} complete
          </span>
        </div>
      </header>

      <div className="flex flex-col gap-3 mb-6">
        {SETUP_STEPS.map((step) => {
          const done = completion[step.key];
          const isNext = step.key === nextIncompleteKey;
          const locked = !done && !isNext;
          const Icon = step.icon;

          return (
            <button
              key={step.key}
              onClick={() => !locked && navigate(step.path)}
              disabled={locked}
              className={[
                "w-full text-left flex items-center gap-4 rounded-xl px-5 py-4 transition-all",
                "border",
                done
                  ? "border-green-600/40 bg-card"
                  : isNext
                    ? "border-blue-500 border-2 bg-card hover:bg-blue-50/30"
                    : "border-border bg-card opacity-50 cursor-not-allowed",
                !locked && !done ? "cursor-pointer" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div
                className={[
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                  done
                    ? "bg-green-100"
                    : isNext
                      ? "bg-blue-50"
                      : "bg-secondary",
                ].join(" ")}
              >
                {done ? (
                  <Check className="w-4 h-4 text-green-700" />
                ) : (
                  <Icon
                    className={[
                      "w-4 h-4",
                      isNext ? "text-blue-600" : "text-muted-foreground",
                    ].join(" ")}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={"text-sm font-medium text-foreground"}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              </div>

              <div className="shrink-0">
                {done ? (
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
                    Done
                  </span>
                ) : isNext ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                      Up next
                    </span>
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                  </div>
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div
        className={[
          "rounded-xl border px-5 py-4 flex items-center gap-4 transition-all duration-500",
          allComplete
            ? "border-blue-500 bg-blue-50/50 cursor-pointer hover:bg-blue-50"
            : "border-border bg-secondary opacity-50 cursor-not-allowed",
        ].join(" ")}
        onClick={() => allComplete && navigate("/app")}
      >
        <div
          className={[
            "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
            allComplete ? "bg-blue-100" : "bg-background",
          ].join(" ")}
        >
          {allComplete ? (
            <Rocket className="w-4 h-4 text-blue-600" />
          ) : (
            <Lock className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {allComplete ? "You're ready to build" : "Unlock resume & agent"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {allComplete
              ? "Head to the dashboard to create resumes and train your agent."
              : "Complete all tasks above to unlock resume creation and agent training."}
          </p>
        </div>
        {allComplete && (
          <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
        )}
      </div>
    </div>
  );
}
