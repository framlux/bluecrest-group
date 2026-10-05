# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BlueCrest Group is a business website for a fractional CFO and accounting firm in Orange County, CA. It's a Next.js 15 app styled with Tailwind CSS v4, and deployed via Docker (standalone output).

## Commands

```bash
pnpm dev              # Start Next.js dev server (localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint (next/core-web-vitals + next/typescript)
pnpm test             # Vitest (one run); pnpm test:watch to iterate
```

## Architecture

- **Framework**: Next.js 15 App Router with React 19, TypeScript strict mode
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`
- **Email**: SendGrid (`@sendgrid/mail`) for contact form submissions
- **Spam Protection**: Cloudflare Turnstile (widget in `ContactForm`, verified in `src/lib/turnstile.ts`)
- **SEO**: Metadata is built with `buildMetadata()` in `src/lib/metadata.ts`, and JSON-LD with `src/lib/structured-data.ts`.
- **CTAs**: Every call-to-action renders `<ContactCta>` (`src/lib/cta.ts` holds the label and href logic). The contact form's submit button reads "Send Message".
- **Analytics**: Vercel Analytics
- **Font**: Poppins (Google Fonts) + Harabara Mais Demo (CDN) for brand headlines
- **Path alias**: `@/*` maps to `./src/*`

### Key Directories

- `src/app/(public)/` — Public App Router pages: home, about, contact, services, service-areas, privacy, terms. Its layout adds the Header/Footer chrome, and `sitemap.ts` lives here.
- `src/app/(portal)` — Client portal, off unless `PORTAL_ENABLED=true`. `src/middleware.ts` returns 404 for `/portal` and `/api/auth` while the flag is off, and lazily imports `@/lib/auth` after that check (a static import crashes the Edge runtime, because postgres needs Node `stream`).
- `src/app/robots.ts` — Lives at the app root (not in a route group) because Next only serves robots from there
- `src/app/not-found.tsx` — Root 404 for unknown URLs (they never reach a route group, so it repeats the Header/Footer chrome). `src/app/(public)/not-found.tsx` handles `notFound()` calls inside the group. Both render `src/components/NotFoundContent.tsx`.
- `src/app/(public)/api/contact/route.ts` — Contact form API route (SendGrid + Turnstile verification). Returns 400 for missing fields, 403 when Turnstile fails, 502 when the internal notification fails, 500 for unexpected errors (malformed body, missing `TURNSTILE_SECRET`), and 200 otherwise (a failed customer confirmation is logged but still returns 200). `src/lib/email/sendgrid.ts` throws on a missing key, template, or recipients.
- `src/components/` — Shared components (Header, Footer, StickyCTA, ContactCta, ContactForm, NotFoundContent, JsonLd)
- `src/data/` — Static data: site config, services, locations, service content, location content, page metadata (`page-meta.ts`), indexable static pages (`pages.ts`), redirects (`redirects.ts`)
- `src/lib/metadata.ts`, `src/lib/structured-data.ts` — `buildMetadata()` and JSON-LD builders
- `src/lib/brand.ts` — Brand config for email templates
- `src/lib/email/` — Email template utilities
- `src/utils/` — Icon components for services and locations

### Data-Driven Pages

Services and service-area pages are generated from static data in `src/data/`. Content for each service/location is defined in `service-content.ts` and `location-content.ts`, with route metadata in `services.ts` and `locations.ts`.

### Brand Colors

Defined in `src/data/site-config.ts`: Primary Blue (#579cc6), Gold (#d69c50), Navy (#3e5a81), Coral (#d66c4c).

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key
- `SENDGRID_API_KEY` — SendGrid API key
- `TURNSTILE_SECRET` — Cloudflare Turnstile server secret
- `SENDGRID_TEMPLATE_ID` — SendGrid template for the internal lead notification
- `SENDGRID_TEMPLATE_CONFIRMATION` — SendGrid template for the customer confirmation
- `CONTACT_NOTIFY_TO` — Comma-separated internal lead recipients (defaults to the firm inbox)
- `PORTAL_ENABLED` — Set to exactly `true` to turn the client portal on; prod leaves it unset

## Docker Build

The Dockerfile uses multi-stage build with `output: 'standalone'` in next.config.ts. Secrets are passed via `--mount=type=secret` at build time for the Next.js build step.

## Deployment

Prod runs the image digest pinned in `framlux/stack/clusters/prod/apps/bluecrest-web/base/deployment.yaml` (Argo CD). Pushing `prod` only builds the image. Runtime env and secrets live in that repo.

## Content switches

`siteConfig.phone` and `googleBusinessProfileUrl` render nothing while empty.
