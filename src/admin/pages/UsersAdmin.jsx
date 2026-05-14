import { useEffect, useMemo, useState } from "react";
import {
  getUsers,
  updateUser,
  deleteUser,
  sendNotification,
} from "@/services/adminUsersApi";

import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Trash2, Bell } from "lucide-react";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState("");
  const [sending, setSending] = useState(false);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res?.data?.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= UPDATE ROLE ================= */
  const handleRoleChange = async (id, role) => {
    try {
      await updateUser(id, { role });

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );

      toast.success("User role updated");
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= TOGGLE ACTIVE STATUS (NEW) ================= */
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      await updateUser(id, { isActive: newStatus });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isActive: newStatus } : u
        )
      );

      toast.success(
        `User ${newStatus ? "activated" : "disabled"}`
      );
    } catch {
      toast.error("Failed to update user status");
    }
  };

  /* ================= DELETE USER ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      await deleteUser(id);

      setUsers((prev) => prev.filter((u) => u._id !== id));

      toast.success("User removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= SEND NOTIFICATION ================= */
  const handleSendNotification = async () => {
    if (!notification.trim() || !selectedUser) return;

    try {
      setSending(true);

      await sendNotification({
        userId: selectedUser._id,
        message: notification,
      });

      toast.success("Notification sent");

      setNotification("");
      setSelectedUser(null);
    } catch {
      toast.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      active: users.filter((u) => u.isActive).length,
    };
  }, [users]);

  /* ================= LOADING SKELETON ================= */
  const Skeleton = () => (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-14 bg-gray-200 rounded-xl" />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage roles, activity, and communication
          </p>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: stats.total, icon: User },
          { label: "Admins", value: stats.admins, icon: Shield },
          { label: "Active Users", value: stats.active, icon: User },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-5 shadow-sm border flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500 text-sm">{item.label}</p>
                <h2 className="text-2xl font-semibold">
                  {item.value}
                </h2>
              </div>

              <div className="p-3 rounded-xl bg-gray-100">
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        {loading ? (
          <div className="p-6">
            <Skeleton />
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No users found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* USER */}
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.fullName?.charAt(0)}
                      </div>
                      {user.fullName}
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="text-gray-600">
                    {user.email}
                  </td>

                  {/* ROLE */}
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="px-2 py-1 border rounded-lg text-sm"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  {/* ================= STATUS ================= */}
                  <td>
                    {(() => {
                      let label = "Active";
                      let color = "bg-green-100 text-green-700";

                      if (!user.isEmailVerified) {
                        label = "Pending";
                        color = "bg-yellow-100 text-yellow-800";
                      } else if (!user.isActive) {
                        label = "Disabled";
                        color = "bg-red-100 text-red-600";
                      }

                      return (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}
                        >
                          {label}
                        </span>
                      );
                    })()}
                  </td>

                  {/* ACTIONS */}
                  <td className="text-right p-4 space-x-2">

                    <button
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Bell size={14} />
                      Notify
                    </button>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:underline"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl"
            >

              <h2 className="text-lg font-semibold">
                Send Notification
              </h2>

              <p className="text-sm text-gray-500">
                To: {selectedUser.email}
              </p>

              <textarea
                value={notification}
                onChange={(e) =>
                  setNotification(e.target.value)
                }
                className="w-full border rounded-xl p-3 text-sm"
                rows={4}
                placeholder="Write your message..."
              />

              <div className="flex justify-end gap-2">

                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSendNotification}
                  disabled={sending}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send"}
                </button>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UsersAdmin;