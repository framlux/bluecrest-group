import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site-config";
import { services } from "@/data/services";
import { getLocationsByPopulation } from "@/data/locations";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const allServices = services;
  const allLocations = getLocationsByPopulation();

  return (
    <footer className="bg-white pt-20 pb-0">
      {/* Connect Your Business CTA */}
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-brand-navy)] mb-2">
          <span className="relative inline-block">
            <span className="absolute -inset-1 border-2 border-[var(--color-brand-gold)] rounded-full transform -rotate-2"></span>
            <span className="relative">Connect</span>
          </span>{" "}
          Your Business to Success
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          Strategic financial leadership for growing businesses
        </p>
        <Link
          href="/contact"
          className="mt-8 btn-primary px-10 py-4 rounded-full font-semibold text-lg inline-block"
        >
          Book a call now
        </Link>
      </div>

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
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.city + ", " + siteConfig.stateAbbr)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 hover:opacity-80 transition-opacity"
                  >
                    <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <div>{siteConfig.city}, {siteConfig.stateAbbr}</div>
                      <div>{siteConfig.region}</div>
                    </div>
                  </a>

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

                <div className="mt-8 pt-8 border-t border-white/20">
                  <Link
                    href="/contact"
                    className="w-full bg-[var(--color-brand-navy)] text-white py-4 rounded-full font-semibold hover:bg-[#2d4561] transition-all text-center block"
                  >
                    Book a 15-Min Call
                  </Link>
                </div>

              </div>
            </div>

            {/* Footer Links and Content */}
            <div className="lg:col-span-8 text-white pt-8">
              <Link
                href="/contact"
                className="text-[var(--color-brand-gold)] text-xl font-semibold hover:text-white transition-colors flex items-center gap-2 mb-12 inline-flex"
              >
                Connect Your Business to Success
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

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
                  <Link href="/insights" className="text-gray-300 hover:text-[var(--color-brand-blue)] transition-colors font-medium">
                    Insights
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
                  {allServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors text-sm"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* All Locations and Map */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* All Locations */}
                <div>
                  <h4 className="font-semibold mb-6 text-[var(--color-brand-gold)] text-lg">Service Areas</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                    {allLocations.map((location) => (
                      <Link
                        key={location.slug}
                        href={`/service-areas/${location.slug}`}
                        className="text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors text-sm"
                      >
                        {location.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div>
                  <h4 className="font-semibold mb-6 text-[var(--color-brand-gold)] text-lg">Our Service Area</h4>
                  <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212270.28414308854!2d-117.7803964!3d33.640814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dc925c54d5f7cf%3A0xdea6c3618ff0d607!2sOrange%20County%2C%20CA!5e0!3m2!1sen!2sus!4v1738182400000!5m2!1sen!2sus"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Orange County Service Area"
                      className="w-full"
                    />
                  </div>
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
                {currentYear} {siteConfig.businessName}. All rights reserved.
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
