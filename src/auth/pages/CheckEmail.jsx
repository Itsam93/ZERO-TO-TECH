import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { resendVerificationEmail } from "@/services/userApi";
import toast from "react-hot-toast";
import {
  MailCheck,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

const CheckEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [loading, setLoading] = useState(false);

  /* ================= RESEND EMAIL ================= */
  const handleResend = async () => {
    if (!email) {
      toast.error("No email address found");
      return;
    }

    try {
      setLoading(true);

      const res = await resendVerificationEmail({
        email,
      });

      if (res.data.success) {
        toast.success(
          res.data.message || "Verification email resent successfully"
        );
      }

    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to resend verification email";

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
      <div
        className="
          relative w-full max-w-md
          bg-white/90 backdrop-blur-xl
          border border-white/40
          rounded-3xl
          shadow-[0_20px_80px_rgba(0,0,0,0.08)]
          p-8 md:p-10
          transition-all duration-500
          hover:-translate-y-1
          hover:shadow-[0_25px_90px_rgba(0,0,0,0.12)]
          animate-fadeIn
        "
      >

        {/* BADGE */}
        <div className="flex justify-center mb-5">
          <div className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
            EMAIL VERIFICATION REQUIRED
          </div>
        </div>

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div
            className="
              w-20 h-20 rounded-full
              bg-gradient-to-br from-blue-500 to-cyan-500
              flex items-center justify-center
              shadow-lg
            "
          >
            <MailCheck className="text-white" size={38} />
          </div>
        </div>

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Check Your Email
          </h1>

          <p className="text-gray-500 mt-4 leading-relaxed">
            We have sent a verification link to your email address.
            Please open your inbox and click the verification link
            to activate your account.
          </p>
        </div>

        {/* EMAIL DISPLAY */}
        {email && (
          <div
            className="
              mt-6 p-4 rounded-2xl
              bg-blue-50 border border-blue-100
              text-center break-all
            "
          >
            <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold mb-1">
              Verification Email Sent To
            </p>

            <p className="text-sm md:text-base font-semibold text-blue-700">
              {email}
            </p>
          </div>
        )}

        {/* SECURITY NOTE */}
        <div
          className="
            mt-6 flex gap-3 items-start
            bg-emerald-50 border border-emerald-100
            rounded-2xl p-4
          "
        >
          <ShieldCheck
            className="text-emerald-600 mt-0.5"
            size={20}
          />

          <div>
            <h3 className="text-sm font-semibold text-emerald-700">
              Security Verification
            </h3>

            <p className="text-sm text-emerald-600 mt-1 leading-relaxed">
              Your account will remain inactive until your
              email address is verified.
            </p>
          </div>
        </div>

        {/* SPAM NOTE */}
        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500 leading-relaxed">
            Didn&apos;t receive the email?
            Check your spam, junk, or promotions folder.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 space-y-4">

          {/* RESEND BUTTON */}
          <button
            onClick={handleResend}
            disabled={loading}
            className={`
              w-full h-12 rounded-2xl text-white font-semibold transition
              flex items-center justify-center gap-2
              ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-xl"
              }
            `}
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />

            {loading
              ? "Resending verification..."
              : "Resend Verification Email"}
          </button>

          {/* BACK TO LOGIN */}
          <button
            onClick={() => navigate("/login")}
            className="
              w-full h-12 rounded-2xl
              border border-gray-200
              bg-white hover:bg-gray-50
              text-gray-700 font-semibold transition
              flex items-center justify-center gap-2
            "
          >
            <ArrowLeft size={18} />

            Back to Login
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-center text-sm mt-7 text-gray-600">
          Need a new account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>

      {/* ANIMATION */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CheckEmail;