"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validateForm = () => {
    if (!formData.email) {
      setError("Email is required.");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Invalid email address.");
      return false;
    }
    if (!formData.password) {
      setError("Pasword is required.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 charcters.");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      console.log("Success: ", data);
      if (!res.ok) {
        throw new Error(data.error || "Login Failed.");
      }
      if (data.success) {
        sessionStorage.setItem(
          "LoginWelcome",
          JSON.stringify({
            name: data.data.user.name,
            isFirstLogin: data.data.user.isFirstLogin,
          }),
        );
        if (data.data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
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

            <h2 className="text-3xl font-bold">Welcome Back</h2>

            <p className="mt-3 max-w-sm text-sm text-primary-foreground/80 leading-relaxed">
              Access official Moi Girls past papers, mock examinations, and
              revision resources through your student portal.
            </p>

            <p className="mt-8 text-sm text-primary-foreground/80">
              Don&apos;t have an account?
            </p>

            <Link
              href="/signup"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-primary-foreground/40 bg-white/10 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-white/20"
            >
              Register
            </Link>
          </div>

          <div className="px-8 py-12 sm:px-12 md:px-14">
            <div className="mx-auto max-w-md">
              <h1 className="text-light-100 text-3xl font-bold text-center">
                Login
              </h1>

              <p className="text-light-200 text-sm text-center mt-3">
                Sign in to continue to the Moi Girls Resource Portal
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
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
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
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
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm text-light-100 placeholder:text-light-200 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  {loading ? "Logging In..." : "Login"}
                </button>
              </form>

              {/* <div className="mt-8">
                <p className="text-light-200 text-sm text-center">
                  or login with social platforms
                </p>

                <div className="mt-4 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-200 bg-white text-light-100 transition hover:border-primary hover:text-primary"
                  >
                    G
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-200 bg-white text-light-100 transition hover:border-primary hover:text-primary"
                  >
                    f
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-200 bg-white text-light-100 transition hover:border-primary hover:text-primary"
                  >
                    in
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
