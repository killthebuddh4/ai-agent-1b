create table files (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  filename text,
  text text
);