import { useState } from "react";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openNotif, setOpenNotif] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  /* ================= MOCK NOTIFICATIONS ================= */
  const notifications = [
    {
      id: 1,
      title: "New course available",
      desc: "React Advanced Patterns is now live",
    },
    {
      id: 2,
      title: "Payment confirmed",
      desc: "Your course purchase was successful",
    },
    {
      id: 3,
      title: "Reminder",
      desc: "Continue your pending course",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full px-4 md:px-6 py-3 flex items-center justify-between">

      {/* ================= LEFT: SEARCH ================= */}
      <div className="flex items-center gap-3 flex-1">

        <div className="hidden md:flex items-center gap-2 w-full max-w-md bg-white border rounded-xl px-3 py-2 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, resources..."
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>

      </div>

      {/* ================= RIGHT ACTIONS ================= */}
      <div className="flex items-center gap-3 relative">

        {/* ================= NOTIFICATIONS ================= */}
        <div className="relative">

          <button
            onClick={() => setOpenNotif(!openNotif)}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <Bell size={18} />

            {/* notification dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* DROPDOWN */}
          {openNotif && (
            <div className="absolute right-0 mt-3 w-80 bg-white border shadow-lg rounded-2xl overflow-hidden z-50">

              <div className="p-3 border-b">
                <h3 className="font-semibold text-gray-800">
                  Notifications
                </h3>
              </div>

              <div className="max-h-72 overflow-y-auto">

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 hover:bg-gray-50 border-b last:border-none"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {n.desc}
                    </p>
                  </div>
                ))}

              </div>

            </div>
          )}

        </div>

        {/* ================= USER MENU ================= */}
        <div className="relative">

          <button
            onClick={() => setOpenUser(!openUser)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition"
          >

            {/* avatar */}
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-semibold">
              {user?.fullName?.charAt(0) || "U"}
            </div>

            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user?.fullName || "User"}
            </span>

          </button>

          {/* USER DROPDOWN */}
          {openUser && (
            <div className="absolute right-0 mt-3 w-56 bg-white border shadow-lg rounded-2xl overflow-hidden z-50">

              <div className="p-3 border-b">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || ""}
                </p>
              </div>

              <button
                onClick={() => navigate("/user/profile")}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
              >
                <User size={16} /> Profile
              </button>

              <button
                onClick={() => navigate("/user/settings")}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
              >
                <Settings size={16} /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut size={16} /> Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default UserNavbar;