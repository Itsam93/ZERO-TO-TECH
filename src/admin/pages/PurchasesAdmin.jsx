import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import { 
  ShoppingBag, 
  Trash2, 
  Search, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  User,
  BookOpen,
  Hash,
  Calendar,
  Filter
} from "lucide-react";

const statusStyles = {
  paid: {
    badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
    pill: "bg-emerald-600 text-white",
    text: "Successful"
  },
  pending: {
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    pill: "bg-amber-500 text-white",
    text: "Pending"
  },
  failed: {
    badge: "bg-rose-50 border-rose-200 text-rose-700",
    pill: "bg-rose-600 text-white",
    text: "Failed"
  }
};

const PurchasesAdmin = () => {
  const [purchases, setPurchases] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await API.get("/purchases");
      setPurchases(res.data.data || res.data || []);
    } catch (err) {
      console.error("FETCH PURCHASES ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const deletePurchase = async (id) => {
    if (!confirm("Are you sure you want to permanently remove this purchase record?")) return;

    try {
      await API.delete(`/purchases/${id}`);
      setPurchases((prev) => prev.filter((p) => p._id !== id));
      setSelected(null);
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const filtered = useMemo(() => {
    return purchases.filter((p) => {
      const matchesSearch =
        p?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p?.resource?.title?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "all" ? true : p.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [purchases, search, filter]);

  const totalRevenue = useMemo(() => {
    return purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [purchases]);

  const totalSales = purchases.length;
  const paidCount = purchases.filter((p) => p.status === "paid").length;

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-slate-800 antialiased">

      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Purchases Ledger</h1>
        <p className="text-xs text-slate-500 mt-1">Track digital resource sales, monitor active invoicing records, and audit revenue pipelines.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm flex items-center justify-between transition-all hover:shadow-md/5">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Gross Revenue</p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">₦{totalRevenue.toLocaleString()}</h2>
          </div>
          <div className="p-3 rounded-xl border bg-emerald-50 text-emerald-600 border-emerald-100">
            <DollarSign size={18} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm flex items-center justify-between transition-all hover:shadow-md/5">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Orders</p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{totalSales}</h2>
          </div>
          <div className="p-3 rounded-xl border bg-blue-50 text-blue-600 border-blue-100">
            <ShoppingBag size={18} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm flex items-center justify-between transition-all hover:shadow-md/5">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Settled Accounts</p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{paidCount}</h2>
          </div>
          <div className="p-3 rounded-xl border bg-purple-50 text-purple-600 border-purple-100">
            <CheckCircle2 size={18} />
          </div>
        </div>

      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
        
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search buyer identity or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-slate-200/50 focus:border-slate-400 transition"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mr-1 flex items-center gap-1">
            <Filter size={11} /> Filter:
          </span>
          {["all", "paid", "pending", "failed"].map((s) => {
            const isActive = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isActive
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s === "all" ? "View All" : s.toUpperCase()}
              </button>
            );
          })}
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-4 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
            Realtime Sales Activity ({filtered.length})
          </h2>

          {loading ? (
            <div className="space-y-2 py-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 w-full bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
              <ShoppingBag size={20} className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No transactions recorded</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filtered.map((p) => {
                const isSelected = selected?._id === p._id;
                const statusMeta = statusStyles[p.status] || statusStyles.pending;

                return (
                  <div
                    key={p._id}
                    onClick={() => setSelected(p)}
                    className={`group p-3 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 ${
                      isSelected
                        ? "border-slate-900 bg-slate-50 shadow-sm"
                        : "border-slate-100 bg-white hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className={`text-xs truncate ${isSelected ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                        {p?.user?.name || "Anonymous Buyer"}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {p?.resource?.title || "Digital Asset"}
                      </p>
                      <p className="text-xs font-bold text-slate-900 pt-1">
                        ₦{(p.amount || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border ${statusMeta.badge}`}>
                        {statusMeta.text}
                      </span>
                      <ArrowRight size={12} className={`text-slate-300 transition-transform ${isSelected ? "text-slate-900 translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 min-h-[460px] lg:sticky lg:top-6">
          {selected ? (
            <div className="space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="min-w-0">
                  <span className="text-[9px] bg-slate-900 text-white font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                    Invoice Details
                  </span>
                  <h3 className="text-base font-bold text-slate-900 truncate mt-2">{selected.user?.name || "Anonymous Profile"}</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{selected.user?.email}</p>
                </div>

                <button
                  onClick={() => deletePurchase(selected._id)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} /> Delete Record
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <DollarSign size={12} /> Funds Captured
                  </span>
                  <p className="text-xl font-black text-slate-900">
                    ₦{(selected.amount || 0).toLocaleString()}
                  </p>
                </div>

                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <AlertCircle size={12} /> Clearing Settlement
                  </span>
                  <div className="pt-0.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold uppercase rounded-md border ${(statusStyles[selected.status] || statusStyles.pending).badge}`}>
                      {(statusStyles[selected.status] || statusStyles.pending).text}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-3 pt-2">
                  
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-400 flex items-center gap-1"><BookOpen size={13} /> Acquired Asset</span>
                    <span className="font-bold text-slate-800 break-all pl-4 text-right">{selected.resource?.title || "N/A"}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-400 flex items-center gap-1"><Hash size={13} /> Gateway Core Reference</span>
                    <span className="font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border text-[11px] select-all truncate max-w-[220px] sm:max-w-xs">
                      {selected.reference || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2">
                    <span className="font-semibold text-slate-400 flex items-center gap-1"><Calendar size={13} /> Order Execution Date</span>
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
            <div className="flex flex-col items-center justify-center h-full min-h-[340px] text-center my-auto">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 flex items-center justify-center mb-3 shadow-inner">
                <ShoppingBag size={20} />
              </div>
              <h3 className="text-xs font-bold text-slate-700">No ledger block chosen</h3>
              <p className="text-slate-400 text-[11px] mt-1 max-w-[240px] mx-auto">
                Please pick an indexing invoice activity card link from the tracking timeline flow module to view details.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PurchasesAdmin;