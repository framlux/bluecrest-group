# Website Content Update (Oct 13 docs) + GTM + Search Assets: Plan

Sources:
- `BlueCrest_Developer_Update_List.docx` (items 1–27, called **DU n** below). It governs where it conflicts with `docs/specs/2026-10-02-website-technical-fixes.md`.
- `BlueCrest_Website_Content.docx` (**WC**), the approved copy for each page.
- `BlueCrest_Case_Studies.docx` (**CS**).
- `~/Downloads/BlueCrest_Logo_Search_Assets/` (11 image files).
- GTM container `GTM-KP2P5CHB`.

## 0. Context

- The docs describe the **live prod site**, which is 44 commits behind this branch. They mention "Connect Today", "Book a call now", "18 Services Offered", and the Insights blog. Most T-spec work, including the blog removal (DU 2), is already done here. The plan only covers what is still different.
- Base: `chore/remove-sanity` (5 commits ahead of `main`, not merged yet). Branch `feat/oct-content-update` from it, or merge it first.
- Next `permanent: true` sends **308**. Google treats 308 the same as 301. If 301 is required literally, switch to `statusCode: 301`.

## 1. Streams and file map

### A. Google Tag Manager
- `src/app/layout.tsx`: put the supplied `<script>` inline in `<head>` (via `dangerouslySetInnerHTML`, as the first child) and the `<noscript><iframe>` as the first child of `<body>`. Keep the ID in one constant in `site-config.ts`.
- Root layout means every page gets it: public pages, both 404s, and the portal when it's enabled.
- Verify: view-source on `/`, `/services/fractional-cfo-services`, and an unknown URL shows both snippets. GTM Preview (Tag Assistant) connects to the local prod build.

### B. Search assets (DU 3)
- Copy into `public/`: `favicon.ico` (replaces the current one), `favicon-48x48/96x96/144x144/192x192/512x512.png`, `apple-touch-icon.png`, `og-image-1200x630.png`, `logo-square-512.png`. Also copy `logo-horizontal-1200.png` and `og-image-square-1200.png` (nothing references them yet; see open questions).
- `src/lib/metadata.ts`: `DEFAULT_OG_IMAGE.url = "/og-image-1200x630.png"`. Delete `public/images/og-default.jpg`.
- `src/app/(public)/layout.tsx` and root `not-found`: `icons` = ico + sized PNGs + `apple` 180.
- `src/lib/structured-data.ts`: `logo` = `/logo-square-512.png`. `image` keeps following the OG image.

### C. Service lineup: 18 → 14 (DU 4, 4a–d, 5, 21)
- `src/data/services.ts`
  - Rename to the final names and reorder to the item 4 order: Accounting: Controller, Bookkeeping, Payroll and HR, Merchant, Software Setup, Startup. CFO: CFO, FP&A, Modeling, Fundraising, M&A. Tax: Business Tax Planning, Sales Tax, Audit Prep.
  - New slugs: `payroll-and-hr-services`, `merchant-processing`, `financial-planning-and-analysis` (replaces `budgeting-and-forecasting`).
  - Delete `month-end-close-financial-statements`, `accounts-payable-receivable`, `operational-efficiency-consulting`, and `scaling-growth-support`. Remove the `consulting` category. Startup moves to `accounting`.
  - Rename the category to "Tax Planning and Audit Readiness". Use the WC descriptors for all three categories.
  - `shortDescription` = the WC Services-page card text.
  - Add `consultationPhrase` for the "Get Started Today" line, e.g. "fractional CFO" or "mergers and acquisitions advisory". It can't be derived from the name, because of the casing rules and because Audit uses "audit preparation".
  - Drop `metaDescription` and `serviceMetaDescription`.
  - `relatedSlugs` use only live slugs.
- `src/data/redirects.ts`: retarget payroll → `/services/payroll-and-hr-services` and KPI → `/services/financial-planning-and-analysis`. Add budgeting → FP&A, scaling-growth → CFO, month-end → bookkeeping, AP/AR → bookkeeping, and operational-efficiency → accounting-system-setup.
- `src/utils/service-icons.tsx`: icons for the 3 new slugs.
- Consumers:
  - Homepage category cards: 3 columns, list all of a category's services, no `.slice(0,3)`.
  - `Header.tsx` Services dropdown: categories with their services under them (DU 21).
  - `Footer.tsx` "All Services": item 4 order.
  - `ContactForm.tsx` select: `<optgroup>` per category in item 4 order instead of alphabetical, then "Other / Not Sure".
