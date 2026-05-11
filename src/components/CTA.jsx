import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import toast from "react-hot-toast";
import { ViewCoursesButton } from "@/components/buttons/ViewCoursesButton";

const CTA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ================= ENROLL HANDLER (AUTH PROTECTED) ================= */
  const handleEnroll = () => {
    if (!user) {
      toast.error("Kindly register to proceed");
      return;
    }

    navigate("/checkout", {
      state: {
        source: "cta",
      },
    });
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)] opacity-10 blur-3xl"></div>

      {/* CONTENT */}
      <div className="relative max-w-5xl mx-auto text-center">

        {/* BADGE */}
        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full 
                        bg-white/40 backdrop-blur-md border border-white/30 
                        text-[var(--color-primary)] text-sm font-medium shadow-sm">
          Start Your Digital Journey Today
        </div>

        {/* HEADING */}
        <h2 className="font-[var(--font-heading)] text-4xl md:text-5xl font-semibold leading-tight">
          Ready to Build a{" "}
          <span className="text-[var(--color-primary)]">
            High-Income Skill?
          </span>
        </h2>

        {/* SUBTEXT */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-[var(--font-body)]">
          Join hundreds of students learning practical ICT skills that lead to freelancing,
          remote jobs, and business opportunities.
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">

          {/* ================= ENROLL BUTTON (PROTECTED) ================= */}
          <button
            onClick={handleEnroll}
            className="
              relative px-10 py-3 text-base font-medium text-white
              bg-blue-500
              rounded-xl shadow-lg
              transition-all duration-300
              hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03]
              active:scale-95
              before:absolute before:inset-0 before:rounded-xl
              before:bg-white/10 before:opacity-0 hover:before:opacity-100
              overflow-hidden
            "
          >
            Enroll Now
          </button>

          {/* ================= VIEW COURSES ================= */}
          <div className="transform transition duration-300 hover:scale-[1.03] hover:-translate-y-1">
            <ViewCoursesButton className="
              px-10 py-3 text-base
              bg-white/80 backdrop-blur-md
              border border-gray-200
              rounded-xl
              shadow-sm hover:shadow-md
              transition
            " />
          </div>

        </div>

        {/* TRUST LINE */}
        <p className="mt-10 text-sm text-gray-500">
          No experience required • Beginner friendly • Certificate included
        </p>

      </div>
    </section>
  );
};

export default CTA;