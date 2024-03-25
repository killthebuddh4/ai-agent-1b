create table chunks (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  file uuid,
  chunk_start int,
  chunk_end int,
  text text
);

alter table
  chunks
add
  constraint file_fk foreign key (file) references files(id) on delete cascade;