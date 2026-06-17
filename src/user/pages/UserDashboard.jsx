import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getUserProfile, getMyCourses } from "@/services/userApi";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Compass, 
  Settings, 
  BookOpen 
} from "lucide-react";
import toast from "react-hot-toast";

const Pill = ({ children, tone = "default" }) => {
  const tones = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    danger: "bg-rose-50 text-rose-600 border border-rose-200/60",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/60",
    brand: "bg-indigo-50/60 text-indigo-700 border border-indigo-100",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm ${tones[tone]}`}>
      {children}
    </span>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between ${className}`}>
    {children}
  </div>
);

const Stat = ({ label, value, sub, tone = "default", icon: Icon }) => {
  const tones = {
    default: "text-slate-900",
    success: "text-emerald-600",
    danger: "text-rose-600",
    muted: "text-slate-500",
    brand: "text-slate-900",
  };

  return (
    <Card className="p-6 relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          {Icon && <Icon size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />}
        </div>

        <h3 className={`text-3xl font-black tracking-tight mt-3 ${tones[tone]}`}>
          {value}
        </h3>
      </div>
      {sub && <p className="text-xs text-slate-400 mt-2 font-medium">{sub}</p>}
    </Card>
  );
};

const CourseRow = ({ course }) => (
  <div className="flex items-center justify-between py-4 px-2 rounded-xl hover:bg-slate-50/80 transition-all group">
    <div className="space-y-1 pr-4">
      <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
        {course?.title || "Untitled Course"}
      </h4>
      <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
        {course?.level || "Beginner"}
      </p>
    </div>

    <Link
      to={`/courses/${course?._id}`}
      className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 whitespace-nowrap transition-transform group-hover:translate-x-0.5"
    >
      Continue
      <ArrowRight size={14} />
    </Link>
  </div>
);

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 w-1/4 bg-slate-200 rounded-md" />
          <div className="h-4 w-1/3 bg-slate-100 rounded-md" />
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-50 border border-slate-100 rounded-2xl" />
          <div className="h-32 bg-slate-50 border border-slate-100 rounded-2xl" />
          <div className="h-32 bg-slate-50 border border-slate-100 rounded-2xl" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-50 border border-slate-100 rounded-2xl" />
          <div className="lg:col-span-2 h-64 bg-slate-50 border border-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
          <AlertCircle size={24} />
        </div>
        <p className="text-slate-800 font-bold text-lg">System Connection Failed</p>
        <p className="text-slate-400 text-sm mt-1 max-w-sm">{error}</p>
        <button
          onClick={fetchDashboard}
          className="mt-6 px-6 py-2.5 rounded-xl bg-slate-950 text-white font-semibold text-sm hover:bg-slate-800 shadow-sm transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-12 space-y-10">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-12 w-96 h-96 bg-indigo-50/40 blur-3xl rounded-full" />
        <div className="absolute bottom-12 right-12 w-96 h-96 bg-sky-50/50 blur-3xl rounded-full" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100/80 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {name}
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            Your learning workspace with personalized progress tracking.
          </p>
        </div>

        <div className="self-start md:self-center">
          <Pill tone={isVerified ? "brand" : "danger"}>
            {isVerified ? (
              <>
                <CheckCircle2 size={12} className="text-indigo-600" />
                Verified Account
              </>
            ) : (
              <>
                <AlertCircle size={12} className="text-rose-500" />
                Unverified Account
              </>
            )}
          </Pill>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Stat
          label="Active Courses"
          value={courses.length}
          sub="Enrolled programs inside track"
          tone="brand"
          icon={GraduationCap}
        />

        <Stat
          label="Account Status"
          value={isVerified ? "Active" : "Pending"}
          sub={isVerified ? "Full access configuration" : "Verification checklist outstanding"}
          tone={isVerified ? "success" : "danger"}
          icon={isVerified ? CheckCircle2 : AlertCircle}
        />

        <Stat
          label="Last Session"
          value={
            profile?.lastLoginAt
              ? new Date(profile.lastLoginAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })
              : "N/A"
          }
          sub="Secure platform entry snapshot"
          tone="muted"
          icon={Clock}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-5">
          <div>
            <h2 className="font-black text-slate-900 tracking-tight text-lg">
              Quick Actions
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Navigate your core paths
            </p>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-slate-800 shadow-sm transition-all"
            >
              <Compass size={15} />
              Explore Catalog
            </Link>

            <Link
              to="/user/courses"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <BookOpen size={15} />
              My Learning
            </Link>

            <Link
              to="/user/profile"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <Settings size={15} />
              Profile Settings
            </Link>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-black text-slate-900 tracking-tight text-lg">
                  Continue Learning
                </h2>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Pick up right where you left off
                </p>
              </div>

              {courses.length > 0 && (
                <Pill tone="brand">{courses.length} active</Pill>
              )}
            </div>

            {courses.length === 0 ? (
              <div className="py-14 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <BookOpen size={18} />
                </div>
                <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">
                  No courses yet — your learning journey starts here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100/70">
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