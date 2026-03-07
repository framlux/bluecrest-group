import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site-config";
import { services, serviceCategories } from "@/data/services";
import { getServiceIcon } from "@/utils/service-icons";
import ServicesCategorySection from "@/components/ServicesCategorySection";

export const metadata: Metadata = {
  title: `Financial Services | Fractional CFO and Accounting`,
  description: `Explore our comprehensive fractional CFO, accounting, and business consulting services for growing businesses in ${siteConfig.city}, ${siteConfig.stateAbbr} and ${siteConfig.region}.`,
};

export default function ServicesPage() {
  return (
    <>
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
              Financial Services for{" "}
              <span className="text-[var(--color-brand-gold)]">Growing Businesses</span>
            </h1>
            <p className="text-xl !text-white/90 leading-relaxed">
              From day-to-day accounting operations to strategic CFO advisory, we provide the
              financial expertise your business needs to thrive. Every service is tailored to
              your specific needs and growth stage.
            </p>
          </div>
        </div>
      </section>

      {/* Services by Category */}
      <ServicesCategorySection>
        <section className="py-20 lg:py-28">
          <div className="container-site">
            {serviceCategories.map((category, categoryIndex) => {
            const categoryServices = services.filter((s) => s.category === category.id);

            return (
              <div key={category.id} id={category.id} className="mb-20 last:mb-0 scroll-mt-24">
                <div className="mb-10">
                  <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-3">
                    {categoryIndex === 0 ? "Strategic Leadership" : categoryIndex === 1 ? "Core Services" : "Specialized Support"}
                  </span>
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

      {/* Why Choose Our Services */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-brand-blue)]/10 rounded-full blur-3xl"></div>

        <div className="container-site relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-[var(--color-blue-light)] font-semibold text-sm tracking-wide uppercase mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold !text-white mb-6">
              The BlueCrest Approach
            </h2>
            <p className="text-xl text-gray-400">
              Every engagement is tailored to your specific needs, with a focus on delivering
              measurable results and building long-term value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Onboarding</h3>
              <p className="text-gray-400">
                Get up and running quickly with our streamlined onboarding process that respects
                your time and gets results fast.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Experienced Team</h3>
              <p className="text-gray-400">
                Work with financial professionals who have decades of experience across
                multiple industries and business sizes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Scalable Solutions</h3>
              <p className="text-gray-400">
                Our services grow with you. Start with what you need and add capabilities
                as your business evolves.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                Schedule a free consultation and we&apos;ll help you identify the right combination
                of services for your business needs and growth stage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--color-brand-blue)] rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Schedule a Free Consultation
                </Link>
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
