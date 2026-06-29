// APPLICATION TRACKER
export type ApplicationStatus =
    | "draft"
    | "applied"
    | "screened"
    | "interviewing"
    | "accepted"
    | "rejected"
    | "declined"
    | "archive";

export type ApplicationPhase = "dashboard" | "detail" | "create";

export interface ApplicationContact {
    id: string;
    application_id: string;
    contact_name: string;
    contact_title?: string | null;
    email?: string | null;
    phone?: string | null;
    linkedin_url?: string | null;
    notes?: string | null;
    updated_at: string;
    created_at: string;
}

export interface ApplicationAction {
    id: string;
    application_id: string;
    action_name: string;
    action_description: string;
    due_date?: string | null;
    is_complete: boolean;
    created_at: string;
}

export interface ApplicationShortRecord {
    id: string;
    company_name: string;
    job_title: string;
    job_description?: string | null;
}


export interface ApplicationRecord {
    id: string;
    user_id: string;
    target_role_id?: string | null;
    resume_id?: string | null;
    company_name: string;
    job_title: string;
    job_location?: string | null;
    website?: string | null;
    job_url?: string | null;
    job_description?: string | null;
    cover_letter?: string | null;
    applied_date?: string | null;
    application_status: ApplicationStatus;
    created_at: string;
    // Joined
    contacts?: ApplicationContact[];
    actions?: ApplicationAction[];
    target_roles: { role_title: string } | null;
}

export interface CreateApplicationParams {
    company_name: string;
    job_title: string;
    job_location?: string;
    website?: string;
    job_url?: string;
    job_description?: string;
    applied_date?: string;
    target_role_id?: string;
    resume_id?: string;
    status: ApplicationStatus;
}

export const APPLICATION_STATUS_META: Record<
    ApplicationStatus,
    { label: string; color: string; bg: string; border: string; dot: string }
> = {
    draft: {
        label: "Draft",
        color: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-gray-200",
        dot: "bg-gray-500",
    },

    applied: {
        label: "Applied",
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
        dot: "bg-blue-500",
    },
    screened: {
        label: "Screened",
        color: "text-violet-700",
        bg: "bg-violet-50",
        border: "border-violet-200",
        dot: "bg-violet-500",
    },
    interviewing: {
        label: "Interviewing",
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        dot: "bg-amber-500",
    },
    accepted: {
        label: "Accepted",
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
    },
    rejected: {
        label: "Rejected",
        color: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
        dot: "bg-red-500",
    },
    declined: {
        label: "Declined",
        color: "text-slate-700",
        bg: "bg-slate-50",
        border: "border-slate-200",
        dot: "bg-slate-500",
    },
    archive: {
        label: "Archived",
        color: "text-slate-500",
        bg: "bg-slate-50",
        border: "border-slate-200",
        dot: "bg-slate-400",
    },
};
