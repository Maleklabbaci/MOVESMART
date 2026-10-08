-- Run in the Supabase SQL editor as the project owner, AFTER 202610080001_admin_cms.sql.
-- Additive and rerunnable: it never deletes or rewrites listings, content, requests or files.
-- This file exists in the repository only; it is deliberately NOT applied to any remote project
-- as part of the code change. See docs/ANALYTICS.md and docs/ADMIN_CMS.md.
begin;

-- 1. Follow-up fields on private client requests -------------------------------------------
-- Existing rows keep status/created_at; the new columns start empty.
alter table public.contact_requests add column if not exists reminder_at timestamptz;
alter table public.contact_requests add column if not exists notes text not null default '';
alter table public.contact_requests add column if not exists updated_at timestamptz not null default now();

-- Bounded internal notes: the browser cannot store unbounded free text.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'contact_requests_notes_length' and conrelid = 'public.contact_requests'::regclass) then
    alter table public.contact_requests add constraint contact_requests_notes_length check (public.form_text_length(notes) <= 4000);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'contact_requests_reminder_window' and conrelid = 'public.contact_requests'::regclass) then
    alter table public.contact_requests add constraint contact_requests_reminder_window check (reminder_at is null or (reminder_at > timestamptz '2000-01-01' and reminder_at < timestamptz '2100-01-01'));
  end if;
end;
$$;

-- Overdue follow-ups are read on every dashboard load: keep that filter indexed.
create index if not exists contact_requests_reminder_idx on public.contact_requests (reminder_at) where reminder_at is not null and status <> 'archived';
create index if not exists contact_requests_status_idx on public.contact_requests (status, created_at desc);

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.touch_updated_at() from public, anon, authenticated;
drop trigger if exists contact_requests_touch on public.contact_requests;
create trigger contact_requests_touch before update on public.contact_requests
  for each row execute function public.touch_updated_at();

-- Grants from the first migration stay in place; re-assert them for an owner who ran
-- an older, more restrictive variant of the CMS script.
grant select, update, delete on public.contact_requests to authenticated;

