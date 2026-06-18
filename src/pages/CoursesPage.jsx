import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import PUBLIC_API from "@/services/publicApi";
import { EnrollButton } from "@/components/buttons/EnrollButton";
import AnimatedSection from "@/components/AnimatedSection";
import { RegistrationModal } from "@/components/RegistrationModal"; 
import PaymentModal from "@/components/PaymentModal";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Code, Megaphone, Palette, Cpu, Layers } from "lucide-react";

const categories = [
  "All",
  "Development",
  "Marketing",
  "Creative",
  "Productivity",
  "Fundamentals",
];

const iconMap = {
  Development: Code,
  Marketing: Megaphone,
  Creative: Palette,
  Productivity: Cpu,
  Fundamentals: Layers,
};

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [activeCourseForPay, setActiveCourseForPay] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await PUBLIC_API.get("/courses");
        setCourses(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (!course) return false;
    
    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;

    const matchesSearch =
      !search || course.title?.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleEnrollClick = (course) => {
    if (user) {
      setActiveCourseForPay(course);
      setIsPayModalOpen(true);
    } else {
      setShowRegisterModal(true);
    }
  };

  return (
    <main className="pt-32 px-4 sm:px-6 lg:px-8 pb-20 bg-white min-h-screen">

      <AnimatedSection>
        <div className="max-w-6xl mx-auto text-center mb-16 relative">
          
          <div className="absolute inset-0 flex justify-center -z-10 pointer-events-none">
            <div className="w-[350px] h-[350px] bg-blue-500/[0.04] blur-[100px] rounded-full" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Explore Our <span className="text-blue-600">Courses</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Structured learning paths designed to take you from beginner to job-ready
            in real-world digital skills.
          </p>
        </div>
      </AnimatedSection>

      {loading ? (
        <div className="animate-pulse">
          <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="h-12 w-full md:w-[500px] bg-slate-100 rounded-full" />
            <div className="h-11 w-full md:w-72 bg-slate-100 rounded-full" />
          </div>

          <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="p-7 bg-slate-50 border border-slate-100 rounded-2xl h-[380px] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-200 mb-6" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded-md mb-4" />
                  <div className="space-y-2 mb-6">
                    <div className="h-3.5 w-full bg-slate-100 rounded" />
                    <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
                    <div className="h-3.5 w-2/3 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-1/3 bg-slate-100 rounded" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded" />
                </div>
                <div className="h-11 w-full bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <AnimatedSection delay={0.1}>
            <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row gap-4 justify-between items-center">

              <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-full border border-slate-200/60 shadow-sm w-full md:w-auto justify-start md:justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200
                      ${
                        activeCategory === cat
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    w-full
                    pl-10 pr-4 py-2.5
                    rounded-full
                    border border-slate-200
                    bg-white
                    text-slate-900 text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-4 focus:ring-blue-500/10
                    transition-all duration-200
                  "
                />
              </div>

            </div>
          </AnimatedSection>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => {
                const ResolvedIcon = typeof course?.icon === "string" 
                  ? (iconMap[course.icon] || BookOpen) 
                  : (course?.icon || BookOpen);
                const currentId = course?._id || course?.id || `course-${index}`;

                return (
                  <motion.div
                    key={currentId}
                    variants={cardVariants}
                    className="
                      group relative
                      p-8
                      bg-slate-50
                      rounded-2xl
                      border border-slate-100
                      hover:bg-white
                      hover:border-blue-100
                      hover:shadow-xl hover:shadow-blue-500/[0.03]
                      hover:-translate-y-1.5
                      transition-all duration-300
                      overflow-hidden
                      flex flex-col
                      justify-between
                    "
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                    <div>
                      <div className="
                        w-12 h-12
                        flex items-center justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                        border border-blue-100/50
                        group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent
                        mb-6
                        transition-all duration-300
                      ">
                        <ResolvedIcon size={22} />
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {course?.title || "Untitled Course"}
                      </h3>

                      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                        {course?.description || "No description provided for this module."}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500 font-medium space-y-1.5 mb-6 pt-4 border-t border-slate-200/40">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration:</span>
                          <span className="text-slate-700">{course?.duration || "Flexible"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Level:</span>
                          <span className="text-slate-700">{course?.level || "Beginner Friendly"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Category:</span>
                          <span className="text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                            {course?.category || "General"}
                          </span>
                        </div>
                      </div>

                      <EnrollButton 
                        onClick={() => handleEnrollClick(course)}
                        className="w-full mt-auto bg-slate-900 hover:bg-blue-600 text-white rounded-xl py-3 text-sm font-semibold shadow-sm transition-all duration-200" 
                      />
                    </div>

                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 border border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-400 font-medium text-base">
                  No modules match your current adjustments.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}

      <RegistrationModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
        registerUrl="/register"
      />

      <AnimatePresence>
        {isPayModalOpen && activeCourseForPay && (
          <PaymentModal
            itemType="course"
            itemId={activeCourseForPay._id || activeCourseForPay.id}
            title={activeCourseForPay.title}
            amount={activeCourseForPay.price} // Ensure your API returns 'price'
            onClose={() => {
              setIsPayModalOpen(false);
              setActiveCourseForPay(null);
            }}
          />
        )}
      </AnimatePresence>

    </main>
  );
};

export default CoursesPage;