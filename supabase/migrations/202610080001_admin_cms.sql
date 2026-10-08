-- Run in the Supabase SQL editor as the project owner. Rerunnable; preserves existing listings.
begin;

create table if not exists public.cms_administrators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.cms_administrators enable row level security;
revoke all on public.cms_administrators from public, anon, authenticated;
grant select on public.cms_administrators to authenticated;
drop policy if exists cms_read_own_membership on public.cms_administrators;
create policy cms_read_own_membership on public.cms_administrators for select to authenticated using (user_id = auth.uid());
drop policy if exists cms_membership_guard on public.cms_administrators;
create policy cms_membership_guard on public.cms_administrators as restrictive for all to anon, authenticated using (user_id = auth.uid()) with check (false);


create or replace function public.is_cms_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (select 1 from public.cms_administrators where user_id = auth.uid());
$$;
revoke all on function public.is_cms_admin() from public, anon, authenticated;
grant execute on function public.is_cms_admin() to anon, authenticated;

-- Published content and private drafts are separate tables: public SELECT cannot leak drafts.
create table if not exists public.site_content (
  id text primary key check (id = 'main'), content jsonb not null default '{}'::jsonb,
  revision integer not null default 0, published_at timestamptz, published_by uuid references auth.users(id) on delete set null
);
create table if not exists public.site_content_drafts (
  id text primary key check (id = 'main'), content jsonb not null,
  revision integer not null default 0, updated_at timestamptz not null default now(), updated_by uuid references auth.users(id) on delete set null
);
create table if not exists public.site_content_revisions (
  id bigint generated always as identity primary key, content jsonb not null,
  revision integer not null, created_at timestamptz not null default now(), created_by uuid references auth.users(id) on delete set null
);
insert into public.site_content (id) values ('main') on conflict (id) do nothing;
alter table public.site_content enable row level security;
alter table public.site_content_drafts enable row level security;
alter table public.site_content_revisions enable row level security;
revoke all on public.site_content, public.site_content_drafts, public.site_content_revisions from public, anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant select on public.site_content_drafts, public.site_content_revisions to authenticated;
drop policy if exists cms_public_content on public.site_content;
create policy cms_public_content on public.site_content for select to anon, authenticated using (true);
drop policy if exists cms_private_drafts on public.site_content_drafts;
create policy cms_private_drafts on public.site_content_drafts for select to authenticated using (public.is_cms_admin());
drop policy if exists cms_private_revisions on public.site_content_revisions;
create policy cms_private_revisions on public.site_content_revisions for select to authenticated using (public.is_cms_admin());
drop policy if exists cms_drafts_guard on public.site_content_drafts;
create policy cms_drafts_guard on public.site_content_drafts as restrictive for all to anon, authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
drop policy if exists cms_revisions_guard on public.site_content_revisions;
create policy cms_revisions_guard on public.site_content_revisions as restrictive for all to anon, authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());


create or replace function public.validate_site_content(p_content jsonb) returns boolean language sql immutable set search_path = '' as $$
  select coalesce(
    jsonb_typeof(p_content) = 'object' and p_content->>'schemaVersion' = '1'
    and octet_length(p_content::text) <= 1000000
    and jsonb_typeof(p_content->'settings') = 'object' and jsonb_typeof(p_content->'images') = 'object'
    and jsonb_typeof(p_content->'translations') = 'object'
    and jsonb_typeof(p_content->'translations'->'fr') = 'object'
    and jsonb_typeof(p_content->'translations'->'en') = 'object'
    and jsonb_typeof(p_content->'translations'->'ar') = 'object'
    and jsonb_typeof(p_content->'faq') = 'array' and jsonb_typeof(p_content->'testimonials') = 'array'
    and jsonb_typeof(p_content->'articles') = 'array' and jsonb_typeof(p_content->'homeOrder') = 'array'
    and jsonb_typeof(p_content->'visibleSections') = 'object', false);
$$;
revoke all on function public.validate_site_content(jsonb) from public, anon, authenticated;

