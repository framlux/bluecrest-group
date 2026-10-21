import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { serviceCategories } from "@/data/services";
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/metadata";
import { pageMeta } from "@/data/page-meta";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata(pageMeta.serviceAreas);

/** The site's one location page (Service Areas Page Update, October 21, 2026). */
const regions = [
  {
    heading: "Orange County",
    body: "Orange County is our home market, and we work with businesses across the county, including Newport Beach, Irvine, Costa Mesa, Huntington Beach, Laguna Beach, Orange, Santa Ana, Anaheim, Fullerton, Tustin, Mission Viejo, and Lake Forest.",
  },
  {
    heading: "Southern California",
    body: "We also support businesses throughout Southern California, including Los Angeles, San Diego, and the Inland Empire, working on site or remotely as your business needs.",
  },
  {
    heading: "Nationwide",
    body: "Our accounting, controller, and CFO services run on cloud-based systems, so we support clients in any state, including multi-state payroll, sales tax, and entity structures. Recent work includes a full accounting system implementation for an industrial real estate developer operating across Nevada and Arizona.",
  },
];

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Service Areas", path: "/service-areas" }])} />
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/Orange-County-CA-fractional-cfo.jpg"
            alt="Orange County, California"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70"></div>
        </div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--color-brand-navy)]/15 rounded-full blur-3xl"></div>

        <div className="container-site relative z-10">
          <nav className="mb-8 text-sm">
            <ol className="flex items-center gap-2 !text-white/80">
              <li>
                <Link href="/" className="!text-white/80 hover:!text-white transition-colors">Home</Link>
              </li>
              <li className="!text-white/80">/</li>
              <li className="!text-white font-medium">Service Areas</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="!text-white">Fractional CFO and Accounting Services in</span>{" "}
              <span className="text-[var(--color-brand-gold)]">Orange County, CA</span>
            </h1>
            <p className="text-xl !text-white/90 leading-relaxed">
              Based in Newport Beach, BlueCrest Group provides fractional CFO and accounting services to businesses
              throughout Orange County and Southern California, with the systems and experience to support clients
              nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Where we work */}
      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="max-w-3xl mx-auto space-y-12">
            {regions.map((region) => (
              <div key={region.heading}>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{region.heading}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{region.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services: the same category descriptors as the Services page */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="container-site">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {serviceCategories.map((category) => (
              <Link
                key={category.id}
                href={`/services#${category.id}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-soft p-6 hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
              >
                <h3 className="font-bold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation form */}
      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-soft border border-gray-100 p-8 lg:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Schedule Your Free 15-Minute Consultation
            </h2>
            <p className="text-gray-600 mb-8">
              Tell us about your business and financial needs. We&apos;ll reach out within one business day to
              schedule a conversation about how we can help.
            </p>
            <ContactForm variant="default" />
          </div>
        </div>
      </section>

      {/* Mobile Spacer */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
