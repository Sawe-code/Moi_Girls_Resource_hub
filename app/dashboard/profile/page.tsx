"use client";

import { useEffect, useState } from "react";
import type { UserProfile } from "@/types";

const StudentProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load profile");
        }

        setProfile(data.user || null);
        setFormData({
          name: data.user?.name || "",
          email: data.user?.email || "",
        });
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

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setProfile(data.user || null);
      setSuccess(data.message || "Profile updated successfully");

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...parsed,
            name: data.user.name,
            email: data.user.email,
          }),
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
          <p className="text-light-200 text-sm">Loading profile...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl border border-border-dark p-8 card-shadow">
        <p className="text-light-200 text-sm">My Profile</p>
        <h1 className="mt-2 text-4xl font-semibold text-gradient leading-tight">
          Account Information
        </h1>
        <p className="text-light-200 mt-4 max-w-2xl text-sm leading-relaxed">
          Manage your personal details and keep your student account information
          up to date.
        </p>
      </section>

      {error && (
        <section className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <p className="text-red-500 text-sm">{error}</p>
        </section>
      )}

      {success && (
        <section className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <p className="text-green-600 text-sm">{success}</p>
        </section>
      )}

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_0.7fr]">
        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div>
            <h3>Edit Profile</h3>
            <p className="text-light-200 text-sm mt-1">
              Update your name and email address.
            </p>
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-light-100"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-border-dark bg-white px-4 py-3 text-sm text-light-100 outline-none"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-light-100"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-border-dark bg-white px-4 py-3 text-sm text-light-100 outline-none"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="glass rounded-2xl border border-border-dark p-6 card-shadow">
          <div>
            <h3>Account Summary</h3>
            <p className="text-light-200 text-sm mt-1">
              Overview of your student account.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-border-dark bg-white p-5">
              <p className="text-light-200 text-sm">Role</p>
              <p className="text-light-100 font-semibold mt-2 capitalize">
                {profile?.role || "user"}
              </p>
            </div>

            <div className="rounded-xl border border-border-dark bg-white p-5">
              <p className="text-light-200 text-sm">Date Joined</p>
              <p className="text-light-100 font-semibold mt-2">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-KE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-xl border border-border-dark bg-white p-5">
              <p className="text-light-200 text-sm">Last Login</p>
              <p className="text-light-100 font-semibold mt-2">
                {profile?.lastLoginAt
                  ? new Date(profile.lastLoginAt).toLocaleDateString("en-KE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Never"}
              </p>
            </div>

            <div className="rounded-xl border border-border-dark bg-white p-5">
              <p className="text-light-200 text-sm">Login Status</p>
              <p className="text-light-100 font-semibold mt-2">
                {profile?.hasLoggedInBefore ? "Active User" : "New User"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentProfilePage;