create or replace function public.save_site_draft(p_content jsonb, p_expected_revision integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_revision integer; v_updated timestamptz;
begin
  if not public.is_cms_admin() then raise exception 'Administrator permission required' using errcode = '42501'; end if;
  if not public.validate_site_content(p_content) then raise exception 'Invalid CMS content' using errcode = '22023'; end if;
  insert into public.site_content_drafts (id, content) values ('main', p_content) on conflict (id) do nothing;
  select revision into v_revision from public.site_content_drafts where id = 'main' for update;
  if v_revision is distinct from p_expected_revision then raise exception 'Draft revision conflict' using errcode = '40001'; end if;
  update public.site_content_drafts set content = p_content, revision = revision + 1, updated_at = now(), updated_by = auth.uid()
    where id = 'main' returning revision, updated_at into v_revision, v_updated;
  return jsonb_build_object('revision', v_revision, 'updated_at', v_updated);
end;
$$;
revoke all on function public.save_site_draft(jsonb, integer) from public, anon, authenticated;
grant execute on function public.save_site_draft(jsonb, integer) to authenticated;

create or replace function public.publish_site_content(p_expected_draft_revision integer, p_expected_published_revision integer) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_draft public.site_content_drafts%rowtype; v_published public.site_content%rowtype; v_public_content jsonb;
begin
  if not public.is_cms_admin() then raise exception 'Administrator permission required' using errcode = '42501'; end if;
  select * into v_draft from public.site_content_drafts where id = 'main' for update;
  if not found or v_draft.revision is distinct from p_expected_draft_revision then raise exception 'Draft revision conflict' using errcode = '40001'; end if;
  if not public.validate_site_content(v_draft.content) then raise exception 'Invalid CMS content' using errcode = '22023'; end if;
  select * into v_published from public.site_content where id = 'main' for update;
  if v_published.revision is distinct from p_expected_published_revision then raise exception 'Publication revision conflict' using errcode = '40001'; end if;
  -- Unlisted article bodies stay in the private draft/history, not in the public JSON.
  v_public_content := jsonb_set(v_draft.content, '{articles}', coalesce(
    (select jsonb_agg(article.value order by article.ordinality)
     from jsonb_array_elements(v_draft.content->'articles') with ordinality as article(value, ordinality)
     where article.value->'visible' = 'true'::jsonb), '[]'::jsonb));
  update public.site_content set content = v_public_content, revision = revision + 1, published_at = now(), published_by = auth.uid()
    where id = 'main' returning * into v_published;
  insert into public.site_content_revisions (content, revision, created_by) values (v_draft.content, v_published.revision, auth.uid());
  delete from public.site_content_revisions where id not in (select id from public.site_content_revisions order by id desc limit 30);
  return jsonb_build_object('content', v_published.content, 'revision', v_published.revision, 'published_at', v_published.published_at);
end;
$$;
revoke all on function public.publish_site_content(integer, integer) from public, anon, authenticated;
grant execute on function public.publish_site_content(integer, integer) to authenticated;

-- New projects get the same listing fields already used by the app. Existing tables are not replaced.
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(), title text not null, type text not null default 'Apartment',
  location text not null, price numeric not null check (price >= 0), beds integer not null default 0 check (beds >= 0),
  baths integer not null default 0 check (baths >= 0), area numeric not null check (area > 0),
  description text not null default '', images text[] not null default '{}', created_at timestamptz not null default now()
);
-- Widen old integer/limited-precision fields without truncating existing values.
-- Dependencies (e.g. views) must be reviewed by the owner if PostgreSQL refuses this conversion.
do $$
begin
  if exists (select 1 from pg_attribute where attrelid = 'public.listings'::regclass and attname = 'price' and (atttypid <> 'numeric'::regtype or atttypmod <> -1)) then
    alter table public.listings alter column price type numeric using price::numeric;
  end if;
  if exists (select 1 from pg_attribute where attrelid = 'public.listings'::regclass and attname = 'area' and (atttypid <> 'numeric'::regtype or atttypmod <> -1)) then
    alter table public.listings alter column area type numeric using area::numeric;
  end if;
end;
$$;
alter table public.listings enable row level security;
revoke all on public.listings from public, anon, authenticated;
grant select on public.listings to anon;
grant select, insert, update, delete on public.listings to authenticated;
-- Existing serial/identity IDs keep their sequence and need no destructive schema conversion.
do $$
declare v_sequence regclass := pg_get_serial_sequence('public.listings', 'id')::regclass;
begin
  if v_sequence is not null then execute format('grant usage, select on sequence %s to authenticated', v_sequence); end if;
end;
$$;

drop policy if exists cms_listings_public_read on public.listings;
create policy cms_listings_public_read on public.listings for select to anon, authenticated using (true);
drop policy if exists cms_listings_admin_write on public.listings;
create policy cms_listings_admin_write on public.listings for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
-- Restrictive guards also neutralise old permissive write policies without deleting them.
drop policy if exists cms_listings_insert_guard on public.listings;
create policy cms_listings_insert_guard on public.listings as restrictive for insert to anon, authenticated with check (public.is_cms_admin());
drop policy if exists cms_listings_update_guard on public.listings;
create policy cms_listings_update_guard on public.listings as restrictive for update to anon, authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
drop policy if exists cms_listings_delete_guard on public.listings;
create policy cms_listings_delete_guard on public.listings as restrictive for delete to anon, authenticated using (public.is_cms_admin());

