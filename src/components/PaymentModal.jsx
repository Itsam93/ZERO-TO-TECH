import { useState } from "react";
import API from "@/services/api";

const PaymentModal = ({ course, amount, onClose }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        course,
        amount,
      };

      const res = await API.post("/payments/initialize", payload);

      window.location.href = res.data.data.authorization_url;
    } catch (err) {
      console.error("Payment init error:", err);
      alert("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Complete Enrollment
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Course: <span className="font-medium">{course}</span>
        </p>

        <form onSubmit={handlePayment} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full border p-2 rounded"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <button
            disabled={loading}
            className="w-full bg-[var(--color-secondary)] text-white py-2 rounded-full"
          >
            {loading ? "Processing..." : `Pay ₦${amount}`}
          </button>

        </form>

      </div>
    </div>
  );
};

export default PaymentModal;