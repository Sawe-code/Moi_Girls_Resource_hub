"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StoredUser, Paper, PurchasePayment, Bundle } from "@/types";

const StudentDashboard = () => {
  const [user, setUser] = useState<StoredUser | null>(null);

  const [stats, setStats] = useState([
    { label: "Papers Purchased", value: "0" },
    { label: "Bundles Owned", value: "0" },
    { label: "Total Spent", value: "KES 0" },
    { label: "Recent Purchases", value: "0" },
  ]);

  const [recentPurchases, setRecentPurchases] = useState<PurchasePayment[]>([]);
  const [libraryPreview, setLibraryPreview] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const [statsRes, purchasesRes, libraryRes] = await Promise.all([
          fetch("/api/dashboard/stats", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("/api/purchases", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("/api/library", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const statsData = await statsRes.json();
        const purchasesData = await purchasesRes.json();
        const libraryData = await libraryRes.json();

        if (statsRes.ok && statsData.stats) {
          setStats([
            {
              label: "Papers Purchased",
              value: String(statsData.stats.papersPurchased ?? 0),
            },
            {
              label: "Bundles Owned",
              value: String(statsData.stats.bundlesOwned ?? 0),
            },
            {
              label: "Total Spent",
              value: `KES ${statsData.stats.totalSpent ?? 0}`,
            },
            {
              label: "Recent Purchases",
              value: String(statsData.stats.recentPurchases ?? 0),
            },
          ]);
        }

        if (purchasesRes.ok && Array.isArray(purchasesData.payments)) {
          setRecentPurchases(purchasesData.payments.slice(0, 2));
        }

        if (libraryRes.ok && Array.isArray(libraryData.papers)) {
          setLibraryPreview(libraryData.papers.slice(0, 3));
        }
      } catch (error) {
        console.error("Dashboard data fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-light-200 text-sm">
              {user?.isFirstLogin
                ? `Welcome, ${user?.name}`
                : `Welcome back, ${user?.name}`}
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
              {user?.isFirstLogin
                ? "Start your revision journey and explore your available resources."
                : "Continue with your revision."}
            </h1>
            <p className="text-light-200 mt-4 max-w-2xl text-sm leading-relaxed">
              Access your purchased resources, download past papers, and keep
              track of your revision materials from one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/library"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-primary px-5 py-2.5 md:px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Open My Library
            </Link>

            <Link
              href="/papers"
              className="inline-flex items-center justify-center whitespace-nowrap cta-secondary text-sm"
            >
              Browse Papers
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="glass rounded-2xl border border-border-dark p-6 card-shadow"
          >
            <p className="text-light-200 text-sm">{item.label}</p>
            <p className="mt-3 text-primary text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3>My Library</h3>
              <p className="text-light-200 text-sm mt-1">
                Quick access to your purchased resources
              </p>
            </div>

            <Link
              href="/dashboard/library"
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-light-200 text-sm">Loading library...</p>
            ) : libraryPreview.length === 0 ? (
              <div className="rounded-xl border border-border-dark bg-white p-5">
                <p className="text-light-100 font-semibold">No papers yet</p>
                <p className="text-light-200 text-sm mt-1">
                  Purchased papers will appear here.
                </p>
              </div>
            ) : (
              libraryPreview.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-xl border border-border-dark bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-light-100 font-semibold">{item.title}</p>
                    <p className="text-light-200 text-sm mt-1">
                      {item.subject} • {item.year}
                    </p>
                  </div>

                  <Link
                    href={`/papers/${item._id}`}
                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Open
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div>
            <h3>Recent Purchases</h3>
            <p className="text-light-200 text-sm mt-1">
              Your latest paid resources
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-light-200 text-sm">Loading purchases...</p>
            ) : recentPurchases.length === 0 ? (
              <div className="rounded-xl border border-border-dark bg-white p-5">
                <p className="text-light-100 font-semibold">No purchases yet</p>
                <p className="text-light-200 text-sm mt-1">
                  Your latest purchases will appear here.
                </p>
              </div>
            ) : (
              recentPurchases.map((item) => {
                const title =
                  item.paper?.title || item.bundle?.title || "Unknown item";
                const type = item.paper
                  ? "Paper"
                  : item.bundle
                    ? "Bundle"
                    : "Item";

                return (
                  <div
                    key={item._id}
                    className="rounded-xl border border-border-dark bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-light-100 font-semibold">{title}</p>
                        <p className="text-light-200 text-sm mt-1">{type}</p>
                      </div>

                      <span className="pill whitespace-nowrap">
                        KES {item.amount}
                      </span>
                    </div>

                    <p className="text-light-200 text-sm mt-4">
                      Purchased on{" "}
                      {new Date(item.createdAt).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <Link
            href="/dashboard/purchases"
            className="mt-6 inline-flex text-primary text-sm font-semibold hover:underline"
          >
            View purchase history →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
