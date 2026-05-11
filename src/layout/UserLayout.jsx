import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "@/user/components/UserSidebar";
import UserNavbar from "@/user/components/UserNavbar";
import { Menu, X } from "lucide-react";

const UserLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  /* ================= LOCK SCROLL WHEN MOBILE SIDEBAR OPEN ================= */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block">
        <UserSidebar />
      </div>

      {/* ================= MOBILE TRIGGER ================= */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-white shadow-md border hover:shadow-lg transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">

          {/* BACKDROP */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* PANEL */}
          <div className="relative w-72 max-w-[85%] bg-white h-full shadow-2xl z-50 flex flex-col">

            {/* CLOSE */}
            <div className="flex justify-end p-4 border-b">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <UserSidebar />
            </div>

          </div>
        </div>
      )}

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* ================= TOP NAVBAR ================= */}
        <div className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-md border-b">
          <UserNavbar />
        </div>

        {/* ================= PAGE CONTENT ================= */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default UserLayout;