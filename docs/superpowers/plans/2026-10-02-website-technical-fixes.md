# Website Technical Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the code-side SEO, structure, form, and publishing fixes from the BlueCrest technical spec. This plan covers only the work that is not blocked on Josh. Values still pending render nothing, or use a placeholder until supplied.

**Architecture:** Per-page metadata, JSON-LD, the sitemap, redirects, and related-service logic move into small pure TypeScript modules under `src/lib` and `src/data`. Pages consume them, and Vitest (node environment, `*.test.ts` only) tests them. The unfinished client portal stays in the code but sits behind a runtime flag. Sanity content refreshes in two ways: a 5-minute ISR interval, plus a signed webhook that fans out to every pod.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4, Sanity (`@sanity/client`, `next-sanity`), SendGrid, Cloudflare Turnstile, Vitest 4, pnpm.

**Spec:** `docs/specs/2026-10-02-website-technical-fixes.md`. Read it first. Section references below (§3.x, items 1–13, D1–D7) point into it.

## Global Constraints

- The canonical origin is `https://bluecrest-group.com`: no `www`, no trailing slash on paths except `/`.
- The title template is `%s | BlueCrest Group`. Page-level titles never contain "BlueCrest Group". The one exception is the homepage, which uses `title: { absolute: ... }`.
- Every call-to-action button reads exactly `Contact Us` and points to the contact form (`/contact#contact-form`, or `#contact-form` on `/contact`).
- No street address anywhere: not in markup, JSON-LD, or copy. Location is "Newport Beach, CA" only.
- The portal (`src/app/(portal)`, `src/lib/auth.ts`, `src/lib/db`) is not modified, except for the gate in Task 1.
- Pending inputs, until supplied: `siteConfig.phone` and `siteConfig.googleBusinessProfileUrl` stay `""`, and code renders nothing when they are empty. `serviceAreaCities` holds the current 13 names as a placeholder (D3). `public/images/og-default.jpg` is a generated placeholder (D4).
- Do **not** run `pnpm studio:deploy`, change Sanity project settings, push to `prod`, or push `framlux/stack`. Those wait on D7 and the user.
- Do not read or print `.env` contents. Do not modify `.env`.
- After every task, `pnpm test` and `pnpm lint` must pass. Tasks that touch pages also run `pnpm build`.
- Commit messages use the conventional prefixes already in the repo (`feat:`, `fix:`, `chore:`), and carry no attribution lines.

## Review Focus

1. **An unsigned or forged POST to `/api/revalidate`** must return 401 and must not revalidate. Pinned in Task 8.
2. **One pod unreachable during webhook fan-out:** the request still returns 200 and the other peers are still called. Pinned in Task 8.
3. **A contact submission with a missing or expired Turnstile token** must get 403 with no email sent. Pinned in Task 10.
4. **A SendGrid failure on the internal lead notification** must surface to the visitor (502), never a false "success". Pinned in Task 10.
5. **FAQ or article text containing `</script>`** must not break out of the JSON-LD `<script>` tag. Pinned in Task 6.

---

## File Map

| File | Responsibility | Task |
|---|---|---|
| `src/lib/portal/flag.ts` | `isPortalEnabled()` | 1 |
| `src/middleware.ts` | 404 portal and auth routes when the flag is off | 1 |
| `src/data/site-config.ts` | adds `url`, `phone`, `googleBusinessProfileUrl`, `insightsEnabled`, `serviceAreaCities`; removes `website` | 2 |
| `src/lib/metadata.ts` | `buildMetadata()`, `DEFAULT_OG_IMAGE`, `fullTitle()` | 2 |
| `src/data/page-meta.ts` | titles and descriptions for static pages | 2 |
| `src/data/services.ts` | 16 services, `relatedSlugs`, `updatedAt`, `metaDescription`, `getRelatedServices()`, `serviceMetaDescription()` | 3, 4 |
| `src/data/redirects.ts` | the redirect map, consumed by `next.config.ts` | 4, 5 |
| `src/data/locations.ts` | Newport Beach only | 5 |
| `src/lib/structured-data.ts` | JSON-LD builders and `serializeJsonLd()` | 6 |
| `src/components/JsonLd.tsx` | renders `<script type="application/ld+json">` | 6 |
| `src/lib/sanity.client.ts` | `fetchSanity()` with ISR options | 7 |
| `src/lib/insights.ts` | article metadata input and the index switch | 7 |
| `sanity/schemaTypes/service-options.ts` | related-service options shown in Studio | 7 |
| `src/lib/revalidate.ts` | peer resolution and fan-out | 8 |
| `src/app/(public)/api/revalidate/route.ts` | Sanity webhook endpoint | 8 |
| `src/data/pages.ts`, `src/lib/sitemap-entries.ts` | sitemap registry and builder | 9 |
| `src/lib/turnstile.ts` | server-side Turnstile verification | 10 |
| `src/lib/email/sendgrid.ts`, `src/app/(public)/api/contact/route.ts` | form delivery that fails loudly | 10 |
| `src/lib/cta.ts`, `src/components/ContactCta.tsx` | the one CTA label and its href | 11 |
| `src/lib/phone.ts` | `telHref()` | 12 |
| `src/components/HeroVideo.tsx` | poster-first hero video | 13 |
| `framlux/stack/.../bluecrest-web/base/*` | headless Service and env wiring | 14 |

---

### Task 0: Branch and commit the spec

- [ ] **Step 1: Create the branch**

```bash
cd /Users/jonathanmiller/Repositories/josh/bluecrest-group
git checkout -b feat/seo-technical-fixes
```

- [ ] **Step 2: Commit the spec and plan**

```bash
git add docs/specs/2026-10-02-website-technical-fixes.md docs/superpowers/plans/2026-10-02-website-technical-fixes.md
git commit -m "docs: Add website technical fixes spec and implementation plan"
```

- [ ] **Step 3: Baseline**

Run: `pnpm test && pnpm lint`
Expected: 74 tests pass, and lint is clean. If the baseline fails, stop and report it; do not fix unrelated failures.

---

### Task 1: Gate the portal off in production (§3.0, D5)

**Files:**
- Create: `src/lib/portal/flag.ts`
- Modify: `src/middleware.ts`, `src/middleware.test.ts`, `src/app/layout.tsx`, `src/app/(portal)/portal/layout.tsx`, `src/app/(portal)/portal/login/layout.tsx`, `.env.local.example`

**Interfaces:**
- Produces: `isPortalEnabled(): boolean`, which is true only when `process.env.PORTAL_ENABLED === "true"`.

- [ ] **Step 1: Write the failing tests.** Replace the top of `src/middleware.test.ts`, from the imports through `beforeEach`, and add a new `describe` block. The existing six tests stay as they are, inside the `describe("middleware", ...)` block.

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock auth to pass through the handler function directly
const authMock = vi.hoisted(() => vi.fn((handler: Function) => handler));
vi.mock("@/lib/auth", () => ({ auth: authMock }));

import middleware from "./middleware";

function fakeReq(
  pathname: string,
  session: { user: { role: string } } | null
) {
  return {
    nextUrl: {
      pathname,
      searchParams: new URLSearchParams(),
    },
    url: `http://localhost:3000${pathname}`,
    auth: session,
  };
}

beforeEach(() => {
  process.env.PORTAL_ENABLED = "true";
});

afterEach(() => {
  delete process.env.PORTAL_ENABLED;
});

describe("middleware with portal disabled", () => {
  beforeEach(() => {
    delete process.env.PORTAL_ENABLED;
  });

  it.each(["/portal", "/portal/login", "/portal/admin", "/api/auth/session"])(
    "returns 404 for %s",
    (path) => {
      const response = (middleware as Function)(fakeReq(path, { user: { role: "admin" } }));
      expect(response.status).toBe(404);
    }
  );

  it("treats any value other than 'true' as disabled", () => {
    process.env.PORTAL_ENABLED = "1";
    const response = (middleware as Function)(fakeReq("/portal/dashboard", null));
    expect(response.status).toBe(404);
  });
});
```

Note that `vi.clearAllMocks()` is removed from `beforeEach`: it would reset `authMock`'s implementation, which is created at module load.

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `pnpm vitest run src/middleware.test.ts`
Expected: the "portal disabled" tests FAIL. The status is a redirect or a pass-through, not 404.

- [ ] **Step 3: Implement the flag and the middleware**

`src/lib/portal/flag.ts`:

```ts
/**
 * The client portal is unfinished and must not be reachable in production (spec D5).
 * It is on only when PORTAL_ENABLED is exactly "true"; prod does not set it.
 */
export function isPortalEnabled(): boolean {
  return process.env.PORTAL_ENABLED === "true";
}
```

`src/middleware.ts`:

```ts
import { auth } from "@/lib/auth";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { isPortalEnabled } from "@/lib/portal/flag";

