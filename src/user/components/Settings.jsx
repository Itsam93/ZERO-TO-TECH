import { useState } from "react";
import toast from "react-hot-toast";
import { 
  Lock, 
  KeyRound, 
  Loader2, 
  Settings as SettingsIcon, 
  ShieldAlert 
} from "lucide-react";
import { motion } from "framer-motion";
import { changePassword } from "@/services/userApi";

const Settings = () => {
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error("All structural verification inputs required");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Target security passphrase must be ≥ 6 characters");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passphrase matching constraint failed");
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (res.data.success) {
        toast.success("Security keys successfully re-mapped");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Credential change operation dropped");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-6 py-12 space-y-10 min-h-screen"
    >
      
      {/* ================= GLOBAL SECTION HEADER ================= */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          Security Settings <SettingsIcon size={22} className="text-slate-400 spin-slow" />
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1.5">
          Configure security authorization credentials and cryptographic entry keys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Security Gateways
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Change or Update your Current Password. Ensure a complex array structure is implemented to protect your account.
          </p>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6 sm:p-8">
          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            
            {/* CURRENT PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••••"
                  disabled={passwordLoading}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50/30 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* NEW PASSWORD */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter New Password"
                    disabled={passwordLoading}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50/30 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition disabled:opacity-60"
                  />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Re-enter New Password"
                    disabled={passwordLoading}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50/30 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-rose-600/10"
              >
                {passwordLoading ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
                {passwordLoading ? "Encrypting..." : "Update New Password"}
              </button>
            </div>

          </form>
        </div>
      </div>

    </motion.main>
  );
};

export default Settings;