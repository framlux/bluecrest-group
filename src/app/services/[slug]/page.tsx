import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { services, getServiceBySlug, getRelatedServices } from "@/data/services";
import { getServiceContent } from "@/data/service-content";
import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: `${service.name} in ${siteConfig.region}, ${siteConfig.stateAbbr}`,
    description: `${service.shortDescription} Professional ${service.name.toLowerCase()} services for businesses in ${siteConfig.region}, ${siteConfig.stateAbbr}.`,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const content = getServiceContent(slug);
  const relatedServices = getRelatedServices(slug, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
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
                <Link href="/services" className="!text-white/80 hover:!text-white transition-colors">Services</Link>
              </li>
              <li className="!text-white/80">/</li>
              <li className="!text-white font-medium">{service.name}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block !text-white font-semibold text-sm tracking-wide uppercase mb-4">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold !text-white mb-6">
              {service.name} in{" "}
              <span className="text-[var(--color-brand-gold)]">{siteConfig.region}, {siteConfig.stateAbbr}</span>
            </h1>
            <p className="text-xl !text-white/90 leading-relaxed mb-8">
              {service.shortDescription}
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

                  {/* What's Included */}
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.whatsIncluded.heading}</h2>
                    <p className="text-gray-600 mb-6">{content.whatsIncluded.content}</p>
                    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 lg:p-8">
                      <ul className="space-y-4">
                        {content.whatsIncluded.bulletPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Process Section */}
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.processSection.heading}</h2>
                    <p className="text-gray-600 mb-8">{content.processSection.intro}</p>
                    <div className="space-y-4">
                      {content.processSection.steps.map((step, i) => (
                        <div key={i} className="bg-slate-50 rounded-2xl p-6 lg:p-8 border border-gray-100">
                          <div className="flex items-start gap-5">
                            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                              {i + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {step.heading}
                              </h3>
                              <p className="text-gray-600">{step.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applications Section */}
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.applicationsSection.heading}</h2>
                    <p className="text-gray-600 mb-8">{content.applicationsSection.intro}</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      {content.applicationsSection.applications.map((app, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-3">{app.heading}</h3>
                          <p className="text-gray-600">{app.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why Choose Section */}
                  <div className="mb-12">
                    <div className="bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                      <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{content.whyChooseSection.heading}</h2>
                        {content.whyChooseSection.content.split("\n\n").map((paragraph, i) => (
                          <p key={i} className="text-white/80 mb-4 last:mb-0">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Factors */}
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.pricingFactorsSection.heading}</h2>
                    <p className="text-gray-600 mb-8">{content.pricingFactorsSection.intro}</p>
                    <div className="space-y-6">
                      {content.pricingFactorsSection.factors.map((factor, i) => (
                        <div key={i} className="border-l-4 border-[var(--color-brand-blue)] pl-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{factor.heading}</h3>
                          <p className="text-gray-600">{factor.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service Area */}
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Service Area Coverage</h2>
                    <p className="text-gray-600">{content.serviceAreaCoverage}</p>
                  </div>

                  {/* FAQs */}
                  {content.faqs && content.faqs.length > 0 && (
                    <div className="mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                        Frequently Asked Questions About {service.name}
                      </h2>
                      <FAQSection faqs={content.faqs} />
                    </div>
                  )}
                </>
              ) : (
                /* Fallback content when no rich content exists */
                <div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {service.shortDescription} Our team brings extensive experience and a
                    commitment to delivering measurable results for businesses throughout
                    {siteConfig.region}.
                  </p>
                  <p className="text-gray-600 mb-8">
                    Contact us to learn more about how our {service.name.toLowerCase()} services
                    can support your business goals.
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
                    Schedule your free consultation to discuss your {service.name.toLowerCase()} needs.
                  </p>
                  <ContactForm variant="default" prefilledService={service.name} />
                </div>

                {/* Related Services */}
                {relatedServices.length > 0 && (
                  <div className="bg-slate-50 rounded-3xl p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Related Services
                    </h3>
                    <div className="space-y-3">
                      {relatedServices.map((related) => (
                        <Link
                          key={related.slug}
                          href={`/services/${related.slug}`}
                          className="flex items-center gap-2 text-[var(--color-brand-blue)] hover:text-blue-700 font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {related.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Link
                        href="/services"
                        className="text-sm font-semibold text-gray-700 hover:text-[var(--color-brand-blue)] transition-colors"
                      >
                        View All Services
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ color: 'white' }}>
              Ready to Get Started With {service.name}?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Schedule a free consultation to discuss how we can help your business
              with {service.name.toLowerCase()} and other financial services.
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
