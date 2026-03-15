"use client";

import { useEffect, useState } from "react";
import type { AdminUser } from "@/types";

const USERS_PER_PAGE = 10;

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [updatingRoleUserId, setUpdatingRoleUserId] = useState<string | null>(
    null,
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const getUserStatus = (user: AdminUser) => {
    if (!user.lastLoginAt || user.hasLoggedInBefore === false) {
      return {
        label: "Never Logged In",
        color: "bg-yellow-100 text-yellow-700",
      };
    }

    const lastLogin = new Date(user.lastLoginAt);
    const now = new Date();
    const diffDays =
      (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays <= 30) {
      return {
        label: "Active",
        color: "bg-green-100 text-green-700",
      };
    }

    return {
      label: "Inactive",
      color: "bg-red-100 text-red-600",
    };
  };

  const fetchUsers = async (searchTerm = "", pageNumber = 1) => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as admin.");
      }

      const params = new URLSearchParams();

      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      params.append("page", String(pageNumber));
      params.append("limit", String(USERS_PER_PAGE));

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load users");
      }

      setUsers(Array.isArray(data.users) ? data.users : []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalUsers(data.pagination?.totalUsers || 0);
      setPage(data.pagination?.page || 1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(submittedSearch, page);
  }, [page, submittedSearch]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setSubmittedSearch(search);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingUserId(userId);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as admin.");
      }

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      fetchUsers(submittedSearch, page);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setDeletingUserId(null);
    }
  };

  const handlePromoteToAdmin = async (userId: string, userName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to make ${userName} an admin?`,
    );

    if (!confirmed) return;

    setUpdatingRoleUserId(userId);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as admin.");
      }

      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: "admin",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update user role");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: "admin" } : user,
        ),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setUpdatingRoleUserId(null);
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-light-200 text-sm">Admin / Users</p>
            <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
              Registered Students
            </h1>
            <p className="text-light-200 mt-4 max-w-2xl text-sm leading-relaxed">
              View and manage student accounts registered on the portal.
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-md items-center gap-3"
          >
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border-dark bg-white px-4 py-3 text-sm text-light-100 outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {error && (
        <section className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <p className="text-red-500 text-sm">{error}</p>
        </section>
      )}

      <section className="glass rounded-2xl border border-border-dark p-6 card-shadow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3>All Students</h3>
            <p className="text-light-200 text-sm mt-1">
              {loading
                ? "Loading..."
                : `${totalUsers} student account(s) found`}
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-light-200 text-sm">Loading users...</p>
          ) : users.length === 0 ? (
            <div className="rounded-xl border border-border-dark bg-white p-6 text-center">
              <p className="text-light-100 font-semibold">No users found</p>
              <p className="text-light-200 text-sm mt-2">
                Try another search term or check back later.
              </p>
            </div>
          ) : (
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Email
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Role
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Joined
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Last Login
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const status = getUserStatus(user);

                  return (
                    <tr key={user._id} className="bg-white">
                      <td className="rounded-l-xl border-y border-l border-border-dark px-4 py-4 text-sm font-semibold text-light-100">
                        {user.name}
                      </td>

                      <td className="border-y border-border-dark px-4 py-4 text-sm text-light-200">
                        {user.email}
                      </td>

                      <td className="border-y border-border-dark px-4 py-4 text-sm capitalize text-light-200">
                        {user.role}
                      </td>

                      <td className="border-y border-border-dark px-4 py-4 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="border-y border-border-dark px-4 py-4 text-sm text-light-200">
                        {new Date(user.createdAt).toLocaleDateString("en-KE", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      <td className="border-y border-border-dark px-4 py-4 text-sm text-light-200">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString(
                              "en-KE",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "Never"}
                      </td>

                      <td className="rounded-r-xl border-y border-r border-border-dark px-4 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {user.role !== "admin" && (
                            <button
                              type="button"
                              onClick={() =>
                                handlePromoteToAdmin(user._id, user.name)
                              }
                              disabled={updatingRoleUserId === user._id}
                              className="rounded-lg border border-primary/30 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-50"
                            >
                              {updatingRoleUserId === user._id
                                ? "Updating..."
                                : "Make Admin"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteUser(user._id, user.name)
                            }
                            disabled={deletingUserId === user._id}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingUserId === user._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-light-200 text-sm">
              Page {page} of {totalPages}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="rounded-xl border border-border-dark bg-white px-4 py-2 text-sm font-semibold text-light-100 transition hover:border-primary hover:text-primary disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="rounded-xl border border-border-dark bg-white px-4 py-2 text-sm font-semibold text-light-100 transition hover:border-primary hover:text-primary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminUsersPage;
