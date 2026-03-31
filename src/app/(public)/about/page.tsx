import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `About ${siteConfig.businessName} | ${siteConfig.city}, ${siteConfig.stateAbbr}`,
  description: `Learn about ${siteConfig.businessName} and founder ${siteConfig.founder.name}. We provide fractional CFO and accounting services to growing businesses in ${siteConfig.region}.`,
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/about-bluecrest-group-fractional-cfo.avif"
            alt="About BlueCrest Group - Fractional CFO Services"
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
              <li className="text-white font-medium">About</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block text-[var(--color-brand-gold)] font-semibold text-sm tracking-wide uppercase mb-4">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold !text-white mb-6">
              Strategic Financial Leadership for{" "}
              <span className="text-[var(--color-brand-gold)]">Growing Businesses</span>
            </h1>
            <p className="text-xl text-gray-100 leading-relaxed">
              We help companies in {siteConfig.region} build stronger financial foundations
              and make better decisions with expert fractional CFO and accounting services.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-4">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Filling the Gap Between Bookkeeping and Full-Time CFO
              </h2>
              <div className="space-y-5 text-gray-600">
                <p className="text-lg">
                  Many growing businesses reach a point where they need sophisticated
                  financial leadership but are not ready for a full-time CFO. They
                  have outgrown basic bookkeeping but lack the strategic financial
                  guidance to reach the next level.
                </p>
                <p>
                  BlueCrest Group exists to fill this gap. We provide fractional CFO,
                  controller, and accounting services that give businesses access to
                  experienced financial leadership at a fraction of the cost of
                  traditional executive hires.
                </p>
                <p>
                  Our approach is simple: understand your business deeply, provide
                  clear financial insights, and help you make better decisions. No
                  unnecessary complexity, no jargon-filled reports that sit unread.
                  Just practical financial leadership that helps your business grow.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              <h3 className="text-2xl font-bold mb-8 relative z-10">Who We Serve</h3>
              <ul className="space-y-5 relative z-10">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Growing businesses with {siteConfig.targetRevenue} in revenue seeking strategic financial guidance</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Companies preparing for fundraising, acquisition, or significant growth</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Businesses needing better financial visibility and reporting</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Entrepreneurs who want a trusted financial partner, not just a vendor</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="container-site">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <div className="aspect-[4/5] relative rounded-3xl overflow-hidden bg-gray-200 mb-6 shadow-xl">
                  <Image
                    src={siteConfig.founder.image}
                    alt={siteConfig.founder.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">{siteConfig.founder.name}</h3>
                  <p className="text-[var(--color-brand-blue)] font-semibold">{siteConfig.founder.title}</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-gray-500 hover:text-[var(--color-brand-blue)] transition-colors mt-2 inline-block"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-4">
                Our Founder
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Meet {siteConfig.founder.name.split(" ")[0]}
              </h2>
              <div className="prose prose-lg prose-gray max-w-none">
                {siteConfig.founder.longBio.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-gray-600 mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Principles That Guide Our Work
            </h2>
            <p className="text-xl text-gray-600">
              These principles guide how we work with every client and inform every
              recommendation we make.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {siteConfig.values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
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
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Schedule a free consultation to discuss how BlueCrest Group can
                support your business with strategic financial leadership.
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
