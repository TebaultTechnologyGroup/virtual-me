import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
  ArrowLeft,
  BriefcaseBusiness,
  PlayCircle,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateApplicationParams, ApplicationStatus } from "../types";
import { APPLICATION_STATUS_META } from "../types";

interface TargetRole {
  id: string;
  role_title: string;
}

interface CreateApplicationProps {
  onCancel: () => void;
  onSave: (params: CreateApplicationParams) => void;
}

export default function CreateApplication({
  onCancel,
  onSave,
}: CreateApplicationProps) {
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<TargetRole[]>([]);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [targetRoleId, setTargetRoleId] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("draft");

  useEffect(() => {
    supabase
      .from("target_roles")
      .select("id, role_title")
      .order("role_title")
      .then(({ data }) => setRoles(data || []));
  }, []);

  const canSave = !!companyName.trim();

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        job_location: jobLocation || undefined,
        website: website || undefined,
        job_url: jobUrl || undefined,
        job_description: jobDescription || undefined,
        applied_date: appliedDate || undefined,
        target_role_id: targetRoleId || undefined,
        status,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="mb-4 text-muted-foreground hover:text-slate-700 gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to application pipeline
      </Button>

      <Card className="border-2 border-slate-100 shadow-xl rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b p-6">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BriefcaseBusiness className="w-5 h-5 text-blue-600" /> Track a New
            Application
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Add a new application to your application tracking pipeline.
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Company Info */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              1. Company and Job Information
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Technologies"
                  className="w-full text-sm px-3 py-2 rounded-xl border-2 focus-visible:outline-none focus-visible:border-blue-500 bg-white"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Director of Important Stuff"
                  className="w-full text-sm px-3 py-2 rounded-xl border-2 focus-visible:outline-none focus-visible:border-blue-500 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Location
                </label>
                <input
                  type="text"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  placeholder="e.g. Atlanta, GA (Remote)"
                  className="w-full text-sm px-3 py-2 rounded-xl border-2 focus-visible:outline-none focus-visible:border-blue-500 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Application Date
                </label>
                <input
                  type="date"
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl border-2 focus-visible:outline-none focus-visible:border-blue-500 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Company Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.acme.com"
                  className="w-full text-sm px-3 py-2 rounded-xl border-2 focus-visible:outline-none focus-visible:border-blue-500 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Job URL
                </label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="e.g. https://www.acme.com/jobs/12345"
                  className="w-full text-sm px-3 py-2 rounded-xl border-2 focus-visible:outline-none focus-visible:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              2. Role & Status
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Target Role Profile
                </label>
                <Select value={targetRoleId} onValueChange={setTargetRoleId}>
                  <SelectTrigger className="w-full rounded-xl border-2 bg-white text-sm">
                    <SelectValue placeholder="Select target role…" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id} className="text-sm">
                        {r.role_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Application Status
                </label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as ApplicationStatus)}
                >
                  <SelectTrigger className="w-full rounded-xl border-2 bg-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {(
                      Object.keys(
                        APPLICATION_STATUS_META,
                      ) as ApplicationStatus[]
                    ).map((s) => (
                      <SelectItem key={s} value={s} className="text-sm">
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${APPLICATION_STATUS_META[s].dot}`}
                          />
                          {APPLICATION_STATUS_META[s].label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              3. Job Description
            </label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here for future reference and resume generation..."
              rows={5}
              className="rounded-xl border-2 text-sm leading-relaxed bg-white resize-none"
            />
          </div>

          <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 flex gap-3 text-xs leading-relaxed text-blue-800">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Contacts &amp; Actions.</span>{" "}
              Save the opportunity to create a resume, cover letter, contacts,
              and schedule follow-up actions.
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/50 border-t px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="w-24 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            disabled={!canSave || saving}
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 min-w-44 font-medium rounded-xl gap-2 shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PlayCircle className="w-4 h-4" />
            )}
            Save Application Tracking Information
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
