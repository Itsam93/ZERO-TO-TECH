import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
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
  const location = useLocation();

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
        h-screen flex flex-col justify-between relative
        border-r border-slate-100 bg-white
        transition-all duration-300 ease-[0.25,0.1,0.25,1]
        z-40 shadow-[1px_0_10px_rgba(0,0,0,0.01)]
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-7 -right-3.5 bg-white border border-slate-100 rounded-full w-7 h-7 flex items-center justify-center hover:bg-slate-50 transition-all duration-200 shadow-md cursor-pointer text-slate-500 hover:text-slate-900 z-50"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div>
        <div className={`p-6 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-md shadow-slate-950/10 shrink-0">
            <GraduationCap size={18} />
          </div>

          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                ZeroToTech
              </h1>
              <p className="text-[10px] font-bold text-[var(--color-primary)] tracking-widest uppercase mt-0.5">
                Academy
              </p>
            </motion.div>
          )}
        </div>

        <nav className="px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-3.5 py-3 rounded-xl
                  transition-all duration-200 group relative
                  ${
                    isActive
                      ? "text-[var(--color-primary)] font-semibold bg-slate-50/80"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-[var(--color-primary)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <div className={`transition-transform duration-200 ${isActive ? "scale-105" : "group-hover:scale-105"}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 2} />
                </div>

                {!collapsed && (
                  <motion.span 
                    className="text-sm ml-3 tracking-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.name}
                  </motion.span>
                )}

                {collapsed && isActive && (
                  <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-3">
        {!collapsed ? (
          <motion.div 
            className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-100 shadow-sm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-xs flex items-center justify-center border border-shadow-[var(--color-primary)]/5 uppercase shrink-0">
              {(user?.fullName || "U").charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                {user?.fullName || "User Account"}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                Portal Student
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center pb-1">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-xs flex items-center justify-center border border-shadow-[var(--color-primary)]/5 uppercase shadow-sm">
              {(user?.fullName || "U").charAt(0)}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="
            flex items-center w-full
            px-3.5 py-2.5 rounded-xl
            text-slate-400 hover:text-red-600 hover:bg-red-50/60
            transition-all duration-200 group cursor-pointer
            text-left
          "
        >
          <div className="group-hover:translate-x-0.5 transition-transform duration-200">
            <LogOut size={17} />
          </div>

          {!collapsed && (
            <motion.span 
              className="text-xs font-semibold tracking-tight ml-3.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Log Out Session
            </motion.span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;