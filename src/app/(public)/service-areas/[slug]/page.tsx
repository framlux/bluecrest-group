import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { locations, getLocationBySlug, getLocationImagePath } from "@/data/locations";
import { serviceCategories } from "@/data/services";
import ContactForm from "@/components/ContactForm";
import ContactCta from "@/components/ContactCta";
import CaseStudyCards from "@/components/CaseStudyCards";
import { getTestimonial } from "@/data/testimonials";
import { buildMetadata } from "@/lib/metadata";
import { pageMeta } from "@/data/page-meta";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    return { title: pageMeta.notFound.title };
  }

  // No description: Google builds the snippet from the page intro (item 16).
  return buildMetadata({
    title: `Fractional CFO & Accounting Services in ${location.name}, ${location.stateAbbr}`,
    path: `/service-areas/${location.slug}`,
  });
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const path = `/service-areas/${location.slug}`;
  const testimonial = getTestimonial("michael-royer");

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Service Areas", path: "/service-areas" }, { name: location.name, path }])} />
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getLocationImagePath(location)}
            alt={`${location.name}, ${location.stateAbbr}`}
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
              <li>
                <Link href="/service-areas" className="!text-white/80 hover:!text-white transition-colors">Service Areas</Link>
              </li>
              <li className="!text-white/80">/</li>
              <li className="!text-white font-medium">{location.name}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block !text-white font-semibold text-sm tracking-wide uppercase mb-4">
              Service Area
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold !text-white mb-8">
              Fractional CFO and Accounting in{" "}
              <span className="text-[var(--color-brand-gold)]">{location.name}, {location.stateAbbr}</span>
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
            <div className="lg:col-span-2">
              <p className="text-gray-600 text-lg leading-relaxed mb-12">{location.intro}</p>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Services</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {serviceCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/services#${category.id}`}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-soft p-6 hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
                  >
                    <h3 className="font-bold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </Link>
                ))}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">Recent Client Work</h2>
              <CaseStudyCards stacked />

              <figure className="mt-12 bg-slate-50 rounded-2xl border border-gray-100 p-6 lg:p-8">
                <blockquote className="text-gray-700 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-gray-900">{testimonial.name}</span>
                  <span className="text-gray-600">, {testimonial.role}</span>
                </figcaption>
              </figure>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Get Started Today
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Schedule your free 15-minute consultation to discuss your business&apos;s financial needs.
                  </p>
                  <ContactForm variant="default" prefilledLocation={location.name} />
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
