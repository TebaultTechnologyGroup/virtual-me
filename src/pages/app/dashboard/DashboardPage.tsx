"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Loader2 } from "lucide-react";
import Instructions from "./components/DashboardInstructions";
import DashboardStats from "./components/DashboardStats";
import type { DashboardData } from "./components/DashboardTypes";
import { useAuth } from "@/guards/AppContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    if (user) {
      try {
        setIsLoading(true);

        const { data: rpcData, error: rpcError } = await supabase
          .rpc("get_dashboard_data", { p_user_id: user.userId })
          .single();

        if (rpcError) throw rpcError;
        setData(rpcData as DashboardData);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Could not load your dashboard. Please refresh to try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center p-12">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const onboardingComplete =
    data.roles_complete &&
    data.personal_complete &&
    data.history_complete &&
    data.credentials_complete &&
    data.skills_complete;

  return onboardingComplete ? (
    <DashboardStats data={data} />
  ) : (
    <Instructions
      profileComplete={
        data.personal_complete &&
        data.history_complete &&
        data.credentials_complete &&
        data.skills_complete
      }
      rolesComplete={data.roles_complete}
    />
  );
}
