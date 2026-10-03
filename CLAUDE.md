# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BlueCrest Group is a business website for a fractional CFO and accounting firm in Orange County, CA. It's a Next.js 15 app with Sanity CMS for blog content ("Insights"), styled with Tailwind CSS v4, and deployed via Docker (standalone output).

## Commands

```bash
pnpm dev              # Start Next.js dev server (localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint (next/core-web-vitals + next/typescript)
pnpm test             # Vitest (one run); pnpm test:watch to iterate
pnpm studio           # Run Sanity Studio locally (localhost:3333, from /sanity dir)
pnpm studio:deploy    # Deploy Sanity Studio
```

The `/sanity` directory is a separate package with its own `package.json` and is excluded from the main TypeScript config.

## Architecture

- **Framework**: Next.js 15 App Router with React 19, TypeScript strict mode
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`
- **CMS**: Sanity CMS (separate studio in `/sanity`; not embedded in Next.js due to React 19 incompatibility)
- **Email**: SendGrid (`@sendgrid/mail`) for contact form submissions
- **Spam Protection**: Cloudflare Turnstile (widget in `ContactForm`, verified in `src/lib/turnstile.ts`)
- **Content refresh**: Sanity content refreshes through ISR every 300 s, plus a signed webhook at `/api/revalidate` that fans out to every pod through `REVALIDATE_PEERS_HOST`. The cache tag and interval constants live in `src/lib/sanity.cache.ts`, which has no imports so tests can load it.
- **SEO**: Metadata is built with `buildMetadata()` in `src/lib/metadata.ts`, and JSON-LD with `src/lib/structured-data.ts`.
- **CTAs**: Every call-to-action renders `<ContactCta>` (`src/lib/cta.ts` holds the label and href logic). The contact form's submit button reads "Send Message".
- **Analytics**: Vercel Analytics
- **Font**: Poppins (Google Fonts) + Harabara Mais Demo (CDN) for brand headlines
- **Path alias**: `@/*` maps to `./src/*`

### Key Directories

- `src/app/(public)/` — Public App Router pages: home, about, contact, services, service-areas, insights (blog), privacy, terms. Its layout adds the Header/Footer chrome, and `sitemap.ts` lives here.
- `src/app/(portal)` — Client portal, off unless `PORTAL_ENABLED=true`. `src/middleware.ts` returns 404 for `/portal` and `/api/auth` while the flag is off, and lazily imports `@/lib/auth` after that check (a static import crashes the Edge runtime, because postgres needs Node `stream`).
- `src/app/robots.ts` — Lives at the app root (not in a route group) because Next only serves robots from there
- `src/app/not-found.tsx` — Root 404 for unknown URLs (they never reach a route group, so it repeats the Header/Footer chrome). `src/app/(public)/not-found.tsx` handles `notFound()` calls inside the group. Both render `src/components/NotFoundContent.tsx`.
- `src/app/(public)/api/contact/route.ts` — Contact form API route (SendGrid + Turnstile verification). Returns 400 for missing fields, 403 when Turnstile fails, 502 when the internal notification fails, and 200 otherwise. `src/lib/email/sendgrid.ts` throws on a missing key, template, or recipients.
- `src/app/(public)/api/revalidate/route.ts` — Sanity publish webhook (signature-verified) and pod-to-pod fan-out
- `src/app/(public)/insights/[slug]/` — Dynamic Sanity-powered blog articles
- `src/components/` — Shared components (Header, Footer, StickyCTA, ContactCta, ContactForm, FeaturedInsights, NotFoundContent, PortableTextComponents, JsonLd)
- `src/data/` — Static data: site config, services, locations, service content, location content, page metadata (`page-meta.ts`), indexable static pages (`pages.ts`), redirects (`redirects.ts`)
- `src/lib/sanity.ts` — GROQ queries and image URL builder
- `src/lib/sanity.client.ts` — Sanity client instance
- `src/lib/sanity.cache.ts` — Cache tag and revalidate-interval constants (no imports)
- `src/lib/metadata.ts`, `src/lib/structured-data.ts` — `buildMetadata()` and JSON-LD builders
- `src/lib/brand.ts` — Brand config for email templates
- `src/lib/email/` — Email template utilities
- `src/utils/` — Icon components for services and locations
- `sanity/schemaTypes/` — Sanity schemas: `article.ts`, `author.ts`

### Data-Driven Pages

Services and service-area pages are generated from static data in `src/data/`. Content for each service/location is defined in `service-content.ts` and `location-content.ts`, with route metadata in `services.ts` and `locations.ts`.

### Brand Colors

Defined in `src/data/site-config.ts`: Primary Blue (#579cc6), Gold (#d69c50), Navy (#3e5a81), Coral (#d66c4c).

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` — Sanity dataset (usually "production")
- `NEXT_PUBLIC_SANITY_API_VERSION` — Sanity API version
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key
- `SENDGRID_API_KEY` — SendGrid API key
- `TURNSTILE_SECRET` — Cloudflare Turnstile server secret
- `SENDGRID_TEMPLATE_ID` — SendGrid template for the internal lead notification
- `SENDGRID_TEMPLATE_CONFIRMATION` — SendGrid template for the customer confirmation
- `CONTACT_NOTIFY_TO` — Comma-separated internal lead recipients (defaults to the firm inbox)
- `SANITY_REVALIDATE_SECRET` — Shared secret for the Sanity webhook and pod-to-pod revalidation
- `REVALIDATE_PEERS_HOST` — Headless-service host used to fan revalidation out to every pod
- `PORTAL_ENABLED` — Set to exactly `true` to turn the client portal on; prod leaves it unset

## Docker Build

The Dockerfile uses multi-stage build with `output: 'standalone'` in next.config.ts. Secrets are passed via `--mount=type=secret` at build time for the Next.js build step.

## Deployment

Prod runs the image digest pinned in `framlux/stack/clusters/prod/apps/bluecrest-web/base/deployment.yaml` (Argo CD). Pushing `prod` only builds the image. Runtime env and secrets live in that repo.

## Content switches

`siteConfig.insightsEnabled` turns Insights indexing, nav and sitemap on. `siteConfig.phone` and `googleBusinessProfileUrl` render nothing while empty.
