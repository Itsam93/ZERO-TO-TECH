import { useEffect, useState, useCallback } from "react";
import PUBLIC_API from "@/services/publicApi";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { EnrollButton } from "@/components/buttons/EnrollButton";

/* ================= NORMALIZER ================= */
const normalizeCourses = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

/* ================= ANIMATION ================= */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const card = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH ================= */
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await PUBLIC_API.get("/courses");
      setCourses(normalizeCourses(res?.data));
    } catch (err) {
      console.error(err);
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  /* ================= STATES ================= */
  if (loading) {
    return (
      <section className="py-28 px-6 bg-[#F7F9FC] text-center text-gray-500">
        Loading courses...
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-28 px-6 bg-[#F7F9FC] text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchCourses}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </section>
    );
  }

  const visible = Array.isArray(courses) ? courses.slice(0, 3) : [];

  return (
    <section id="courses" className="py-28 px-6 bg-[#F7F9FC]">

      {/* ================= HEADER ================= */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Our <span className="text-blue-600">Courses</span>
        </h2>

        <p className="mt-4 text-gray-600">
          Industry-relevant digital skills designed to make you job-ready.
        </p>
      </div>

      {/* ================= GRID ================= */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.length > 0 ? (
          visible.map((course) => {
            const Icon = course?.icon;

            return (
              <motion.div
                key={course?._id || course?.id}
                variants={card}
                onClick={() => setSelectedCourse(course)}
                className="
                  group
                  cursor-pointer
                  p-8
                  rounded-2xl
                  bg-white
                  border border-gray-100
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                  hover:border-blue-200
                "
              >

                {/* ICON */}
                <div className="
                  w-12 h-12 mb-6
                  flex items-center justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                ">
                  {Icon ? <Icon size={22} /> : null}
                </div>

                {/* TITLE */}
                <h3 className="text-xl font-semibold text-gray-900">
                  {course?.title || "Untitled Course"}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {course?.description || "No description available."}
                </p>

                {/* ACCENT LINE */}
                <div className="
                  mt-6 h-[2px] w-0
                  bg-blue-600
                  group-hover:w-full
                  transition-all duration-300
                " />

              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No courses available.
          </p>
        )}
      </motion.div>

      {/* ================= CTA ================= */}
      <div className="mt-14 text-center">
        <a
          href="/courses"
          className="
            inline-block
            px-8 py-3
            rounded-full
            bg-blue-600
            text-white
            hover:bg-blue-700
            transition
          "
        >
          View More Courses
        </a>
      </div>

      {/* ================= MODAL ================= */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="
              relative
              w-full max-w-lg
              bg-white
              rounded-2xl
              p-8
              shadow-xl
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            {/* ICON */}
            <div className="w-14 h-14 mb-6 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              {selectedCourse?.icon ? (
                <selectedCourse.icon size={26} />
              ) : null}
            </div>

            {/* TITLE */}
            <h3 className="text-2xl font-semibold text-gray-900">
              {selectedCourse?.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="mt-4 text-gray-600">
              {selectedCourse?.description}
            </p>

            {/* DETAILS */}
            <div className="mt-6 text-sm text-gray-500 space-y-2">
              <p>• Duration: {selectedCourse?.duration || "4–8 Weeks"}</p>
              <p>• Level: {selectedCourse?.level || "Beginner to Advanced"}</p>
              <p>• Certificate Included</p>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <EnrollButton className="w-full" />
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default Courses;