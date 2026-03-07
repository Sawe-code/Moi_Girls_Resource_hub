"use client";
import { useRouter } from "next/navigation";

const StudentTopbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-light-100">
          Student Dashboard
        </h1>
        <p className="text-sm text-light-200">
          Access your purchased papers and continue revising.
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
      >
        Logout
      </button>
    </div>
  );
};

export default StudentTopbar;
