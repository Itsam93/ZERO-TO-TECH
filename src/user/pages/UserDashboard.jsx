import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getUserProfile, getMyCourses } from "@/services/userApi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

/* ================= UI PRIMITIVES ================= */

const Pill = ({ children, tone = "default" }) => {
  const tones = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-emerald-50 text-emerald-600",
    danger: "bg-red-50 text-red-500",
    warning: "bg-amber-50 text-amber-600",
    brand: "bg-[color-mix(in_srgb,var(--color-primary)_15%,white)] text-[var(--color-primary)]",
  };

  return (
    <span className={`text-xs px-3 py-1 rounded-full ${tones[tone]}`}>
      {children}
    </span>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`
      rounded-2xl border border-gray-100 
      bg-white/80 backdrop-blur-md
      shadow-sm hover:shadow-lg 
      transition-all duration-300
      ${className}
    `}
  >
    {children}
  </div>
);

const Stat = ({ label, value, sub, tone = "default" }) => {
  const tones = {
    default: "text-gray-900",
    success: "text-emerald-600",
    danger: "text-red-500",
    muted: "text-gray-500",
    brand: "text-[var(--color-primary)]",
  };

  return (
    <Card className="p-5 hover:border-[color-mix(in_srgb,var(--color-primary)_30%,white)]">
      <p className="text-xs uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <h3 className={`text-2xl font-semibold mt-2 ${tones[tone]}`}>
        {value}
      </h3>

      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </Card>
  );
};

const CourseRow = ({ course }) => (
  <div
    className="
      flex items-center justify-between
      py-4 px-4 rounded-xl
      hover:bg-[color-mix(in_srgb,var(--color-primary)_5%,white)]
      transition
      group
    "
  >
    <div className="space-y-1">
      <h4 className="font-medium text-gray-900 group-hover:text-[var(--color-primary)] transition">
        {course?.title || "Untitled Course"}
      </h4>
      <p className="text-xs text-gray-500">
        {course?.level || "Beginner"}
      </p>
    </div>

    <Link
      to={`/courses/${course?._id}`}
      className="text-sm font-medium text-[var(--color-primary)] hover:underline"
    >
      Continue →
    </Link>
  </div>
);

/* ================= MAIN ================= */

const UserDashboard = () => {
  const { user, token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const extractData = (res) => res?.data?.data || res?.data || null;

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileRes, coursesRes] = await Promise.allSettled([
        getUserProfile(),
        getMyCourses(),
      ]);

      if (profileRes.status === "fulfilled") {
        setProfile(extractData(profileRes.value));
      }

      if (coursesRes.status === "fulfilled") {
        const data = extractData(coursesRes.value);
        setCourses(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Dashboard failed to load";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token]);

  const name = useMemo(
    () => profile?.fullName || user?.fullName || "Student",
    [profile, user]
  );

  const isVerified = profile?.isEmailVerified;

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="h-24 bg-gray-100 rounded-2xl" />
          <div className="h-24 bg-gray-100 rounded-2xl" />
          <div className="h-24 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <p className="text-red-500 font-medium">{error}</p>

        <button
          onClick={fetchDashboard}
          className="mt-5 px-5 py-2 rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-10 space-y-10">

      {/* ================= BACKGROUND LAYERS ================= */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[color-mix(in_srgb,var(--color-primary)_20%,white)] blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-100 blur-3xl rounded-full" />
      </div>

      {/* ================= HEADER ================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome back, {name}
          </h1>

          <Pill tone={isVerified ? "brand" : "danger"}>
            {isVerified ? "Verified Account" : "Unverified Account"}
          </Pill>
        </div>

        <p className="text-gray-500">
          Your learning workspace with personalized progress tracking.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-3 gap-5">
        <Stat
          label="Active Courses"
          value={courses.length}
          sub="Your learning journey"
          tone="brand"
        />

        <Stat
          label="Account Status"
          value={isVerified ? "Active" : "Pending"}
          tone={isVerified ? "success" : "danger"}
        />

        <Stat
          label="Last Login"
          value={
            profile?.lastLoginAt
              ? new Date(profile.lastLoginAt).toLocaleString()
              : "N/A"
          }
          tone="muted"
        />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* QUICK ACTIONS */}
        <Card className="p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">
            Quick Actions
          </h2>

          <Link
            to="/courses"
            className="block text-center py-2.5 rounded-xl bg-[var(--color-primary)] text-white hover:opacity-90 transition"
          >
            Explore Courses
          </Link>

          <Link
            to="/user/courses"
            className="block text-center py-2.5 rounded-xl border hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition"
          >
            My Learning
          </Link>

          <Link
            to="/user/profile"
            className="block text-center py-2.5 rounded-xl border hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition"
          >
            Profile Settings
          </Link>
        </Card>

        {/* CONTINUE LEARNING */}
        <div className="lg:col-span-2">
          <Card className="p-5 space-y-2">

            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Continue Learning
              </h2>

              {courses.length > 0 && (
                <Pill tone="brand">{courses.length} active</Pill>
              )}
            </div>

            {courses.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                No courses yet — your learning journey starts here.
              </div>
            ) : (
              <div className="divide-y">
                {courses.slice(0, 6).map((item) => {
                  const course = item?.course || item;
                  return <CourseRow key={course?._id} course={course} />;
                })}
              </div>
            )}

          </Card>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;