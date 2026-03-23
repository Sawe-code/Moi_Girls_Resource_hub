"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/types";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      closeMenu();
      router.push("/login");
      router.refresh();
    } catch {
      closeMenu();
    }
  };

  const dashboardHref = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <header>
      <nav className="relative">
        <Link href="/" className="logo" onClick={closeMenu}>
          <Image
            src="/icons/moi.png"
            alt="Portal logo"
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
          <p>Exam Resource Portal</p>
        </Link>

        <ul className="hidden md:flex">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/papers">Papers</Link>
          </li>
          <li>
            <Link href="/pricing">Pricing</Link>
          </li>

          {!loading &&
            (!user ? (
              <>
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/signup" className="pill">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href={dashboardHref}>Dashboard</Link>
                </li>
                <li>
                  <button type="button" className="pill" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden glass border border-dark-200 rounded-lg px-3 py-2 text-light-100"
        >
          {open ? "✕" : "☰"}
        </button>

        {open && (
          <div className="md:hidden absolute left-0 right-0 top-full mt-4 glass border border-dark-200 rounded-xl card-shadow p-6 z-50">
            <ul className="flex flex-col gap-4 text-light-200 text-sm">
              <li>
                <Link href="/" onClick={closeMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/papers" onClick={closeMenu}>
                  Papers
                </Link>
              </li>
              <li>
                <Link href="/pricing" onClick={closeMenu}>
                  Pricing
                </Link>
              </li>

              {!loading &&
                (!user ? (
                  <>
                    <li>
                      <Link href="/login" onClick={closeMenu}>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/signup"
                        className="pill w-fit"
                        onClick={closeMenu}
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href={dashboardHref} onClick={closeMenu}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="pill w-fit"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
