export type TargetRolePhase = "intro" | "list" | "create" | "edit";

export interface TargetRoleRecord {
  id: string;
  user_id: string;
  role_title: string;
  professional_summary: string;
}

export interface TargetRoleParams {
  user_id: string;
  role_title: string;
  professional_summary: string;
}
