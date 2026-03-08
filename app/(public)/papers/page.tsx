"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { subjects, examTypes, forms, years } from "@/constants";
import { Paper } from "@/types";

const Papers = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [year, setYear] = useState("All Years");
  const [type, setType] = useState("All Types");
  const [form, setForm] = useState("All Forms");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search.trim()) params.append("search", search.trim());
        if (subject !== "All Subjects") params.append("subject", subject);
        if (year !== "All Years") params.append("year", year);
        if (type !== "All Types") params.append("type", type);
        if (form !== "All Forms") params.append("form", form);
        if (sort) params.append("sort", sort);

        const url = `/api/papers?${params.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch papers");
        }
        setPapers(data.papers || []);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [search, subject, year, type, form, sort]);
  return (
    <main>
      <section className="text-center">
        <span className="pill">Official Resource Library</span>

        <h1 className="mt-6 tracking-tight">Past Papers & Mock Exams</h1>

        <p className="subheading max-w-3xl mx-auto">
          Browse official Moi Girls examination papers by subject, form, year,
          and exam type.
        </p>
      </section>

      <section className="mt-12">
        <div className="text-center">
          <h3>Search Our Resources</h3>
          <p className="text-light-200 text-sm mt-2">
            Search by subject, exam type, form, or year.
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        <div className="mt-8 glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
            >
              {subjects.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={form}
              onChange={(e) => setForm(e.target.value)}
              className="bg-white border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
            >
              {forms.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-white border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
            >
              {examTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-white border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
            >
              {years.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Lowest Price</option>
              <option value="price-high">Highest Price</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3>Available Papers</h3>
            <p className="text-light-200 text-sm mt-1">
              {loading
                ? "Loading..."
                : `Showing ${papers.length} available resources`}
            </p>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-6">{error}</p>}

        {!loading && !error && papers.length === 0 && (
          <div className="mt-8 glass rounded-2xl border border-border-dark p-8 card-shadow text-center">
            <p className="text-light-100 font-semibold">No papers found</p>
            <p className="text-light-200 text-sm mt-2">
              Try another subject, year, form, or exam type.
            </p>
          </div>
        )}

        <div className="events mt-8">
          {papers.map((paper) => (
            <div
              key={paper._id}
              className="glass border border-dark-200 rounded-xl p-6 card-shadow transition duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="pill">{paper.subject}</span>

                {paper.isFree ? (
                  <span className="text-primary text-xs font-semibold">
                    FREE
                  </span>
                ) : (
                  <span className="text-light-200 text-xs flex items-center gap-1">
                    🔒 Locked
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

              {paper.hasMarkingScheme && (
                <p className="text-primary text-xs font-semibold mt-4">
                  Marking Scheme Included
                </p>
              )}

              <div className="mt-6 flex items-center justify-between gap-4">
                {paper.isFree ? (
                  <span className="text-primary font-semibold text-sm">
                    KES 0
                  </span>
                ) : (
                  <span className="text-light-100 font-semibold text-sm">
                    KES {paper.price}
                  </span>
                )}

                {paper.isFree ? (
                  <a
                    href={paper.fileUrl}
                    download
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[6px] px-4 py-2 text-sm transition sm:px-6 sm:py-3"
                  >
                    DownLoad
                  </a>
                ) : (
                  <Link
                    href={`/papers/${paper._id}`}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[6px] px-4 py-2 text-sm transition sm:px-6 sm:py-3"
                  >
                    Pay to Access
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Papers;
