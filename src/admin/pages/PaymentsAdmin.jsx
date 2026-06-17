// 📄 Location: views/PaymentsAdmin.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  CreditCard, 
  Trash2, 
  Mail, 
  Layers, 
  Hash, 
  Activity, 
  Calendar, 
  Loader2, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight
} from "lucide-react";

// ✅ Kept as statusStyles to match your original configuration
const statusStyles = {
  paid: {
    badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
    icon: <CheckCircle size={14} className="text-emerald-600" />,
    text: "Successful"
  },
  pending: {
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    icon: <Clock size={14} className="text-amber-600" />,
    text: "Pending"
  },
  failed: {
    badge: "bg-rose-50 border-rose-200 text-rose-700",
    icon: <XCircle size={14} className="text-rose-600" />,
    text: "Failed"
  }
};

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  /* ================= FETCH DATA FROM SERVER ================= */
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/transactions");
      setPayments(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
      setError("We could not load the transactions list. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  /* ================= RUN TEMPORARY ALERTS ================= */
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 4000);
  };

  const showError = (text) => {
    setError(text);
    setTimeout(() => setError(null), 4000);
  };

  /* ================= PERMANENTLY REMOVE TRANSACTION ================= */
  const deletePayment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently remove this transaction record?"
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

      showMessage("The transaction record was successfully deleted.");
    } catch (err) {
      console.error(err);
      showError("Could not delete this transaction. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-800 antialiased">
      
      {/* HEADER BAR AREA */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Transactions</h1>
        <p className="text-xs text-slate-500 mt-1">Review processing statuses, check customer data, and audit sales logs.</p>
      </div>

      {/* SYSTEM FEEDBACK NOTIFICATIONS */}
      {message && (
        <div className="p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
          <CheckCircle size={15} className="text-emerald-600" />
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2">
          <AlertTriangle size={15} className="text-rose-600" />
          {error}
        </div>
      )}

      {/* CORE CONTENT LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ================= LEFT SIDE: LIVE TRANSACTIONS REGISTER ================= */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Activity Registry</h2>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
              {payments.length} Total
            </span>
          </div>

          {loading ? (
            <div className="space-y-2 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 w-full bg-slate-50/80 border border-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
              <CreditCard size={20} className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No transactions recorded</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {payments.map((pay) => {
                // ✅ FIXED HERE: Changed statusColors to statusStyles
                const currentStatus = statusStyles[pay.status] || statusStyles.pending;
                const isSelected = selected?._id === pay._id;

                return (
                  <div
                    key={pay._id}
                    onClick={() => setSelected(pay)}
                    className={`group p-3 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/20 shadow-sm"
                        : "border-slate-100 bg-white hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <p className={`text-xs truncate ${isSelected ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                        {pay.email}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          ₦{Number(pay.amount || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                          • {pay.productType || "Unknown"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border flex items-center gap-1 ${currentStatus.badge}`}>
                        {currentStatus.text}
                      </span>
                      <ArrowRight size={12} className={`text-slate-300 transition-transform ${isSelected ? "text-emerald-600 translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= RIGHT SIDE: COMPREHENSIVE VARIABLE DETAILS ================= */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 min-h-[480px] sticky top-6">
          {selected ? (
            <div className="space-y-6">
              
              {/* DETAIL ROW HEADER */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="min-w-0">
                  <span className="text-[9px] bg-slate-900 text-white font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                    Receipt Summary
                  </span>
                  <h3 className="text-base font-bold text-slate-900 truncate mt-2">{selected.email}</h3>
                </div>

                <button
                  onClick={() => deletePayment(selected._id)}
                  disabled={actionLoading}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={13} /> Delete Record
                    </>
                  )}
                </button>
              </div>

              {/* CORE DATA DISPLAY MATRIX */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* AMOUNT CARD */}
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <CreditCard size={12} /> Total Funds Captured
                  </span>
                  <p className="text-lg font-black text-slate-900">
                    ₦{Number(selected.amount || 0).toLocaleString()}
                  </p>
                </div>

                {/* CURRENT SYSTEM STATE */}
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Activity size={12} /> Verification Status
                  </span>
                  <div className="pt-0.5">
                    {/* ✅ FIXED HERE: Changed statusColors to statusStyles */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold uppercase rounded-md border ${(statusStyles[selected.status] || statusStyles.pending).badge}`}>
                      {(statusStyles[selected.status] || statusStyles.pending).icon}
                      {(statusStyles[selected.status] || statusStyles.pending).text}
                    </span>
                  </div>
                </div>

                {/* INFORMATION BLOCKS */}
                <div className="md:col-span-2 space-y-3 pt-2">
                  
                  {/* EMAIL ELEMENT */}
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-400 flex items-center gap-1"><Mail size={13} /> Account Email</span>
                    <span className="font-bold text-slate-800 break-all pl-4 text-right">{selected.email}</span>
                  </div>

                  {/* PRODUCT TYPE TYPE */}
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-400 flex items-center gap-1"><Layers size={13} /> Product Track Type</span>
                    <span className="font-bold text-slate-800 uppercase tracking-wide">{selected.productType || "N/A"}</span>
                  </div>

                  {/* OBJECT REFERENCE ID */}
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-400 flex items-center gap-1"><Hash size={13} /> Core Product ID</span>
                    <span className="font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border text-[11px]">{selected.productId || "N/A"}</span>
                  </div>

                  {/* GATEWAY AUDIT REFERENCE */}
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-400 flex items-center gap-1"><Activity size={13} /> Gateway Reference</span>
                    <span className="font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border text-[11px] select-all truncate max-w-[220px] sm:max-w-xs">{selected.reference || "N/A"}</span>
                  </div>

                  {/* CREATION TIMESTAMPS */}
                  <div className="flex items-center justify-between text-xs py-2">
                    <span className="font-semibold text-slate-400 flex items-center gap-1"><Calendar size={13} /> Transaction Log Date</span>
                    <span className="font-bold text-slate-500">
                      {new Date(selected.createdAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[380px] text-center my-auto">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 flex items-center justify-center mb-3 shadow-inner">
                <CreditCard size={20} />
              </div>
              <h3 className="text-xs font-bold text-slate-700">No log selected</h3>
              <p className="text-slate-400 text-[11px] mt-1 max-w-[240px] mx-auto">
                Please click a transaction ledger summary link from the left-side tracking timeline grid to audit its data records.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PaymentsAdmin;