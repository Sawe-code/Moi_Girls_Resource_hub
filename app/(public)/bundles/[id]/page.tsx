"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { BundleDetails } from "@/types";

const BundleDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [bundle, setBundle] = useState<BundleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
    setHasCheckedAuth(true);
  }, []);

  useEffect(() => {
    const fetchBundle = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/bundles/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch bundle");
        }

        setBundle(data.bundle || null);
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

    if (id) {
      fetchBundle();
    }
  }, [id]);

  const handlePayment = async () => {
    setPaymentMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setPaymentMessage("Please log in before making payment.");
      return;
    }

    if (!phone.trim()) {
      setPaymentMessage("Please enter your M-Pesa phone number.");
      return;
    }

    if (!bundle) {
      setPaymentMessage("Bundle details are unavailable.");
      return;
    }

    setPaymentLoading(true);

    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bundleId: bundle._id,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      setPaymentMessage(
        data.message || "M-Pesa prompt sent to your phone successfully."
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPaymentMessage(err.message);
      } else {
        setPaymentMessage("Something went wrong while starting payment.");
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const savePct =
    bundle && bundle.oldPrice > bundle.price
      ? Math.round(((bundle.oldPrice - bundle.price) / bundle.oldPrice) * 100)
      : 0;

  if (loading) {
    return (
      <main>
        <section className="mt-10">
          <p className="text-light-200 text-sm">Loading bundle...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section className="mt-10 glass rounded-2xl border border-border-dark p-8 card-shadow">
          <p className="text-red-500 text-sm">{error}</p>
        </section>
      </main>
    );
  }

  if (!bundle) {
    return (
      <main>
        <section className="mt-10 glass rounded-2xl border border-border-dark p-8 card-shadow">
          <p className="text-light-100 font-semibold">Bundle not found</p>
          <p className="text-light-200 text-sm mt-2">
            The bundle you are looking for does not exist.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="mt-6">
        <Link href="/pricing" className="text-primary text-sm hover:underline">
          ← Back to Pricing
        </Link>
      </section>

      <section className="mt-8">
        <div className="glass rounded-2xl border border-border-dark p-8 card-shadow">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="pill">{bundle.tag}</span>

                {savePct > 0 && (
                  <span className="text-primary text-sm font-semibold">
                    Save {savePct}%
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-semibold text-gradient leading-tight">
                {bundle.title}
              </h1>

              <p className="text-light-200 mt-4 text-sm leading-relaxed">
                {bundle.subtitle}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-light-200">
                <span>
                  <span className="text-light-100 font-semibold">
                    {bundle.papersCount}+
                  </span>{" "}
                  papers included
                </span>
                <span>•</span>
                <span>{bundle.access}</span>
              </div>
            </div>

            <div className="glass rounded-2xl border border-border-dark p-6 card-shadow min-w-[280px] w-full max-w-sm">
              <p className="text-light-200 text-sm">Bundle Price</p>

              <div className="mt-3 flex items-center gap-3">
                <p className="text-light-100 text-2xl font-bold">
                  KES {bundle.price}
                </p>

                {bundle.oldPrice > bundle.price && (
                  <p className="text-light-200 text-sm line-through">
                    KES {bundle.oldPrice}
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-light-100"
                >
                  M-Pesa Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 07XXXXXXXX"
                  className="w-full rounded-xl border border-border-dark px-4 py-3 text-sm text-light-100 outline-none"
                />

                {hasCheckedAuth && !isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="w-full rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    Log in to Continue
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={!phone.trim() || paymentLoading}
                  className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {paymentLoading ? "Processing..." : "Pay with M-Pesa"}
                </button>
              </div>

              <p className="text-light-200 text-xs mt-4 leading-relaxed">
                One-time payment. Instant access after successful payment.
              </p>

              {paymentMessage && (
                <p className="text-sm text-light-200 mt-4 leading-relaxed">
                  {paymentMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div>
          <h3>Included Papers</h3>
          <p className="text-light-200 text-sm mt-2">
            All papers currently included in this revision bundle.
          </p>
        </div>

        {bundle.papers.length === 0 ? (
          <div className="mt-8 glass rounded-2xl border border-border-dark p-8 card-shadow text-center">
            <p className="text-light-100 font-semibold">No papers added yet</p>
            <p className="text-light-200 text-sm mt-2">
              This bundle does not yet contain any papers.
            </p>
          </div>
        ) : (
          <div className="events mt-8">
            {bundle.papers.map((paper) => (
              <div
                key={paper._id}
                className="glass border border-dark-200 rounded-xl p-6 card-shadow transition duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="pill">{paper.subject}</span>

                  {paper.hasMarkingScheme && (
                    <span className="text-primary text-xs font-semibold">
                      Marking Scheme
                    </span>
                  )}
                </div>

                <h4 className="text-light-100 text-lg font-semibold mt-4 line-clamp-2">
                  {paper.title}
                </h4>

                <div className="flex flex-wrap gap-3 mt-3 text-light-200 text-sm">
                  <span>{paper.form}</span>
                  <span>•</span>
                  <span>{paper.year}</span>
                  <span>•</span>
                  <span>{paper.type}</span>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/papers/${paper._id}`}
                    className="inline-flex rounded-[6px] border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    View Paper
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default BundleDetailsPage;