# PRD: BlueCrest Client Financial Portal

## 1. Intent

BlueCrest Group is a fractional CFO and accounting firm. Their clients (companies) need a way to view their financial data — specifically Profit & Loss statements and cashflow — through a secure, branded portal. Today, financial reports are shared manually. This portal automates that by letting BlueCrest admins upload QuickBooks Online exports per client, and letting invited client users log in via magic link to view interactive P&L dashboards with period-over-period comparisons.

The portal is added to the existing Next.js marketing site using route groups, keeping the public site completely untouched. It runs on the same Docker container deployed to bare-metal K3S, backed by a self-hosted Postgres database.

### Goals
- Give BlueCrest clients self-service access to their financial data
- Reduce manual report delivery overhead for BlueCrest staff
- Provide period-over-period P&L comparisons (month, quarter, year) with automatic fiscal year alignment
- Maintain a simple, invite-only access model with no self-registration

### Non-Goals (Future Work)
- QuickBooks Online API integration (OAuth automated sync)
- Cashflow statement uploads (derive from P&L for now)
- PDF report export
- Email notifications for new data uploads
- Self-registration or password-based auth

---

## 2. User Stories

### Admin (BlueCrest Staff)

**US-1: Route Group Migration**
> As a developer, I need the existing marketing site moved into a `(public)` route group so the portal can have its own layout without affecting any existing URLs.

**US-2: Database Setup**
> As a developer, I need a Postgres database with Drizzle ORM schema for users, companies, financial periods, P&L line items, cashflow items, and Auth.js tables so the portal has persistent storage.

**US-3: Auth Configuration**
> As a developer, I need Auth.js v5 configured with magic link (email) provider using SendGrid, with invite-only access control (reject sign-in for unknown emails), so only admin-created users can log in.

**US-4: Middleware Protection**
> As an admin, I need all `/portal/*` routes protected by auth middleware, with `/portal/admin/*` restricted to admin role, so client users cannot access admin functions.

**US-5: Portal Shell**
> As an admin, I need a portal layout with sidebar navigation (dashboard, admin sections) and a login page, so the portal has a distinct UI from the marketing site.

**US-6: Company Management**
> As an admin, I want to create, edit, and delete client companies (with name, industry, description, and fiscal year start month) so I can organize financial data by client.

**US-7: User Invite**
> As an admin, I want to invite users by email (assigning them a role and company access) so they receive a magic link and can immediately access their company's data.

**US-8: User Management**
> As an admin, I want to view, edit, and remove users, and manage which companies they can access, so I maintain control over portal access.

**US-9: Company Access Management**
> As an admin, I want to view a company's detail page showing all users with access, and grant/revoke access, so I can manage permissions per company.

**US-10: CSV/Excel Upload**
> As an admin, I want to upload a QuickBooks Online P&L export (CSV or Excel) for a specific company with start and end dates, preview the parsed data, and confirm the import, so financial data is stored in the database.

**US-11: Duplicate Period Prevention**
> As an admin, I want the system to reject uploads that overlap with existing periods for the same company, so data integrity is maintained.

### Client User (Invited)

**US-12: Magic Link Login**
> As a client user, I want to enter my email on the login page and receive a magic link, so I can log in without a password.

**US-13: Company Dashboard**
> As a client user, I want to see my assigned company on the dashboard with a summary of the latest financial data (revenue, expenses, net income), so I get an at-a-glance view.

**US-14: P&L Overview**
> As a client user, I want to view my company's P&L with summary cards and trend charts, switchable between monthly, quarterly, and annual views, so I can understand financial performance over time.

**US-15: P&L Detail with Comparisons**
> As a client user, I want to see a detailed P&L table for a selected period with category hierarchy, and a comparison column showing the prior period's figures plus variance (dollar and percentage), so I can identify trends and anomalies.

**US-16: Quarterly/Annual Aggregation**
> As a client user, I want quarterly and annual P&L views to be automatically computed from monthly data using my company's fiscal year start month, so I don't need separate quarterly/annual uploads.

**US-17: Cashflow Dashboard**
> As a client user, I want to view cashflow data with a trend chart and detail table, so I can understand cash position over time.

**US-18: Access Control**
> As a client user, I should only see companies I've been granted access to, and navigating to an unauthorized company should return a 404, so data is properly isolated.

