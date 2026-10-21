import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site-config";
import { serviceCategories, getServicesByCategory } from "@/data/services";
import FooterCta from "@/components/FooterCta";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-32 pb-0">
      {/* Navy Footer Section */}
      <div className="bg-[var(--color-brand-navy)] rounded-t-[3rem] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Contact Card - Overlapping */}
            <div className="lg:col-span-4 relative -mt-32">
              <div className="footer-contact-card">
                <div className="mb-8">
                  <Image
                    src="/images/bluecrest-group-logo.png"
                    alt={`${siteConfig.businessName} Logo`}
                    width={200}
                    height={60}
                    className="h-12 w-auto brightness-0 invert"
                    priority
                  />
                </div>

                <div className="space-y-6">
                  {(() => {
                    const inner = (
                      <>
                        <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>{siteConfig.city}, {siteConfig.stateAbbr}</div>
                      </>
                    );
                    return siteConfig.googleBusinessProfileUrl ? (
                      <a href={siteConfig.googleBusinessProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-start gap-3">{inner}</div>
                    );
                  })()}

                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>{siteConfig.email}</div>
                  </a>
                </div>


              </div>
            </div>

            {/* Footer Links and Content */}
            <div className="lg:col-span-8 text-white pt-8">
              <FooterCta />

              {/* Company Links */}
              <div className="mb-12 border-b border-white/10 pb-8">
                <div className="flex flex-wrap gap-6">
                  <Link href="/" className="text-gray-300 hover:text-[var(--color-brand-blue)] transition-colors font-medium">
                    Home
                  </Link>
                  <Link href="/about" className="text-gray-300 hover:text-[var(--color-brand-blue)] transition-colors font-medium">
                    About
                  </Link>
                  <Link href="/services" className="text-gray-300 hover:text-[var(--color-brand-blue)] transition-colors font-medium">
                    Services
                  </Link>
                  <Link href="/contact" className="text-gray-300 hover:text-[var(--color-brand-blue)] transition-colors font-medium">
                    Contact
                  </Link>
                  <Link href="/service-areas" className="text-gray-300 hover:text-[var(--color-brand-blue)] transition-colors font-medium">
                    Service Areas
                  </Link>
                </div>
              </div>

              {/* All Services */}
              <div className="mb-12 border-b border-white/10 pb-8">
                <h4 className="font-semibold mb-6 text-[var(--color-brand-gold)] text-lg">All Services</h4>
                <div className="grid sm:grid-cols-3 gap-8">
                  {serviceCategories.map((category) => (
                    <div key={category.id}>
                      <Link
                        href={`/services#${category.id}`}
                        className="block mb-3 text-sm font-semibold text-white hover:text-[var(--color-brand-blue)] transition-colors"
                      >
                        {category.name}
                      </Link>
                      <ul className="space-y-2">
                        {getServicesByCategory(category.id).map((service) => (
                          <li key={service.slug}>
                            <Link
                              href={`/services/${service.slug}`}
                              className="text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors text-sm"
                            >
                              {service.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} {siteConfig.businessName}. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/sitemap.xml" className="text-gray-400 hover:text-white transition-colors">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
