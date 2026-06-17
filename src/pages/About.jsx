import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const About = () => {
  const location = useLocation();

  return (
    <motion.main
      key={location.pathname}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-24"
    >

      <section className="px-6 py-20 bg-gray-50">
        <motion.div
          variants={sectionVariant}
          className="max-w-5xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-[var(--font-heading)] font-semibold">
            About{" "}
            <span className="text-[var(--color-primary)]">
              Zero-to-tech-africa
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            We are dedicated to equipping individuals with practical digital skills
            that are relevant in today’s fast-changing technology landscape.
          </p>
        </motion.div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

          <motion.div
            variants={sectionVariant}
            className="p-8 rounded-2xl bg-white shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-4 text-[var(--color-primary)]">
              Our Mission
            </h2>

            <p className="text-gray-600">
              To provide high-quality ICT training that equips students with
              practical, income-generating digital skills.
            </p>
          </motion.div>

          <motion.div
            variants={sectionVariant}
            className="p-8 rounded-2xl bg-white shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-4 text-[var(--color-primary)]">
              Our Vision
            </h2>

            <p className="text-gray-600">
              To become a leading ICT training hub known for excellence,
              innovation, and producing highly skilled digital professionals.
            </p>
          </motion.div>

        </div>
      </section>

      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">

          <motion.h2
            variants={sectionVariant}
            className="text-3xl md:text-4xl font-semibold mb-12"
          >
            What We{" "}
            <span className="text-[var(--color-primary)]">
              Offer
            </span>
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">

            {[
              {
                title: "Practical Training",
                desc: "Hands-on learning approach focused on real-world applications.",
              },
              {
                title: "Expert Instructors",
                desc: "Learn from experienced professionals in the tech industry.",
              },
              {
                title: "Certification",
                desc: "Get recognized certificates after successful completion.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={sectionVariant}
                className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold text-lg mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <motion.div variants={sectionVariant}>

          <h2 className="text-3xl md:text-4xl font-semibold">
            Ready to Start Your Journey?
          </h2>

          <p className="mt-4 text-gray-600">
            Join our ICT training programs and build skills that matter.
          </p>

          <button
            onClick={() => (window.location.href = "/courses")}
            className="
              mt-8
              bg-[var(--color-secondary)]
              text-white
              px-8 py-3
              rounded-full
              hover:opacity-90
              transition
            "
          >
            View Courses
          </button>

        </motion.div>
      </section>

    </motion.main>
  );
};

export default About;