---

## 3. Technical Decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| ORM | Drizzle | No binary engine (smaller Docker image for K3S), SQL-like TypeScript, first-class Postgres |
| Auth | Auth.js v5 (next-auth@5) | Native App Router support, Email provider for magic links, Drizzle adapter |
| Charts | Recharts | Mature, no design system dependency, works as "use client" components |
| File parsing | xlsx (SheetJS) | Handles both CSV and .xlsx from QBO exports |
| DB driver | postgres (postgres.js) | Lightweight, no native dependencies, works in Docker slim |
| Styling | Pure Tailwind CSS v4 | Match existing codebase — use CSS variables from globals.css |

### New Packages
```bash
pnpm add next-auth@5 @auth/drizzle-adapter drizzle-orm postgres recharts xlsx
pnpm add -D drizzle-kit
```

### New Environment Variables
```
DATABASE_URL=postgres://user:pass@postgres-service:5432/bluecrest
AUTH_SECRET=<generated secret>
```

---

## 4. Database Schema

```
users:             id (uuid pk), email (unique), name, role (enum: admin|client), emailVerified (timestamp), createdAt, updatedAt
companies:         id (uuid pk), name, industry, description, fiscalYearStartMonth (int 1-12, default 1), createdAt, updatedAt
companyAccess:     id (uuid pk), userId (fk→users), companyId (fk→companies), unique(userId, companyId)
financialPeriods:  id (uuid pk), companyId (fk→companies), periodStart (date), periodEnd (date), importedBy (fk→users), createdAt
pnlLineItems:     id (uuid pk), periodId (fk→financialPeriods), category, subcategory, amount (numeric 12,2), lineOrder (int)
cashflowItems:    id (uuid pk), periodId (fk→financialPeriods), category, amount (numeric 12,2), lineOrder (int)

-- Auth.js tables (managed by Drizzle adapter):
accounts, sessions, verificationTokens
```

**Key design decisions:**
- All money fields: `numeric(12,2)` — never floating point
- No period type enum — inferred from date range (~30d=monthly, ~90d=quarterly, ~365d=annual)
- `fiscalYearStartMonth` on companies enables deterministic fiscal quarter/year calculation
- Quarterly and annual views are aggregated from stored monthly data at query time

---

## 5. Task Breakdown

### Phase 1: Database + Auth + Portal Shell

#### Task 1.1: Route Group Migration
**Files to create:** `src/app/(public)/layout.tsx`
**Files to modify:** `src/app/layout.tsx`; move all existing pages/dirs under `src/app/` into `src/app/(public)/`
**Work:**
- Create `src/app/(public)/` directory
- Move all existing page files and directories (page.tsx, about/, contact/, services/, service-areas/, insights/, privacy/, terms/, not-found.tsx, sitemap.ts, robots.ts, api/contact/) into `src/app/(public)/`
- Create `src/app/(public)/layout.tsx` containing Header, Footer, StickyCTA, Analytics, and marketing Metadata extracted from the current root layout
- Simplify `src/app/layout.tsx` to only contain html, body, font loading, globals.css import

**Success criteria:**
- All existing marketing URLs (`/`, `/about`, `/contact`, `/services`, `/services/[slug]`, `/service-areas`, `/service-areas/[slug]`, `/insights`, `/insights/[slug]`, `/privacy`, `/terms`) return the same content as before
- `pnpm build` succeeds with no errors
- No visual or functional regression on any marketing page

---

#### Task 1.2: Install Dependencies + Drizzle Config
**Files to create:** `drizzle.config.ts`
**Files to modify:** `package.json`
**Work:**
- Install packages: `pnpm add next-auth@5 @auth/drizzle-adapter drizzle-orm postgres recharts xlsx` and `pnpm add -D drizzle-kit`
- Create `drizzle.config.ts` at project root pointing to `src/lib/db/schema.ts`, dialect `postgresql`, using `DATABASE_URL`
- Add scripts to package.json: `db:push`, `db:generate`, `db:migrate`, `db:seed`, `db:studio`

**Success criteria:**
- `pnpm drizzle-kit --version` runs successfully
- `drizzle.config.ts` is valid (no syntax errors)
- All new scripts are in package.json

---

