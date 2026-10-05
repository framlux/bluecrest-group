# Website Technical Fixes: Spec

**Date:** 2026-10-02
**Source:** "BlueCrest Website Technical Spec.docx" (Josh Miller, 2026-10-02), tickets T1–T20, S1–S3, R1–R5
**Method:** I checked each ticket against this repo (`main` @ `bd33d62`), the live site (`curl` against https://bluecrest-group.com on 2026-10-02), and the prod deployment manifests (`framlux/stack` → `clusters/prod/apps/bluecrest-web/base/`, deployed by Argo CD).

---

## 1. Verdict per ticket

| ID | Ticket | Verdict | Notes |
|----|--------|---------|-------|
| T1 | Canonical + og:url | **Accept** | No `alternates` or `openGraph.url` anywhere in the code. |
| T2 | Non-www only host | **Accept, smaller scope** | The doc is wrong on one point: `www` already 308-redirects to non-www, through the Traefik middleware `stack/…/bluecrest-web/base/middleware-www-redirect.yaml`, attached in `ingress.yaml`. Confirmed: `curl -I https://www.bluecrest-group.com/about` → `308 Location: https://bluecrest-group.com/about`. **Do not** add the `next.config` redirect. The remaining work is the `www` URLs in code: `robots.ts:10`, `sitemap.ts:7`, `site-config.ts:15` (which feeds JSON-LD `url`). |
| T3 | Rebuild sitemap | **Accept** | `sitemap.ts` sets `new Date()` for every URL, so all lastmods equal the build time (confirmed: 37 URLs, one lastmod). It includes `/insights` and leaves out `/privacy` and `/terms`. |
| T4 | Noindex Insights until it has content | **Accept** | Confirmed: "Insights — … \| BlueCrest Group" title, indexed, in nav, footer, and sitemap. |
| T5 | localhost og:image | **Accept** | Root cause confirmed: no `metadataBase` anywhere. Also, the OG image is **1000×570** but is declared as 1200×630 (`(public)/layout.tsx:38-39`). A correct 1200×630 image is needed. |
| T6 | Brand once in title | **Accept** | Confirmed on About, Contact, Service Areas, Privacy, Terms, city pages, and Insights. The pages hardcode the brand, and the layout template appends it again. |
| T7 | Meta description template | **Accept** | Confirmed: "fractional cfo services services", lowercase "kpi". Source: `services/[slug]/page.tsx:30`, `service-areas/[slug]/page.tsx:32`. |
| T8 | Per-page OG/Twitter | **Accept** | In Next.js, a page that sets no `openGraph` inherits the layout's static one, and a page that sets one replaces it completely (including `images`). Solved by one shared helper (see §3.1). |
| T9 | Structured data | **Accept, corrected premise** | The doc is wrong here: JSON-LD **does** exist and renders in `<head>` (two scripts: `ProfessionalService` + `AccountingService`). The work is: merge them into one entity, fix the `www` URL, add `logo`/`telephone`/`sameAs`/`areaServed` list, drop `geo` and the GeoCircle, and wire up the `ServiceSchema`, `FAQSchema`, and `BreadcrumbSchema` components. Those already exist in `JsonLd.tsx` but **no page uses them**. Add `Person` and `Article`. |
| T10 | Remove 12 city pages | **Accept** (business call) | The doorway-page concern is valid (the 13 pages come from one template). The doc missed one link source: the homepage "Serving …" section (`HomePageClient.tsx:398-470`) also links to city pages. |
| T11 | Service Areas hub + nav | **Accept** | `Header.tsx:68` (`slice(0, 8)`), `Header.tsx:240` ("View All {n}"), Footer city list (`getLocationsByPopulation`), and the "Nearby Service Areas" block on city pages. |
| T12 | Fold payroll + KPI pages | **Accept** (business call) | 18 services → 16. The dropdown is generated from `services`, so it updates automatically. |
| T13 | Service page template | **Accept, mostly copy** | Fixed counts are **not** in the template, which already maps arrays. The "10 bullets / 6 FAQs" pattern comes from the copy in `service-content.ts`. Code work: remove the hardcoded "Service Area Coverage" block, the generic fallback copy, and the templated CTA copy; make every section optional; add `metaDescription`, `relatedSlugs`, and JSON-LD. Copy comes from BlueCrest. |
| T14 | Blog for automated publishing | **Accept, on Sanity (D1)** | The doc is wrong here: a blog exists. It is Sanity-backed (`insights/`, `lib/sanity.ts`, `sanity/`) with no published articles, so it shows "Coming Soon". It does not publish automatically, because everything is cached at build time. The fix is interval refresh with ISR (see §3.6). The doc's Edward/GitHub publishing flow and S2 are dropped. |
| T15 | Phone + city | **Accept** (blocked on phone) | There is no phone number anywhere, because it was **deliberately removed** on 2026-03-07 (`fec815c`, `f6e3c9f`; previously 949-628-6123 in the header, footer, CTAs and JSON-LD). Confirm with Josh that re-adding a number, on the Contact page only, is intended, and which number. The doc missed one embed: there are **two** Orange County map iframes, `Footer.tsx:166` and `contact/page.tsx:209`. Remove both. |
| T16 | Standardize CTAs | **Accept** | 8 distinct labels found (list in §3.8). There is no calendar integration, so the "Book…" labels are misleading. |
| T17 | Confirm form delivers | **Accept, real bug found** | The route **returns 200 even when the internal notification fails**, and the senders return silently when `SENDGRID_API_KEY` is missing. Either way the visitor sees success and the lead is lost. Recipient: `info@bluecrest-group.com` (hardcoded, `sendgrid.ts:110-112`). |
| T18 | Duplicate homepage H3s | **Accept** | Two sections each map `serviceCategories` to `<h3>` (`HomePageClient.tsx:219` and `:271`). |
| T19 | Branded 404 | **Mostly done** | A branded 404 already renders with header/footer (confirmed live). Remaining: title is the homepage default, CTA says "Schedule Your Free Consultation", and there is no link to Fractional CFO Services. |
| T20 | Page speed | **Accept** | Hero video is **11 MB**, `autoPlay`, no `poster`, and has no mobile opt-out (`HomePageClient.tsx:68-76`). |
| S1, S3 | GBP, Search Console | **Outside the codebase** | S2 (Edward) is dropped (D6). |
| R1 | Logo | No change | `/images/bluecrest-group-logo.png` exists. |
| R2 | next-size-adjust | No change | Standard `next/font` output. |
| R3 | Meta keywords | **Remove** | `(public)/layout.tsx:15-23`. Not used anywhere else. |
| R4 | llms.txt | No change | |
| R5 | Email obfuscation | No change | Cloudflare `__cf_email__` confirmed on /contact. |

### Issues found outside the doc

1. **Turnstile is not implemented.** `CLAUDE.md` says the contact form uses Cloudflare Turnstile, but no code references it and the API route does no verification. The form is unprotected. (§3.9)
2. **`ContactForm.tsx:184` sorts the shared `services` array in place** (`services.sort(...)`). This mutates module state, so once a form renders, the order of `services` changes everywhere else, including `getRelatedServices` and the sitemap. Use `[...services].sort(...)`.
3. **Duplicate business entities in JSON-LD** (`ProfessionalService` and `AccountingService` with the same name). Google may treat them as two conflicting entities. Merged in §3.3.
4. **The JSON-LD is rendered with a manual `<head>` element inside a nested layout** (`(public)/layout.tsx:63-66`). It works today, but it is not the supported App Router pattern. Move the scripts into the layout body. Google reads JSON-LD anywhere in the document.
5. **Blog content is cached at build time** (`force-cache`, no `revalidate`), so new Sanity posts would not appear until a rebuild **and** a digest bump. Fixed in §3.6.
6. **`CLAUDE.md` is stale.** It claims Turnstile is in use (it is not), and its paths predate the `(public)` route group. Update it after this work.

### Deployment cross-check (`framlux/stack/clusters/prod/apps/bluecrest-web/base/`)

7. **Plaintext secrets are committed to git** in `deployment.yaml`: `SENDGRID_API_KEY` and `TURNSTILE_SECRET` sit as literal `value:` entries. The same directory already uses a SealedSecret for the GHCR pull credential. **Rotate the SendGrid API key and the Turnstile secret**, store them in a SealedSecret (`bluecrest-web-env`), and reference it with `envFrom`/`secretKeyRef`. Treat this as P0, independent of the SEO work.
8. **Prod runs an image from before the portal work.** The deployed commit is `f6e3c9f` (2026-03-07): the live sitemap lastmod matches, and `/portal/login` returns 404 live. `main` has 15+ unfinished portal commits from 2026-03-31, which need `DATABASE_URL` and `AUTH_SECRET` at runtime. Neither is set in `deployment.yaml`. The root layout's `SessionProvider` would also make every public page call `/api/auth/session`. **Resolved by D5 / §3.0:** the portal is switched off in prod.
9. **Deploys are not automatic.** Pushing to `prod` builds and pushes `ghcr.io/framlux/bluecrest/web:latest`. The Deployment, however, pins `latest@sha256:<digest>`, and Argo CD only syncs what is in `framlux/stack`. There is no image updater, and the digest is bumped by hand (e.g. "Updating BlueCrest site"). Code changes need a digest bump. Blog posts will not, once §3.6 ISR is in place.
10. **Runtime env lives in `deployment.yaml`, not in the GitHub workflow.** Route handlers read `process.env` at runtime. The `build-args` in `production.yaml` (`SENDGRID_*`) do nothing, because the Dockerfile declares no matching `ARG`s. Add any new server env var (e.g. `CONTACT_NOTIFY_TO`) to `deployment.yaml` or the SealedSecret. `NEXT_PUBLIC_*` values must be present at **build** time; they are, as build secrets.
11. **Both emails use the same SendGrid template.** `SENDGRID_TEMPLATE_ID` and `SENDGRID_TEMPLATE_CONFIRMATION` are both `d-a2ee…` in the deployment, and the code never reads `SENDGRID_TEMPLATE_CONFIRMATION` (`sendgrid.ts:81,124` both use `SENDGRID_TEMPLATE_ID`). So the internal lead notification is the customer confirmation email. Whether it shows every lead field depends on that template, which is exactly what T17 must verify. The code also has a different hardcoded fallback ID (`d-15217…`), which should be removed so a missing env fails loudly.
12. **Turnstile keys are provisioned but unused.** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET` are set in the deployment, but no code reads them. §3.9 can use them as they are once they are rotated (item 7).
13. **Two replicas.** Each pod keeps its own ISR cache, so the Sanity webhook fans out to every pod through a headless Service (§3.6).

---

## 2. Decisions needed before implementation

| # | Decision | Recommendation |
|---|----------|----------------|
| D1 | Blog backend | **Decided (2026-10-05): no blog.** Remove Sanity, the Insights pages, the publish webhook, and every Sanity dependency. `/insights` and `/insights/*` redirect (308) to `/`. This supersedes D2, D6, D7 and §3.6. |
| D2 | How posts go live | **Decided:** a Sanity webhook triggers an instant refresh on both pods, with a 5-minute interval refresh as the fallback (§3.6). Code changes still need a build plus a digest bump in `framlux/stack`. |
| D3 | Final list of cities shown as plain text on the Service Areas hub | **Waiting on Josh.** The list goes in `siteConfig.serviceAreaCities` and also feeds JSON-LD `areaServed`. Build with the current 13 names as a placeholder. |
| D4 | New 1200×630 OG image | **Waiting on Josh.** The current file is 1000×570. Wire `og-default.jpg` now and drop in the file when it arrives. |
| D5 | Portal | **Decided: hold it back.** Ship the SEO work from `main` with the portal disabled by a runtime flag (§3.0). Branching from the deployed commit (`f6e3c9f`, 2026-03-07) was rejected: it predates the `(public)` route-group move, so every file this spec touches sits at a different path there. |
| D6 | Who writes posts | **Decided:** posts are written and published directly in Sanity Studio. Edward and S2 are out of scope. |
| D7 | Sanity access | **Ask Josh** to invite Jonathan as Administrator on the Sanity project. That is his only step; we set up the webhook and deploy the schema ourselves (§3.6). |

Inputs still owed by BlueCrest (from the doc's §7): phone number, Google Business Profile URL, meta descriptions, service page copy.

---

## 3. Implementation spec

### 3.0 Disable the portal in production (D5) — do first

The portal (`/portal/*`, see `PRD.md`) is unfinished and must not be reachable in prod. It stays in `main`, switched off.

- **Flag:** server-only env `PORTAL_ENABLED`. The portal is on only when this equals `"true"`.
  - Prod `deployment.yaml` does not set it, so the portal is off.
  - Local dev sets it in `.env`.
- **`src/middleware.ts`:**
  - Check the flag **before** `auth()` runs. With the portal off, return a plain 404 and never touch Auth.js, which would throw without `AUTH_SECRET`.
  - Restructure the middleware: a plain function that returns 404 when the portal is off, and otherwise delegates to the existing `auth((req) => …)` handler.
  - Extend `matcher` to `["/portal/:path*", "/api/auth/:path*"]`, so the Auth.js endpoints are also 404 when the portal is off.
- **`(portal)/portal/layout.tsx` and `portal/login/layout.tsx`:** call `notFound()` when the flag is off, before `auth()`. This is defense in depth if the middleware matcher ever drifts.
- **`src/app/layout.tsx`:** remove `SessionProvider`. Nothing calls `useSession`, and the login page's `signIn` from `next-auth/react` works without the provider, so nothing replaces it. Public pages then load no next-auth client code and make no `/api/auth/session` request.
- **`src/lib/db/index.ts`:** leave as is. `postgres()` connects lazily, so importing it without `DATABASE_URL` does nothing until a query runs. The flag guarantees no query runs.
- **`robots.ts`:** disallow `/portal/` (already listed in §3.2).
- **Build:** the prod build must succeed with no `DATABASE_URL` and no `AUTH_SECRET`. That matches CI, which does not pass them. Verify with a clean build that does not read `.env`: temporarily move `.env` aside, or build the Docker image without those secrets.

**Acceptance:**
- In a prod-like run (`PORTAL_ENABLED` unset, no `AUTH_SECRET`/`DATABASE_URL`), `/portal`, `/portal/login`, `/portal/admin` and `/api/auth/session` all return 404.
- Public pages render, and the browser makes no request to `/api/auth/*`.
- With `PORTAL_ENABLED=true` locally, the portal works as before, and the existing middleware tests pass with the flag on.

### 3.1 Site URL + metadata helper (T1, T2, T5, T6, T7, T8, R3)

**`src/data/site-config.ts`**
- Replace `website: "www.bluecrest-group.com"` with `url: "https://bluecrest-group.com"`. Update every consumer.
- Add `phone: ""` and `googleBusinessProfileUrl: ""`, to be filled when BlueCrest supplies them. Code that reads them must render nothing when they are empty.
- Add `insightsEnabled: false` (T4), as the single switch.
- Add `serviceAreaCities: string[]` (D3).

**`src/app/(public)/layout.tsx`**
- Add `metadataBase: new URL(siteConfig.url)`.
- Title default: `"BlueCrest Group | Fractional CFO in Newport Beach, CA"` (≤60 chars). Template: `"%s | BlueCrest Group"`.
- Remove `keywords` (R3).
- Remove the static `openGraph.title/description` and `twitter.title/description`. Keep `siteName`, `type`, `locale`, the default `images` entry (1200×630), and `twitter.card`.

**New `src/lib/metadata.ts`**: `buildMetadata({ title, description, path, image?, noindex? }): Metadata`. It returns:
- `title` (the page phrase only; the template adds the brand),
- `description`,
- `alternates: { canonical: path }`,
- `openGraph: { title: <full title with brand>, description, url: path, images: image ? [image] : <site default> }`,
- `twitter: { title, description, images }`,
- `robots` when `noindex`.

Every public page uses this helper instead of a hand-written `metadata` object. This fixes T1 and T8 in one place, and keeps `images` from being dropped when a page sets `openGraph`.

**Per-page titles** (brand appended by the template, never written by hand):

| Page | `title` |
|------|---------|
| Home | use layout default (`title: { absolute: … }`) |
| About | `About Josh Miller, Fractional CFO` |
| Contact | `Contact Us` |
| Services hub | `Fractional CFO and Accounting Services` |
| Service | `${service.name} in Orange County, CA` (already correct) |
| Service Areas | `Service Areas` |
| Newport Beach | `Fractional CFO & Accounting in Newport Beach, CA` |
| Privacy / Terms | `Privacy Policy` / `Terms of Service` |
| Insights | `Insights` |
| Article | `article.title` |
| 404 | `Page Not Found` |

**Descriptions (T7):** delete the generated second sentence in `services/[slug]/page.tsx:30` and `service-areas/[slug]/page.tsx:32`. Add `metaDescription?: string` to `Service` (`data/services.ts`) and to the location record. Use it when present; otherwise fall back to `shortDescription` alone. BlueCrest supplies the final values (140–155 chars).

**Image:** add `public/images/og-default.jpg` at 1200×630 (D4) and point the default at it.

### 3.2 robots + sitemap (T2, T3, T4)

**`robots.ts`**: `sitemap: \`${siteConfig.url}/sitemap.xml\``. Keep `disallow: ["/api/"]` and add `"/portal/"`.

**New `src/data/pages.ts`**: a registry of static public pages: `{ path, updatedAt: "YYYY-MM-DD", indexable }` for `/`, `/about`, `/contact`, `/services`, `/service-areas`, `/service-areas/newport-beach-ca`, `/privacy`, `/terms`, and `/insights` (`indexable: siteConfig.insightsEnabled`).

**`sitemap.ts`** rewrite:
- Base URL from `siteConfig.url`.
- Static pages from the registry, filtered by `indexable`, with `lastModified: updatedAt`.
- Services from `services` (16), with `lastModified` from a new `updatedAt` field on each service.
- Articles from Sanity, with `lastModified: updatedAt ?? publishedAt`, included only when `insightsEnabled`. The sitemap revalidates every 300 s (§3.6).
- No city pages other than Newport Beach. Drop `changeFrequency` and `priority`, which Google ignores.

Rule for whoever edits content: bump `updatedAt` when you change a page's copy.

### 3.3 Structured data (T9)

**`src/components/JsonLd.tsx`**
- Replace `OrganizationSchema` and `LocalBusinessSchema` with one `BusinessSchema`: `@type: "ProfessionalService"`, `@id: "${url}/#business"`, `name`, `url`, `logo: ${url}/images/bluecrest-group-logo.png`, `image`, `email`, `telephone` (only if set), `address` (locality/region/country only), `areaServed` (AdministrativeArea "Orange County, CA" + each `serviceAreaCities` entry as `City`), `founder: { "@id": "${url}/about#josh-miller" }`, `sameAs` (GBP URL only if set). Remove `geo`, the GeoCircle, and `priceRange`. Keep opening hours only if BlueCrest confirms them.
- `PersonSchema`: `@id ${url}/about#josh-miller`, name, jobTitle, image, `worksFor: { "@id": "#business" }`. Rendered on /about.
- `ServiceSchema`: set `provider: { "@id": "${url}/#business" }` and `areaServed` Orange County.
- `ArticleSchema` (new): headline, description, image, `author` → Person `@id`, `publisher` → business `@id`, `datePublished`, `dateModified`, `mainEntityOfPage`.
- `BreadcrumbSchema`: takes `{ name, path }[]` and builds absolute URLs from `siteConfig.url`.
- Replace `dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}` with a shared `<JsonLdScript data={…} />` that escapes `<` as `<`. Article and FAQ text come from the CMS and from data files.

**`(public)/layout.tsx`**: remove the manual `<head>` and render `<BusinessSchema />` inside the fragment.

**Wiring:**

| Page | Schemas |
|------|---------|
| All public pages | BusinessSchema (layout) |
| About | Person, Breadcrumb |
| Service | Service, FAQPage (from the same `content.faqs` array `FAQSection` renders), Breadcrumb |
| Newport Beach | FAQPage, Breadcrumb |
| Services hub, Service Areas, Contact, Privacy, Terms, Insights | Breadcrumb |
| Article | Article, Breadcrumb |

The breadcrumbs that are already visible on service and location pages should be built from the same `items` array as the schema, so the two cannot drift.

### 3.4 City pages + Service Areas (T10, T11)

- **`data/locations.ts`**: reduce to Newport Beach only. Delete `getNearbyLocations`, `getLocationsByPopulation`, and the image-extension map entries for removed cities. Delete the `public/images/<city>/` folders for the 12 removed cities.
- **`data/location-content.ts`**: keep only `newport-beach-ca`.
- **`service-areas/[slug]/page.tsx`**: remove the "Nearby Service Areas" block, the shared CTA copy, and the generated description. `generateStaticParams` now yields one slug. Add `export const dynamicParams = false` so other slugs 404 (redirects run first).
- **`service-areas/page.tsx`**: replace the city card grid with a plain-text list of `serviceAreaCities` and one link to `/service-areas/newport-beach-ca`. Build the description without `locations.slice(0, 5)`.
- **`Header.tsx`**: the Service Areas dropdown shows Newport Beach and "View All Service Areas" (no count), on both desktop (`:212-245`) and mobile (`:340-360`).
- **`Footer.tsx`**: replace the city list with one "Service Areas" link to `/service-areas`.
- **`HomePageClient.tsx:398-470`**: the "Serving …" city cards and their "show more" state. Replace them with the city names as text, one Newport Beach link, and a link to the hub.

**Redirects** in `next.config.ts` `redirects()`, all `permanent: true` (308):

```ts
const removedCities = ["irvine-ca","costa-mesa-ca","huntington-beach-ca","laguna-beach-ca","orange-ca",
  "santa-ana-ca","anaheim-ca","fullerton-ca","tustin-ca","mission-viejo-ca","lake-forest-ca"];
[
  ...removedCities.map(c => ({ source: `/service-areas/${c}`, destination: "/service-areas", permanent: true })),
  { source: "/service-areas/corona-del-mar-ca", destination: "/service-areas/newport-beach-ca", permanent: true },
  { source: "/services/payroll-processing", destination: "/services/bookkeeping-and-reconciliation", permanent: true },
  { source: "/services/kpi-dashboards-reporting", destination: "/services/fractional-cfo-services", permanent: true },
]
```

Keep these in an exported `src/data/redirects.ts` so a test can check that every entry has one hop and that no destination is itself a source.

### 3.5 Services (T12, T13)

- **`data/services.ts`**: remove `payroll-processing` and `kpi-dashboards-reporting`. Add these fields:
  - `metaDescription?: string`
  - `updatedAt: string`
  - `relatedSlugs: string[]` (2–3 entries, curated)
- Replace `getRelatedServices`: it returns `fractional-cfo-services` first (except on that page itself), then the `relatedSlugs`. The result is never empty.
- **`data/service-content.ts`**: remove the two entries. Make every section optional (`whatsIncluded?`, `processSection?`, …) and **delete `serviceAreaCoverage`**. Remove the shared opening and closing location sentences from the `mainIntroduction` of all 16 entries now. Final copy replaces the rest later.
- **`services/[slug]/page.tsx`**:
  - Render each section only if present.
  - Remove the "Service Area Coverage" block (`:195-199`).
  - Remove the generic fallback paragraph (`:209-221`).
  - Remove the templated "Schedule your free consultation to discuss your {service} needs" and "Ready to Get Started With {service}?" body copy. Use neutral static copy or an optional per-service `ctaText`.
  - Add `dynamicParams = false`.
  - Wire up the schemas from §3.3.
- **`services/page.tsx`**: confirm it lists all 16 via `services` (it does, through categories).

### 3.6 Blog: removed (D1, 2026-10-05)

BlueCrest does not want a blog. Remove all of the following:
- `src/app/(public)/insights/**` and `src/app/(public)/api/revalidate/**`
- `src/lib/sanity*.ts`, `src/lib/insights.ts` and `src/lib/revalidate.ts`, with their tests
- `FeaturedInsights` and `PortableTextComponents`
- the `/sanity` package and the Sanity npm deps
- the `cdn.sanity.io` image pattern
- the Sanity env vars, in `.env.local.example`, the `Dockerfile` and `production.yaml`
- the `insightsEnabled` switch, the Insights nav and footer links, `pageMeta.insights`, Article JSON-LD, and article entries in the sitemap

Add permanent redirects for `/insights` and `/insights/:path*` to `/`.

In `framlux/stack`, drop the headless peers Service, `REVALIDATE_PEERS_HOST`, `SANITY_REVALIDATE_SECRET` and the `NEXT_PUBLIC_SANITY_*` env.

### 3.7 Phone, location, maps (T15)

- Contact page: show `siteConfig.phone` as `<a href="tel:+1XXXXXXXXXX">` with a human-readable format, only if it is set. Do not put it in the header.
- Remove the map iframes from `Footer.tsx:~160-175` and `contact/page.tsx:~205-215`.
- Footer location text: "Newport Beach, CA" only. Link it to `googleBusinessProfileUrl` when set, otherwise render plain text with no link (drop the Maps search link).

### 3.8 CTAs (T16)

Every CTA button becomes **"Contact Us"** and links to `/contact#contact-form`. Locations to change:

| File | Current label(s) |
|------|------------------|
| `Header.tsx:268, 384` | Connect Today |
| `Footer.tsx:30` | Book a call now |
| `Footer.tsx:85` | Book a 15-Min Call |
| `HomePageClient.tsx:102` | Book An Intro Call |
| `HomePageClient.tsx:373` (heading over form) | Schedule Your Free Consultation |
| `StickyCTA.tsx:37, 44` | Schedule your free consultation / Get a Free Consultation |
| `services/[slug]/page.tsx:84, 294` | Get a Free Consultation / Schedule Your Free Consultation |
| `service-areas/[slug]/page.tsx:97, 301` | same |
| `service-areas/page.tsx:67, 278` | Schedule a Consultation / Schedule Your Free Consultation |
| `services/page.tsx:187`, `about/page.tsx:231`, `insights/[slug]/page.tsx:214`, `not-found.tsx:160` | Schedule (a/Your) Free Consultation |

Add a shared `<ContactCta />` component (label + href) so the label is defined in one place.

- **Contact page anchor:** add `id="contact-form"` to the form container on `/contact`. On `/contact`, CTAs use `href="#contact-form"`, which scrolls without a reload (`usePathname() === "/contact"` inside `ContactCta`).
- **Headings and body copy:** text such as "Schedule a free consultation…" above forms is copy, not a button. Rewrite it so it does not promise a booking calendar, and confirm the wording with BlueCrest.

### 3.9 Contact form reliability (T17) and spam protection

- **`api/contact/route.ts`**:
  - If `sendInternalNotifications` fails, return **502** with an error, so the client shows its failure state and the visitor can retry or email directly. A failed customer confirmation should not fail the request.
  - The senders currently `return` silently when `SENDGRID_API_KEY` is missing. Make them **throw**.
- Move the internal recipient to an env var `CONTACT_NOTIFY_TO`, defaulting to `info@bluecrest-group.com`, and add it to `framlux/stack/…/bluecrest-web/base/deployment.yaml`. This is runtime env (item 10); do not add it to `production.yaml`.
- Read `SENDGRID_TEMPLATE_CONFIRMATION` for the customer email and `SENDGRID_TEMPLATE_ID` for the internal notification. Create a separate internal template in SendGrid that lists every lead field, and set the two env vars to different IDs. Remove the hardcoded fallback template ID (item 11).
- **`ContactForm.tsx:184`**: use `[...services].sort(...)`.
- **Turnstile** (gap between CLAUDE.md and the code): add the `@marsidev/react-turnstile` widget to `ContactForm` and verify the token server-side against `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `TURNSTILE_SECRET` before sending email. The secrets are already plumbed through the Dockerfile and workflow.
- **Manual check:** submit one test entry in production and confirm it arrives at the inbox with every field. Check the SendGrid activity feed for both templates.

### 3.10 Homepage headings (T18)

In the second section (`HomePageClient.tsx:271`), change the category `<h3>` to a non-heading element (`<p>` with the same classes), or merge the two sections. Keep the first set as `<h3>` under the "Our Services" `<h2>`. Each page keeps exactly one H1. (An earlier draft of this spec reported empty `<h2>` elements on the homepage. That was a parsing artifact: React inserts `<!-- -->` inside `Meet {name}`, and the headings are fine.)

### 3.11 404 page (T19)

`not-found.tsx`:
- Add `metadata` with title "Page Not Found" and `robots: { index: false }`.
- Change the CTA to "Contact Us".
- Add a "Fractional CFO Services" link to Popular Pages.
- Keep the remaining layout.

Status is already 404 (confirmed live).

### 3.12 Performance (T20)

- Add a `poster` to the hero `<video>`, a compressed still exported from the video (WebP/AVIF, at most ~150 KB), and `preload="none"`.
- Re-encode the video to at most ~2–3 MB: H.264, 720p, no audio track, short loop. Optionally add a WebM source as well.
- Mobile: do not autoplay below `lg`. Render only the poster image, either via a `matchMedia` check that mounts the `<video>` on desktop or via CSS that hides it with `preload="none"`.
- The `harabara-mais-demo` stylesheet comes from `fonts.cdnfonts.com` and blocks rendering. Self-host it with `next/font/local` if the license allows; otherwise add `preconnect`.
- Then run PageSpeed Insights (mobile + desktop) on `/`, `/services/fractional-cfo-services`, `/service-areas/newport-beach-ca`, and `/contact`, and fix the failures it reports.

### 3.13 Housekeeping

Update `CLAUDE.md`:
- `(public)` route paths
- the Sanity webhook (`/api/revalidate`, fan-out, env vars) and the 5-minute fallback refresh
- `insightsEnabled`
- `CONTACT_NOTIFY_TO`
- Turnstile as actually implemented

---

## 4. Suggested order

0. **Now, independent of this spec:** rotate the SendGrid key and the Turnstile secret, and move them to a SealedSecret in `framlux/stack` (item 7).
0b. **Before any release from `main`:** §3.0, the portal gate.
1. **P1 metadata foundation:** §3.1, §3.2, §3.3 (minus phone/GBP), R3, and the `ContactForm` sort fix.
2. **P1 structure:** §3.4 and §3.5 code (redirects, removals, template), plus §3.8 CTAs.
3. **P1 form:** §3.9, then a production test submission.
4. **P2:** §3.6 blog ISR and schema, §3.10, §3.11, §3.12.
5. **When inputs arrive:** phone, GBP URL, meta descriptions, and service copy are data-only edits in `site-config.ts`, `services.ts`, and `service-content.ts`.

## 5. Tests and verification

**Vitest** (fits the existing suite):
- Middleware: with `PORTAL_ENABLED` unset, `/portal/*` and `/api/auth/*` return 404 without calling `auth`. With it set to `"true"`, the existing behavior is unchanged.
- `buildMetadata`: canonical and `og:url` match; brand appears once; images are kept when overriding.
- Sitemap: no `www`; no removed, redirected, or noindexed URLs; contains `/privacy` and `/terms`; 16 services.
- Redirect map: every source is gone from `services`/`locations`, and no destination is also a source (one hop).
- Related services: every service except Fractional CFO includes it; 3–4 links total.
- Sanity fetch helper: every call passes `next.revalidate` and `tags: ["sanity"]`, and never `force-cache`.
- `/api/revalidate`:
  - Bad signature → 401, no revalidate.
  - Valid signature → `revalidateTag("sanity")` and one POST per peer IP.
  - Fan-out header with the right secret → revalidate, no further fan-out.
  - Wrong fan-out secret → 401.
  - Peer failure is still a 200.
- JSON-LD builders: no `streetAddress`; FAQPage entries equal `content.faqs`.
- Contact route: returns non-200 when the internal notification throws.

**After deploy:**
- Run the doc's §8 QA checklist.
- `grep -c localhost` = 0 on every page.
- `curl -I` every redirect.
- Rich Results Test on home, About, a service page, Newport Beach, and an article.
- LinkedIn Post Inspector.
- PageSpeed on the 4 pages.
