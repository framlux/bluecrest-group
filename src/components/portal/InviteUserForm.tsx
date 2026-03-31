"use client";

import { useState } from "react";
import { inviteUser } from "@/app/(portal)/portal/admin/users/actions";

interface InviteUserFormProps {
  companies: { id: string; name: string }[];
  onClose: () => void;
}

export default function InviteUserForm({
  companies,
  onClose,
}: InviteUserFormProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await inviteUser(formData);

    if (result.error) {
      setError(result.error);
      setPending(false);
    } else {
      onClose();
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-white border border-[var(--color-gray-200)] rounded-xl text-[var(--color-gray-900)] placeholder-[var(--color-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition-all";
  const labelClass =
    "block text-sm font-semibold text-[var(--color-gray-700)] mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[var(--color-gray-900)] mb-6">
          Invite User
        </h2>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className={inputClass}
              placeholder="John Smith"
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={inputClass}
              placeholder="john@company.com"
            />
          </div>

          <div>
            <label htmlFor="role" className={labelClass}>
              Role
            </label>
            <select id="role" name="role" defaultValue="client" className={inputClass}>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {companies.length > 0 && (
            <div>
              <label className={labelClass}>Company Access</label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-[var(--color-gray-200)] rounded-xl p-3">
                {companies.map((company) => (
                  <label
                    key={company.id}
                    className="flex items-center gap-2 text-sm text-[var(--color-gray-700)] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="companyIds"
                      value={company.id}
                      className="rounded border-[var(--color-gray-300)] text-[var(--color-brand-blue)] focus:ring-[var(--color-brand-blue)]"
                    />
                    {company.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold rounded-full border border-[var(--color-gray-300)] text-[var(--color-gray-700)] hover:border-[var(--color-gray-400)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 py-3 text-sm font-semibold rounded-full bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-blue-dark)] transition-all disabled:opacity-50"
            >
              {pending ? "Inviting..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
