import type { Testimonial } from "@/data/testimonials";

/**
 * Service page copy, approved in BlueCrest_Website_Content.docx (Oct 13, 2026).
 * Every page follows the standard layout (Developer Update List item 19):
 * intro, What's Included, How It Works, optional cards, Why Choose, optional pricing, FAQ.
 */
export interface ServiceContent {
  /** One paragraph under the H1. */
  intro: string;
  whatsIncluded: { heading: string; bullets: string[] };
  /** Sections absorbed from merged pages, shown right after What's Included. */
  extraSections?: { heading: string; text?: string; bullets?: string[] }[];
  /** Four steps, one sentence each. */
  process: { heading: string; steps: { heading: string; content: string }[] };
  /** "Who It's For" cards, kept only where they add something unique. */
  cards?: { heading: string; items: { heading: string; content: string }[] };
  whyChoose: { heading: string; paragraphs: string[]; testimonial?: Testimonial["id"] };
  /** Omitted where partners set pricing or scope varies too much. */
  pricing?: { heading: string; intro: string; factors: { heading: string; content: string }[] };
  /** Plain page content: no FAQPage markup. Always includes a cost question. */
  faq: { heading: string; items: { question: string; answer: string }[] };
}

/** Closes every pricing section (item 18). */
export const PRICING_CLOSING_LINE = "Additional client-specific factors may also affect pricing.";

const FOUR_FACTORS = "Pricing depends on four main factors.";

