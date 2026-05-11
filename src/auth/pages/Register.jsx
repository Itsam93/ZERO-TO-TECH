import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/services/userApi";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    agreedToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= VALIDATION ================= */
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

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        agreedToTerms: form.agreedToTerms, // ✅ FIXED: now included
      };

      const res = await registerUser(payload);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }

    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        bg-gradient-to-br from-slate-50 via-white to-blue-50
        px-4 py-10 relative overflow-hidden
      "
    >

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-[-140px] left-[-140px] w-[320px] h-[320px] bg-cyan-400/10 blur-3xl rounded-full" />

      {/* CARD */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_90px_rgba(0,0,0,0.12)] animate-fadeIn">

        {/* BADGE */}
        <div className="flex justify-center mb-5">
          <div className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
            JOIN ZERO-TO-TECH AFRICA
          </div>
        </div>

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Create Account
          </h1>

          <p className="text-gray-500 mt-3">
            Start learning tech skills and grow your career.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* FULL NAME */}
          <div className="relative">
            <User className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="w-full h-12 pl-11 border rounded-2xl bg-gray-50/70 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full h-12 pl-11 border rounded-2xl bg-gray-50/70 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-4 top-3 text-gray-400" size={18} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full h-12 pl-11 pr-12 border rounded-2xl bg-gray-50/70 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* TERMS */}
          <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={form.agreedToTerms}
              onChange={handleChange}
              className="mt-1"
            />

            <span>
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-blue-600">Terms</Link>{" "}
              and{" "}
              <Link to="/policies" className="text-blue-600">Policies</Link>.
            </span>
          </label>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || !form.agreedToTerms}
            className={`w-full h-12 rounded-2xl text-white font-semibold transition ${
              loading || !form.agreedToTerms
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-xl"
            }`}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN */}
        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>

      {/* ANIMATION */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Register;