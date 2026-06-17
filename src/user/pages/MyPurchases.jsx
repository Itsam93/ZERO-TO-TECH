import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Video,
  BookOpen,
  Loader,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PUBLIC_API from "@/services/publicApi";
import { toast } from "react-hot-toast";
import { useAuth } from "@/auth/AuthContext";

const ITEMS_PER_PAGE = 6;

const MyPurchases = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const { user, token } = useAuth(); 

  const fetchPurchases = async () => {
    try {
      setLoading(true);

      const res = await PUBLIC_API.get("/transactions/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const allTransactions = res.data.data || [];
        const successfulPurchases = allTransactions.filter(
          (item) => item?.status === "paid"
        );
        
        setTransactions(successfulPurchases);
      }
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      toast.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token) {
      toast.error("Please login to view purchases");
      navigate("/login");
      return;
    }

    fetchPurchases();
  }, [user, token]);

  const getProductName = (item) => {
    const product = item?.productId;

    if (!product) return item.productType;
    if (typeof product === "string") return "Loading item...";

    return product.title || product.name || item.productType;
  };

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const name = getProductName(t).toLowerCase();
      return name.includes(search.toLowerCase());
    });
  }, [search, transactions]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const getIcon = (type) => {
    if (type === "course") return BookOpen;
    if (type === "resource") return FileText;
    return Video;
  };

  const handleAccess = (item) => {
    if (item.productType === "course") {
      navigate(`/user/courses/${item.productId}`);
      return;
    }

    if (item.productType === "resource") {
      navigate(`/user/resources/${item.productId}`);
      return;
    }
  };

  return (
    <div className="min-h-screen px-6 py-20 bg-gray-50">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-semibold">
          My <span className="text-[var(--color-primary)]">Purchases</span>
        </h1>
        <p className="text-gray-600 mt-2">
          All your learning access in one place
        </p>
      </div>

      {/* CONTROLS */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3 justify-between mb-6">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border w-full md:w-1/2">
          <Search size={16} />
          <input
            placeholder="Search purchases..."
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-2 rounded-lg border flex items-center gap-2 cursor-pointer ${
              view === "grid" ? "bg-black text-white" : "bg-white"
            }`}
          >
            <LayoutGrid size={16} />
            Grid
          </button>

          <button
            onClick={() => setView("table")}
            className={`px-3 py-2 rounded-lg border flex items-center gap-2 cursor-pointer ${
              view === "table" ? "bg-black text-white" : "bg-white"
            }`}
          >
            <List size={16} />
            Table
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader className="animate-spin" />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          No confirmed purchases found 🚀
        </div>
      )}

      {/* GRID VIEW */}
      {view === "grid" && (
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {paginated.map((item) => {
            const Icon = getIcon(item.productType);

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-sm border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={18} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {getProductName(item)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Ref: {item.reference}
                    </p>
                  </div>
                </div>

                <p className="text-lg font-semibold mb-3">
                  ₦{item.amount.toLocaleString()}
                </p>

                <button
                  onClick={() => handleAccess(item)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white bg-[var(--color-secondary)] hover:opacity-90 transition cursor-pointer"
                >
                  {item.productType === "resource" ? (
                    <>
                      <FileText size={16} /> Open Resource
                    </>
                  ) : (
                    <>
                      <BookOpen size={16} /> Open Course
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {view === "table" && (
        <div className="max-w-5xl mx-auto bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3 font-medium">{getProductName(item)}</td>
                  <td className="p-3 capitalize text-gray-600">{item.productType}</td>
                  <td className="p-3">₦{item.amount.toLocaleString()}</td>
                  <td className="p-3">
                    {/* Clean green status pill since all items here are successfully paid */}
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded border transition cursor-pointer ${
                page === i + 1 ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;