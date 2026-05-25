import { useEffect, useRef, useState } from "react";

import Hero from "@/components/Hero";
import Courses from "@/components/Courses";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

import heroImage from "@/assets/hero.png";

/* ================= INTERSECTION SECTION WRAPPER ================= */
const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return [ref, inView];
};

const Section = ({ children, threshold = 0.2 }) => {
  const [ref, inView] = useInView(threshold);

  return (
    <div
      ref={ref}
      className="
        transition-all
        duration-700
        ease-out
        will-change-transform
      "
      style={{
        opacity: inView ? 1 : 0.35,
        transform: inView ? "translateY(0px)" : "translateY(50px)",
      }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  return (
    <main className="relative overflow-hidden">

      {/* ================= FIXED BACKGROUND LAYER ================= */}
      <div className="fixed inset-0 -z-10">
        <img
          src={heroImage}
          alt="Background"
          className="
            w-full
            h-full
            object-cover
            object-center
            scale-[1.08]
          "
        />

        {/* DARK OVERLAY FOR READABILITY */}
        <div className="absolute inset-0 bg-black/60" />

        {/* SOFT VIGNETTE FOR DEPTH */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div className="relative z-10">

        {/* HERO (now text-only overlay on background) */}
        <Hero />

        {/* SECTIONS FLOAT OVER SAME BACKGROUND */}
        <section className="mt-[-60px]">
          <Section threshold={0.25}>
            <Courses />
          </Section>
        </section>

        <section>
          <Section threshold={0.25}>
            <Testimonials />
          </Section>
        </section>

        <section>
          <Section threshold={0.3}>
            <CTA />
          </Section>
        </section>

      </div>
    </main>
  );
};

export default Home;