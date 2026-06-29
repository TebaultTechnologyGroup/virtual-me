import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  FileText,
  PlusCircle,
  Trash2,
  Loader2,
  ChevronRight,
  Sparkles,
  CircleDashed,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResumeRow } from "./../types";

interface SelectResumeProps {
  onStartNew: () => void;
  onSelectResume: (resume: ResumeRow) => void;
}

export default function SelectResume({
  onStartNew,
  onSelectResume,
}: SelectResumeProps) {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("user_resumes").select("*");

      if (error) throw error;
      setResumes((data || []) as unknown as ResumeRow[]);
    } catch (err) {
      console.error("Critical error reading repository vectors:", err);
      toast.error("Failed to pull down active resume instances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Stop dashboard layout clicking bubbling
    if (
      !confirm(
        "Are you sure you want to permanently erase this compilation output?",
      )
    )
      return;

    try {
      const { error } = await supabase
        .from("user_resumes")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Resume context deleted.");
      fetchResumes();
    } catch (err) {
      console.error("Erase operation failed:", err);
      toast.error("Failed to delete record storage block.");
    }
  };

  const targetRoleResumes = resumes.filter((r) => r.role.role_title != null);
  const jobTailoredResumes = resumes.filter(
    (r) => r.application.job_title != null,
  );

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* ── Page header ── */}
      <Card className="border-2 border-slate-100 shadow-sm">
        <CardHeader className="bg-slate-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BriefcaseBusiness className="w-5 h-5 text-blue-600" />
              <span
                className="text-muted-foreground font-normal cursor-pointer hover:underline"
                onClick={() => navigate("/app/resumes")}
              >
                Resumes
              </span>
              <span className="text-muted-foreground font-normal">&rarr;</span>
              Resume Builder Studio
            </CardTitle>

            <Button
              onClick={onStartNew}
              className="bg-blue-600 hover:bg-blue-700 font-medium gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" /> Create New Resume
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Construct tailored resume matrix maps leveraging verified user
            telemetry records.
          </p>
        </CardHeader>
      </Card>

      {/* ── Loading state ── */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading your training sessions…</span>
        </div>
      )}

      {/* ── No resumes  ── */}
      {!loading && resumes.length === 0 && (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-blue-500" />
            </div>
            <div className="space-y-1 max-w-sm">
              <p className="font-semibold text-slate-800">
                No resumes created yet
              </p>
              <p className="text-sm text-muted-foreground">
                Create your first resume for a target job or for a specific job
                you are applying to.
              </p>
            </div>
            <Button
              onClick={onStartNew}
              size="sm"
              variant="outline"
              className="gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Create Your First Resume
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── existing resumes sessions ── */}
      {!loading && resumes.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-2">
            <CircleDashed className="w-3.5 h-3.5" />
            Resumes
          </h2>
          <div className="space-y-2">
            {targetRoleResumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onSelect={onSelectResume}
                onDelete={handleDelete}
              />
            ))}
            {targetRoleResumes.length === 0 && (
              <p className="text-xs italic text-muted-foreground pl-2">
                No resumes for target roles
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── existing resumes sessions ── */}
      {!loading && resumes.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-2">
            <CircleDashed className="w-3.5 h-3.5" />
            Resumes
          </h2>
          <div className="space-y-2">
            {jobTailoredResumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onSelect={onSelectResume}
                onDelete={handleDelete}
              />
            ))}
            {jobTailoredResumes.length === 0 && (
              <p className="text-xs italic text-muted-foreground pl-2">
                No resumes for specific jobs
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function ResumeCard({
  resume,
  onSelect,
  onDelete,
}: {
  resume: ResumeRow;
  onSelect: (r: ResumeRow) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}) {
  const roleTitle = "Target Role Core";
  const title =
    (resume.role.role_title ?? false)
      ? roleTitle
      : `${resume.role.role_title || "Role Matrix"} — ${resume.application.company_name || "Enterprise Instance"}`;

  return (
    <Card className="w-full text-left group relative bg-white rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-md transition-all p-4 flex items-start gap-4">
      <div
        className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${(resume.role.role_title ?? false) ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}
      >
        <FileText className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 pr-8 space-y-1">
        <h3 className="font-semibold text-sm text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* {resume.job_description ?? false && resume.target_roles?.role_title && (
          <p className="text-xs font-medium text-slate-500">
            Base Profile Layer: {resume.target_roles.role_title}
          </p>
        )} */}

        <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
          <Badge
            variant="secondary"
            className={`text-[9px] px-1.5 py-0 rounded font-semibold tracking-wide uppercase ${(resume.role.role_title ?? false) ? "bg-blue-50/80 text-blue-700 border-blue-100" : "bg-emerald-50/80 text-emerald-700 border-emerald-100"}`}
          >
            {(resume.role.role_title ?? false) ? "Core Master" : "Job Tailored"}
          </Badge>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md"
          onClick={() => onSelect(resume)}
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md"
          onClick={(e) => onDelete(e, resume.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </div>
    </Card>
  );
}
