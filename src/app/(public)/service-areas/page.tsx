import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPrimaryLocation } from "@/data/locations";
import LocationCard from "@/components/LocationCard";
import { siteConfig } from "@/data/site-config";
import { buildMetadata } from "@/lib/metadata";
import { pageMeta } from "@/data/page-meta";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata(pageMeta.serviceAreas);

export default function ServiceAreasPage() {
  const primaryLocation = getPrimaryLocation();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Service Areas", path: "/service-areas" }])} />
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/Orange-County-CA-fractional-cfo.jpg"
            alt="Orange County, California"
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
            <ol className="flex items-center gap-2 !text-white/80">
              <li>
                <Link href="/" className="!text-white/80 hover:!text-white transition-colors">Home</Link>
              </li>
              <li className="!text-white/80">/</li>
              <li className="!text-white font-medium">Service Areas</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="!text-white">Orange County</span>{" "}
              <span className="text-[var(--color-brand-gold)]">Service Areas</span>
            </h1>
            <p className="text-xl !text-white/90 leading-relaxed">
              From our base in {primaryLocation.name}, {siteConfig.businessName} provides fractional CFO
              and accounting services to businesses throughout {siteConfig.region}.
            </p>
          </div>
        </div>
      </section>

      {/* City list: plain text, only Newport Beach links (item 14) */}
      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-700 mb-8">
              Cities we serve include:
            </p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-lg text-gray-700">
              {siteConfig.serviceAreaCities.map((city) => (
                <li key={city}>
                  {city === primaryLocation.name ? (
                    <Link
                      href={`/service-areas/${primaryLocation.slug}`}
                      className="font-semibold text-[var(--color-brand-blue)] hover:text-[var(--color-blue-dark)] underline underline-offset-4"
                    >
                      {city}
                    </Link>
                  ) : (
                    city
                  )}
                </li>
              ))}
            </ul>
            <p className="text-lg text-gray-600 mt-8">
              {primaryLocation.name} is our home base, and we work with clients across the county in person or remotely.
            </p>
          </div>
          <div className="max-w-md mx-auto mt-12">
            <LocationCard location={primaryLocation} />
          </div>
        </div>
      </section>

      {/* Mobile Spacer */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
