"use client";

import { useState } from "react";
import InviteUserForm from "@/components/portal/InviteUserForm";
import { removeUser } from "./actions";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "admin" | "client";
  createdAt: Date;
}

export default function UsersClient({
  users,
  companies,
}: {
  users: User[];
  companies: { id: string; name: string }[];
}) {
  const [showInvite, setShowInvite] = useState(false);

  const handleRemove = async (id: string, email: string) => {
    if (!confirm(`Remove user "${email}"? This cannot be undone.`)) return;
    await removeUser(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-gray-900)]">
          Users
        </h1>
        <button
          onClick={() => setShowInvite(true)}
          className="btn-primary text-sm px-6 py-2.5"
        >
          Invite User
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-12 text-center">
          <p className="text-[var(--color-gray-500)]">
            No users yet. Invite your first user.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-gray-100)]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--color-gray-500)]">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--color-gray-500)]">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--color-gray-500)] hidden md:table-cell">
                  Role
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--color-gray-500)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[var(--color-gray-50)] hover:bg-[var(--color-gray-50)] transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-[var(--color-gray-900)]">
                    {user.name || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-gray-500)]">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-[var(--color-brand-navy)]/10 text-[var(--color-brand-navy)]"
                          : "bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(user.id, user.email)}
                      className="text-sm text-[var(--color-brand-coral)] hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showInvite && (
        <InviteUserForm
          companies={companies}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}
