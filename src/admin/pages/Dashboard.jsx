import { useEffect, useState } from "react";
import API from "../../services/api";

const statusStyles = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    messages: 0,
    enrollments: 0,
    transactions: 0,
    revenue: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
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

        /* ================= NORMALIZE RESPONSES ================= */
        const courses = coursesRes.data?.data || coursesRes.data || [];
        const messages = messagesRes.data?.data || messagesRes.data || [];
        const enrollments =
          enrollmentsRes.data?.data || enrollmentsRes.data || [];
        const transactions =
          transactionsRes.data?.data || transactionsRes.data || [];

        /* ================= CALCULATIONS ================= */
        const totalRevenue = transactions
          .filter((t) => t.status === "paid")
          .reduce((acc, t) => acc + Number(t.amount || 0), 0);

        const sortedTransactions = [...transactions].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        /* ================= SET STATE ================= */
        setStats({
          courses: courses.length,
          messages: messages.length,
          enrollments: enrollments.length,
          transactions: transactions.length,
          revenue: totalRevenue,
        });

        setRecentTransactions(sortedTransactions.slice(0, 6));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-semibold">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of platform activity
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">

        <StatCard title="Courses" value={stats.courses} />
        <StatCard title="Messages" value={stats.messages} />
        <StatCard title="Enrollments" value={stats.enrollments} />
        <StatCard title="Transactions" value={stats.transactions} />
        <StatCard
          title="Revenue"
          value={`₦${stats.revenue.toLocaleString()}`}
          highlight
        />

      </div>

      {/* ================= RECENT TRANSACTIONS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="text-lg font-semibold mb-4">
          Recent Transactions
        </h3>

        {recentTransactions.length > 0 ? (
          <div className="space-y-4">

            {recentTransactions.map((tx) => (
              <div
                key={tx._id}
                className="flex justify-between items-center border-b pb-3"
              >

                {/* LEFT */}
                <div>
                  <p className="font-medium text-gray-900">
                    {tx.email}
                  </p>

                  <p className="text-xs text-gray-500">
                    {tx.productType?.toUpperCase()} •{" "}
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right">

                  <p className="font-semibold">
                    ₦{Number(tx.amount || 0).toLocaleString()}
                  </p>

                  <span
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                      statusStyles[tx.status] ||
                      statusStyles.pending
                    }`}
                  >
                    {tx.status}
                  </span>

                </div>
              </div>
            ))}

          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No transactions yet
          </p>
        )}

      </div>

      {/* ================= BREAKDOWN ================= */}
      <TransactionBreakdown transactions={recentTransactions} />

    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const StatCard = ({ title, value, highlight }) => (
  <div
    className={`p-6 rounded-xl shadow ${
      highlight
        ? "bg-green-600 text-white"
        : "bg-white"
    }`}
  >
    <p
      className={`text-sm ${
        highlight ? "text-green-100" : "text-gray-500"
      }`}
    >
      {title}
    </p>

    <h2 className="text-2xl font-semibold mt-2">
      {value}
    </h2>
  </div>
);

const TransactionBreakdown = ({ transactions }) => {
  const paid = transactions.filter((t) => t.status === "paid").length;
  const pending = transactions.filter((t) => t.status === "pending").length;
  const failed = transactions.filter((t) => t.status === "failed").length;

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h3 className="text-lg font-semibold mb-4">
        Transaction Breakdown
      </h3>

      <div className="grid grid-cols-3 gap-4 text-center">

        <BreakdownCard label="Paid" value={paid} color="green" />
        <BreakdownCard label="Pending" value={pending} color="yellow" />
        <BreakdownCard label="Failed" value={failed} color="red" />

      </div>

    </div>
  );
};

const BreakdownCard = ({ label, value, color }) => {
  const colorMap = {
    green: "text-green-600 bg-green-50",
    yellow: "text-yellow-600 bg-yellow-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className={`p-4 rounded-lg ${colorMap[color]}`}>
      <p className="text-sm">{label}</p>
      <p className="text-xl font-semibold mt-1">
        {value}
      </p>
    </div>
  );
};

export default Dashboard;