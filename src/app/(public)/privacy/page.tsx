import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.businessName}`,
  description: `Privacy policy for ${siteConfig.businessName}. Learn how we collect, use, and protect your personal information.`,
};

export default function PrivacyPage() {
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
              <li className="text-gray-900 font-medium">Privacy Policy</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-block text-[var(--color-brand-blue)] font-semibold text-sm tracking-wide uppercase mb-4">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Privacy Policy
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  {siteConfig.businessName} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is
                  committed to protecting the personal information you share with us. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard your information
                  when you visit our website or use our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Fill out our contact form
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Request a consultation
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Subscribe to our communications
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Engage our services
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  This information may include your name, email address, phone number, company name,
                  and any other information you choose to provide.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Respond to your inquiries and provide requested services
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Communicate with you about our services
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Send you relevant information about our practice
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Improve our website and services
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[var(--color-brand-blue)] rounded-full mt-2.5 shrink-0"></div>
                    Comply with legal obligations
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
                <p className="text-gray-600 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third
                  parties except as necessary to provide our services, comply with legal requirements,
                  or protect our rights.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect the
                  security of your personal information. However, no method of transmission over
                  the internet or electronic storage is completely secure.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <p className="text-gray-600 leading-relaxed">
                  You have the right to access, correct, or delete your personal information.
                  You may also opt out of receiving marketing communications from us at any time.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have questions about this Privacy Policy or our data practices, please
                  contact us at:
                </p>
                <div className="bg-slate-50 rounded-2xl p-6">
                  <p className="font-bold text-gray-900 mb-2">{siteConfig.businessName}</p>
                  <p className="text-gray-600">
                    Email: <a href={`mailto:${siteConfig.email}`} className="text-[var(--color-brand-blue)] hover:text-[var(--color-blue-dark)] transition-colors">{siteConfig.email}</a>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the &quot;Last
                  updated&quot; date.
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