-- Never turn an existing confidential bucket into a public one implicitly.
do $$
begin
  if exists (select 1 from storage.buckets where id = 'photos' and public is not true) then
    raise exception 'Existing photos bucket is private. Review its files before explicitly making it public or use a separate marketing project.' using errcode = '22023';
  end if;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists cms_photos_read on storage.objects;
create policy cms_photos_read on storage.objects for select to authenticated using (bucket_id = 'photos' and public.is_cms_admin());
-- Public-bucket downloads remain public, but file metadata/listing is admin-only.
drop policy if exists cms_photos_read_guard on storage.objects;
create policy cms_photos_read_guard on storage.objects as restrictive for select to anon, authenticated using (bucket_id <> 'photos' or public.is_cms_admin());
drop policy if exists cms_photos_write on storage.objects;
create policy cms_photos_write on storage.objects for all to authenticated using (bucket_id = 'photos' and public.is_cms_admin()) with check (bucket_id = 'photos' and public.is_cms_admin());
drop policy if exists cms_photos_insert_guard on storage.objects;
create policy cms_photos_insert_guard on storage.objects as restrictive for insert to anon, authenticated with check (bucket_id <> 'photos' or public.is_cms_admin());
drop policy if exists cms_photos_update_guard on storage.objects;
create policy cms_photos_update_guard on storage.objects as restrictive for update to anon, authenticated using (bucket_id <> 'photos' or public.is_cms_admin()) with check (bucket_id <> 'photos' or public.is_cms_admin());
drop policy if exists cms_photos_delete_guard on storage.objects;
create policy cms_photos_delete_guard on storage.objects as restrictive for delete to anon, authenticated using (bucket_id <> 'photos' or public.is_cms_admin());

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text not null,
  service text not null check (service in ('realEstate', 'businessSetup')), options text[] not null,
  details jsonb not null default '{}', message text not null default '', consent_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')), created_at timestamptz not null default now()
);
create index if not exists contact_requests_created_idx on public.contact_requests (created_at desc);
create table if not exists public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(), email text unique not null, active boolean not null default true,
  consent_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table if not exists public.form_request_limits (
  id bigint generated always as identity primary key, kind text not null, email_hash text not null, ip_hash text, created_at timestamptz not null default now()
);
create index if not exists form_limits_email_idx on public.form_request_limits (kind, email_hash, created_at);
create index if not exists form_limits_ip_idx on public.form_request_limits (ip_hash, created_at);
alter table public.contact_requests enable row level security;
alter table public.newsletter_subscriptions enable row level security;
alter table public.form_request_limits enable row level security;
revoke all on public.contact_requests, public.newsletter_subscriptions, public.form_request_limits from public, anon, authenticated;
grant select, update, delete on public.contact_requests, public.newsletter_subscriptions to authenticated;
drop policy if exists cms_contact_admin on public.contact_requests;
create policy cms_contact_admin on public.contact_requests for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
drop policy if exists cms_newsletter_admin on public.newsletter_subscriptions;
create policy cms_newsletter_admin on public.newsletter_subscriptions for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
drop policy if exists cms_contact_guard on public.contact_requests;
create policy cms_contact_guard on public.contact_requests as restrictive for all to anon, authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
drop policy if exists cms_newsletter_guard on public.newsletter_subscriptions;
create policy cms_newsletter_guard on public.newsletter_subscriptions as restrictive for all to anon, authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
drop policy if exists cms_form_limits_guard on public.form_request_limits;
create policy cms_form_limits_guard on public.form_request_limits as restrictive for all to anon, authenticated using (false) with check (false);


create or replace function public.check_form_limit(p_kind text, p_email text) returns void
language plpgsql security definer set search_path = '' as $$
declare v_headers jsonb; v_ip text; v_email_hash text := md5(lower(p_email));
begin
  v_headers := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb;
  v_ip := nullif(split_part(coalesce(v_headers->>'x-forwarded-for', v_headers->>'x-real-ip', ''), ',', 1), '');
  if v_ip is not null then
    v_ip := md5(trim(v_ip));
    perform pg_advisory_xact_lock(hashtextextended('form:ip:' || v_ip, 0));
    if (select count(*) from public.form_request_limits where ip_hash = v_ip and created_at > now() - interval '1 hour') >= 30 then
      raise exception 'Too many requests. Please try again later.' using errcode = 'P0001';
    end if;
  end if;
  perform pg_advisory_xact_lock(hashtextextended('form:email:' || v_email_hash, 0));
  if (select count(*) from public.form_request_limits where kind = p_kind and email_hash = v_email_hash and created_at > now() - interval '15 minutes') >= 3 then
    raise exception 'Too many requests. Please try again later.' using errcode = 'P0001';
  end if;
  insert into public.form_request_limits (kind, email_hash, ip_hash) values (p_kind, v_email_hash, v_ip);
  delete from public.form_request_limits where created_at < now() - interval '1 day';