-- 2. Validated follow-up write path ---------------------------------------------------------
-- Null arguments mean "leave unchanged"; p_notes = '' explicitly clears the note and
-- p_clear_reminder = true removes a scheduled follow-up.
create or replace function public.update_contact_follow_up(
  p_id uuid,
  p_status text default null,
  p_notes text default null,
  p_reminder_at timestamptz default null,
  p_clear_reminder boolean default false
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_row public.contact_requests%rowtype;
begin
  if not public.is_cms_admin() then raise exception 'Administrator permission required' using errcode = '42501'; end if;
  if p_id is null then raise exception 'Invalid request' using errcode = '22023'; end if;
  if p_status is not null and p_status not in ('new', 'contacted', 'archived') then raise exception 'Invalid status' using errcode = '22023'; end if;
  if p_notes is not null and public.form_text_length(p_notes) > 4000 then raise exception 'Invalid notes' using errcode = '22023'; end if;
  if p_reminder_at is not null and (p_reminder_at <= timestamptz '2000-01-01' or p_reminder_at >= timestamptz '2100-01-01') then
    raise exception 'Invalid reminder date' using errcode = '22023';
  end if;
  update public.contact_requests set
    status = coalesce(p_status, status),
    notes = coalesce(p_notes, notes),
    reminder_at = case when p_clear_reminder then null else coalesce(p_reminder_at, reminder_at) end
  where id = p_id
  returning * into v_row;
  if not found then raise exception 'Request not found' using errcode = 'P0002'; end if;
  return jsonb_build_object(
    'id', v_row.id, 'status', v_row.status, 'notes', v_row.notes,
    'reminder_at', v_row.reminder_at, 'updated_at', v_row.updated_at
  );
end;
$$;
revoke all on function public.update_contact_follow_up(uuid, text, text, timestamptz, boolean) from public, anon, authenticated;
grant execute on function public.update_contact_follow_up(uuid, text, text, timestamptz, boolean) to authenticated;

-- 3. Exact dashboard counters ---------------------------------------------------------------
-- Counted in the database so the totals stay exact beyond the 50-row page the list loads,
-- and so the browser never downloads the whole private inbox to display a number.
create or replace function public.contact_requests_dashboard(p_recent integer default 5) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_recent integer := least(greatest(coalesce(p_recent, 5), 1), 20);
begin
  if not public.is_cms_admin() then raise exception 'Administrator permission required' using errcode = '42501'; end if;
  return jsonb_build_object(
    'generated_at', now(),
    'total', (select count(*) from public.contact_requests),
    'subscribers_total', (select count(*) from public.newsletter_subscriptions),
    'subscribers_active', (select count(*) from public.newsletter_subscriptions where active),
    'by_status', jsonb_build_object(
      'new', (select count(*) from public.contact_requests where status = 'new'),
      'contacted', (select count(*) from public.contact_requests where status = 'contacted'),
      'archived', (select count(*) from public.contact_requests where status = 'archived')
    ),
    'overdue', (select count(*) from public.contact_requests
      where status <> 'archived' and reminder_at is not null and reminder_at <= now()),
    'due_soon', (select count(*) from public.contact_requests
      where status <> 'archived' and reminder_at is not null and reminder_at > now() and reminder_at <= now() + interval '7 days'),
    'untouched_new', (select count(*) from public.contact_requests
      where status = 'new' and created_at <= now() - interval '7 days'),
    'last_request_at', (select max(created_at) from public.contact_requests),
    'oldest_new_at', (select min(created_at) from public.contact_requests where status = 'new'),
    'recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', row.id, 'name', row.name, 'service', row.service, 'status', row.status,
        'created_at', row.created_at, 'reminder_at', row.reminder_at, 'has_notes', row.has_notes
      ) order by row.created_at desc, row.id desc)
      from (
        select id, name, service, status, created_at, reminder_at, notes <> '' as has_notes
        from public.contact_requests
        order by created_at desc, id desc
        limit v_recent
      ) as row
    ), '[]'::jsonb)
  );
end;
$$;
revoke all on function public.contact_requests_dashboard(integer) from public, anon, authenticated;
grant execute on function public.contact_requests_dashboard(integer) to authenticated;

-- 4. Consent-based audience measurement ------------------------------------------------------
-- Aggregated traffic only. There is intentionally no IP column, no user-agent string,
-- no cookie identifier and no fingerprint input of any kind: the only identifier is a
-- random session id chosen by the visitor's browser, which the visitor can revoke by
-- clearing the site's storage. Rows are deleted after 90 days.
create table if not exists public.analytics_pageviews (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  path text not null check (char_length(path) between 1 and 300 and left(path, 1) = '/' and path !~ '[[:cntrl:]]'),
  browser text not null check (browser in ('Chrome', 'Safari', 'Firefox', 'Edge', 'Opera', 'Samsung Internet', 'Autre')),
  created_at timestamptz not null default now()
);
create index if not exists analytics_pageviews_created_idx on public.analytics_pageviews (created_at desc);
create index if not exists analytics_pageviews_path_idx on public.analytics_pageviews (path, created_at desc);
create index if not exists analytics_pageviews_session_idx on public.analytics_pageviews (session_id, created_at desc);

alter table public.analytics_pageviews enable row level security;
revoke all on public.analytics_pageviews from public, anon, authenticated;
-- No permissive SELECT policy exists, so nobody can list individual pageviews through the API.
-- The restrictive guard also neutralises a permissive policy left behind by another script.
drop policy if exists cms_analytics_guard on public.analytics_pageviews;
create policy cms_analytics_guard on public.analytics_pageviews as restrictive for all to anon, authenticated using (false) with check (false);

