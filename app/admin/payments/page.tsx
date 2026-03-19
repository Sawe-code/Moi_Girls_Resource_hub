"use client";

import { useEffect, useState } from "react";
import type { AdminPayment } from "@/types";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPayments = async (searchTerm = "", selectedStatus = "all") => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      if (selectedStatus !== "all") {
        params.append("status", selectedStatus);
      }

      const res = await fetch(
        `/api/admin/payments${params.toString() ? `?${params.toString()}` : ""}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load payments");
      }

      setPayments(Array.isArray(data.payments) ? data.payments : []);
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
    fetchPayments(submittedSearch, statusFilter);
  }, [submittedSearch, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedSearch(search);
  };

  const getStatusBadge = (status: AdminPayment["status"]) => {
    if (status === "completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-600";
  };

  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-light-200 text-sm">Admin / Payments</p>
            <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
              Payment Transactions
            </h1>
            <p className="text-light-200 mt-4 max-w-2xl text-sm leading-relaxed">
              Monitor payment activity across papers and bundles from one place.
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-md items-center gap-3"
          >
            <input
              type="text"
              placeholder="Search by student, item, phone or reference"
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

      <section className="glass rounded-2xl border border-border-dark p-6 card-shadow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3>All Payments</h3>
            <p className="text-light-200 text-sm mt-1">
              {loading
                ? "Loading..."
                : `${payments.length} payment record(s) found`}
            </p>
          </div>

          <div className="w-full sm:w-[220px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-border-dark bg-white px-4 py-3 text-sm text-light-100 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-light-200 text-sm">Loading payments...</p>
          ) : payments.length === 0 ? (
            <div className="rounded-xl border border-border-dark bg-white p-6 text-center">
              <p className="text-light-100 font-semibold">No payments found</p>
              <p className="text-light-200 text-sm mt-2">
                Try a different search term or filter.
              </p>
            </div>
          ) : (
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Student
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Item
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Type
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Amount
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Phone
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-light-200">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="bg-white">
                    <td className="rounded-l-xl border-y border-l border-border-dark px-4 py-4 text-sm">
                      <p className="font-semibold text-light-100">
                        {payment.studentName}
                      </p>
                      <p className="text-light-200 text-xs mt-1">
                        {payment.studentEmail}
                      </p>
                    </td>

                    <td className="border-y border-border-dark px-4 py-4 text-sm text-light-200">
                      <p className="text-light-100 font-medium">
                        {payment.itemTitle}
                      </p>
                      <p className="text-xs text-light-200 mt-1">
                        Ref: {payment.reference}
                      </p>
                    </td>

                    <td className="border-y border-border-dark px-4 py-4 text-sm text-light-200">
                      {payment.itemType}
                    </td>

                    <td className="border-y border-border-dark px-4 py-4 text-sm font-semibold text-primary">
                      KES {payment.amount}
                    </td>

                    <td className="border-y border-border-dark px-4 py-4 text-sm text-light-200">
                      <p>{payment.phone}</p>
                      <p className="text-xs mt-1">{payment.paymentMethod}</p>
                    </td>

                    <td className="border-y border-border-dark px-4 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                          payment.status,
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td className="rounded-r-xl border-y border-r border-border-dark px-4 py-4 text-sm text-light-200">
                      {new Date(payment.createdAt).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPaymentsPage;
