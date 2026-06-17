// 📄 Location: views/MessagesAdmin.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Mail,
  MailOpen,
  Trash2,
  CornerDownLeft,
  CheckCircle2,
  User,
  Inbox,
  AlertCircle,
  Loader2,
  Send,
  ExternalLink
} from "lucide-react";

const MessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await API.get("/contact");
      setMessages(res.data.data || res.data || []);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load messages from the server." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/contact/${id}/read`);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, isRead: true } : msg
        )
      );
    } catch {
      setMessage({ type: "error", text: "Could not mark this message as read." });
    }
  };

  const openMessage = (msg) => {
    setSelected(msg);
    setReplyText("");

    if (!msg.isRead) markAsRead(msg._id);
  };

  const sendReply = async () => {
    if (!selected || !replyText.trim()) return;

    try {
      setSendingReply(true);

      const res = await API.post("/contact/reply", {
        id: selected._id,
        replyMessage: replyText,
      });

      setMessage({
        type: "success",
        text: res.data?.message || "Your reply was sent successfully!",
      });

      const updatedMessage = {
        ...selected,
        isReplied: true,
        replyMessage: replyText,
        repliedAt: new Date().toISOString(),
      };

      setSelected(updatedMessage);

      setMessages((prev) =>
        prev.map((m) => (m._id === selected._id ? updatedMessage : m))
      );

      setReplyText("");
    } catch (err) {
      const backendMessage = err?.response?.data?.message || "Failed to deliver your reply.";
      setMessage({ type: "error", text: backendMessage });
    } finally {
      setSendingReply(false);
    }
  };

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this message permanently?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/contact/${id}`);

      setMessages((prev) => prev.filter((m) => m._id !== id));
      setSelected(null);

      setMessage({
        type: "success",
        text: "Message removed successfully.",
      });
    } catch {
      setMessage({ type: "error", text: "Could not delete this message." });
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-8 text-slate-800 antialiased">
      
      {/* HEADER ROW */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Message Inbox</h1>
        <p className="text-xs text-slate-500 mt-0.5">Read incoming user requests and send direct email replies.</p>
      </div>

      {/* ALERT MESSAGES */}
      {message.text && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 border transition ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <AlertCircle size={15} className={message.type === "success" ? "text-emerald-500" : "text-rose-500"} />
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Inbox
              {unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} New
                </span>
              )}
            </h2>
          </div>

          {loading && messages.length === 0 ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 w-full bg-slate-50 border border-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 border border-dashed rounded-xl flex flex-col items-center">
              <Inbox size={20} className="text-slate-300 mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">Your inbox is clear</p>
              <p className="text-[10px] text-slate-400 mt-0.5">No incoming messages found.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {messages.map((msg) => {
                const isSelected = selected?._id === msg._id;
                
                return (
                  <div
                    key={msg._id}
                    onClick={() => openMessage(msg)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1 relative ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/30"
                        : msg.isRead
                        ? "border-slate-100 bg-white hover:bg-slate-50/70"
                        : "border-blue-100 bg-blue-50/10 hover:bg-blue-50/20"
                    }`}
                  >
                    {/* TOP IDENTITY ROW */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* UNREAD STATUS INDICATOR PIN */}
                        {!msg.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                        <p className={`text-xs truncate ${!msg.isRead ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                          {msg.name}
                        </p>
                      </div>

                      {msg.isReplied && (
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-bold tracking-wide shrink-0">
                          Replied
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 truncate font-medium">
                      {msg.message}
                    </p>

                    <span className="text-[10px] text-slate-400 mt-1 font-medium">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl shadow-sm p-6 min-h-[500px] flex flex-col justify-between">
          {!selected ? (
            <div className="flex flex-col items-center justify-center my-auto text-center py-20">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 flex items-center justify-center mb-3 shadow-inner">
                <Mail size={20} />
              </div>
              <h3 className="text-xs font-bold text-slate-700">No conversation open</h3>
              <p className="text-slate-400 text-[11px] mt-0.5 max-w-xs">
                Select an item from your inbox directory on the left to read and draft responses.
              </p>
            </div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 border border-slate-200/60 text-slate-700 font-bold text-xs flex items-center justify-center rounded-xl uppercase">
                      {selected.name ? selected.name.charAt(0) : <User size={14} />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{selected.name}</h3>
                      <a 
                        href={`mailto:${selected.email}`} 
                        className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1 mt-0.5"
                      >
                        {selected.email} <ExternalLink size={11} className="opacity-60" />
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteMessage(selected._id)}
                    className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1 text-slate-500"><MailOpen size={12} /> Received Message</span>
                      <span>{new Date(selected.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-medium">
                      {selected.message}
                    </p>
                  </div>

                  {selected.isReplied && (
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Reply</span>
                        <span className="text-slate-400 font-medium">
                          {selected.repliedAt ? new Date(selected.repliedAt).toLocaleString() : ""}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-medium">
                        {selected.replyMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 mt-6">
                <div className="mb-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <CornerDownLeft size={13} className="text-slate-400" /> Draft Response
                  </h4>
                </div>

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    selected.isReplied
                      ? "A response has already been dispatched for this request ticket."
                      : "Write your email reply here..."
                  }
                  rows={4}
                  disabled={selected.isReplied || sendingReply}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition resize-none disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100"
                />

                <div className="flex justify-end mt-2">
                  <button
                    onClick={sendReply}
                    disabled={sendingReply || selected.isReplied || !replyText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 disabled:opacity-40 shadow-sm cursor-pointer"
                  >
                    {sendingReply ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Sending Email...
                      </>
                    ) : selected.isReplied ? (
                      "Response Sent"
                    ) : (
                      <>
                        <Send size={13} /> Send Reply
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MessagesAdmin;