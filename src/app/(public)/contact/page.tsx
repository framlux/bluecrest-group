import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site-config";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: `Contact ${siteConfig.businessName} | ${siteConfig.city}, ${siteConfig.stateAbbr}`,
  description: `Contact ${siteConfig.businessName} for fractional CFO and accounting services in ${siteConfig.region}. Schedule your free consultation today.`,
};

export default function ContactPage() {
  return (
    <>
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="!text-white">Let&apos;s Start a</span>{" "}
              <span className="text-[var(--color-brand-gold)]">Conversation</span>
            </h1>
            <p className="text-xl text-gray-100 leading-relaxed">
              Ready to discuss how BlueCrest Group can support your business?
              Schedule a free consultation or reach out directly.
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
              <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 lg:p-10">
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
                          Serving {siteConfig.serviceArea}
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
                      <span className="text-gray-300">Free initial consultation</span>
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
                      <span className="text-gray-300">Recommendations tailored to your situation</span>
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

      {/* Map Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="container-site">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-4">
              Our Service Area
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Serving {siteConfig.region}
            </h2>
            <p className="text-xl text-gray-600">
              Based in {siteConfig.city}, we provide services to businesses throughout
              {" "}{siteConfig.serviceArea}.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212270.28414308854!2d-117.7803964!3d33.640814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dc925c54d5f7cf%3A0xdea6c3618ff0d607!2sOrange%20County%2C%20CA!5e0!3m2!1sen!2sus!4v1738182400000!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BlueCrest Group Service Area"
            />
          </div>
        </div>
      </section>

      {/* Mobile Spacer */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
