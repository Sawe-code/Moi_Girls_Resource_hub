"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  StoredUser,
  AdminOverviewStats,
  AdminRecentPayment,
  AdminRecentUser,
  AdminLatestPaper,
  AdminPaymentSummary,
  AdminRevenueChartItem,
} from "@/types";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  const [stats, setStats] = useState<AdminOverviewStats>({
    totalStudents: 0,
    totalPapers: 0,
    totalBundles: 0,
    totalRevenue: 0,
  });

  const [paymentSummary, setPaymentSummary] = useState<AdminPaymentSummary>({
    completed: 0,
    pending: 0,
    failed: 0,
  });

  const [revenueChart, setRevenueChart] = useState<AdminRevenueChartItem[]>([]);
  const [recentPayments, setRecentPayments] = useState<AdminRecentPayment[]>(
    [],
  );
  const [recentUsers, setRecentUsers] = useState<AdminRecentUser[]>([]);
  const [latestPapers, setLatestPapers] = useState<AdminLatestPaper[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        console.log("Me Response: ", data);

        if (!res.ok) {
          throw new Error(data.error || "Failed to load user");
        }

        setUser(data.user);
      } catch {
        setUser(null);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/admin/overview", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load admin overview");
        }

        setStats(
          data.stats || {
            totalStudents: 0,
            totalPapers: 0,
            totalBundles: 0,
            totalRevenue: 0,
          },
        );

        setPaymentSummary(
          data.paymentSummary || {
            completed: 0,
            pending: 0,
            failed: 0,
          },
        );

        setRevenueChart(
          Array.isArray(data.revenueChart) ? data.revenueChart : [],
        );
        setRecentPayments(
          Array.isArray(data.recentPayments) ? data.recentPayments : [],
        );
        setRecentUsers(Array.isArray(data.recentUsers) ? data.recentUsers : []);
        setLatestPapers(
          Array.isArray(data.latestPapers) ? data.latestPapers : [],
        );
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

    fetchAdminOverview();
  }, []);

  const statCards = [
    { label: "Total Students", value: String(stats.totalStudents) },
    { label: "Total Papers", value: String(stats.totalPapers) },
    { label: "Total Bundles", value: String(stats.totalBundles) },
    { label: "Total Revenue", value: `KES ${stats.totalRevenue}` },
  ];

  const paymentCards = [
    {
      label: "Completed Payments",
      value: String(paymentSummary.completed),
      textClass: "text-green-600",
    },
    {
      label: "Pending Payments",
      value: String(paymentSummary.pending),
      textClass: "text-yellow-600",
    },
    {
      label: "Failed Payments",
      value: String(paymentSummary.failed),
      textClass: "text-red-500",
    },
  ];

  const maxRevenue = Math.max(...revenueChart.map((item) => item.revenue), 1);

  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-light-200 text-base capitalize">
              {user?.isFirstLogin
                ? `Welcome, ${user?.name}`
                : `Welcome back, ${user?.name}`}
            </p>

            <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
              {user?.isFirstLogin
                ? "Welcome to the Admin Dashboard"
                : "Admin Dashboard"}
            </h1>

            <p className="text-light-200 mt-4 max-w-2xl text-sm leading-relaxed">
              {user?.isFirstLogin
                ? "You can now manage examination resources, monitor payments, create bundles, and oversee student access from this control panel."
                : "Manage examination resources, monitor payments, and oversee student access from one central control panel."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/papers"
              className="inline-flex items-center justify-center rounded-full whitespace-nowrap bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Add New Paper
            </Link>

            <Link
              href="/admin/bundles"
              className="inline-flex items-center justify-center cta-secondary whitespace-nowrap text-sm"
            >
              Create Bundle
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <section className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <p className="text-red-500 text-sm">{error}</p>
        </section>
      )}

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <div
            key={item.label}
            className="glass rounded-2xl border border-border-dark p-6 card-shadow"
          >
            <p className="text-light-200 text-sm">{item.label}</p>
            <p className="mt-3 text-primary text-3xl font-bold">
              {loading ? "..." : item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {paymentCards.map((item) => (
          <div
            key={item.label}
            className="glass rounded-2xl border border-border-dark p-6 card-shadow"
          >
            <p className="text-light-200 text-sm">{item.label}</p>
            <p className={`mt-3 text-3xl font-bold ${item.textClass}`}>
              {loading ? "..." : item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="glass rounded-2xl border border-border-dark p-6 card-shadow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3>Revenue Overview</h3>
            <p className="text-light-200 text-sm mt-1">
              Monthly completed payment totals
            </p>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="text-light-200 text-sm">Loading chart...</p>
          ) : revenueChart.length === 0 ? (
            <div className="rounded-xl border border-border-dark bg-white p-5">
              <p className="text-light-100 font-semibold">
                No revenue data yet
              </p>
              <p className="text-light-200 text-sm mt-1">
                Completed payments will appear here once transactions begin.
              </p>
            </div>
          ) : (
            <div className="flex items-end gap-4 overflow-x-auto pb-2">
              {revenueChart.map((item) => {
                const height = `${Math.max((item.revenue / maxRevenue) * 220, 24)}px`;

                return (
                  <div
                    key={item.month}
                    className="flex min-w-[90px] flex-col items-center gap-3"
                  >
                    <div className="text-xs font-semibold text-light-100">
                      KES {item.revenue}
                    </div>

                    <div className="flex h-[240px] items-end">
                      <div
                        className="w-14 rounded-t-xl bg-primary transition-all duration-300"
                        style={{ height }}
                      />
                    </div>

                    <div className="text-xs text-light-200">{item.month}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3>Recent Payments</h3>
              <p className="text-light-200 text-sm mt-1">
                Latest completed transactions
              </p>
            </div>

            <Link
              href="/admin/payments"
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            {loading ? (
              <p className="text-light-200 text-sm">Loading payments...</p>
            ) : recentPayments.length === 0 ? (
              <div className="rounded-xl border border-border-dark bg-white p-5">
                <p className="text-light-100 font-semibold">
                  No recent payments
                </p>
                <p className="text-light-200 text-sm mt-1">
                  Completed transactions will appear here.
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
                      Amount
                    </th>
                    <th className="text-left text-xs font-semibold text-light-200">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="bg-white">
                      <td className="rounded-l-xl border-y border-l border-border-dark px-4 py-4 text-sm text-light-100">
                        {payment.name}
                      </td>
                      <td className="border-y border-border-dark px-4 py-4 text-sm text-light-200">
                        {payment.item}
                      </td>
                      <td className="border-y border-border-dark px-4 py-4 text-sm font-semibold text-primary">
                        {payment.amount}
                      </td>
                      <td className="rounded-r-xl border-y border-r border-border-dark px-4 py-4 text-sm text-light-200">
                        {new Date(payment.date).toLocaleDateString("en-KE", {
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
        </div>

        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div>
            <h3>Quick Actions</h3>
            <p className="text-light-200 text-sm mt-1">
              Administrative shortcuts
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <Link
              href="/admin/papers"
              className="rounded-xl border border-border-dark bg-white px-5 py-4 text-sm font-semibold text-light-100 transition hover:border-primary hover:text-primary"
            >
              Upload New Paper
            </Link>

            <Link
              href="/admin/bundles"
              className="rounded-xl border border-border-dark bg-white px-5 py-4 text-sm font-semibold text-light-100 transition hover:border-primary hover:text-primary"
            >
              Create Revision Bundle
            </Link>

            <Link
              href="/admin/users"
              className="rounded-xl border border-border-dark bg-white px-5 py-4 text-sm font-semibold text-light-100 transition hover:border-primary hover:text-primary"
            >
              View Registered Students
            </Link>

            <Link
              href="/admin/payments"
              className="rounded-xl border border-border-dark bg-white px-5 py-4 text-sm font-semibold text-light-100 transition hover:border-primary hover:text-primary"
            >
              Review Payments
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3>Recent Users</h3>
              <p className="text-light-200 text-sm mt-1">
                Newly registered student accounts
              </p>
            </div>

            <Link
              href="/admin/users"
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-light-200 text-sm">Loading users...</p>
            ) : recentUsers.length === 0 ? (
              <div className="rounded-xl border border-border-dark bg-white p-5">
                <p className="text-light-100 font-semibold">No recent users</p>
                <p className="text-light-200 text-sm mt-1">
                  New student registrations will appear here.
                </p>
              </div>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-border-dark bg-white p-5"
                >
                  <p className="text-light-100 font-semibold">{user.name}</p>
                  <p className="text-light-200 text-sm mt-1">{user.email}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3>Latest Papers</h3>
              <p className="text-light-200 text-sm mt-1">
                Recently uploaded examination resources
              </p>
            </div>

            <Link
              href="/admin/papers"
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-light-200 text-sm">Loading papers...</p>
            ) : latestPapers.length === 0 ? (
              <div className="rounded-xl border border-border-dark bg-white p-5">
                <p className="text-light-100 font-semibold">No papers yet</p>
                <p className="text-light-200 text-sm mt-1">
                  Newly uploaded papers will appear here.
                </p>
              </div>
            ) : (
              latestPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="rounded-xl border border-border-dark bg-white p-5"
                >
                  <p className="text-light-100 font-semibold">{paper.title}</p>
                  <p className="text-light-200 text-sm mt-1">{paper.subject}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
