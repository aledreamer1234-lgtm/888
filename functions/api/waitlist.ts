interface Env {
  CAPRI_DB: D1Database;
}

type WaitlistPayload = {
  email?: unknown;
  name?: unknown;
  company?: unknown;
  source?: unknown;
  hostname?: unknown;
  productInterest?: unknown;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!context.env.CAPRI_DB) {
    return Response.json({ error: "Missing CAPRI_DB D1 binding." }, { status: 500 });
  }

  let payload: WaitlistPayload;
  try {
    payload = (await context.request.json()) as WaitlistPayload;
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const email = cleanEmail(payload.email);
  if (!email) {
    return Response.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const name = cleanOptional(payload.name, 120);
  const company = cleanOptional(payload.company, 120);
  const source = cleanOptional(payload.source, 120) ?? "unknown";
  const hostname = cleanOptional(payload.hostname, 120) ?? "unknown";
  const productInterest = cleanOptional(payload.productInterest, 120);
  const timestamp = new Date().toISOString();

  await context.env.CAPRI_DB.exec(`
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
  `);

  const existing = await context.env.CAPRI_DB.prepare(
    `select created_at as createdAt from waitlist_submissions where email = ?1`
  )
    .bind(email)
    .first<{ createdAt: string }>();

  await context.env.CAPRI_DB.prepare(
    `insert into waitlist_submissions
      (email, name, company, source, hostname, product_interest, created_at, updated_at)
     values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
     on conflict(email) do update set
      name = excluded.name,
      company = excluded.company,
      source = excluded.source,
      hostname = excluded.hostname,
      product_interest = excluded.product_interest,
      updated_at = excluded.updated_at`
  )
    .bind(email, name, company, source, hostname, productInterest, existing?.createdAt ?? timestamp, timestamp)
    .run();

  return Response.json({
    email,
    name,
    company,
    source,
    hostname,
    productInterest,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
    status: existing ? "updated" : "created",
  });
};

function cleanEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function cleanOptional(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
}
