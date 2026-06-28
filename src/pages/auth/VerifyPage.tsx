import { useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useSearchParams } from "react-router";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") ?? "";
  const type = searchParams.get("type") ?? "";
  const email = searchParams.get("email") ?? "";

  useEffect(() => {
    if (!token || !type) return;

    supabase.auth
      .verifyOtp({ email, token, type })
      .then(() => {
        // success — redirect to dashboard
        window.location.href = "/dashboard";
      })
      .catch(() => {
        // error — redirect to login
        window.location.href = "/login?error=verification_failed";
      });
  }, [email, token, type]);

  return <p>Verifying your email…</p>;
}
