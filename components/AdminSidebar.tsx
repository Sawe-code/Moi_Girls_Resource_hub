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

const AdminSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
  return (
    <aside className="hidden md:flex w-72 min-h-screen flex-col border-r border-border-dark bg-white px-6 py-8">
      <div className="flex items-center gap-3">
        <Image
          src="/icons/moi.png"
          alt="Moi Girls crest"
          width={46}
          height={46}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-light-100 font-bold leading-tight">Moi Girls</p>
          <p className="text-light-200 text-sm">Admin Panel</p>
        </div>
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
          className="mt-4 inline-flex w-full justify-center rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          Return to Website
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
