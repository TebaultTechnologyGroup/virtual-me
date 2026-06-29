import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  PlusCircle,
  Loader2,
  CalendarClock,
  TrendingUp,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ApplicationRecord, ApplicationStatus } from "../types";
import { APPLICATION_STATUS_META } from "@/pages/app/applications/types";
import { useAuth } from "@/guards/AppContext";

interface ApplicationDashboardProps {
  onCreateNew: () => void;
  onSelectApplication: (job: ApplicationRecord) => void;
}

const STATUS_ORDER: ApplicationStatus[] = [
  "draft",
  "applied",
  "screened",
  "interviewing",
  "accepted",
  "rejected",
  "archive",
];

export default function ApplicationDashboard({
  onCreateNew,
  onSelectApplication,
}: ApplicationDashboardProps) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "all">(
    "all",
  );

  const fetchApplications = async () => {
    if (!user) throw "Invalid User";
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_application")
        .select(
          `id, 
          user_id, 
          resume_id,
          target_role_id, 
          company_name,
          job_title,
          job_description,
          job_location,
          job_url,
          website,
          applied_date,
          application_status,
          contacts: user_application_contact (contact_name, contact_title),
          actions: user_application_action (id, action_name, due_date),
          target_roles: user_target_role (role_title, professional_summary)          
          )`,
        )
        .eq("user_id", user.userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications((data || []) as unknown as ApplicationRecord[]);
    } catch (err) {
      console.error("Failed to fetch job tracker records:", err);
      toast.error("Unable to load your job pipeline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Pipeline stats
  const activeApplications = applications.filter(
    (j) => !["archive", "rejected", "accepted"].includes(j.application_status),
  );
  const upcomingActions = applications
    .flatMap((j) =>
      (j.actions || [])
        .filter((a) => !a.is_complete)
        .map((a) => ({ ...a, job: j })),
    )
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 5);

  const filteredApplications =
    filterStatus === "all"
      ? applications.filter((j) => j.application_status !== "archive")
      : applications.filter((j) => j.application_status === filterStatus);

  const countByStatus = (s: ApplicationStatus) =>
    applications.filter((j) => j.application_status === s).length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* ── Page Header ── */}
      <Card className="border-2 border-slate-100 shadow-sm">
        <CardHeader className="bg-slate-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BriefcaseBusiness className="w-5 h-5 text-blue-600" />
              Application Tracker
            </CardTitle>
            <Button
              onClick={onCreateNew}
              className="bg-blue-600 hover:bg-blue-700 font-medium gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" /> Track New Application
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your job search pipeline — track applications, contacts, and
            follow-up actions.
          </p>
        </CardHeader>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading your pipeline…</span>
        </div>
      )}

      {!loading && (
        <>
          {/* ── Pipeline Summary Strip ── */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {STATUS_ORDER.map((s) => {
              const meta = APPLICATION_STATUS_META[s];
              const count = countByStatus(s);
              return (
                <button
                  key={s}
                  onClick={() =>
                    setFilterStatus(filterStatus === s ? "all" : s)
                  }
                  className={`rounded-xl border-2 p-3 text-center transition-all ${
                    filterStatus === s
                      ? `${meta.bg} ${meta.border} shadow-sm`
                      : "bg-white border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`text-2xl font-bold ${filterStatus === s ? meta.color : "text-slate-700"}`}
                  >
                    {count}
                  </div>
                  <div
                    className={`text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${filterStatus === s ? meta.color : "text-slate-400"}`}
                  >
                    {meta.label}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Job Pipeline List ── */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {filterStatus === "all"
                    ? "Active Pipeline"
                    : APPLICATION_STATUS_META[filterStatus].label}
                  <span className="text-slate-300 font-normal">
                    ({filteredApplications.length})
                  </span>
                </h2>
                {filterStatus !== "all" && (
                  <button
                    onClick={() => setFilterStatus("all")}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              {filteredApplications.length === 0 && (
                <Card className="border-dashed border-2 border-slate-200">
                  <CardContent className="flex flex-col items-center justify-center py-14 gap-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-blue-500" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <p className="font-semibold text-slate-800">
                        No jobs tracked yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Start tracking your job applications to manage your
                        pipeline.
                      </p>
                    </div>
                    <Button
                      onClick={onCreateNew}
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Track Your First
                      Job
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onSelect={onSelectApplication}
                  />
                ))}
              </div>
            </div>

            {/* ── Right Sidebar: Upcoming Actions ── */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                  <CalendarClock className="w-3.5 h-3.5" />
                  Upcoming Actions
                </h2>

                {upcomingActions.length === 0 ? (
                  <Card className="border-slate-100">
                    <CardContent className="py-8 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        All caught up!
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        No pending actions.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {upcomingActions.map((action) => {
                      const isOverdue =
                        action.due_date &&
                        new Date(action.due_date) < new Date() &&
                        !action.is_complete;
                      return (
                        <button
                          key={action.id}
                          onClick={() => onSelectApplication(action.job)}
                          className="w-full text-left"
                        >
                          <Card className="border-slate-100 hover:border-blue-300 hover:shadow-sm transition-all">
                            <CardContent className="p-3 space-y-1">
                              <div className="flex items-start gap-2">
                                {isOverdue ? (
                                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                ) : (
                                  <CalendarClock className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                                )}
                                <p className="text-xs font-medium text-slate-700 line-clamp-2">
                                  {action.action_description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between pl-5">
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {action.job.company_name}
                                </p>
                                {action.due_date && (
                                  <span
                                    className={`text-[10px] font-semibold ${
                                      isOverdue
                                        ? "text-red-500"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {new Date(
                                      action.due_date,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Quick Stats ── */}
              <div className="space-y-3 pt-2">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Activity Summary
                </h2>
                <Card className="border-slate-100">
                  <CardContent className="p-4 space-y-3">
                    {[
                      {
                        label: "Active opportunities",
                        value: activeApplications.length,
                        color: "text-blue-600",
                      },
                      {
                        label: "In interview process",
                        value: countByStatus("interviewing"),
                        color: "text-amber-600",
                      },
                      {
                        label: "Pending actions",
                        value: applications
                          .flatMap((j) => j.actions || [])
                          .filter((a) => !a.is_complete).length,
                        color: "text-violet-600",
                      },
                      {
                        label: "Offers accepted",
                        value: countByStatus("accepted"),
                        color: "text-emerald-600",
                      },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-slate-500">{label}</span>
                        <span className={`text-sm font-bold ${color}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ApplicationCard({
  application,
  onSelect,
}: {
  application: ApplicationRecord;
  onSelect: (j: ApplicationRecord) => void;
}) {
  const meta =
    APPLICATION_STATUS_META[
      application?.application_status ?? ("draft" as ApplicationStatus)
    ];
  const pendingActions = (application.actions || []).filter(
    (a) => !a.is_complete,
  ).length;
  const overdueActions = (application.actions || []).filter(
    (a) => !a.is_complete && a.due_date && new Date(a.due_date) < new Date(),
  ).length;

  return (
    <Card
      key={application.id}
      className="w-full text-left group bg-white rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onSelect(application)}
    >
      <CardContent className="p-4 flex items-start gap-4">
        <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${meta.bg}`}>
          <BriefcaseBusiness className={`w-5 h-5 ${meta.color}`} />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {application.company_name}
            </h3>
            <Badge
              className={`text-[9px] px-1.5 py-0 rounded font-semibold tracking-wide uppercase shrink-0 border ${meta.bg} ${meta.color} ${meta.border}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${meta.dot} mr-1 inline-block`}
              />
              {meta.label}
            </Badge>
          </div>

          {application.target_roles?.role_title && (
            <p className="text-xs text-slate-500">
              {application.target_roles.role_title}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            {application.job_location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {application.job_location}
              </span>
            )}
            {application.applied_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Applied{" "}
                {new Date(application.applied_date).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                )}
              </span>
            )}
            {pendingActions > 0 && (
              <span
                className={`flex items-center gap-1 font-semibold ${
                  overdueActions > 0 ? "text-red-500" : "text-amber-600"
                }`}
              >
                <CalendarClock className="w-3 h-3" />
                {pendingActions} action{pendingActions > 1 ? "s" : ""}
                {overdueActions > 0 && ` (${overdueActions} overdue)`}
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 self-center group-hover:text-blue-400 transition-colors" />
      </CardContent>
    </Card>
  );
}
