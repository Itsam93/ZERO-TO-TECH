import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { loginUser, resendVerificationEmail } from "@/services/userApi";
import { useAuth } from "@/auth/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleResendVerification = async () => {
    if (!form.email.trim()) {
      toast.error("Enter your email first");
      return;
    }

    try {
      setResending(true);

      const res = await resendVerificationEmail({
        email: form.email,
      });

      if (res.data.success) {
        toast.success("Verification email sent successfully");
      }

    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to resend verification email";

      toast.error(message);

    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await loginUser(form);

      const { token, data } = res.data;

      if (!token || !data) {
        throw new Error("Invalid login response from server");
      }

      login({
        token,
        user: {
          _id: data._id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        },
      });

      toast.success("Login successful");

      setTimeout(() => {
        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }, 800);

    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Login failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen relative overflow-hidden
      bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100
      flex items-center justify-center px-4 py-10
    ">

      <div className="absolute top-[-120px] left-[-120px] w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

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

              <h3 className="text-xl font-bold tracking-tight text-slate-100 mb-2">
                Please wait! 
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Verifying authorization data and configuring your Dashboard...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="
        relative w-full max-w-md
        backdrop-blur-xl bg-white/80
        border border-white/40
        rounded-3xl
        shadow-[0_20px_60px_rgba(0,0,0,0.12)]
        overflow-hidden
        animate-fadeIn
      ">

        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />

        <div className="p-8">

          {/* BRAND ICON */}
          <div className="flex justify-center mb-5">
            <div className="
              w-16 h-16 rounded-2xl
              bg-gradient-to-br from-blue-600 to-indigo-600
              flex items-center justify-center
              shadow-lg animate-float
            ">
              <ShieldCheck className="text-white" size={30} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              Continue your Tech learning journey
            </p>
          </div>

          {/* FORM MATRIX */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL INPUT LAYER */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="johndoe@example.com"
                disabled={loading}
                className="
                  w-full px-4 py-3 rounded-2xl
                  border border-gray-200/80
                  bg-white/80 text-sm font-medium
                  outline-none transition duration-200
                  focus:ring-4 focus:ring-blue-100
                  focus:border-blue-500 disabled:opacity-60
                "
              />
            </div>

            {/* PASSWORD INPUT LAYER */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  disabled={loading}
                  className="
                    w-full px-4 py-3 pr-12 rounded-2xl
                    border border-gray-200/80
                    bg-white/80 text-sm font-medium
                    outline-none transition duration-200
                    focus:ring-4 focus:ring-blue-100
                    focus:border-blue-500 disabled:opacity-60
                  "
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ACCOUNT CREDENTIAL RECOVERY BUTTON */}
            <div className="flex justify-end">
              <button type="button" disabled={loading} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3.5 rounded-2xl text-white font-bold text-sm
                flex items-center justify-center gap-2 shadow-md transition-all duration-200
                active:scale-[0.99] cursor-pointer
                ${
                  loading
                    ? "bg-blue-600/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 shadow-blue-600/10"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm space-y-3 font-medium text-gray-500">

            <p>
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline transition">
                Create Account
              </Link>
            </p>

            <p className="text-xs text-gray-400">
              Didn’t receive verification email?{" "}
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resending || loading}
                className="text-blue-600 font-bold hover:underline disabled:opacity-50 transition"
              >
                {resending ? "Sending..." : "Resend Link"}
              </button>
            </p>

          </div>
        </div>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-float {
          animation: float 3.5s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default Login;