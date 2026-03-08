"use client";

import { useState } from "react";

const AdminPapers = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    form: "",
    year: "",
    type: "",
    price: "",
    isFree: false,
    hasMarkingScheme: false,
    fileUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year),
          price: formData.isFree ? 0 : Number(formData.price),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create paper");
      }

      setMessage("Paper uploaded successfully");

      setFormData({
        title: "",
        subject: "",
        form: "",
        year: "",
        type: "",
        price: "",
        isFree: false,
        hasMarkingScheme: false,
        fileUrl: "",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <div>
          <h3>Upload New Paper</h3>
          <p className="text-light-200 text-sm mt-2">
            Add a new examination paper to the portal.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <input
            type="text"
            name="title"
            placeholder="Paper title"
            value={formData.title}
            onChange={handleChange}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <input
            type="text"
            name="form"
            placeholder="Form e.g. Form 4"
            value={formData.form}
            onChange={handleChange}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <input
            type="text"
            name="type"
            placeholder="Exam type e.g. Mock"
            value={formData.type}
            onChange={handleChange}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            disabled={formData.isFree}
            className="border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none disabled:bg-dark-200"
          />

          <input
            type="text"
            name="fileUrl"
            placeholder="File URL"
            value={formData.fileUrl}
            onChange={handleChange}
            className="md:col-span-2 border border-border-dark rounded-xl px-4 py-3 text-sm text-light-100 outline-none"
          />

          <label className="flex items-center gap-3 text-sm text-light-100">
            <input
              type="checkbox"
              name="isFree"
              checked={formData.isFree}
              onChange={handleChange}
            />
            Free paper
          </label>

          <label className="flex items-center gap-3 text-sm text-light-100">
            <input
              type="checkbox"
              name="hasMarkingScheme"
              checked={formData.hasMarkingScheme}
              onChange={handleChange}
            />
            Includes marking scheme
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              {loading ? "Saving..." : "Create Paper"}
            </button>
          </div>
        </form>

        {message && <p className="mt-4 text-sm text-light-200">{message}</p>}
      </section>
    </div>
  );
};

export default AdminPapers;
