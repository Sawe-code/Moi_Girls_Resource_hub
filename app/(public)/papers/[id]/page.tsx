"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { Paper } from "@/types";

const PaperDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);
  const [accessLoading, setAccessLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });

        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setHasCheckedAuth(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchPaper = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/papers/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch paper");
        }

        setPaper(data.paper || null);
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
      fetchPaper();
    }
  }, [id]);

  const checkPaperAccess = async (paperId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/papers/access/${paperId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        const access = Boolean(data.hasAccess);
        setHasAccess(access);
        return access;
      }

      setHasAccess(false);
      return false;
    } catch {
      setHasAccess(false);
      return false;
    }
  };

  useEffect(() => {
    const runCheck = async () => {
      setAccessLoading(true);
      await checkPaperAccess(id);
      setAccessLoading(false);
    };

    if (id) {
      runCheck();
    }
  }, [id]);

  const handlePaperPayment = async () => {
    setPaymentMessage("");

    if (!isLoggedIn) {
      setPaymentMessage("Please log in before making payment.");
      return;
    }

    if (!phone.trim()) {
      setPaymentMessage("Please enter your M-Pesa phone number.");
      return;
    }

    if (!paper) {
      setPaymentMessage("Paper details are unavailable.");
      return;
    }

    setPaymentLoading(true);

    try {
      const res = await fetch("/api/payments/initiate-paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          paperId: paper._id,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      setPaymentMessage(
        data.message || "Payment request accepted. Waiting for confirmation...",
      );

      setTimeout(async () => {
        try {
          const confirmed = await checkPaperAccess(paper._id);

          if (confirmed) {
            setPaymentMessage(
              "Payment confirmed successfully. You now have access to this paper.",
            );
          } else {
            setPaymentMessage(
              "Payment request was sent successfully. Please wait a few moments, then refresh if access is not updated yet.",
            );
          }
        } catch {
          setPaymentMessage(
            "Payment request was sent successfully. Please wait a few moments, then refresh if access is not updated yet.",
          );
        }
      }, 5000);
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

  const handleProtectedDownload = async () => {
    try {
      const res = await fetch(`/api/downloads/papers/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to download paper");
      }

      if (!data.fileUrl) {
        throw new Error("No download link available");
      }

      window.open(data.fileUrl, "_blank");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPaymentMessage(err.message);
      } else {
        setPaymentMessage("Something went wrong");
      }
    }
  };

  if (loading) {
    return (
      <main>
        <section className="mt-10">
          <p className="text-light-200 text-sm">Loading paper...</p>
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

  if (!paper) {
    return (
      <main>
        <section className="mt-10 glass rounded-2xl border border-border-dark p-8 card-shadow">
          <p className="text-light-100 font-semibold">Paper not found</p>
          <p className="text-light-200 text-sm mt-2">
            The paper you are looking for does not exist.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="mt-6">
        <Link href="/papers" className="text-primary text-sm hover:underline">
          ← Back to Papers
        </Link>
      </section>

      <section className="mt-8">
        <div className="glass rounded-2xl border border-border-dark p-8 card-shadow">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="pill">{paper.subject}</span>

                {paper.isFree ? (
                  <span className="text-primary text-sm font-semibold">
                    Free Resource
                  </span>
                ) : hasAccess ? (
                  <span className="text-primary text-sm font-semibold">
                    Access Granted
                  </span>
                ) : (
                  <span className="text-light-200 text-sm font-semibold">
                    Paid Access
                  </span>
                )}

                {paper.hasMarkingScheme && (
                  <span className="text-primary text-sm font-semibold">
                    Marking Scheme Included
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-semibold text-gradient leading-tight">
                {paper.title}
              </h1>

              <p className="text-light-200 mt-4 text-sm leading-relaxed">
                Official revision material designed to help students prepare
                better with organized access to examination papers and marking
                support where available.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-light-200">
                <span>{paper.form}</span>
                <span>•</span>
                <span>{paper.year}</span>
                <span>•</span>
                <span>{paper.type}</span>
              </div>
            </div>

            <div className="glass rounded-2xl border border-border-dark p-6 card-shadow min-w-[280px] w-full max-w-sm">
              <p className="text-light-200 text-sm">
                {paper.isFree || hasAccess ? "Access" : "Paper Price"}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <p className="text-light-100 text-2xl font-bold">
                  {paper.isFree ? "FREE" : `KES ${paper.price}`}
                </p>
              </div>

              {accessLoading ? (
                <div className="mt-6">
                  <p className="text-light-200 text-sm">Checking access...</p>
                </div>
              ) : paper.isFree || hasAccess ? (
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={handleProtectedDownload}
                    className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Download Paper
                  </button>

                  <p className="text-light-200 text-xs leading-relaxed">
                    {paper.isFree
                      ? "This paper is available for instant free download."
                      : "You already have access to this paper."}
                  </p>
                </div>
              ) : (
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
                    onClick={handlePaperPayment}
                    disabled={!phone.trim() || paymentLoading || !isLoggedIn}
                    className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {paymentLoading ? "Processing..." : "Pay with M-Pesa"}
                  </button>

                  <p className="text-light-200 text-xs leading-relaxed">
                    One-time payment. Access is granted after successful payment
                    confirmation.
                  </p>
                </div>
              )}

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
        <div className="glass rounded-2xl border border-border-dark p-8 card-shadow">
          <h3>Paper Notes</h3>
          <div className="mt-4 space-y-3 text-sm text-light-200 leading-relaxed">
            <p>
              This resource is organized for easier student revision and exam
              preparation.
            </p>
            <p>
              {paper.hasMarkingScheme
                ? "A marking scheme is included with this paper."
                : "This paper currently does not include a marking scheme."}
            </p>
            <p>
              {paper.isFree || hasAccess
                ? "You can access this paper immediately."
                : "Access will be granted after successful payment confirmation."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaperDetailsPage;
