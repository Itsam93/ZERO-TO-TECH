import { useEffect, useState } from "react";
import PUBLIC_API from "@/services/publicApi";
import { EnrollButton } from "@/components/buttons/EnrollButton";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";

const categories = [
  "All",
  "Development",
  "Marketing",
  "Creative",
  "Productivity",
  "Fundamentals",
];

/* 🔥 STAGGER CONTAINER */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* 🔥 CARD ANIMATION */
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
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
      <main className="pt-24 px-6 pb-20 text-center text-gray-500">
        Loading courses...
      </main>
    );
  }

  return (
    <main className="pt-24 px-6 pb-20">

      {/* HEADER */}
      <AnimatedSection>
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold">
            Explore Our{" "}
            <span className="text-[var(--color-primary)]">Courses</span>
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Browse our wide range of Tech courses designed to equip you with real-world skills.
          </p>
        </div>
      </AnimatedSection>

      {/* FILTERS */}
      <AnimatedSection delay={0.1}>
        <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row gap-4 justify-between">

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  activeCategory === cat
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-full w-full md:w-64 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </AnimatedSection>

      {/* GRID */}
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
                className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm 
                hover:shadow-xl hover:-translate-y-2 transition duration-300 flex flex-col"
              >
                {Icon && (
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl 
                  bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4">
                    <Icon size={24} />
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-2">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 flex-grow">
                  {course.description}
                </p>

                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <p>Duration: {course.duration || "N/A"}</p>
                  <p>Level: {course.level || "N/A"}</p>
                  <p>Category: {course.category}</p>
                </div>

                <EnrollButton className="w-full text-center mt-auto" />
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