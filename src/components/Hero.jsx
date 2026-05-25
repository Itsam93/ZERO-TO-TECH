import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { useAuth } from "@/auth/AuthContext";
import PUBLIC_API from "@/services/publicApi";

import heroImage from "@/assets/hero.png";

const defaultHero = {
  title: "Build Skills That Create Income Online",
  description:
    "Learn practical digital skills for freelancing, remote work, content creation, and modern online business.",
  badge: "Digital Skills • Remote Work • Creator Economy",
  image: heroImage,
};

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hero, setHero] = useState(defaultHero);

  const { scrollY } = useScroll();

  // Scroll-driven effects (cinematic motion)
  const imageScale = useTransform(scrollY, [0, 400], [1.05, 1.15]);
  const textY = useTransform(scrollY, [0, 400], [0, -60]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    let mounted = true;

    const fetchHero = async () => {
      try {
        const res = await PUBLIC_API.get("/cms/hero");
        const data = res?.data?.data || [];

        if (mounted && data.length > 0) {
          setHero({ ...defaultHero, ...data[0] });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchHero();

    return () => {
      mounted = false;
    };
  }, []);

  /* ================= CTA ACTIONS ================= */

  const handleStartLearning = () => {
    navigate("/register");
  };

  const handleViewCourses = () => {
    navigate("/courses");
  };

  return (
    <section className="relative min-h-[120vh] overflow-hidden bg-black">

      {/* ================= BACKGROUND ================= */}
      <motion.div
        style={{ scale: imageScale }}
        className="absolute inset-0 z-0"
      >
        <img
          src={hero.image || heroImage}
          alt="Hero"
          className="w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
      </motion.div>

      {/* ================= CONTENT ================= */}
      <motion.div
        style={{ opacity, y: textY }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-40"
      >

        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-white/10
            text-white
            text-sm
            backdrop-blur-md
            border
            border-white/20
          "
        >
          <Sparkles size={14} />
          {hero.badge}
        </motion.div>

        {/* ================= MASKED HERO TEXT ================= */}
        <div className="relative mt-10 w-full max-w-6xl">

          <h1
            className="
              text-[3.5rem]
              md:text-[6rem]
              lg:text-[8rem]
              font-black
              tracking-[-0.06em]
              leading-[0.95]
              text-transparent
              bg-clip-text
              bg-cover
              bg-center
              mix-blend-screen
            "
            style={{
              backgroundImage: `url(${hero.image || heroImage})`,
            }}
          >
            Build Skills
            <span className="block">That Create Income</span>
            Online
          </h1>

          {/* FALLBACK OVERLAY TEXT */}
          <h1
            className="
              absolute
              inset-0
              text-[3.5rem]
              md:text-[6rem]
              lg:text-[8rem]
              font-black
              tracking-[-0.06em]
              leading-[0.95]
              text-white/90
              pointer-events-none
            "
          >
            Build Skills
            <span className="block text-[var(--color-primary)]">
              That Create Income
            </span>
            Online
          </h1>

        </div>

        {/* DESCRIPTION */}
        <p className="mt-10 text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
          {hero.description}
        </p>

        {/* ================= CTA ================= */}
        <div className="mt-10 flex items-center gap-4 flex-wrap justify-center">

          <button
            onClick={handleStartLearning}
            className="
              px-8
              py-4
              rounded-full
              bg-[var(--color-primary)]
              text-white
              font-semibold
              shadow-xl
              hover:scale-[1.02]
              active:scale-[0.98]
              transition
              flex
              items-center
              gap-2
            "
          >
            Start Learning
            <ArrowUpRight size={18} />
          </button>

          <button
            onClick={handleViewCourses}
            className="
              px-6
              py-4
              rounded-full
              bg-white/10
              text-white
              border
              border-white/20
              backdrop-blur-md
              hover:bg-white/20
              transition
            "
          >
            Explore Courses
          </button>

        </div>

      </motion.div>
    </section>
  );
};

export default Hero;