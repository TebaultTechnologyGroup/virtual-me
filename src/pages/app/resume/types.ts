import type { ApplicationShortRecord } from "@/pages/app/applications/types";
import type { TargetRoleRecord } from "@/pages/app/role/UserTargetRoleTypes";

// RESUME BUILDER
export type ResumePhase = "instructions" | "generating" | "editor";
export type ResumeMode = "target_role" | "job_tailored";

export interface TargetRole {
    id: string;
    role_title: string;
}

export type FromValue = "ApplicationDetail" | "role";

export interface ResumeRow {
    id: string;
    user_id: string;
    role: [TargetRoleRecord];
    application: [ApplicationShortRecord]
    resume_mode: ResumeMode,
    resume_json: JSON; // Markdown or JSON block
    resume_html: string | null;
}

export interface ResumeConfigParams {
    user_id: string;
    mode: ResumeMode;
    targetRoleId: string;
    applicationId: string | null;
}


export interface ResumeResponse {
    title: string | null;
    contact: {
        address: string | null;
        phone: string | null;
        email: string | null;
        linkedin_url: string | null;
    },
    summary: string | null;
    skills: [string | null];
    job_history: [{
        company_name: string | null;
        location: string | null;
        start_date: string | null;
        end_date: string | null;
        position: string | null;
        description: string | null;
        accomplishments: [string | null];
        awards: [string | null];
    }];
    education: [string | null];
    certifications: string | null;
}









// export interface ResumeConfigParams {
//     mode: ResumeMode,
//     targetRoleId: string;
//     applicationId: string | null;

// }