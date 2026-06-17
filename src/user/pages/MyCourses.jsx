import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getMyCourses, getMyResources } from "@/services/userApi";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  FolderOpen, 
  ArrowRight, 
  FileText, 
  Video, 
  BookOpen, 
  Sparkles, 
  AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const MyCourses = () => {
  const { user, token } = useAuth();

  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("courses");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseRes, resourceRes] = await Promise.allSettled([
        getMyCourses(token),
        getMyResources?.(token), 
      ]);

      if (courseRes.status === "fulfilled") {
        setCourses(courseRes.value?.data?.data || []);
      }

      if (resourceRes?.status === "fulfilled") {
        setResources(resourceRes.value?.data?.data || []);
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to load learning data";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const getResourceIcon = (type) => {
    switch (type) {
      case "Video":
        return <Video size={18} className="text-indigo-600" />;
      case "PDF":
      case "Document":
        return <FileText size={18} className="text-blue-600" />;
      default:
        return <BookOpen size={18} className="text-slate-600" />;
    }
  };

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-10 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-8 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-64 bg-slate-100 rounded-md" />
        </div>
        {/* Tabs Skeleton */}
        <div className="flex gap-4 border-b border-slate-100 pb-2">
          <div className="h-6 w-24 bg-slate-200 rounded" />
          <div className="h-6 w-24 bg-slate-100 rounded" />
        </div>
        {/* Card Architecture Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-slate-100 rounded-2xl p-6 space-y-4 h-[220px] bg-slate-50/[0.50] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
                <div className="h-3 w-full bg-slate-100 rounded" />
                <div className="h-3 w-5/6 bg-slate-100 rounded" />
              </div>
              <div className="h-10 w-full bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Unable to load hub workspace</h2>
        <p className="text-sm text-slate-500 max-w-sm mt-1">{error}</p>
        <button 
          onClick={fetchData}
          className="mt-4 text-xs font-semibold px-4 py-2 bg-slate-950 text-white rounded-lg hover:bg-slate-800 transition"
        >
          Retry Connection
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-10 min-h-screen">
      
      {/* HEADER BLOCK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            My Learning Hub <Sparkles size={20} className="text-blue-600 animate-pulse" />
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm font-medium">
            Welcome back, <span className="text-slate-800 font-bold">{user?.fullName || "Learner"}</span>
          </p>
        </div>
      </div>

      {/* CORE NAVIGATION SWITCHBOARD */}
      <div className="flex gap-6 border-b border-slate-200/60 relative">
        <button
          onClick={() => setTab("courses")}
          className={`pb-3 text-sm font-bold tracking-tight relative transition-colors duration-200 flex items-center gap-2 px-1 ${
            tab === "courses" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <GraduationCap size={16} />
          Enrolled Courses
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ml-1 transition-colors ${
            tab === "courses" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
          }`}>
            {courses.length}
          </span>
          {tab === "courses" && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
          )}
        </button>

        <button
          onClick={() => setTab("resources")}
          className={`pb-3 text-sm font-bold tracking-tight relative transition-colors duration-200 flex items-center gap-2 px-1 ${
            tab === "resources" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <FolderOpen size={15} />
          Resources
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ml-1 transition-colors ${
            tab === "resources" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
          }`}>
            {resources.length}
          </span>
          {tab === "resources" && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
          )}
        </button>
      </div>

      {/* CONTENT SWITCH MATRIX */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {tab === "courses" ? (
            <motion.div
              key="courses-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {courses.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-200 bg-slate-50/[0.40] rounded-2xl flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center shadow-sm mb-4">
                    <GraduationCap size={22} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No active course enrollments</h3>
                  <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
                    Unlock professional skill paths and premium instruction tracks inside our catalog workspace.
                  </p>
                  <Link
                    to="/courses"
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs tracking-tight transition shadow-sm"
                  >
                    Browse Courses <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <motion.div
                      key={course._id}
                      whileHover={{ y: -4 }}
                      className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-slate-900 line-clamp-2 text-base tracking-tight mb-2 group-hover:text-blue-600">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-6 font-medium">
                          {course.description || "No core track description set."}
                        </p>
                      </div>
                      
                      <Link
                        to={`/courses/${course._id}`}
                        className="w-full text-center py-3 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        Continue Learning <ArrowRight size={13} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="resources-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {resources.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-200 bg-slate-50/[0.40] rounded-2xl flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center shadow-sm mb-4">
                    <FolderOpen size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No downloadable materials</h3>
                  <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
                    Premium study briefs, analytical sheets, and asset libraries assigned to your profile will load here.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((res) => (
                    <motion.div
                      key={res._id}
                      whileHover={{ x: 2 }}
                      className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 overflow-hidden pr-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          {getResourceIcon(res.type)}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-semibold text-slate-900 text-sm truncate tracking-tight">
                            {res.title}
                          </h4>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-0.5 block">
                            {res.type || "Asset File"}
                          </span>
                        </div>
                      </div>
                      
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 font-bold shrink-0 hover:text-blue-700 hover:underline px-2.5 py-1.5 rounded-lg hover:bg-blue-50/50 transition-colors"
                      >
                        Open →
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default MyCourses;