- Verify: tests (section 3); `grep` finds no deleted slug or old name in `src/`; curl each redirect source and get one hop to a 200.

### D. Service page template (DU 15, 16, 18, 19)
- `src/data/service-content.ts`: rewrite all 14 entries from WC.
  - Make the model fit the template: `whatsIncluded.content` and `processSection.intro` become optional; add `extraSections` (Bookkeeping: "What You Receive Each Month" and "Accounts Payable and Receivable Services"; FP&A: "KPI Development and Dashboards"); `applicationsSection` is optional, kept only for Controller, CFO, and Sales Tax ("From Checkout to Filed Return"); add `testimonial?`; add `faqHeading?` for when WC gives one.
  - Pricing appears on 9 pages. It is omitted on Payroll, Merchant, Software Setup, Modeling, and M&A.
- `src/app/(public)/services/[slug]/page.tsx`
  - Remove the hero tagline and the bottom "Ready to Get Started?" section.
  - Render `extraSections` and the testimonial inside Why Choose.
  - The pricing closing line is a constant rendered after the factors, so it can't drift.
  - "Get Started Today" text: `Schedule your free 15-minute consultation to discuss your ${consultationPhrase} needs.`
  - Drop `faqSchema`: delete the function and its test.
  - The Service JSON-LD description uses `shortDescription`.
- **No meta description** on the 14 service pages and Newport Beach. Make `description` optional in `buildMetadata`. When it's absent, return `description: null`, which is required. Otherwise Next inherits the `(public)` layout's default description, and that would be the duplicate DU 16 forbids. Also leave out `openGraph.description` and `twitter.description`.
- Verify: on the built site, `curl` each service page and confirm there's no `name="description"`, `og:description`, or `twitter:description`; there's exactly one H1; there's no `FAQPage`; the pricing closing line appears where expected.

### E. Case studies (DU 6, CS)
- New `src/data/case-studies.ts`: 3 entries with slug, title tag, meta description, H1, At a Glance, Challenge, What BlueCrest Did, Result, related slugs, and card heading and text.
- New `src/app/(public)/case-studies/[slug]/page.tsx`: `dynamicParams=false`, `buildMetadata` with `type: "article"`, JSON-LD `Article` (headline = H1, author = BlueCrest Group org, `datePublished`/`dateModified`) + `BreadcrumbList` (Home > H1). Ends with a "Contact Us" button to `/contact#contact-form`.
- New shared component `CaseStudyCards` with "Read the case study" links. Used on the homepage ("Case Studies") and on Newport Beach ("Client Results").
- `src/lib/sitemap-entries.ts` includes the 3 URLs.
- Verify: Rich Results Test or schema.org validator on a page; the sitemap lists 3 case study URLs.

### F. Page copy
- **Homepage** (`HomePageClient.tsx`, `page-meta.ts`)
  - Eyebrow becomes the H1. The large headline becomes a styled `<p>`. New subheading.
  - Remove the stats bar. New Who We Are ("nationwide" stays only here), The Result, and Why Us copy.
  - New "What Clients Say" section after Why Us with 4 testimonials. Testimonials live in `src/data/testimonials.ts`, shared with service pages.
  - Case Studies section.
  - Meet Josh: the heading links to `/about`, opening paragraph only, "Learn More" button removed, title "Principal".
  - Closing: remove the "Ready to Transform…" column. The form box gets the new heading and text.
- **About**
  - Remove Our Values. Delete `siteConfig.values`.
  - Who We Serve: replace the bullet text.
  - "Our Founder" becomes "Our Principal". Caption: "Josh Miller, Principal".
  - Closing CTA gets the new text and a "Contact Us" button.
  - Confirm the intro has no "nationwide".
- **Services hub**: new H1 and intro; remove the small category labels; remove "Why Choose Us / The BlueCrest Approach"; closing CTA text.
- **Service Areas**
  - H1 and intro, then the intro line and 12 cities as plain text; only Newport Beach links. Remove everything else.
  - `siteConfig.serviceAreaCities` drops San Clemente and Dana Point to match DU 14. This also changes JSON-LD `areaServed`.
