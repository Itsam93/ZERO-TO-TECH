import { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  BookOpen, 
  MessageSquare, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

const statusStyles = {
  paid: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold",
  pending: "bg-amber-50 text-amber-700 border border-amber-200/60 font-bold",
  failed: "bg-rose-50 text-rose-700 border border-rose-200/60 font-bold",
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    messages: 0,
    enrollments: 0,
    transactions: 0,
    revenue: 0,
  });

  const [breakdown, setBreakdown] = useState({ paid: 0, pending: 0, failed: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        coursesRes,
        messagesRes,
        enrollmentsRes,
        transactionsRes,
      ] = await Promise.all([
        API.get("/courses"),
        API.get("/contact"),
        API.get("/enrollments"),
        API.get("/transactions"),
      ]);

      const courses = coursesRes.data?.data || coursesRes.data || [];
      const messages = messagesRes.data?.data || messagesRes.data || [];
      const enrollments = enrollmentsRes.data?.data || enrollmentsRes.data || [];
      const transactions = transactionsRes.data?.data || transactionsRes.data || [];

      // Computations
      const totalRevenue = transactions
        .filter((t) => t.status === "paid")
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setStats({
        courses: courses.length,
        messages: messages.length,
        enrollments: enrollments.length,
        transactions: transactions.length,
        revenue: totalRevenue,
      });

      setBreakdown({
        paid: transactions.filter((t) => t.status === "paid").length,
        pending: transactions.filter((t) => t.status === "pending").length,
        failed: transactions.filter((t) => t.status === "failed").length,
      });

      setRecentTransactions(sortedTransactions.slice(0, 6));
    } catch (err) {
      console.error("Dashboard engine failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <SkeletonLoader />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10 max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 antialiased text-slate-900"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Admin Real-time Tracking System
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="self-start sm:self-center flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
        >
          <RefreshCw size={13} className="text-slate-400" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard title="Total Courses" value={stats.courses} icon={<BookOpen size={20} />} description="Active curricula items" />
        <StatCard title="Inbound Contacts" value={stats.messages} icon={<MessageSquare size={20} />} description="Unresolved communications" />
        <StatCard title="System Seats" value={stats.enrollments} icon={<Users size={20} />} description="Verified active profiles" />
        <StatCard title="Total Invoices" value={stats.transactions} icon={<CreditCard size={20} />} description="Dispatched receipts" />
        <StatCard 
          title="Gross Remittance" 
          value={`₦${stats.revenue.toLocaleString()}`} 
          icon={<TrendingUp size={20} />} 
          highlight 
          description="Liquid synchronized volume"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-black tracking-tight text-slate-900">
                Recent Inbound Invoices
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Latest transactions.
              </p>
            </div>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="divide-y divide-slate-100 overflow-hidden">
              {recentTransactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex justify-between items-center py-4 first:pt-0 last:pb-0 hover:bg-slate-50/40 transition duration-150 px-2 rounded-xl -mx-2"
                >
                  <div className="space-y-1 pr-4 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {tx.email}
                    </p>
                    <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black text-[9px]">{tx.productType || "N/A"}</span>
                      • {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                    <p className="font-black text-sm text-slate-900 tracking-tight">
                      ₦{Number(tx.amount || 0).toLocaleString()}
                    </p>
                    <span className={`px-2 py-0.5 text-[10px] rounded-md uppercase tracking-wider ${statusStyles[tx.status] || statusStyles.pending}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <CreditCard className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-400 text-xs font-semibold">No operational logs verified.</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight text-slate-900">
              Payment Live Progress
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Payment Ratio allocation.
            </p>
          </div>
          
          <div className="space-y-3.5">
            <BreakdownRow label="Settled Accounts" value={breakdown.paid} icon={<CheckCircle2 size={15} />} color="emerald" total={stats.transactions} />
            <BreakdownRow label="Awaiting Settlement" value={breakdown.pending} icon={<Clock size={15} />} color="amber" total={stats.transactions} />
            <BreakdownRow label="Dropped Gateways" value={breakdown.failed} icon={<XCircle size={15} />} color="rose" total={stats.transactions} />
          </div>
        </div>

      </div>
    </motion.div>
  );
};


const StatCard = ({ title, value, icon, highlight, description }) => (
  <div className={`p-6 rounded-2xl border transition-all duration-200 shadow-sm flex flex-col justify-between h-36 ${
    highlight 
      ? "bg-slate-950 border-slate-950 text-white shadow-xl shadow-slate-950/10" 
      : "bg-white border-slate-200/70"
  }`}>
    <div className="flex items-start justify-between">
      <p className={`text-xs font-bold uppercase tracking-wider ${highlight ? "text-slate-400" : "text-slate-400"}`}>
        {title}
      </p>
      <div className={highlight ? "text-slate-300" : "text-slate-400"}>
        {icon}
      </div>
    </div>
    <div className="space-y-0.5">
      <h2 className="text-2xl font-black tracking-tight">{value}</h2>
      <p className={`text-[10px] font-medium ${highlight ? "text-slate-400" : "text-slate-400"}`}>
        {description}
      </p>
    </div>
  </div>
);

const BreakdownRow = ({ label, value, icon, color, total }) => {
  const themes = {
    emerald: { text: "text-emerald-700", bg: "bg-emerald-500", track: "bg-emerald-50", border: "border-emerald-100" },
    amber: { text: "text-amber-700", bg: "bg-amber-500", track: "bg-amber-50", border: "border-amber-100" },
    rose: { text: "text-rose-700", bg: "bg-rose-500", track: "bg-rose-50", border: "border-rose-100" },
  };
  const theme = themes[color];
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className={`p-4 rounded-xl border ${theme.border} bg-white space-y-3`}>
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center gap-2">
          <span className={theme.text}>{icon}</span>
          {label}
        </span>
        <span className="font-black tabular-nums">{value} <span className="text-slate-400 font-medium text-[10px]">({percentage}%)</span></span>
      </div>
      <div className={`w-full h-2 rounded-full overflow-hidden ${theme.track}`}>
        <div 
          className={`h-full rounded-full ${theme.bg} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="space-y-10 p-6 sm:p-8 animate-pulse max-w-[1600px] mx-auto">
    <div className="h-14 bg-slate-200/60 rounded-xl w-1/3" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {[...Array(5)].map((_, i) => <div key={i} className="h-36 bg-slate-200/60 rounded-2xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-96 bg-slate-200/60 rounded-2xl" />
      <div className="h-96 bg-slate-200/60 rounded-2xl" />
    </div>
  </div>
);

export default Dashboard;