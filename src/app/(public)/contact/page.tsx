import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site-config";
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/metadata";
import { pageMeta } from "@/data/page-meta";
import { JsonLd } from "@/components/JsonLd";
import { CONTACT_FORM_ID } from "@/lib/cta";
import { breadcrumbSchema } from "@/lib/structured-data";
import { telHref } from "@/lib/phone";

export const metadata: Metadata = buildMetadata(pageMeta.contact);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/contact-fractional-cfo-orange-county-ca.jpeg"
            alt="Contact BlueCrest Group for fractional CFO services in Orange County, CA"
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
            <ol className="flex items-center gap-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li className="text-white font-medium">Contact</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block text-[var(--color-brand-gold)] font-semibold text-sm tracking-wide uppercase mb-4">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 !text-white">
              Contact Us
            </h1>
            <p className="text-xl text-gray-100 leading-relaxed">
              Fill out the form, email us, or give us a call.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div id={CONTACT_FORM_ID} className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 lg:p-10 scroll-mt-28">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Schedule Your Free 15-Minute Consultation
                </h2>
                <p className="text-gray-600 mb-8">
                  Tell us about your business and financial needs. We&apos;ll reach out within one business
                  day to schedule a conversation about how we can help.
                </p>
                <ContactForm variant="default" />
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                {/* Direct Contact */}
                <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Contact Information
                  </h3>

                  <div className="space-y-6">
                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <a href={`mailto:${siteConfig.email}`} className="text-gray-900 font-semibold hover:text-[var(--color-brand-blue)] transition-colors">
                          {siteConfig.email}
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    {telHref(siteConfig.phone) && (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-xl flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Phone</p>
                          <a href={telHref(siteConfig.phone)!} className="text-gray-900 font-semibold hover:text-[var(--color-brand-blue)] transition-colors">
                            {siteConfig.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Location</p>
                        <p className="text-gray-900 font-semibold">
                          {siteConfig.city}, {siteConfig.stateAbbr}
                        </p>
                        <p className="text-sm text-gray-600">
                          Serving {siteConfig.region}
                        </p>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Hours</p>
                        <p className="text-gray-900 font-semibold">
                          {siteConfig.hours}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What to Expect */}
                <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-blue)]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                  <h3 className="text-xl font-bold mb-6 relative z-10">
                    What to Expect
                  </h3>
                  <ul className="space-y-4 relative z-10">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Response within one business day</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Free 15-minute consultation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Discussion of your needs and goals</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Specific recommendations for your business</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">No obligation or pressure</span>
                    </li>
                  </ul>
                </div>

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
