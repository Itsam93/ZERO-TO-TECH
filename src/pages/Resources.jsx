import { useEffect, useState, useCallback, useMemo } from "react";
import {
  FileText,
  Video,
  Lock,
  Play,
  X,
  BookOpen,
  ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuth } from "@/auth/AuthContext";
import API from "@/services/api";
import PUBLIC_API from "@/services/publicApi";

import {RegistrationModal} from "@/components/RegistrationModal"; 

const Resources = () => {
  const { token } = useAuth();

  const [resources, setResources] = useState([]);
  const [entitlements, setEntitlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [recentIds, setRecentIds] = useState([]);
  const [error, setError] = useState(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingResource, setPendingResource] = useState(null);

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
      localStorage.setItem("recent_resources", JSON.stringify(updated));
    },
    [recentIds]
  );

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

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  useEffect(() => {
    if (token && pendingResource) {
      const resourceToBuy = pendingResource;
      setPendingResource(null);
      setIsAuthModalOpen(false);
      handleBuy(resourceToBuy);
    }
  }, [token, pendingResource]);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      fetchEntitlements();
    }, 10000);

    return () => clearInterval(interval);
  }, [token, fetchEntitlements]);

  const hasAccess = useCallback(
    (resourceId) => {
      return entitlements.includes(normalizeId(resourceId));
    },
    [entitlements]
  );

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

  const recentResources = useMemo(() => {
    return resources.filter((resource) => recentIds.includes(resource._id));
  }, [resources, recentIds]);

  const handleBuy = async (resource) => {
    if (!token) {
      setPendingResource(resource);
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setLoadingId(resource._id);

      const payload = {
        productType: "Resource",
        productId: resource._id,
      };

      console.log("INIT PAYMENT:", payload);
      const res = await API.post(`/resources/pay/${resource._id}`);
      console.log("PAYMENT INIT RESPONSE:", res?.data);

      const paymentUrl = res?.data?.data?.authorization_url;

      if (!paymentUrl) {
        toast.error("Unable to initialize payment");
        return;
      }

      toast.success("Redirecting to payment...");
      window.location.href = paymentUrl;
    } catch (err) {
      console.error("PAYMENT INIT ERROR:", err?.response?.data || err);
      toast.error(
        err?.response?.data?.message || "Payment initialization failed"
      );
    } finally {
      setLoadingId(null);
    }
  };

  const openResource = async (resource) => {
    try {
      if (!token) {
        setPendingResource(resource);
        setIsAuthModalOpen(true);
        return;
      }

      const allowed = hasAccess(resource._id);
      if (!allowed) {
        toast.error("Purchase this resource first");
        return;
      }

      setShowViewer(false);
      setSelectedResource(null);

      const res = await API.get(`/resources/view/${resource._id}`);
      const secureResource = res?.data?.data || null;

      if (!secureResource) {
        toast.error("Resource unavailable");
        return;
      }

      setSelectedResource(secureResource);
      setShowViewer(true);
      saveRecent(resource._id);
    } catch (err) {
      console.error("OPEN RESOURCE ERROR:", err?.response?.data || err);

      if (err?.response?.status === 403) {
        toast.error("Access denied. Purchase required.");
        return;
      }

      toast.error(
        err?.response?.data?.message || "Unable to open resource"
      );
    }
  };

  const closeViewer = () => {
    setShowViewer(false);
    setTimeout(() => {
      setSelectedResource(null);
    }, 200);
  };

  if (error) {
    return (
      <main className="pt-24 px-6 pb-20 bg-white min-h-screen">
        <div className="text-center py-24 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900">
            Failed to Load Resources
          </h2>
          <p className="text-slate-500 mt-3 text-sm">
            Something went wrong while capturing asset parameters. Please refresh or try again.
          </p>
          <button
            type="button"
            onClick={fetchResources}
            className="mt-6 px-6 py-3 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-medium text-sm transition"
          >
            Retry Connection
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 px-6 pb-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Learning Resources
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
            Purchase and access premium learning materials directly inside the platform.
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-14">
            {token && (
              <div className="space-y-4">
                <div className="h-6 w-44 bg-slate-200 rounded-md" />
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="min-w-[220px] h-24 bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                      <div className="h-4 w-3/4 bg-slate-200 rounded" />
                      <div className="h-3 w-full bg-slate-100 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`resource-skeleton-${idx}`}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-6 h-[320px] flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-slate-200 mb-5" />
                    <div className="h-5 w-2/3 bg-slate-200 rounded-md mb-3" />
                    <div className="space-y-2">
                      <div className="h-3.5 w-full bg-slate-100 rounded" />
                      <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div>
                    <div className="h-7 w-24 bg-slate-200 rounded mb-5" />
                    <div className="h-12 w-full bg-slate-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {token && recentResources.length > 0 && (
              <div className="mb-14">
                <h2 className="text-xl font-bold text-slate-900 mb-5">
                  Continue Learning
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {recentResources.map((item) => (
                    <button
                      type="button"
                      key={item._id}
                      onClick={() => openResource(item)}
                      className="min-w-[220px] text-left border border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition shadow-sm"
                    >
                      <p className="font-semibold text-slate-900 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {resources.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl">
                <h2 className="text-xl font-bold text-slate-800">
                  No Resources Available
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  Resources added by admin will appear here.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {resources.map((item) => {
                  const Icon = getIcon(item?.type);
                  const isOwned = hasAccess(item._id);
                  const isProcessing = loadingId === item._id;

                  return (
                    <motion.div
                      key={item._id}
                      whileHover={{ y: -6 }}
                      className={`group relative rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                        isOwned 
                          ? "bg-white border-slate-200 hover:border-slate-300" 
                          : "bg-slate-50/[0.60] border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="w-14 h-14 rounded-xl bg-white text-slate-800 border border-slate-100 flex items-center justify-center mb-5 group-hover:bg-slate-950 group-hover:text-white transition-colors duration-300 relative shadow-sm">
                            <Icon size={24} />
                            {!isOwned && (
                              <div className="absolute -top-1.5 -right-1.5 bg-white shadow-md border border-slate-100 text-slate-600 rounded-full p-1 transform scale-90">
                                <Lock size={12} />
                              </div>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {item?.title || "Untitled Resource"}
                          </h3>

                          <p className="text-slate-600 text-sm mt-2 line-clamp-3 leading-relaxed">
                            {item?.description || "No description available"}
                          </p>
                        </div>

                        <div className="mt-6 relative z-20">
                          <div className="mb-4">
                            <p className="text-2xl font-black text-slate-900 tracking-tight">
                              ₦{Number(item?.price || 0).toLocaleString()}
                            </p>
                          </div>

                          {isOwned ? (
                            <button
                              type="button"
                              onClick={() => openResource(item)}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-sm shadow-emerald-600/10 cursor-pointer"
                            >
                              <Play size={15} fill="currentColor" />
                              Open Resource
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleBuy(item)}
                              disabled={isProcessing}
                              className="w-full bg-slate-950 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-60 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all cursor-pointer shadow-sm"
                            >
                              {isProcessing ? (
                                <span className="flex items-center gap-2">
                                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Processing...
                                </span>
                              ) : (
                                <>
                                  <ShoppingCart size={15} />
                                  Buy Resource
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showViewer && selectedResource && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-100"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">
                    {selectedResource?.title}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Secure Encrypted Resource Viewer
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeViewer}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
                  aria-label="Close configuration window"
                >
                  <X size={20} />
                </button>
              </div>

              <iframe
                title={selectedResource?.title}
                src={`${import.meta.env.VITE_API_URL}/api/resources/stream/${selectedResource?._id}`}
                className="w-full flex-1 bg-slate-50 border-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <RegistrationModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingResource(null); 
        }} 
      />
    </main>
  );
};

export default Resources;