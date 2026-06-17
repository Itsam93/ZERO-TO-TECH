// 📄 Location: components/PaymentModal.jsx
import { useState } from "react";
import { CreditCard, Landmark, X, MailCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import API from "@/services/api";

const PaymentModal = ({ 
  itemType = "course", 
  itemId,              
  title,              
  amount,            
  onClose 
}) => {
  const [step, setStep] = useState("select"); 
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleMethodSelect = (method) => {
    setPaymentMethod(method);
    setStep("form");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build dynamic endpoint targeting matching routes
      const endpoint = itemType === "resource" 
        ? `/resources/pay/${itemId}` 
        : `/payments/initialize`; // Keeping your legacy course endpoint fallback structured

      const payload = {
        ...form,
        paymentMethod, // Sends "card" or "transfer" cleanly to backend controller branches
        amount,
        [itemType === "resource" ? "resourceId" : "courseId"]: itemId,
        course: title, // Legacy backward compatibility support fallback parameter
      };

      const res = await API.post(endpoint, payload);

      if (res?.data?.method === "transfer" || res?.data?.success && paymentMethod === "transfer") {
        toast.success(res?.data?.message || "Transfer coordinates successfully dispatched to inbox!", {
          duration: 8000,
          icon: <MailCheck className="text-emerald-600" />
        });
        onClose();
        return;
      }

      const gatewayUrl = res?.data?.data?.authorization_url || res?.data?.authorization_url;
      if (!gatewayUrl) {
        toast.error("Automated check-out gateway window unmounted.");
        return;
      }

      toast.success("Redirecting safely to secure check-out portal...");
      window.location.href = gatewayUrl;
    } catch (err) {
      console.error("PAYMENT MODAL ERROR INTERCEPT:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Initialization failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative border border-slate-100 overflow-hidden">
        
        {/* Loading/Routing Guard Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] z-30 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 border-3 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-600 tracking-wide">Routing secure credentials...</p>
          </div>
        )}

        {/* CLOSE CONTROL */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer"
          aria-label="Close modal configuration"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">
          {step === "select" ? "Select Payment Channel" : "Complete Purchase"}
        </h2>

        <p className="text-xs text-slate-400 font-medium mb-6 uppercase tracking-wider">
          {itemType}: <span className="text-slate-700 font-bold normal-case text-sm tracking-normal">{title}</span>
        </p>

        <AnimatePresence mode="wait">
          {step === "select" && (
            <motion.div
              key="select-step"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.18 }}
              className="space-y-3"
            >
              <button
                type="button"
                onClick={() => handleMethodSelect("card")}
                className="w-full text-left border border-slate-200 hover:border-slate-400 rounded-xl p-4 flex items-center gap-4 transition duration-200 group cursor-pointer"
              >
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Pay Online with Card / USSD</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Instant verification via automated payment gateway</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleMethodSelect("transfer")}
                className="w-full text-left border border-slate-200 hover:border-slate-400 rounded-xl p-4 flex items-center gap-4 transition duration-200 group cursor-pointer"
              >
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Landmark size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Direct Bank Transfer</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Receive corporate billing coordinates straight to your inbox</p>
                </div>
              </button>
            </motion.div>
          )}

          {step === "form" && (
            <motion.form
              key="form-step"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.18 }}
              onSubmit={handlePayment} 
              className="space-y-4"
            >
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-950 transition outline-none text-sm font-medium"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-950 transition outline-none text-sm font-medium"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-950 transition outline-none text-sm font-medium"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-sm transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-950 hover:bg-slate-800 active:scale-[0.99] text-white py-3 rounded-xl font-bold text-sm transition shadow-md shadow-slate-950/10 cursor-pointer"
                >
                  {paymentMethod === "transfer" 
                    ? `Get Invoice via Email • ₦${Number(amount || 0).toLocaleString()}` 
                    : `Proceed to Payment • ₦${Number(amount || 0).toLocaleString()}`}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default PaymentModal;