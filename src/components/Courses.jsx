import { useEffect, useState, useCallback } from "react";
import PUBLIC_API from "@/services/publicApi";
import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { EnrollButton } from "@/components/buttons/EnrollButton";

const normalizeCourses = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

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

const Courses = ({ fallback }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return fallback ? (
      fallback
    ) : (
      <section className="py-32 px-4 sm:px-6 lg:px-8 text-center text-slate-400 bg-white animate-pulse">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded-lg mx-auto" />
          <div className="h-4 w-96 bg-slate-100 rounded-md mx-auto" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-32 px-4 sm:px-6 lg:px-8 text-center bg-white">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button
          onClick={fetchCourses}
          className="px-6 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all duration-200"
        >
          Retry Loading
        </button>
      </section>
    );
  }

  const visible = Array.isArray(courses) ? courses.slice(0, 3) : [];

  return (
    <section id="courses" className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative z-10">
      
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
          Our Featured <span className="text-blue-600">Courses</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          Industry-relevant digital skills designed to scale your performance and make you job-ready.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
                  bg-slate-50
                  border border-slate-100
                  transition-all
                  duration-300
                  hover:-translate-y-1.5
                  hover:bg-white
                  hover:border-blue-100
                  hover:shadow-xl hover:shadow-blue-500/5
                "
              >
                {/* ICON CONTAINER */}
                <div className="
                  w-12 h-12 mb-6
                  flex items-center justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  border border-blue-100
                  group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent
                  transition-all duration-300
                ">
                  {Icon ? <Icon size={22} /> : null}
                </div>

                {/* TITLE */}
                <h3 className="text-xl font-bold text-slate-900 transition-colors duration-200 group-hover:text-blue-600">
                  {course?.title || "Untitled Course"}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-3 text-slate-600 text-sm leading-relaxed min-h-[60px]">
                  {course?.description || "No description available."}
                </p>

                {/* METADATA INLINE FOOTER */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{course?.duration || "4–8 Weeks"}</span>
                  <span className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform duration-200">
                    Learn More <ArrowRight size={12} />
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl py-12">
            No courses available right now. Check back soon!
          </p>
        )}
      </motion.div>

      <div className="mt-16 text-center">
        <a
          href="/courses"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-colors duration-200"
        >
          View Other Courses
        </a>
      </div>

      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
          onClick={() => setSelectedCourse(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="
              relative
              w-full max-w-lg
              bg-white
              border border-slate-100
              rounded-2xl
              p-8
              shadow-2xl shadow-slate-900/10
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50"
            >
              <X size={20} />
            </button>

            {/* MODAL ICON */}
            <div className="w-14 h-14 mb-6 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              {selectedCourse?.icon ? (
                <selectedCourse.icon size={26} />
              ) : null}
            </div>

            {/* CONTENT */}
            <h3 className="text-2xl font-bold text-slate-900">
              {selectedCourse?.title}
            </h3>
            <p className="mt-4 text-slate-600 leading-relaxed text-sm sm:text-base">
              {selectedCourse?.description}
            </p>

            {/* DETAILS SYSTEM */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 space-y-2.5">
              <div className="flex justify-between"><span className="text-slate-400">Duration:</span> <span className="font-medium text-slate-800">{selectedCourse?.duration || "4–8 Weeks"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Difficulty:</span> <span className="font-medium text-slate-800">{selectedCourse?.level || "Beginner to Advanced"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Certification:</span> <span className="font-medium text-emerald-600">Included upon Completion</span></div>
            </div>

            {/* CTA ACTION */}
            <div className="mt-8">
              <EnrollButton className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-semibold shadow-lg shadow-blue-600/10 transition-all duration-200" />
            </div>

          </motion.div>
        </div>
      )}

    </section>
  );
};

export default Courses;