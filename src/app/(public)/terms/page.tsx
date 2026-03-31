import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `Terms of Service | ${siteConfig.businessName}`,
  description: `Terms of service for ${siteConfig.businessName}. Review our terms and conditions for using our fractional CFO and accounting services.`,
};

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--color-brand-blue)]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--color-brand-navy)]/15 rounded-full blur-3xl"></div>

        <div className="container-site relative z-10">
          <nav className="mb-8 text-sm">
            <ol className="flex items-center gap-2 text-gray-500">
              <li>
                <Link href="/" className="hover:text-[var(--color-brand-blue)] transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">Terms of Service</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-4">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-28">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-500 mb-10">
              <em>Last updated: January 2025</em>
            </p>

            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing or using the services of {siteConfig.businessName} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Services</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {siteConfig.businessName} provides fractional CFO, accounting, and business consulting services. Our services include but are not limited to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Financial planning and analysis
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Bookkeeping and accounting services
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Financial reporting and analysis
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Strategic financial consulting
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Tax planning and preparation support
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Responsibilities</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  As a client, you agree to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Provide accurate and complete information necessary for us to perform our services
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Timely payment of fees as agreed upon in our service agreement
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Maintain confidentiality of any login credentials or access information we provide
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Comply with all applicable laws and regulations
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Fees and Payment</h2>
                <p className="text-gray-600 leading-relaxed">
                  Service fees will be outlined in your individual service agreement. Payment terms, including due dates and accepted payment methods, will be specified in your agreement. Late payments may be subject to interest charges as permitted by law.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Confidentiality</h2>
                <p className="text-gray-600 leading-relaxed">
                  We maintain strict confidentiality regarding all client information and business matters. We will not disclose any confidential information to third parties except as required by law or as authorized by you in writing.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our services are provided &quot;as is&quot; and &quot;as available.&quot; We make no warranties, express or implied, regarding our services. Our liability is limited to the fees paid for the specific service in question. We are not liable for any indirect, incidental, or consequential damages.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Standards</h2>
                <p className="text-gray-600 leading-relaxed">
                  We adhere to professional accounting and financial consulting standards. However, we are not a substitute for legal, tax, or investment advice. We recommend consulting with appropriate professionals for matters outside our scope of services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
                <p className="text-gray-600 leading-relaxed">
                  Either party may terminate the service agreement with appropriate notice as specified in your individual agreement. Upon termination, you remain responsible for payment of fees for services rendered up to the termination date.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                  All reports, analyses, and other deliverables created by us remain our intellectual property. You are granted a license to use these materials for your internal business purposes only. You may not reproduce, distribute, or use these materials for any other purpose without our written consent.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                  These terms are governed by the laws of the State of {siteConfig.state}. Any disputes arising from these terms or our services will be resolved in the courts of {siteConfig.state}.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-slate-50 rounded-2xl p-6">
                  <p className="font-bold text-gray-900 mb-2">{siteConfig.businessName}</p>
                  <p className="text-gray-600">
                    Email: <a href={`mailto:${siteConfig.email}`} className="text-[var(--color-brand-blue)] hover:text-[var(--color-blue-dark)] transition-colors">{siteConfig.email}</a>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these Terms of Service at any time. We will notify existing clients of material changes. Continued use of our services after changes constitutes acceptance of the modified terms.
                </p>
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