const portalMiddleware = auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow login page and auth API routes without auth
  if (
    pathname === "/portal/login" ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!req.auth) {
    const loginUrl = new URL("/portal/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only routes
  if (pathname.startsWith("/portal/admin")) {
    if (req.auth.user.role !== "admin") {
      return NextResponse.redirect(new URL("/portal/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // Checked before auth runs: Auth.js throws without AUTH_SECRET, which prod does not set.
  if (!isPortalEnabled()) {
    return new NextResponse(null, { status: 404 });
  }
  return (portalMiddleware as unknown as (req: NextRequest, event: NextFetchEvent) => ReturnType<typeof NextResponse.next>)(req, event);
}

export const config = {
  matcher: ["/portal/:path*", "/api/auth/:path*"],
};
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `pnpm vitest run src/middleware.test.ts`
Expected: all tests PASS (6 existing + 5 new).

- [ ] **Step 5: Gate the layouts as defense in depth.** In `src/app/(portal)/portal/layout.tsx`:
  - add `import { notFound } from "next/navigation";` and `import { isPortalEnabled } from "@/lib/portal/flag";`
  - make the first line of `PortalLayout`'s body `if (!isPortalEnabled()) notFound();`, before `const session = await auth();`.

  In `src/app/(portal)/portal/login/layout.tsx`, add the same two imports and the same first line at the top of `LoginLayout`.

- [ ] **Step 6: Remove `SessionProvider` from the root layout.** In `src/app/layout.tsx`:
  - delete `import { SessionProvider } from "next-auth/react";`
  - replace `<SessionProvider>{children}</SessionProvider>` with `{children}`.

  Nothing calls `useSession`. The login page's `signIn` from `next-auth/react` works without the provider.

- [ ] **Step 7: Document the flag.** Append to `.env.local.example`:

```bash

# Client portal (unfinished; off unless exactly "true"). Set to true locally to work on it.
PORTAL_ENABLED=true
```

- [ ] **Step 8: Verify in a prod-like run**

```bash
pnpm build
PORTAL_ENABLED= pnpm start -p 3100 &
sleep 5
for p in /portal /portal/login /portal/admin /api/auth/session; do curl -s -o /dev/null -w "$p %{http_code}\n" http://localhost:3100$p; done
curl -s http://localhost:3100/ | grep -c "api/auth" ; kill %1
```

Expected:
- every portal path prints `404`
- the final grep prints `0`
- the build succeeds

If `.env` sets `PORTAL_ENABLED=true`, the empty prefix above still overrides it.

- [ ] **Step 9: Commit**

```bash
git add src/lib/portal/flag.ts src/middleware.ts src/middleware.test.ts src/app/layout.tsx "src/app/(portal)/portal/layout.tsx" "src/app/(portal)/portal/login/layout.tsx" .env.local.example
git commit -m "feat: Gate client portal behind PORTAL_ENABLED and drop SessionProvider from public pages"
```

---

### Task 2: Site URL, metadata helper, page meta, layout defaults (§3.1; T1, T2, T5, T8, R3)

**Files:**
- Modify: `src/data/site-config.ts`, `src/app/(public)/layout.tsx`, `src/components/JsonLd.tsx` (url fields only)
- Create: `src/lib/metadata.ts`, `src/lib/metadata.test.ts`, `src/data/page-meta.ts`, `src/data/page-meta.test.ts`, `public/images/og-default.jpg`

**Interfaces:**
- Produces:
  - `siteConfig.url: "https://bluecrest-group.com"`
  - `siteConfig.phone: string`
  - `siteConfig.googleBusinessProfileUrl: string`
  - `siteConfig.insightsEnabled: boolean`
  - `siteConfig.serviceAreaCities: readonly string[]`
  - `DEFAULT_OG_IMAGE: { url: string; width: number; height: number; alt: string }`
  - `fullTitle(title: string, absolute?: boolean): string`
  - `interface PageMetadataInput { title: string; description: string; path: string; image?: { url: string; width?: number; height?: number; alt?: string }; noindex?: boolean; absoluteTitle?: boolean; type?: "website" | "article" }`
  - `buildMetadata(input: PageMetadataInput): Metadata`
  - `pageMeta.{home, about, contact, services, serviceAreas, privacy, terms, insights}: PageMeta`
  - `pageMeta.notFound: { title: string; description: string }`
  - `interface PageMeta { path: string; title: string; description: string; absoluteTitle?: boolean }`

- [ ] **Step 1: Update `site-config.ts`.** Replace the line `website: "www.bluecrest-group.com",` with:

```ts
  url: "https://bluecrest-group.com",
  // T15: supplied by Josh. Empty renders nothing.
  phone: "" as string,
  // S1: Google Business Profile URL. Empty renders nothing.
  googleBusinessProfileUrl: "" as string,
```

After the `serviceArea` line, add:

```ts
  // T4: flip to true once three articles are published. Restores Insights in nav, footer, sitemap, and indexing.
  insightsEnabled: false as boolean,
  // D3: cities listed on the Service Areas hub and in JSON-LD areaServed. Placeholder until Josh confirms.
  serviceAreaCities: [
    "Newport Beach",
    "Corona del Mar",
    "Irvine",
    "Costa Mesa",
    "Huntington Beach",
    "Laguna Beach",
    "Orange",
    "Santa Ana",
    "Anaheim",
    "Fullerton",
    "Tustin",
    "Mission Viejo",
    "Lake Forest",
  ],
```

The `as string` and `as boolean` casts stop `as const` from narrowing these to literal types, so later edits to the values do not ripple into type errors.

In `src/components/JsonLd.tsx`, replace the three occurrences of `` `https://${siteConfig.website}` `` with `siteConfig.url`. Task 6 rewrites this file.

- [ ] **Step 2: Write the failing tests.** `src/lib/metadata.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildMetadata, fullTitle, DEFAULT_OG_IMAGE } from "./metadata";

describe("buildMetadata", () => {
  const base = { title: "Contact Us", description: "Reach the team.", path: "/contact" };

  it("sets canonical and og:url to the same path", () => {
    const m = buildMetadata(base);
    expect(m.alternates?.canonical).toBe("/contact");
    expect((m.openGraph as { url?: string }).url).toBe("/contact");
  });

  it("strips trailing slashes except on the root", () => {
    expect(buildMetadata({ ...base, path: "/about/" }).alternates?.canonical).toBe("/about");
    expect(buildMetadata({ ...base, path: "/" }).alternates?.canonical).toBe("/");
  });

  it("rejects relative or absolute-URL paths", () => {
    expect(() => buildMetadata({ ...base, path: "contact" })).toThrow();
    expect(() => buildMetadata({ ...base, path: "https://bluecrest-group.com/x" })).toThrow();
  });

  it("puts the brand exactly once in social titles", () => {
    const m = buildMetadata(base);
    expect(m.title).toBe("Contact Us");
    expect((m.openGraph as { title?: string }).title).toBe("Contact Us | BlueCrest Group");
    expect((m.twitter as { title?: string }).title).toBe("Contact Us | BlueCrest Group");
  });

  it("supports absolute titles for the homepage", () => {
    const m = buildMetadata({ ...base, title: "BlueCrest Group | Fractional CFO", absoluteTitle: true, path: "/" });
    expect(m.title).toEqual({ absolute: "BlueCrest Group | Fractional CFO" });
    expect((m.openGraph as { title?: string }).title).toBe("BlueCrest Group | Fractional CFO");
  });

  it("uses page description for og and twitter", () => {
    const m = buildMetadata(base);
    expect((m.openGraph as { description?: string }).description).toBe("Reach the team.");
    expect((m.twitter as { description?: string }).description).toBe("Reach the team.");
  });

  it("falls back to the default OG image and keeps siteName/type/locale", () => {
    const og = buildMetadata(base).openGraph as Record<string, unknown>;
    expect(og.images).toEqual([DEFAULT_OG_IMAGE]);
    expect(og.siteName).toBe("BlueCrest Group");
    expect(og.locale).toBe("en_US");
    expect(og.type).toBe("website");
  });

  it("uses a per-page image when given", () => {
    const img = { url: "https://cdn.sanity.io/x.jpg", width: 1200, height: 630, alt: "x" };
    const m = buildMetadata({ ...base, image: img });
    expect((m.openGraph as { images?: unknown }).images).toEqual([img]);
    expect((m.twitter as { images?: unknown }).images).toEqual([img.url]);
  });

  it("sets noindex, follow only when asked", () => {
    expect(buildMetadata(base).robots).toBeUndefined();
    expect(buildMetadata({ ...base, noindex: true }).robots).toEqual({ index: false, follow: true });
  });
});

describe("fullTitle", () => {
  it("appends the brand unless absolute", () => {
    expect(fullTitle("Insights")).toBe("Insights | BlueCrest Group");
    expect(fullTitle("BlueCrest Group | Home", true)).toBe("BlueCrest Group | Home");
  });
});
```

`src/data/page-meta.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { pageMeta } from "./page-meta";
import { fullTitle } from "@/lib/metadata";

const entries = Object.entries(pageMeta).filter(([k]) => k !== "notFound") as [string, { path: string; title: string; description: string; absoluteTitle?: boolean }][];

describe("pageMeta", () => {
  it.each(entries)("%s: title carries no brand unless absolute", (_k, m) => {
    if (!m.absoluteTitle) expect(m.title).not.toContain("BlueCrest Group");
  });

  it.each(entries)("%s: full title fits in 60 characters", (_k, m) => {
    expect(fullTitle(m.title, m.absoluteTitle).length).toBeLessThanOrEqual(60);
  });

  it.each(entries)("%s: title has no em dash", (_k, m) => {
    expect(m.title).not.toContain("—");
  });

  it("descriptions are unique", () => {
    const d = entries.map(([, m]) => m.description);
    expect(new Set(d).size).toBe(d.length);
  });

  it("paths are unique and root-relative", () => {
    const p = entries.map(([, m]) => m.path);
    expect(new Set(p).size).toBe(p.length);
    p.forEach((x) => expect(x.startsWith("/")).toBe(true));
  });
});
```

- [ ] **Step 3: Run the tests and confirm they fail**

Run: `pnpm vitest run src/lib/metadata.test.ts src/data/page-meta.test.ts`
Expected: FAIL. The modules do not exist yet.

- [ ] **Step 4: Implement `src/lib/metadata.ts`**

```ts
import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

export const DEFAULT_OG_IMAGE = {
  url: "/images/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "BlueCrest Group, fractional CFO services in Newport Beach, CA",
};

const BRAND_SUFFIX = ` | ${siteConfig.businessName}`;

export interface PageMetadataInput {
  /** Page phrase only. The layout template appends the brand. */
  title: string;
  description: string;
  /** Root-relative path, e.g. "/about". Resolved against metadataBase. */
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  noindex?: boolean;
  /** Title is already complete (homepage). */
  absoluteTitle?: boolean;
  type?: "website" | "article";
}

export function fullTitle(title: string, absolute = false): string {
  return absolute ? title : `${title}${BRAND_SUFFIX}`;
}

function canonicalPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error(`buildMetadata: path must be root-relative, got "${path}"`);
  }
  return path === "/" ? "/" : path.replace(/\/+$/, "");
}

/**
 * One place that sets title, description, canonical, og:* and twitter:* together.
 * A page that sets openGraph replaces the layout's whole openGraph object, so
 * siteName/type/locale/images are always included here.
 */
export function buildMetadata(input: PageMetadataInput): Metadata {
  const path = canonicalPath(input.path);
  const socialTitle = fullTitle(input.title, input.absoluteTitle);
  const image = input.image ?? DEFAULT_OG_IMAGE;

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: path },
    openGraph: {
      type: input.type ?? "website",
      locale: "en_US",
      siteName: siteConfig.businessName,
      url: path,
      title: socialTitle,
      description: input.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: input.description,
      images: [image.url],
    },
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
```

- [ ] **Step 5: Implement `src/data/page-meta.ts`.** The descriptions are the current live ones, except where they were broken. Final copy will replace them.

```ts
import { siteConfig } from "@/data/site-config";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}

const { businessName, city, stateAbbr, region, founder } = siteConfig;

export const pageMeta = {
  home: {
    path: "/",
    title: `${businessName} | Fractional CFO in ${city}, ${stateAbbr}`,
    absoluteTitle: true,
    description: `${businessName} provides fractional CFO, accounting, and business consulting services for growing businesses in ${city}, ${stateAbbr} and ${region}. Expert financial leadership for companies with $1M+ revenue.`,
  },
  about: {
    path: "/about",
    title: `About ${founder.name}, Fractional CFO`,
    description: `Learn about ${businessName} and founder ${founder.name}. We provide fractional CFO and accounting services to growing businesses in ${region}.`,
  },
  contact: {
    path: "/contact",
    title: "Contact Us",
    description: `Contact ${businessName} for fractional CFO and accounting services in ${city} and ${region}. Send us a message and we will be in touch.`,
  },
  services: {
    path: "/services",
    title: "Fractional CFO and Accounting Services",
    description: `Explore our fractional CFO, accounting, and business consulting services for growing businesses in ${city}, ${stateAbbr} and ${region}.`,
  },
  serviceAreas: {
    path: "/service-areas",
    title: "Service Areas",
    description: `From ${city}, ${businessName} provides fractional CFO, accounting, and business advisory services to businesses throughout ${region}, California.`,
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy",
    description: `Privacy policy for ${businessName}. Learn how we collect, use, and protect your personal information.`,
  },
  terms: {
    path: "/terms",
    title: "Terms of Service",
    description: `Terms of service for ${businessName}. Review our terms and conditions for using our fractional CFO and accounting services.`,
  },
  insights: {
    path: "/insights",
    title: "Insights",
    description: `Insights on financial strategy, business growth, tax planning, and CFO best practices from ${businessName}.`,
  },
  notFound: {
    title: "Page Not Found",
    description: "The page you are looking for could not be found.",
  },
} satisfies Record<string, PageMeta | { title: string; description: string }>;
```

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `pnpm vitest run src/lib/metadata.test.ts src/data/page-meta.test.ts`
Expected: PASS.

- [ ] **Step 7: Generate the placeholder OG image (D4)**

```bash
sips --resampleWidth 1200 public/images/Orange-County-CA-fractional-cfo.jpg --out /tmp/og-wide.jpg
sips --cropToHeightWidth 630 1200 /tmp/og-wide.jpg --out public/images/og-default.jpg
sips -g pixelWidth -g pixelHeight public/images/og-default.jpg
```

Expected: `pixelWidth: 1200`, `pixelHeight: 630`.

- [ ] **Step 8: Rewrite the `metadata` export in `src/app/(public)/layout.tsx`**

```ts
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: pageMeta.home.title,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: pageMeta.home.description,
  authors: [{ name: siteConfig.businessName }],
  creator: siteConfig.businessName,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.businessName,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

Add `import { pageMeta } from "@/data/page-meta";` and `import { DEFAULT_OG_IMAGE } from "@/lib/metadata";`. The `keywords` array is gone (R3).

- [ ] **Step 9: Verify**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: all pass. No remaining reference to `siteConfig.website` (`grep -rn "siteConfig.website" src` prints nothing).

- [ ] **Step 10: Commit**

```bash
git add src/data/site-config.ts src/lib/metadata.ts src/lib/metadata.test.ts src/data/page-meta.ts src/data/page-meta.test.ts public/images/og-default.jpg "src/app/(public)/layout.tsx" src/components/JsonLd.tsx
git commit -m "feat: Add metadataBase, metadata helper, and per-page meta registry"
```

---

### Task 3: Apply metadata to every public page (T1, T6, T7, T8)

**Files:**
- Modify:
  - `src/app/(public)/page.tsx`, `about/page.tsx`, `contact/page.tsx`, `services/page.tsx`, `service-areas/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`
  - `services/[slug]/page.tsx`, `service-areas/[slug]/page.tsx`
  - `src/data/services.ts`, `src/data/locations.ts`
- Test: `src/data/services.test.ts` (create)

**Interfaces:**
- Consumes: `buildMetadata`, `pageMeta` (Task 2).
- Produces:
  - `Service.metaDescription?: string`
  - `serviceMetaDescription(s: Service): string`
  - `Location.metaDescription?: string`

- [ ] **Step 1: Write the failing test.** `src/data/services.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { services, serviceMetaDescription } from "./services";

describe("service meta descriptions", () => {
  const descs = services.map(serviceMetaDescription);

  it("are unique", () => {
    expect(new Set(descs).size).toBe(descs.length);
  });

  it.each(services.map((s) => [s.slug, serviceMetaDescription(s)]))(
    "%s has no doubled word and no lowercase acronym",
    (_slug, d) => {
      expect(d).not.toMatch(/\b(\w+)\s+\1\b/i);
      expect(d).not.toMatch(/\bkpi\b/);
      expect(d).not.toMatch(/\bcfo\b/);
    }
  );
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `pnpm vitest run src/data/services.test.ts`
Expected: FAIL (`serviceMetaDescription` is not exported).

- [ ] **Step 3: Implement it.** In `src/data/services.ts`:
  - add `metaDescription?: string;` to `interface Service`, after `shortDescription`
  - append:

```ts
/** Per-page meta description: the supplied override, else the short description alone (T7). */
export function serviceMetaDescription(service: Service): string {
  return service.metaDescription ?? service.shortDescription;
}
```

In `src/data/locations.ts`, add `metaDescription?: string;` to `interface Location`.

- [ ] **Step 4: Run the test and confirm it passes**

Run: `pnpm vitest run src/data/services.test.ts`
Expected: PASS.

- [ ] **Step 5: Replace each static page's `metadata` export.** In each file, replace the existing `export const metadata: Metadata = {...};` and add `import { buildMetadata } from "@/lib/metadata";` and `import { pageMeta } from "@/data/page-meta";`:

| File | New export |
|---|---|
| `about/page.tsx` | `export const metadata: Metadata = buildMetadata(pageMeta.about);` |
| `contact/page.tsx` | `export const metadata: Metadata = buildMetadata(pageMeta.contact);` |
| `services/page.tsx` | `export const metadata: Metadata = buildMetadata(pageMeta.services);` |
| `service-areas/page.tsx` | `export const metadata: Metadata = buildMetadata(pageMeta.serviceAreas);` |
| `privacy/page.tsx` | `export const metadata: Metadata = buildMetadata(pageMeta.privacy);` |
| `terms/page.tsx` | `export const metadata: Metadata = buildMetadata(pageMeta.terms);` |
| `(public)/page.tsx` (home) | add `import type { Metadata } from "next";` and `export const metadata: Metadata = buildMetadata(pageMeta.home);` |

Remove any `siteConfig` import that becomes unused.

- [ ] **Step 6: Update the service page.** In `services/[slug]/page.tsx`, replace the body of `generateMetadata`'s success branch:

```ts
  if (!service) {
    return { title: pageMeta.notFound.title };
  }

  return buildMetadata({
    title: `${service.name} in ${siteConfig.region}, ${siteConfig.stateAbbr}`,
    description: serviceMetaDescription(service),
    path: `/services/${service.slug}`,
  });
```

Import `serviceMetaDescription` from `@/data/services`, plus `buildMetadata` and `pageMeta`.

- [ ] **Step 7: Update the location page.** In `service-areas/[slug]/page.tsx`, replace `generateMetadata`'s branches:

```ts
  if (!location) {
    return { title: pageMeta.notFound.title };
  }

  return buildMetadata({
    title: `Fractional CFO & Accounting in ${location.name}, ${location.stateAbbr}`,
    description: location.metaDescription ?? location.shortDescription,
    path: `/service-areas/${location.slug}`,
  });
```

- [ ] **Step 8: Verify the rendered tags**

```bash
pnpm build && (PORTAL_ENABLED= pnpm start -p 3100 &) && sleep 5
for p in / /about /contact /services /service-areas /privacy /terms /services/fractional-cfo-services /service-areas/newport-beach-ca; do
  html=$(curl -s http://localhost:3100$p)
  echo "== $p"
  echo "$html" | grep -oE '<title>[^<]*</title>|<link rel="canonical" href="[^"]*"|<meta property="og:url" content="[^"]*"|<meta property="og:image" content="[^"]*"'
done
curl -s http://localhost:3100/about | grep -c localhost
pkill -f "next start -p 3100"
```

Expected:
- every page has one `<title>` with "BlueCrest Group" exactly once
- `canonical` and `og:url` are equal and start with `https://bluecrest-group.com`
- `og:image` is `https://bluecrest-group.com/images/og-default.jpg`
- the localhost count is `0`

- [ ] **Step 9: Run `pnpm test && pnpm lint`, then commit**

```bash
git add "src/app/(public)" src/data/services.ts src/data/services.test.ts src/data/locations.ts
git commit -m "feat: Canonical, social, and single-brand titles on every public page"
```

---

### Task 4: Fold two services and rebuild the service template (§3.5; T12, T13)

**Files:**
- Create: `src/data/redirects.ts`, `src/data/redirects.test.ts`
- Modify:
  - `src/data/services.ts`, `src/data/services.test.ts`, `src/data/service-content.ts`
  - `src/app/(public)/services/[slug]/page.tsx`
  - `src/utils/service-icons.tsx`, `src/components/HomePageClient.tsx`, `src/components/ContactForm.tsx`
  - `next.config.ts`

**Interfaces:**
- Produces:
  - `Service.relatedSlugs: string[]` and `Service.updatedAt: string` (YYYY-MM-DD)
  - `getRelatedServices(slug: string): Service[]`, which returns `fractional-cfo-services` first (except on that page itself), then `relatedSlugs`
  - `interface Redirect { source: string; destination: string; permanent: true }` and `redirects: Redirect[]`
  - `ServiceContent` sections all optional; `serviceAreaCoverage` removed

- [ ] **Step 1: Write the failing tests.** In `src/data/services.test.ts`, extend the existing import to `import { services, serviceMetaDescription, getRelatedServices, getServiceBySlug } from "./services";`, then append:

```ts

const CFO = "fractional-cfo-services";

describe("service catalogue", () => {
  it("has 16 services and none of the folded ones", () => {
    expect(services).toHaveLength(16);
    expect(getServiceBySlug("payroll-processing")).toBeUndefined();
    expect(getServiceBySlug("kpi-dashboards-reporting")).toBeUndefined();
  });

  it.each(services.map((s) => [s.slug, s]))("%s relatedSlugs are valid", (_slug, s) => {
    expect(s.relatedSlugs.length).toBeGreaterThanOrEqual(2);
    expect(s.relatedSlugs.length).toBeLessThanOrEqual(3);
    s.relatedSlugs.forEach((r) => {
      expect(getServiceBySlug(r)).toBeDefined();
      expect(r).not.toBe(s.slug);
    });
  });

  it.each(services.map((s) => [s.slug]))("%s related services lead with Fractional CFO", (slug) => {
    const related = getRelatedServices(slug).map((s) => s.slug);
    if (slug !== CFO) expect(related[0]).toBe(CFO);
    expect(related).not.toContain(slug);
    expect(new Set(related).size).toBe(related.length);
    expect(related.length).toBeGreaterThanOrEqual(2);
    expect(related.length).toBeLessThanOrEqual(4);
  });

  it.each(services.map((s) => [s.slug, s.updatedAt]))("%s updatedAt is a date", (_s, d) => {
    expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
```

`src/data/redirects.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { redirects } from "./redirects";
import { getServiceBySlug } from "./services";

describe("redirect map", () => {
  it("every entry is permanent and root-relative", () => {
    redirects.forEach((r) => {
      expect(r.permanent).toBe(true);
      expect(r.source.startsWith("/")).toBe(true);
      expect(r.destination.startsWith("/")).toBe(true);
    });
  });

  it("is one hop: no destination is also a source", () => {
    const sources = new Set(redirects.map((r) => r.source));
    redirects.forEach((r) => expect(sources.has(r.destination)).toBe(false));
  });

  it("sources are unique", () => {
    expect(new Set(redirects.map((r) => r.source)).size).toBe(redirects.length);
  });

  it("no redirected service still exists", () => {
    redirects
      .filter((r) => r.source.startsWith("/services/"))
      .forEach((r) => expect(getServiceBySlug(r.source.replace("/services/", ""))).toBeUndefined());
  });

  it("service destinations exist", () => {
    redirects
      .filter((r) => r.destination.startsWith("/services/"))
      .forEach((r) => expect(getServiceBySlug(r.destination.replace("/services/", ""))).toBeDefined());
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `pnpm vitest run src/data/services.test.ts src/data/redirects.test.ts`
Expected: FAIL. There are 18 services, `relatedSlugs` is undefined, and `redirects` does not exist.

- [ ] **Step 3: Update `src/data/services.ts`:**
  - Delete the `payroll-processing` (id 5) and `kpi-dashboards-reporting` (id 10) objects.
  - Add `relatedSlugs: string[];` and `updatedAt: string;` to `interface Service`.
  - Add `updatedAt: "2026-10-02",` to every remaining object.
  - Add each object's `relatedSlugs` from this table:

| slug | relatedSlugs |
|---|---|
| fractional-controller-services | `["month-end-close-financial-statements", "bookkeeping-and-reconciliation", "accounting-system-setup"]` |
| bookkeeping-and-reconciliation | `["month-end-close-financial-statements", "accounts-payable-receivable", "fractional-controller-services"]` |
| month-end-close-financial-statements | `["bookkeeping-and-reconciliation", "fractional-controller-services", "audit-preparation"]` |
| accounts-payable-receivable | `["bookkeeping-and-reconciliation", "budgeting-and-forecasting", "accounting-system-setup"]` |
| accounting-system-setup | `["bookkeeping-and-reconciliation", "fractional-controller-services", "operational-efficiency-consulting"]` |
| fractional-cfo-services | `["budgeting-and-forecasting", "financial-modeling", "fundraising-support"]` |
| budgeting-and-forecasting | `["financial-modeling", "scaling-growth-support", "month-end-close-financial-statements"]` |
| financial-modeling | `["budgeting-and-forecasting", "fundraising-support", "mergers-acquisitions-advisory"]` |
| fundraising-support | `["financial-modeling", "startup-business-services", "mergers-acquisitions-advisory"]` |
| mergers-acquisitions-advisory | `["financial-modeling", "audit-preparation", "fundraising-support"]` |
| tax-strategy-planning | `["sales-tax-compliance", "audit-preparation", "budgeting-and-forecasting"]` |
| sales-tax-compliance | `["tax-strategy-planning", "accounting-system-setup", "bookkeeping-and-reconciliation"]` |
| audit-preparation | `["month-end-close-financial-statements", "tax-strategy-planning", "fractional-controller-services"]` |
| startup-business-services | `["bookkeeping-and-reconciliation", "fundraising-support", "scaling-growth-support"]` |
| operational-efficiency-consulting | `["scaling-growth-support", "accounting-system-setup", "fractional-controller-services"]` |
| scaling-growth-support | `["operational-efficiency-consulting", "budgeting-and-forecasting", "startup-business-services"]` |

Replace `getRelatedServices`:

```ts
const ANCHOR_SERVICE = "fractional-cfo-services";

/** Every service page links to Fractional CFO Services plus its curated related services (T13). */
export function getRelatedServices(currentSlug: string): Service[] {
  const current = getServiceBySlug(currentSlug);
  const slugs = [
    ...(currentSlug === ANCHOR_SERVICE ? [] : [ANCHOR_SERVICE]),
    ...(current?.relatedSlugs ?? []),
  ];
  return [...new Set(slugs)]
    .filter((slug) => slug !== currentSlug)
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is Service => Boolean(s));
}
```

- [ ] **Step 4: Create `src/data/redirects.ts`**

```ts
/** Permanent (308) redirects for removed pages. One hop each; see the spec's Redirect Map. */
export interface Redirect {
  source: string;
  destination: string;
  permanent: true;
}

export const redirects: Redirect[] = [
  { source: "/services/payroll-processing", destination: "/services/bookkeeping-and-reconciliation", permanent: true },
  { source: "/services/kpi-dashboards-reporting", destination: "/services/fractional-cfo-services", permanent: true },
];
```

In `next.config.ts`, add `import { redirects as siteRedirects } from "./src/data/redirects";` and put this inside `nextConfig`:

```ts
  async redirects() {
    return siteRedirects;
  },
```

- [ ] **Step 5: Run the tests and confirm they pass**

Run: `pnpm vitest run src/data/services.test.ts src/data/redirects.test.ts`
Expected: PASS.

- [ ] **Step 6: Clean up the content data.** In `src/data/service-content.ts`:
  - Delete the whole `"payroll-processing": {...},` and `"kpi-dashboards-reporting": {...},` entries.
  - Delete every `serviceAreaCoverage: "...",` line, and remove `serviceAreaCoverage: string;` from the interface.
  - In `interface ServiceContent`, make `whatsIncluded`, `processSection`, `applicationsSection`, `whyChooseSection`, `pricingFactorsSection`, and `faqs` optional (`?:`).

Confirm the mechanical part with these checks:

```bash
grep -c "serviceAreaCoverage" src/data/service-content.ts   # expect 0
grep -cE '^ *slug: "' src/data/service-content.ts             # expect 16
grep -n '"payroll-processing"\|"kpi-dashboards-reporting"' src/data/service-content.ts  # expect nothing
```

The location sentences inside `mainIntroduction` stay until Josh's copy replaces them. That is a copy task, not code.

In `src/utils/service-icons.tsx`, delete the `"payroll-processing"` and `"kpi-dashboards-reporting"` entries.

- [ ] **Step 7: Update the service template.** In `src/app/(public)/services/[slug]/page.tsx`:
  - Add `export const dynamicParams = false;` under `generateStaticParams`.
  - Change `const relatedServices = getRelatedServices(slug, 4);` to `const relatedServices = getRelatedServices(slug);`.
  - Wrap each section in a guard on its own data:
    - `{content.whatsIncluded && (...)}`
    - `{content.processSection && (...)}`
    - `{content.applicationsSection && (...)}`
    - `{content.whyChooseSection && (...)}`
    - `{content.pricingFactorsSection && (...)}`
    - The FAQ guard already exists; change it to `content.faqs && content.faqs.length > 0`.
  - Delete the `{/* Service Area */}` block, which holds the "Service Area Coverage" `<h2>` and `{content.serviceAreaCoverage}`.
  - Replace the fallback branch (`) : ( /* Fallback content ... */ <div>...</div> )`) with:

```tsx
              ) : (
                <p className="text-gray-600 text-lg leading-relaxed mb-8">{service.shortDescription}</p>
              )}
```

- [ ] **Step 8: Fix the remaining references:**
  - `src/components/HomePageClient.tsx`: change `<div className="text-3xl font-bold text-[var(--color-brand-gold)]">18</div>` to `{services.length}`, and change `From bookkeeping and payroll to financial modeling` to `From bookkeeping and month-end close to financial modeling`.
  - `src/components/ContactForm.tsx`: change `services.sort((a, b) => a.name.localeCompare(b.name))` to `[...services].sort((a, b) => a.name.localeCompare(b.name))` (spec issue 2). The dropdown now lists 16 services plus "Other / Not Sure".

- [ ] **Step 9: Verify**

```bash
pnpm test && pnpm lint && pnpm build
(PORTAL_ENABLED= pnpm start -p 3100 &) && sleep 5
curl -sI http://localhost:3100/services/payroll-processing | grep -iE '^(HTTP|location)'
curl -sI http://localhost:3100/services/kpi-dashboards-reporting | grep -iE '^(HTTP|location)'
curl -s http://localhost:3100/services/audit-preparation | grep -c "Service Area Coverage"
curl -s http://localhost:3100/services | grep -c 'href="/services/'
pkill -f "next start -p 3100"
```

Expected:
- 308 with `location: /services/bookkeeping-and-reconciliation` and `/services/fractional-cfo-services`
- the "Service Area Coverage" count is `0`
- the services hub links count is at least 16

- [ ] **Step 10: Commit**

```bash
git add src/data next.config.ts "src/app/(public)/services" src/utils/service-icons.tsx src/components/HomePageClient.tsx src/components/ContactForm.tsx
git commit -m "feat: Fold payroll and KPI services with redirects; data-driven related services"
```

---

### Task 5: Remove 12 city pages; update the hub, nav, footer, and homepage (§3.4; T10, T11, footer map)

**Files:**
- Modify:
  - `src/data/locations.ts`, `src/data/location-content.ts`, `src/data/redirects.ts`, `src/data/redirects.test.ts`
  - `src/app/(public)/service-areas/[slug]/page.tsx`, `src/app/(public)/service-areas/page.tsx`
  - `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/HomePageClient.tsx`
- Delete: `public/images/{irvine-ca,costa-mesa-ca,huntington-beach-ca,laguna-beach-ca,orange-ca,santa-ana-ca,anaheim-ca,fullerton-ca,tustin-ca,mission-viejo-ca,lake-forest-ca,corona-del-mar-ca}/`

**Interfaces:**
- Consumes: `redirects` (Task 4), `siteConfig.serviceAreaCities` (Task 2).
- Produces: `locations` holds only `newport-beach-ca`. `getNearbyLocations` and `getLocationsByPopulation` are removed.

- [ ] **Step 1: Write the failing tests.** Add `import { locations, getLocationBySlug } from "./locations";` to the imports at the top of `src/data/redirects.test.ts`, then append:

```ts

describe("city redirects", () => {
  const removed = [
    "irvine-ca", "costa-mesa-ca", "huntington-beach-ca", "laguna-beach-ca", "orange-ca",
    "santa-ana-ca", "anaheim-ca", "fullerton-ca", "tustin-ca", "mission-viejo-ca", "lake-forest-ca",
  ];

  it("only Newport Beach remains", () => {
    expect(locations.map((l) => l.slug)).toEqual(["newport-beach-ca"]);
  });

  it.each(removed)("%s redirects to the hub", (slug) => {
    const r = redirects.find((x) => x.source === `/service-areas/${slug}`);
    expect(r?.destination).toBe("/service-areas");
  });

  it("Corona del Mar redirects to Newport Beach", () => {
    const r = redirects.find((x) => x.source === "/service-areas/corona-del-mar-ca");
    expect(r?.destination).toBe("/service-areas/newport-beach-ca");
  });

  it("no redirected city still exists", () => {
    redirects
      .filter((r) => r.source.startsWith("/service-areas/"))
      .forEach((r) => expect(getLocationBySlug(r.source.replace("/service-areas/", ""))).toBeUndefined());
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `pnpm vitest run src/data/redirects.test.ts`
Expected: FAIL. There are 13 locations and no city redirects.

- [ ] **Step 3: Implement the data changes.** In `src/data/locations.ts`:
  - Delete the 12 non-Newport objects.
  - Delete `getNearbyLocations` and `getLocationsByPopulation`.
  - Reduce `locationImageExtensions` to `{ "newport-beach-ca": "webp" }`.

In `src/data/location-content.ts`, delete every entry except `"newport-beach-ca"`. This one-off script does it safely by keeping only the first top-level entry:

```bash
python3 - <<'EOF'
import re
p = "src/data/location-content.ts"
s = open(p).read()
start = s.index('  "irvine-ca": {')
end = s.index("\n};\n", start)
s = s[:start].rstrip() + "\n" + s[end+1:]
open(p, "w").write(s)
EOF
grep -n '^  "[a-z-]*": {' src/data/location-content.ts   # expect only newport-beach-ca
```

In `src/data/redirects.ts`, append to the array:

```ts
  ...[
    "irvine-ca", "costa-mesa-ca", "huntington-beach-ca", "laguna-beach-ca", "orange-ca",
    "santa-ana-ca", "anaheim-ca", "fullerton-ca", "tustin-ca", "mission-viejo-ca", "lake-forest-ca",
  ].map((slug): Redirect => ({ source: `/service-areas/${slug}`, destination: "/service-areas", permanent: true })),
  { source: "/service-areas/corona-del-mar-ca", destination: "/service-areas/newport-beach-ca", permanent: true },
```

Delete the image folders:

```bash
git rm -r -q public/images/{irvine-ca,costa-mesa-ca,huntington-beach-ca,laguna-beach-ca,orange-ca,santa-ana-ca,anaheim-ca,fullerton-ca,tustin-ca,mission-viejo-ca,lake-forest-ca,corona-del-mar-ca}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `pnpm vitest run src/data/redirects.test.ts`
Expected: PASS.

- [ ] **Step 5: Update the location page.** In `service-areas/[slug]/page.tsx`:
  - Import only `locations, getLocationBySlug, getLocationImagePath`.
  - Add `export const dynamicParams = false;`.
  - Delete `const nearbyLocations = getNearbyLocations(slug, 5);` and the whole `{/* Nearby Locations */} {nearbyLocations.length > 0 && (...)}` block in the sidebar.

- [ ] **Step 6: Update the hub.** In `service-areas/page.tsx`:
  - Change the imports to `getPrimaryLocation, getLocationImagePath` (drop `locations` and `getLocationsByPopulation`).
  - Delete `const sortedLocations = ...`.
  - Replace the inner content of the `{/* Location Grid */}` section, from the `text-center max-w-3xl` header div through the closing grid div, with:

```tsx
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-4">
              Our Locations
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Communities We Serve
            </h2>
            <p className="text-xl text-gray-600">
              Based in {primaryLocation.name}, we work with businesses throughout Orange County, including:
            </p>
          </div>

          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 max-w-4xl mx-auto mb-12 text-lg text-gray-700">
            {siteConfig.serviceAreaCities.map((city) => (
              <li key={city}>{city}, {siteConfig.stateAbbr}</li>
            ))}
          </ul>

          <div className="max-w-xl mx-auto">
            <Link
              href={`/service-areas/${primaryLocation.slug}`}
              className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={getLocationImagePath(primaryLocation)}
                  alt={`${primaryLocation.name}, ${primaryLocation.stateAbbr}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 576px"
                />
              </div>
              <div className="p-6 lg:p-8">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors mb-3">
                  Fractional CFO Services in {primaryLocation.name}
                </h3>
                <p className="text-gray-600 text-sm">{primaryLocation.shortDescription}</p>
              </div>
            </Link>
          </div>
```

- [ ] **Step 7: Update the Header.** In `Header.tsx`:
  - Replace `import { locations } from "@/data/locations";` with `import { getPrimaryLocation } from "@/data/locations";`.
  - Replace `const topLocations = locations.slice(0, 8);` with `const primaryLocation = getPrimaryLocation();`.
  - In the desktop dropdown, replace the `{topLocations.map(...)}` block with:

```tsx
                    <Link
                      href={`/service-areas/${primaryLocation.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[var(--color-brand-blue)] transition-colors"
                      onClick={() => setLocationsOpen(false)}
                    >
                      {primaryLocation.name}, {primaryLocation.stateAbbr}
                    </Link>
```

  - Change the label `View All {locations.length} Service Areas` to `View All Service Areas`.
  - In the mobile menu, replace `{topLocations.slice(0, 5).map(...)}` with:

```tsx
                  <Link
                    href={`/service-areas/${primaryLocation.slug}`}
                    className="text-gray-600 hover:text-[var(--color-brand-blue)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {primaryLocation.name}
                  </Link>
```

- [ ] **Step 8: Update the Footer.** In `Footer.tsx`:
  - Delete `import { getLocationsByPopulation } ...` and `const allLocations = ...`.
  - Delete the whole `{/* All Locations and Map */}` grid, which holds the city list **and** the Google Maps iframe (T15). The Company Links row already links `/service-areas`.

- [ ] **Step 9: Update the homepage.** In `HomePageClient.tsx`:
  - Delete `useState` from the React import (and the import line if it becomes empty).
  - Delete `showMoreLocations`, `initialLocationSlugs`, `initialLocations`, and `remainingLocations`.
  - Change the locations import to `getLocationImagePath, getPrimaryLocation`, and add `const primaryLocation = getPrimaryLocation();` in the component.
  - In the `{/* Service Areas */}` section, keep the header block and replace everything after it (the two grids and the toggle button) with:

```tsx
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 max-w-4xl mx-auto mb-10 text-gray-700">
            {siteConfig.serviceAreaCities.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
            <Link
              href={`/service-areas/${primaryLocation.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={getLocationImagePath(primaryLocation)}
                  alt={`${primaryLocation.name}, ${primaryLocation.stateAbbr}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors mb-2">
                  {primaryLocation.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">{primaryLocation.shortDescription}</p>
              </div>
            </Link>
            <Link
              href="/service-areas"
              className="group bg-slate-50 rounded-2xl border border-gray-100 p-8 flex flex-col justify-center hover:border-[var(--color-brand-blue)]/30 transition-all"
            >
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors mb-2">
                All Service Areas
              </h3>
              <p className="text-gray-600 text-sm">See every community we serve across Orange County.</p>
            </Link>
          </div>
```

- [ ] **Step 10: Verify**

```bash
pnpm test && pnpm lint && pnpm build
(PORTAL_ENABLED= pnpm start -p 3100 &) && sleep 5
for c in irvine-ca corona-del-mar-ca lake-forest-ca; do curl -sI http://localhost:3100/service-areas/$c | grep -iE '^(HTTP|location)'; done
curl -sI "http://localhost:3100/service-areas/irvine-ca?utm_source=x" | grep -i '^location'
for p in / /service-areas /service-areas/newport-beach-ca /services /contact; do
  curl -s http://localhost:3100$p | grep -oE 'href="/service-areas/[a-z-]+"' | sort -u
done
curl -s http://localhost:3100/ | grep -c "google.com/maps"
pkill -f "next start -p 3100"
```

Expected:
- 308s to the right destinations, with the query string preserved
- the only `/service-areas/...` link on any page is `newport-beach-ca`
- the maps count on `/` is `0`

- [ ] **Step 11: Commit**

```bash
git add -A src/data "src/app/(public)/service-areas" src/components public/images
git commit -m "feat: Keep only Newport Beach city page; redirect 12 city pages; drop footer map"
```

---

### Task 6: Structured data (§3.3; T9)

**Files:**
- Create: `src/lib/structured-data.ts`, `src/lib/structured-data.test.ts`
- Rewrite: `src/components/JsonLd.tsx`
- Modify:
  - `src/app/(public)/layout.tsx`
  - `src/app/(public)/about/page.tsx`, `contact/page.tsx`, `services/page.tsx`, `service-areas/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`
  - `services/[slug]/page.tsx`, `service-areas/[slug]/page.tsx`

**Interfaces:**
- Consumes: `siteConfig` (Task 2), `DEFAULT_OG_IMAGE` (Task 2), `Service` (Task 4).
- Produces:
  - `BUSINESS_ID`, `FOUNDER_ID`, `absoluteUrl(path: string): string`
  - `businessSchema(): JsonLdObject`, `personSchema(): JsonLdObject`
  - `serviceSchema(input: { name: string; description: string; path: string }): JsonLdObject`
  - `faqSchema(faqs: { question: string; answer: string }[]): JsonLdObject`
  - `breadcrumbSchema(items: { name: string; path: string }[]): JsonLdObject`
  - `articleSchema(input: { headline: string; description: string; path: string; image?: string; datePublished: string; dateModified?: string }): JsonLdObject`
  - `serializeJsonLd(data: unknown): string`
  - `type JsonLdObject = Record<string, unknown>`
  - `<JsonLd data={JsonLdObject | JsonLdObject[]} />`

- [ ] **Step 1: Write the failing tests.** `src/lib/structured-data.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  businessSchema, personSchema, serviceSchema, faqSchema, breadcrumbSchema,
  articleSchema, serializeJsonLd, BUSINESS_ID, FOUNDER_ID, absoluteUrl,
} from "./structured-data";

const ORIGIN = "https://bluecrest-group.com";

describe("businessSchema", () => {
  const s = businessSchema();

  it("is one ProfessionalService entity on the non-www origin", () => {
    expect(s["@type"]).toBe("ProfessionalService");
    expect(s["@id"]).toBe(BUSINESS_ID);
    expect(s.url).toBe(ORIGIN);
    expect(s.logo).toBe(`${ORIGIN}/images/bluecrest-group-logo.png`);
  });

  it("has no street address or geo coordinates", () => {
    const json = JSON.stringify(s);
    expect(json).not.toContain("streetAddress");
    expect(json).not.toContain("GeoCoordinates");
    expect(json).not.toContain("GeoCircle");
    expect(s.address).toEqual({ "@type": "PostalAddress", addressLocality: "Newport Beach", addressRegion: "CA", addressCountry: "US" });
  });

  it("lists Orange County and every service-area city", () => {
    const areas = s.areaServed as { "@type": string; name: string }[];
    expect(areas[0]).toEqual({ "@type": "AdministrativeArea", name: "Orange County, CA" });
    expect(areas.some((a) => a.name === "Newport Beach, CA" && a["@type"] === "City")).toBe(true);
  });

  it("omits telephone and sameAs while they are empty", () => {
    expect(s).not.toHaveProperty("telephone");
    expect(s).not.toHaveProperty("sameAs");
  });

  it("links the founder by @id", () => {
    expect(s.founder).toEqual({ "@id": FOUNDER_ID });
  });
});

describe("page schemas", () => {
  it("person works for the business", () => {
    const p = personSchema();
    expect(p["@id"]).toBe(FOUNDER_ID);
    expect(p.worksFor).toEqual({ "@id": BUSINESS_ID });
  });

  it("service references the provider by @id with an absolute url", () => {
    const s = serviceSchema({ name: "Audit Preparation", description: "d", path: "/services/audit-preparation" });
    expect(s.provider).toEqual({ "@id": BUSINESS_ID });
    expect(s.url).toBe(`${ORIGIN}/services/audit-preparation`);
  });

  it("FAQPage mirrors the given FAQ text exactly", () => {
    const faqs = [{ question: "Q1?", answer: "A1." }, { question: "Q2?", answer: "A2." }];
    const f = faqSchema(faqs) as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(f.mainEntity.map((q) => [q.name, q.acceptedAnswer.text])).toEqual([["Q1?", "A1."], ["Q2?", "A2."]]);
  });

  it("breadcrumbs are positioned and absolute", () => {
    const b = breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]) as {
      itemListElement: { position: number; item: string }[];
    };
    expect(b.itemListElement).toEqual([
      expect.objectContaining({ position: 1, item: `${ORIGIN}/` }),
      expect.objectContaining({ position: 2, item: `${ORIGIN}/services` }),
    ]);
  });

  it("article has author, publisher, and dates", () => {
    const a = articleSchema({ headline: "H", description: "D", path: "/insights/h", datePublished: "2026-10-01" });
    expect(a.author).toEqual({ "@id": FOUNDER_ID });
    expect(a.publisher).toEqual({ "@id": BUSINESS_ID });
    expect(a.dateModified).toBe("2026-10-01");
    expect(a.mainEntityOfPage).toBe(`${ORIGIN}/insights/h`);
  });

  it("absoluteUrl leaves absolute urls alone", () => {
    expect(absoluteUrl("https://cdn.sanity.io/a.jpg")).toBe("https://cdn.sanity.io/a.jpg");
  });
});

describe("serializeJsonLd", () => {
  it("cannot close the script tag", () => {
    const out = serializeJsonLd({ text: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).text).toBe("</script><script>alert(1)</script>");
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `pnpm vitest run src/lib/structured-data.test.ts`
Expected: FAIL (the module is missing).

- [ ] **Step 3: Implement `src/lib/structured-data.ts`**

```ts
import { siteConfig } from "@/data/site-config";
import { DEFAULT_OG_IMAGE } from "@/lib/metadata";

export type JsonLdObject = Record<string, unknown>;

export const BUSINESS_ID = `${siteConfig.url}/#business`;
export const FOUNDER_ID = `${siteConfig.url}/about#josh-miller`;

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

const CONTEXT = "https://schema.org";

export function businessSchema(): JsonLdObject {
  const schema: JsonLdObject = {
    "@context": CONTEXT,
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: siteConfig.businessName,
    description: `${siteConfig.businessName} provides fractional CFO, accounting, and business advisory services to growing businesses in ${siteConfig.region}.`,
    url: siteConfig.url,
    logo: absoluteUrl("/images/bluecrest-group-logo.png"),
    image: absoluteUrl(DEFAULT_OG_IMAGE.url),
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.stateAbbr,
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: `${siteConfig.region}, ${siteConfig.stateAbbr}` },
      ...siteConfig.serviceAreaCities.map((city) => ({ "@type": "City", name: `${city}, ${siteConfig.stateAbbr}` })),
    ],
    founder: { "@id": FOUNDER_ID },
    // Matches the hours shown on the Contact page.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  };
  if (siteConfig.phone) schema.telephone = siteConfig.phone;
  if (siteConfig.googleBusinessProfileUrl) schema.sameAs = [siteConfig.googleBusinessProfileUrl];
  return schema;
}

export function personSchema(): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: siteConfig.founder.name,
    jobTitle: siteConfig.founder.title,
    image: absoluteUrl(siteConfig.founder.image),
    worksFor: { "@id": BUSINESS_ID },
  };
}

export function serviceSchema(input: { name: string; description: string; path: string }): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": BUSINESS_ID },
    areaServed: { "@type": "AdministrativeArea", name: `${siteConfig.region}, ${siteConfig.stateAbbr}` },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  path: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
}): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    image: input.image ? absoluteUrl(input.image) : absoluteUrl(DEFAULT_OG_IMAGE.url),
    author: { "@id": FOUNDER_ID },
    publisher: { "@id": BUSINESS_ID },
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    mainEntityOfPage: absoluteUrl(input.path),
  };
}

/** JSON for a <script> tag: escapes "<" so content can never close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
```

`absoluteUrl` uses `new URL(path, base)`, which leaves absolute URLs unchanged.

Rewrite `src/components/JsonLd.tsx`:

```tsx
import { serializeJsonLd, type JsonLdObject } from "@/lib/structured-data";

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
        />
      ))}
    </>
  );
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `pnpm vitest run src/lib/structured-data.test.ts`
Expected: PASS.

- [ ] **Step 5: Wire the schemas into pages.** In `(public)/layout.tsx`:
  - Delete the `<head>...</head>` block and the old `OrganizationSchema`/`LocalBusinessSchema` import.
  - Import `{ JsonLd }` and `{ businessSchema }`.
  - Render `<JsonLd data={businessSchema()} />` as the first child of the fragment.

Add `<JsonLd data={[...]} />` as the first child of each page's returned fragment:

| Page | `data` |
|---|---|
| `about/page.tsx` | `[personSchema(), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])]` |
| `contact/page.tsx` | `breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])` |
| `services/page.tsx` | `breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])` |
| `service-areas/page.tsx` | `breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Service Areas", path: "/service-areas" }])` |
| `privacy/page.tsx` | `breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }])` |
| `terms/page.tsx` | `breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }])` |

In `services/[slug]/page.tsx`, after `const relatedServices = ...`:

```tsx
  const path = `/services/${service.slug}`;
  const schemas = [
    serviceSchema({ name: service.name, description: serviceMetaDescription(service), path }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.name, path }]),
    ...(content?.faqs && content.faqs.length > 0 ? [faqSchema(content.faqs)] : []),
  ];
```

Then render `<JsonLd data={schemas} />` first in the fragment. In `service-areas/[slug]/page.tsx`, do the same with `breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Service Areas", path: "/service-areas" }, { name: location.name, path: \`/service-areas/${location.slug}\` }])`, plus `faqSchema(content.faqs)` when `content?.faqs?.length`.

The FAQ schema must take the same array that `<FAQSection faqs={content.faqs} />` renders, so the two match exactly.

- [ ] **Step 6: Verify**

```bash
pnpm test && pnpm lint && pnpm build
(PORTAL_ENABLED= pnpm start -p 3100 &) && sleep 5
for p in / /about /services/fractional-cfo-services /service-areas/newport-beach-ca; do
  echo "== $p"; curl -s http://localhost:3100$p | grep -o '"@type":"[A-Za-z]*"' | sort | uniq -c | head -12
done
curl -s http://localhost:3100/ | grep -c "streetAddress\|www.bluecrest"
pkill -f "next start -p 3100"
```

Expected:
- `/` has one `ProfessionalService` and no `AccountingService`
- the service page has `Service`, `BreadcrumbList`, and `FAQPage`
- About has `Person`
- the final count is `0`

- [ ] **Step 7: Commit**

```bash
git add src/lib/structured-data.ts src/lib/structured-data.test.ts src/components/JsonLd.tsx "src/app/(public)"
git commit -m "feat: Single business entity plus Person, Service, FAQ, and Breadcrumb JSON-LD"
```

---

### Task 7: Sanity refresh interval, Insights switch, article page (§3.6; T4, T14)

**Files:**
- Modify:
  - `src/lib/sanity.client.ts`, `src/lib/sanity.ts`
  - `src/app/(public)/page.tsx`, `insights/page.tsx`, `insights/[slug]/page.tsx`
  - `src/components/Header.tsx`, `src/components/Footer.tsx`
  - `sanity/schemaTypes/article.ts`
- Create: `src/lib/sanity.cache.ts`, `src/lib/sanity.client.test.ts`, `src/lib/insights.ts`, `src/lib/insights.test.ts`, `sanity/schemaTypes/service-options.ts`

**Interfaces:**
- Consumes: `buildMetadata`, `PageMetadataInput`, `pageMeta.insights` (Task 2); `articleSchema`, `breadcrumbSchema`, `JsonLd` (Task 6); `getServiceBySlug` (Task 4).
- Produces:
  - `SANITY_CACHE_TAG = "sanity"` and `SANITY_REVALIDATE_SECONDS = 300`, from `src/lib/sanity.cache.ts`. That module has no imports, so it is safe to load in tests: `createClient` throws on an empty `projectId`.
  - `fetchSanity<T>(query: string, params?: Record<string, unknown>): Promise<T>`
  - `articleSitemapQuery`, returning `{ slug: string; publishedAt: string; updatedAt?: string }[]`
  - `interface ArticleForMeta { title: string; slug: string; excerpt?: string; seoDescription?: string; publishedAt: string; updatedAt?: string; ogImageUrl?: string }`
  - `articleMetadataInput(a: ArticleForMeta, insightsEnabled?: boolean): PageMetadataInput`
  - `shouldIndexInsights(articleCount: number, insightsEnabled?: boolean): boolean`
  - `relatedServiceOptions: { title: string; value: string }[]`

- [ ] **Step 1: Write the failing tests.** `src/lib/sanity.client.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const fetchMock = vi.hoisted(() => vi.fn().mockResolvedValue([]));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch: fetchMock }) }));

import { fetchSanity, SANITY_CACHE_TAG, SANITY_REVALIDATE_SECONDS } from "./sanity.client";

describe("fetchSanity", () => {
  it("fetches with the 5-minute revalidate and the sanity tag", async () => {
    await fetchSanity("*[_type == 'article']", { a: 1 });
    expect(fetchMock).toHaveBeenCalledWith("*[_type == 'article']", { a: 1 }, {
      next: { revalidate: SANITY_REVALIDATE_SECONDS, tags: [SANITY_CACHE_TAG] },
    });
    expect(SANITY_REVALIDATE_SECONDS).toBe(300);
  });
});

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe("no permanent caching of Sanity data", () => {
  it("no source file under src uses force-cache", () => {
    const offenders = walk("src")
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith(".test.ts"))
      .filter((f) => readFileSync(f, "utf8").includes("force-cache"));
    expect(offenders).toEqual([]);
  });
});
```

`src/lib/insights.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { articleMetadataInput, shouldIndexInsights } from "./insights";
import { relatedServiceOptions } from "../../sanity/schemaTypes/service-options";
import { services } from "@/data/services";

const base = { title: "Cash Flow Basics", slug: "cash-flow-basics", publishedAt: "2026-10-01T00:00:00Z" };

describe("articleMetadataInput", () => {
  it("prefers seoDescription, then excerpt, then a default", () => {
    expect(articleMetadataInput({ ...base, seoDescription: "S", excerpt: "E" }, true).description).toBe("S");
    expect(articleMetadataInput({ ...base, excerpt: "E" }, true).description).toBe("E");
    expect(articleMetadataInput(base, true).description.length).toBeGreaterThan(20);
  });

  it("uses the article path and type", () => {
    const m = articleMetadataInput(base, true);
    expect(m.path).toBe("/insights/cash-flow-basics");
    expect(m.type).toBe("article");
  });

  it("falls back to the site image when there is no og image", () => {
    expect(articleMetadataInput(base, true).image).toBeUndefined();
    expect(articleMetadataInput({ ...base, ogImageUrl: "https://cdn.sanity.io/x.jpg" }, true).image?.url).toBe("https://cdn.sanity.io/x.jpg");
  });

  it("noindexes articles while Insights is switched off", () => {
    expect(articleMetadataInput(base, false).noindex).toBe(true);
    expect(articleMetadataInput(base, true).noindex).toBe(false);
  });
});

describe("shouldIndexInsights", () => {
  it("needs the switch on and at least one article", () => {
    expect(shouldIndexInsights(3, false)).toBe(false);
    expect(shouldIndexInsights(0, true)).toBe(false);
    expect(shouldIndexInsights(1, true)).toBe(true);
  });
});

describe("Studio related-service options", () => {
  it("match the live service catalogue", () => {
    expect(relatedServiceOptions.map((o) => o.value).sort()).toEqual(services.map((s) => s.slug).sort());
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `pnpm vitest run src/lib/sanity.client.test.ts src/lib/insights.test.ts`
Expected: FAIL. The exports are missing, and `force-cache` is found in `sanity.client.ts` and `(public)/page.tsx`.

- [ ] **Step 3: Implement the fetch helper.** `src/lib/sanity.cache.ts`:

```ts
/** Tag on every Sanity fetch; the publish webhook revalidates it (spec §3.6). */
export const SANITY_CACHE_TAG = "sanity";
/** Fallback refresh interval if a webhook is missed. Route segments repeat this as a literal `300`. */
export const SANITY_REVALIDATE_SECONDS = 300;
```

`src/lib/sanity.client.ts`:

```ts
import { createClient } from "@sanity/client";
import { SANITY_CACHE_TAG, SANITY_REVALIDATE_SECONDS } from "./sanity.cache";

export { SANITY_CACHE_TAG, SANITY_REVALIDATE_SECONDS };

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
  perspective: "published",
});

export async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: { revalidate: SANITY_REVALIDATE_SECONDS, tags: [SANITY_CACHE_TAG] },
  });
}
```

In `src/lib/sanity.ts`:
  - Replace `export { sanityClient as client };` with `export { fetchSanity } from "./sanity.client";`, so no caller can bypass the cache settings. Keep `sanityClient` as an import for the image builder.
  - Add `seoDescription, updatedAt, relatedService, ogImage,` to `articleBySlugQuery`'s projection, after `excerpt,`.
  - Replace `articleSlugsQuery` with:

```ts
export const articleSlugsQuery = `*[_type == "article" && defined(slug.current)]{
  "slug": slug.current
}`;

export const articleSitemapQuery = `*[_type == "article" && defined(slug.current)]{
  "slug": slug.current,
  publishedAt,
  updatedAt
}`;
```

- [ ] **Step 4: Implement `src/lib/insights.ts`**

```ts
import { siteConfig } from "@/data/site-config";
import type { PageMetadataInput } from "@/lib/metadata";

export interface ArticleForMeta {
  title: string;
  slug: string;
  excerpt?: string;
  seoDescription?: string;
  publishedAt: string;
  updatedAt?: string;
  ogImageUrl?: string;
}

const DEFAULT_ARTICLE_DESCRIPTION =
  "Financial strategy and fractional CFO insights from BlueCrest Group in Newport Beach, CA.";

export function articleMetadataInput(
  article: ArticleForMeta,
  insightsEnabled: boolean = siteConfig.insightsEnabled
): PageMetadataInput {
  return {
    title: article.title,
    description: article.seoDescription || article.excerpt || DEFAULT_ARTICLE_DESCRIPTION,
    path: `/insights/${article.slug}`,
    image: article.ogImageUrl
      ? { url: article.ogImageUrl, width: 1200, height: 630, alt: article.title }
      : undefined,
    type: "article",
    noindex: !insightsEnabled,
  };
}

/** T4: /insights is indexable only when switched on and it has content. */
export function shouldIndexInsights(
  articleCount: number,
  insightsEnabled: boolean = siteConfig.insightsEnabled
): boolean {
  return insightsEnabled && articleCount > 0;
}
```

`sanity/schemaTypes/service-options.ts` has no imports, so both the Studio and the site tests can load it:

```ts
// Keep in sync with src/data/services.ts (a test in src/lib/insights.test.ts enforces this).
export const relatedServiceOptions = [
  { title: "Fractional Controller Services", value: "fractional-controller-services" },
  { title: "Bookkeeping and Reconciliation", value: "bookkeeping-and-reconciliation" },
  { title: "Month End Close and Financial Statements", value: "month-end-close-financial-statements" },
  { title: "Accounts Payable and Receivable", value: "accounts-payable-receivable" },
  { title: "Accounting System Setup and Migration", value: "accounting-system-setup" },
  { title: "Fractional CFO Services", value: "fractional-cfo-services" },
  { title: "Budgeting and Forecasting", value: "budgeting-and-forecasting" },
  { title: "Financial Modeling and Analysis", value: "financial-modeling" },
  { title: "Fundraising Support", value: "fundraising-support" },
  { title: "Mergers and Acquisitions Advisory", value: "mergers-acquisitions-advisory" },
  { title: "Tax Strategy and Planning", value: "tax-strategy-planning" },
  { title: "Sales Tax Compliance", value: "sales-tax-compliance" },
  { title: "Audit Preparation and Coordination", value: "audit-preparation" },
  { title: "Startup and Small Business Services", value: "startup-business-services" },
  { title: "Operational Efficiency Consulting", value: "operational-efficiency-consulting" },
  { title: "Scaling and Growth Support", value: "scaling-growth-support" },
];
```

- [ ] **Step 5: Run the tests.** Run `pnpm vitest run src/lib/insights.test.ts`. Expected: PASS. The `force-cache` guard still fails until Step 6.

- [ ] **Step 6: Wire the pages**

**`(public)/page.tsx`:**
- Add `export const revalidate = 300; // keep equal to SANITY_REVALIDATE_SECONDS`.
- Import `fetchSanity` and `featuredArticlesQuery` from `@/lib/sanity`, and `siteConfig`.
- In `getFeaturedArticles`:
  - start with `if (!siteConfig.insightsEnabled) return [];`
  - replace the `client.fetch(..., { cache: "force-cache" })` call with `await fetchSanity<Article[]>(featuredArticlesQuery)`.

**`insights/page.tsx`:**
- Add `export const revalidate = 300;`.
- Replace the static `metadata` with:

```ts
export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticles();
  return buildMetadata({ ...pageMeta.insights, noindex: !shouldIndexInsights(articles.length) });
}
```

- Change `getArticles` to use `fetchSanity<Article[]>(articlesQuery)`.
- Change the outer `<main className="min-h-screen bg-white">` / `</main>` to `<div ...>` / `</div>`, because the layout already renders `<main>`.

**`insights/[slug]/page.tsx`:**
- Add `export const revalidate = 300;`.
- Import:
  - `fetchSanity` from `@/lib/sanity` (replacing `client`)
  - `buildMetadata` from `@/lib/metadata`
  - `pageMeta` from `@/data/page-meta`
  - `articleMetadataInput` from `@/lib/insights`
  - `getServiceBySlug` from `@/data/services`
  - `{ JsonLd }` from `@/components/JsonLd`
  - `articleSchema, breadcrumbSchema` from `@/lib/structured-data`
  - and in `insights/page.tsx`: `buildMetadata`, `pageMeta`, `shouldIndexInsights`, `fetchSanity`
- Add `seoDescription?: string; updatedAt?: string; relatedService?: string; ogImage?: { [key: string]: unknown };` to `interface Article`.
- Change both fetches to `fetchSanity` (`articleBySlugQuery` with `{ slug }`, and `articleSlugsQuery`).
- Replace `generateMetadata`'s body after fetching:

```ts
  if (!article) {
    return { title: pageMeta.notFound.title };
  }
  const ogSource = article.ogImage ?? article.mainImage;
  return buildMetadata(articleMetadataInput({
    title: article.title,
    slug: article.slug.current,
    excerpt: article.excerpt,
    seoDescription: article.seoDescription,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    ogImageUrl: ogSource ? urlFor(ogSource).width(1200).height(630).url() : undefined,
  }));
```

- In the page component, after `publishedDate`, add:

```tsx
  const updatedDate = article.updatedAt
    ? new Date(article.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : undefined;
  const relatedService = article.relatedService ? getServiceBySlug(article.relatedService) : undefined;
  const path = `/insights/${article.slug.current}`;
  const description = article.seoDescription || article.excerpt || article.title;
```

- Render `<JsonLd data={[articleSchema({ headline: article.title, description, path, image: heroImageUrl, datePublished: article.publishedAt, dateModified: article.updatedAt }), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }, { name: article.title, path }])]} />` as the first child.
- Change the outer `<main>` to `<div>`.
- After the `<time>` element, add:

```tsx
              {updatedDate && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-xs uppercase tracking-wide text-gray-500">Updated {updatedDate}</span>
                </>
              )}
```

- Right after the article body `<div className="prose ...">` block, add:

```tsx
          {relatedService && (
            <p className="mt-12 pt-8 border-t border-gray-100 text-lg">
              Related service:{" "}
              <Link href={`/services/${relatedService.slug}`} className="text-[var(--color-brand-blue)] font-semibold hover:underline">
                {relatedService.name}
              </Link>
            </p>
          )}
```

**Header and Footer:** wrap every `/insights` link in `{siteConfig.insightsEnabled && (...)}`. That is desktop and mobile in `Header.tsx`, and the Company Links row in `Footer.tsx`.

- [ ] **Step 7: Update the Sanity schema.** Code only; deploying is blocked on D7. In `sanity/schemaTypes/article.ts`:
  - add `import { relatedServiceOptions } from "./service-options";`
  - add `validation: (Rule) => Rule.required(),` to the `author` field
  - after the `excerpt` field, add:

```ts
    defineField({
      name: "seoDescription",
      title: "Search description",
      type: "text",
      rows: 3,
      description: "Shown in Google results and link previews. Aim for 140–155 characters.",
      validation: (Rule) => [
        Rule.required().max(160),
        Rule.min(120).warning("Aim for 140–155 characters."),
      ],
    }),
    defineField({
      name: "relatedService",
      title: "Related service",
      type: "string",
      description: "The article links to this service page.",
      options: { list: relatedServiceOptions },
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description: "Optional, 1200×630. Falls back to the main image.",
      options: { hotspot: true },
    }),
```

  - after `publishedAt`, add:

```ts
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      description: "Set when the article is meaningfully revised.",
    }),
```

- [ ] **Step 8: Verify**

```bash
pnpm test && pnpm lint && pnpm build
(PORTAL_ENABLED= pnpm start -p 3100 &) && sleep 5
curl -s http://localhost:3100/insights | grep -oE '<title>[^<]*</title>|<meta name="robots" content="[^"]*"'
for p in / /about /contact; do curl -s http://localhost:3100$p | grep -c 'href="/insights"'; done
pkill -f "next start -p 3100"
```

Expected:
- the title is `Insights | BlueCrest Group`
- the robots tag is `noindex, follow`
- each insights-link count is `0`

- [ ] **Step 9: Commit**

```bash
git add src/lib "src/app/(public)" src/components/Header.tsx src/components/Footer.tsx sanity/schemaTypes
git commit -m "feat: Refresh Sanity content every 5 minutes; Insights switch, article metadata and schema fields"
```

---

### Task 8: Sanity webhook with fan-out to every pod (§3.6, D2)

**Files:**
- Create: `src/lib/revalidate.ts`, `src/lib/revalidate.test.ts`, `src/app/(public)/api/revalidate/route.ts`, `src/app/(public)/api/revalidate/route.test.ts`
- Modify: `.env.local.example`

**Interfaces:**
- Consumes: `SANITY_CACHE_TAG` from `@/lib/sanity.cache` (Task 7).
- Produces:
  - `FANOUT_HEADER = "x-revalidate-fanout"`
  - `fanOutRevalidate(host: string, secret: string, deps?: FanOutDeps): Promise<{ ip: string; ok: boolean }[]>`
  - `interface FanOutDeps { resolve: (host: string) => Promise<string[]>; fetchImpl: typeof fetch; port: string }`
  - `POST /api/revalidate`

- [ ] **Step 1: Write the failing tests.** `src/lib/revalidate.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { fanOutRevalidate, FANOUT_HEADER } from "./revalidate";

describe("fanOutRevalidate", () => {
  it("POSTs to every resolved pod with the shared secret", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const result = await fanOutRevalidate("peers.local", "s3cret", {
      resolve: async () => ["10.0.0.1", "10.0.0.2"],
      fetchImpl,
      port: "3000",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl).toHaveBeenCalledWith("http://10.0.0.1:3000/api/revalidate", expect.objectContaining({
      method: "POST",
      headers: { [FANOUT_HEADER]: "s3cret" },
    }));
    expect(result).toEqual([{ ip: "10.0.0.1", ok: true }, { ip: "10.0.0.2", ok: true }]);
  });

  it("reports a dead or failing peer without throwing", async () => {
    const fetchImpl = vi.fn()
      .mockRejectedValueOnce(new Error("ECONNREFUSED"))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));
    const result = await fanOutRevalidate("peers.local", "s", {
      resolve: async () => ["10.0.0.1", "10.0.0.2"],
      fetchImpl,
      port: "3000",
    });
    expect(result).toEqual([{ ip: "10.0.0.1", ok: false }, { ip: "10.0.0.2", ok: false }]);
  });

  it("returns empty when DNS resolution fails", async () => {
    const result = await fanOutRevalidate("peers.local", "s", {
      resolve: async () => { throw new Error("ENOTFOUND"); },
      fetchImpl: vi.fn(),
      port: "3000",
    });
    expect(result).toEqual([]);
  });
});
```

`src/app/(public)/api/revalidate/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const revalidateTag = vi.hoisted(() => vi.fn());
const parseBody = vi.hoisted(() => vi.fn());
const fanOut = vi.hoisted(() => vi.fn());

vi.mock("next/cache", () => ({ revalidateTag }));
vi.mock("next-sanity/webhook", () => ({ parseBody }));
vi.mock("@/lib/revalidate", async (orig) => ({
  ...(await orig<typeof import("@/lib/revalidate")>()),
  fanOutRevalidate: fanOut,
}));

import { POST } from "./route";

function req(headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/revalidate", { method: "POST", headers, body: "{}" }) as never;
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.SANITY_REVALIDATE_SECRET = "s3cret";
  process.env.REVALIDATE_PEERS_HOST = "peers.local";
  fanOut.mockResolvedValue([{ ip: "10.0.0.2", ok: false }]);
});

describe("POST /api/revalidate", () => {
  it("rejects an invalid signature without revalidating", async () => {
    parseBody.mockResolvedValue({ isValidSignature: false, body: null });
    const res = await POST(req());
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(fanOut).not.toHaveBeenCalled();
  });

  it("rejects a missing signature (null) the same way", async () => {
    parseBody.mockResolvedValue({ isValidSignature: null, body: null });
    expect((await POST(req())).status).toBe(401);
  });

  it("revalidates and fans out on a valid signature, even if a peer fails", async () => {
    parseBody.mockResolvedValue({ isValidSignature: true, body: { _type: "article" } });
    const res = await POST(req());
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("sanity");
    expect(fanOut).toHaveBeenCalledWith("peers.local", "s3cret");
  });

  it("skips fan-out when no peers host is configured", async () => {
    delete process.env.REVALIDATE_PEERS_HOST;
    parseBody.mockResolvedValue({ isValidSignature: true, body: {} });
    expect((await POST(req())).status).toBe(200);
    expect(fanOut).not.toHaveBeenCalled();
  });

  it("accepts a fan-out call with the right secret and does not fan out again", async () => {
    const res = await POST(req({ "x-revalidate-fanout": "s3cret" }));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("sanity");
    expect(parseBody).not.toHaveBeenCalled();
    expect(fanOut).not.toHaveBeenCalled();
  });

  it("rejects a fan-out call with the wrong secret", async () => {
    const res = await POST(req({ "x-revalidate-fanout": "nope" }));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("fails closed when the secret is not configured", async () => {
    delete process.env.SANITY_REVALIDATE_SECRET;
    const res = await POST(req({ "x-revalidate-fanout": "" }));
    expect(res.status).toBe(500);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `pnpm vitest run src/lib/revalidate.test.ts "src/app/(public)/api/revalidate/route.test.ts"`
Expected: FAIL (the modules are missing).

- [ ] **Step 3: Implement `src/lib/revalidate.ts`**

```ts
import { lookup } from "node:dns/promises";

/** Header carrying the shared secret on pod-to-pod revalidation calls. */
export const FANOUT_HEADER = "x-revalidate-fanout";

export interface FanOutDeps {
  resolve: (host: string) => Promise<string[]>;
  fetchImpl: typeof fetch;
  port: string;
}

async function resolveAll(host: string): Promise<string[]> {
  const records = await lookup(host, { all: true, family: 4 });
  return records.map((r) => r.address);
}

const defaultDeps = (): FanOutDeps => ({
  resolve: resolveAll,
  fetchImpl: fetch,
  port: process.env.PORT || "3000",
});

/**
 * Each pod has its own ISR cache, and the Service delivers the Sanity webhook to only
 * one of them. Tell every pod (resolved through the headless Service) to revalidate.
 * Includes this pod; a second revalidate is harmless. Failures are reported, not thrown;
 * the 5-minute interval refresh covers any pod that misses the call.
 */
export async function fanOutRevalidate(
  host: string,
  secret: string,
  deps: FanOutDeps = defaultDeps()
): Promise<{ ip: string; ok: boolean }[]> {
  let ips: string[];
  try {
    ips = await deps.resolve(host);
  } catch (error) {
    console.error("Revalidate fan-out: could not resolve peers", error);
    return [];
  }

  return Promise.all(
    ips.map(async (ip) => {
      try {
        const res = await deps.fetchImpl(`http://${ip}:${deps.port}/api/revalidate`, {
          method: "POST",
          headers: { [FANOUT_HEADER]: secret },
          signal: AbortSignal.timeout(3000),
        });
        return { ip, ok: res.ok };
      } catch (error) {
        console.error(`Revalidate fan-out to ${ip} failed`, error);
        return { ip, ok: false };
      }
    })
  );
}
```

The test passes `{ method, headers }` through `expect.objectContaining`, so the extra `signal` key is fine.

`src/app/(public)/api/revalidate/route.ts`:

```ts
import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SANITY_CACHE_TAG } from "@/lib/sanity.cache";
import { FANOUT_HEADER, fanOutRevalidate } from "@/lib/revalidate";