end;
$$;
revoke all on function public.check_form_limit(text, text) from public, anon, authenticated;

-- Align public form limits with JavaScript UTF-16 string lengths, including emoji.
-- Inputs over the largest allowed limit return a sufficient lower bound without splitting them.
create or replace function public.form_text_length(p_text text) returns integer
language sql immutable strict set search_path = '' as $$
  select case when char_length(p_text) > 5000 then char_length(p_text)
    else char_length(p_text) + coalesce((select sum(case when character = '' then 0 when ascii(character) > 65535 then 1 else 0 end)
      from regexp_split_to_table(p_text, '') as character), 0)::integer end;
$$;
revoke all on function public.form_text_length(text) from public, anon, authenticated;

create or replace function public.submit_contact_request(
  p_name text, p_email text, p_phone text, p_service text, p_options text[], p_details jsonb,
  p_message text, p_consent boolean, p_website text default ''
) returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_email text := lower(trim(p_email)); v_allowed text[]; v_name text := btrim(p_name, E'\u0009\u000a\u000b\u000c\u000d\u0020\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff');
begin
  if coalesce(p_consent, false) is not true or coalesce(p_website, '') <> '' then raise exception 'Invalid submission' using errcode = '22023'; end if;
  if p_name is null or public.form_text_length(v_name) not between 2 and 150 or v_email is null or length(v_email) > 254
    or v_email !~ '^([A-Za-z0-9_''+\-]+\.)*[A-Za-z0-9_''+\-]*[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$'
    or p_phone is null or p_phone !~ '^\+[1-9][0-9]{6,14}$' or p_service is null or p_service not in ('realEstate', 'businessSetup')
    or p_options is null or cardinality(p_options) not between 1 and 6 or jsonb_typeof(p_details) is distinct from 'object'
    or octet_length(p_details::text) > 20000 or public.form_text_length(coalesce(p_message, '')) > 5000 then
    raise exception 'Invalid submission' using errcode = '22023';
  end if;
  if exists (select 1 from jsonb_each(p_details) as detail where public.form_text_length(detail.key) > 80 or jsonb_typeof(detail.value) <> 'string' or public.form_text_length(detail.value #>> '{}') > 5000) then raise exception 'Invalid details' using errcode = '22023'; end if;
  v_allowed := case when p_service = 'realEstate' then array['rental-income','capital-appreciation','flip','primary-residence','golden-visa','off-plan']
    else array['company-formation','uae-residency','bank-account','tax-optimization','full-setup'] end;
  if not p_options <@ v_allowed or array_position(p_options, null) is not null then raise exception 'Invalid service options' using errcode = '22023'; end if;
  perform public.check_form_limit('contact', v_email);
  insert into public.contact_requests (name, email, phone, service, options, details, message)
    values (v_name, v_email, p_phone, p_service, p_options, p_details, coalesce(p_message, '')) returning id into v_id;
  return v_id;
end;
$$;
revoke all on function public.submit_contact_request(text,text,text,text,text[],jsonb,text,boolean,text) from public, anon, authenticated;
grant execute on function public.submit_contact_request(text,text,text,text,text[],jsonb,text,boolean,text) to anon, authenticated;

create or replace function public.subscribe_newsletter(p_email text, p_consent boolean, p_website text default '') returns boolean
language plpgsql security definer set search_path = '' as $$
declare v_email text := lower(trim(p_email));
begin
  if coalesce(p_consent, false) is not true or coalesce(p_website, '') <> '' or v_email is null or length(v_email) > 254
    or v_email !~ '^([A-Za-z0-9_''+\-]+\.)*[A-Za-z0-9_''+\-]*[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$' then raise exception 'Invalid subscription' using errcode = '22023'; end if;
  perform public.check_form_limit('newsletter', v_email);
  insert into public.newsletter_subscriptions (email) values (v_email)
    on conflict (email) do update set active = true, consent_at = now();
  return true; -- Same response for existing/new addresses: no email enumeration.
end;
$$;
revoke all on function public.subscribe_newsletter(text,boolean,text) from public, anon, authenticated;
grant execute on function public.subscribe_newsletter(text,boolean,text) to anon, authenticated;

commit;
