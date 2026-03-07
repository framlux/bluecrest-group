"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site-config";
import { services, serviceCategories, getServicesByCategory } from "@/data/services";
import { getLocationImagePath, getLocationBySlug, locations } from "@/data/locations";
import { getServiceIcon } from "@/utils/service-icons";
import ContactForm from "@/components/ContactForm";
import FeaturedInsights from "@/components/FeaturedInsights";

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: {
    alt?: string;
    [key: string]: unknown;
  };
  publishedAt: string;
  category?: string;
}

interface HomePageClientProps {
  featuredArticles: Article[];
}

export default function HomePageClient({ featuredArticles }: HomePageClientProps) {
  const [showMoreLocations, setShowMoreLocations] = useState(false);

  const initialLocationSlugs = [
    "newport-beach-ca",
    "corona-del-mar-ca",
    "irvine-ca",
    "costa-mesa-ca",
    "huntington-beach-ca",
    "laguna-beach-ca",
  ];

  const initialLocations = initialLocationSlugs
    .map((slug) => getLocationBySlug(slug))
    .filter((location): location is NonNullable<typeof location> => Boolean(location));

  const remainingLocations = locations.filter(
    (location) => !initialLocationSlugs.includes(location.slug)
  );

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  return (
    <>
      {/* Hero Section - BlueCrest Brand */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 lg:h-screen lg:flex lg:items-center relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        >
          <source src="/bluecrest-group-fractional-cfo-services-orange-county-ca.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-gray-50/70 z-0"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-12 h-0.5 bg-[var(--color-brand-gold)]"></span>
              <span className="text-[var(--color-brand-gold)] font-semibold text-sm uppercase tracking-wider">Fractional CFO Services</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-[var(--color-brand-navy)] leading-tight mb-8 drop-shadow-lg">
              Clarity & Growth — Without the Full-Time Overhead
            </h1>
            <p className="text-lg text-gray-700 mb-10 leading-relaxed drop-shadow-md font-medium">
              Scale your business with strategic CFO services and expert accounting support.
              From bookkeeping and payroll to financial modeling, tax strategy, and more –
              everything you need to grow with clarity and confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="btn-primary px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book An Intro Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-brand-navy)]">15+</div>
              <div className="text-gray-500 text-sm">Years Experience</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-brand-navy)]">100%</div>
              <div className="text-gray-500 text-sm">Client Focused</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-brand-gold)]">18</div>
              <div className="text-gray-500 text-sm">Services Offered</div>
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
                {siteConfig.businessName} provides fractional CFO and accounting services
                to growing businesses. Led by {siteConfig.founder.name} with over 15 years of experience,
                we partner with organizations, helping them gain clarity, control, and confidence in their financial direction.
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
                Financial clarity and more time to focus on running your business.
                Clean books. Strategic insights. Informed decisions. The financial
                visibility you need to scale confidently and maximize profitability.
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
                With deep expertise in startups and real estate industries, we bring strategic
                depth and operational expertise that transforms how businesses approach their
                finances. We act as an extension of your team, providing executive-level financial
                leadership without the full-time cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => {
              const categoryServices = services.filter(s => s.category === category.id).slice(0, 3);
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
                    <button
                      onClick={() => scrollToCategory(category.id)}
                      className="inline-flex items-center text-white/90 hover:text-white font-medium text-sm gap-2 mt-4 cursor-pointer"
                    >
                      Explore
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
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

      {/* Services by Category Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {serviceCategories.map((category, categoryIndex) => {
            const categoryServices = getServicesByCategory(category.id);
            const colors = [
              "from-[var(--color-brand-blue)] to-[var(--color-brand-navy)]",
              "from-[var(--color-brand-gold)] to-[var(--color-gold-dark)]",
              "from-[var(--color-brand-navy)] to-[#1a3a5a]",
              "from-[var(--color-brand-coral)] to-[var(--color-brand-gold)]",
            ];

            return (
              <div
                key={category.id}
                id={`category-${category.id}`}
                className="mb-20 scroll-mt-24"
              >
                <div className={`bg-gradient-to-r ${colors[categoryIndex]} rounded-2xl p-8 mb-8`}>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-white/90 text-lg">{category.description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="group bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-soft hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${colors[categoryIndex]} rounded-xl flex items-center justify-center mb-5`}>
                        {getServiceIcon(service.slug)}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--color-brand-blue)] transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-gray-600">{service.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
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
                Meet {siteConfig.founder.name}
              </h2>
              <p className="text-2xl text-[var(--color-brand-gold)] mb-4 font-medium">{siteConfig.founder.title}</p>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {siteConfig.founder.shortBio}
              </p>
              <Link
                href="/about"
                className="btn-primary px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2"
              >
                Learn More About Us
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
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

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="bg-[var(--color-brand-navy)] rounded-[2.5rem] p-12 lg:p-20 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-gold)]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl"></div>

            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="text-white">
                <span className="inline-block w-12 h-1 bg-[var(--color-brand-gold)] mb-6"></span>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Ready to Transform Your Financial Operations?
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Whether you need fractional CFO services, accounting support, or strategic
                  financial guidance, we&apos;re here to help your business thrive. Schedule a
                  free consultation to discuss your unique needs.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Schedule Your Free Consultation
                </h2>
                <p className="text-gray-600 mb-8">
                  Tell us about your business and financial needs. We will reach out
                  to schedule a conversation about how we can help.
                </p>
                <ContactForm variant="default" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <FeaturedInsights articles={featuredArticles} />

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
              Southern California&apos;s Fractional Path to Financial Clarity & Strategic Growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {initialLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/service-areas/${location.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={getLocationImagePath(location)}
                    alt={`${location.name}, ${location.stateAbbr}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {location.isPrimary && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] text-white text-xs font-bold px-2 py-1 rounded-full">
                      HQ
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors mb-2">
                    {location.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {location.shortDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {showMoreLocations && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 animate-in fade-in duration-300">
              {remainingLocations.map((location) => (
                <Link
                  key={location.slug}
                  href={`/service-areas/${location.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={getLocationImagePath(location)}
                      alt={`${location.name}, ${location.stateAbbr}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {location.isPrimary && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] text-white text-xs font-bold px-2 py-1 rounded-full">
                        HQ
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors mb-2">
                      {location.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {location.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => setShowMoreLocations(!showMoreLocations)}
              className="inline-flex items-center text-[var(--color-brand-gold)] font-semibold hover:gap-3 transition-all gap-2"
            >
              {showMoreLocations ? "Show Less Locations" : "Show More Locations"}
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${showMoreLocations ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Spacer for sticky CTA */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
