"use client";

import { useState } from "react";
import { grantAccess, revokeAccess } from "./actions";

interface CompanyAccessClientProps {
  companyId: string;
  companyUsers: { id: string; name: string | null; email: string; role: "admin" | "client" }[];
  availableUsers: { id: string; name: string | null; email: string }[];
}

export default function CompanyAccessClient({
  companyId,
  companyUsers,
  availableUsers,
}: CompanyAccessClientProps) {
  const [selectedUserId, setSelectedUserId] = useState("");

  const handleGrant = async () => {
    if (!selectedUserId) return;
    await grantAccess(selectedUserId, companyId);
    setSelectedUserId("");
  };

  const handleRevoke = async (userId: string) => {
    if (!confirm("Remove access for this user?")) return;
    await revokeAccess(userId, companyId);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-6">
      <h2 className="text-lg font-semibold text-[var(--color-gray-900)] mb-4">
        User Access
      </h2>

      {/* Add user */}
      {availableUsers.length > 0 && (
        <div className="flex gap-2 mb-4">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 px-3 py-2 border border-[var(--color-gray-200)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]"
          >
            <option value="">Select a user...</option>
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name || u.email}
              </option>
            ))}
          </select>
          <button
            onClick={handleGrant}
            disabled={!selectedUserId}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-blue-dark)] disabled:opacity-50 transition-all"
          >
            Add
          </button>
        </div>
      )}

      {/* User list */}
      {companyUsers.length === 0 ? (
        <p className="text-sm text-[var(--color-gray-500)]">
          No users have access to this company yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {companyUsers.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--color-gray-50)] transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-gray-900)]">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-[var(--color-gray-500)]">
                  {user.email} &middot; {user.role}
                </p>
              </div>
              <button
                onClick={() => handleRevoke(user.id)}
                className="text-xs text-[var(--color-brand-coral)] hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
