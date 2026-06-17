import { useState } from "react";
import API from "../../services/api";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Please fill in all verification credentials.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      const adminData = res.data.data;

      // Ensure account has clearance before proceeding
      if (adminData.role !== "admin") {
        toast.error("Access denied. Unauthorized system privileges.");
        return;
      }

      login({
        token: adminData.token,
        user: {
          role: adminData.role,
          email: adminData.email,
          _id: adminData._id,
        },
      });

      toast.success("Authentication successful! Loading dashboard...");
      
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 800);

    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication dropped. Verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-50/50 antialiased selection:bg-slate-900 selection:text-white">
      
      {/* NAVIGATION OUTLET */}
      <Link
        to="/"
        className={`absolute top-8 left-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-all duration-300 ${
          loading ? "pointer-events-none opacity-30" : ""
        }`}
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      {/* CORE IDENTITY FRAME */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md px-4"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200/80 p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-100/50 space-y-6"
        >
          <div className="text-center space-y-1.5 pb-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Admin Login
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Enter authorization keys to access the admin portal.
            </p>
          </div>

          {/* EMAIL SECTOR */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enter Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="email"
                placeholder="johndoe@example.com"
                disabled={loading}
                required
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50/30 outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-900 transition duration-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* PASSWORD SECTOR */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Enter Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                disabled={loading}
                required
                className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50/30 outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-900 transition duration-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <button
                type="button"
                tabIndex="-1"
                disabled={loading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition disabled:opacity-30"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* SUBMIT TRIGGERS */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white py-3 rounded-xl text-xs font-bold tracking-wide shadow-sm hover:bg-slate-800 transition active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Running Verification...
                </>
              ) : (
                "Authorize & Enter"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;