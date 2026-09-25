// Integration-managed protected layout: gates /_authenticated/* behind Supabase auth.
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { user: error ? null : data.user };
    } catch {
      return { user: null };
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();

  useEffect(() => {
    if (!user) void navigate({ to: "/auth", replace: true });
  }, [navigate, user]);

  return user ? <Outlet /> : null;
}
