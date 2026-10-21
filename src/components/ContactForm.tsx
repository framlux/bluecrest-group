"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_SCRIPT_ID, Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { serviceCategories, getServicesByCategory } from "@/data/services";
import { siteConfig } from "@/data/site-config";
import { isTurnstileFailed, TURNSTILE_TIMEOUT_MS } from "@/lib/turnstile-status";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

interface ContactFormProps {
  variant?: "default" | "compact";
  prefilledService?: string;
  prefilledLocation?: string;
}

export default function ContactForm({
  variant = "default",
  prefilledService,
  prefilledLocation,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: prefilledService || "",
    timeline: "",
    details: prefilledLocation ? `Interested in services for ${prefilledLocation}. ` : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const turnstileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [turnstileErrored, setTurnstileErrored] = useState(false);
  const [turnstileElapsedMs, setTurnstileElapsedMs] = useState(0);
  const turnstileFailed = isTurnstileFailed({
    siteKey: TURNSTILE_SITE_KEY,
    errored: turnstileErrored,
    elapsedMs: turnstileElapsedMs,
    hasToken: Boolean(turnstileToken),
  });

  // The library's own `scriptOptions.onError` deletes its onload callback, which makes Cloudflare warn on every
  // load. Listen for the script's error event instead (it does not bubble, so use the capture phase).
  useEffect(() => {
    const onScriptError = (event: Event) => {
      if ((event.target as Element | null)?.id === DEFAULT_SCRIPT_ID) setTurnstileErrored(true);
    };
    document.addEventListener("error", onScriptError, true);
    return () => document.removeEventListener("error", onScriptError, true);
  }, []);

  // No token 15 seconds after mount: stop waiting and offer the email fallback.
  useEffect(() => {
    const timer = setTimeout(() => setTurnstileElapsedMs(TURNSTILE_TIMEOUT_MS), TURNSTILE_TIMEOUT_MS);
    turnstileTimerRef.current = timer;
    return () => clearTimeout(timer);
  }, []);

  const handleTurnstileSuccess = (token: string) => {
    if (turnstileTimerRef.current) clearTimeout(turnstileTimerRef.current);
    setTurnstileToken(token);
    setTurnstileErrored(false);
    setTurnstileElapsedMs(0);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Phone number - only allow digits
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatPhoneDisplay = (phone: string) => {
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      setSubmitted(true);
    } catch {
      setError(`There was an error submitting your request. Please try again or email us at ${siteConfig.email}.`);
      turnstileRef.current?.reset();
      setTurnstileToken("");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`text-center ${variant === "compact" ? "py-6" : "py-12"}`}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className={`font-bold ${variant === "compact" ? "text-lg text-white" : "text-2xl text-gray-900"} mb-2`}>
          Thank You!
        </h3>
        <p className={variant === "compact" ? "text-gray-300" : "text-gray-600"}>
          We have received your message and will reach out within one business day to schedule your free 15-minute consultation.
        </p>
      </div>
    );
  }

  const inputClasses = variant === "compact"
    ? "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
    : "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition-all";

  const labelClasses = variant === "compact"
    ? "block text-sm font-medium text-gray-300 mb-1.5"
    : "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={variant === "compact" ? "" : "grid md:grid-cols-2 gap-5"}>
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Your name"
          />
        </div>

        {variant !== "compact" && (
          <div>
            <label htmlFor="company" className={labelClasses}>
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Your company"
            />
          </div>
        )}
      </div>

      <div className={variant === "compact" ? "" : "grid md:grid-cols-2 gap-5"}>
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClasses}>
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formatPhoneDisplay(formData.phone)}
            onChange={handleChange}
            className={inputClasses}
            placeholder="(555) 555-5555"
            maxLength={14}
          />
        </div>
      </div>

      <div>
        <label htmlFor="projectType" className={labelClasses}>
          Service Interest <span className="text-red-500">*</span>
        </label>
        <select
          id="projectType"
          name="projectType"
          required
          value={formData.projectType}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">Select a service</option>
          {serviceCategories.map((category) => (
            <optgroup key={category.id} label={category.name}>
              {getServicesByCategory(category.id).map((service) => (
                <option key={service.slug} value={service.name}>
                  {service.name}
                </option>
              ))}
            </optgroup>
          ))}
          <option value="Other">Other / Not Sure</option>
        </select>
      </div>

      {variant !== "compact" && (
        <>
          <div>
            <label htmlFor="timeline" className={labelClasses}>
              Timeline
            </label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="">When do you need help?</option>
              <option value="Immediately">Immediately</option>
              <option value="Within 1 month">Within 1 month</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="Just exploring">Just exploring options</option>
            </select>
          </div>

          <div>
            <label htmlFor="details" className={labelClasses}>
              Tell us about your needs
            </label>
            <textarea
              id="details"
              name="details"
              rows={4}
              value={formData.details}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Share any details about your business and what you're looking for..."
            />
          </div>
        </>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {TURNSTILE_SITE_KEY && (
        <Turnstile
          ref={turnstileRef}
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={handleTurnstileSuccess}
          onExpire={() => setTurnstileToken("")}
          onError={() => {
            setTurnstileToken("");
            setTurnstileErrored(true);
          }}
          options={{ size: "flexible" }}
        />
      )}

      {turnstileFailed && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          We couldn&apos;t load our spam check. Please email us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline hover:no-underline">
            {siteConfig.email}
          </a>
          .
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !turnstileToken}
        className={`w-full py-4 text-lg font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          variant === "compact"
            ? "bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-gold-dark)] text-white hover:from-[var(--color-brand-gold)] hover:to-[var(--color-brand-coral)] shadow-lg"
            : "bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-blue-dark)] shadow-lg"
        }`}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      <p className={`text-xs ${variant === "compact" ? "text-gray-400" : "text-gray-500"} text-center`}>
        By submitting this form, you agree to our{" "}
        <a href="/privacy" className="underline hover:no-underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