function secretsMatch(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("SANITY_REVALIDATE_SECRET is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // Pod-to-pod call from another replica's fan-out.
  const fanoutSecret = req.headers.get(FANOUT_HEADER);
  if (fanoutSecret !== null) {
    if (!secretsMatch(fanoutSecret, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    revalidateTag(SANITY_CACHE_TAG);
    return NextResponse.json({ revalidated: true });
  }

  // Webhook from Sanity: verify the signature (parseBody also waits briefly for the
  // Content Lake to become consistent before we refetch).
  const { isValidSignature } = await parseBody(req, secret);
  if (isValidSignature !== true) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  revalidateTag(SANITY_CACHE_TAG);

  const peersHost = process.env.REVALIDATE_PEERS_HOST;
  const peers = peersHost ? await fanOutRevalidate(peersHost, secret) : [];
  return NextResponse.json({ revalidated: true, peers });
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `pnpm vitest run src/lib/revalidate.test.ts "src/app/(public)/api/revalidate/route.test.ts"`
Expected: PASS.

- [ ] **Step 5: Document the env vars.** Append to `.env.local.example`:

```bash

# Sanity publish webhook (POST /api/revalidate). Same value as the webhook's secret in sanity.io/manage.
SANITY_REVALIDATE_SECRET=
# Headless Service DNS name that resolves to every pod (prod only; leave empty locally).
REVALIDATE_PEERS_HOST=
```

- [ ] **Step 6: Run `pnpm test && pnpm lint && pnpm build`, then commit**

```bash
git add src/lib/revalidate.ts src/lib/revalidate.test.ts "src/app/(public)/api/revalidate" .env.local.example
git commit -m "feat: Signed Sanity webhook that revalidates every pod"
```

---

### Task 9: robots.txt and sitemap (§3.2; T2, T3, T4)

**Files:**
- Create: `src/data/pages.ts`, `src/lib/sitemap-entries.ts`, `src/lib/sitemap-entries.test.ts`
- Modify: `src/app/(public)/sitemap.ts`, `src/app/(public)/robots.ts`

**Interfaces:**
- Consumes: `services` with `updatedAt` (Task 4); `redirects` (Tasks 4–5); `fetchSanity` and `articleSitemapQuery` (Task 7); `siteConfig.url` and `insightsEnabled`.
- Produces:
  - `interface SitemapArticle { slug: string; publishedAt: string; updatedAt?: string }`
  - `buildSitemapEntries(articles: SitemapArticle[], opts?: { insightsEnabled?: boolean }): MetadataRoute.Sitemap`

- [ ] **Step 1: Write the failing test.** `src/lib/sitemap-entries.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildSitemapEntries } from "./sitemap-entries";
import { redirects } from "@/data/redirects";

const ORIGIN = "https://bluecrest-group.com";
const articles = [
  { slug: "a", publishedAt: "2026-09-01T00:00:00Z" },
  { slug: "b", publishedAt: "2026-09-02T00:00:00Z", updatedAt: "2026-09-20T00:00:00Z" },
];

describe("buildSitemapEntries", () => {
  const off = buildSitemapEntries(articles, { insightsEnabled: false });
  const urls = off.map((e) => e.url);

  it("uses only the non-www origin", () => {
    urls.forEach((u) => expect(u.startsWith(`${ORIGIN}/`) || u === ORIGIN).toBe(true));
    expect(urls.join()).not.toContain("www.");
  });

  it("includes privacy, terms, 16 services, and Newport Beach", () => {
    expect(urls).toContain(`${ORIGIN}/privacy`);
    expect(urls).toContain(`${ORIGIN}/terms`);
    expect(urls.filter((u) => u.startsWith(`${ORIGIN}/services/`))).toHaveLength(16);
    expect(urls).toContain(`${ORIGIN}/service-areas/newport-beach-ca`);
  });

  it("never lists a redirected URL", () => {
    redirects.forEach((r) => expect(urls).not.toContain(`${ORIGIN}${r.source}`));
  });

  it("leaves Insights and articles out while switched off", () => {
    expect(urls.some((u) => u.includes("/insights"))).toBe(false);
  });

  it("has no duplicate URLs and a real lastModified on each", () => {
    expect(new Set(urls).size).toBe(urls.length);
    off.forEach((e) => expect(String(e.lastModified)).toMatch(/^\d{4}-\d{2}-\d{2}/));
  });

  it("adds Insights and articles when switched on, dated by update then publish", () => {
    const on = buildSitemapEntries(articles, { insightsEnabled: true });
    const byUrl = Object.fromEntries(on.map((e) => [e.url, e.lastModified]));
    expect(byUrl).toHaveProperty(`${ORIGIN}/insights`);
    expect(byUrl[`${ORIGIN}/insights/a`]).toBe("2026-09-01T00:00:00Z");
    expect(byUrl[`${ORIGIN}/insights/b`]).toBe("2026-09-20T00:00:00Z");
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `pnpm vitest run src/lib/sitemap-entries.test.ts`
Expected: FAIL (the module is missing).

- [ ] **Step 3: Implement it.** `src/data/pages.ts`:

```ts
/** Static, indexable public pages. Bump updatedAt when a page's content changes (T3). */
export interface StaticPage {
  path: string;
  updatedAt: string;
}

export const staticPages: StaticPage[] = [
  { path: "/", updatedAt: "2026-10-02" },
  { path: "/about", updatedAt: "2026-10-02" },
  { path: "/contact", updatedAt: "2026-10-02" },
  { path: "/services", updatedAt: "2026-10-02" },
  { path: "/service-areas", updatedAt: "2026-10-02" },
  { path: "/service-areas/newport-beach-ca", updatedAt: "2026-10-02" },
  { path: "/privacy", updatedAt: "2026-10-02" },
  { path: "/terms", updatedAt: "2026-10-02" },
];

/** The Insights hub's own date; articles carry theirs from Sanity. */
export const INSIGHTS_HUB_UPDATED_AT = "2026-10-02";
```

`src/lib/sitemap-entries.ts`:

```ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { services } from "@/data/services";
import { staticPages, INSIGHTS_HUB_UPDATED_AT } from "@/data/pages";

export interface SitemapArticle {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
}

function url(path: string): string {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
}

export function buildSitemapEntries(
  articles: SitemapArticle[],
  opts: { insightsEnabled?: boolean } = {}
): MetadataRoute.Sitemap {
  const insightsEnabled = opts.insightsEnabled ?? siteConfig.insightsEnabled;

  const entries: MetadataRoute.Sitemap = [
    ...staticPages.map((p) => ({ url: url(p.path), lastModified: p.updatedAt })),
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), lastModified: s.updatedAt })),
  ];

  if (insightsEnabled) {
    entries.push({ url: url("/insights"), lastModified: INSIGHTS_HUB_UPDATED_AT });
    for (const a of articles) {
      entries.push({ url: url(`/insights/${a.slug}`), lastModified: a.updatedAt ?? a.publishedAt });
    }
  }

  return entries;
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `pnpm vitest run src/lib/sitemap-entries.test.ts`
Expected: PASS.

- [ ] **Step 5: Replace the route files.** `src/app/(public)/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { fetchSanity, articleSitemapQuery } from "@/lib/sanity";
import { buildSitemapEntries, type SitemapArticle } from "@/lib/sitemap-entries";

export const revalidate = 300; // keep equal to SANITY_REVALIDATE_SECONDS

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articles: SitemapArticle[] = [];
  if (siteConfig.insightsEnabled && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      articles = await fetchSanity<SitemapArticle[]>(articleSitemapQuery);
    } catch (error) {
      console.error("Failed to fetch articles for sitemap", error);
    }
  }
  return buildSitemapEntries(articles);
}
```

`src/app/(public)/robots.ts`:

```ts
import { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/portal/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 6: Verify**

```bash
pnpm test && pnpm lint && pnpm build
(PORTAL_ENABLED= pnpm start -p 3100 &) && sleep 5
curl -s http://localhost:3100/robots.txt
curl -s http://localhost:3100/sitemap.xml | grep -c "<loc>"
curl -s http://localhost:3100/sitemap.xml | grep -c "www\.\|insights\|irvine\|payroll"
pkill -f "next start -p 3100"
```

Expected:
- `robots.txt` shows `Sitemap: https://bluecrest-group.com/sitemap.xml`
- the `<loc>` count is 24 (8 static pages + 16 services)
- the second count is `0`

- [ ] **Step 7: Commit**

```bash
git add src/data/pages.ts src/lib/sitemap-entries.ts src/lib/sitemap-entries.test.ts "src/app/(public)/sitemap.ts" "src/app/(public)/robots.ts"
git commit -m "feat: Non-www sitemap with real lastmod and only indexable URLs"
```

---

### Task 10: Contact form that fails loudly, plus Turnstile (§3.9; T17, items 11–12)

**Files:**
- Create: `src/lib/turnstile.ts`, `src/lib/turnstile.test.ts`, `src/lib/email/sendgrid.test.ts`, `src/app/(public)/api/contact/route.test.ts`
- Modify: `src/lib/email/sendgrid.ts`, `src/app/(public)/api/contact/route.ts`, `src/components/ContactForm.tsx`, `.env.local.example`, `package.json`

**Interfaces:**
- Produces:
  - `verifyTurnstile(token: string | undefined, remoteIp?: string, fetchImpl?: typeof fetch): Promise<boolean>`
  - `sendInternalNotifications` and `sendCustomerConfirmation`, which now **throw** when `SENDGRID_API_KEY` is missing
  - `getNotifyRecipients(): string[]`
  - The contact API accepts `turnstileToken` in the JSON body. It returns:
    - 400 on missing fields
    - 403 on a failed captcha
    - 502 when the internal notification fails
    - 200 otherwise

- [ ] **Step 1: Write the failing tests.** `src/lib/turnstile.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyTurnstile } from "./turnstile";

beforeEach(() => { process.env.TURNSTILE_SECRET = "secret"; });

describe("verifyTurnstile", () => {
  it("returns false without calling Cloudflare when the token is missing", async () => {
    const f = vi.fn();
    expect(await verifyTurnstile(undefined, undefined, f)).toBe(false);
    expect(await verifyTurnstile("", undefined, f)).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });

  it("posts secret, token, and IP to siteverify", async () => {
    const f = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true })));
    expect(await verifyTurnstile("tok", "1.2.3.4", f)).toBe(true);
    const [url, init] = f.mock.calls[0];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    const body = init.body as URLSearchParams;
    expect(body.get("secret")).toBe("secret");
    expect(body.get("response")).toBe("tok");
    expect(body.get("remoteip")).toBe("1.2.3.4");
  });

  it("returns false on an expired token or a Cloudflare error", async () => {
    const expired = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, "error-codes": ["timeout-or-duplicate"] })));
    expect(await verifyTurnstile("tok", undefined, expired)).toBe(false);
    const down = vi.fn().mockResolvedValue(new Response("oops", { status: 503 }));
    expect(await verifyTurnstile("tok", undefined, down)).toBe(false);
  });

  it("throws when the secret is not configured", async () => {
    delete process.env.TURNSTILE_SECRET;
    await expect(verifyTurnstile("tok", undefined, vi.fn())).rejects.toThrow(/TURNSTILE_SECRET/);
  });
});
```

`src/lib/email/sendgrid.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const send = vi.hoisted(() => vi.fn().mockResolvedValue([{}]));
vi.mock("@sendgrid/mail", () => ({ default: { setApiKey: vi.fn(), send } }));

import { sendInternalNotifications, sendCustomerConfirmation, getNotifyRecipients } from "./sendgrid";

const brand = { company_name: "BlueCrest Group" } as never;
const lead = { name: "A", email: "a@example.com", projectType: "Other" } as never;

beforeEach(() => {
  vi.clearAllMocks();
  process.env.SENDGRID_API_KEY = "SG.test";
  process.env.SENDGRID_TEMPLATE_ID = "d-internal";
  process.env.SENDGRID_TEMPLATE_CONFIRMATION = "d-confirm";
  delete process.env.CONTACT_NOTIFY_TO;
});

describe("sendgrid", () => {
  it("throws instead of silently skipping when the API key is missing", async () => {
    delete process.env.SENDGRID_API_KEY;
    await expect(sendInternalNotifications(brand, lead)).rejects.toThrow(/SENDGRID_API_KEY/);
    await expect(sendCustomerConfirmation(brand, lead)).rejects.toThrow(/SENDGRID_API_KEY/);
  });

  it("uses the internal template for the lead and the confirmation template for the customer", async () => {
    await sendInternalNotifications(brand, lead);
    expect(send.mock.calls[0][0]).toMatchObject({ to: "info@bluecrest-group.com", templateId: "d-internal" });
    await sendCustomerConfirmation(brand, lead);
    expect(send.mock.calls[1][0]).toMatchObject({ to: "a@example.com", templateId: "d-confirm" });
  });

  it("throws when a template ID is not configured", async () => {
    delete process.env.SENDGRID_TEMPLATE_ID;
    await expect(sendInternalNotifications(brand, lead)).rejects.toThrow(/SENDGRID_TEMPLATE_ID/);
  });

  it("reads comma-separated recipients from CONTACT_NOTIFY_TO", () => {
    process.env.CONTACT_NOTIFY_TO = "josh@x.com, ops@x.com ,";
    expect(getNotifyRecipients()).toEqual(["josh@x.com", "ops@x.com"]);
  });
});
```

`src/app/(public)/api/contact/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const sendInternal = vi.hoisted(() => vi.fn());
const sendConfirm = vi.hoisted(() => vi.fn());
const verify = vi.hoisted(() => vi.fn());

vi.mock("@/lib/email/sendgrid", () => ({
  sendInternalNotifications: sendInternal,
  sendCustomerConfirmation: sendConfirm,
}));
vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: verify }));
vi.mock("@/lib/brand", () => ({ getBrand: () => ({ company_name: "BlueCrest Group" }) }));

import { POST } from "./route";

const valid = { name: "A", email: "a@example.com", phone: "9495550100", projectType: "Other", turnstileToken: "tok" };

function req(body: object) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "1.2.3.4" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  verify.mockResolvedValue(true);
  sendInternal.mockResolvedValue(undefined);
  sendConfirm.mockResolvedValue(undefined);
});

describe("POST /api/contact", () => {
  it("400s on missing required fields", async () => {
    expect((await POST(req({ ...valid, email: "" }))).status).toBe(400);
  });

  it("403s and sends nothing when Turnstile fails", async () => {
    verify.mockResolvedValue(false);
    const res = await POST(req(valid));
    expect(res.status).toBe(403);
    expect(sendInternal).not.toHaveBeenCalled();
    expect(sendConfirm).not.toHaveBeenCalled();
  });

  it("passes the token and client IP to Turnstile", async () => {
    await POST(req(valid));
    expect(verify).toHaveBeenCalledWith("tok", "1.2.3.4");
  });

  it("502s when the internal notification fails, and skips the customer email", async () => {
    sendInternal.mockRejectedValue(new Error("SendGrid down"));
    const res = await POST(req(valid));
    expect(res.status).toBe(502);
    expect(sendConfirm).not.toHaveBeenCalled();
  });

  it("still 200s when only the customer confirmation fails", async () => {
    sendConfirm.mockRejectedValue(new Error("bounce"));
    expect((await POST(req(valid))).status).toBe(200);
  });

  it("200s on the happy path with both emails sent", async () => {
    expect((await POST(req(valid))).status).toBe(200);
    expect(sendInternal).toHaveBeenCalledTimes(1);
    expect(sendConfirm).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `pnpm vitest run src/lib/turnstile.test.ts src/lib/email/sendgrid.test.ts "src/app/(public)/api/contact/route.test.ts"`
Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/turnstile.ts`**

```ts
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Server-side check of a Cloudflare Turnstile token. False for missing, expired, or reused tokens. */
export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
  fetchImpl: typeof fetch = fetch
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) throw new Error("TURNSTILE_SECRET is not set");
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetchImpl(SITEVERIFY_URL, { method: "POST", body });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification request failed", error);
    return false;
  }
}
```

- [ ] **Step 4: Update `src/lib/email/sendgrid.ts`:**
  - Delete the `export const SENDGRID_TEMPLATE_ID = ...` line.
  - Add these helpers below the `setApiKey` block:

```ts
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

/** Internal lead recipients: CONTACT_NOTIFY_TO (comma-separated), defaulting to the firm inbox. */
export function getNotifyRecipients(): string[] {
  const raw = process.env.CONTACT_NOTIFY_TO || "info@bluecrest-group.com";
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}
```

  - In `sendCustomerConfirmation`:
    - replace the `if (!process.env.SENDGRID_API_KEY) { console.error(...); return; }` block with `requireEnv("SENDGRID_API_KEY");`
    - set `templateId: requireEnv("SENDGRID_TEMPLATE_CONFIRMATION"),`
    - make sure the existing `catch` rethrows (`throw error;` at its end, matching `sendInternalNotifications`).
  - In `sendInternalNotifications`:
    - make the same `requireEnv("SENDGRID_API_KEY")` replacement
    - replace the hardcoded `recipients` array with `const recipients = getNotifyRecipients();`
    - set `templateId: requireEnv("SENDGRID_TEMPLATE_ID"),`.
  - Call `sgMail.setApiKey(process.env.SENDGRID_API_KEY)` inside each function just after `requireEnv`, so a key set after import is still used.

- [ ] **Step 5: Rewrite the handler in `src/app/(public)/api/contact/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getBrand } from "@/lib/brand";
import { sendCustomerConfirmation, sendInternalNotifications } from "@/lib/email/sendgrid";
import { verifyTurnstile } from "@/lib/turnstile";

function clientIp(request: Request): string | undefined {
  return request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? undefined;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, projectType, timeline, details, turnstileToken } = body;

    if (!name || !email || !phone || !projectType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!(await verifyTurnstile(turnstileToken, clientIp(request)))) {
      return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 403 });
    }

    const brand = {
      ...getBrand(),
      submitted_date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };
    const lead = {
      name: String(name),
      email: String(email),
      phone: String(phone).replace(/\D/g, ""),
      phone_plain: String(phone).replace(/\D/g, ""),
      company: company ? String(company) : undefined,
      projectType: String(projectType),
      timeline: timeline ? String(timeline) : undefined,
      projectDescription: details ? String(details) : undefined,
    };

    // The lead must reach the firm. If it does not, tell the visitor so they can retry or email.
    try {
      await sendInternalNotifications(brand, lead);
    } catch (error) {
      console.error("Contact form: internal notification failed", error);
      return NextResponse.json({ error: "We could not send your message." }, { status: 502 });
    }

    try {
      await sendCustomerConfirmation(brand, lead);
    } catch (error) {
      console.error("Contact form: customer confirmation failed (lead was delivered)", error);
    }

    return NextResponse.json({ message: "Form submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

The old `console.log` of the full submission is dropped on purpose: it wrote visitors' personal data to pod logs.

- [ ] **Step 6: Run the tests and confirm they pass**

Run: `pnpm vitest run src/lib/turnstile.test.ts src/lib/email/sendgrid.test.ts "src/app/(public)/api/contact/route.test.ts"`
Expected: PASS.

- [ ] **Step 7: Add the widget to the form**

Run: `pnpm add @marsidev/react-turnstile`

In `src/components/ContactForm.tsx`:
  - Add the imports `useRef`, `import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";`, and `import { siteConfig } from "@/data/site-config";`.
  - Add the state:

```tsx
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);
```

  - In `handleSubmit`, send `JSON.stringify({ ...formData, turnstileToken })`.
  - In the `catch`, run:

```tsx
      setError(`There was an error submitting your request. Please try again or email us at ${siteConfig.email}.`);
      turnstileRef.current?.reset();
      setTurnstileToken("");
```

  - Directly above the submit button, render:

```tsx
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          onError={() => setTurnstileToken("")}
          options={{ size: "flexible" }}
        />
```

  - Add `|| !turnstileToken` to the submit button's `disabled` condition.

Append to `.env.local.example`:

```bash
SENDGRID_TEMPLATE_CONFIRMATION=your_customer_confirmation_template_id
# Internal lead recipients, comma-separated (defaults to info@bluecrest-group.com)
CONTACT_NOTIFY_TO=

# Cloudflare Turnstile. These are Cloudflare's always-pass test keys for local dev.
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET=1x0000000000000000000000000000000AA
```

- [ ] **Step 8: Verify by hand.** Run `pnpm test && pnpm lint && pnpm build`. Then run `pnpm dev`, open `/contact`, and confirm:
  - the Turnstile widget renders
  - submit stays disabled until it passes
  - with no `SENDGRID_API_KEY` in your shell env (or with a bad one), submitting shows the "email us at info@bluecrest-group.com" error instead of success.

The production test submission (spec §3.9) happens at release, not here.

- [ ] **Step 9: Commit**

```bash
git add src/lib/turnstile.ts src/lib/turnstile.test.ts src/lib/email "src/app/(public)/api/contact" src/components/ContactForm.tsx .env.local.example package.json pnpm-lock.yaml
git commit -m "fix: Contact form reports delivery failures and verifies Turnstile"
```

---

### Task 11: One CTA, "Contact Us" (§3.8; T16)

**Files:**
- Create: `src/lib/cta.ts`, `src/lib/cta.test.ts`, `src/components/ContactCta.tsx`
- Modify:
  - `src/components/Header.tsx`, `Footer.tsx`, `StickyCTA.tsx`, `HomePageClient.tsx`
  - `src/app/(public)/contact/page.tsx`, `services/[slug]/page.tsx`, `service-areas/[slug]/page.tsx`, `service-areas/page.tsx`, `services/page.tsx`, `about/page.tsx`, `insights/[slug]/page.tsx`, `not-found.tsx`

**Interfaces:**
- Produces:
  - `CONTACT_CTA_LABEL = "Contact Us"`, `CONTACT_FORM_ID = "contact-form"`
  - `contactCtaHref(pathname: string | null): string`
  - `<ContactCta className? onClick? icon? />`

- [ ] **Step 1: Write the failing test.** `src/lib/cta.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { contactCtaHref, CONTACT_CTA_LABEL } from "./cta";

describe("contactCtaHref", () => {
  it("scrolls in place on the contact page", () => {
    expect(contactCtaHref("/contact")).toBe("#contact-form");
  });
  it("goes to the form from anywhere else", () => {
    expect(contactCtaHref("/")).toBe("/contact#contact-form");
    expect(contactCtaHref(null)).toBe("/contact#contact-form");
  });
  it("label is Contact Us", () => {
    expect(CONTACT_CTA_LABEL).toBe("Contact Us");
  });
});

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe("no legacy CTA labels in public UI", () => {
  const banned = /Connect Today|Book a call|Book An Intro|Book a 15|Free Consultation|Schedule a Consultation/i;
  const files = [...walk("src/components"), ...walk("src/app/(public)")]
    .filter((f) => f.endsWith(".tsx") && !f.includes("/portal/"));

  it.each(files)("%s", (f) => {
    expect(readFileSync(f, "utf8")).not.toMatch(banned);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `pnpm vitest run src/lib/cta.test.ts`
Expected: FAIL (the module is missing, and the label scan lists offending files).

- [ ] **Step 3: Implement it.** `src/lib/cta.ts`:

```ts
export const CONTACT_CTA_LABEL = "Contact Us";
export const CONTACT_FORM_ID = "contact-form";

/** On /contact, scroll to the form instead of reloading the page (T16). */
export function contactCtaHref(pathname: string | null): string {
  return pathname === "/contact" ? `#${CONTACT_FORM_ID}` : `/contact#${CONTACT_FORM_ID}`;
}
```

`src/components/ContactCta.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTACT_CTA_LABEL, contactCtaHref } from "@/lib/cta";