#### Task 1.3: Database Schema
**Files to create:** `src/lib/db/schema.ts`, `src/lib/db/index.ts`
**Work:**
- Create Drizzle schema with all tables: users, companies (with fiscalYearStartMonth), companyAccess, financialPeriods, pnlLineItems, cashflowItems, plus Auth.js tables (accounts, sessions, verificationTokens)
- Create database connection singleton in index.ts using postgres driver
- Use pgEnum for user roles (admin, client)
- Use uuid primary keys, numeric(12,2) for money, proper foreign keys and unique constraints

**Success criteria:**
- `pnpm db:push` applies schema to a running Postgres instance without errors
- All tables created with correct columns, types, and constraints
- Database connection works (can query empty tables)

---

#### Task 1.4: Period Utilities
**Files to create:** `src/lib/import/period-utils.ts`
**Work:**
- `inferPeriodType(startDate, endDate)` — returns 'weekly' | 'monthly' | 'quarterly' | 'annual' based on day count
- `getFiscalQuarter(date, fiscalYearStartMonth)` — returns quarter number (1-4)
- `getFiscalYear(date, fiscalYearStartMonth)` — returns fiscal year number
- `getQuarterDateRange(fiscalYear, quarter, fiscalYearStartMonth)` — returns {start, end} dates

**Success criteria:**
- `inferPeriodType(new Date('2024-01-01'), new Date('2024-01-31'))` returns 'monthly'
- `inferPeriodType(new Date('2024-01-01'), new Date('2024-03-31'))` returns 'quarterly'
- `getFiscalQuarter(new Date('2024-04-15'), 4)` returns 1 (April is Q1 when fiscal year starts in April)
- `getFiscalYear(new Date('2024-02-15'), 4)` returns 2024 (Feb is still FY2024 when FY starts April)
- All edge cases handled: leap years, month boundaries

---

#### Task 1.5: Auth Configuration
**Files to create:** `src/lib/auth.ts`, `src/lib/email/magic-link.ts`
**Work:**
- Configure Auth.js v5 with EmailProvider for magic links
- Custom `sendVerificationRequest` that calls SendGrid to send branded magic link email
- Drizzle adapter for user/session/token storage
- Database session strategy (required for email provider)
- Extend session types to include role, userId
- signIn callback: reject sign-in if email not in users table (invite-only)
- session callback: attach role and userId to session

**Success criteria:**
- Auth.js configuration exports `auth`, `signIn`, `signOut`, `handlers`
- Magic link email function sends via SendGrid with BlueCrest branding
- Unknown emails are rejected at sign-in (no self-registration)
- Session includes `user.role` and `user.id`

---

#### Task 1.6: Middleware
**Files to create:** `src/middleware.ts`
**Work:**
- Protect all `/portal/*` routes except `/portal/login` and Auth.js callback routes
- Redirect unauthenticated users to `/portal/login`
- Block `/portal/admin/*` for non-admin roles (redirect to `/portal/dashboard`)
- Configure matcher: `['/portal/:path*']`

**Success criteria:**
- Unauthenticated request to `/portal/dashboard` redirects to `/portal/login`
- Authenticated client user accessing `/portal/admin` redirects to `/portal/dashboard`
- Authenticated admin can access `/portal/admin`
- `/portal/login` is accessible without auth
- Marketing pages are not affected by middleware

---

