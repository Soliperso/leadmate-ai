-- LeadMate AI — initial schema
-- Postgres / Supabase. Run with `supabase db push` or paste into the SQL editor.
-- Every user-owned table has Row Level Security enabled and is scoped to the
-- authenticated owner. Server-only writes (audits, competitors, reviews,
-- subscriptions) are performed with the service-role key from edge functions.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";      -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Enums (mirror src/types/index.ts)
-- ---------------------------------------------------------------------------
create type industry as enum (
  'HVAC','Roofing','Electrician','Plumbing','Landscaping',
  'Dental','Legal','Accounting','Insurance','Other'
);
create type impact_level   as enum ('high','medium','low');
create type score_category as enum ('website','seo','reputation','conversion','visibility');
create type review_source  as enum ('Google','Yelp','Facebook');
create type chat_role      as enum ('user','assistant');
create type plan_tier      as enum ('starter','growth','pro');
create type sub_status     as enum ('trialing','active','past_due','canceled','incomplete');

-- ---------------------------------------------------------------------------
-- profiles — 1:1 with auth.users, created by trigger on signup
-- ---------------------------------------------------------------------------
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "own profile: select" on profiles
  for select using (auth.uid() = id);
create policy "own profile: update" on profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- businesses — a user can own many businesses (Pro / multi-location)
-- ---------------------------------------------------------------------------
create table businesses (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references profiles(id) on delete cascade,
  name        text not null,
  website     text,
  industry    industry not null default 'Other',
  location    text,
  logo_color  text not null default '#4f46e5',
  is_public   boolean not null default false,  -- surfaces in the public directory
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index businesses_owner_idx on businesses(owner_id);

alter table businesses enable row level security;

create policy "own businesses: all" on businesses
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
-- Public directory: anyone (even anon) may read businesses flagged public.
create policy "public directory: select" on businesses
  for select using (is_public = true);

-- ---------------------------------------------------------------------------
-- audits — one row per audit run; scores stored as columns for querying
-- ---------------------------------------------------------------------------
create table audits (
  id                     uuid primary key default gen_random_uuid(),
  business_id            uuid not null references businesses(id) on delete cascade,
  overall                smallint not null check (overall between 0 and 100),
  score_website          smallint not null check (score_website between 0 and 100),
  score_seo              smallint not null check (score_seo between 0 and 100),
  score_reputation       smallint not null check (score_reputation between 0 and 100),
  score_conversion       smallint not null check (score_conversion between 0 and 100),
  score_visibility       smallint not null check (score_visibility between 0 and 100),
  estimated_lost_leads   integer not null default 0,
  estimated_lost_revenue integer not null default 0,
  created_at             timestamptz not null default now()
);
create index audits_business_idx on audits(business_id, created_at desc);

alter table audits enable row level security;

-- Read scoped through the owning business; writes happen via service role.
create policy "own audits: select" on audits
  for select using (
    exists (select 1 from businesses b
            where b.id = audits.business_id and b.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- opportunities — AI-generated recommendations tied to an audit
-- ---------------------------------------------------------------------------
create table opportunities (
  id          uuid primary key default gen_random_uuid(),
  audit_id    uuid not null references audits(id) on delete cascade,
  title       text not null,
  description text not null,
  impact      impact_level not null,
  category    score_category not null,
  created_at  timestamptz not null default now()
);
create index opportunities_audit_idx on opportunities(audit_id);

alter table opportunities enable row level security;

create policy "own opportunities: select" on opportunities
  for select using (
    exists (
      select 1 from audits a
      join businesses b on b.id = a.business_id
      where a.id = opportunities.audit_id and b.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- competitors — tracked per business (Growth+)
-- ---------------------------------------------------------------------------
create table competitors (
  id                uuid primary key default gen_random_uuid(),
  business_id       uuid not null references businesses(id) on delete cascade,
  name              text not null,
  rating            numeric(2,1) check (rating between 0 and 5),
  reviews           integer not null default 0,
  website_score     smallint check (website_score between 0 and 100),
  domain_authority  smallint check (domain_authority between 0 and 100),
  social_engagement smallint check (social_engagement between 0 and 100),
  created_at        timestamptz not null default now()
);
create index competitors_business_idx on competitors(business_id);

alter table competitors enable row level security;

create policy "own competitors: select" on competitors
  for select using (
    exists (select 1 from businesses b
            where b.id = competitors.business_id and b.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- reviews — monitored reviews across sources (Growth+)
-- ---------------------------------------------------------------------------
create table reviews (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  author      text,
  rating      smallint check (rating between 1 and 5),
  body        text,
  source      review_source not null,
  responded   boolean not null default false,
  reviewed_at date,
  created_at  timestamptz not null default now()
);
create index reviews_business_idx on reviews(business_id, reviewed_at desc);

alter table reviews enable row level security;

create policy "own reviews: select" on reviews
  for select using (
    exists (select 1 from businesses b
            where b.id = reviews.business_id and b.owner_id = auth.uid())
  );
create policy "own reviews: update responded" on reviews
  for update using (
    exists (select 1 from businesses b
            where b.id = reviews.business_id and b.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- advisor: conversations + messages (AI Growth Advisor chat)
-- ---------------------------------------------------------------------------
create table advisor_conversations (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  title       text,
  created_at  timestamptz not null default now()
);
create index advisor_conversations_business_idx on advisor_conversations(business_id);

create table advisor_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references advisor_conversations(id) on delete cascade,
  role            chat_role not null,
  content         text not null,
  created_at      timestamptz not null default now()
);
create index advisor_messages_conversation_idx on advisor_messages(conversation_id, created_at);

alter table advisor_conversations enable row level security;
alter table advisor_messages      enable row level security;

create policy "own conversations: all" on advisor_conversations
  for all using (
    exists (select 1 from businesses b
            where b.id = advisor_conversations.business_id and b.owner_id = auth.uid())
  ) with check (
    exists (select 1 from businesses b
            where b.id = advisor_conversations.business_id and b.owner_id = auth.uid())
  );

create policy "own messages: all" on advisor_messages
  for all using (
    exists (
      select 1 from advisor_conversations c
      join businesses b on b.id = c.business_id
      where c.id = advisor_messages.conversation_id and b.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from advisor_conversations c
      join businesses b on b.id = c.business_id
      where c.id = advisor_messages.conversation_id and b.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- subscriptions — mirror of Stripe state, written by the webhook (service role)
-- ---------------------------------------------------------------------------
create table subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  owner_id               uuid not null references profiles(id) on delete cascade,
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  plan                   plan_tier not null default 'starter',
  status                 sub_status not null default 'trialing',
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create unique index subscriptions_owner_idx on subscriptions(owner_id);

alter table subscriptions enable row level security;

create policy "own subscription: select" on subscriptions
  for select using (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated      before update on profiles      for each row execute function set_updated_at();
create trigger businesses_updated    before update on businesses    for each row execute function set_updated_at();
create trigger subscriptions_updated before update on subscriptions for each row execute function set_updated_at();
