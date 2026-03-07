import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site-config";
import { locations, getLocationBySlug, getNearbyLocations, getLocationImagePath } from "@/data/locations";
import { getLocationContent } from "@/data/location-content";
import { services } from "@/data/services";
import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    return { title: "Location Not Found" };
  }

  return {
    title: `Fractional CFO & Accounting Services in ${location.name}, ${location.stateAbbr} | ${siteConfig.name}`,
    description: `${location.shortDescription} Professional fractional CFO, accounting, and business advisory services for ${location.name} businesses.`,
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const content = getLocationContent(slug);
  const nearbyLocations = getNearbyLocations(slug, 5);
  const featuredServices = services.filter(s => s.priority <= 2).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getLocationImagePath(location)}
            alt={`${location.name}, ${location.stateAbbr}`}
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
              <li>
                <Link href="/service-areas" className="!text-white/80 hover:!text-white transition-colors">Service Areas</Link>
              </li>
              <li className="!text-white/80">/</li>
              <li className="!text-white font-medium">{location.name}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block !text-white font-semibold text-sm tracking-wide uppercase mb-4">
              Service Area
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold !text-white mb-6">
              Fractional CFO & Accounting in{" "}
              <span className="text-[var(--color-brand-gold)]">{location.name}, {location.stateAbbr}</span>
            </h1>
            <p className="text-xl !text-white/90 leading-relaxed mb-8">
              {location.shortDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-brand-blue)] text-white rounded-full font-semibold hover:bg-[var(--color-blue-dark)] transition-colors shadow-lg"
              >
                Get a Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Content Area */}
            <div className="lg:col-span-2">
              {content ? (
                <>
                  {/* Main Introduction */}
                  <div className="mb-12">
                    {content.mainIntroduction.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-gray-600 text-lg leading-relaxed mb-5">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Business Environment */}
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.businessEnvironment.heading}</h2>
                    <p className="text-gray-600">{content.businessEnvironment.content}</p>
                  </div>

                  {/* Services Overview */}
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.servicesOverview.heading}</h2>
                    <p className="text-gray-600 mb-8">{content.servicesOverview.intro}</p>
                    <div className="space-y-4">
                      {content.servicesOverview.highlights.map((highlight, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{highlight.service}</h3>
                          <p className="text-gray-600">{highlight.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8">
                      <Link href="/services" className="inline-flex items-center gap-2 text-[var(--color-brand-blue)] font-semibold hover:text-[var(--color-blue-dark)] transition-colors">
                        View all services
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Why Local Matters */}
                  <div className="mb-12">
                    <div className="bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                      <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{content.whyLocalMatters.heading}</h2>
                        <p className="text-white/80">{content.whyLocalMatters.content}</p>
                      </div>
                    </div>
                  </div>

                  {/* Industries Served */}
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.industriesServed.heading}</h2>
                    <p className="text-gray-600 mb-6">{content.industriesServed.intro}</p>
                    <div className="bg-slate-50 rounded-2xl p-6 lg:p-8">
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {content.industriesServed.industries.map((industry, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-700">
                            <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-full flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            {industry}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Local Commitment */}
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.localCommitment.heading}</h2>
                    <p className="text-gray-600">{content.localCommitment.content}</p>
                  </div>

                  {/* FAQs */}
                  {content.faqs && content.faqs.length > 0 && (
                    <div className="mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                        Frequently Asked Questions About {location.name} Services
                      </h2>
                      <FAQSection faqs={content.faqs} />
                    </div>
                  )}
                </>
              ) : (
                /* Fallback content when no rich content exists */
                <div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    BlueCrest Group provides comprehensive fractional CFO, accounting, and business
                    advisory services to businesses in {location.name}, {location.stateAbbr}. Our team
                    brings extensive experience and a commitment to delivering measurable results for
                    companies throughout {location.county}.
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Services in {location.name}</h2>
                  <p className="text-gray-600 mb-8">
                    We offer our full range of services to {location.name} businesses:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {featuredServices.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="group bg-white rounded-2xl shadow-soft border border-gray-100 p-6 hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
                      >
                        <h3 className="font-bold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-2">{service.shortDescription}</p>
                      </Link>
                    ))}
                  </div>

                  <p className="text-gray-600">
                    Contact us to learn more about how our services can support your{" "}
                    {location.name} business.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                {/* Contact Form */}
                <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Get Started Today
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Schedule your free consultation to discuss your financial needs in {location.name}.
                  </p>
                  <ContactForm variant="default" prefilledLocation={location.name} />
                </div>

                {/* Nearby Locations */}
                {nearbyLocations.length > 0 && (
                  <div className="bg-slate-50 rounded-3xl p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Nearby Service Areas
                    </h3>
                    <div className="space-y-3">
                      {nearbyLocations.map((nearby) => (
                        <Link
                          key={nearby.slug}
                          href={`/service-areas/${nearby.slug}`}
                          className="flex items-center gap-2 text-[var(--color-brand-blue)] hover:text-[var(--color-blue-dark)] font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {nearby.name}, {nearby.stateAbbr}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Link
                        href="/service-areas"
                        className="text-sm font-semibold text-gray-700 hover:text-[var(--color-brand-blue)] transition-colors"
                      >
                        View All Service Areas
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-brand-blue)]/10 rounded-full blur-3xl"></div>

        <div className="container-site relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 location-cta-heading">
              Ready to Work With a {location.name} Financial Partner?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Schedule a free consultation to discuss how we can help your
              {location.name} business with professional financial services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Schedule Your Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Spacer */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
