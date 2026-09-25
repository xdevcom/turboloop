-- Harden exposed helpers and make RLS predicates initplan-friendly.
-- This migration is safe to apply once through Supabase migration history.

-- has_role is only checking rows visible to the caller, so SECURITY INVOKER
-- is safer than exposing a SECURITY DEFINER RPC to authenticated users.
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT (
    auth.role() = 'service_role'
    OR auth.uid() = _user_id
  ) AND EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Keep policy execution available while removing anonymous/public RPC access.
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

-- rls_auto_enable is an internal event-trigger helper, not a public RPC.
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO service_role;

-- Evaluate auth.uid() once per statement instead of once per row.
ALTER POLICY "Users can view their own roles" ON public.user_roles
  USING ((SELECT auth.uid()) = user_id);

ALTER POLICY "Admins can insert community media" ON public.community_media
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));

ALTER POLICY "Admins can update community media" ON public.community_media
  USING (public.has_role((SELECT auth.uid()), 'admin'))
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));

ALTER POLICY "Admins can delete community media" ON public.community_media
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- Cover the created_by foreign key for admin cleanup and referential checks.
CREATE INDEX IF NOT EXISTS community_media_created_by_idx
  ON public.community_media (created_by);