- **Newport Beach** (`service-areas/[slug]`, `location-content.ts`)
  - New intro. "Our Services" shows 3 category links (`/services#accounting|cfo|tax`). Add "Client Results" cards. Remove every other section and the FAQ.
  - Title tag: "Fractional CFO & Accounting Services in Newport Beach, CA". The H1 stays without "Services". No description.
- **Contact**
  - Intro, form heading, and form text.
  - Phone `(949) 438-3418` set in `siteConfig.phone`. This turns on the existing tel link and JSON-LD `telephone`.
  - "Location: Newport Beach, CA. Serving Orange County".
  - What to Expect bullet 2 and the Service Area text.

### G. Sitewide CTA, footer, and Principal (DU 8, 10, 13, 22, 24)
- `src/lib/cta.ts`: `CONTACT_CTA_LABEL = "Book a 15-Min Call"`. `ContactCta` takes an optional `label` for the About and case-study "Contact Us" buttons. The form submit button stays "Send Message".
- `Footer.tsx`: delete the pre-footer banner and the gold "Connect Your Business to Success" link. Keep one CTA block in the footer: "Let's Talk About Your Business", the subtext, and the button.
- `siteConfig.founder.title = "Principal"`. This feeds the Person JSON-LD `jobTitle`, alt text, and captions.
- Remove `siteConfig.targetRevenue`. No "$1M+" anywhere (DU 26).

### H. Meta descriptions the docs don't cover
`page-meta.ts`: the home description says "business consulting" and "$1M+ revenue". The Services and Service Areas descriptions say "business consulting/advisory". The `businessSchema` description says "business advisory". All of these conflict with DU 4 and DU 26 and need new copy (drafts in section 4).

### I. Docs
Update `CLAUDE.md`: GTM, case studies route, CTA label, no-description rule for service and Newport pages, and the asset filenames. Bump `updatedAt` in `pages.ts` and `services.ts`.

## 2. Commit order
Each step leaves `pnpm lint && pnpm test && pnpm build` green.
1. GTM (A)
2. Search assets and icons (B)
3. Services data, redirects, menus, dropdowns (C). Old content for deleted slugs is removed in the same commit.
4. Service template, no-description metadata, FAQ schema removal (D)
5. Service content rewrite, 14 pages (D content)
6. Testimonials data and case studies (E)
7. Homepage, About, Services hub (F)
8. Service Areas, Newport Beach, Contact, phone (F)
9. CTA label, footer, Principal, meta copy (G, H)
10. CLAUDE.md and lastmod bumps (I)

## 3. Verification

**Tests to add or update (Vitest)**
- services: exactly 14 services; 3 categories in item 4 order; every `relatedSlugs` target exists; no slug is also a redirect source.
- redirects: the 9 service redirects resolve in one hop to a live slug (extends the existing tests).
- service-content: every service has content; ≤6 FAQs including a cost question; pricing present only on the 9 expected pages; no "Service Area Coverage" or tagline fields.
- metadata: `buildMetadata` without a description yields `description: null` and no og/twitter description; page-meta descriptions stay unique and contain no doubled word or lowercase acronym (T7).
- structured-data: logo path, Person `jobTitle` "Principal", `telephone` set, no `faqSchema` export.
- sitemap: includes 3 case studies and 14 services; excludes deleted slugs.
- cta: label "Book a 15-Min Call"; href behavior on `/contact` unchanged.
- Content guards: `src/` has no "Tax and Audit Support", "Business Consulting", "$1M", or old service names; "nationwide" appears only in `HomePageClient`.

**Built-site checks** (`pnpm build && pnpm start`, scripted with curl)
- Every sitemap URL returns 200 with one `<h1>` and `<title>` ending in "| BlueCrest Group" exactly once.
- Each old URL in DU 4a returns 308 to its target, and the target returns 200.
- The description-tag rules from D hold on all 15 pages; every other indexable page has a unique description.
- GTM script is in `<head>` and the noscript is the first child of `<body>`.
- `og:image` ends with `/og-image-1200x630.png`.

**Visual pass**: desktop and mobile screenshots of home, services hub, 3 representative service pages (Bookkeeping, Merchant, M&A), a case study, Service Areas, Newport Beach, About, and Contact. Check header dropdown and footer layout with 14 services.

## 4. Open questions and proposed defaults
See the conversation summary. Defaults are applied unless overridden.
