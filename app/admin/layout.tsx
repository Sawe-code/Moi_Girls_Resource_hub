"use client";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { useState } from "react";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <AdminSidebar open={open} onClose={() => setOpen(false)}/>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-border-dark bg-white/95 px-5 py-4 backdrop-blur-md sm:px-8">
            <AdminTopbar onMenuClick={() => setOpen(true)}/>
          </header>

          <main className="flex-1 px-5 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
