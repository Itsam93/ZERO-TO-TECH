import { useEffect, useState } from "react";
import API from "../../services/api";

const statusStyles = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  /* ================= FETCH ================= */
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ IMPORTANT: this endpoint should now return TRANSACTIONS
      const res = await API.get("/transactions");
      setPayments(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  /* ================= HELPERS ================= */
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  const showError = (text) => {
    setError(text);
    setTimeout(() => setError(null), 3000);
  };

  /* ================= DELETE ================= */
  const deletePayment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      setError(null);

      await API.delete(`/transactions/${id}`);

      setPayments((prev) => prev.filter((p) => p._id !== id));

      if (selected?._id === id) {
        setSelected(null);
      }

      showMessage("Transaction deleted successfully");
    } catch (err) {
      console.error(err);
      showError("Failed to delete transaction");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">

      {/* ================= LEFT LIST ================= */}
      <div className="bg-white rounded-xl shadow p-4">

        <h2 className="text-xl font-semibold mb-4">
          Transactions
        </h2>

        {message && (
          <div className="mb-3 p-2 text-sm rounded bg-green-50 text-green-700 border">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-3 p-2 text-sm rounded bg-red-50 text-red-700 border">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-3">

            {payments.length === 0 ? (
              <p className="text-sm text-gray-400">
                No transactions found
              </p>
            ) : (
              payments.map((pay) => (
                <div
                  key={pay._id}
                  onClick={() => setSelected(pay)}
                  className={`p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50 ${
                    selected?._id === pay._id
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                >
                  <p className="font-medium">
                    {pay.email}
                  </p>

                  <p className="text-sm text-gray-500">
                    ₦{Number(pay.amount || 0).toLocaleString()}
                  </p>

                  <p className="text-xs text-gray-400">
                    {pay.productType?.toUpperCase()}
                  </p>

                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      statusStyles[pay.status] || statusStyles.pending
                    }`}
                  >
                    {pay.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ================= RIGHT DETAILS ================= */}
      <div className="md:col-span-2 bg-white rounded-xl shadow p-6">

        {selected ? (
          <>
            <div className="flex justify-between mb-4 items-start">

              <h3 className="text-xl font-semibold">
                {selected.email}
              </h3>

              <button
                onClick={() => deletePayment(selected._id)}
                disabled={actionLoading}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>

            <div className="space-y-3 text-gray-700 text-sm">

              <p>
                <strong>Email:</strong> {selected.email}
              </p>

              <p>
                <strong>Product Type:</strong>{" "}
                {selected.productType}
              </p>

              <p>
                <strong>Product ID:</strong>{" "}
                {selected.productId}
              </p>

              <p>
                <strong>Amount:</strong> ₦
                {Number(selected.amount || 0).toLocaleString()}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    statusStyles[selected.status] ||
                    statusStyles.pending
                  }`}
                >
                  {selected.status}
                </span>
              </p>

              <p>
                <strong>Reference:</strong>{" "}
                {selected.reference}
              </p>

              <p className="text-xs text-gray-400">
                Date:{" "}
                {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a transaction to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsAdmin;