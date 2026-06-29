import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/guards/AppContext";

// import JobDashboard from "./components/JobDashboard";
// import JobDetail from "./components/JobDetail";
// import CreateJob from "./components/CreateJob";

import type {
  ApplicationRecord,
  ApplicationPhase,
  CreateApplicationParams,
} from "./types";
import ApplicationDashboard from "./components/ApplicationDashboard";
import CreateApplication from "./components/CreateApplication";
import ApplicationDetail from "./components/ApplicationDetail";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<ApplicationPhase>("dashboard");
  const [activeApplication, setActiveApplication] =
    useState<ApplicationRecord | null>(null);

  const handleCreate = async (params: CreateApplicationParams) => {
    try {
      if (!user) throw "Invalid User";

      const { data, error } = await supabase
        .from("user_application")
        .insert({
          user_id: user.userId,
          ...params,
          applied_date:
            params.applied_date || new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Application added to your tracker.");
      setActiveApplication(data as ApplicationRecord);
      setPhase("detail");
    } catch (err) {
      console.error("Failed to create job record:", err);
      toast.error("Could not save job. Please try again.");
    }
  };

  const handleSelectApplication = (application: ApplicationRecord) => {
    setActiveApplication(application);
    setPhase("detail");
  };

  const handleBack = () => {
    setActiveApplication(null);
    setPhase("dashboard");
  };

  if (phase === "create") {
    return (
      <CreateApplication
        onCancel={() => setPhase("dashboard")}
        onSave={handleCreate}
      />
    );
  }

  if (phase === "detail" && activeApplication) {
    return (
      <ApplicationDetail
        application={activeApplication}
        onBack={handleBack}
        onApplicationUpdated={(updated) => setActiveApplication(updated)}
      />
    );
  }

  return (
    <ApplicationDashboard
      onCreateNew={() => setPhase("create")}
      onSelectApplication={handleSelectApplication}
    />
  );
}
