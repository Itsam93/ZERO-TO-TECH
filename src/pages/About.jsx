import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Award, ShieldCheck, Terminal, GraduationCap } from "lucide-react";
import aboutImage from "@/assets/aboutImage.webp";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1],
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
      className="pt-24 bg-white text-slate-900 overflow-hidden"
    >
      {/* Hero Header Section */}
      <section className="px-6 py-24 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
        <motion.div
          variants={sectionVariant}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-xs font-bold tracking-widest text-[var(--color-primary)] uppercase bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full">
            Our Identity
          </span>
          <h1 className="text-4xl md:text-6xl font-[var(--font-heading)] font-black tracking-tight mt-6 text-slate-900">
            About{" "}
            <span className="text-[var(--color-primary)]">
              Zero-to-tech-africa
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We are dedicated to equipping individuals with practical digital skills
            that are relevant in today’s fast-changing technology landscape.
          </p>
        </motion.div>
      </section>

      {/* Corporate Pillars Section — Asymmetric Split Screen with Visual Integration */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Context Anchor Visual Box with Premium Asset */}
          <motion.div 
            variants={sectionVariant}
            className="lg:col-span-5 relative group"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-950/10 border border-slate-100 aspect-[4/5] bg-slate-100 relative">
              <img 
                src={aboutImage}
                alt="Tech professionals collaborating on high-end screens in a modern tech environment" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />
            </div>
            
            {/* Minimalist absolute-positioned design badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-xl shadow-xl border border-slate-100 hidden md:block max-w-[200px] z-10">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">Execution First</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">Real-world production environments over theoretical syntax.</p>
            </div>
          </motion.div>

          {/* Right Column: Editorial Value Stack */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              variants={sectionVariant}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/50 transition-colors duration-300 relative group"
            >
              <div className="absolute top-8 right-8 text-slate-200 group-hover:text-[var(--color-primary)]/20 transition-colors duration-300 font-mono font-bold text-4xl select-none">
                01
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--color-primary)] tracking-tight">
                Our Mission
              </h3>
              <p className="text-slate-600 text-base max-w-xl leading-relaxed">
                To provide high-quality ICT training that equips students with
                practical, income-generating digital skills.
              </p>
            </motion.div>

            <motion.div
              variants={sectionVariant}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/50 transition-colors duration-300 relative group"
            >
              <div className="absolute top-8 right-8 text-slate-200 group-hover:text-[var(--color-primary)]/20 transition-colors duration-300 font-mono font-bold text-4xl select-none">
                02
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--color-primary)] tracking-tight">
                Our Vision
              </h3>
              <p className="text-slate-600 text-base max-w-xl leading-relaxed">
                To become a leading ICT training hub known for excellence,
                innovation, and producing highly skilled digital professionals.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Core Ecosystem Offers Section with Premium Iconic Grid System */}
      <section className="px-6 py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              variants={sectionVariant}
              className="text-3xl md:text-4xl font-black tracking-tight text-slate-900"
            >
              What We{" "}
              <span className="text-[var(--color-primary)]">
                Offer
              </span>
            </motion.h2>
            <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">
              Our training structure is optimized for high-retention industry application.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Practical Training",
                desc: "Hands-on learning approach focused on real-world applications.",
                icon: Terminal,
              },
              {
                title: "Expert Instructors",
                desc: "Learn from experienced professionals in the tech industry.",
                icon: GraduationCap,
              },
              {
                title: "Certification",
                desc: "Get recognized certificates after successful completion.",
                icon: ShieldCheck,
              },
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={sectionVariant}
                  className="p-8 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300/80 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 text-slate-800">
                      <IconComponent size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 tracking-tight mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="px-6 py-28 text-center max-w-4xl mx-auto relative z-10">
        <motion.div variants={sectionVariant} className="space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] mb-2 animate-pulse">
            <Award size={26} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Ready to Start Your Journey?
          </h2>

          <p className="text-slate-600 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
            Join our premium ICT training programs and build execution skills that directly scale your value.
          </p>

          <div className="pt-4">
            <button
              onClick={() => (window.location.href = "/courses")}
              className="
                bg-[var(--color-secondary)]
                text-white
                px-10 py-4
                font-semibold
                text-sm
                rounded-xl
                hover:shadow-lg
                hover:shadow-[var(--color-secondary)]/20
                active:scale-[0.98]
                transition-all
                duration-200
                cursor-pointer
              "
            >
              View Courses
            </button>
          </div>
        </motion.div>
      </section>
    </motion.main>
  );
};

export default About;