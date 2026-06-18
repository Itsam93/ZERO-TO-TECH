import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/services/userApi";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/auth/AuthContext";
import API from "@/services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    agreedToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!form.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!form.agreedToTerms) {
      toast.error("You must agree to the terms and policies");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await registerUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        agreedToTerms: form.agreedToTerms,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/check-email", { state: { email: form.email } });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/google", {
        token: credentialResponse.credential,
      });

      if (res.data.success) {
        login({
          token: res.data.token,
          user: res.data.data,
        });

        toast.success(res.data.message);
        navigate("/user/dashboard");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10 relative overflow-hidden">
      
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-white"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center max-w-sm text-center px-6"
            >
              <div className="relative mb-6 flex items-center justify-center">
                <div className="absolute w-20 h-20 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
                <Loader2 className="text-blue-500 animate-spin relative z-10" size={56} strokeWidth={1.5} />
                <ShieldCheck className="text-white absolute scale-90" size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-slate-100 mb-2">Please wait!</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Creating your account and connecting to the dashboard...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-[-140px] left-[-140px] w-[320px] h-[320px] bg-cyan-400/10 blur-3xl rounded-full" />

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_90px_rgba(0,0,0,0.12)] animate-fadeIn">
        
        <div className="flex justify-center mb-5">
          <div className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
            JOIN ZERO-TO-TECH AFRICA
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-3">Start learning tech skills and grow your career.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              disabled={loading}
              className="w-full h-12 pl-11 border rounded-2xl bg-gray-50/70 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none disabled:opacity-60"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full h-12 pl-11 border rounded-2xl bg-gray-50/70 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none disabled:opacity-60"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full h-12 pl-11 pr-12 border rounded-2xl bg-gray-50/70 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none disabled:opacity-60"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={form.agreedToTerms}
              onChange={handleChange}
              disabled={loading}
              className="mt-1"
            />
            <span>
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-blue-600">Terms</Link> and{" "}
              <Link to="/policies" className="text-blue-600">Policies</Link>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !form.agreedToTerms}
            className={`w-full h-12 rounded-2xl text-white font-semibold transition flex items-center justify-center gap-2 ${
              loading || !form.agreedToTerms
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-xl"
            }`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative bg-white px-4 text-xs text-gray-400 uppercase tracking-widest">
              Or continue with
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Login Failed")}
            />
          </div>
        </div>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.7s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Register;