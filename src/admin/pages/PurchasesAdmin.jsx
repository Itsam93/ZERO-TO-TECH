import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";

const statusStyles = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

const PurchasesAdmin = () => {
  const [purchases, setPurchases] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* ================= FETCH ================= */
  const fetchPurchases = async () => {
    try {
      setLoading(true);

      const res = await API.get("/purchases");
      setPurchases(res.data.data || []);
    } catch (err) {
      console.error("FETCH PURCHASES ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  /* ================= DELETE ================= */
  const deletePurchase = async (id) => {
    if (!confirm("Delete this purchase record?")) return;

    try {
      await API.delete(`/purchases/${id}`);
      setPurchases((prev) => prev.filter((p) => p._id !== id));
      setSelected(null);
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  /* ================= FILTERED DATA ================= */
  const filtered = useMemo(() => {
    return purchases.filter((p) => {
      const matchesSearch =
        p?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p?.resource?.title?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ? true : p.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [purchases, search, filter]);

  /* ================= ANALYTICS ================= */
  const totalRevenue = purchases.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  const totalSales = purchases.length;

  const paidCount = purchases.filter((p) => p.status === "paid").length;

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-semibold">Purchases Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track all resource sales and transactions
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="p-5 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-2xl font-semibold">
            ₦{totalRevenue.toLocaleString()}
          </h2>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Total Purchases</p>
          <h2 className="text-2xl font-semibold">{totalSales}</h2>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Successful Payments</p>
          <h2 className="text-2xl font-semibold">{paidCount}</h2>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">

        <input
          placeholder="Search user or resource..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
        />

        <div className="flex gap-2">
          {["all", "paid", "pending", "failed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filter === s
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT LIST */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:col-span-1">

          <h2 className="text-lg font-semibold mb-4">All Purchases</h2>

          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-400">No purchases found</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((p) => (
                <div
                  key={p._id}
                  onClick={() => setSelected(p)}
                  className={`p-3 rounded-lg border cursor-pointer transition hover:shadow-sm ${
                    selected?._id === p._id
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                >
                  <p className="font-medium">
                    {p?.user?.name || "Unknown User"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {p?.resource?.title || "Resource"}
                  </p>

                  <p className="text-sm font-semibold">
                    ₦{p.amount?.toLocaleString()}
                  </p>

                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      statusStyles[p.status] || statusStyles.pending
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT DETAILS */}
        <div className="bg-white rounded-xl shadow-sm border p-6 md:col-span-2">

          {selected ? (
            <div className="space-y-4">

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    {selected.user?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selected.user?.email}
                  </p>
                </div>

                <button
                  onClick={() => deletePurchase(selected._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-700">

                <p>
                  <strong>Resource:</strong>{" "}
                  {selected.resource?.title}
                </p>

                <p>
                  <strong>Amount:</strong> ₦
                  {selected.amount?.toLocaleString()}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      statusStyles[selected.status]
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
                  {new Date(selected.createdAt).toLocaleString()}
                </p>

              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a purchase to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasesAdmin;