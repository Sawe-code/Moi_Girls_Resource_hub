"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { NavbarProps } from "@/types";

const Navbar = ({ isLoggedIn = false }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header>
      <nav className="relative">
        <Link href="/" className="logo" onClick={closeMenu}>
          <Image
            src="/icons/moi.png"
            alt="Moi Girls crest"
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
          <p>Moi Girls Exam Portal</p>
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

          {!isLoggedIn ? (
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
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button type="button" className="pill">
                  Logout
                </button>
              </li>
            </>
          )}
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

              {!isLoggedIn ? (
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
                    <Link href="/dashboard" onClick={closeMenu}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="pill w-fit"
                      onClick={closeMenu}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
