import { useEffect, useState } from "react";
import API from "../../services/api";

const MessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  /* ================= FETCH MESSAGES ================= */
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await API.get("/contact");
      setMessages(res.data.data || []);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load messages" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  /* ================= MARK AS READ ================= */
  const markAsRead = async (id) => {
    try {
      await API.put(`/contact/${id}/read`);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, isRead: true } : msg
        )
      );
    } catch (err) {
      setMessage({ type: "error", text: "Failed to mark as read" });
    }
  };

  /* ================= SELECT MESSAGE ================= */
  const openMessage = (msg) => {
    setSelected(msg);
    setReplyText("");

    if (!msg.isRead) markAsRead(msg._id);
  };

  /* ================= SEND REPLY ================= */
  const sendReply = async () => {
    if (!selected || !replyText.trim()) return;

    try {
      setSendingReply(true);

      await API.post("/contact/reply", {
        id: selected._id,
        replyMessage: replyText,
      });

      setMessage({
        type: "success",
        text: "Reply sent successfully",
      });

      setReplyText("");
      fetchMessages();

      // update selected locally
      setSelected((prev) => ({
        ...prev,
        isReplied: true,
        replyMessage: replyText,
        repliedAt: new Date().toISOString(),
      }));
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to send reply",
      });
    } finally {
      setSendingReply(false);
    }
  };

  /* ================= DELETE MESSAGE ================= */
  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm("Delete this message?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/contact/${id}`);

      setMessages((prev) => prev.filter((m) => m._id !== id));
      setSelected(null);

      setMessage({
        type: "success",
        text: "Message deleted",
      });
    } catch (err) {
      setMessage({ type: "error", text: "Delete failed" });
    }
  };

  /* ================= UI ALERT ================= */
  const Alert = () =>
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

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="grid md:grid-cols-3 gap-6 h-full">

      {/* ================= LEFT: INBOX ================= */}
      <div className="bg-white rounded-xl shadow p-4 overflow-y-auto">

        <h2 className="text-xl font-semibold mb-2">
          Inbox ({unreadCount})
        </h2>

        <Alert />

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={`p-3 rounded-lg cursor-pointer border transition hover:bg-gray-50 ${
                  selected?._id === msg._id
                    ? "border-blue-500 bg-blue-50"
                    : msg.isRead
                    ? "bg-gray-50"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    {msg.name}
                    {msg.isReplied && (
                      <span className="text-xs text-green-600 ml-2">
                        Replied
                      </span>
                    )}
                  </p>

                  {!msg.isRead && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                      New
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 truncate">
                  {msg.message}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= RIGHT: THREAD VIEW ================= */}
      <div className="md:col-span-2 bg-white rounded-xl shadow p-6 overflow-y-auto">

        {!selected ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a message to view conversation
          </div>
        ) : (
          <>
            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {selected.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {selected.email}
                </p>
              </div>

              <button
                onClick={() => deleteMessage(selected._id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>

            {/* ================= ORIGINAL MESSAGE ================= */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {selected.message}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Sent: {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>

            {/* ================= REPLY HISTORY ================= */}
            {selected.isReplied && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-semibold text-green-700 mb-1">
                  Your Reply
                </h4>

                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {selected.replyMessage}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Replied:{" "}
                  {selected.repliedAt
                    ? new Date(selected.repliedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            )}

            {/* ================= REPLY BOX ================= */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Reply</h4>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={5}
                className="w-full border rounded-lg p-3 text-sm"
              />

              <button
                onClick={sendReply}
                disabled={sendingReply}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {sendingReply ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesAdmin;