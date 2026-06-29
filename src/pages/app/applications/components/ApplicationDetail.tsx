"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Globe,
  ExternalLink,
  MapPin,
  FileText,
  Users,
  ListTodo,
  FileUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APPLICATION_STATUS_META } from "../types";
import type { ApplicationRecord } from "../types";
import ApplicationOverview from "./ApplicationOverview";
import ApplicationContacts from "./ApplicationContacts";
import ApplicationActions from "./ApplicationActions";
import ResumeStudio from "@/pages/app/resume/ResumeStudio";

interface ApplicationDetailProps {
  application: ApplicationRecord;
  onBack: () => void;
  onApplicationUpdated: (application: ApplicationRecord) => void;
}

type Tab = "overview" | "resume" | "letter" | "contacts" | "actions";

export default function ApplicationDetail({
  application: initialApplication,
  onBack,
  onApplicationUpdated,
}: ApplicationDetailProps) {
  const [application, setApplication] =
    useState<ApplicationRecord>(initialApplication);
  const [tab, setTab] = useState<Tab>("overview");

  const handleApplicationUpdated = (updated: ApplicationRecord) => {
    setApplication(updated); // keep header in sync (name, status, location)
    onApplicationUpdated(updated); // bubble up to ApplicationStudio / dashboard
  };

  const meta = APPLICATION_STATUS_META[application.application_status];

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: "resume",
      label: "Resume",
      icon: <FileUser className="w-3.5 h-3.5" />,
    },
    {
      id: "letter",
      label: "Cover Letter",
      icon: <FileText className="w-3.5 h-3.5" />,
    },

    {
      id: "contacts",
      label: "Contacts",
      icon: <Users className="w-3.5 h-3.5" />,
    },
    {
      id: "actions",
      label: "Actions",
      icon: <ListTodo className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50/50">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-slate-100 text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="w-4 h-4 text-slate-400" />
              <h1 className="text-sm font-semibold text-slate-900">
                {application.company_name}
              </h1>
              {application.job_title && (
                <span className="text-sm text-slate-400">
                  — {application.job_title}
                </span>
              )}
              <Badge
                className={`text-[9px] px-1.5 py-0 rounded border ${meta.bg} ${meta.color} ${meta.border}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${meta.dot} mr-1 inline-block`}
                />
                {meta.label}
              </Badge>
            </div>
            {application.job_location && (
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {application.job_location}
              </p>
            )}
          </div>
        </div>

        {application.website && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 text-xs gap-1.5"
          >
            <a
              href={application.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="w-3.5 h-3.5" /> Website
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        )}
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex border-b bg-white px-6 shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
              tab === t.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {tab === "overview" && (
        <ApplicationOverview
          application={application}
          onApplicationUpdated={handleApplicationUpdated}
        />
      )}
      {tab === "resume" && (
        <ResumeStudio
          from="ApplicationDetail"
          roleId={application.target_role_id!}
          application={application}
        />
      )}
      {tab === "contacts" && (
        <ApplicationContacts
          application={application}
          onApplicationUpdated={handleApplicationUpdated}
        />
      )}
      {tab === "actions" && (
        <ApplicationActions
          application={application}
          onApplicationUpdated={handleApplicationUpdated}
        />
      )}
    </div>
  );
}
