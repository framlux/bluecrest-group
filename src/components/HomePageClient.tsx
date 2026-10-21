"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site-config";
import { serviceCategories, getServicesByCategory } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { getPrimaryLocation } from "@/data/locations";
import LocationCard from "@/components/LocationCard";
import ContactForm from "@/components/ContactForm";
import ContactCta from "@/components/ContactCta";
import HeroVideo from "@/components/HeroVideo";
import CaseStudyCards from "@/components/CaseStudyCards";

export default function HomePageClient() {
  const primaryLocation = getPrimaryLocation();

  return (
    <>
      {/* Hero Section - BlueCrest Brand */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 lg:h-screen lg:flex lg:items-center relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
        {/* Background Video */}
        <HeroVideo />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-gray-50/70 z-0"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-12 h-0.5 bg-[var(--color-brand-gold)]"></span>
              <h1 className="hero-eyebrow">
                Your Fractional CFO and Accounting Partner in Orange County
              </h1>
            </div>
            {/* Styled as the headline but not a heading: the page has exactly one H1. */}
            <p className="hero-headline mb-8 drop-shadow-lg">
              From Clean Books to Executive-Level Finance, Scaled to Your Business
            </p>
            <p className="text-lg text-gray-700 mb-10 leading-relaxed drop-shadow-md font-medium">
              Grow your business with strategic CFO guidance and expert accounting support. We keep
              your books accurate and current, build the forecasts and analysis behind your biggest
              decisions, and coordinate payroll, tax, and compliance, giving you a clear view of your
              numbers and the confidence to act on them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <ContactCta className="btn-primary px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2" />
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section - Navy Gradient */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="gradient-navy rounded-3xl p-12 lg:p-20 text-white relative overflow-hidden">
          {/* Decorative gold accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-gold)]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-24">
            <div>
              <span className="inline-block w-12 h-1 bg-[var(--color-brand-gold)] mb-6"></span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 !text-white">Who We Are</h2>
            </div>
            <div>
              <p className="text-lg leading-relaxed text-white/90">
                {siteConfig.businessName} provides fractional CFO and accounting services to growing
                businesses. Based in Orange County, we also work with clients nationwide and partner with
                business owners and leadership teams to bring clarity, control, and confidence to their
                financial direction.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-16 grid lg:grid-cols-2 gap-12 lg:gap-24 pt-16 border-t border-white/20">
            <div>
              <span className="inline-block w-12 h-1 bg-[var(--color-brand-gold)] mb-6"></span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 !text-white">The Result</h2>
            </div>
            <div>
              <p className="text-lg leading-relaxed text-white/90">
                You get strategic insight and the financial visibility to grow profitably and plan
                ahead, along with more time to focus on running your business. Opportunities are easier
                to spot, growth plans rest on solid ground, and your business is always ready for what
                comes next.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-16 grid lg:grid-cols-2 gap-12 lg:gap-24 pt-16 border-t border-white/20">
            <div>
              <span className="inline-block w-12 h-1 bg-[var(--color-brand-gold)] mb-6"></span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 !text-white">Why Us</h2>
            </div>
            <div>
              <p className="text-lg leading-relaxed text-white/90">
                We act as an extension of your team, bringing senior-level financial leadership and
                hands-on accounting expertise to businesses in every industry. From day-to-day
                bookkeeping to forecasting, capital raises, and acquisitions, we work across every level
                of your finances, so the same team supports you at every stage of growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Clients Say */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-12 h-0.5 bg-[var(--color-brand-gold)]"></span>
              <span className="text-[var(--color-brand-gold)] font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-brand-navy)]">What Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <figure key={t.id} className="bg-slate-50 rounded-2xl border border-gray-100 p-6 lg:p-8 flex flex-col">
                <blockquote className="text-gray-700 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 pt-6 border-t border-gray-200">
                  <div className="font-semibold text-[var(--color-brand-navy)]">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="py-20 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-12 h-0.5 bg-[var(--color-brand-gold)]"></span>
              <span className="text-[var(--color-brand-gold)] font-semibold text-sm uppercase tracking-wider">Client Results</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-brand-navy)]">Case Studies</h2>
          </div>
          <CaseStudyCards />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-12 h-0.5 bg-[var(--color-brand-gold)]"></span>
                <span className="text-[var(--color-brand-gold)] font-semibold text-sm uppercase tracking-wider">What We Do</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-brand-navy)]">
                Our Services
              </h2>
            </div>
            <Link
              href="/services"
              className="mt-6 lg:mt-0 inline-flex items-center text-[var(--color-brand-gold)] font-semibold hover:gap-3 transition-all gap-2"
            >
              View All Services
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {serviceCategories.map((category, index) => {
              const categoryServices = getServicesByCategory(category.id);
              const colors = [
                "from-[var(--color-brand-blue)] to-[var(--color-brand-navy)]",
                "from-[var(--color-brand-gold)] to-[var(--color-gold-dark)]",
                "from-[var(--color-brand-navy)] to-[#1a3a5a]",
                "from-[var(--color-brand-coral)] to-[var(--color-brand-gold)]",
              ];
              return (
                <div key={category.id} className="group">
                  <div className={`bg-gradient-to-br ${colors[index]} rounded-2xl p-6 text-white mb-4 min-h-[200px] flex flex-col justify-between`}>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-white/80 text-sm">{category.description}</p>
                    </div>
                    <Link
                      href={`/services#${category.id}`}
                      className="inline-flex items-center text-white/90 hover:text-white font-medium text-sm gap-2 mt-4"
                    >
                      Explore
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <ul className="space-y-2">
                    {categoryServices.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="text-gray-600 hover:text-[var(--color-brand-blue)] text-sm flex items-center gap-2"
                        >
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 justify-center">
              <span className="w-12 h-0.5 bg-[var(--color-brand-gold)]"></span>
              <span className="text-[var(--color-brand-gold)] font-semibold text-sm uppercase tracking-wider">Service Areas</span>
              <span className="w-12 h-0.5 bg-[var(--color-brand-gold)]"></span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-brand-navy)] mb-6">
              Serving {siteConfig.region}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From our base in Newport Beach, we work with businesses across Orange County.
            </p>
          </div>

          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 max-w-4xl mx-auto mb-10 text-gray-700">
            {siteConfig.serviceAreaCities.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>

          <div className="max-w-md mx-auto mb-10">
            <LocationCard location={primaryLocation} />
          </div>
        </div>
      </section>

      {/* Meet the Founder Section - Navy Background */}
      <section className="gradient-navy py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-brand-gold)]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-12 h-0.5 bg-[var(--color-brand-gold)]"></span>
                <span className="text-[var(--color-brand-gold)] font-semibold text-sm uppercase tracking-wider">Leadership</span>
              </div>
              <h2 className="text-5xl font-bold !text-white mb-6 leading-tight">
                <Link href="/about" className="!text-white hover:!text-[var(--color-brand-gold)] transition-colors">
                  Meet {siteConfig.founder.name.split(" ")[0]}
                </Link>
              </h2>
              <p className="text-2xl text-[var(--color-brand-gold)] mb-4 font-medium">
                {siteConfig.founder.name}, {siteConfig.founder.title}
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {siteConfig.founder.longBio.split("\n\n")[0]}
              </p>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-brand-blue)] via-[var(--color-brand-gold)] to-[var(--color-brand-coral)]"></div>
                <div className="p-6">
                  <Image
                    src="/images/josh-miller.jpg"
                    alt={`${siteConfig.founder.name}, ${siteConfig.founder.title}`}
                    width={500}
                    height={400}
                    className="rounded-lg object-contain w-full h-auto"
                  />
                </div>
              </div>

              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[var(--color-brand-gold)]/30 rounded-2xl transform -rotate-3 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing form */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="bg-[var(--color-brand-navy)] rounded-[2.5rem] p-6 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-gold)]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl"></div>

            <div className="bg-white rounded-2xl p-8 shadow-xl relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Schedule Your Free 15-Minute Consultation
              </h2>
              <p className="text-gray-600 mb-8">
                Tell us about your business and financial needs. We will reach out within one business
                day to schedule a conversation about how we can help.
              </p>
              <ContactForm variant="default" />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Spacer for sticky CTA */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
