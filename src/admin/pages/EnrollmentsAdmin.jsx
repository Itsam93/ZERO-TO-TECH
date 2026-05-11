import { useEffect, useState } from "react";
import API from "../../services/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  enrolled: "bg-green-100 text-green-700",
};

const EnrollmentsAdmin = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  /* ================= FETCH ================= */
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/enrollments");
      setEnrollments(res.data.data || []);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load enrollments" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  /* ================= STATUS UPDATE ================= */
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/enrollments/${id}`, { status });

      setMessage({
        type: "success",
        text: `Status updated to ${status}`,
      });

      fetchEnrollments();
      setSelected(null);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update status" });
    }
  };

  /* ================= DELETE ================= */
  const deleteEnrollment = async (id) => {
    const confirmDelete = window.confirm("Delete this enrollment?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/enrollments/${id}`);

      setMessage({
        type: "success",
        text: "Enrollment deleted successfully",
      });

      fetchEnrollments();
      setSelected(null);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete enrollment" });
    }
  };

  /* ================= MESSAGE UI ================= */
  const MessageBox = () =>
    message.text ? (
      <div
        className={`p-3 rounded mb-4 text-sm ${
          message.type === "success"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {message.text}
      </div>
    ) : null;

  return (
    <div className="grid md:grid-cols-3 gap-6">

      {/* ================= LEFT LIST ================= */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-semibold mb-3">
          Enrollments
        </h2>

        <MessageBox />

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : (
          <div className="space-y-3">
            {enrollments.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelected(item)}
                className={`p-3 rounded-lg border cursor-pointer transition hover:bg-gray-50 ${
                  selected?._id === item._id
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
              >
                <p className="font-medium">{item.fullName}</p>
                <p className="text-sm text-gray-500">
                  {item.course}
                </p>

                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                    statusColors[item.status] ||
                    statusColors.pending
                  }`}
                >
                  {item.status || "pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= RIGHT DETAILS ================= */}
      <div className="md:col-span-2 bg-white rounded-xl shadow p-6 min-h-[400px]">

        {selected ? (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-xl font-semibold">
                  {selected.fullName}
                </h3>

                <p className="text-sm text-gray-500">
                  {selected.course}
                </p>
              </div>

              <button
                onClick={() => deleteEnrollment(selected._id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </div>

            {/* DETAILS */}
            <div className="space-y-3 text-gray-700 text-sm">
              <p>
                <strong>Email:</strong> {selected.email}
              </p>

              <p>
                <strong>Phone:</strong> {selected.phone || "N/A"}
              </p>

              <p>
                <strong>Course:</strong> {selected.course}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    statusColors[selected.status]
                  }`}
                >
                  {selected.status}
                </span>
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  updateStatus(selected._id, "pending")
                }
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:opacity-90"
              >
                Pending
              </button>

              <button
                onClick={() =>
                  updateStatus(selected._id, "contacted")
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90"
              >
                Contacted
              </button>

              <button
                onClick={() =>
                  updateStatus(selected._id, "enrolled")
                }
                className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-90"
              >
                Enrolled
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select an enrollment to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentsAdmin;