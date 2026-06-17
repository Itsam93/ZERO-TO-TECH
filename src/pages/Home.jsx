import { motion } from "framer-motion";

import Hero from "@/components/Hero";
import Courses from "@/components/Courses";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

import heroImage from "@/assets/hero.png";

const Home = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        overflow-hidden
        bg-black
      "
    >

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.img
          src={heroImage}
          alt="Background"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1.06 }}
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            w-full
            h-full
            object-cover
            object-center
            will-change-transform
          "
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/65" />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-black/30
            via-black/70
            to-black
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-40
            bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_45%)]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.03]
            mix-blend-soft-light
            bg-[url('https://grainy-gradients.vercel.app/noise.svg')]
          "
        />
      </div>

      <div className="relative z-10">

        {/* HERO */}
        <Hero />

        {/* COURSES */}
        <section className="relative mt-[-80px]">
          <Courses />
        </section>

        {/* TESTIMONIALS */}
        <section className="relative">
          <Testimonials />
        </section>

        {/* CTA */}
        <section className="relative">
          <CTA />
        </section>

      </div>

    </motion.main>
  );
};

export default Home;