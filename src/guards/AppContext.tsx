import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

interface User {
  userId: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
  getProfile: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    if (!session) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { user: supaUser } = session;

    setUser({
      userId: supaUser.id,
      email: supaUser.email ?? undefined,
    });

    setLoading(false);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
      return;
    }
    setUser(null);
    toast.success("Signed out successfully");
  };

  const getProfile = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.userId)
      .single();

    if (error) {
      console.error("Error fetching Supabase profile:", error);
      return null;
    }

    return data;
  };

  useEffect(() => {
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            userId: session.user.id,
            email: session.user.email ?? undefined,
          });
        } else {
          setUser(null);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signOut, checkUser, getProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AppProvider");
  }
  return context;
};
