"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Bundle } from "@/types";

const PricingPage = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBundles = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/bundles");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch bundles");
        }

        if (Array.isArray(data.bundles)) {
          setBundles(data.bundles);
        } else {
          setBundles([]);
        }
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

    fetchBundles();
  }, []);

  const calcSavePct = (oldPrice: number, price: number) => {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  return (
    <main>
      <section className="text-center">
        <span className="pill">Simple & Transparent Pricing</span>

        <h1 className="mt-6 tracking-tight">Pricing & Revision Bundles</h1>

        <p className="subheading max-w-3xl mx-auto">
          Choose a revision bundle that matches your preparation needs. Pay
          securely via M-Pesa and get instant access after confirmation.
        </p>
      </section>

      <section className="mt-14">
        <div className="text-center">
          <h3>Available Bundles</h3>
          <p className="text-light-200 text-sm mt-2">
            Compare bundle value, included papers, and access details.
          </p>
        </div>

        {loading && (
          <p className="text-light-200 text-sm mt-8 text-center">
            Loading bundles...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-8 text-center">{error}</p>
        )}

        {!loading && !error && bundles.length === 0 && (
          <div className="glass rounded-2xl border border-border-dark p-8 card-shadow mt-8 text-center">
            <p className="text-light-100 font-semibold">No bundles available</p>
            <p className="text-light-200 text-sm mt-2">
              Please check back later for revision bundle offers.
            </p>
          </div>
        )}

        {!loading && !error && bundles.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bundles.map((bundle) => {
              const savePct = calcSavePct(bundle.oldPrice, bundle.price);

              return (
                <div
                  key={bundle._id}
                  className="glass border border-dark-200 rounded-2xl p-6 card-shadow transition duration-300 hover:-translate-y-1 hover:border-primary/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="pill">{bundle.tag}</span>

                    {savePct > 0 && (
                      <span className="text-xs text-primary font-semibold">
                        Save {savePct}%
                      </span>
                    )}
                  </div>

                  <h4 className="mt-4 text-light-100 text-xl font-semibold leading-snug">
                    {bundle.title}
                  </h4>

                  <p className="mt-2 text-light-200 text-sm">
                    {bundle.subtitle}
                  </p>

                  <div className="mt-5 space-y-2 text-sm text-light-200">
                    <p>
                      <span className="text-light-100 font-semibold">
                        {bundle.papersCount}+
                      </span>{" "}
                      papers included
                    </p>
                    <p>{bundle.access}</p>
                  </div>

                  <div className="mt-6">
                    <p className="text-light-200 text-xs">Bundle Price</p>

                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-light-100 text-2xl font-bold">
                        KES {bundle.price}
                      </p>

                      {bundle.oldPrice > bundle.price && (
                        <p className="text-light-200 text-sm line-through">
                          KES {bundle.oldPrice}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      href={`/bundles/${bundle._id}`}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      View Bundle
                    </Link>

                    <p className="text-light-200 text-xs text-center leading-relaxed">
                      Review bundle contents, confirm your selection, and start
                      payment from the bundle details page.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-16">
        <div className="glass rounded-2xl border border-border-dark p-8 card-shadow">
          <div className="text-center">
            <h3>Payment & Access Information</h3>
            <p className="text-light-200 text-sm mt-2">
              Everything you need to know before making payment.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border-dark bg-white p-5">
              <p className="text-light-100 font-semibold">
                Secure M-Pesa Payments
              </p>
              <p className="text-light-200 text-sm mt-2 leading-relaxed">
                Payments are processed securely through M-Pesa for a simple and
                familiar checkout experience.
              </p>
            </div>

            <div className="rounded-xl border border-border-dark bg-white p-5">
              <p className="text-light-100 font-semibold">Instant Access</p>
              <p className="text-light-200 text-sm mt-2 leading-relaxed">
                Once payment is confirmed, your purchased bundle becomes
                available in your dashboard library.
              </p>
            </div>

            <div className="rounded-xl border border-border-dark bg-white p-5">
              <p className="text-light-100 font-semibold">
                One-Time Bundle Purchase
              </p>
              <p className="text-light-200 text-sm mt-2 leading-relaxed">
                Bundle payments are one-time charges. There are no recurring
                subscription fees.
              </p>
            </div>

            <div className="rounded-xl border border-border-dark bg-white p-5">
              <p className="text-light-100 font-semibold">
                Access From Bundle Page
              </p>
              <p className="text-light-200 text-sm mt-2 leading-relaxed">
                Select a bundle first, then continue from its details page to
                review included papers and initiate payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="text-center">
          <h3>Frequently Asked Pricing Questions</h3>
          <p className="text-light-200 text-sm mt-2">
            Common questions about bundles, payment, and access.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="glass rounded-xl border border-border-dark p-6 card-shadow">
            <p className="text-light-100 font-semibold">
              Do I pay once or subscribe monthly?
            </p>
            <p className="text-light-200 text-sm mt-3 leading-relaxed">
              You pay once for the selected bundle and gain access after payment
              confirmation.
            </p>
          </div>

          <div className="glass rounded-xl border border-border-dark p-6 card-shadow">
            <p className="text-light-100 font-semibold">
              Where do I start the payment process?
            </p>
            <p className="text-light-200 text-sm mt-3 leading-relaxed">
              Payment begins from the bundle details page after you click{" "}
              <span className="text-light-100 font-semibold">View Bundle</span>.
            </p>
          </div>

          <div className="glass rounded-xl border border-border-dark p-6 card-shadow">
            <p className="text-light-100 font-semibold">
              Will I still find my purchased bundle later?
            </p>
            <p className="text-light-200 text-sm mt-3 leading-relaxed">
              Yes. Purchased bundles should remain available in your dashboard
              library for later access.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PricingPage;