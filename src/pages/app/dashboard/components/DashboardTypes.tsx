// export interface DashboardData {
//   roles_complete: false;
//   personal_complete: false;
//   history_complete: false;
//   credentials_complete: false;
//   skills_complete: false;
//   applications: 0;
//}

export interface DashboardData {
  // Onboarding
  roles_complete: boolean;
  personal_complete: boolean;
  history_complete: boolean;
  credentials_complete: boolean;
  skills_complete: boolean;
  // Stats
  jobs_tracked: number;
  jobs_added_this_week: number;
  applications_sent: number;
  applications_awaiting: number;
  interviews_total: number;
  interviews_scheduled: number;
  avg_interview_minutes: number;
  longest_interview_minutes: number;
  resumes_created: number;
  resumes_this_week: number;
  // Twin activity
  twin_sessions: number;
  twin_total_minutes: number;
  twin_questions_answered: number;
  twin_avg_rating: number;
  // Pipeline
  jobs: JobEntry[] | null;
  events: EventEntry[] | null;
  interview_stages: InterviewStage[] | null;
}

export interface JobEntry {
  id: string;
  company: string;
  title: string;
  status: "Interviewing" | "Applied" | "Offer" | "Screening" | "Rejected";
}

export interface EventEntry {
  id: string;
  title: string;
  company: string;
  date_label: string;
  type: "interview" | "action" | "offer" | "prep" | "deadline";
}

export interface InterviewStage {
  label: string;
  count: number;
  max: number;
}
