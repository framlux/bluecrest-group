import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { services, getServiceBySlug, getRelatedServices } from "@/data/services";
import { getServiceContent, PRICING_CLOSING_LINE } from "@/data/service-content";
import { getTestimonial } from "@/data/testimonials";
import ContactForm from "@/components/ContactForm";
import ContactCta from "@/components/ContactCta";
import FAQSection from "@/components/FAQSection";
import { buildMetadata } from "@/lib/metadata";
import { pageMeta } from "@/data/page-meta";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: pageMeta.notFound.title };
  }

  // No description: Google builds the snippet from the page (item 16).
  return buildMetadata({
    title: `${service.name} in ${siteConfig.region}, ${siteConfig.stateAbbr}`,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const content = getServiceContent(slug);
  if (!content) {
    notFound();
  }
  const testimonial = content.whyChoose.testimonial ? getTestimonial(content.whyChoose.testimonial) : null;
  const relatedServices = getRelatedServices(slug);

  const path = `/services/${service.slug}`;
  const schemas = [
    serviceSchema({ name: service.name, description: service.shortDescription, path }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.name, path }]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
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
            <div className="flex flex-col sm:flex-row gap-4">
              <ContactCta className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-brand-blue)] text-white rounded-full font-semibold hover:bg-[var(--color-blue-dark)] transition-colors shadow-lg" />
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
              <p className="text-gray-600 text-lg leading-relaxed mb-12">{content.intro}</p>

              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.whatsIncluded.heading}</h2>
                <CheckList items={content.whatsIncluded.bullets} />
              </div>

              {content.extraSections?.map((section) => (
                <div key={section.heading} className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{section.heading}</h2>
                  {section.text && <p className="text-gray-600 text-lg leading-relaxed">{section.text}</p>}
                  {section.bullets && <CheckList items={section.bullets} />}
                </div>
              ))}

              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.process.heading}</h2>
                <div className="space-y-4">
                  {content.process.steps.map((step, i) => (
                    <div key={step.heading} className="bg-slate-50 rounded-2xl p-6 lg:p-8 border border-gray-100">
                      <div className="flex items-start gap-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{step.heading}</h3>
                          <p className="text-gray-600">{step.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {content.cards && (
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.cards.heading}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {content.cards.items.map((card) => (
                      <div key={card.heading} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{card.heading}</h3>
                        <p className="text-gray-600">{card.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-12">
                <div className="bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                  <div className="relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{content.whyChoose.heading}</h2>
                    {content.whyChoose.paragraphs.map((paragraph, i) => (
                      <p key={i} className="text-white/80 mb-4 last:mb-0">{paragraph}</p>
                    ))}
                    {testimonial && (
                      <figure className="mt-8 pt-8 border-t border-white/20">
                        <blockquote className="text-white/90 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                        <figcaption className="mt-4 text-sm">
                          <span className="font-semibold text-white">{testimonial.name}</span>
                          <span className="text-white/70">, {testimonial.role}</span>
                        </figcaption>
                      </figure>
                    )}
                  </div>
                </div>
              </div>

              {content.pricing && (
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.pricing.heading}</h2>
                  <p className="text-gray-600 mb-8">{content.pricing.intro}</p>
                  <div className="space-y-6">
                    {content.pricing.factors.map((factor) => (
                      <div key={factor.heading} className="border-l-4 border-[var(--color-brand-blue)] pl-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{factor.heading}</h3>
                        <p className="text-gray-600">{factor.content}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 mt-8">{PRICING_CLOSING_LINE}</p>
                </div>
              )}

              {/* Plain page content: no FAQPage markup (item 1). */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.faq.heading}</h2>
                <FAQSection faqs={content.faq.items} />
              </div>
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
                    Schedule your free 15-minute consultation to discuss your {service.consultationPhrase} needs.
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

      {/* Mobile Spacer */}
      <div className="h-20 lg:hidden" />
    </>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 lg:p-8">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-4">
            <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
