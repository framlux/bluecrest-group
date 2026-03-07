"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site-config";
import { serviceCategories } from "@/data/services";
import { locations } from "@/data/locations";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const locationsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setServicesOpen(true);
    setLocationsOpen(false);
  };

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => setServicesOpen(false), 300);
  };

  const handleLocationsEnter = () => {
    if (locationsTimeoutRef.current) clearTimeout(locationsTimeoutRef.current);
    setLocationsOpen(true);
    setServicesOpen(false);
  };

  const handleLocationsLeave = () => {
    locationsTimeoutRef.current = setTimeout(() => setLocationsOpen(false), 300);
  };

  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
      if (locationsTimeoutRef.current) clearTimeout(locationsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        setLocationsOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const topLocations = locations.slice(0, 8);

  const handleCategoryClick = (categoryId: string, e: React.MouseEvent) => {
    setServicesOpen(false);
    if (pathname === "/services") {
      // If already on services page, prevent default and scroll
      e.preventDefault();
      const element = document.getElementById(categoryId);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    // If not on services page, let the Link handle navigation
    // The ServicesCategorySection component will handle scrolling after navigation
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white/90 backdrop-blur-md"} border-b border-gray-100`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/bluecrest-group-logo.png"
              alt={`${siteConfig.businessName} Logo`}
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className="text-gray-600 hover:text-[var(--color-brand-blue)] font-medium transition-colors"
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative group"
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <button
                type="button"
                className="text-gray-600 hover:text-[var(--color-brand-blue)] font-medium transition-colors inline-flex items-center gap-1 py-2"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services
                <svg
                  className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Invisible bridge to prevent hover gap issues */}
              <div
                className={`absolute top-full left-0 w-full h-4 ${servicesOpen ? 'block' : 'hidden'}`}
                onMouseEnter={handleServicesEnter}
              />

              <div
                className={`absolute top-full left-0 pt-2 transition-all duration-200 ${servicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'}`}
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-4 min-w-[320px]">
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <span className="text-xs font-semibold text-[var(--color-brand-blue)] uppercase tracking-wider">
                      Our Services
                    </span>
                  </div>
                  <div className="py-2">
                    {serviceCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/services#${category.id}`}
                        onClick={(e) => handleCategoryClick(category.id, e)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[var(--color-brand-blue)] transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 pt-3 border-t border-gray-100">
                    <Link
                      href="/services"
                      className="text-sm font-semibold text-[var(--color-brand-blue)] hover:underline"
                      onClick={() => setServicesOpen(false)}
                    >
                      View All Services
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Locations Dropdown */}
            <div
              className="relative group"
              onMouseEnter={handleLocationsEnter}
              onMouseLeave={handleLocationsLeave}
            >
              <button
                type="button"
                className="text-gray-600 hover:text-[var(--color-brand-blue)] font-medium transition-colors inline-flex items-center gap-1 py-2"
                aria-expanded={locationsOpen}
                aria-haspopup="true"
                onClick={() => setLocationsOpen(!locationsOpen)}
              >
                Service Areas
                <svg
                  className={`w-4 h-4 transition-transform ${locationsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Invisible bridge to prevent hover gap issues */}
              <div
                className={`absolute top-full left-0 w-full h-4 ${locationsOpen ? 'block' : 'hidden'}`}
                onMouseEnter={handleLocationsEnter}
              />

              <div
                className={`absolute top-full left-0 pt-2 transition-all duration-200 ${locationsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'}`}
                onMouseEnter={handleLocationsEnter}
                onMouseLeave={handleLocationsLeave}
              >
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-4 min-w-[280px]">
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <span className="text-xs font-semibold text-[var(--color-brand-blue)] uppercase tracking-wider">
                      Areas We Serve
                    </span>
                  </div>
                  <div className="py-2">
                    {topLocations.map((location) => (
                      <Link
                        key={location.slug}
                        href={`/service-areas/${location.slug}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[var(--color-brand-blue)] transition-colors"
                        onClick={() => setLocationsOpen(false)}
                      >
                        {location.name}, {location.stateAbbr}
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 pt-3 border-t border-gray-100">
                    <Link
                      href="/service-areas"
                      className="text-sm font-semibold text-[var(--color-brand-blue)] hover:underline"
                      onClick={() => setLocationsOpen(false)}
                    >
                      View All {locations.length} Service Areas
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/insights"
              className="text-gray-600 hover:text-[var(--color-brand-blue)] font-medium transition-colors"
            >
              Insights
            </Link>

            <Link
              href="/contact"
              className="text-gray-600 hover:text-[var(--color-brand-blue)] font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="btn-primary px-8 py-3 rounded-full font-semibold"
            >
              Connect Today
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain">
          <div className="max-w-7xl mx-auto px-6 py-4 pb-6">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="py-3 text-gray-700 font-medium border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                href="/about"
                className="py-3 text-gray-700 font-medium border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              <div className="py-3 border-b border-gray-100">
                <div className="font-semibold text-gray-900 mb-2">Services</div>
                <div className="pl-4 flex flex-col gap-2">
                  {serviceCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/services#${category.id}`}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        handleCategoryClick(category.id, e);
                      }}
                      className="text-gray-600 hover:text-[var(--color-brand-blue)]"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <Link
                    href="/services"
                    className="text-[var(--color-brand-blue)] font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View All Services
                  </Link>
                </div>
              </div>

              <div className="py-3 border-b border-gray-100">
                <div className="font-semibold text-gray-900 mb-2">Service Areas</div>
                <div className="pl-4 flex flex-col gap-2">
                  {topLocations.slice(0, 5).map((location) => (
                    <Link
                      key={location.slug}
                      href={`/service-areas/${location.slug}`}
                      className="text-gray-600 hover:text-[var(--color-brand-blue)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {location.name}
                    </Link>
                  ))}
                  <Link
                    href="/service-areas"
                    className="text-[var(--color-brand-blue)] font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View All Service Areas
                  </Link>
                </div>
              </div>

              <Link
                href="/insights"
                className="py-3 text-gray-700 font-medium border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Insights
              </Link>

              <Link
                href="/contact"
                className="py-3 text-gray-700 font-medium border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-4 flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="btn btn-primary w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connect Today
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
