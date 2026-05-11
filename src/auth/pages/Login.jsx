import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

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

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= VALIDATION ================= */
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

  /* ================= RESEND VERIFICATION ================= */
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

  /* ================= SUBMIT LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await loginUser(form);
      const { data } = res.data;

      login({
        token: data.token,
        user: {
          _id: data._id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        },
      });

      toast.success("Login successful");

      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }

    } catch (error) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        "Login failed. Please try again.";

      if (status === 403) {
        toast.error(message);
      } else {
        toast.error(message);
      }

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

      {/* BACKGROUND */}
      <div className="absolute top-[-120px] left-[-120px] w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

      {/* CARD */}
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

          {/* ICON */}
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

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Continue your Tech learning journey
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="
                  w-full px-4 py-3 rounded-2xl
                  border border-gray-200
                  bg-white/80
                  outline-none
                  focus:ring-4 focus:ring-blue-100
                  focus:border-blue-500
                "
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="
                    w-full px-4 py-3 pr-12 rounded-2xl
                    border border-gray-200
                    bg-white/80
                    outline-none
                    focus:ring-4 focus:ring-blue-100
                    focus:border-blue-500
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* FORGOT */}
            <div className="flex justify-end">
              <button type="button" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 rounded-2xl text-white font-semibold
                flex items-center justify-center gap-2
                ${
                  loading
                    ? "bg-blue-300"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600"
                }
              `}
            >
              {loading ? "Logging in..." : <>Login <ArrowRight size={18} /></>}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 text-center text-sm space-y-3">

            <p>
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Create Account
              </Link>
            </p>

            {/* RESEND VERIFICATION */}
            <p>
              Didn’t receive verification email?{" "}
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend"}
              </button>
            </p>

          </div>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default Login;