"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PurchasePayment } from "@/types";

const PurchasesPage = () => {
  const [payments, setPayments] = useState<PurchasePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/purchases", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load purchases");
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

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
          <p className="text-light-200 text-sm">Loading your purchases...</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
          <p className="text-red-500 text-sm">{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <p className="text-light-200 text-sm">Purchase History</p>
        <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
          Your Recent Transactions
        </h1>
        <p className="text-light-200 mt-4 max-w-2xl text-sm leading-relaxed">
          Review your completed, pending, and failed payments for papers and
          bundles.
        </p>
      </section>

      {payments.length === 0 ? (
        <section className="glass rounded-2xl border border-border-dark p-8 card-shadow text-center">
          <p className="text-light-100 font-semibold">No purchases yet</p>
          <p className="text-light-200 text-sm mt-2">
            Your payments will appear here once you start buying papers or
            bundles.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {payments.map((payment) => {
            const itemTitle =
              payment.paper?.title || payment.bundle?.title || "Unknown item";

            const itemType = payment.paper
              ? "Paper"
              : payment.bundle
                ? "Bundle"
                : "Item";

            return (
              <div
                key={payment._id}
                className="glass rounded-2xl border border-border-dark p-5 card-shadow"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="pill">{itemType}</span>
                      <span
                        className={`text-xs font-semibold ${
                          payment.status === "completed"
                            ? "text-green-600"
                            : payment.status === "pending"
                              ? "text-yellow-600"
                              : "text-red-500"
                        }`}
                      >
                        {payment.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-light-100 text-lg font-semibold mt-3">
                      {itemTitle}
                    </h4>

                    <div className="text-light-200 text-sm mt-2 space-y-1">
                      <p>Phone: {payment.phone}</p>
                      <p>Reference: {payment.reference}</p>
                      <p>
                        Date:{" "}
                        {new Date(payment.createdAt).toLocaleDateString(
                          "en-KE",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <p className="text-light-100 text-lg font-bold">
                      KES {payment.amount}
                    </p>

                    {payment.paper && (
                      <Link
                        href={`/papers/${payment.paper._id}`}
                        className="text-primary text-sm font-semibold hover:underline"
                      >
                        View Paper →
                      </Link>
                    )}

                    {payment.bundle && (
                      <Link
                        href={`/bundles/${payment.bundle._id}`}
                        className="text-primary text-sm font-semibold hover:underline"
                      >
                        View Bundle →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default PurchasesPage;
