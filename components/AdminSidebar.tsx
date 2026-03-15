"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/admin" },
  { name: "Manage Papers", href: "/admin/papers" },
  { name: "Bundles", href: "/admin/bundles" },
  { name: "Users", href: "/admin/users" },
  { name: "Payments", href: "/admin/payments" },
];

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const AdminSidebar = ({ open, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 overflow-y-auto border-r border-border-dark bg-white px-6 py-8 transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between md:block">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/moi.png"
              alt="Moi Girls crest"
              width={46}
              height={46}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-light-100 font-bold leading-tight">
                Moi Girls
              </p>
              <p className="text-light-200 text-sm">Admin Panel</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="md:hidden rounded-lg border border-border-dark px-3 py-2 text-light-100"
          >
            ✕
          </button>
        </div>

        <div className="mt-12">
          <p className="text-light-200 text-xs uppercase tracking-[0.25em]">
            Administration
          </p>

          <nav className="mt-5 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-light-200 hover:bg-dark-200 hover:text-light-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto rounded-2xl border border-border-dark bg-dark-200/60 p-5">
          <p className="text-light-100 text-sm font-semibold">Admin Access</p>
          <p className="text-light-200 mt-2 text-sm leading-relaxed">
            Manage examination resources, bundles, student accounts, and payment
            activity from one place.
          </p>

          <Link
            href="/"
            onClick={onClose}
            className="mt-4 inline-flex w-full justify-center rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            Return to Website
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