export default function ContactCta({
  className,
  onClick,
  icon,
}: {
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Link href={contactCtaHref(pathname)} className={className} onClick={onClick}>
      {icon}
      {CONTACT_CTA_LABEL}
    </Link>
  );
}
```

- [ ] **Step 4: Replace every CTA button.** For each row:
  - replace the `<Link href="/contact" className="...">…label…</Link>` with `<ContactCta className="(same classes)" />`
  - keep any leading `<svg>` by passing it as `icon={<svg ...>...</svg>}`
  - keep any `onClick`
  - import `ContactCta from "@/components/ContactCta"`

| File | Button(s) currently reading |
|---|---|
| `Header.tsx` | "Connect Today" (desktop, and mobile with `onClick={() => setMobileMenuOpen(false)}`) |
| `Footer.tsx` | "Book a call now", "Book a 15-Min Call" |
| `HomePageClient.tsx` | "Book An Intro Call". Drop its calendar `<svg>`, which implies booking. |
| `StickyCTA.tsx` | "Get a Free Consultation" (desktop); mobile "Contact Us" link (keep its chat icon) |
| `services/[slug]/page.tsx` | "Get a Free Consultation", "Schedule Your Free Consultation" |
| `service-areas/[slug]/page.tsx` | "Get a Free Consultation", "Schedule Your Free Consultation" |
| `service-areas/page.tsx` | "Schedule a Consultation", "Schedule Your Free Consultation" |
| `services/page.tsx` | "Schedule a Free Consultation" |
| `about/page.tsx` | "Schedule Your Free Consultation" |
| `insights/[slug]/page.tsx` | "Schedule Your Free Consultation" |
| `not-found.tsx` | "Contact Us" button (keep its icon); "Schedule Your Free Consultation" |

Leave the Footer's gold text link "Connect Your Business to Success" and the 404 "Popular Pages" Contact card as they are. They are navigation, not buttons, and contain no banned label.

- [ ] **Step 5: Replace the copy that promises a booking.** These are exact replacements:

| File | From | To |
|---|---|---|
| `contact/page.tsx` hero `<p>` | `Schedule a free consultation or reach out directly.` | `Send us a message or email us directly.` |
| `contact/page.tsx` form `<h2>` | `Schedule Your Free Consultation` | `Send Us a Message` |
| `HomePageClient.tsx` CTA `<p>` | `Schedule a\n                  free consultation to discuss your unique needs.` | `Contact us\n                  to discuss your unique needs.` |
| `HomePageClient.tsx` form `<h2>` | `Schedule Your Free Consultation` | `Send Us a Message` |
| `StickyCTA.tsx` subtext | `Schedule your free consultation` | `Tell us about your business` |
| `services/[slug]/page.tsx` sidebar `<p>` | `Schedule your free consultation to discuss your {service.name.toLowerCase()} needs.` | `Tell us about your business and we will be in touch.` |
| `services/[slug]/page.tsx` CTA `<h2>` | `Ready to Get Started With {service.name}?` | `Ready to Get Started?` |
| `services/[slug]/page.tsx` CTA `<p>` | `Schedule a free consultation to discuss how we can help your business with {service.name.toLowerCase()} and other financial services.` | `Contact us to discuss how we can help your business.` |
| `service-areas/[slug]/page.tsx` sidebar `<p>` | `Schedule your free consultation to discuss your financial needs in {location.name}.` | `Tell us about your business and we will be in touch.` |
| `service-areas/[slug]/page.tsx`, `service-areas/page.tsx`, `about/page.tsx`, `services/page.tsx` CTA `<p>` | text beginning `Schedule a free consultation` | the same sentence beginning `Contact us` (keep the rest of the sentence, e.g. "Contact us to discuss how BlueCrest Group can support…") |

The `\n` and spaces in the HomePageClient rows stand for the existing JSX line break; match the file's actual whitespace.

- [ ] **Step 6: Add the form anchor.** In `contact/page.tsx`, on the form card `<div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 lg:p-10">` that wraps `<ContactForm />`, add `id="contact-form"` and `scroll-mt-28` to its classes.

