import { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import {
  Plus,
  Edit3,
  Trash2,
  Upload,
  Image as ImageIcon,
  Loader2,
  BookOpen,
  Clock,
  Layers,
  X,
  AlertCircle,
  Sparkles,
  Award,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CoursesAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    level: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/courses");
      setCourses(res.data.data || res.data || []);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to synchronize active courses index." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleImageChange = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Invalid format. Please select an image asset." });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async () => {
    if (!imageFile) return form.image;

    const data = new FormData();
    data.append("image", imageFile);

    const res = await API.post("/upload", data);
    return res.data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setMessage({ type: "error", text: "Course Title is required." });
      return;
    }

    try {
      setActionLoading(true);
      const imageUrl = await uploadImage();

      const payload = {
        ...form,
        image: imageUrl,
      };

      if (editingId) {
        await API.put(`/courses/${editingId}`, payload);
        setMessage({ type: "success", text: "Course configuration updated successfully." });
      } else {
        await API.post("/courses", payload);
        setMessage({ type: "success", text: "New learning course successfully initialized." });
      }

      resetForm();
      fetchCourses();
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Operational error while updating database configuration." 
      });
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "",
      duration: "",
      level: "",
      image: "",
    });

    setEditingId(null);
    setImageFile(null);
    setPreview(null);
  };

  const handleEdit = (course) => {
    setForm({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      duration: course.duration || "",
      level: course.level || "",
      image: course.image || "",
    });
    setEditingId(course._id);
    setPreview(course.image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const proceed = window.confirm("Are you absolutely sure you want to permanently delete this course? This action is irreversible.");
    if (!proceed) return;

    try {
      setActionLoading(true);
      await API.delete(`/courses/${id}`);
      setMessage({ type: "success", text: "Course document purged from registry." });
      fetchCourses();
    } catch (err) {
      setMessage({ type: "error", text: "Purging action aborted. Database connection dropped." });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 antialiased text-slate-900">
      
      <div className="border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Courses Management <Sparkles className="text-blue-500 animate-pulse" size={22} />
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Add, edit, or remove courses from the ecosystem.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl text-xs font-bold tracking-wide flex items-center gap-3 border ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <AlertCircle size={16} className={message.type === "success" ? "text-emerald-500" : "text-rose-500"} />
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8 sticky top-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900">
                {editingId ? "Modify Course Node" : "Configure New Course"}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Fill in Course details below.
              </p>
            </div>
            {editingId && (
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                Editing Mode
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* COURSE TITLE */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Title</label>
              <input
                type="text"
                placeholder="e.g. Advanced Brand Architecture"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50/30 outline-none focus:ring-4 focus:ring-blue-50/70 focus:border-blue-500 transition disabled:opacity-60"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                disabled={actionLoading}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Description</label>
              <textarea
                placeholder="Formulate structured details concerning metrics, optimization loops, and strategic pathways..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50/30 outline-none focus:ring-4 focus:ring-blue-50/70 focus:border-blue-500 transition disabled:opacity-60 resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                disabled={actionLoading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* CATEGORY */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers size={11} /> Category
                </label>
                <input
                  type="text"
                  placeholder="Marketing"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50/30 outline-none focus:ring-4 focus:ring-blue-50/70 focus:border-blue-500 transition"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  disabled={actionLoading}
                />
              </div>

              {/* DURATION */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={11} /> Duration
                </label>
                <input
                  type="text"
                  placeholder="6 Weeks"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50/30 outline-none focus:ring-4 focus:ring-blue-50/70 focus:border-blue-500 transition"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  disabled={actionLoading}
                />
              </div>

              {/* LEVEL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Award size={11} /> Level
                </label>
                <input
                  type="text"
                  placeholder="Advanced"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50/30 outline-none focus:ring-4 focus:ring-blue-50/70 focus:border-blue-500 transition"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  disabled={actionLoading}
                />
              </div>
            </div>

            {/* PREMIUM IMAGE DROPZONE ARCHITECTURE */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cover Banner Asset</label>
              
              <div 
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition duration-200 ${
                  preview ? "border-slate-300 bg-slate-50/40" : "border-slate-200 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                  disabled={actionLoading}
                />

                {preview ? (
                  <div className="relative group w-full flex flex-col items-center">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full max-h-36 rounded-xl object-cover border border-slate-200/60 shadow-sm"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition duration-200">
                      <p className="text-white text-xs font-bold flex items-center gap-1.5 bg-slate-950/85 px-3 py-1.5 rounded-lg shadow">
                        <Upload size={12} /> Replace File
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 py-2">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mx-auto text-slate-400">
                      <ImageIcon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Click to import cover photo</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Recommended format ratio 16:9</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CONTROL INTERACTIONS PANEL */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold shadow-sm transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Processing...
                  </>
                ) : editingId ? (
                  "Update Core Course"
                ) : (
                  "Add New Course"
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={actionLoading}
                  className="px-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 text-xs font-bold transition hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <X size={14} /> Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* INVENTORY REGISTRY PANEL AREA (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight text-slate-900">
              List of all Courses
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              List of active courses.
            </p>
          </div>

          {loading && courses.length === 0 ? (
            <div className="space-y-4 py-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 w-full bg-slate-100/70 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center shadow-sm mb-4">
                <AlertCircle size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No compilation</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
                Add course details.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="pb-3 w-[55%]">Module Framework</th>
                    <th className="pb-3">Tags & Scope</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100/80">
                  {courses.map((course) => (
                    <tr key={course._id} className="group hover:bg-slate-50/40 transition-colors">
                      
                      {/* COURSE IMAGE & CONTENT SUMMARY */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl border border-slate-200/60 bg-slate-50 shrink-0 overflow-hidden relative shadow-sm">
                            {course.image ? (
                              <img src={course.image} alt="thumbnail" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                <BookOpen size={16} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate tracking-tight">
                              {course.title || "Untitled Catalog Node"}
                            </h4>
                            <p className="text-slate-400 text-xs font-medium truncate mt-0.5 leading-relaxed max-w-[260px]">
                              {course.description || "No baseline information defined yet."}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-xs font-semibold text-slate-500">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">
                            {course.category || "General"}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold tracking-wide">
                            <span className="flex items-center gap-0.5"><Clock size={10} /> {course.duration || "Variable"}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><Award size={10} /> {course.level || "All Levels"}</span>
                          </div>
                        </div>
                      </td>

                      {/* CONTROLS */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleEdit(course)}
                            disabled={actionLoading}
                            title="Edit Node Parameters"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl transition cursor-pointer disabled:opacity-40"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            onClick={() => handleDelete(course._id)}
                            disabled={actionLoading}
                            title="Purge Document"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50/60 rounded-xl transition cursor-pointer disabled:opacity-40"
                          >
                            <Trash2 size={15} />
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

      </div>
    </div>
  );
};

export default CoursesAdmin;