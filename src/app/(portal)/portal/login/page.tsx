"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const verify = searchParams.get("verify");
  const authError = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await signIn("email", {
        email,
        callbackUrl: "/portal/dashboard",
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Unable to send login link. Please check your email address and try again."
        );
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent || verify) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-8 text-center">
          <div className="w-16 h-16 bg-[var(--color-brand-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[var(--color-brand-blue)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-gray-900)] mb-2">
            Check your email
          </h2>
          <p className="text-[var(--color-gray-500)]">
            We sent a sign-in link to{" "}
            <span className="font-medium text-[var(--color-gray-700)]">
              {email || "your email"}
            </span>
            . Click the link to sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-brand-navy)]">
            BlueCrest
            <span className="text-[var(--color-brand-gold)]"> Portal</span>
          </h1>
          <p className="text-sm text-[var(--color-gray-500)] mt-2">
            Sign in to access your financial dashboards
          </p>
        </div>

        {authError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-6">
            {authError === "AccessDenied"
              ? "Access denied. Your email may not be registered. Contact your administrator."
              : "An error occurred. Please try again."}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[var(--color-gray-700)] mb-1.5"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[var(--color-gray-200)] rounded-xl text-[var(--color-gray-900)] placeholder-[var(--color-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition-all"
              placeholder="you@company.com"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 text-base font-semibold rounded-full bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-blue-dark)] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        <p className="text-xs text-[var(--color-gray-400)] text-center mt-6">
          Don&apos;t have an account? Contact your BlueCrest administrator.
        </p>
      </div>
    </div>
  );
}