export const serviceContent: Record<string, ServiceContent> = {
  "fractional-controller-services": {
    intro: "A fractional controller gives your business senior-level oversight of its accounting operations without the cost of a full-time hire. Your bookkeeper handles day-to-day transactions. We make sure the books are accurate, processes are efficient, internal controls are in place, and your financial statements are reliable enough to support confident decisions.",
    whatsIncluded: {
      heading: "What Our Fractional Controller Services Include",
      bullets: [
        "Month-end close management for timely, accurate financial statements",
        "Balance sheet reconciliation review and approval",
        "GAAP financial statement preparation",
        "Internal controls assessment and improvement",
        "Bookkeeper oversight and quality review",
        "Accounting policies and procedures documentation",
        "Audit preparation and auditor coordination",
        "Cash flow monitoring and working capital management",
        "Management reporting and variance analysis",
        "Accounting system and process improvements",
      ],
    },
    process: {
      heading: "How Our Fractional Controller Engagement Works",
      steps: [
        { heading: "Current State Assessment", content: "We evaluate your accounting processes, systems, staff, recent financial statements, and internal controls to find where accuracy or efficiency can improve." },
        { heading: "Process Optimization", content: "We tighten your month-end close, reconciliation procedures, and reporting workflows, with clear timelines and responsibilities." },
        { heading: "Ongoing Oversight", content: "We review transactions, approve reconciliations, and work with your bookkeeper or accounting staff to keep the books accurate." },
        { heading: "Reporting and Communication", content: "We deliver monthly financial statements and management reports, and meet with you regularly to review results and trends." },
      ],
    },
    cards: {
      heading: "Businesses That Benefit From Fractional Controller Services",
      items: [
        { heading: "Growing Small Businesses", content: "Companies whose transaction volume and reporting needs have outgrown what a bookkeeper alone can handle." },
        { heading: "Businesses Preparing for Audit", content: "Companies facing a first audit or improving audit readiness, with records and documentation that meet auditor standards." },
        { heading: "Businesses With an Existing Bookkeeper", content: "Keep your current bookkeeper, in-house or outsourced. We add the review, reconciliations, and close discipline that turn their work into reliable, decision-ready financial statements." },
        { heading: "Seasonal Businesses", content: "Businesses with peak seasons that need experienced oversight when volume spikes, without a year-round controller." },
        { heading: "Multi-Location and Multi-Entity Businesses", content: "Companies operating several locations or entities that need consistent accounting, intercompany tracking, and consolidated reporting." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Fractional Controller Services",
      paragraphs: [
        "Most growing businesses don't need another bookkeeper. They need someone senior making sure the numbers are right. That's what we deliver. With more than 15 years in accounting, internal controls, and financial reporting, we've managed everything from single-location businesses to a 17-entity real estate portfolio, so we know how to bring structure to whatever you're running.",
        "We work in the system you already use, keep your current bookkeeper in place, and scale our involvement to what you need: hands-on during a cleanup or transition, lighter oversight once things run smoothly. And when you're ready for forecasting, budgeting, and strategic planning, CFO-level support is already in place, from a firm that already knows your numbers.",
      ],
      testimonial: "chris-gormley",
    },
    pricing: {
      heading: "Factors That Influence Fractional Controller Pricing",
      intro: FOUR_FACTORS,
      factors: [
        { heading: "Transaction Volume", content: "More monthly transactions mean more review time and controller involvement." },
        { heading: "Accounting Complexity", content: "Multiple entities, complex revenue recognition, or specialized accounting requirements call for more involved support." },
        { heading: "Current State of Records", content: "Books that need cleanup or major process improvements require more intensive work up front." },
        { heading: "Reporting Requirements", content: "More detailed or frequent reporting for management, investors, or lenders expands the scope." },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Fractional Controller Services",
      items: [
        { question: "What is the difference between a bookkeeper and a controller?", answer: "A bookkeeper records daily transactions and basic reconciliations. A controller oversees that work, manages the close, prepares financial statements, and implements internal controls: the quality assurance layer for your books." },
        { question: "How often will a fractional controller review our books?", answer: "Typically weekly or biweekly reviews of key accounts, plus a full monthly close. Frequency depends on your transaction volume and complexity." },
        { question: "How much does a fractional controller cost?", answer: "Cost depends on your transaction volume, complexity, and reporting needs. After a free 15-minute consultation, we provide a proposal priced to the support you need." },
        { question: "What accounting systems do you work with?", answer: "QuickBooks, Xero, NetSuite, Yardi, and other platforms. If you're considering a system change, we can evaluate options and manage the transition." },
        { question: "How quickly can you identify problems in our books?", answer: "Our initial assessment identifies accuracy, completeness, and process issues, and we deliver a prioritized plan that addresses the most critical problems first." },
        { question: "Do we need both a fractional controller and a fractional CFO?", answer: "It depends. A controller ensures accurate accounting and reporting; a CFO provides strategic financial leadership. Many businesses start with controller services and add CFO support as they grow." },
      ],
    },
  },

  "bookkeeping-and-reconciliation": {
    intro: "Accurate books are the foundation of every good business decision. We review and tailor your chart of accounts to fit your business, then record, categorize, and reconcile every transaction so you always know where your business stands, whether you need ongoing monthly bookkeeping or a cleanup of past months and historical records.",
    whatsIncluded: {
      heading: "What Our Bookkeeping and Reconciliation Services Include",
      bullets: [
        "Chart of accounts review and setup tailored to your business",
        "Regular transaction recording from bank feeds, credit cards, and other sources",
        "Expense categorization aligned with your chart of accounts",
        "Bill entry and payment tracking",
        "Invoice recording and receivables aging",
        "Monthly bank reconciliations",
        "Credit card reconciliations for every business card",
        "Payroll entries reconciled with your payroll provider",
        "Sales tax tracking and filing preparation",
        "Month-end procedures that prepare your books for review",
        "Cleanup of backlogged or historical books",
      ],
    },
    extraSections: [
      {
        heading: "What You Receive Each Month",
        bullets: [
          "Balance sheet, income statement, and cash flow statement",
          "Reconciliation summary for every bank and credit card account",
          "General ledger detail report",
          "Accounts receivable and accounts payable aging reports",
          "A monthly review meeting to walk through results",
        ],
      },
      {
        heading: "Accounts Payable and Receivable Services",
        text: "Streamlined vendor bill processing, payment runs, customer invoicing, and collections follow-up, with cash flow optimization to improve working capital. We keep your vendors paid on time, bring cash in faster, and show you exactly what's owed in both directions.",
      },
    ],
    process: {
      heading: "How Our Bookkeeping Process Works",
      steps: [
        { heading: "System Setup and Integration", content: "We connect your bank and credit card accounts for automated imports and configure your chart of accounts to match your reporting needs." },
        { heading: "Transaction Processing", content: "We review and categorize transactions on a regular schedule, apply consistent coding rules, and keep supporting documentation organized." },
        { heading: "Reconciliation", content: "We reconcile every bank and credit card account to its statement each month, resolve discrepancies, and flag anything that needs your attention." },
        { heading: "Monthly Reporting", content: "We deliver your profit and loss, balance sheet, and cash flow statement on a set schedule after each month closes." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Bookkeeping and Reconciliation Services",
      paragraphs: [
        "We build books you can run your business on, not just a record of transactions, and we treat your business like it matters. You work directly with experienced professionals, not a rotating cast of junior staff or an offshore team, so you always know who to call. We answer questions in plain language, respond quickly, and take the time to understand how your business actually runs.",
        "We're invested in the long-term success of every business we work with, whether we meet in person or work entirely remotely. And as you grow, the same people who know your books can step in with controller and CFO-level support, so you never have to start over with someone new.",
      ],
      testimonial: "michael-royer",
    },
    pricing: {
      heading: "Factors That Affect Bookkeeping Service Pricing",
      intro: FOUR_FACTORS,
      factors: [
        { heading: "Transaction Volume", content: "More monthly transactions mean more time to record, categorize, and reconcile." },
        { heading: "Number of Accounts", content: "Multiple bank accounts, credit cards, or entities add reconciliation work each month." },
        { heading: "Industry Complexity", content: "Specialized requirements, such as inventory tracking or unique transaction types, call for additional attention." },
        { heading: "Catch-Up Work", content: "Books that are behind or need cleanup require more intensive work up front." },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Bookkeeping and Reconciliation",
      items: [
        { question: "How often should books be reconciled?", answer: "At least monthly for every bank and credit card account. High-volume businesses benefit from weekly reconciliation of key accounts. We set a schedule that fits your activity level." },
        { question: "What accounting software do you use?", answer: "QuickBooks, Xero, NetSuite, Yardi, and other platforms. We can recommend the best fit and handle any migration." },
        { question: "How far behind can my books be for you to help?", answer: "We catch up months or even years of backlogged books, including a two-year cleanup across three restaurant locations. Timing depends on the volume of work and the records available." },
        { question: "What information do you need access to?", answer: "Read-only access to your bank and credit card accounts for transaction feeds, plus access to your accounting software. Sensitive information is shared through secure methods." },
        { question: "How much does bookkeeping cost?", answer: "Cost depends on your transaction volume, number of accounts, and complexity. After a free 15-minute consultation, we provide a proposal priced to the support you need." },
        { question: "Can you work with our existing accountant or CPA?", answer: "Yes. We deliver clean, organized books that make tax preparation easier and coordinate directly with your CPA during tax season and audits." },
      ],
    },
  },

  "payroll-and-hr-services": {
    intro: "We set up and run payroll and core HR processes across one or multiple locations through our payroll partners, so your team is paid accurately, your HR processes run smoothly, and every payroll is recorded correctly in your books.",
    whatsIncluded: {
      heading: "What Our Payroll and HR Services Include",
      bullets: [
        "Payroll processing for hourly, salary, and commission pay",
        "Direct deposit setup and management",
        "Federal, state, and local withholding, deposits, and filings through our payroll partners",
        "W-2 and 1099 preparation and distribution through our payroll partners",
        "Benefits setup and deduction management",
        "Time and attendance system setup, integrated with payroll",
        "HR process setup and monitoring, including onboarding, offboarding, and employee records",
        "Paid time off tracking and accruals",
        "Workers' compensation reporting support",
        "Payroll register and summary reporting",
        "Labor cost tracking by location or department",
        "Payroll entries recorded to your general ledger",
      ],
    },
    process: {
      heading: "How Our Payroll and HR Services Work",
      steps: [
        { heading: "Setup and Configuration", content: "We set up payroll, benefits, time and attendance, and HR processes on our partner platform, including employee data, pay rates, deductions, and tax jurisdictions." },
        { heading: "Time and Pay Collection", content: "Each pay period, hours, commissions, bonuses, and other variable pay flow in from your time system or are collected in whatever format works for you." },
        { heading: "Processing and Review", content: "We process and review every payroll for accuracy, and you approve a preview before funds are released." },
        { heading: "Payment, Filing, and Recording", content: "Employees are paid on schedule, tax deposits and filings are completed through our payroll partners, and every payroll is recorded to your general ledger." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Payroll and HR Services",
      paragraphs: [
        "Most payroll services stop at the paycheck. We connect payroll to the rest of your finances, so every payroll lands correctly in your books and you can see exactly what labor costs by location, department, or job. You work directly with experienced professionals who know your business, not a call center, with one point of contact for payroll, HR, and accounting questions.",
        "Payroll runs through established partner platforms for reliable processing and tax filing, and we review every payroll before it goes out. As your team grows, your payroll, HR processes, and financial reporting grow with it, with one team handling all three.",
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Payroll and HR Services",
      items: [
        { question: "What is the deadline to submit payroll information?", answer: "Payroll information is due a set number of days before each pay date, based on your payroll platform's schedule. We build a submission calendar around your pay dates." },
        { question: "How do you handle payroll corrections?", answer: "Errors found after payroll runs are corrected in the next cycle, or through an off-cycle payment when urgent. We also find the root cause so it doesn't happen again." },
        { question: "Can you handle California-specific requirements?", answer: "Yes. Our partner platforms support California requirements such as sick leave accrual and overtime calculations, and we configure them for your business." },
        { question: "Do you integrate with time tracking systems?", answer: "Yes. We connect your time and attendance system to payroll so hours import directly, reducing manual entry and errors." },
        { question: "How much do payroll services cost?", answer: "Cost depends on your payroll platform and the level of HR and benefits support you need. After a free 15-minute consultation, we recommend the right setup and provide a proposal." },
        { question: "Can employees access their pay stubs online?", answer: "Yes. Employees can view pay stubs, W-2s, and tax documents through the payroll platform's secure employee portal." },
      ],
    },
  },

  "merchant-processing": {
    intro: "We provide merchant and credit card processing directly through our ISO partnership, including for high-risk industries such as cannabis, peptides, and iGaming. From underwriting and approval to reconciling deposits in your books and analyzing your sales data, we handle payments as part of your financial operations, not as a separate vendor.",
    whatsIncluded: {
      heading: "What Our Merchant and Credit Card Processing Services Include",
      bullets: [
        "Merchant account setup through our direct ISO partnership",
        "Credit and debit card processing for in-person and online sales",
        "High-risk merchant accounts, including cannabis, peptides, and iGaming",
        "Underwriting package preparation, including the financial statements and documentation processors require",
        "Processing statement review to identify excess fees",
        "Sales and processing data synced to your accounting software, with deposits and fees reconciled to your books",
        "Sales data analysis to track profit margins, evaluate pricing, and compare top-selling and slow-moving products",
        "CRM, point-of-sale, and online sales system setup and management",
      ],
    },
    process: {
      heading: "How Our Merchant Processing Services Work",
      steps: [
        { heading: "Application and Underwriting", content: "We review your business, prepare the financial statements and documentation underwriters require, and submit your application through our ISO partnership." },
        { heading: "Account and Systems Setup", content: "Once you're approved, we set up your merchant account and connect it to your CRM, point-of-sale, and online sales systems, and manage those systems as you grow." },
        { heading: "Accounting Integration", content: "We sync your sales and processing data to your accounting software so deposits and fees post automatically." },
        { heading: "Reconciliation and Analysis", content: "Each month, we reconcile deposits and fees to your books and analyze your sales data for margins, pricing, and product performance." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Merchant Processing Services",
      paragraphs: [
        "We work with you from the application forward, not just at signup. Because we prepare the financials underwriters review, businesses in high-risk industries start with a stronger application, and you have a direct contact through our ISO partnership instead of a call center.",
        "Your payment data doesn't stop at the deposit, either. Sales, fees, and deposits flow into your books, and we turn that data into insight on margins, pricing, and which products are driving your business.",
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Merchant and Credit Card Processing",
      items: [
        { question: "What makes a business high-risk for merchant processing?", answer: "Processors weigh industry, chargeback history, regulatory status, and sales model. Industries such as cannabis, peptides, and iGaming are commonly classified as high-risk." },
        { question: "How long does merchant account approval take?", answer: "Timing depends on the processor's underwriting review and how complete your application is. A complete underwriting package helps avoid delays." },
        { question: "What documents do I need to apply?", answer: "Typically business formation documents, owner identification, bank statements, recent processing statements, and financial statements. We prepare and organize the package for you." },
        { question: "Can I switch from my current processor?", answer: "Yes. We review your current processing statements and, if switching makes sense, set up the new account and manage the transition." },
        { question: "Will my processing data sync with my accounting software?", answer: "Yes. Sales, deposits, and fees sync to QuickBooks, Xero, NetSuite, and other platforms, and we reconcile them to your books each month." },
        { question: "How much does merchant processing cost?", answer: "Rates depend on your industry, sales volume, risk profile, and card mix. After a free 15-minute consultation, we review your business and provide a quote." },
      ],
    },
  },

  "accounting-system-setup": {
    intro: "The right accounting software, set up correctly, is the foundation for accurate books and reliable reporting. We select, set up, migrate, and automate your accounting and reporting software, including QuickBooks, Xero, NetSuite, and Yardi, whether you're starting fresh, outgrowing your current system, or fixing a setup that was never built right.",
    whatsIncluded: {
      heading: "What Our Software Setup and Migration Services Include",
      bullets: [
        "Platform selection based on your business requirements",
        "Chart of accounts design aligned with your reporting needs",
        "Job and cost codes, plus class, location, and department tracking",
        "Multi-entity configuration and consolidated reporting",
        "Historical data migration and imports from your previous system",
        "Bank, credit card, and payment processor integrations",
        "Customer, vendor, and product setup for accurate revenue tracking",
        "Automated transaction rules and bank feeds",
        "User roles and permissions",
        "Custom management, lender, and investor reports",
        "Training for your team",
      ],
    },
    process: {
      heading: "How Our Setup and Migration Process Works",
      steps: [
        { heading: "Requirements Analysis", content: "We learn your business processes, reporting needs, and integrations, which drives platform selection and configuration." },
        { heading: "System Design", content: "We design your chart of accounts, tracking dimensions, and workflows, and get your approval before building." },
        { heading: "Implementation", content: "We configure the system, set up integrations, and migrate historical data and opening balances, validating every balance against your old system." },
        { heading: "Testing and Training", content: "We test every process and integration before go-live, then train your team on daily use and reporting." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Software Setup and Migration Services",
      paragraphs: [
        "We're accountants first, not just software specialists, so your system is built around how your books, reporting, and close actually need to work, not just how the software comes out of the box. We've implemented complex systems, including a 17-entity real estate portfolio with full historical migration, and when your needs go beyond accounting software, we can deliver custom integrations and a full technology stack.",
        "And when the project ends, you're not left on your own. The same firm that built your system can keep your books, run your close, and provide controller or CFO support, so the system keeps working the way it was designed.",
      ],
      testimonial: "lu-miller",
    },
    faq: {
      heading: "Frequently Asked Questions About Accounting Software Setup and Migration",
      items: [
        { question: "Which accounting software do you recommend?", answer: "It depends on your needs. QuickBooks Online fits most small businesses, while companies with inventory, multiple entities, or more complex operations may need NetSuite or Sage, or an industry-specific platform such as Yardi. We help you choose the right fit." },
        { question: "How long does a typical implementation take?", answer: "Timelines depend on the platform, the volume of historical data, and the integrations involved. We provide a timeline estimate during scoping." },
        { question: "Will we lose historical data in a migration?", answer: "No. We migrate the history you need and validate it against your old system. We recommend keeping read-only access to the old system for reference." },
        { question: "How do you handle the transition period?", answer: "We run systems in parallel briefly to validate accuracy and time the cutover to a month-end when practical, so operations continue without disruption." },
        { question: "Which software implementations and migrations do you handle?", answer: "Accounting migrations such as QuickBooks Desktop to QuickBooks Online and QuickBooks to NetSuite or Sage, industry-specific platforms such as Yardi, and the business software that connects to your books, including inventory management, CRM, point-of-sale, e-commerce, payroll, and expense management systems." },
        { question: "How much does accounting software setup cost?", answer: "Cost depends on the platform, data migration, integrations, and customization. After a free 15-minute consultation, we scope the project and provide a proposal." },
      ],
    },
  },

  "startup-business-services": {
    intro: "The decisions you make in your first year shape how easily your company can grow and stay compliant. We handle the setup, from state registration, formation documents, and entity structure to your accounting system, chart of accounts, payroll, and sales tax registrations, so your business is ready to operate from day one.",
    whatsIncluded: {
      heading: "What Our Startup Accounting and Finance Services Include",
      bullets: [
        "State registration and business formation documents",
        "Entity structure selection and setup",
        "Accounting system setup and chart of accounts design",
        "Bank and credit card connections to your accounting system",
        "Merchant processing setup through our ISO partnership",
        "Payroll setup for your first employees through our payroll partners",
        "Sales tax registration where required",
        "Software and tool selection for your business",
        "Recordkeeping and document organization systems",
      ],
    },
    process: {
      heading: "How Our Startup Services Work",
      steps: [
        { heading: "Formation and Registration", content: "We register your business with the state, prepare your formation documents, and set up the entity structure that fits your goals." },
        { heading: "Accounting Setup", content: "We set up your accounting system and chart of accounts and connect your bank and credit card accounts." },
        { heading: "Payroll, Sales Tax, and Payments", content: "We set up payroll through our payroll partners, register for sales tax where required, and set up merchant processing through our ISO partnership." },
        { heading: "Ready to Operate", content: "Once setup is complete, your business is ready to run, and we can continue with bookkeeping and other ongoing services when you need them." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Startup Accounting and Finance Services",
      paragraphs: [
        "Starting a business comes with a lot of decisions, and we help you make each one with confidence. We work alongside you through formation, state registration, entity structure, accounting system setup, payroll, sales tax, and merchant processing, so every piece fits together and supports your plans.",
        "We help you choose the software and tools that fit your business today and set them up to grow with you. From day one, you have an experienced finance partner in your corner.",
      ],
    },
    pricing: {
      heading: "Factors That Affect Startup Accounting and Finance Pricing",
      intro: FOUR_FACTORS,
      factors: [
        { heading: "Setup Scope", content: "The number of setup items, such as formation, registrations, and system setup, affects the cost." },
        { heading: "Number of Entities", content: "Each additional entity adds formation, registration, and setup work." },
        { heading: "Number of States", content: "Registering in multiple states adds filings and accounts." },
        { heading: "System Complexity", content: "Inventory, multiple locations, or integrated sales systems require more setup." },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Startup Accounting and Finance",
      items: [
        { question: "What entity type should my business use?", answer: "It depends on your ownership, growth plans, and how you plan to pay yourself. LLCs, S corporations, and C corporations each carry different tax and liability implications, and we review the options for your situation with your CPA or our tax partners." },
        { question: "What accounting software should a new business use?", answer: "QuickBooks Online fits most new businesses. Companies with inventory, multiple entities, or rapid growth plans may need a more robust platform, and we help you choose the right fit." },
        { question: "How long does setup take?", answer: "It depends mostly on state processing times for formation and registrations. Accounting, payroll, and payment setup can begin as soon as your business is registered." },
        { question: "What do you need from us to get started?", answer: "Your business name, owners and ownership percentages, business address, and a description of what you sell and where. We guide you through the rest." },
        { question: "Can you support us after setup?", answer: "Yes. Once setup is complete, we can provide ongoing bookkeeping, payroll, sales tax, and controller or CFO support as your business grows." },
        { question: "How much does startup accounting and finance cost?", answer: "Cost depends on your setup scope, the number of entities and states, and the complexity of your systems. After a free 15-minute consultation, we provide a proposal priced to your needs." },
      ],
    },
  },

  "fractional-cfo-services": {
    intro: "A fractional CFO gives your business executive-level financial leadership without the cost of a full-time hire. We step in as an extension of your leadership team, bringing clarity to your financial position, identifying opportunities for growth, and guiding complex decisions, whether you need tighter cash flow management, stronger margins, a plan for growth, or support through a capital raise or acquisition.",
    whatsIncluded: {
      heading: "What Our Fractional CFO Services Include",
      bullets: [
        "Financial strategy and execution planning aligned with your business objectives",
        "Monthly and quarterly financial reviews with clear recommendations",
        "Cash flow management and forecasting to maintain healthy working capital",
        "Budget development and budget-to-actual variance analysis",
        "KPI and performance reporting that tracks what drives your business",
        "Investor, lender, and board reporting",
        "Scenario planning for growth, expansion, and major decisions",
        "Vendor and partner negotiations leveraging financial data and analysis",
        "Mentoring and development for your internal finance staff",
        "Profitability and pricing analysis",
        "Capital, financing, and entity structuring strategy",
      ],
    },
    process: {
      heading: "How Our Fractional CFO Engagement Works",
      steps: [
        { heading: "Discovery and Assessment", content: "We review your financial operations, systems, reporting, and historical results, and meet with key stakeholders to understand your goals and identify immediate opportunities for improvement." },
        { heading: "Strategy Development", content: "We build a financial strategy aligned with your objectives, including KPIs, reporting frameworks, and financial models, and prioritize initiatives with you." },
        { heading: "Implementation and Execution", content: "We put the plan in place, upgrading reporting, establishing new processes, and training your team so improvements last." },
        { heading: "Ongoing Strategic Partnership", content: "We meet regularly to review performance, guide major decisions, and prepare for board, investor, and lender meetings as your business evolves." },
      ],
    },
    cards: {
      heading: "Types of Businesses We Serve",
      items: [
        { heading: "Growth Stage Companies", content: "Companies that have outgrown basic accounting and need strategic oversight to manage growth, optimize cash flow, and make data-driven decisions about expansion." },
        { heading: "Venture-Backed Startups", content: "Startups preparing for or managing through funding rounds. We prepare financial models, investor materials, and reporting packages, and build financial operations that scale with you." },
        { heading: "Family-Owned Businesses", content: "Family businesses that need to professionalize their financial operations while preserving the values that made them successful." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Fractional CFO Services",
      paragraphs: [
        "We take time to understand your business, your industry, and your goals before making recommendations. Our experience spans real estate, restaurants and hospitality, e-commerce, telehealth, cannabis, and professional services, so we bring proven approaches to the challenges you face.",
        "Because we also manage accounting and the month-end close, our CFO guidance is built on numbers we have verified ourselves, not inherited. And we communicate clearly, without unnecessary jargon, so you always understand the financial impact of major decisions.",
      ],
      testimonial: "tyson-johnson",
    },
    pricing: {
      heading: "Factors That Influence Fractional CFO Engagement Pricing",
      intro: "Every engagement is priced to the level of support your business needs. Four main factors drive the cost.",
      factors: [
        { heading: "Scope of Services", content: "Focused support in one area, such as cash flow management or fundraising, costs less than full CFO oversight across every financial function." },
        { heading: "Time Commitment", content: "Engagements range from a few hours per week to several days per month, depending on your complexity, growth stage, and internal finance capabilities." },
        { heading: "Business Complexity", content: "Multiple entities, complex revenue models, or significant regulatory requirements call for more involved financial management." },
        { heading: "Special Projects", content: "Fundraising, M&A due diligence, and system implementations may be scoped separately from ongoing support." },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Fractional CFO Services",
      items: [
        { question: "What is the difference between a fractional CFO and a full-time CFO?", answer: "A fractional CFO provides the same strategic financial leadership as a full-time CFO on a part-time or project basis, giving you senior-level expertise at a fraction of the cost of a full-time executive." },
        { question: "How much time does a typical fractional CFO engagement require?", answer: "Engagements range from a few hours per week to several days per month, and can increase during intensive periods such as fundraising or system implementations. We structure engagements around your actual needs, not fixed commitments." },
        { question: "At what stage should a business consider hiring a fractional CFO?", answer: "When financial decisions start carrying real weight: difficulty managing cash flow, preparing to raise capital, considering an acquisition or sale, or needing better visibility to support growth." },
        { question: "How is a fractional CFO different from an accountant or bookkeeper?", answer: "Accountants and bookkeepers focus on recording transactions and ensuring accuracy in your financial records. A fractional CFO takes a strategic view, using financial data to guide business decisions, optimize operations, and plan for future growth. Think of it as the difference between knowing where you have been versus planning where you are going." },
        { question: "What should I expect during the first month of a fractional CFO engagement?", answer: "The first month focuses on assessment: reviewing your financial operations and historical data, meeting key stakeholders, and delivering a clear set of priorities and a roadmap for improvement." },
        { question: "How much does a fractional CFO cost?", answer: "Cost depends on the scope of work, the time commitment, and the complexity of your business. After a free 15-minute consultation, we provide a proposal priced to the level of support you need." },
      ],
    },
  },

  "financial-planning-and-analysis": {
    intro: "A strong financial plan turns your goals into numbers you can manage against. Our financial planning and analysis services deliver annual budgets, rolling forecasts, and cash flow projections, measured against actual results every month and tied to the KPIs that drive your business. We also build dynamic growth plans for scaling locations, fleets, or product lines, with debt, equity, or blended financing scenarios you can use internally and with lenders and investors.",
    whatsIncluded: {
      heading: "What Our FP&A Services Include",
      bullets: [
        "Annual operating budgets with departmental detail",
        "Revenue forecasting based on pipeline, seasonality, and trends",
        "Expense and headcount planning",
        "Capital expenditure planning",
        "Rolling cash flow forecasts updated monthly or quarterly",
        "Scenario analysis for different business conditions",
        "Budget-to-actual variance reporting and reforecasting",
        "Dynamic growth models for new locations, fleets, or product lines",
        "Debt, equity, and blended financing scenarios",
        "Board, lender, and investor presentation support",
      ],
    },
    extraSections: [
      {
        heading: "KPI Development and Dashboards",
        bullets: [
          "KPI selection and definition aligned with your business objectives",
          "Dashboard design and setup on the right platform",
          "Automated data feeds from your accounting and operational systems",
          "Trend, variance, and exception reporting",
          "Scheduled report distribution and user training",
        ],
      },
    ],
    process: {
      heading: "How Our FP&A Process Works",
      steps: [
        { heading: "Historical Analysis", content: "We analyze your historical performance to understand trends, seasonality, and cost drivers." },
        { heading: "Assumptions and KPIs", content: "We set the assumptions behind the plan with you, including growth, pricing, hiring, and major initiatives, and define the KPIs you'll manage against." },
        { heading: "Model Construction", content: "We build an integrated model linking the income statement, balance sheet, and cash flow, designed for scenario analysis and easy updating." },
        { heading: "Monthly Tracking and Reforecasting", content: "Each month, we compare results to plan, report variances and KPIs, and update the forecast as conditions change." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our FP&A Services",
      paragraphs: [
        "We build financial plans you'll use every month to run your business. Planning and analysis is the core of our experience, backed by more than 15 years in corporate finance and accounting, so your plan is built on sound modeling and a real understanding of how your business makes money.",
        "We keep your books and close the month, so your actual results are ready the moment it's time to compare them to plan. You get forecasts you can trust, explained in plain language, and a partner who helps you act on them.",
      ],
    },
    pricing: {
      heading: "FP&A Service Pricing Factors",
      intro: FOUR_FACTORS,
      factors: [
        { heading: "Business Complexity", content: "Multiple revenue streams, product lines, locations, or entities require more detailed modeling." },
        { heading: "Level of Detail", content: "Line-item budgets take more work than high-level departmental summaries." },
        { heading: "Forecast Frequency", content: "Monthly reforecasting requires more ongoing involvement than quarterly updates." },
        { heading: "Scenario Requirements", content: "Multiple scenarios and financing structures add modeling work." },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Financial Planning and Analysis",
      items: [
        { question: "How often should we update our forecast?", answer: "Most businesses update their forecast quarterly, and faster-moving businesses update monthly. We set the cadence based on how quickly your business changes." },
        { question: "What is the difference between a budget and a forecast?", answer: "A budget is your fixed annual target. A forecast is a regularly updated estimate of where results are actually heading, measured against that budget." },
        { question: "How much do FP&A services cost?", answer: "Cost depends on your complexity, level of detail, and how often you reforecast. After a free 15-minute consultation, we provide a proposal priced to the support you need." },
        { question: "Which KPIs should my business track?", answer: "It depends on what drives your business, such as margins by product or location, customer acquisition cost, cash runway, or labor cost as a percentage of revenue. We help you choose the few that matter most." },
        { question: "What if our budget becomes unrealistic mid-year?", answer: "We reforecast while keeping the original budget as a benchmark, so you can see both the plan and where you're actually heading." },
        { question: "Do you integrate budgets with our accounting system?", answer: "Yes. Approved budgets are loaded into your accounting software for automated budget-to-actual reporting." },
      ],
    },
  },

  "financial-modeling": {
    intro: "A financial model shows the impact of a decision before you make it. Should you expand into a new market, add a product line, change your pricing, or invest in new equipment? We build models around your specific business drivers and test every scenario, so you can see the range of possible outcomes and decide with confidence.",
    whatsIncluded: {
      heading: "What Our Financial Modeling Services Include",
      bullets: [
        "Three-statement models linking the income statement, balance sheet, and cash flow",
        "Revenue models built on your specific business drivers",
        "Profitability analysis by product, customer, location, or segment",
        "Pricing and cost structure analysis",
        "Break-even and unit economics analysis, including customer lifetime value",
        "Scenario and sensitivity analysis for key variables",
        "Investment return analysis, including NPV and IRR",
        "Acquisition and deal models",
        "Business valuation and equity ownership analysis",
      ],
    },
    process: {
      heading: "How Our Financial Modeling Process Works",
      steps: [
        { heading: "Scope Definition", content: "We define exactly which questions the model needs to answer, which sets its structure and level of detail." },
        { heading: "Data Gathering", content: "We collect and validate your historical data, operating metrics, and assumptions." },
        { heading: "Model Construction", content: "We build a transparent, well-documented model that others can follow and update." },
        { heading: "Validation and Delivery", content: "We test and stress-test the model, then walk you through it so you can use it with confidence." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Financial Modeling Services",
      paragraphs: [
        "We build models you'll actually use, not just present. Every model is designed so you can change an assumption and immediately see the impact, update it as your business evolves, and share it with a lender or investor with confidence. Our modeling experience spans growth planning, acquisitions, capital raises, and investment decisions, backed by more than 15 years in corporate finance and FP&A.",
        "Your model starts from accurate historical numbers in books we work in every month, not rough estimates, and we can keep it updated with actual results long after it's delivered.",
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Financial Modeling and Analysis",
      items: [
        { question: "What format do you deliver models in?", answer: "Models are delivered in Excel, the standard for financial analysis, organized and documented so your team can use them." },
        { question: "How long does it take to build a financial model?", answer: "Timing depends on the model's complexity and how readily your data is available. We provide an estimate during scoping." },
        { question: "Can you update models we already have?", answer: "Yes. We can review, correct, enhance, or extend existing models." },
        { question: "How much does a financial model cost?", answer: "Cost depends on the model's complexity, the analysis required, and your timeline. After a free 15-minute consultation, we scope the project and provide a proposal." },
        { question: "Can you present the model to investors or the board?", answer: "Yes. We prepare presentation materials from the model and can present alongside you." },
      ],
    },
  },

  "fundraising-support": {
    intro: "Raising capital is one of the most important moments in a company's growth. Whether you're pursuing equity investors or debt financing, we prepare the numbers, the story, and the diligence package investors and lenders expect, so you can present your opportunity with confidence and keep the process moving.",
    whatsIncluded: {
      heading: "What Our Fundraising Support Services Include",
      bullets: [
        "Investor-ready financial models and pro formas",
        "Historical financial statement preparation and cleanup",
        "Pitch deck financial slides and supporting materials",
        "Use of proceeds analysis",
        "Valuation and equity ownership analysis",
        "Due diligence preparation and data room organization",
        "Responses to investor and lender diligence questions",
        "Term sheet financial analysis",
        "Lender packages for bank and SBA financing",
        "Post-close investor and lender reporting setup",
      ],
    },
    process: {
      heading: "How Our Fundraising Support Works",
      steps: [
        { heading: "Readiness Assessment", content: "We evaluate your financial position, identify gaps in your materials or records, and build a preparation plan." },
        { heading: "Material Development", content: "We build your financial model and pro formas, prepare clean historical financials, and develop the financial sections of your pitch materials." },
        { heading: "Due Diligence Preparation", content: "We organize your data room and prepare answers to the questions investors and lenders typically ask." },
        { heading: "Process Support", content: "During the raise, we respond to financial questions, provide additional analysis, and help you evaluate the financial impact of term sheets." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Fundraising Support Services",
      paragraphs: [
        "We prepare your raise the way investors and lenders will review it. Our background in investor relations, capital markets, and investor document production means we know the questions that come up in diligence, and we build the answers into your materials before anyone asks.",
        "Your model ties directly to clean, reconciled books, so the numbers hold up under scrutiny. While you focus on investor conversations and running the business, we handle the financial workload. Once the raise closes, we set up the reporting your new investors and lenders expect.",
      ],
    },
    pricing: {
      heading: "Factors That Affect Fundraising Support Pricing",
      intro: FOUR_FACTORS,
      factors: [
        { heading: "Current State", content: "Companies with clean books and an existing model need less preparation than those starting from scratch." },
        { heading: "Deal Complexity", content: "Multiple investor types, layered capital structures, or complex terms call for more analysis." },
        { heading: "Timeline", content: "Compressed timelines may require dedicated resources." },
        { heading: "Scope of Support", content: "Full raise preparation costs more than help with a specific area, such as modeling or diligence." },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Fundraising Support",
      items: [
        { question: "Can a fractional CFO help with fundraising?", answer: "Yes. A fractional CFO prepares the financial model, historical financials, and diligence materials investors and lenders expect, and supports you through the process without adding a full-time executive before the capital is raised." },
        { question: "How early should we engage for fundraising support?", answer: "As early as possible, ideally before you begin outreach, which leaves time to clean up financials and build materials. Shorter timelines are possible for time-sensitive opportunities." },
        { question: "Do you help find investors?", answer: "No. We focus on financial preparation and diligence support, and we can refer you to bankers, brokers, or advisors who handle investor introductions." },
        { question: "How do you help with valuation?", answer: "We perform valuation analysis suited to your stage and industry, giving you a defensible basis for your ask and an objective way to assess offers." },
        { question: "Can you attend investor meetings?", answer: "Yes. We can present the financials and answer detailed questions, which is most valuable during due diligence." },
        { question: "How much does fundraising support cost?", answer: "Cost depends on your current financial state, deal complexity, timeline, and scope of support. After a free 15-minute consultation, we provide a proposal priced to your raise." },
      ],
    },
  },

  "mergers-acquisitions-advisory": {
    intro: "Buying, selling, or merging a business is one of the most consequential decisions an owner will make. We provide buy-side and sell-side financial support alongside your investment bank, broker, or ownership team, from due diligence and deal modeling to preparing the financial package buyers expect, so you enter the transaction with a clear view of the numbers and stay on track through close.",
    whatsIncluded: {
      heading: "What Our M&A Advisory Services Include",
      bullets: [
        "Financial due diligence on acquisition targets",
        "Deal models with return and debt coverage analysis",
        "Valuation analysis to support pricing and offers",
        "Earnings normalization and adjustments",
        "Working capital analysis and peg determination",
        "Deal structure and terms financial analysis",
        "Synergy identification and modeling",
        "Sell-side financial cleanup and buyer-ready financial package",
        "Responses to buyer and lender diligence requests",
        "Integration planning and post-close financial transition",
        "Earnout tracking and post-close reporting",
      ],
    },
    process: {
      heading: "How Our M&A Advisory Process Works",
      steps: [
        { heading: "Transaction Assessment", content: "We review the financial merits and risks of the transaction with you and your advisors before you commit." },
        { heading: "Valuation and Deal Modeling", content: "We build valuation and deal models, including return and debt coverage analysis, and show the financial impact of the proposed structure and terms." },
        { heading: "Due Diligence", content: "For buyers, we lead financial due diligence on the target; for sellers, we prepare the financial package and data room for buyer diligence." },
        { heading: "Close and Transition", content: "We support the financial side of closing, including working capital and earnout calculations, and integrate or transition the accounting after close." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our M&A Advisory Services",
      paragraphs: [
        "The financial work decides whether the deal you close is the deal you intended. We bring hands-on experience underwriting acquisitions, building deal models, and structuring financing, so the analysis behind your decision is rigorous and risks surface before closing, not after.",
        "We work alongside your banker, broker, and attorneys rather than replacing them, keeping the financial workstream organized and on schedule. The people who build your deal model also provide your ongoing accounting and CFO support, so they carry it through integration or transition.",
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Mergers and Acquisitions Advisory",
      items: [
        { question: "Do you broker transactions?", answer: "No. We provide financial advisory and work alongside your investment bank, business broker, or attorneys, or support transactions where the buyer or seller is already identified." },
        { question: "What is the difference between buy-side and sell-side support?", answer: "Buy-side support helps an acquirer model and diligence a target. Sell-side support prepares a business's financials so they hold up under buyer diligence. We provide both." },
        { question: "What is earnings normalization?", answer: "It adjusts historical results for one-time, non-recurring, and owner-related items to show the sustainable earnings a buyer is paying for." },
        { question: "How long does financial due diligence take?", answer: "It depends on the size of the business, the quality of its records, and how quickly information is provided. Organized financials and a prepared data room shorten the timeline considerably." },
        { question: "Can you help after the deal closes?", answer: "Yes. We combine accounting systems, set up consolidated reporting, track earnouts, and support the transition for buyers and sellers." },
        { question: "How much does M&A advisory cost?", answer: "Cost depends on the size and complexity of the transaction, the scope of our role, and the timeline. After a free 15-minute consultation, we provide a proposal priced to your transaction." },
      ],
    },
  },

  "tax-strategy-planning": {
    intro: "Effective tax planning happens throughout the year, not just at filing time. We keep your books tax-ready and model the tax impact of major business decisions as they happen, then coordinate with your CPA or our tax partners to put the right strategies in place, so you stay compliant and keep more of what your business earns.",
    whatsIncluded: {
      heading: "What Our Business Tax Planning Services Include",
      bullets: [
        "Tax projections and estimated payment tracking",
        "Tax-ready books and year-end workpapers for your CPA",
        "Tax impact modeling for major business decisions",
        "Entity structure and election analysis",
        "Owner compensation planning",
        "Timing strategies for income and deductions",
        "Equipment purchase and depreciation planning",
        "Retirement plan contribution planning",
        "State tax nexus review",
        "Tax credit identification and documentation",
        "Exit and succession tax planning",
        "Coordination with your CPA or our tax partners",
      ],
    },
    process: {
      heading: "How Our Tax Planning Process Works",
      steps: [
        { heading: "Tax Position Assessment", content: "We review your current tax position, entity structure, and recent returns to identify opportunities and risks." },
        { heading: "Strategy Development", content: "We develop strategies with your CPA or our tax partners and estimate the tax impact of each option." },
        { heading: "Implementation", content: "We help put approved strategies in place during the year, such as timing purchases, adjusting owner compensation, or funding retirement contributions." },
        { heading: "Ongoing Monitoring", content: "We track your tax position throughout the year and adjust as results and tax laws change." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Tax Planning Services",
      paragraphs: [
        "Tax planning works best when it's built on accurate, current books. We maintain the numbers your tax strategy depends on and bring the tax view into everyday decisions, from equipment purchases to owner compensation, rather than leaving it for year-end.",
        "Because we don't prepare returns, our focus stays entirely on planning. Your CPA or our tax partners handle the filing, and we deliver organized workpapers and clear projections that make their work faster and more accurate.",
      ],
    },
    pricing: {
      heading: "Factors That Affect Business Tax Planning Pricing",
      intro: FOUR_FACTORS,
      factors: [
        { heading: "Business Complexity", content: "Multiple entities, income streams, or multi-state operations add planning work." },
        { heading: "Planning Depth", content: "Full year-round planning costs more than periodic reviews." },
        { heading: "Special Situations", content: "Transactions, restructurings, or entity changes require more intensive analysis." },
        { heading: "Starting Point", content: "Books that need cleanup or catch-up before planning can begin require more work up front." },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Business Tax Planning",
      items: [
        { question: "Do you prepare tax returns?", answer: "No. We focus on tax planning. Returns are prepared and filed by your CPA or our tax partners." },
        { question: "When should tax planning start?", answer: "As early in the year as possible, so strategies are in place before major decisions are made. Starting mid-year still captures meaningful opportunities." },
        { question: "How do you work with my CPA?", answer: "We share projections, workpapers, and proposed strategies with your CPA, who reviews them and prepares and files your returns." },
        { question: "Can you help choose between an S corporation and a C corporation?", answer: "Yes. We model the tax impact of each entity type for your situation and review the results with your CPA or our tax partners before any election is made." },
        { question: "Do you handle personal tax planning?", answer: "We consider how business decisions affect owners' personal taxes. Individual returns are handled by your CPA or personal tax advisor." },
        { question: "How much does business tax planning cost?", answer: "Cost depends on your business complexity, planning depth, special situations, and the condition of your books. After a free 15-minute consultation, we provide a proposal priced to your needs." },
      ],
    },
  },

  "sales-tax-compliance": {
    intro: "Selling across multiple channels and states can create sales tax obligations well beyond your home state. We determine where you have obligations, register where required, reconcile sales across every channel, calculate what's owed, and prepare and file accurate returns on time, so you stay compliant everywhere you sell.",
    whatsIncluded: {
      heading: "What Our Sales Tax Compliance Services Include",
      bullets: [
        "Nexus analysis to determine where you have filing obligations",
        "State registration and account setup",
        "Product taxability review by state",
        "Sales reconciliation across every sales channel",
        "Sales tax calculation review and amounts due for each return",
        "Quarterly return preparation and filing for every jurisdiction",
        "Payment coordination and timing",
        "Exemption certificate management",
        "Sales tax audit support",
        "Voluntary disclosure support for past exposure",
        "Sales tax settings setup and review in your POS, e-commerce, and CRM systems",
      ],
    },
    process: {
      heading: "How Our Sales Tax Compliance Process Works",
      steps: [
        { heading: "Nexus Assessment", content: "We review your sales by state, inventory locations, and employee presence to determine where you owe sales tax." },
        { heading: "Registration", content: "We register your business with each required state and local tax agency." },
        { heading: "Ongoing Compliance", content: "We reconcile sales across your channels, calculate what's owed, and prepare and file your returns and payments on time." },
        { heading: "Monitoring and Updates", content: "We track changes in your sales footprint and tax rules and adjust your filings as needed." },
      ],
    },
    cards: {
      heading: "From Checkout to Filed Return",
      items: [
        { heading: "Channel Compilation", content: "We pull sales reports from every POS, delivery app, marketplace, and online store, separate gross sales from discounts, refunds, and tips, and back out marketplace sales where the platform already collected the tax, so you don't pay it twice." },
        { heading: "Reconciliation", content: "We tie reported sales and tax collected to your bank deposits, processor settlements, and general ledger, and resolve differences from fees, chargebacks, and timing before anything is filed." },
        { heading: "Return Preparation and Filing", content: "We apply the correct state, county, and district rates by location, report taxable, exempt, and marketplace sales on the proper lines, and file and remit by every due date." },
        { heading: "Filing Package and Records", content: "Each period you receive the filed return with its reconciliation and channel detail, and we keep exemption certificates and supporting records ready in case of an audit." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Sales Tax Compliance Services",
      paragraphs: [
        "Sales tax touches every sale your business makes, so accuracy depends on knowing your operations, not just the tax rates. We learn how and where you sell, keep up with rate and rule changes in every state where you file, and catch issues before they turn into penalties.",
        "Because we're accountants first, the figures on every return tie to your books and financial statements. You get one point of contact for registrations, filings, and sales tax questions, and your team gets its time back.",
      ],
    },
    pricing: {
      heading: "Factors That Affect Sales Tax Compliance Pricing",
      intro: FOUR_FACTORS,
      factors: [
        { heading: "Number of Jurisdictions", content: "More states and local jurisdictions mean more registrations and returns." },
        { heading: "Transaction Volume and Sales Channels", content: "More sales and more channels add compilation and reconciliation work." },
        { heading: "Product Mix", content: "A mix of taxable and exempt products requires more detailed review." },
        { heading: "Historical Exposure", content: "Back-filing or voluntary disclosure for past periods adds work up front." },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Sales Tax Compliance",
      items: [
        { question: "How do I know if I have nexus in other states?", answer: "Nexus can come from a physical presence, such as employees or inventory, or from sales that exceed a state's economic thresholds. We review your sales by state and identify where you're required to register and file." },
        { question: "What if we haven't been collecting sales tax where required?", answer: "Many states offer voluntary disclosure programs that can limit the lookback period and reduce or waive penalties. We assess your exposure and help you come into compliance." },
        { question: "How often do sales tax returns need to be filed?", answer: "Monthly, quarterly, or annually, depending on the state and your sales volume. We track every due date and file on schedule." },
        { question: "Do marketplace sales affect our obligations?", answer: "Marketplaces collect and remit tax on most sales made through their platforms, but in some states those sales still count toward nexus thresholds, and your direct sales remain your responsibility. We review your full sales picture." },
        { question: "What happens if we're audited?", answer: "We gather the records, reconciliations, and schedules the auditor requests and support you through the audit." },
        { question: "How much does sales tax compliance cost?", answer: "Cost depends on the number of jurisdictions, your sales volume and channels, your product mix, and any past-period work. After a free 15-minute consultation, we provide a proposal priced to your needs." },
      ],
    },
  },

  "audit-preparation": {
    intro: "A smooth audit starts long before the auditors arrive. Whether you're facing a financial statement, lender, or investor audit, we reconcile your accounts, organize your schedules and documentation, and prepare your team for auditor requests, so fieldwork stays on schedule with minimal disruption to your business.",
    whatsIncluded: {
      heading: "What Our Audit Preparation Services Include",
      bullets: [
        "Pre-audit readiness assessment and gap identification",
        "Account reconciliations and supporting documentation",
        "Audit schedules and roll-forwards, including opening balances",
        "PBC (prepared by client) request list management",
        "Internal control documentation",
        "Audit request responses and follow-up",
        "Auditor communication and meeting support",
        "Proposed adjustment review",
        "Management representation letter support",
        "Follow-up on auditor recommendations after the audit",
      ],
    },
    process: {
      heading: "How Our Audit Preparation Process Works",
      steps: [
        { heading: "Readiness Assessment", content: "We review your books and documentation, identify gaps, and build a prioritized plan to resolve them before fieldwork." },
        { heading: "Documentation Preparation", content: "We complete reconciliations, build supporting schedules, and organize records for auditor requests." },
        { heading: "Request List Management", content: "We gather every item on the auditor's PBC list, track its status, and deliver responses on time." },
        { heading: "Fieldwork Support", content: "We serve as your point of contact during fieldwork, explain transactions, and resolve issues as they arise." },
      ],
    },
    whyChoose: {
      heading: "Why Choose Our Audit Preparation Services",
      paragraphs: [
        "Audit fees are driven largely by how long fieldwork takes. We deliver reconciled accounts, complete schedules, and organized support before the auditors ask, cutting the back-and-forth that extends audits and adds to their cost.",
        "We manage the day-to-day coordination with your auditors so your team stays focused on running the business. Issues are raised and resolved early, and after the audit we help put the auditor's recommendations in place, so next year's audit starts from a stronger position.",
      ],
    },
    pricing: {
      heading: "Factors That Affect Audit Preparation Pricing",
      intro: FOUR_FACTORS,
      factors: [
        { heading: "Audit Scope", content: "First-year and full financial statement audits require more preparation than recurring audits or reviews." },
        { heading: "Condition of Records", content: "Books that need cleanup before fieldwork require more work up front." },
        { heading: "Business Complexity", content: "Multiple entities, complex transactions, or specialized accounting areas add preparation work." },
        { heading: "Level of Support", content: "Managing the full audit process costs more than help with specific areas." },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions About Audit Preparation",
      items: [
        { question: "How early should we start preparing?", answer: "As early as possible before fieldwork, so issues can be resolved without rushing. Starting soon after year-end gives the most room." },
        { question: "What triggers an audit requirement?", answer: "Lenders, investors, and regulators commonly require audits, as do many sale and acquisition processes. The requirement is usually set in loan covenants, investor agreements, or industry regulations." },
        { question: "Do you perform the audit?", answer: "No. Audits are performed by an independent CPA firm. We prepare your books, schedules, and documentation and coordinate with your auditors throughout the process." },
        { question: "What if the auditors propose adjustments?", answer: "We review each proposed adjustment with you, discuss the support and alternatives with the auditors, and help you decide how to respond." },
        { question: "Do you attend audit meetings?", answer: "Yes, including planning and closing meetings, and we're available throughout fieldwork." },
        { question: "How much does audit preparation cost?", answer: "Cost depends on the audit scope, the condition of your records, your business complexity, and the level of support you need. After a free 15-minute consultation, we provide a proposal priced to your needs." },
      ],
    },
  },
};

export function getServiceContent(slug: string): ServiceContent | undefined {
  return serviceContent[slug];
}
