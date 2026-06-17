import { useEffect, useMemo, useState } from "react";
import {
  getUsers,
  updateUser,
  deleteUser,
  sendNotification,
} from "@/services/adminUsersApi";

import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Shield, 
  Trash2, 
  Bell, 
  Users, 
  UserCheck, 
  Mail, 
  ToggleLeft, 
  ToggleRight, 
  X, 
  Send,
  Loader2
} from "lucide-react";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState("");
  const [sending, setSending] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res?.data?.data || res?.data || []);
    } catch {
      toast.error("Failed to load users layout register");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUser(id, { role });

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );

      toast.success("User tier access role updated");
    } catch {
      toast.error("Failed to change user authorization");
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      await updateUser(id, { isActive: newStatus });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isActive: newStatus } : u
        )
      );

      toast.success(`User access has been ${newStatus ? "enabled" : "disabled"}`);
    } catch {
      toast.error("Failed to alter active user routing status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user profile permanently?")) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User permanently removed from platform");
    } catch {
      toast.error("Failed to delete user profile metadata");
    }
  };

  const handleSendNotification = async () => {
    if (!notification.trim() || !selectedUser) return;

    try {
      setSending(true);

      await sendNotification({
        userId: selectedUser._id,
        message: notification,
      });

      toast.success("Direct notification alert delivered");
      setNotification("");
      setSelectedUser(null);
    } catch {
      toast.error("Failed to deliver broadcast alert update");
    } finally {
      setSending(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      active: users.filter((u) => u.isActive).length,
    };
  }, [users]);

  const Skeleton = () => (
    <div className="space-y-4 py-2 animate-pulse">
      {[1, 2, 3, 5].map((i) => (
        <div key={i} className="flex items-center justify-between gap-6 py-4 border-b border-slate-50">
          <div className="flex items-center gap-3 w-1/4">
            <div className="w-9 h-9 bg-slate-100 rounded-full shrink-0" />
            <div className="h-3 bg-slate-100 rounded w-full" />
          </div>
          <div className="h-3 bg-slate-100 rounded w-1/4" />
          <div className="h-7 bg-slate-100 rounded-xl w-20" />
          <div className="h-6 bg-slate-100 rounded-full w-16" />
          <div className="h-8 bg-slate-100 rounded-lg w-24 ml-auto" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-8 text-slate-800 antialiased">

      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
        <p className="text-xs text-slate-500 mt-1">Audit administrative parameters, verify incoming system tiers, and distribute server messages.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Total Accounts", value: stats.total, icon: Users, tint: "bg-blue-50 text-blue-600 border-blue-100" },
          { label: "Administrative Personnel", value: stats.admins, icon: Shield, tint: "bg-purple-50 text-purple-600 border-purple-100" },
          { label: "Active Live Routes", value: stats.active, icon: UserCheck, tint: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md/5"
            >
              <div className="space-y-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">{item.label}</p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{item.value}</h2>
              </div>

              <div className={`p-3 rounded-xl border ${item.tint}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6"><Skeleton /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-100 m-4 rounded-xl bg-slate-50/50">
            <Users size={24} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No active accounts inside register database</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4 pl-6">Profile Identity</th>
                  <th className="p-4"><span className="flex items-center gap-1"><Mail size={12} /> Contact Address</span></th>
                  <th className="p-4"><span className="flex items-center gap-1"><Shield size={12} /> Access Tier</span></th>
                  <th className="p-4">Server Routing</th>
                  <th className="p-4 pr-6 text-right">Dashboard Utilities</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/60 transition-colors duration-150 group"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-800 font-black text-[11px] flex items-center justify-center uppercase shrink-0">
                          {user.fullName ? user.fullName.charAt(0) : <User size={12} />}
                        </div>
                        <span className="font-bold text-slate-900 text-xs tracking-tight">{user.fullName || "Anonymous Profile"}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-slate-500 text-[11px] select-all">
                      {user.email}
                    </td>

                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-50 focus:border-slate-400 transition cursor-pointer shadow-sm"
                      >
                        <option value="user">Standard User</option>
                        <option value="admin">System Admin</option>
                      </select>
                    </td>

                    <td className="p-4">
                      {(() => {
                        let label = "Active Verified";
                        let color = "bg-emerald-50 border-emerald-200 text-emerald-700";

                        if (!user.isEmailVerified) {
                          label = "Awaiting Verification";
                          color = "bg-amber-50 border-amber-200 text-amber-700";
                        } else if (!user.isActive) {
                          label = "Access Suspended";
                          color = "bg-rose-50 border-rose-200 text-rose-700";
                        }

                        return (
                          <span className={`px-2.5 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wide inline-block ${color}`}>
                            {label}
                          </span>
                        );
                      })()}
                    </td>

                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        
                        <button
                          onClick={() => handleToggleActive(user._id, user.isActive)}
                          title={user.isActive ? "Deactivate User Access" : "Activate User Access"}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            user.isActive 
                              ? "text-emerald-600 border-emerald-100 hover:bg-emerald-50" 
                              : "text-slate-400 border-slate-100 hover:bg-slate-50"
                          }`}
                        >
                          {user.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>

                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 rounded-lg transition flex items-center justify-center cursor-pointer"
                        >
                          <Bell size={13} />
                        </button>

                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-100 hover:bg-rose-50 rounded-lg transition flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 6 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 6 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl border border-slate-100 relative z-10"
            >
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                  System Broadcast
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-2">Send Account Notification</h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  Delivering direct internal interface alert to: <span className="font-mono text-slate-600 font-semibold">{selectedUser.email}</span>
                </p>
              </div>

              <textarea
                value={notification}
                onChange={(e) => setNotification(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-50/60 focus:border-blue-500 transition resize-none"
                rows={4}
                placeholder="Type the message dispatch updates here..."
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSendNotification}
                  disabled={sending || !notification.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40 shadow-sm cursor-pointer"
                >
                  {sending ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Delivering...
                    </>
                  ) : (
                    <>
                      <Send size={12} /> Dispatch Alert
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UsersAdmin;