- [ ] **Step 7: Verify**

```bash
pnpm test && pnpm lint && pnpm build
(PORTAL_ENABLED= pnpm start -p 3100 &) && sleep 5
curl -s http://localhost:3100/contact | grep -oE 'href="[^"]*contact[^"]*"' | sort | uniq -c
curl -s http://localhost:3100/ | grep -oE 'href="/contact[^"]*"' | sort | uniq -c
pkill -f "next start -p 3100"
```

Expected:
- on `/contact`, the CTA links are `href="#contact-form"`; the plain nav "Contact" link to `/contact` may remain
- on `/`, the links are `/contact#contact-form`

- [ ] **Step 8: Commit**

```bash
git add src/lib/cta.ts src/lib/cta.test.ts src/components "src/app/(public)"
git commit -m "feat: Every call-to-action reads Contact Us and scrolls to the form on /contact"
```

---

### Task 12: Phone, Contact map, 404, homepage headings (§3.7, §3.10, §3.11; T15, T18, T19)

**Files:**
- Create: `src/lib/phone.ts`, `src/lib/phone.test.ts`
- Modify: `src/app/(public)/contact/page.tsx`, `src/components/Footer.tsx`, `src/app/(public)/not-found.tsx`, `src/components/HomePageClient.tsx`

**Interfaces:**
- Produces: `telHref(phone: string): string | null`, which returns `"tel:+1XXXXXXXXXX"` for a 10-digit US number (formatting ignored), or `null` otherwise.

