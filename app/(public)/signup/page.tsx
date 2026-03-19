"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      if (data.data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-10 bg-background">
      <section className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-dark-200 bg-white card-shadow">
        <div className="grid md:grid-cols-2">
          <div className="bg-primary text-primary-foreground flex flex-col items-center justify-center px-8 py-16 text-center md:rounded-r-[120px]">
            <Image
              src="/icons/moi.png"
              alt="Moi Girls crest"
              width={72}
              height={72}
              className="rounded-full object-cover mb-6"
            />

            <h2 className="text-3xl font-bold">Create Account</h2>

            <p className="mt-3 max-w-sm text-sm text-primary-foreground/80 leading-relaxed">
              Register to access official Moi Girls past papers, mock
              examinations, and revision resources through the student portal.
            </p>

            <p className="mt-8 text-sm text-primary-foreground/80">
              Already have an account?
            </p>

            <Link
              href="/login"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-primary-foreground/40 bg-white/10 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-white/20"
            >
              Login
            </Link>
          </div>

          <div className="px-8 py-12 sm:px-12 md:px-14">
            <div className="mx-auto max-w-md">
              <h1 className="text-light-100 text-3xl font-bold text-center">
                Sign Up
              </h1>

              <p className="text-light-200 text-sm text-center mt-3">
                Create your account to continue to the Moi Girls Resource Portal
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-light-100"
                  >
                    Full Name
                  </label>
                  <div className="flex items-center rounded-xl border border-dark-200 bg-dark-200/40 px-4 py-3">
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent text-sm text-light-100 placeholder:text-light-200 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-light-100"
                  >
                    Email Address
                  </label>
                  <div className="flex items-center rounded-xl border border-dark-200 bg-dark-200/40 px-4 py-3">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent text-sm text-light-100 placeholder:text-light-200 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-light-100"
                  >
                    Password
                  </label>
                  <div className="flex items-center rounded-xl border border-dark-200 bg-dark-200/40 px-4 py-3">
                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-transparent text-sm text-light-100 placeholder:text-light-200 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-light-100"
                  >
                    Confirm Password
                  </label>
                  <div className="flex items-center rounded-xl border border-dark-200 bg-dark-200/40 px-4 py-3">
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-transparent text-sm text-light-100 placeholder:text-light-200 outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUpPage;
