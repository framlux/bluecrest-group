import Link from "next/link";
import { siteConfig } from "@/data/site-config";

export default function NotFound() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--color-brand-navy)]/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-brand-gold)]/10 rounded-full blur-3xl"></div>

        <div className="container-site relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-9xl lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-blue)] via-[var(--color-brand-gold)] to-[var(--color-brand-blue)] leading-none">
                404
              </h1>
            </div>

            {/* Content */}
            <div className="mb-12">
              <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-4">
                Page Not Found
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Looks like this page{" "}
                <span className="text-[var(--color-brand-gold)]">doesn&apos;t exist</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                The page you&apos;re looking for may have been moved, deleted, or doesn&apos;t exist.
                Let&apos;s get you back on track with our financial services.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/"
                className="btn-primary px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Home
              </Link>
              <Link
                href="/contact"
                className="btn-outline px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Contact Us
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 lg:p-10 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Popular Pages
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  href="/services"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors">
                      Our Services
                    </div>
                    <div className="text-sm text-gray-500">Explore what we offer</div>
                  </div>
                </Link>

                <Link
                  href="/about"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors">
                      About Us
                    </div>
                    <div className="text-sm text-gray-500">Learn our story</div>
                  </div>
                </Link>

                <Link
                  href="/service-areas"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-brand-navy)] to-[var(--color-navy-dark)] rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors">
                      Service Areas
                    </div>
                    <div className="text-sm text-gray-500">Where we serve</div>
                  </div>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-brand-coral)] to-[var(--color-brand-gold)] rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors">
                      Contact Us
                    </div>
                    <div className="text-sm text-gray-500">Get in touch</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-gold)]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Need Financial Leadership?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Let&apos;s discuss how {siteConfig.businessName} can help your business thrive
                with strategic financial services.
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