create or replace function public.record_pageview(p_session_id uuid, p_path text, p_browser text default 'Autre') returns void
language plpgsql security definer set search_path = '' as $$
declare v_path text := btrim(coalesce(p_path, '')); v_browser text;
begin
  if p_session_id is null then raise exception 'Invalid event' using errcode = '22023'; end if;
  v_browser := case when p_browser in ('Chrome', 'Safari', 'Firefox', 'Edge', 'Opera', 'Samsung Internet') then p_browser else 'Autre' end;
  -- Store a path only: never a query string, a fragment, a draft preview or the admin area.
  if v_path = '' or char_length(v_path) > 300 or left(v_path, 1) <> '/'
    or v_path ~ '[[:cntrl:]]' or position('?' in v_path) > 0 or position('#' in v_path) > 0
    or v_path ~ '^//' or v_path = '/admin' or v_path like '/admin/%' then
    raise exception 'Invalid path' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('analytics:' || p_session_id::text, 0));
  -- A single session cannot inflate the counters: extra events are dropped, not stored.
  if (select count(*) from public.analytics_pageviews where session_id = p_session_id and created_at > now() - interval '1 hour') >= 120 then
    return;
  end if;
  insert into public.analytics_pageviews (session_id, path, browser) values (p_session_id, v_path, v_browser);
  delete from public.analytics_pageviews where created_at < now() - interval '90 days';
end;
$$;
revoke all on function public.record_pageview(uuid, text, text) from public, anon, authenticated;
grant execute on function public.record_pageview(uuid, text, text) to anon, authenticated;

-- Aggregates only: distinct sessions and distinct pages replace "unique visitors", which
-- this design cannot and will not compute from an IP address or a device fingerprint.
create or replace function public.analytics_summary(p_days integer default 30) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_days integer := least(greatest(coalesce(p_days, 30), 1), 90); v_since timestamptz;
begin
  if not public.is_cms_admin() then raise exception 'Administrator permission required' using errcode = '42501'; end if;
  v_since := now() - make_interval(days => v_days);
  return jsonb_build_object(
    'generated_at', now(),
    'days', v_days,
    'retention_days', 90,
    'totals', jsonb_build_object(
      'pageviews', (select count(*) from public.analytics_pageviews where created_at >= v_since),
      'sessions', (select count(distinct session_id) from public.analytics_pageviews where created_at >= v_since),
      'pages', (select count(distinct path) from public.analytics_pageviews where created_at >= v_since)
    ),
    'browsers', coalesce((
      select jsonb_agg(jsonb_build_object('browser', grouped.browser, 'pageviews', grouped.pageviews, 'sessions', grouped.sessions)
        order by grouped.pageviews desc, grouped.browser)
      from (
        select browser, count(*) as pageviews, count(distinct session_id) as sessions
        from public.analytics_pageviews where created_at >= v_since group by browser
      ) as grouped
    ), '[]'::jsonb),
    'top_pages', coalesce((
      select jsonb_agg(jsonb_build_object('path', grouped.path, 'pageviews', grouped.pageviews, 'sessions', grouped.sessions)
        order by grouped.pageviews desc, grouped.path)
      from (
        select path, count(*) as pageviews, count(distinct session_id) as sessions
        from public.analytics_pageviews where created_at >= v_since group by path
        order by count(*) desc, path limit 10
      ) as grouped
    ), '[]'::jsonb),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object('day', grouped.day, 'pageviews', grouped.pageviews, 'sessions', grouped.sessions) order by grouped.day)
      from (
        select date_trunc('day', created_at)::date as day, count(*) as pageviews, count(distinct session_id) as sessions
        from public.analytics_pageviews where created_at >= v_since group by 1
      ) as grouped
    ), '[]'::jsonb),
    'first_recorded_at', (select min(created_at) from public.analytics_pageviews),
    'last_recorded_at', (select max(created_at) from public.analytics_pageviews)
  );
end;
$$;
revoke all on function public.analytics_summary(integer) from public, anon, authenticated;
grant execute on function public.analytics_summary(integer) to authenticated;

commit;
