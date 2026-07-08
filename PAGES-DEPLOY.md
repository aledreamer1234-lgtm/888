# Cloudflare Pages Deploy Guide

This site is ready to deploy to Cloudflare Pages as:

- a Vite static app built from `dist`
- a client-routed SPA using `public/_redirects`
- a waitlist endpoint at `/api/waitlist` backed by a Pages Function and D1

## Build settings

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: leave blank unless this project is inside a monorepo

## Steps

1. Push this project to GitHub or GitLab.
2. In Cloudflare, create a new Pages project and connect the repository.
3. Enter the build settings above.
4. Create a D1 database.
5. In Pages project settings, add a D1 binding named `CAPRI_DB`.
6. Run the SQL in `d1/schema.sql` against that database.
7. Redeploy the Pages project.
8. Add your custom domain after the first successful deployment.

## Why `_redirects` matters

The site uses client-side routes like:

- `/demo`
- `/docs`
- `/docs/x402`

Without `public/_redirects`, direct visits to those URLs may 404 on a static host. This project already includes:

```txt
/* /index.html 200
```

## Waitlist endpoint

Local development uses the Vite middleware endpoint in `vite.config.ts`.

Production on Cloudflare Pages should use:

- `functions/api/waitlist.ts`
- D1 binding: `CAPRI_DB`

If the binding is missing, the form will render but submissions will fail until the database is attached.
