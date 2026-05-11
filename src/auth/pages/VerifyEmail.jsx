import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "@/services/userApi";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const [status, setStatus] = useState("loading");
  // loading | success | error

  /* ================= VERIFY EMAIL ================= */
  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    // Prevent double execution (React StrictMode safe guard)
    if (hasRun.current) return;
    hasRun.current = true;

    const runVerification = async () => {
      try {
        setStatus("loading");

        const res = await verifyEmail(token);

        if (res.data.success) {
          setStatus("success");
          toast.success(res.data.message || "Email verified successfully");

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setStatus("error");
        }

      } catch (error) {
        setStatus("error");

        const message =
          error?.response?.data?.message ||
          "Verification failed or link expired";

        toast.error(message);
      }
    };

    runVerification();
  }, [token, navigate]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">

        {/* LOADING */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />

            <h2 className="text-xl font-semibold">
              Verifying your email...
            </h2>

            <p className="text-gray-500 text-sm">
              Please wait while we activate your account.
            </p>
          </div>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 size={50} className="text-green-600" />

            <h2 className="text-xl font-semibold text-green-600">
              Email Verified!
            </h2>

            <p className="text-gray-600 text-sm">
              Your account is now active. Redirecting to login...
            </p>
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle size={50} className="text-red-500" />

            <h2 className="text-xl font-semibold text-red-600">
              Verification Failed
            </h2>

            <p className="text-gray-600 text-sm">
              The link may be invalid, expired, or already used.
            </p>

            <div className="flex gap-3 mt-2">

              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go to Register
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Retry
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;