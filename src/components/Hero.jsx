import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
} from "framer-motion";

import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { useAuth } from "@/auth/AuthContext";
import PUBLIC_API from "@/services/publicApi";
import heroImage from "@/assets/hero.png";

/* ================= DEFAULT ================= */
const defaultHero = {
  title: "Build Skills That Create Income Online",
  description:
    "Learn practical digital skills for freelancing, remote work, content creation, and modern online business.",
  badge: "Digital Skills • Remote Work • Creator Economy",
  image: heroImage,
};

/* ================= SPLIT TEXT ================= */
const SplitText = ({ text }) => {
  return (
    <span>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.7,
            delay: i * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.35em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hero, setHero] = useState(defaultHero);

  const { scrollY } = useScroll();

  /* ================= BACKGROUND ================= */
  const bgY = useSpring(useTransform(scrollY, [0, 800], [0, 100]), {
    stiffness: 60,
    damping: 20,
  });

  const bgScale = useTransform(scrollY, [0, 600], [1.1, 1.22]);

  /* ================= TEXT (FADE EARLY) ================= */
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textY = useSpring(useTransform(scrollY, [0, 500], [0, -90]), {
    stiffness: 80,
    damping: 25,
  });

  const blur = useTransform(scrollY, [0, 400], [0, 6]);
  const blurFilter = useMotionTemplate`blur(${blur}px)`;

  /* ================= CTA (IMPORTANT FIX) ================= */
  // CTA stays visible MUCH longer
  const ctaOpacity = useTransform(scrollY, [0, 650], [1, 1]); // stays visible
  const ctaY = useTransform(scrollY, [0, 650], [0, 0]); // NO movement
  const ctaScale = useTransform(scrollY, [0, 650], [1, 1]); // NO shrink

  /* ================= DATA ================= */
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
    return () => (mounted = false);
  }, []);

  return (
    <section className="relative min-h-[120vh] flex items-center justify-center overflow-hidden bg-[#0B0F14]">

      {/* ================= BACKGROUND ================= */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0"
      >
        <img
          src={hero.image}
          className="w-full h-full object-cover"
          alt="hero"
        />

        <div className="absolute inset-0 bg-[#0B0F14]/70" />
      </motion.div>

      {/* ================= CONTENT ================= */}
      <motion.div
        style={{
          y: textY,
          opacity: textOpacity,
          filter: blurFilter,
        }}
        className="relative z-10 text-center px-6 max-w-6xl"
      >

        {/* BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/90">
          <Sparkles size={14} className="text-red-500" />
          {hero.badge}
        </div>

        {/* TEXT */}
        <div className="mt-10 font-black leading-[0.9] tracking-[-0.06em] text-white">

          <h1 className="text-[3.5rem] md:text-[6rem] lg:text-[8rem]">
            <SplitText text="Build Skills" />
          </h1>

          <h1 className="text-[3.5rem] md:text-[6rem] lg:text-[8rem] text-blue-500">
            <SplitText text="That Create Income" />
          </h1>

          <h1 className="text-[3.5rem] md:text-[6rem] lg:text-[8rem]">
            <SplitText text="Online" />
          </h1>

        </div>

        {/* DESCRIPTION */}
        <p className="mt-10 text-white/70 text-lg max-w-2xl mx-auto">
          {hero.description}
        </p>
      </motion.div>

      {/* ================= CTA (FIXED LAYER — ALWAYS CLICKABLE) ================= */}
      <motion.div
        style={{
          opacity: ctaOpacity,
          y: ctaY,
          scale: ctaScale,
        }}
        className="absolute bottom-24 z-20 flex flex-wrap justify-center gap-4 px-6"
      >

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/register")}
          className="
            px-8 py-4
            rounded-full
            bg-blue-600
            text-white
            font-semibold
            shadow-lg shadow-blue-600/20
          "
        >
          Start Learning
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/courses")}
          className="
            px-6 py-4
            rounded-full
            bg-white/5
            border border-white/10
            text-white
            backdrop-blur-xl
            hover:bg-white/10
          "
        >
          Explore Courses
        </motion.button>

      </motion.div>

    </section>
  );
};

export default Hero;