- [ ] **Step 1: Write the failing test.** `src/lib/phone.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { telHref } from "./phone";

describe("telHref", () => {
  it("normalises US numbers", () => {
    expect(telHref("(949) 555-0100")).toBe("tel:+19495550100");
    expect(telHref("949.555.0100")).toBe("tel:+19495550100");
    expect(telHref("+1 949 555 0100")).toBe("tel:+19495550100");
  });
  it("returns null for empty or malformed numbers", () => {
    expect(telHref("")).toBeNull();
    expect(telHref("555-0100")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails.** Run `pnpm vitest run src/lib/phone.test.ts`. Expected: FAIL.

- [ ] **Step 3: Implement it.** `src/lib/phone.ts`:

```ts
/** tel: link for a US number, or null when the number is empty or malformed (T15). */
export function telHref(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 ? `tel:+1${digits}` : null;
}
```

Run `pnpm vitest run src/lib/phone.test.ts`. Expected: PASS.

- [ ] **Step 4: Update the Contact page.** In `contact/page.tsx`:
  - add `import { telHref } from "@/lib/phone";`
  - delete the entire `{/* Map Section */}` `<section>` (heading and iframe)
  - in the "Contact Information" card, insert this phone block between `{/* Email */}` and `{/* Location */}`; it renders nothing while `siteConfig.phone` is empty:

```tsx
                    {/* Phone */}
                    {telHref(siteConfig.phone) && (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-xl flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Phone</p>
                          <a href={telHref(siteConfig.phone)!} className="text-gray-900 font-semibold hover:text-[var(--color-brand-blue)] transition-colors">
                            {siteConfig.phone}
                          </a>
                        </div>
                      </div>
                    )}
