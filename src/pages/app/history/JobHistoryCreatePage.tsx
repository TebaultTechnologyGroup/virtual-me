import { useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/guards/AppContext";
import { supabase } from "@/lib/supabase-client";
import { jobObjectSchema, type JobObjectValues } from "@/lib/validations/setup";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Loader2,
  Briefcase,
  Target,
  Trophy,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const YEARS = Array.from({ length: 60 }, (_, i) =>
  (new Date().getFullYear() - i).toString(),
);

export default function JobHistoryCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobObjectValues>({
    resolver: zodResolver(
      jobObjectSchema,
    ) as unknown as Resolver<JobObjectValues>,
    defaultValues: {
      company: "",
      location: "",
      title: "",
      description: "",
      startMonth: "",
      startYear: "",
      isCurrent: false,
      accomplishments: [""],
      awards: [""],
    },
  });

  const onSubmit = async (values: JobObjectValues) => {
    if (!user) throw "Invalid User";
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("user_job_history").insert({
        user_id: user.userId,
        company: values.company,
        job_location: values.location,
        job_title: values.title,
        job_description: values.description,
        start_month: values.startMonth,
        start_year: values.startYear,
        end_month: values.isCurrent ? null : values.endMonth,
        end_year: values.isCurrent ? null : values.endYear,
        is_current: values.isCurrent,
        accomplishments: values.accomplishments,
        awards: values.awards,
      });

      if (error) throw error;

      toast.success("Job added");
      navigate("/app/job-history");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Card className="border-2 border-slate-100 shadow-sm">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="w-5 h-5 text-blue-600" />
            New Job
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            The job information will be used to train your AI and for creating
            resumes.
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form id="job-create-form" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Company & Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3">
              <Controller
                name="company"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Company Name</FieldLabel>
                    <FieldGroup>
                      <Input {...field} placeholder="Motorola" />
                    </FieldGroup>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Location</FieldLabel>
                    <FieldGroup>
                      <Input {...field} placeholder="Atlanta, GA" />
                    </FieldGroup>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Job Title</FieldLabel>
                  <FieldGroup>
                    <Input {...field} placeholder="VP of Operations" />
                  </FieldGroup>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Dates Section */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>Start Date</FieldLabel>
                  <div className="flex gap-2">
                    <DateSelect
                      form={form}
                      name="startMonth"
                      items={MONTHS}
                      placeholder="Month"
                    />
                    <DateSelect
                      form={form}
                      name="startYear"
                      items={YEARS}
                      placeholder="Year"
                    />
                  </div>
                </Field>

                {!form.watch("isCurrent") && (
                  <Field>
                    <FieldLabel>End Date</FieldLabel>
                    <div className="flex gap-2">
                      <DateSelect
                        form={form}
                        name="endMonth"
                        items={MONTHS}
                        placeholder="Month"
                      />
                      <DateSelect
                        form={form}
                        name="endYear"
                        items={YEARS}
                        placeholder="Year"
                      />
                    </div>
                  </Field>
                )}

                <div className="flex items-center gap-2 pt-6">
                  <Checkbox
                    id="isCurrent"
                    checked={form.watch("isCurrent")}
                    onCheckedChange={(val) => form.setValue("isCurrent", !!val)}
                  />
                  <Label htmlFor="isCurrent">I currently work here</Label>
                </div>
              </div>
            </div>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <FieldGroup>
                    <Textarea
                      className="max-h-40 bg-white"
                      {...field}
                      placeholder="Core mission and scope. Keep this short. One or two sentences is sufficient. Focus on high-level overview of role, not day-to-day tasks."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldGroup>
                </Field>
              )}
            />

            <div className="space-y-4 pt-3">
              <Label className="text-blue-600 font-bold flex items-center gap-2">
                <Target className="w-4 h-4" /> Accomplishments
              </Label>
              <div className="text-sm text-muted-foreground">
                <p>
                  Enter 3 to 5 accomplishments. What you accomplished is more
                  important than what you did. Include numbers where possible.
                  For example:
                </p>
                <p>
                  "Secured 95% Gross Retention (GRR) and +50 NPS by
                  institutionalizing enterprise delivery governance and
                  executive alignment for top-tier accounts."
                </p>
              </div>
              <DynamicList
                fieldName="accomplishments"
                form={form}
                placeholder="Scaled revenue..."
                label="Accomplishment"
              />
            </div>

            <div className="space-y-4 pt-4">
              <Label className="text-blue-600 font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Awards
              </Label>
              <div className="text-sm text-muted-foreground">
                <p>
                  Enter any awards or recognitions you received in this role.
                  For example "Employee of the month"
                </p>
              </div>
              <DynamicList
                fieldName="awards"
                form={form}
                placeholder="Excellence award..."
                label="Award"
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="bg-white gap-2">
          <Button
            variant="ghost"
            className="w-32"
            onClick={() => navigate("/app/job-history")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="job-create-form"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 min-w-37.5"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Job
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function DateSelect({
  form,
  name,
  items,
  placeholder,
}: {
  form: any;
  name: string;
  items: string[];
  placeholder: string;
}) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value || ""}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {items.map((i) => (
              <SelectItem key={i} value={i.toLowerCase()}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

function DynamicList({
  fieldName,
  form,
  placeholder,
  label,
}: {
  fieldName: string;
  form: any;
  placeholder: string;
  label: string;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });
  return (
    <div className="space-y-2">
      {fields.map((f, k) => (
        <div key={f.id} className="flex gap-2">
          <Textarea
            {...form.register(`${fieldName}.${k}`)}
            placeholder={placeholder}
            className="bg-white"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(k)}
            disabled={fields.length === 1}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="link"
        size="sm"
        onClick={() => append("")}
        className="px-0"
      >
        <Plus className="w-3 h-3 mr-1" /> Add {label}
      </Button>
    </div>
  );
}
