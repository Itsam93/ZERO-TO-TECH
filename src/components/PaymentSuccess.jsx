import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "@/services/api";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); 
  // verifying | success | error

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = params.get("reference");

      if (!reference) {
        setStatus("error");
        return;
      }

      try {
        const res = await API.get(
          `/transactions/verify/${reference}`
        );

        console.log("VERIFY RESPONSE:", res.data);

        setStatus("success");

        // redirect after short delay
        setTimeout(() => {
          navigate("/resources"); 
          // you can change to dashboard later
        }, 3000);

      } catch (err) {
        console.error("VERIFY ERROR:", err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full">

        {/* ================= VERIFYING ================= */}
        {status === "verifying" && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Verifying Payment...
            </h2>
            <p className="text-gray-500">
              Please wait while we confirm your transaction.
            </p>
          </>
        )}

        {/* ================= SUCCESS ================= */}
        {status === "success" && (
          <>
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              Payment Successful 🎉
            </h2>

            <p className="text-gray-600 mb-4">
              Your purchase has been confirmed.
            </p>

            <p className="text-sm text-gray-400">
              Redirecting you shortly...
            </p>

            <button
              onClick={() => navigate("/resources")}
              className="mt-5 px-6 py-2 bg-green-600 text-white rounded-full hover:opacity-90"
            >
              Go to Resources
            </button>
          </>
        )}

        {/* ================= ERROR ================= */}
        {status === "error" && (
          <>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Verification Failed
            </h2>

            <p className="text-gray-500 mb-4">
              We couldn’t confirm your payment. Please contact support.
            </p>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gray-800 text-white rounded-full"
            >
              Go Home
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;