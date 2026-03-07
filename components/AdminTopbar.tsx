"use client";
import { useRouter } from "next/navigation";

const AdminTopbar = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <div className="flex items-center justify-between border-b border-border-dark bg-white px-5 py-5 sm:px-8">
      <div>
        <p className="text-light-100 text-xl font-semibold">Admin Dashboard</p>
        <p className="text-light-200 text-sm mt-1">
          Manage papers, bundles, users, and payments.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="pill">Admin</span>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminTopbar;
