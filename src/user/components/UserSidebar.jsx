import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  User,
  Settings,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

const UserSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
    { name: "My Courses", path: "/user/courses", icon: BookOpen },

    { name: "My Purchases", path: "/user/purchases", icon: ShoppingBag },

    { name: "My Profile", path: "/user/profile", icon: User },
    { name: "Settings", path: "/user/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`
        h-screen flex flex-col justify-between
        border-r bg-white/80 backdrop-blur-md
        shadow-sm transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >

      <div>

        {/* BRAND */}
        <div className="p-4 border-b flex items-center justify-between">

          <div className="flex items-center gap-2">
            <GraduationCap className="text-[var(--color-primary)]" size={20} />

            {!collapsed && (
              <div>
                <h1 className="text-sm font-semibold text-gray-900">
                  My Portal
                </h1>
                <p className="text-xs text-gray-500">
                  {user?.fullName || "User"}
                </p>
              </div>
            )}
          </div>

          {/* TOGGLE */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

        </div>

        {/* NAV */}
        <nav className="p-3 space-y-1">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3
                  px-3 py-2.5 rounded-xl
                  transition-all duration-200
                  group
                  ${
                    isActive
                      ? "bg-[color-mix(in_srgb,var(--color-primary)_12%,white)] text-[var(--color-primary)]"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <Icon size={18} />

                {!collapsed && (
                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                )}

                {/* Active indicator */}
                {!collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full opacity-0 group-[.active]:opacity-100 bg-[var(--color-primary)]" />
                )}
              </NavLink>
            );
          })}

        </nav>
      </div>

      <div className="p-3 border-t space-y-2">

        <button
          onClick={handleLogout}
          className="
            flex items-center gap-3 w-full
            px-3 py-2.5 rounded-xl
            text-red-500 hover:bg-red-50
            transition
          "
        >
          <LogOut size={18} />

          {!collapsed && (
            <span className="text-sm font-medium">
              Logout
            </span>
          )}
        </button>

      </div>

    </aside>
  );
};

export default UserSidebar;