import { useState, useEffect, useRef } from "react";
import { Bell, Search, User, LogOut, Settings, CheckCircle } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const UserNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openNotif, setOpenNotif] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  // References to detect clicks outside elements
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: "New course available",
      desc: "React Advanced Patterns is now live",
      time: "2h ago",
    },
    {
      id: 2,
      title: "Payment confirmed",
      desc: "Your course purchase was successful",
      time: "5h ago",
    },
    {
      id: 3,
      title: "Reminder",
      desc: "Continue your pending course",
      time: "1d ago",
    },
  ];

  // Close drop-downs automatically on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setOpenNotif(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setOpenUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.15, ease: [0.215, 0.61, 0.355, 1] }
    },
    exit: { 
      opacity: 0, 
      y: 8, 
      scale: 0.98,
      transition: { duration: 0.1, ease: "easeIn" }
    }
  };

  return (
    <div className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      
      {/* SEARCH BLOCK */}
      <div className="flex items-center gap-3 flex-1">
        <div className="hidden md:flex items-center gap-2.5 w-full max-w-sm bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 focus-within:bg-white focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10 transition-all duration-200">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, resources..."
            className="w-full outline-none text-sm bg-transparent text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {/* ACTIONS BLOCK */}
      <div className="flex items-center gap-4">
        
        {/* NOTIFICATIONS DROPDOWN */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setOpenNotif(!openNotif);
              setOpenUser(false);
            }}
            className={`relative p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              openNotif ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Bell size={19} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          <AnimatePresence>
            {openNotif && (
              <motion.div 
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-50 origin-top-right"
              >
                <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                    Notifications
                  </h3>
                  <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider bg-[var(--color-primary)]/10 px-2 py-0.5 rounded">
                    3 New
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-4 hover:bg-slate-50/60 transition-colors duration-150 flex gap-3 cursor-pointer group"
                    >
                      <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0 group-hover:scale-125 transition-transform" />
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-slate-900 leading-tight">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {n.desc}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium pt-1">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PROFILE ACCOUNT DROPDOWN */}
        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => {
              setOpenUser(!openUser);
              setOpenNotif(false);
            }}
            className={`flex items-center gap-2.5 p-1 rounded-xl transition-all duration-200 cursor-pointer ${
              openUser ? "bg-slate-100" : "hover:bg-slate-50"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center text-xs font-bold shadow-sm uppercase tracking-wider">
              {user?.fullName?.charAt(0) || "U"}
            </div>

            <span className="hidden md:block text-xs font-bold text-slate-800 pr-1 tracking-tight">
              {user?.fullName || "Student"}
            </span>
          </button>

          <AnimatePresence>
            {openUser && (
              <motion.div 
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-3 w-60 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                    {user?.fullName || "User Account"}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-1">
                    {user?.email || "student@zerototech.africa"}
                  </p>
                </div>

                <div className="p-1.5 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => { setOpenUser(false); navigate("/user/profile"); }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <User size={14} className="text-slate-400" /> Profile Details
                  </button>

                  <button
                    type="button"
                    onClick={() => { setOpenUser(false); navigate("/user/settings"); }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <Settings size={14} className="text-slate-400" /> Portal Settings
                  </button>
                </div>

                <div className="p-1.5 border-t border-slate-100 bg-slate-50/30">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50/60 transition-colors"
                  >
                    <LogOut size={14} /> End Session
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default UserNavbar;