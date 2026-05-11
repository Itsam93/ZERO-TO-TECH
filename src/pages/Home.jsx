import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import Courses from "@/components/Courses";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
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
        transition-all duration-700 ease-out
        will-change-transform
      "
      style={{
        opacity: inView ? 1 : 0.4,
        transform: inView ? "translateY(0px)" : "translateY(40px)",
      }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  return (
    <main className="pt-20 overflow-x-hidden">

      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= COURSES ================= */}
      <section className="mt-[-40px]">
        <Section threshold={0.25}>
          <Courses />
        </Section>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section>
        <Section threshold={0.25}>
          <Testimonials />
        </Section>
      </section>

      {/* ================= CTA ================= */}
      <section>
        <Section threshold={0.3}>
          <CTA />
        </Section>
      </section>

    </main>
  );
};

export default Home;