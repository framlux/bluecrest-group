import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site-config";
import { locations, getPrimaryLocation, getLocationsByPopulation, getLocationImagePath } from "@/data/locations";
import { services } from "@/data/services";
import { getServiceIcon } from "@/utils/service-icons";

export const metadata: Metadata = {
  title: `Service Areas | ${siteConfig.name}`,
  description: `${siteConfig.name} provides fractional CFO, accounting, and business advisory services throughout Orange County, California including ${locations.slice(0, 5).map(l => l.name).join(", ")}, and surrounding areas.`,
};

export default function ServiceAreasPage() {
  const primaryLocation = getPrimaryLocation();
  const sortedLocations = getLocationsByPopulation();
  const featuredServices = services.filter(s => s.priority <= 3).slice(0, 6);

  return (
    <>
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
            <span className="inline-block text-[var(--color-brand-gold)] font-semibold text-sm tracking-wide uppercase mb-4">
              Where We Work
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="!text-white">Orange County</span>{" "}
              <span className="text-[var(--color-brand-gold)]">Financial Services</span>
            </h1>
            <p className="text-xl !text-white/90 leading-relaxed mb-8">
              BlueCrest Group provides fractional CFO, accounting, and business advisory
              services to businesses throughout Orange County, California. From our base
              in {primaryLocation.name}, we serve companies across the region with
              professional financial leadership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-brand-blue)] text-white rounded-full font-semibold hover:bg-[var(--color-blue-dark)] transition-colors shadow-lg"
              >
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Location Grid */}
      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-4">
              Our Locations
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Communities We Serve
            </h2>
            <p className="text-xl text-gray-600">
              We work with businesses throughout Orange County, providing the same high
              level of service regardless of location. Click on any city to learn more
              about our services in that area.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/service-areas/${location.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={getLocationImagePath(location)}
                    alt={`${location.name}, ${location.stateAbbr}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {location.isPrimary && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] text-white text-xs font-bold px-3 py-1 rounded-full">
                      HQ
                    </span>
                  )}
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors mb-3">
                    {location.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-5">
                    {location.shortDescription}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[var(--color-brand-blue)] font-semibold text-sm">
                    Learn more
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Available */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="container-site">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-4">
              What We Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Services Available Throughout Orange County
            </h2>
            <p className="text-xl text-gray-600">
              Our full range of services is available to businesses in every community we serve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group bg-white rounded-2xl p-6 lg:p-8 shadow-soft border border-gray-100 hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-xl flex items-center justify-center mb-5">
                  {getServiceIcon(service.slug)}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[var(--color-brand-blue)] transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.shortDescription}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-full font-semibold hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)] transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Location Matters */}
      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-4">
                Local Expertise
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Local Financial Leadership Matters
              </h2>
              <div className="space-y-5 text-gray-600">
                <p>
                  While modern technology enables remote work, there is no substitute for
                  having financial partners who understand your local business environment.
                  Orange County has unique dynamics that shape business operations.
                </p>
                <p>
                  Being based in Newport Beach means we understand the Orange County business
                  community firsthand. We know the industries that thrive here, the challenges
                  businesses face, and the opportunities available in this market.
                </p>
                <p>
                  When you work with BlueCrest Group, you get a financial partner who can
                  meet in person when it matters, responds quickly to urgent needs, and
                  provides the kind of relationship that remote services cannot match.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-brand-blue)]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

              <h3 className="text-2xl font-bold text-white mb-8" style={{ color: 'white' }}>Benefits of Local Partnership</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Face-to-face meetings when they matter most</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Understanding of local business dynamics</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Connections to other Orange County professionals</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Rapid response to urgent financial needs</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Investment in local business community success</span>
                </li>
              </ul>
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
                Ready to Work With a Local Financial Partner?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Schedule a free consultation to discuss how BlueCrest Group can support
                your business with professional financial services right here in Orange County.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--color-brand-blue)] rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Schedule Your Free Consultation
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
