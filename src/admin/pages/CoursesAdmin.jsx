import { useEffect, useState } from "react";
import API from "../../services/api";

const CoursesAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

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

  /* ================= FETCH COURSES ================= */
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/courses");
      setCourses(res.data.data || res.data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load courses" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ================= IMAGE PREVIEW ================= */
  const handleImageChange = (file) => {
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  /* ================= UPLOAD IMAGE ================= */
  const uploadImage = async () => {
    if (!imageFile) return form.image;

    const data = new FormData();
    data.append("image", imageFile);

    const res = await API.post("/upload", data);
    return res.data.imageUrl;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const imageUrl = await uploadImage();

      const payload = {
        ...form,
        image: imageUrl,
      };

      if (editingId) {
        await API.put(`/courses/${editingId}`, payload);
        setMessage({ type: "success", text: "Course updated successfully" });
      } else {
        await API.post("/courses", payload);
        setMessage({ type: "success", text: "Course created successfully" });
      }

      resetForm();
      fetchCourses();
    } catch (err) {
      setMessage({ type: "error", text: "Error saving course" });
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET FORM ================= */
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

  /* ================= EDIT ================= */
  const handleEdit = (course) => {
    setForm(course);
    setEditingId(course._id);
    setPreview(course.image || null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this course?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/courses/${id}`);
      setMessage({ type: "success", text: "Course deleted successfully" });
      fetchCourses();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete course" });
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
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Manage Courses</h1>
        <p className="text-gray-500 text-sm">
          Create, update, and manage all courses
        </p>
      </div>

      <MessageBox />

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Course" : "Add New Course"}
        </h2>

        <input
          placeholder="Course Title"
          className="w-full border px-4 py-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Course Description"
          className="w-full border px-4 py-2 rounded"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          required
        />

        <div className="grid md:grid-cols-3 gap-3">
          <input
            placeholder="Category"
            className="border px-4 py-2 rounded"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <input
            placeholder="Duration"
            className="border px-4 py-2 rounded"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
          />

          <input
            placeholder="Level"
            className="border px-4 py-2 rounded"
            value={form.level}
            onChange={(e) =>
              setForm({ ...form, level: e.target.value })
            }
          />
        </div>

        {/* IMAGE */}
        <div>
          <input
            type="file"
            onChange={(e) => handleImageChange(e.target.files[0])}
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 mt-3 rounded object-cover border"
            />
          )}
        </div>

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:opacity-90"
        >
          {loading
            ? "Processing..."
            : editingId
            ? "Update Course"
            : "Add Course"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">All Courses</h2>

        {loading && courses.length === 0 ? (
          <p className="text-gray-500">Loading courses...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Title</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} className="border-b">
                    <td className="py-3">{course.title}</td>
                    <td>{course.category}</td>
                    <td>{course.level}</td>

                    <td className="text-right space-x-3">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(course._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesAdmin;