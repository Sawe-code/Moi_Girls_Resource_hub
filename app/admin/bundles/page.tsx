"use client";
import { useEffect, useState } from "react";
import { Paper } from "@/types";

const AdminBundles = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    tag: "",
    price: "",
    oldPrice: "",
    access: "Instant access",
  });

  useEffect(() => {
    const fetchPapers = async () => {
      setLoadingPapers(true);

      try {
        const response = await fetch("/api/papers");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch papers");
        }

        if (data.success && data.papers) {
          setPapers(data.papers);
        } else {
          throw new Error("Invalid response data");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoadingPapers(false);
      }
    };

    fetchPapers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaperToggle = (paperId: string) => {
    setSelectedPapers((prev) =>
      prev.includes(paperId)
        ? prev.filter((id) => id !== paperId)
        : [...prev, paperId],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/bundles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          oldPrice: Number(formData.oldPrice),
          papers: selectedPapers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create bundle");
      }

      setMessage("Bundle created successfully");
      setError("");

      setFormData({
        title: "",
        subtitle: "",
        tag: "",
        price: "",
        oldPrice: "",
        access: "Instant access",
      });
      setSelectedPapers([]);
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
  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <div>
          <h3>Create Bundle</h3>
          <p className="text-light-200 text-sm mt-2">
            Combine multiple papers into one revision bundle.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <input
            type="text"
            name="title"
            placeholder="Bundle title"
            value={formData.title}
            onChange={handleChange}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <input
            type="text"
            name="subtitle"
            placeholder="Subtitle e.g. 2022–2025 • All Subjects"
            value={formData.subtitle}
            onChange={handleChange}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <input
            type="text"
            name="tag"
            placeholder="Tag e.g. Most Popular"
            value={formData.tag}
            onChange={handleChange}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <input
            type="text"
            name="access"
            placeholder="Access text"
            value={formData.access}
            onChange={handleChange}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <input
            type="number"
            name="price"
            placeholder="Bundle price"
            value={formData.price}
            onChange={handleChange}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <input
            type="number"
            name="oldPrice"
            placeholder="Old price"
            value={formData.oldPrice}
            onChange={handleChange}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <div className="md:col-span-2">
            <p className="text-light-100 text-sm font-semibold mb-3">
              Select Papers
            </p>

            <div className="max-h-80 overflow-y-auto rounded-xl border border-border-dark bg-white p-4 space-y-3">
              {loadingPapers ? (
                <p className="text-light-200 text-sm">Loading papers...</p>
              ) : papers.length === 0 ? (
                <p className="text-light-200 text-sm">No papers available.</p>
              ) : (
                papers.map((paper) => (
                  <label
                    key={paper._id}
                    className="flex items-start gap-3 text-sm text-light-100"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPapers.includes(paper._id)}
                      onChange={() => handlePaperToggle(paper._id)}
                    />
                    <span>
                      {paper.title} — {paper.subject} • {paper.year} •{" "}
                      {paper.type}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              {loading ? "Saving..." : "Create Bundle"}
            </button>
          </div>
        </form>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </section>
    </div>
  );
};

export default AdminBundles;
