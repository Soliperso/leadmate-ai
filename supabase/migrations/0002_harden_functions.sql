-- LeadMate AI — security hardening (resolves Supabase security advisors)

-- Pin search_path on the updated_at trigger function.
alter function public.set_updated_at() set search_path = public;

-- handle_new_user is only ever invoked by the on_auth_user_created trigger.
-- It must not be callable as an RPC by anon/authenticated roles.
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;
