import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

/* ICONS */
import {
  LayoutDashboard,
  BookOpen,
  Folder,
  Mail,
  Users,
  CreditCard,
  Settings,
  ShoppingBag,
  LogOut,
  Menu,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  /* ================= NAV ITEMS ================= */
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Courses", path: "/admin/courses", icon: BookOpen },
    { name: "Resources", path: "/admin/resources", icon: Folder },
    { name: "Messages", path: "/admin/messages", icon: Mail },
    { name: "Enrollments", path: "/admin/enrollments", icon: Users },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },

    // ✅ NEW: Purchases module
    { name: "Purchases", path: "/admin/purchases", icon: ShoppingBag },

    { name: "CMS", path: "/admin/cms", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-gray-900 text-white p-4 flex flex-col transition-all duration-300`}
      >

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-xl font-semibold">Admin Panel</h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-800 rounded"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2">

          {navItems.map((item) => {
            const Icon = item.icon;

            // ✅ improved active detection (supports nested routes later)
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded transition 
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                <Icon size={20} />

                {!collapsed && (
                  <span className="text-sm">{item.name}</span>
                )}
              </Link>
            );
          })}

        </nav>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded transition"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>

      </aside>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;