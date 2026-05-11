import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Video,
  Download,
  RefreshCw,
  Search,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import API from "../../services/api";

const ResourcesAdmin = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [resources, setResources] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "PDF",
  });

  const [file, setFile] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  const showError = (text) => {
    setError(text);

    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  /* =====================================================
     FETCH RESOURCES
  ===================================================== */

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/resources");

      const data = res?.data?.data || [];

      setResources(data);
    } catch (err) {
      console.error("FETCH RESOURCES ERROR:", err);

      showError(
        err?.response?.data?.message ||
          "Failed to load resources"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  /* =====================================================
     FILTERED RESOURCES
  ===================================================== */

  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.title?.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword) ||
        item.type?.toLowerCase().includes(keyword)
      );
    });
  }, [resources, search]);

  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      type: "PDF",
    });

    setFile(null);
    setEditingId(null);
  };

  /* =====================================================
     HANDLE SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      let uploadedFile = null;

      /* =========================================
         STEP 1: UPLOAD FILE
      ========================================= */

      if (file) {
        const formData = new FormData();

        formData.append("file", file);

        const uploadRes = await API.post(
          "/uploads/resource",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        uploadedFile = uploadRes?.data?.data;
      }

      /* =========================================
         STEP 2: CREATE / UPDATE RESOURCE
      ========================================= */

      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        type: form.type,

        ...(uploadedFile && {
          fileUrl: uploadedFile.secure_url,
          cloudinaryId: uploadedFile.public_id,
        }),
      };

      /* CREATE */

      if (!editingId) {
        if (!uploadedFile) {
          return showError(
            "Please upload a resource file"
          );
        }

        await API.post("/resources", payload);

        showMessage(
          "Resource created successfully"
        );
      }

      /* UPDATE */

      if (editingId) {
        await API.put(
          `/resources/${editingId}`,
          payload
        );

        showMessage(
          "Resource updated successfully"
        );
      }

      resetForm();

      await fetchResources();
    } catch (err) {
      console.error("SAVE RESOURCE ERROR:", err);

      showError(
        err?.response?.data?.message ||
          "Failed to save resource"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     HANDLE EDIT
  ===================================================== */

  const handleEdit = (item) => {
    setForm({
      title: item.title || "",
      description: item.description || "",
      price: item.price || "",
      type: item.type || "PDF",
    });

    setEditingId(item._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     HANDLE DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      setError(null);

      await API.delete(`/resources/${id}`);

      setResources((prev) =>
        prev.filter((r) => r._id !== id)
      );

      showMessage(
        "Resource deleted successfully"
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error("DELETE RESOURCE ERROR:", err);

      showError(
        err?.response?.data?.message ||
          "Failed to delete resource"
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================
     RESOURCE ICON
  ===================================================== */

  const getResourceIcon = (type) => {
    switch (type) {
      case "Video":
        return (
          <Video className="w-5 h-5 text-purple-600" />
        );

      case "Download":
        return (
          <Download className="w-5 h-5 text-green-600" />
        );

      default:
        return (
          <FileText className="w-5 h-5 text-blue-600" />
        );
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Resource Management
          </h1>

          <p className="text-gray-500 mt-1">
            Upload, edit and manage resources.
          </p>
        </div>

        <button
          onClick={fetchResources}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}

          Refresh
        </button>
      </div>

      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      {message && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-green-200 bg-green-50 text-green-700">
          <CheckCircle2 className="w-5 h-5" />

          <p className="text-sm font-medium">
            {message}
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700">
          <AlertCircle className="w-5 h-5" />

          <p className="text-sm font-medium">
            {error}
          </p>
        </div>
      )}

      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId
              ? "Edit Resource"
              : "Create Resource"}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Upload first-hand engaging materials.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* TITLE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource Title
            </label>

            <input
              type="text"
              placeholder="Enter resource title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className="w-full border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/5 outline-none rounded-xl px-4 py-3 transition"
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Enter resource description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="w-full border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/5 outline-none rounded-xl px-4 py-3 transition resize-none"
              required
            />
          </div>

          {/* GRID */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* PRICE */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₦)
              </label>

              <input
                type="number"
                placeholder="5000"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
                className="w-full border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/5 outline-none rounded-xl px-4 py-3 transition"
                required
              />
            </div>

            {/* TYPE */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type
              </label>

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
                className="w-full border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/5 outline-none rounded-xl px-4 py-3 transition"
              >
                <option value="PDF">PDF</option>
                <option value="Video">Video</option>
                <option value="Download">
                  Download
                </option>
              </select>
            </div>
          </div>

          {/* FILE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource File
            </label>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 cursor-pointer hover:border-black transition bg-gray-50">
              <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />

              <p className="font-medium text-gray-700">
                Click to upload resource
              </p>

              <p className="text-sm text-gray-500 mt-1">
                PDF, Video or Downloadable file
              </p>

              {file && (
                <div className="mt-4 inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm">
                  <CheckCircle2 className="w-4 h-4" />

                  {file.name}
                </div>
              )}

              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
              />
            </label>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-wrap items-center gap-3 pt-2">

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {editingId ? (
                    <Pencil className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}

                  {editingId
                    ? "Update Resource"
                    : "Add Resource"}
                </>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition"
              >
                <X className="w-4 h-4" />
                Cancel Edit
              </button>
            )}
          </div>

        </form>
      </div>

      {/* =====================================================
          RESOURCE LIST
      ===================================================== */}

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

        {/* TOP BAR */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 px-6 py-5">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              All Resources
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredResources.length} resource(s)
              found
            </p>
          </div>

          {/* SEARCH */}

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:border-black focus:ring-2 focus:ring-black/5 outline-none"
            />
          </div>
        </div>

        {/* CONTENT */}

        <div className="p-6">

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-14 h-14 text-gray-300 mx-auto mb-4" />

              <h3 className="text-lg font-semibold text-gray-800">
                No Resources Found
              </h3>

              <p className="text-gray-500 mt-1">
                Create your first educational
                resource.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">

              {filteredResources.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition bg-white"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* LEFT */}

                    <div className="flex items-start gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        {getResourceIcon(item.type)}
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {item.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-3">

                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                            {item.type}
                          </span>

                          <span className="text-sm font-semibold text-black">
                            ₦
                            {Number(
                              item.price
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          handleEdit(item)
                        }
                        className="inline-flex items-center gap-2 border border-gray-200 hover:border-black px-4 py-2 rounded-xl transition"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        disabled={
                          deletingId === item._id
                        }
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition disabled:opacity-50"
                      >
                        {deletingId === item._id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </>
                        )}
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default ResourcesAdmin;