```

- [ ] **Step 5: Update the Footer location.** In `Footer.tsx`, replace the location `<a href={\`https://maps.google.com/?q=...\`} ...>...</a>` with the following. It links to the Google Business Profile once one is set; until then it is plain text with no map link:

```tsx
                  {(() => {
                    const inner = (
                      <>
                        <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>{siteConfig.city}, {siteConfig.stateAbbr}</div>
                      </>
                    );
                    return siteConfig.googleBusinessProfileUrl ? (
                      <a href={siteConfig.googleBusinessProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-start gap-3">{inner}</div>
                    );
                  })()}
```

- [ ] **Step 6: Update the 404 page.** In `not-found.tsx`:
  - add `import type { Metadata } from "next";` and `import { pageMeta } from "@/data/page-meta";`
  - add:

```ts
export const metadata: Metadata = {
  title: pageMeta.notFound.title,
  description: pageMeta.notFound.description,
  robots: { index: false, follow: true },
};
```

  - In "Popular Pages", replace the `/service-areas` card with a `/services/fractional-cfo-services` card:
    - title `Fractional CFO Services`
    - subtitle `Strategic financial leadership`
    - keep the same markup and icon wrapper classes.

  The page already has the header and menu through the layout, a Services hub link, and (after Task 11) a Contact Us button.

- [ ] **Step 7: Fix the duplicate homepage headings (T18).** In `HomePageClient.tsx`, in the second section (`{/* Services by Category Section */}`), change:

```tsx
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">{category.name}</h3>
```

to:

```tsx
                  <p className="text-3xl lg:text-4xl font-bold text-white mb-2">{category.name}</p>
```

The first set of category `<h3>`s, under the "Our Services" `<h2>`, stays.

- [ ] **Step 8: Verify**

```bash
pnpm test && pnpm lint && pnpm build
(PORTAL_ENABLED= pnpm start -p 3100 &) && sleep 5
curl -s http://localhost:3100/contact | grep -c "google.com/maps"
curl -s http://localhost:3100/ | grep -c "google.com/maps"
curl -s http://localhost:3100/no-such-page -o /tmp/404.html -w "%{http_code}\n"; grep -oE "<title>[^<]*</title>" /tmp/404.html; grep -c "fractional-cfo-services" /tmp/404.html
curl -s http://localhost:3100/ | grep -oE "<h[1-3][^>]*>[^<]*" | sed -E 's/<(h[1-3])[^>]*>/\1 /' | sort | uniq -d
pkill -f "next start -p 3100"
```

Expected:
- the maps counts are `0`
- the 404 page returns `404` with `<title>Page Not Found | BlueCrest Group</title>`, and its CFO link count is ≥ 1
- the duplicate-heading output is empty

- [ ] **Step 9: Commit**

```bash
git add src/lib/phone.ts src/lib/phone.test.ts "src/app/(public)/contact/page.tsx" "src/app/(public)/not-found.tsx" src/components/Footer.tsx src/components/HomePageClient.tsx
git commit -m "feat: Optional phone link, no map embeds, branded 404 metadata, unique homepage headings"
```

---

### Task 13: Hero video performance (§3.12; T20)

**Files:**
- Create: `src/components/HeroVideo.tsx`, `public/images/hero-poster.jpg`
- Modify: `public/bluecrest-group-fractional-cfo-services-orange-county-ca.mp4` (re-encoded), `src/components/HomePageClient.tsx`, `src/app/layout.tsx`

- [ ] **Step 1: Re-encode the video and extract the poster**

```bash
SRC=public/bluecrest-group-fractional-cfo-services-orange-county-ca.mp4
ffmpeg -y -i "$SRC" -an -vf "scale=1280:-2" -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart /tmp/hero.mp4
ffmpeg -y -i /tmp/hero.mp4 -frames:v 1 -q:v 4 public/images/hero-poster.jpg
mv /tmp/hero.mp4 "$SRC"
ls -l "$SRC" public/images/hero-poster.jpg
```

Expected: the video is ≤ 3 MB, with no audio track (it was 11 MB with audio), and the poster is ≤ 200 KB. If the video is still over 3 MB, rerun with `-crf 32`.

- [ ] **Step 2: Create `src/components/HeroVideo.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const VIDEO_SRC = "/bluecrest-group-fractional-cfo-services-orange-county-ca.mp4";
const POSTER_SRC = "/images/hero-poster.jpg";

/**
 * The poster image is the LCP element on every device. The video mounts only on
 * desktop-width screens without reduced-motion, and never autoplays on mobile (T20).
 */
export default function HeroVideo() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShowVideo(wide && !calm);
  }, []);

  return (
    <>
      <Image
        src={POSTER_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-60 z-0"
      />
      {showVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={POSTER_SRC}
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}
    </>
  );
}
```

- [ ] **Step 3: Wire it in:**
  - In `HomePageClient.tsx`, replace the `<video ...>...</video>` element with `<HeroVideo />` and add `import HeroVideo from "@/components/HeroVideo";`.
  - In `src/app/layout.tsx`'s `<head>`, add `<link rel="preconnect" href="https://fonts.cdnfonts.com" />` before the existing stylesheet link.

- [ ] **Step 4: Verify**

```bash
pnpm test && pnpm lint && pnpm build
(PORTAL_ENABLED= pnpm start -p 3100 &) && sleep 5
curl -s http://localhost:3100/ | grep -c "<video"
curl -s http://localhost:3100/ | grep -o 'hero-poster[^"]*' | head -1
pkill -f "next start -p 3100"
```

Expected:
- the server HTML has `0` `<video>` tags (it mounts client-side on desktop only)
- the poster is referenced

Also check in a browser at desktop width that the video plays, and at a phone width (DevTools device mode) that only the still image shows.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroVideo.tsx src/components/HomePageClient.tsx src/app/layout.tsx public/images/hero-poster.jpg public/bluecrest-group-fractional-cfo-services-orange-county-ca.mp4
git commit -m "perf: Poster-first hero, 3MB video on desktop only, font preconnect"
```

---

### Task 14: Deployment manifests in `framlux/stack` (local branch only; items 7, 10; §3.6)

This task works in `/Users/jonathanmiller/Repositories/framlux/stack`. Argo CD auto-syncs that repo's `main` to prod. **Commit on a branch, and do not push.** The user merges it at release, after they have created the SealedSecret: secret values cannot come from this plan.

**Files:**
- Create: `clusters/prod/apps/bluecrest-web/base/service-peers.yaml`
- Modify: `clusters/prod/apps/bluecrest-web/base/kustomization.yaml`, `clusters/prod/apps/bluecrest-web/base/deployment.yaml`

- [ ] **Step 1: Create the branch**

```bash
cd /Users/jonathanmiller/Repositories/framlux/stack
git status --short   # must be clean; stop and report if not
git checkout -b bluecrest-seo-release
```

- [ ] **Step 2: Create `service-peers.yaml`**

```yaml
# Headless Service: DNS returns every bluecrest-web pod IP. The Sanity publish webhook
# lands on one pod, which uses this name to tell every pod to revalidate its own cache.
apiVersion: v1
kind: Service
metadata:
  name: bluecrest-web-peers
  namespace: bluecrest
spec:
  clusterIP: None
  selector:
    app: bluecrest-web
  ports:
    - name: http
      port: 3000
      targetPort: 3000
```

Add `- service-peers.yaml` to `kustomization.yaml` `resources`, after `service.yaml`.

- [ ] **Step 3: Rewire the env in `deployment.yaml`.** Replace the whole `env:` list with the block below. Secrets move to a `bluecrest-web-env` Secret, which the user provides as a SealedSecret. Non-secret config stays inline. `PORTAL_ENABLED` is deliberately absent.

```yaml
          env:
            - name: SENDGRID_TEMPLATE_ID
              value: "d-a2ee5992c17949a3b96070a2fb744f44"   # internal lead template; replace with a separate one (spec item 11)
            - name: SENDGRID_TEMPLATE_CONFIRMATION
              value: "d-a2ee5992c17949a3b96070a2fb744f44"
            - name: SENDGRID_REPLY_TO
              value: "info@bluecrest-group.com"
            - name: SENDGRID_FROM_EMAIL
              value: "info@bluecrest-group.com"
            - name: SENDGRID_FROM_NAME
              value: "Bluecrest Group"
            - name: CONTACT_NOTIFY_TO
              value: "info@bluecrest-group.com"
            - name: NEXT_PUBLIC_TURNSTILE_SITE_KEY
              value: "0x4AAAAAACVZkcEmiMFqdgOe"
            - name: NEXT_PUBLIC_SANITY_PROJECT_ID
              value: "xnub7law"
            - name: NEXT_PUBLIC_SANITY_DATASET
              value: "production"
            - name: REVALIDATE_PEERS_HOST
              value: "bluecrest-web-peers.bluecrest.svc.cluster.local"
            - name: SENDGRID_API_KEY
              valueFrom:
                secretKeyRef: { name: bluecrest-web-env, key: SENDGRID_API_KEY }
            - name: TURNSTILE_SECRET
              valueFrom:
                secretKeyRef: { name: bluecrest-web-env, key: TURNSTILE_SECRET }
            - name: SANITY_REVALIDATE_SECRET
              valueFrom:
                secretKeyRef: { name: bluecrest-web-env, key: SANITY_REVALIDATE_SECRET }
```

- [ ] **Step 4: Validate the manifests**

```bash
kubectl kustomize clusters/prod/apps/bluecrest-web/base > /tmp/bluecrest.yaml && grep -c "kind:" /tmp/bluecrest.yaml
grep -n -A1 "name: SENDGRID_API_KEY\|name: TURNSTILE_SECRET\|name: SANITY_REVALIDATE_SECRET" clusters/prod/apps/bluecrest-web/base/deployment.yaml | grep "value:"   # expect nothing: no plaintext secrets
```

Expected: kustomize renders without errors, and the grep prints nothing.

- [ ] **Step 5: Commit, without pushing**

```bash
git add clusters/prod/apps/bluecrest-web/base
git commit -m "bluecrest-web: headless peers Service, secrets via bluecrest-web-env, revalidate env"
git checkout main
```

Then report the user's handoff steps, which this task cannot do:
  1. Rotate the SendGrid API key and the Turnstile secret.
  2. Generate a random `SANITY_REVALIDATE_SECRET`.
  3. Create `sealed-secret-env.yaml` with `kubectl create secret generic bluecrest-web-env -n bluecrest --from-literal=... --dry-run=client -o yaml | kubeseal -o yaml`, and add it to `kustomization.yaml`.
  4. Merge the branch only together with the app release.

---

### Task 15: Docs and final verification

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update `CLAUDE.md`:**
  - In **Key Directories**, change the `src/app/` paths to `src/app/(public)/...` and mention `src/app/(portal)` ("client portal, off unless `PORTAL_ENABLED=true`").
  - In **Architecture**, replace the "Spam Protection" line with "Cloudflare Turnstile (widget in `ContactForm`, verified in `src/lib/turnstile.ts`)". Add:
    - "Sanity content refreshes through ISR every 300 s, plus a signed webhook at `/api/revalidate` that fans out to every pod through `REVALIDATE_PEERS_HOST`."
    - "Metadata is built with `buildMetadata()` in `src/lib/metadata.ts`, and JSON-LD with `src/lib/structured-data.ts`."
  - Under **Environment Variables**, add:
    - `SENDGRID_TEMPLATE_ID`, `SENDGRID_TEMPLATE_CONFIRMATION`, `CONTACT_NOTIFY_TO`
    - `SANITY_REVALIDATE_SECRET`, `REVALIDATE_PEERS_HOST`, `PORTAL_ENABLED`
  - Add a **Deployment** note: "Prod runs the image digest pinned in `framlux/stack/clusters/prod/apps/bluecrest-web/base/deployment.yaml` (Argo CD). Pushing `prod` only builds the image. Runtime env and secrets live in that repo."
  - Add a **Content switches** note: "`siteConfig.insightsEnabled` turns Insights indexing, nav and sitemap on. `siteConfig.phone` and `googleBusinessProfileUrl` render nothing while empty."

- [ ] **Step 2: Run the full verification**

```bash
pnpm test && pnpm lint && pnpm build
(PORTAL_ENABLED= pnpm start -p 3100 &) && sleep 5
for p in / /about /contact /services /services/fractional-cfo-services /service-areas /service-areas/newport-beach-ca /privacy /terms /insights; do
  html=$(curl -s http://localhost:3100$p)
  printf "%-40s canon=%s h1=%s brand=%s localhost=%s\n" "$p" \
    "$(echo "$html" | grep -c 'rel="canonical"')" \
    "$(echo "$html" | grep -o '<h1' | wc -l | tr -d ' ')" \
    "$(echo "$html" | grep -oE '<title>[^<]*' | grep -o 'BlueCrest Group' | wc -l | tr -d ' ')" \
    "$(echo "$html" | grep -c localhost)"
done
pkill -f "next start -p 3100"
```

Expected: every row shows `canon=1 h1=1 brand=1 localhost=0`.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: Update CLAUDE.md for route groups, portal flag, Sanity refresh, and deploy flow"
```

---

## Out of scope for this plan (blocked or manual)

- **Blocked on Josh:**
  - final city list (D3)
  - OG image (D4)
  - phone number and confirmation of the March 2026 removal (T15)
  - Google Business Profile URL
  - meta descriptions and service copy
  - Sanity Administrator invite (D7), which is needed for `pnpm studio:deploy` and to create the webhook
- **User-run at release:**
  - SealedSecret creation and secret rotation (Task 14 handoff)
  - a separate SendGrid internal template
  - a production test submission
  - merging `framlux/stack` and bumping the image digest
  - PageSpeed Insights runs
  - Search Console sitemap submission
