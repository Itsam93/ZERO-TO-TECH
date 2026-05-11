import { useEffect, useState, useCallback } from "react";
import PUBLIC_API from "@/services/publicApi";
import { X } from "lucide-react";
import { EnrollButton } from "@/components/buttons/EnrollButton";

const normalizeCourses = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH COURSES ================= */
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await PUBLIC_API.get("/courses");

      const normalized = normalizeCourses(res?.data);
      setCourses(normalized);
    } catch (err) {
      console.error("COURSES FETCH ERROR:", err);
      setError("Failed to load courses. Please try again.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <section className="py-24 px-6 text-center text-gray-500">
        Loading courses...
      </section>
    );
  }

  /* ================= ERROR STATE ================= */
  if (error) {
    return (
      <section className="py-24 px-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchCourses}
          className="px-6 py-2 bg-black text-white rounded-lg"
        >
          Retry
        </button>
      </section>
    );
  }

  /* ================= SAFE LIMIT (NO CRASH) ================= */
  const visibleCourses = Array.isArray(courses)
    ? courses.slice(0, 3)
    : [];

  return (
    <section id="courses" className="py-24 px-6 bg-white relative">

      {/* ================= HEADER ================= */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-semibold">
          Our <span className="text-[var(--color-primary)]">Courses</span>
        </h2>

        <p className="mt-4 text-gray-600">
          Industry-relevant digital skills designed to make you job-ready.
        </p>
      </div>

      {/* ================= GRID ================= */}
      <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {visibleCourses.length > 0 ? (
          visibleCourses.map((course) => {
            const Icon = course?.icon;

            return (
              <div
                key={course?._id || course?.id}
                onClick={() => setSelectedCourse(course)}
                className="cursor-pointer group relative p-8 rounded-2xl border border-gray-100 bg-white shadow-sm 
                hover:shadow-xl hover:-translate-y-2 transition duration-300 overflow-hidden"
              >

                {/* HOVER GLOW */}
                <div className="absolute inset-0 bg-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition" />

                {/* ICON */}
                <div className="relative z-10 w-12 h-12 flex items-center justify-center rounded-xl 
                bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-6">

                  {Icon ? <Icon size={24} /> : null}

                </div>

                {/* TITLE */}
                <h3 className="relative z-10 text-xl font-semibold">
                  {course?.title || "Untitled Course"}
                </h3>

                {/* DESCRIPTION */}
                <p className="relative z-10 mt-3 text-gray-600">
                  {course?.description || "No description available."}
                </p>

                {/* HOVER LINE */}
                <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-[var(--color-primary)] group-hover:w-full transition-all duration-300" />
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No courses available.
          </p>
        )}

      </div>

      {/* ================= CTA ================= */}
      <div className="mt-12 text-center">
        <a
          href="/courses"
          className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg hover:opacity-90"
        >
          View More Courses
        </a>
      </div>

      {/* ================= MODAL ================= */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={22} />
            </button>

            {/* ICON */}
            <div className="w-14 h-14 flex items-center justify-center rounded-xl 
            bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-6">

              {selectedCourse?.icon ? (
                <selectedCourse.icon size={28} />
              ) : null}

            </div>

            {/* TITLE */}
            <h3 className="text-2xl font-semibold">
              {selectedCourse?.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="mt-4 text-gray-600">
              {selectedCourse?.description}
            </p>

            {/* DETAILS */}
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <p>• Duration: {selectedCourse?.duration || "4–8 Weeks"}</p>
              <p>• Level: {selectedCourse?.level || "Beginner to Advanced"}</p>
              <p>• Certificate Included</p>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <EnrollButton className="w-full text-center" />
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default Courses;