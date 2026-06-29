"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Globe, MapPin, Link, Save, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPLICATION_STATUS_META } from "../types";
import type { ApplicationRecord, ApplicationStatus } from "../types";

interface JobOverviewProps {
  application: ApplicationRecord;
  onApplicationUpdated: (application: ApplicationRecord) => void;
}

export default function ApplicationOverview({
  application,
  onApplicationUpdated,
}: JobOverviewProps) {
  const [saving, setSaving] = useState(false);

  // ── Local edit state — all seeded from the job prop ──────────────────────
  const [companyName, setCompanyName] = useState(application.company_name);
  const [jobTitle, setJobTitle] = useState(application.job_title || "");
  const [jobLocation, setJobLocation] = useState(
    application.job_location || "",
  );
  const [website, setWebsite] = useState(application.website || "");
  const [jobUrl, setJobUrl] = useState(application.job_url || "");
  const [appliedDate, setAppliedDate] = useState(
    application.applied_date || "",
  );
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>(
    application.application_status,
  ); // ← was hardcoded "applied" before
  const [jobDescription, setJobDescription] = useState(
    application.job_description || "",
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        company_name: companyName,
        job_title: jobTitle || null,
        job_location: jobLocation || null,
        website: website || null,
        job_url: jobUrl || null,
        applied_date: appliedDate || null,
        application_status: applicationStatus,
        job_description: jobDescription || null,
      };

      const { error } = await supabase
        .from("job_tracker")
        .update(updates)
        .eq("id", application.id);

      if (error) throw error;

      onApplicationUpdated({ ...application, ...updates } as ApplicationRecord);
      toast.success("Application details saved.");
    } catch {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* ── Status & Dates ── */}
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status &amp; Dates
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Pipeline Status
                </label>
                <Select
                  value={applicationStatus}
                  onValueChange={(v) =>
                    setApplicationStatus(v as ApplicationStatus)
                  }
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
            </div>
          </CardContent>
        </Card>

        {/* ── Company Information ── */}
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Company Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl border-2 focus-visible:outline-none focus-visible:border-blue-500 bg-white"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  Application Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full text-sm px-3 py-2 rounded-xl border-2 focus-visible:outline-none focus-visible:border-blue-500 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  <MapPin className="w-3 h-3 inline mr-1" />
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
                  <Globe className="w-3 h-3 inline mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://"
                  className="w-full text-sm px-3 py-2 rounded-xl border-2 focus-visible:outline-none focus-visible:border-blue-500 bg-white"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">
                  <Link className="w-3 h-3 inline mr-1" />
                  URL to Job Posting
                </label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="e.g. https://www.acme.com/jobs/123 ... "
                  className="w-full text-sm px-3 py-2 rounded-xl border-2 focus-visible:outline-none focus-visible:border-blue-500 bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Job Description ── */}
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Job Description
            </h3>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here. Clean up the text to help the AI better understand the job."
              rows={8}
              className="rounded-xl border-2 text-sm leading-relaxed bg-white resize-none"
            />
          </CardContent>
        </Card>

        {/* ── Save Button ── */}
        <div className="flex justify-end pb-6">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
