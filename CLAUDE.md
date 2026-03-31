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
pnpm studio           # Run Sanity Studio locally (localhost:3333, from /sanity dir)
pnpm studio:deploy    # Deploy Sanity Studio
```

The `/sanity` directory is a separate package with its own `package.json` and is excluded from the main TypeScript config.

## Architecture

- **Framework**: Next.js 15 App Router with React 19, TypeScript strict mode
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`
- **CMS**: Sanity CMS (separate studio in `/sanity`; not embedded in Next.js due to React 19 incompatibility)
- **Email**: SendGrid (`@sendgrid/mail`) for contact form submissions
- **Spam Protection**: Cloudflare Turnstile on contact form
- **Analytics**: Vercel Analytics
- **Font**: Poppins (Google Fonts) + Harabara Mais Demo (CDN) for brand headlines
- **Path alias**: `@/*` maps to `./src/*`

### Key Directories

- `src/app/` — App Router pages: home, about, contact, services, service-areas, insights (blog), privacy, terms
- `src/app/api/contact/route.ts` — Contact form API route (SendGrid + Turnstile verification)
- `src/app/insights/[slug]/` — Dynamic Sanity-powered blog articles
- `src/components/` — Shared components (Header, Footer, StickyCTA, ContactForm, FeaturedInsights, PortableTextComponents, JsonLd)
- `src/data/` — Static data: site config, services, locations, service content, location content
- `src/lib/sanity.ts` — GROQ queries and image URL builder
- `src/lib/sanity.client.ts` — Sanity client instance
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

## Docker Build

The Dockerfile uses multi-stage build with `output: 'standalone'` in next.config.ts. Secrets are passed via `--mount=type=secret` at build time for the Next.js build step.
