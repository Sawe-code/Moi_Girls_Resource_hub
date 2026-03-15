"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Paper, Bundle } from "@/types";

const LibraryPage = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your library.");
        }

        const res = await fetch("/api/library", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load library");
        }

        setPapers(Array.isArray(data.papers) ? data.papers : []);
        setBundles(Array.isArray(data.bundles) ? data.bundles : []);
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

    fetchLibrary();
  }, []);

  const handleProtectedDownload = async (paperId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in first.");
        return;
      }

      const res = await fetch(`/api/downloads/papers/${paperId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
          <p className="text-light-200 text-sm">Loading your library...</p>
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
        <p className="text-light-200 text-sm">My Library</p>
        <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
          Your Purchased Resources
        </h1>
        <p className="text-light-200 mt-4 max-w-2xl text-sm leading-relaxed">
          Access your purchased bundles and papers in one place. Download free
          and unlocked resources anytime.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3>Purchased Bundles</h3>
            <p className="text-light-200 text-sm mt-1">
              {bundles.length} bundle{bundles.length === 1 ? "" : "s"} in your
              library
            </p>
          </div>
        </div>

        {bundles.length === 0 ? (
          <div className="mt-6 glass rounded-2xl border border-border-dark p-8 card-shadow text-center">
            <p className="text-light-100 font-semibold">No bundles yet</p>
            <p className="text-light-200 text-sm mt-2">
              Purchased bundles will appear here once payment is completed.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {bundles.map((bundle) => (
              <div
                key={bundle._id}
                className="glass rounded-2xl border border-border-dark p-6 card-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="pill">{bundle.tag}</span>
                  <span className="text-light-200 text-xs">
                    {bundle.papersCount}+ papers
                  </span>
                </div>

                <h4 className="text-light-100 text-lg font-semibold mt-4">
                  {bundle.title}
                </h4>

                <p className="text-light-200 text-sm mt-2">{bundle.subtitle}</p>

                <div className="mt-6">
                  <Link
                    href={`/bundles/${bundle._id}`}
                    className="inline-flex rounded-[6px] border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    Open Bundle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3>Purchased Papers</h3>
            <p className="text-light-200 text-sm mt-1">
              {papers.length} paper{papers.length === 1 ? "" : "s"} in your
              library
            </p>
          </div>
        </div>

        {papers.length === 0 ? (
          <div className="mt-6 glass rounded-2xl border border-border-dark p-8 card-shadow text-center">
            <p className="text-light-100 font-semibold">No papers yet</p>
            <p className="text-light-200 text-sm mt-2">
              Purchased papers will appear here once payment is completed.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {papers.map((paper) => (
              <div
                key={paper._id}
                className="glass rounded-2xl border border-border-dark p-5 card-shadow"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="pill">{paper.subject}</span>
                      {paper.hasMarkingScheme && (
                        <span className="text-primary text-xs font-semibold">
                          Marking Scheme Included
                        </span>
                      )}
                    </div>

                    <h4 className="text-light-100 text-lg font-semibold mt-3">
                      {paper.title}
                    </h4>

                    <p className="text-light-200 text-sm mt-2">
                      {paper.form} • {paper.year} • {paper.type}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end">
                    <button
                      type="button"
                      onClick={() => handleProtectedDownload(paper._id)}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      Download Paper
                    </button>

                    <Link
                      href={`/papers/${paper._id}`}
                      className="text-primary text-sm font-semibold hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LibraryPage;
