"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "My Library", href: "/dashboard/library" },
  { name: "Purchases", href: "/dashboard/purchases" },
  { name: "Profile", href: "/dashboard/profile" },
];

type StudentSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const StudentSidebar = ({ open, onClose }: StudentSidebarProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed top-0 inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen md:sticky md:top-0 w-72 flex-col border-r border-border-dark bg-white px-6 py-8 transition-transform duration-300 md:z-auto md:translate-x-0 ${
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
              <p className="text-light-200 text-sm">Student Dashboard</p>
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
            Navigation
          </p>

          <nav className="mt-5 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-light-200 hover:bg-dark-200 hover:text-light-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto rounded-2xl border border-border-dark bg-dark-200/60 p-5">
          <p className="text-light-100 text-sm font-semibold">Keep Improving</p>
          <p className="text-light-200 mt-2 text-sm leading-relaxed">
            Continue revising consistently to strengthen your exam confidence
            and performance.
          </p>

          <Link
            href="/papers"
            onClick={onClose}
            className="mt-4 inline-flex w-full justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Browse More Papers
          </Link>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
