"use client";

import { useState } from "react";
import { UploadButton } from "@/app/utils/uploadthing";

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
  });

  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    setError("");

    try {
      if (!uploadedFileUrl) {
        throw new Error("Please upload a file");
      }

      const res = await fetch("/api/papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year),
          price: formData.isFree ? 0 : Number(formData.price),
          fileUrl: uploadedFileUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create paper");
      }

      setMessage("Paper uploaded successfully");
      setError("");

      setFormData({
        title: "",
        subject: "",
        form: "",
        year: "",
        type: "",
        price: "",
        isFree: false,
        hasMarkingScheme: false,
      });
      setUploadedFileUrl("");
      setUploadedFileName("");
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

          <div className="md:col-span-2 space-y-3">
            <p className="text-sm font-medium text-light-100">Upload PDF</p>

            <UploadButton
              endpoint="paperUploader"
              onClientUploadComplete={(res) => {
                const file = res?.[0];
                if (!file) return;

                setUploadedFileUrl(file.serverData.fileUrl);
                setUploadedFileName(file.name);
                setMessage("PDF uploaded successfully");
                setError("");
              }}
              onUploadError={(uploadError: Error) => {
                setError(uploadError.message);
              }}
            />

            {uploadedFileName && (
              <p className="text-sm text-light-200">
                Uploaded file: {uploadedFileName}
              </p>
            )}
          </div>

          <div className="md:col-span-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading || !uploadedFileUrl}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create Paper"}
            </button>
          </div>
        </form>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </section>
    </div>
  );
};

export default AdminPapers;
