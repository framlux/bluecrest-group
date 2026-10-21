import Link from "next/link";
import { caseStudies } from "@/data/case-studies";

/** Case study cards for the homepage, Newport Beach, and (minus the current one) each case study. */
export default function CaseStudyCards({ excludeSlug }: { excludeSlug?: string } = {}) {
  const shown = caseStudies.filter((study) => study.slug !== excludeSlug);
  return (
    <div className={`grid gap-6 ${shown.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
      {shown.map((study) => (
        <div key={study.slug} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 lg:p-8 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{study.card.heading}</h3>
          <p className="text-gray-600 mb-6 flex-1">{study.card.text}</p>
          <Link
            href={`/case-studies/${study.slug}`}
            className="inline-flex items-center gap-2 text-[var(--color-brand-blue)] font-semibold hover:text-[var(--color-blue-dark)] transition-colors"
          >
            Read the case study
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ))}
    </div>
  );
}
