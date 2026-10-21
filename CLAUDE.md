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
- **CTAs**: Every call-to-action renders `<ContactCta>` (`src/lib/cta.ts` holds the "Book a 15-Min Call" label and href logic). Only the About and case study closing buttons pass `label="Contact Us"`. The footer's call to action (`FooterCta`) is skipped on pages that already end on a form or their own ask: Home, Contact, About, Service Areas, and case studies. The contact form's submit button reads "Send Message".
- **Tag Manager**: GTM (`src/lib/gtm.ts`) loads from the root layout on every page: the script in `<head>`, the noscript iframe first in `<body>`.
- **Meta descriptions**: The 14 service pages render none. `buildMetadata()` without a `description` returns `description: null` so the layout default isn't inherited.
- **Icons and previews**: favicon set, `apple-touch-icon.png`, `og-image-1200x630.png` (og/twitter image), and `logo-square-512.png` (JSON-LD logo) live at the root of `public/`.
- **Analytics**: Vercel Analytics
- **Font**: Poppins (Google Fonts) + Harabara Mais Demo (CDN) for brand headlines
- **Path alias**: `@/*` maps to `./src/*`

### Key Directories

- `src/app/(public)/` — Public App Router pages: home, about, contact, services, service-areas, case-studies, privacy, terms. Its layout adds the Header/Footer chrome, and `sitemap.ts` lives here.
- `src/app/(portal)` — Client portal, off unless `PORTAL_ENABLED=true`. `src/middleware.ts` returns 404 for `/portal` and `/api/auth` while the flag is off, and lazily imports `@/lib/auth` after that check (a static import crashes the Edge runtime, because postgres needs Node `stream`).
- `src/app/robots.ts` — Lives at the app root (not in a route group) because Next only serves robots from there
- `src/app/not-found.tsx` — Root 404 for unknown URLs (they never reach a route group, so it repeats the Header/Footer chrome). `src/app/(public)/not-found.tsx` handles `notFound()` calls inside the group. Both render `src/components/NotFoundContent.tsx`.
- `src/app/(public)/api/contact/route.ts` — Contact form API route (SendGrid + Turnstile verification). Returns 400 for missing fields, 403 when Turnstile fails, 502 when the internal notification fails, 500 for unexpected errors (malformed body, missing `TURNSTILE_SECRET`), and 200 otherwise (a failed customer confirmation is logged but still returns 200). `src/lib/email/sendgrid.ts` throws on a missing key, template, or recipients.
- `src/components/` — Shared components (Header, Footer, StickyCTA, ContactCta, ContactForm, CaseStudyCards, NotFoundContent, JsonLd)
- `src/data/` — Static data: site config, services, service content, case studies, testimonials, page metadata (`page-meta.ts`), indexable static pages (`pages.ts`), redirects (`redirects.ts`)
- `src/lib/metadata.ts`, `src/lib/structured-data.ts` — `buildMetadata()` and JSON-LD builders
- `src/lib/brand.ts` — Brand config for email templates
- `src/lib/email/` — Email template utilities
- `src/utils/` — Icon components for services

### Data-Driven Pages

Service and case study pages are generated from static data in `src/data/`. `services.ts` holds the 14 services in menu order (three categories); `service-content.ts` holds each page's approved copy in the standard layout (no FAQPage markup). `/service-areas` is the only location page; there are no city pages. `case-studies.ts` feeds `/case-studies/[slug]` and the homepage cards. Retired service and city URLs redirect via `redirects.ts`.

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

`siteConfig.phone` and `googleBusinessProfileUrl` render nothing while empty. The phone is set to (949) 438-3418 and appears on the Contact page and in JSON-LD only.
