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

  /* ================= NAV CONFIG ================= */
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Courses", path: "/admin/courses", icon: BookOpen },
    { name: "Resources", path: "/admin/resources", icon: Folder },
    { name: "Messages", path: "/admin/messages", icon: Mail },
    { name: "Users", path: "/admin/users", icon: Users }, // 🔥 added user management
    { name: "Enrollments", path: "/admin/enrollments", icon: Users },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Purchases", path: "/admin/purchases", icon: ShoppingBag },
    { name: "CMS", path: "/admin/cms", icon: Settings },
  ];

  /* ================= ACTIVE ROUTE ================= */
  const isActiveRoute = (path) => {
    return location.pathname === path ||
      location.pathname.startsWith(path + "/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          bg-gray-900 text-white
          flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
        `}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          {!collapsed && (
            <h2 className="text-lg font-semibold tracking-wide">
              Admin Panel
            </h2>
          )}

          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-2 rounded hover:bg-gray-800 transition"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-2 py-4 space-y-1">

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3
                  px-3 py-2 rounded-md
                  transition-all duration-200
                  group
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >

                <Icon
                  size={20}
                  className={`
                    transition
                    ${active ? "text-white" : "text-gray-400 group-hover:text-white"}
                  `}
                />

                {!collapsed && (
                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                )}

              </Link>
            );
          })}

        </nav>

        {/* LOGOUT */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={logout}
            className="
              flex items-center gap-3
              w-full px-3 py-2
              text-red-400
              hover:bg-gray-800 hover:text-red-300
              rounded-md
              transition
            "
          >
            <LogOut size={20} />
            {!collapsed && (
              <span className="text-sm">Logout</span>
            )}
          </button>
        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;