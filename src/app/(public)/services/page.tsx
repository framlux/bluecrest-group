import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { serviceCategories, getServicesByCategory } from "@/data/services";
import { getServiceIcon } from "@/utils/service-icons";
import ServicesCategorySection from "@/components/ServicesCategorySection";
import { buildMetadata } from "@/lib/metadata";
import { pageMeta } from "@/data/page-meta";
import { JsonLd } from "@/components/JsonLd";
import ContactCta from "@/components/ContactCta";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata(pageMeta.services);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/bluecrest-group-services-orange-county-ca.jpg"
            alt="BlueCrest Group financial services in Orange County, CA"
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
              <li className="!text-white font-medium">Services</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block !text-white font-semibold text-sm tracking-wide uppercase mb-4">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold !text-white mb-6">
              Fractional CFO and Accounting Services in{" "}
              <span className="text-[var(--color-brand-gold)]">Orange County</span>
            </h1>
            <p className="text-xl !text-white/90 leading-relaxed">
              From clean books and month-end close to forecasting, financial analysis, and strategic
              advisory, BlueCrest Group supports small and growing businesses across Orange County.
              Every engagement is tailored to your business and its stage of growth.
            </p>
          </div>
        </div>
      </section>

      {/* Services by Category */}
      <ServicesCategorySection>
        <section className="py-20 lg:py-28">
          <div className="container-site">
            {serviceCategories.map((category) => {
            const categoryServices = getServicesByCategory(category.id);

            return (
              <div key={category.id} id={category.id} className="mb-20 last:mb-0 scroll-mt-24">
                <div className="mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{category.name}</h2>
                  <p className="text-xl text-gray-600 max-w-2xl">{category.description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="group bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-soft hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-xl flex items-center justify-center mb-5">
                        {getServiceIcon(service.slug)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--color-brand-blue)] transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 mb-5">{service.shortDescription}</p>
                      <span className="inline-flex items-center gap-2 text-[var(--color-brand-blue)] font-semibold text-sm">
                        Learn More
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          </div>
        </section>
      </ServicesCategorySection>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-3xl p-10 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Not Sure Which Services You Need?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Schedule a free 15-minute consultation and we&apos;ll identify the right
                combination of services for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ContactCta className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--color-brand-blue)] rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Spacer */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
