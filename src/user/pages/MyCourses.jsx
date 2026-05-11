import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getMyCourses, getMyResources } from "@/services/userApi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const MyCourses = () => {
  const { user, token } = useAuth();

  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("courses"); // courses | resources

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseRes, resourceRes] = await Promise.allSettled([
        getMyCourses(token),
        getMyResources?.(token), // safe fallback if not created yet
      ]);

      /* COURSES */
      if (courseRes.status === "fulfilled") {
        setCourses(courseRes.value?.data?.data || []);
      }

      /* RESOURCES */
      if (resourceRes?.status === "fulfilled") {
        setResources(resourceRes.value?.data?.data || []);
      }

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to load learning data";

      setError(message);
      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 animate-pulse">
        Loading your learning hub...
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Learning Hub
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back, {user?.fullName || "Student"}
        </p>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-2 border-b">

        <button
          onClick={() => setTab("courses")}
          className={`pb-2 px-3 text-sm font-medium transition ${
            tab === "courses"
              ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
              : "text-gray-500"
          }`}
        >
          Courses ({courses.length})
        </button>

        <button
          onClick={() => setTab("resources")}
          className={`pb-2 px-3 text-sm font-medium transition ${
            tab === "resources"
              ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
              : "text-gray-500"
          }`}
        >
          Resources ({resources.length})
        </button>

      </div>

      {/* ================= COURSES ================= */}
      {tab === "courses" && (
        <>
          {courses.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              You haven’t enrolled in any course yet.
              <div className="mt-4">
                <Link
                  to="/courses"
                  className="px-5 py-2 bg-[var(--color-primary)] text-white rounded-lg"
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  <Link
                    to={`/courses/${course._id}`}
                    className="block text-center py-2 rounded-lg bg-[var(--color-secondary)] text-white"
                  >
                    Continue Learning
                  </Link>
                </div>
              ))}

            </div>
          )}
        </>
      )}

      {/* ================= RESOURCES ================= */}
      {tab === "resources" && (
        <>
          {resources.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No learning resources available yet.
            </div>
          ) : (
            <div className="space-y-3">

              {resources.map((res) => (
                <div
                  key={res._id}
                  className="flex items-center justify-between bg-white border rounded-xl p-4 hover:shadow-sm transition"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {res.title}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {res.type || "Resource"}
                    </p>
                  </div>

                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[var(--color-primary)] font-medium"
                  >
                    Open →
                  </a>
                </div>
              ))}

            </div>
          )}
        </>
      )}

    </div>
  );
};

export default MyCourses;