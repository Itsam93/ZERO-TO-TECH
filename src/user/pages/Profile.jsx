// 📄 Location: views/Profile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getUserProfile } from "@/services/userApi";
import { 
  User, 
  Mail, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Edit3, 
  KeyRound, 
  AlertCircle 
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Profile = () => {
  const { token, user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getUserProfile(token);
      setProfile(res.data?.data);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to load profile";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-pulse">
        {/* Header Block Loader */}
        <div className="space-y-2">
          <div className="h-7 w-36 bg-slate-200 rounded-lg" />
          <div className="h-4 w-56 bg-slate-100 rounded-md" />
        </div>
        {/* Profile Card Container Loader */}
        <div className="bg-white border border-slate-100 rounded-2xl p-8 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-slate-200 rounded-md" />
              <div className="h-3 w-48 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-5 w-44 bg-slate-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-base font-bold text-slate-900">Failed to sync profile metrics</h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1">{error}</p>
        <button 
          onClick={fetchProfile}
          className="mt-4 text-xs font-semibold px-4 py-2 bg-slate-950 text-white rounded-lg hover:bg-slate-800 transition"
        >
          Reload Dashboard Connection
        </button>
      </main>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      className="max-w-4xl mx-auto px-6 py-12 space-y-8 min-h-screen"
    >
      
      {/* SECTION HEADER CHASSIS */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Account Profile
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm font-medium">
          Review security configurations and personal parameters
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        
        <div className="h-24 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-transparent border-b border-slate-100" />

        <div className="p-8 pt-0 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-10 mb-8 pb-6 border-b border-slate-100">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md border-4 border-white">
                {profile?.fullName?.charAt(0) || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                {profile?.isEmailVerified ? (
                  <CheckCircle2 size={12} className="text-emerald-500" />
                ) : (
                  <XCircle size={12} className="text-rose-400" />
                )}
              </div>
            </div>

            <div className="space-y-1 py-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {profile?.fullName || user?.fullName}
              </h2>
              <p className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                <Mail size={13} />
                {profile?.email || user?.email}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User size={13} className="text-slate-300" /> Full Name
              </span>
              <p className="text-slate-800 text-sm font-semibold bg-slate-50/60 border border-slate-100 px-4 py-2.5 rounded-xl">
                {profile?.fullName || "—"}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Mail size={13} className="text-slate-300" /> Registered Email Address
              </span>
              <p className="text-slate-800 text-sm font-semibold bg-slate-50/60 border border-slate-100 px-4 py-2.5 rounded-xl truncate">
                {profile?.email || "—"}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield size={13} className="text-slate-300" /> Account Privilege
              </span>
              <div className="bg-slate-50/60 border border-slate-100 px-4 py-2 rounded-xl flex items-center">
                <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100/40">
                  {profile?.role || "user"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                Security Verification
              </span>
              <div className="bg-slate-50/60 border border-slate-100 px-4 py-2 rounded-xl flex items-center">
                {profile?.isEmailVerified ? (
                  <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100/40 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Email Verified
                  </span>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100/40 flex items-center gap-1">
                    <XCircle size={12} /> Pending Verification
                  </span>
                )}
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock size={13} className="text-slate-300" /> Session Record
              </span>
              <p className="text-slate-600 text-xs font-medium bg-slate-50/40 px-4 py-3 rounded-xl border border-slate-100/80">
                Last secure authentication recorded at:{" "}
                <span className="text-slate-800 font-bold">
                  {profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : "System Fallback Frame / N/A"}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button 
              type="button"
              disabled
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed transition"
            >
              <Edit3 size={14} /> Profile Updates (Coming Soon)
            </button>

            <button 
              type="button"
              onClick={() => toast("Redirecting to verification suite...")}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition active:scale-[0.98]"
            >
              <KeyRound size={14} className="text-slate-400" /> Change Password
            </button>
          </div>

        </div>
      </div>
    </motion.main>
  );
};

export default Profile;