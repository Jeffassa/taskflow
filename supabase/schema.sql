-- TaskFlow — Schéma Supabase
-- À coller dans : Supabase Dashboard > SQL Editor > New query > Run

-- 1. Table des tâches
create table if not exists public.taches (
  id          uuid          primary key default gen_random_uuid(),
  user_id     uuid          not null references auth.users(id) on delete cascade,
  titre       text          not null check (length(titre) > 0 and length(titre) <= 200),
  description text          not null default '',
  echeance    text          not null default '',
  priorite    text          not null default 'moyenne'
                            check (priorite in ('basse', 'moyenne', 'haute')),
  termine     boolean       not null default false,
  cree_le     timestamptz   not null default now()
);

-- 2. Index pour requêtes fréquentes
create index if not exists taches_user_id_cree_le_idx
  on public.taches (user_id, cree_le desc);

-- 3. Activer Row Level Security
alter table public.taches enable row level security;

-- 4. Politiques RLS — chaque utilisateur ne voit/modifie que ses tâches
drop policy if exists "Lecture de ses propres tâches" on public.taches;
create policy "Lecture de ses propres tâches"
  on public.taches for select
  using (auth.uid() = user_id);

drop policy if exists "Insertion de ses propres tâches" on public.taches;
create policy "Insertion de ses propres tâches"
  on public.taches for insert
  with check (auth.uid() = user_id);

drop policy if exists "Modification de ses propres tâches" on public.taches;
create policy "Modification de ses propres tâches"
  on public.taches for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Suppression de ses propres tâches" on public.taches;
create policy "Suppression de ses propres tâches"
  on public.taches for delete
  using (auth.uid() = user_id);
