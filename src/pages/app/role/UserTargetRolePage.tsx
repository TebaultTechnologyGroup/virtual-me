import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/guards/AppContext";
import { supabase } from "@/lib/supabase-client";
import {
  userTargetRoleSchema,
  type UserTargetRoleFormValues,
} from "@/lib/validations/setup";
import { toast } from "sonner";
import { Plus, Trash2, Info, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { useNavigate } from "react-router";

const MAX_ROLES = 9;

export default function UserTargetRolePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<UserTargetRoleFormValues>({
    resolver: zodResolver(userTargetRoleSchema),
    defaultValues: {
      userTargetRoles: [{ role_title: "", professional_summary: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "userTargetRoles",
  });

  const fetchUserTargetRoles = async () => {
    if (!user) throw "Invalid User";
    try {
      const { data, error } = await supabase
        .from("user_target_role")
        .select("role_title, professional_summary")
        .eq("user_id", user.userId);

      if (error) throw error;

      if (data && data.length > 0) {
        form.reset({ userTargetRoles: data });
      }
    } catch (error) {
      console.error("Load failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTargetRoles();
  }, [form.reset]);

  const onSubmit = async (values: UserTargetRoleFormValues) => {
    if (!user) throw "Invalid User";
    setIsSubmitting(true);
    try {
      // get existing user roles
      const { data: existingRoles } = await supabase
        .from("user_target_role")
        .select("id")
        .eq("user_id", user.userId);

      // Find IDs that are in the DB and NOT in the form (deleted entries)
      const existingIds = existingRoles?.map((j) => j.id) || [];
      const formIds = values.userTargetRoles.map((j) => j.id).filter(Boolean);

      // Find IDs that are in the DB but NOT in the form
      const idsToDelete = existingIds.filter((id) => !formIds.includes(id));

      // Delete removed entries
      if (idsToDelete.length > 0) {
        await supabase.from("user_target_role").delete().in("id", idsToDelete);
      }

      // now upsert the form entries (new and existing)
      const rolesToUpsert = values.userTargetRoles.map((role) => ({
        ...(role.id ? { id: role.id } : {}),
        user_id: user.userId,
        role_title: role.role_title,
        professional_summary: role.professional_summary,
      }));

      const { error: upsertError } = await supabase
        .from("user_target_role")
        .upsert(rolesToUpsert, {
          onConflict: "id",
          ignoreDuplicates: false,
        });

      if (upsertError) throw upsertError;

      toast.success("Target roles synchronized");

      await fetchUserTargetRoles();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <form
        id="summary-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Card className="border-2 border-slate-100 shadow-sm">
          <CardHeader className="bg-slate-50/50">
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 min-w-37.5"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Target Roles
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Create professional summaries for each of your target roles. This
              will be used in resume creation and by the AI agents.
            </p>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="relative p-6 rounded-xl border-2 border-slate-100 bg-slate-50/30 space-y-6 transition-all hover:border-blue-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Controller
                      name={`userTargetRoles.${index}.role_title`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel className="text-blue-600 font-bold">
                            Target Job {index + 1}:
                          </FieldLabel>
                          <FieldGroup>
                            <Input
                              {...field}
                              placeholder="e.g., AI & Digital Transformation Leader"
                              className="bg-white"
                            />
                          </FieldGroup>
                          {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-8 text-slate-400 hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                <Controller
                  name={`userTargetRoles.${index}.professional_summary`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <div className="flex justify-between items-center mb-1">
                        <FieldLabel className="text-blue-600 font-bold">
                          Professional Summary
                        </FieldLabel>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Target: ~2 to 5 lines
                        </span>
                      </div>
                      <FieldGroup>
                        <Textarea
                          {...field}
                          placeholder="Strategic leader with 20+ years experience..."
                          className="min-h-32 bg-white resize-none leading-relaxed"
                        />
                      </FieldGroup>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>
            ))}

            {fields.length < MAX_ROLES ? (
              <Button
                type="button"
                variant="outline"
                className="w-full py-8 border-dashed border-2 hover:border-blue-500 hover:bg-blue-50 group transition-all"
                onClick={() =>
                  append({ role_title: "", professional_summary: "" })
                }
              >
                <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Add Target Role
              </Button>
            ) : (
              <div className="flex items-center justify-center p-4 rounded-lg bg-amber-50 text-amber-700 text-sm border border-amber-100">
                <Info className="w-4 h-4 mr-2" />
                Maximum of {MAX_ROLES} target roles reached.
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-slate-50/50">
            <Button
              variant="ghost"
              className="w-32"
              onClick={() => navigate("/app/setup")}
            >
              Back to Setup
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              form="summary-form"
              className="bg-emerald-600 hover:bg-emerald-700 min-w-37.5"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Target Roles
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
