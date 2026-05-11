import { useEffect, useState, useCallback, useMemo } from "react";
import {
  FileText,
  Video,
  Lock,
  Play,
  X,
  Loader2,
  BookOpen,
  ShoppingCart,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import { useAuth } from "@/auth/AuthContext";

import API from "@/services/api";
import PUBLIC_API from "@/services/publicApi";

const Resources = () => {
  const { token } = useAuth();

  /* =========================================================
     STATE
  ========================================================= */
  const [resources, setResources] = useState([]);
  const [entitlements, setEntitlements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const [selectedResource, setSelectedResource] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  const [recentIds, setRecentIds] = useState([]);

  const [error, setError] = useState(null);

  /* =========================================================
     HELPERS
  ========================================================= */
  const normalizeId = (value) => {
    if (!value) return null;

    if (typeof value === "object") {
      return value?._id?.toString?.();
    }

    return value?.toString?.();
  };

  const normalizeArray = (payload) => {
    if (!payload) return [];

    if (Array.isArray(payload)) return payload;

    if (Array.isArray(payload?.data)) return payload.data;

    if (Array.isArray(payload?.data?.data)) {
      return payload.data.data;
    }

    return [];
  };

  /* =========================================================
     RECENT RESOURCES
  ========================================================= */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recent_resources");

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setRecentIds(parsed);
      }
    } catch (err) {
      console.error("RECENT LOAD ERROR:", err);
    }
  }, []);

  const saveRecent = useCallback(
    (resourceId) => {
      const updated = [
        resourceId,
        ...recentIds.filter((id) => id !== resourceId),
      ].slice(0, 5);

      setRecentIds(updated);

      localStorage.setItem(
        "recent_resources",
        JSON.stringify(updated)
      );
    },
    [recentIds]
  );

  /* =========================================================
     FETCH RESOURCES
  ========================================================= */
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await PUBLIC_API.get("/resources");

      const list = normalizeArray(res?.data);

      setResources(list);
    } catch (err) {
      console.error("RESOURCE FETCH ERROR:", err);

      setError("Failed to load resources");

      toast.error("Unable to load resources");
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================================================
     FETCH ENTITLEMENTS
  ========================================================= */
  const fetchEntitlements = useCallback(async () => {
    try {
      if (!token) {
        setEntitlements([]);
        return;
      }

      const res = await API.get("/entitlements/my");

      const list = normalizeArray(res?.data);

      const ids = list
        .map((item) => normalizeId(item?.productId))
        .filter(Boolean);

      setEntitlements(ids);
    } catch (err) {
      console.error("ENTITLEMENT FETCH ERROR:", err);

      setEntitlements([]);
    }
  }, [token]);

  /* =========================================================
     INITIAL LOAD
  ========================================================= */
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  /* =========================================================
     AUTO REFRESH ENTITLEMENTS
     (helps after payment redirect)
  ========================================================= */
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      fetchEntitlements();
    }, 10000);

    return () => clearInterval(interval);
  }, [token, fetchEntitlements]);

  /* =========================================================
     ACCESS CHECK
  ========================================================= */
  const hasAccess = useCallback(
    (resourceId) => {
      return entitlements.includes(
        normalizeId(resourceId)
      );
    },
    [entitlements]
  );

  /* =========================================================
     ICON HELPER
  ========================================================= */
  const getIcon = (type) => {
    switch (type) {
      case "Video":
        return Video;

      case "PDF":
      case "Document":
        return FileText;

      default:
        return BookOpen;
    }
  };

  /* =========================================================
     RECENT RESOURCES
  ========================================================= */
  const recentResources = useMemo(() => {
    return resources.filter((resource) =>
      recentIds.includes(resource._id)
    );
  }, [resources, recentIds]);

  /* =========================================================
     BUY RESOURCE
  ========================================================= */
  const handleBuy = async (resource) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoadingId(resource._id);

      const payload = {
        productType: "Resource",
        productId: resource._id,
      };

      console.log("INIT PAYMENT:", payload);

      const res = await API.post(
        `/resources/pay/${resource._id}`);

      console.log("PAYMENT INIT RESPONSE:", res?.data);

      const paymentUrl =
        res?.data?.data?.authorization_url;

      if (!paymentUrl) {
        toast.error(
          "Unable to initialize payment"
        );
        return;
      }

      toast.success("Redirecting to payment...");

      window.location.href = paymentUrl;
    } catch (err) {
      console.error(
        "PAYMENT INIT ERROR:",
        err?.response?.data || err
      );

      toast.error(
        err?.response?.data?.message ||
          "Payment initialization failed"
      );
    } finally {
      setLoadingId(null);
    }
  };

  /* =========================================================
     OPEN RESOURCE
  ========================================================= */
  const openResource = async (resource) => {
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const allowed = hasAccess(resource._id);

      if (!allowed) {
        toast.error(
          "Purchase this resource first"
        );
        return;
      }

      setShowViewer(false);
      setSelectedResource(null);

      const res = await API.get(
        `/resources/view/${resource._id}`
      );

      const secureResource =
        res?.data?.data || null;

      if (!secureResource) {
        toast.error("Resource unavailable");
        return;
      }

      setSelectedResource(secureResource);
      setShowViewer(true);

      saveRecent(resource._id);
    } catch (err) {
      console.error(
        "OPEN RESOURCE ERROR:",
        err?.response?.data || err
      );

      if (err?.response?.status === 403) {
        toast.error(
          "Access denied. Purchase required."
        );

        return;
      }

      toast.error(
        err?.response?.data?.message ||
          "Unable to open resource"
      );
    }
  };

  /* =========================================================
     CLOSE VIEWER
  ========================================================= */
  const closeViewer = () => {
    setShowViewer(false);

    setTimeout(() => {
      setSelectedResource(null);
    }, 200);
  };

  /* =========================================================
     LOADING STATE
  ========================================================= */
  if (loading) {
    return (
      <main className="pt-24 px-6 pb-20">
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <Loader2
              className="animate-spin"
              size={40}
            />

            <p className="text-gray-500">
              Loading resources...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR STATE
  ========================================================= */
  if (error) {
    return (
      <main className="pt-24 px-6 pb-20">
        <div className="text-center py-24">
          <h2 className="text-2xl font-semibold">
            Failed to Load Resources
          </h2>

          <p className="text-gray-500 mt-3">
            Please try again.
          </p>

          <button
            onClick={fetchResources}
            className="mt-6 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-900 transition"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 px-6 pb-20">
      <div className="max-w-6xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-semibold">
            Learning Resources
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Purchase and access premium learning
            materials directly inside the platform.
          </p>
        </div>

        {/* =====================================================
            RECENT
        ===================================================== */}
        {recentResources.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xl font-semibold mb-5">
              Continue Learning
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {recentResources.map((item) => (
                <button
                  key={item._id}
                  onClick={() => openResource(item)}
                  className="min-w-[220px] text-left border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <p className="font-medium line-clamp-1">
                    {item.title}
                  </p>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}
        {resources.length === 0 ? (
          <div className="text-center py-24 border rounded-2xl">
            <h2 className="text-2xl font-semibold">
              No Resources Available
            </h2>

            <p className="text-gray-500 mt-3">
              Resources added by admin will appear
              here.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

            {resources.map((item) => {
              const Icon = getIcon(item?.type);

              const isOwned = hasAccess(item._id);

              const isProcessing =
                loadingId === item._id;

              return (
                <motion.div
                  key={item._id}
                  whileHover={{ y: -6 }}
                  className="relative rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition"
                >

                  {/* LOCK OVERLAY */}
                  {!isOwned && (
                    <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-[2px] flex items-center justify-center rounded-2xl pointer-events-none">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <Lock size={20} />
                      </div>
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="p-6">

                    {/* ICON */}
                    <div className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center mb-5">
                      <Icon size={26} />
                    </div>

                    {/* TITLE */}
                    <h3 className="text-xl font-semibold line-clamp-2">
                      {item?.title ||
                        "Untitled Resource"}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                      {item?.description ||
                        "No description available"}
                    </p>

                    {/* PRICE */}
                    <div className="mt-5">
                      <p className="text-2xl font-bold">
                        ₦
                        {Number(
                          item?.price || 0
                        ).toLocaleString()}
                      </p>
                    </div>

                    {/* ACTION */}
                    {isOwned ? (
                      <button
                        onClick={() =>
                          openResource(item)
                        }
                        className="mt-6 w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <Play size={16} />
                        Open Resource
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleBuy(item)
                        }
                        disabled={isProcessing}
                        className="mt-6 relative z-20 w-full bg-black hover:bg-gray-900 active:scale-[0.98] disabled:opacity-60 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={16} />
                            Buy Resource
                          </>
                        )}
                      </button>
                    )}

                  </div>
                </motion.div>
              );
            })}

          </div>
        )}
      </div>

      {/* =====================================================
          VIEWER
      ===================================================== */}
      <AnimatePresence>
        {showViewer && selectedResource && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              initial={{
                scale: 0.94,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.94,
                opacity: 0,
              }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >

              {/* HEADER */}
              <div className="flex items-center justify-between px-5 py-4 border-b bg-white">
                <div>
                  <h2 className="font-semibold text-lg">
                    {selectedResource?.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Secure Resource Viewer
                  </p>
                </div>

                <button
                  onClick={closeViewer}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* VIEWER */}
              <iframe
                title={selectedResource?.title}
                src={`${import.meta.env.VITE_API_URL}/api/resources/stream/${selectedResource?._id}`}
                className="w-full flex-1 bg-white"
              />

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Resources;