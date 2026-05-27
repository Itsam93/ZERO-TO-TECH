import { useEffect, useState } from "react";
import PUBLIC_API from "@/services/publicApi";
import { EnrollButton } from "@/components/buttons/EnrollButton";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const categories = [
  "All",
  "Development",
  "Marketing",
  "Creative",
  "Productivity",
  "Fundamentals",
];

/* ================= ANIMATION ================= */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await PUBLIC_API.get("/courses");
        setCourses(res.data.data || res.data || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;

    const matchesSearch =
      course.title?.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <main className="pt-24 px-6 pb-20 bg-[#F7F9FC] text-center text-gray-500">
        Loading courses...
      </main>
    );
  }

  return (
    <main className="pt-24 px-6 pb-20 bg-[#F7F9FC]">

      {/* ======================================================
          EDITORIAL HEADER (PREMIUM IDENTITY LAYER)
      ====================================================== */}
      <AnimatedSection>
        <div className="max-w-6xl mx-auto text-center mb-16 relative">

          <div className="absolute inset-0 flex justify-center -z-10">
            <div className="w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 tracking-tight">
            Explore Our{" "}
            <span className="text-blue-600">
              Courses
            </span>
          </h1>

          <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Structured learning paths designed to take you from beginner to job-ready
            in real-world digital skills.
          </p>

        </div>
      </AnimatedSection>

      {/* ======================================================
          FILTER SYSTEM (SEGMENTED CONTROL STYLE)
      ====================================================== */}
      <AnimatedSection delay={0.1}>
        <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">

          {/* CATEGORY PILLS */}
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-full border border-gray-200 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-sm transition
                  ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                pl-10 pr-4 py-2
                rounded-full
                border border-gray-200
                bg-white
                outline-none
                focus:ring-2 focus:ring-blue-500/30
                transition
              "
            />
          </div>

        </div>
      </AnimatedSection>

      {/* ======================================================
          COURSE GRID (LEARNING TILES SYSTEM)
      ====================================================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const Icon = course.icon;

            return (
              <motion.div
                key={course._id || course.id}
                variants={cardVariants}
                className="
                  group relative
                  p-7
                  bg-white
                  rounded-2xl
                  border border-gray-100
                  shadow-sm
                  hover:shadow-xl
                  hover:-translate-y-2
                  transition-all duration-300
                  overflow-hidden
                  flex flex-col
                "
              >

                {/* ACCENT EDGE */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-600/20" />

                {/* ICON */}
                {Icon && (
                  <div className="
                    w-12 h-12
                    flex items-center justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    mb-5
                  ">
                    <Icon size={22} />
                  </div>
                )}

                {/* TITLE */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-sm mb-5 flex-grow leading-relaxed">
                  {course.description}
                </p>

                {/* META */}
                <div className="text-xs text-gray-500 space-y-1 mb-5">
                  <p>Duration: {course.duration || "Flexible"}</p>
                  <p>Level: {course.level || "Beginner Friendly"}</p>
                  <p>Category: {course.category}</p>
                </div>

                {/* CTA */}
                <EnrollButton className="w-full mt-auto" />

              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No courses found.
          </p>
        )}
      </motion.div>

    </main>
  );
};

export default CoursesPage;