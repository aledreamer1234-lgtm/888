create table if not exists waitlist_submissions (
  email text primary key,
  name text,
  company text,
  source text not null,
  hostname text not null,
  product_interest text,
  created_at text not null,
  updated_at text not null
);