#### Task 1.7: Portal Layout
**Files to create:** `src/app/(portal)/portal/layout.tsx`
**Files to modify:** `src/app/layout.tsx` (add SessionProvider wrapper)
**Work:**
- Add SessionProvider to root layout (wraps both public and portal)
- Create portal layout with sidebar navigation: BlueCrest logo, Dashboard link, Admin section (Companies, Users, Import — admin only), user info display, sign out button
- Server component reading session via `auth()`
- Brand navy (#3e5a81) sidebar background, white content area
- Responsive: sidebar collapses on mobile

**Success criteria:**
- Portal pages render with sidebar + content area layout
- Admin sees all nav links; client sees only Dashboard
- Sign out button works (clears session, redirects to login)
- Sidebar uses brand colors from CSS variables
- Marketing pages still use their own layout (Header/Footer)

---

#### Task 1.8: Login Page
**Files to create:** `src/app/(portal)/portal/login/layout.tsx`, `src/app/(portal)/portal/login/page.tsx`
**Work:**
- Login layout: simple centered card (no sidebar), BlueCrest logo
- Login page: "use client", email input, "Send Magic Link" button
- Calls `signIn("email", { email, callbackUrl: "/portal/dashboard" })`
- Success state: "Check your email for a login link"
- Error state for rejected emails
- Style matching existing ContactForm.tsx patterns (rounded-xl, focus:ring-2, brand colors)

**Success criteria:**
- Login page renders at `/portal/login` with centered card layout (no sidebar)
- Entering a valid (existing) email sends a magic link via SendGrid
- Entering an unknown email shows an error message
- Clicking the magic link in email logs user in and redirects to dashboard
- Form styling matches existing site forms

---

#### Task 1.9: Dashboard Page
**Files to create:** `src/app/(portal)/portal/dashboard/page.tsx`
**Work:**
- Server component, reads session
- Admin view: list all companies with summary info
- Client view: list only assigned companies
- Company cards link to `/portal/companies/[id]`
- Empty state: "No companies assigned" / "No companies yet"

**Success criteria:**
- Admin sees all companies
- Client user sees only companies they have access to via companyAccess
- Company cards display name, industry
- Empty state renders appropriately
- Clicking a company card navigates to its detail page

---

#### Task 1.10: Database Seed Script
**Files to create:** `src/lib/db/seed.ts`
**Work:**
- Script to insert initial admin user with a BlueCrest email address
- Sets role to 'admin', emailVerified to current timestamp
- Run via `pnpm db:seed`

**Success criteria:**
- Running `pnpm db:seed` creates an admin user in the database
- Running it twice doesn't create duplicates (upsert or check existence)
- Admin user can receive magic link and log in

---

#### Task 1.11: Config Updates
**Files to modify:** `next.config.ts`, `Dockerfile`
**Work:**
- next.config.ts: add `serverExternalPackages: ['postgres']` if needed for standalone build
- Dockerfile: add `DATABASE_URL` and `AUTH_SECRET` as build-time secret mounts in the build stage; ensure runtime env vars are passed

**Success criteria:**
- `pnpm build` succeeds with standalone output
- Docker build completes with secret mounts
- Application connects to Postgres at runtime

---

### Phase 2: Admin Pages

#### Task 2.1: Shared Database Queries
**Files to create:** `src/lib/db/queries.ts`
**Work:**
- `getUserCompanies(userId)` — companies a user can access (all for admin)
- `getCompanyUsers(companyId)` — users with access to a company
- `getAllUsers()`, `getAllCompanies()`
- `getCompanyById(id)`, `getUserByEmail(email)`

**Success criteria:**
- All query functions return correctly typed data
- `getUserCompanies` returns all companies for admin role, only accessible ones for client role
- Queries use proper Drizzle joins and filters

---

#### Task 2.2: Admin Dashboard
**Files to create:** `src/app/(portal)/portal/admin/page.tsx`
**Work:**
- Server component
- Summary cards: total companies count, total users count, recent imports count
- Quick links to Companies, Users, Import sub-pages

**Success criteria:**
- Page renders at `/portal/admin` for admin users
- Counts reflect actual database state
- Links navigate to correct sub-pages
- Client users cannot access (middleware blocks)

---

#### Task 2.3: Company Management
**Files to create:** `src/app/(portal)/portal/admin/companies/page.tsx`, `src/app/(portal)/portal/admin/companies/actions.ts`, `src/components/portal/CompanyForm.tsx`
**Work:**
- Companies list page: table with name, industry, user count, last import date, edit/delete actions
- "Add Company" button opens form
- CompanyForm: name, industry, description, fiscal year start month (dropdown January-December, default January)
- Server Actions: createCompany, updateCompany, deleteCompany — all verify admin role
- Form uses "use client" with React 19 useActionState for pending/error states

**Success criteria:**
- Admin can create a company with all fields including fiscal year start month
- Company appears in list table after creation
- Admin can edit company details
- Admin can delete a company
- Fiscal year start month dropdown shows all 12 months
- Non-admin requests to server actions are rejected

---

#### Task 2.4: User Management + Invite
**Files to create:** `src/app/(portal)/portal/admin/users/page.tsx`, `src/app/(portal)/portal/admin/users/actions.ts`, `src/components/portal/InviteUserForm.tsx`
**Work:**
- Users list page: table with name, email, role, assigned companies, last login
- "Invite User" button opens form
- InviteUserForm: name, email, role (admin/client dropdown), company multi-select checkboxes
- Server Actions: inviteUser (creates user + companyAccess + sends magic link), updateUser, removeUser
- inviteUser sends magic link email as the invite

**Success criteria:**
- Admin can invite a new user with name, email, role, and company assignments
- Invited user receives magic link email
- Invited user appears in the users table
- Admin can edit user details and role
- Admin can remove a user
- Company access is created for selected companies

---

#### Task 2.5: Company Access Management
**Files to create:** `src/app/(portal)/portal/admin/companies/[id]/page.tsx`, `src/app/(portal)/portal/admin/companies/[id]/actions.ts`
**Work:**
- Company detail page: company info, list of users with access, "Add User" and "Remove" controls
- Link to import page pre-filtered for this company
- Server Actions: grantAccess(userId, companyId), revokeAccess(userId, companyId)

**Success criteria:**
- Admin sees company details and all users with access
- Admin can grant access to an existing user
- Admin can revoke access from a user
- Revoking access immediately removes the company from that user's dashboard
- Non-admin users cannot access this page

---

### Phase 3: CSV Import + Data Storage

#### Task 3.1: QBO Parser
**Files to create:** `src/lib/import/qbo-parser.ts`
**Work:**
- Parse QBO P&L Excel/CSV exports using xlsx library
- Skip header rows (detect company name, report title, date range by pattern)
- Identify category hierarchy (Income, COGS, Expenses, Other Income/Expense)
- Parse amounts: handle QBO formatting (parentheses for negatives, commas, blank = 0)
- Assign lineOrder for display ordering
- Return typed ParsedPnlData: items array + metadata

**Success criteria:**
- Parses a standard QBO P&L Excel export correctly
- Handles negative amounts in parentheses format
- Correctly identifies category/subcategory hierarchy
- Returns metadata (report title, date range, company name)
- Handles blank cells as zero
- lineOrder preserves the original row ordering

---

#### Task 3.2: Import Validators
**Files to create:** `src/lib/import/validators.ts`
**Work:**
- `checkDuplicatePeriod(companyId, periodStart, periodEnd)` — queries DB for overlapping periods
- `validateAmounts(items)` — ensures all amounts are valid numbers
- `collectWarnings(items)` — identifies rows that couldn't be fully parsed

**Success criteria:**
- Duplicate period detected when date ranges overlap for same company
- Invalid amounts flagged
- Warnings collected but don't block import (informational)

---

#### Task 3.3: Import UI
**Files to create:** `src/app/(portal)/portal/admin/import/page.tsx`, `src/app/(portal)/portal/admin/import/actions.ts`, `src/components/portal/ImportUpload.tsx`, `src/components/portal/ImportPreview.tsx`
**Work:**
- Import page: server component, fetches all companies for dropdown
- ImportUpload: "use client", file input (.csv/.xlsx/.xls), company dropdown, period start/end dates, client-side parse preview, inferred period type badge
- ImportPreview: "use client", shows parsed data table, highlights warnings, confirm/cancel
- Server Action: importFinancialData — re-parses server-side, validates, transaction inserts financialPeriod + pnlLineItems

**Success criteria:**
- Admin can select a company and upload a QBO export file
- File is parsed client-side and preview table appears
- Inferred period type (monthly/quarterly/annual) shown as badge
- Confirm triggers server-side re-parse and database insert
- Duplicate period shows error and blocks import
- Data appears in database after successful import
- Client users cannot access the import page

---

### Phase 4: Client Dashboards

#### Task 4.1: Access Enforcement Helper
**Files to create:** `src/lib/portal/access.ts`
**Work:**
- `verifyCompanyAccess(companyId)` — reads session, checks role (admin=all), checks companyAccess table, calls notFound() if no access

**Success criteria:**
- Admin can access any company
- Client user can access companies in their companyAccess records
- Client user gets 404 for companies not in their access list
- Unauthenticated requests are handled (redirect to login)

---

#### Task 4.2: Dashboard Queries
**Files to modify:** `src/lib/db/queries.ts`
**Work:**
- `getCompanyPeriods(companyId)` — all uploaded periods ordered by date
- `getCompanySummary(companyId)` — latest period totals (revenue, expenses, net income)
- `getPnlForPeriod(periodId)` — full P&L line items for a single period
- `getAggregatedPnl(companyId, startDate, endDate)` — sum line items by category across periods in range (for quarterly/annual)
- `getPnlComparison(companyId, periodId)` — current vs prior period of same inferred type
- `getPnlTrend(companyId, periodType, count)` — last N periods for charting

**Success criteria:**
- All queries return correctly typed, sorted data
- Aggregated P&L correctly sums line items matching by category/subcategory
- Comparison correctly finds the prior period of the same inferred type
- Trend returns the requested number of periods in chronological order

---

#### Task 4.3: Company Overview Page
**Files to create:** `src/app/(portal)/portal/companies/[id]/page.tsx`
**Work:**
- Server component, calls verifyCompanyAccess
- Company header (name, industry)
- Summary cards: Revenue, Expenses, Net Income, Cash Flow (latest period)
- Trend chart: revenue vs expenses (last 6 periods)
- View tabs: Monthly | Quarterly | Annual
- Quarterly/annual computed from monthly data using fiscal year config
- Links to P&L detail and cashflow detail

**Success criteria:**
- Page renders with correct company data
- Summary cards show latest period figures formatted as currency
- Trend chart displays last 6 periods with correct data
- View tabs switch between monthly/quarterly/annual aggregations
- Quarterly/annual correctly use company's fiscalYearStartMonth
- Unauthorized access returns 404

---

#### Task 4.4: Summary Card Component
**Files to create:** `src/components/portal/SummaryCard.tsx`
**Work:**
- Metric label, formatted currency value using Intl.NumberFormat
- Trend indicator: up/down arrow with percentage change from prior period
- Uses brand colors: positive in blue, negative in coral

**Success criteria:**
- Displays currency value formatted as USD
- Shows trend arrow and percentage when comparison data provided
- Positive changes shown in brand blue, negative in coral
- Renders correctly with missing comparison data (no trend shown)

---

#### Task 4.5: P&L Detail Page
**Files to create:** `src/app/(portal)/portal/companies/[id]/pnl/page.tsx`
**Work:**
- Server component, verifies access
- View selector (monthly/quarterly/annual) via searchParams
- Period selector (specific period) via searchParams
- Full P&L table with category hierarchy
- Comparison column: prior period of same type
- Variance column: dollar change + percentage change
- Revenue vs expenses bar chart over time

**Success criteria:**
- P&L table renders with correct category hierarchy and indentation
- Subtotals calculated correctly (Income total, Expense total, Net Income)
- Switching between monthly/quarterly/annual updates the table
- Comparison column shows prior period data
- Variance calculates correctly (current - prior, percentage)
- Bar chart renders with correct data for selected view type
- Negative amounts displayed in coral

---

#### Task 4.6: P&L Table Component
**Files to create:** `src/components/portal/PnlTable.tsx`
**Work:**
- HTML table with indented subcategories, bold category headers
- Alternating row backgrounds
- Right-aligned numbers formatted as currency
- Negative amounts in brand coral (#d66c4c)
- Subtotal rows for each category

**Success criteria:**
- Categories rendered as bold headers
- Subcategories indented under their parent category
- Amounts right-aligned and formatted as USD
- Negative amounts colored in coral
- Alternating row backgrounds for readability
- Subtotal rows rendered at bottom of each category

---

#### Task 4.7: Cashflow Detail Page
**Files to create:** `src/app/(portal)/portal/companies/[id]/cashflow/page.tsx`, `src/components/portal/CashflowTable.tsx`
**Work:**
- Same structure as P&L detail but for cashflow categories
- Area chart showing cashflow trend
- CashflowTable component following PnlTable patterns

**Success criteria:**
- Cashflow table renders with correct categories and amounts
- Area chart shows trend over time
- View switching (monthly/quarterly/annual) works
- Styling consistent with P&L table

---

#### Task 4.8: Period Selector Component
**Files to create:** `src/components/portal/PeriodSelector.tsx`
**Work:**
- "use client" component
- View toggle: Monthly | Quarterly | Annual
- Period dropdown: lists available periods for selected view type
- Quarterly/annual options derived from fiscal year config
- Updates URL searchParams via useRouter + useSearchParams

**Success criteria:**
- Toggle switches between Monthly/Quarterly/Annual views
- Dropdown shows available periods for selected view
- Selecting a period updates URL searchParams
- Page re-renders with correct data for selected period
- Quarterly periods labeled with fiscal quarter (Q1, Q2, etc.)

---

#### Task 4.9: Chart Components
**Files to create:** `src/components/portal/charts/RevenueExpenseChart.tsx`, `src/components/portal/charts/CashflowChart.tsx`, `src/components/portal/charts/NetIncomeChart.tsx`
**Work:**
- RevenueExpenseChart: Recharts BarChart, revenue in brand blue (#579cc6), expenses in coral (#d66c4c)
- CashflowChart: Recharts AreaChart, brand blue fill with low opacity
- NetIncomeChart: Recharts LineChart, gold (#d69c50) for positive, coral for negative
- All "use client" components with responsive containers

**Success criteria:**
- Charts render with correct data and brand colors
- Charts are responsive (resize with container)
- Tooltips show formatted currency values on hover
- Charts handle empty data gracefully (show "No data" message)
- Legend labels are clear

---

#### Task 4.10: Build Verification
**Work:**
- Run `pnpm build` to verify complete application compiles
- Verify Docker build works with updated Dockerfile
- Test all marketing pages still work
- Test full portal flow: login → dashboard → company → P&L → cashflow

**Success criteria:**
- `pnpm build` succeeds with zero errors
- Docker build completes successfully
- All marketing URLs return correct content (no regression)
- Admin can: log in, create company, invite user, upload data, view dashboards
- Client can: receive magic link, log in, see assigned company, view P&L, view cashflow
- Unauthorized access properly blocked at every level

---

## 6. File Tree (new files)

```
drizzle.config.ts
src/
  middleware.ts
  lib/
    auth.ts
    db/
      index.ts
      schema.ts
      queries.ts
      seed.ts
    email/
      magic-link.ts
    import/
      qbo-parser.ts
      validators.ts
      period-utils.ts
    portal/
      access.ts
  app/
    (public)/
      layout.tsx
      [all existing pages moved here]
    (portal)/
      portal/
        layout.tsx
        login/
          layout.tsx
          page.tsx
        dashboard/
          page.tsx
        companies/
          [id]/
            page.tsx
            pnl/
              page.tsx
            cashflow/
              page.tsx
        admin/
          page.tsx
          companies/
            page.tsx
            actions.ts
            [id]/
              page.tsx
              actions.ts
          users/
            page.tsx
            actions.ts
          import/
            page.tsx
            actions.ts
  components/
    portal/
      CompanyForm.tsx
      InviteUserForm.tsx
      ImportUpload.tsx
      ImportPreview.tsx
      SummaryCard.tsx
      PnlTable.tsx
      CashflowTable.tsx
      PeriodSelector.tsx
      charts/
        RevenueExpenseChart.tsx
        CashflowChart.tsx
        NetIncomeChart.tsx
```

## 7. Files Modified

- `src/app/layout.tsx` — extract marketing layout into (public) route group, add SessionProvider
- `next.config.ts` — add serverExternalPackages if needed
- `Dockerfile` — add DATABASE_URL + AUTH_SECRET build secrets
- `package.json` — add db:push, db:generate, db:migrate, db:seed, db:studio scripts

## 8. Conventions

- Pure Tailwind CSS with CSS variables from `globals.css` (`--color-brand-blue`, `--color-brand-gold`, `--color-brand-navy`, `--color-brand-coral`)
- Server components by default; `"use client"` only for interactive elements
- TypeScript interfaces for all data structures
- Form styling matches `src/components/ContactForm.tsx`: `rounded-xl`, `focus:ring-2`, brand color focus rings
- Buttons use existing `.btn-primary`, `.btn-secondary`, `.btn-navy` classes from globals.css
- Cards use `.card` class pattern (rounded-3xl, shadow-soft)
- Currency formatting: `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`
- Financial amounts: `numeric(12,2)` in Postgres, never JavaScript floating point
- Magic link emails: branded via SendGrid, matching BlueCrest visual style
