import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { caseStudies, getCaseStudyBySlug } from "@/data/case-studies";
import { getServiceBySlug, type Service } from "@/data/services";
import ContactCta from "@/components/ContactCta";
import CaseStudyCards from "@/components/CaseStudyCards";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/metadata";
import { pageMeta } from "@/data/page-meta";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return { title: pageMeta.notFound.title };
  }

  return buildMetadata({
    title: study.title,
    absoluteTitle: true,
    description: study.description,
    path: `/case-studies/${study.slug}`,
    type: "article",
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const path = `/case-studies/${study.slug}`;
  const related = study.relatedSlugs.map(getServiceBySlug).filter((s): s is Service => Boolean(s));
  const schemas = [
    articleSchema({
      headline: study.h1,
      description: study.description,
      path,
      datePublished: study.datePublished,
      dateModified: study.updatedAt,
    }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: study.h1, path }]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl"></div>

        <div className="container-site relative z-10">
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 !text-white/80">
              <li>
                <Link href="/" className="!text-white/80 hover:!text-white transition-colors">Home</Link>
              </li>
              <li className="!text-white/80">/</li>
              <li className="!text-white font-medium">{study.h1}</li>
            </ol>
          </nav>
          <h1 className="max-w-4xl text-4xl md:text-5xl font-bold !text-white">{study.h1}</h1>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-50 rounded-3xl border border-gray-100 p-6 lg:p-8 mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">At a Glance</h2>
              <dl className="space-y-4">
                {study.atAGlance.map((item) => (
                  <div key={item.label} className="sm:grid sm:grid-cols-[8rem_1fr] sm:gap-4">
                    <dt className="font-semibold text-[var(--color-brand-navy)]">{item.label}</dt>
                    <dd className="text-gray-700">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{study.challenge}</p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">What We Did</h2>
              {study.whatWeDidIntro && <p className="text-gray-600 text-lg leading-relaxed mb-6">{study.whatWeDidIntro}</p>}
              <ul className="space-y-3 list-disc pl-6 text-gray-700 text-lg">
                {study.whatWeDid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">The Result</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{study.result}</p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Related Services</h2>
              <ul className="space-y-3">
                {related.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 text-[var(--color-brand-blue)] hover:text-[var(--color-blue-dark)] font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Other case studies, then the page's own ask */}
      <section className="pb-20 lg:pb-28">
        <div className="container-site">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">More Client Results</h2>
          <CaseStudyCards excludeSlug={study.slug} />
          <div className="mt-16 text-center">
              <p className="text-lg text-gray-600 mb-6">Facing a similar challenge? We&apos;d be glad to hear about it.</p>
              <ContactCta
                label="Contact Us"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-brand-blue)] text-white rounded-full font-semibold hover:bg-[var(--color-blue-dark)] transition-colors shadow-lg"
              />
          </div>
        </div>
      </section>

      {/* Mobile Spacer */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
