import { useEffect, useState, useRef } from "react";
import PUBLIC_API from "@/services/publicApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/auth/AuthContext";
import toast from "react-hot-toast";


import heroImage from "@/assets/hero.png";
import { ViewCoursesButton } from "@/components/buttons/ViewCoursesButton.jsx";
import { ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const { user } = useAuth();

  const [isInView, setIsInView] = useState(true);
  const [hero, setHero] = useState({
    title: "Learn High-Income Digital Skills That Matter",
    description:
      "Master Social Media Marketing, Web Development, Video Editing, and more. Build real-world skills and start earning.",
    badge: "Empowering Digital Skills",
    image: heroImage,
  });

  const [imageLoaded, setImageLoaded] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await PUBLIC_API.get("/cms/hero");
        const heroes = res.data.data || [];

        if (heroes.length > 0) {
          setHero(heroes[0]);
        }
      } catch (err) {
        console.error("Hero fetch error:", err);
      }
    };

    fetchHero();
  }, []);

  const handleEnroll = () => {
  const payload = {
    source: "hero",
  };

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    toast.error("Kindly register to proceed");
    return;
  }

  /* ================= LOGGED IN ================= */
  navigate("/checkout", {
    state: payload,
  });
};

  /* ================= VIEW DETECTION ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.35 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-6 pt-16 overflow-hidden"
    >

      {/* ================= BACKGROUND ================= */}
      <motion.div
        animate={{
          opacity: isInView ? 1 : 0.4,
          scale: isInView ? 1 : 1.05,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-white to-[var(--color-accent)]/10" />
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[var(--color-primary)]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[var(--color-secondary)]/20 blur-[120px] rounded-full" />
      </motion.div>

      {/* ================= CONTAINER ================= */}
      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">

        {/* ================= LEFT ================= */}
        <motion.div
          animate={{
            opacity: isInView ? 1 : 0,
            y: isInView ? 0 : 30,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium border border-[var(--color-primary)]/20">
            <Sparkles size={14} />
            {hero.badge}
          </div>

          {/* HEADLINE */}
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-gray-900">
            Unlock Skills That{" "}
            <span className="text-[var(--color-primary)]">
              Build Income
            </span>{" "}
            in the Digital Economy
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-6 text-lg text-gray-600 max-w-xl leading-relaxed">
            {hero.description}
          </p>

          {/* VALUE POINTS */}
          <div className="mt-6 space-y-3 text-sm text-gray-600">

            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--color-primary)]" />
              Beginner-friendly structured learning path
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--color-primary)]" />
              Industry-aligned practical projects
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--color-primary)]" />
              Skills built for freelancing & remote work
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex items-center gap-4 flex-wrap">

            <ViewCoursesButton className="px-8 py-3" />

            <button
              onClick={handleEnroll}
              className="
                px-8 py-3
                rounded-full
                bg-[var(--color-secondary)]
                text-white
                font-medium
                hover:opacity-90
                transition
                flex items-center gap-2
                shadow-lg
              "
            >
              Enroll Now
              <ArrowUpRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* ================= RIGHT ================= */}
        <motion.div
          animate={{
            opacity: isInView ? 1 : 0,
            scale: isInView ? 1 : 0.95,
            y: isInView ? 0 : 20,
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative flex justify-center items-center min-h-[520px]"
        >

          {/* SOFT BACK PLATE */}
          <div className="absolute w-[90%] h-[70%] bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-xl overflow-hidden">

            {/* ================= BLUE CORNER FLOW BORDER ================= */}
            
            {/* TOP LEFT CORNER FLOW */}
            <span className="absolute top-0 left-0 w-20 h-[2px] bg-gradient-to-r from-blue-500 to-transparent" />
            <span className="absolute top-0 left-0 w-[10px] h-20 bg-gradient-to-b from-blue-500 to-transparent" />

            {/* BOTTOM RIGHT CORNER FLOW */}
            <span className="absolute bottom-0 right-0 w-20 h-[2px] bg-gradient-to-l from-blue-500 to-transparent" />
            <span className="absolute bottom-0 right-0 w-[10px] h-20 bg-gradient-to-t from-blue-500 to-transparent" />

          </div>

          {/* BRAND GLOW CORE */}
          <motion.div
            animate={{
              opacity: isInView ? 1 : 0.3,
              scale: isInView ? 1 : 1.1,
            }}
            transition={{ duration: 0.8 }}
            className="absolute w-full h-full bg-[var(--color-primary)]/15 blur-3xl rounded-full"
          />

          {/* IMAGE */}
          <div className="relative z-10">

            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
            )}

            <motion.img
              src={hero.image}
              alt="Hero"
              onLoad={() => setImageLoaded(true)}
              animate={{
                opacity: imageLoaded ? 1 : 0,
                scale: isInView ? 1 : 0.97,
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="
                h-[115%]
                object-contain
                drop-shadow-2xl
                transition-transform
                duration-300
                hover:scale-105
              "
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;