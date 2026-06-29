import { useEffect, useState } from "react";
import { FileText, PlayCircle, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type {
  TargetRole,
  ResumeMode,
  ResumeConfigParams,
  FromValue,
} from "./../types";
import type { ApplicationRecord } from "../../applications/types";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ResumeInstructionsProps {
  user_id: string; // this should always be set to a valid id.
  target_role_id: string; // this should be a valid id.
  application: ApplicationRecord | null; // this may be null if coming from target_role
  onProceed: (params: ResumeConfigParams) => void; // pass back params
}

export default function ResumeInstructions({
  user_id,
  target_role_id,
  application,
  onProceed,
}: ResumeInstructionsProps) {
  const [mode, setMode] = useState<ResumeMode>("target_role");
  const [roles, setRoles] = useState<TargetRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(target_role_id);

  useEffect(() => {
    async function fetchActiveRoles() {
      setRolesLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_target_role")
          .select("id, role_title")
          .order("role_title", { ascending: true });

        if (error) throw error;
        setRoles(data || []);

        if (application?.target_role_id) {
          setSelectedRoleId(application.target_role_id);
        } else if (data && data.length > 0) {
          setSelectedRoleId(data[0].id);
        }
      } catch (err) {
        console.error("Failed target role pull configuration:", err);
        toast.error("Unable to resolve standard target structural maps.");
      } finally {
        setRolesLoading(false);
      }
    }
    fetchActiveRoles();
  }, []);

  // useEffect(() => {
  //   const title =
  //     roles.find((role) => role.id === selectedRoleId)?.role_title ?? "Error";
  //   setSelectedTitle(title);

  //   //    role_title = next((it["job_title"] for it in roles if it["id"] == selectedRoleId), None)
  // }, [selectedRoleId]);

  const canProceed = !!setSelectedRoleId;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Card className="border-2 border-slate-100 shadow-xl rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b p-6">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Build Your Resume
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {application && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mode
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMode("target_role")}
                  className={`p-4 rounded-xl border-2 text-left space-y-1.5 transition-all ${mode === "target_role" ? "border-blue-600 bg-blue-50/40" : "border-slate-100 hover:border-slate-300"}`}
                >
                  <div
                    className={`font-semibold text-sm ${mode === "target_role" ? "text-blue-700" : "text-slate-700"}`}
                  >
                    Standard Resume
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Use the standard resume based on the target role.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("job_tailored")}
                  className={`p-4 rounded-xl border-2 text-left space-y-1.5 transition-all ${mode === "job_tailored" ? "border-emerald-600 bg-emerald-50/40" : "border-slate-100 hover:border-slate-300"}`}
                >
                  <div
                    className={`font-semibold text-sm ${mode === "job_tailored" ? "text-emerald-700" : "text-slate-700"}`}
                  >
                    Job Specific Resume
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Create a resume for the specific job description.
                  </div>
                </button>
              </div>
            </div>
          )}
          {/* Target Profile Base Engine Map Element Selection Component */}
          <div className="space-y-2">
            {/* <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
              <Briefcase className="w-4 h-4 text-blue-600" /> Target Role:{" "}
              {selectedTitle ?? "Title is missing"}
            </div> */}
            {rolesLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />{" "}
                Locating configuration...
              </div>
            ) : (
              <div>
                <div className="text-sm">Select your target role</div>
                <div className="flex items-center gap-2 text-sm foreground py-2">
                  <Select
                    value={selectedRoleId}
                    defaultValue={selectedRoleId}
                    onValueChange={(value) => setSelectedRoleId(value)}
                  >
                    <SelectTrigger className="w-full rounded-xl border-2 bg-white text-sm">
                      <SelectValue placeholder="Select Base Framework Map" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {roles.map((role) => (
                        <SelectItem
                          key={role.id}
                          value={role.id}
                          className="text-sm"
                        >
                          {role.role_title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Run Target Deployment Execution Strategies Toggles */}

          {/* Operational Framework Notification Segment Layout */}
          <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 flex gap-3 text-xs leading-relaxed text-blue-800">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Resume Agent.</span> An AI agent
              will create your resume using your profile information and agent
              training data.
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/50 border-t px-6 py-4 flex items-center justify-between">
          {/* <Button
            variant="ghost"
            onClick={onCancel}
            className="w-24 text-sm font-medium"
          >
            Cancel
          </Button> */}
          <Button
            disabled={!canProceed}
            onClick={() =>
              onProceed({
                user_id,
                mode,
                targetRoleId: selectedRoleId,
                applicationId: application?.id ?? null,
              })
            }
            className="bg-blue-600 hover:bg-blue-700 min-w-44 font-medium rounded-xl gap-2 shadow-sm disabled:opacity-50"
          >
            <PlayCircle className="w-4 h-4" />
            {mode == "job_tailored" ? "Create Resume" : "Use Standard Resume"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
