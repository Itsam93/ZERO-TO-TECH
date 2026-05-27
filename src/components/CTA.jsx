import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ViewCoursesButton } from "@/components/buttons/ViewCoursesButton";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 25,
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

const CTA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();


  return (
    <section className="relative py-28 px-6 bg-[#F7F9FC] overflow-hidden">

      {/* ================= SUBTLE BACKGROUND ================= */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-140px] right-[-100px] w-[420px] h-[420px] bg-red-500/10 blur-[140px] rounded-full" />
      </div>

      {/* ================= CONTENT ================= */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative max-w-5xl mx-auto text-center"
      >

        {/* BADGE */}
        <motion.div
          variants={item}
          className="
            inline-flex
            items-center
            gap-2
            mb-6
            px-4 py-2
            rounded-full
            bg-white
            border border-gray-200
            text-blue-600
            text-sm
            shadow-sm
          "
        >
          Start Your Digital Journey Today
        </motion.div>

        {/* HEADING */}
        <motion.h2
          variants={item}
          className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight"
        >
          Ready to Build a{" "}
          <span className="text-blue-600">
            High-Income Skill?
          </span>
        </motion.h2>

        {/* SUBTEXT */}
        <motion.p
          variants={item}
          className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Join hundreds of students learning practical ICT skills that lead to freelancing,
          remote jobs, and business opportunities.
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-5"
        >

          {/* PRIMARY CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/register")}
            className="
              px-10 py-3
              rounded-xl
              bg-blue-600
              text-white
              font-medium
              shadow-md
              hover:shadow-lg
              transition
            "
          >
            Enroll Now
          </motion.button>

          {/* SECONDARY CTA */}
          <div className="transition-transform duration-300 hover:-translate-y-1">
            <ViewCoursesButton
              className="
                px-10 py-3
                rounded-xl
                bg-white
                border border-gray-200
                text-gray-700
                shadow-sm
                hover:shadow-md
                transition
              "
            />
          </div>

        </motion.div>

        {/* TRUST LINE */}
        <motion.p
          variants={item}
          className="mt-10 text-sm text-gray-500"
        >
          No experience required • Beginner friendly • Certificate included
        </motion.p>

      </motion.div>
    </section>
  );
};

export default CTA;