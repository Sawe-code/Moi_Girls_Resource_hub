"use client";
import { useRouter } from "next/navigation";

const StudentTopbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  };
  return (
    <div className="flex items-center justify-between border-b border-border-dark bg-white px-5 py-5 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden rounded-lg border border-border-dark px-3 py-2 text-light-100"
        >
          ☰
        </button>

        <div>
          <p className="text-light-100 text-xl font-semibold">
            Student Dashboard
          </p>
          <p className="text-light-200 text-sm mt-1">
            Access your purchased papers and continue revising.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
      >
        Logout
      </button>
    </div>
  );
};

export default StudentTopbar;
