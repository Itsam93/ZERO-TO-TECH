import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { useAuth } from "@/auth/AuthContext";
import PUBLIC_API from "@/services/publicApi";
import heroImage from "@/assets/hero.webp";

const defaultHero = {
  title: "Build Skills That Create Income Online",
  description:
    "Learn practical digital skills for freelancing, remote work, content creation, and modern online business.",
  badge: "Digital Skills • Remote Work • Creator Economy",
  image: heroImage,
};

const SplitText = ({ text }) => {
  if (!text) return null;
  return (
    <span className="inline-flex flex-wrap justify-center text-center">
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.9,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1], 
          }}
          className="inline-block mr-[0.3em] pb-2"
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

  const bgY = useSpring(useTransform(scrollY, [0, 800], [0, 80]), {
    stiffness: 80,
    damping: 25,
  });
  const bgScale = useTransform(scrollY, [0, 800], [1, 1.12]);

  const contentY = useSpring(useTransform(scrollY, [0, 500], [0, -60]), {
    stiffness: 90,
    damping: 25,
  });
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

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
        console.error("Hero content failed to load from CMS:", err);
      }
    };

    fetchHero();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#05070a] px-4 sm:px-6 lg:px-8 py-32">
      
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0 select-none pointer-events-none"
      >
        <img
          src={hero.image}
          alt="Premium background workplace"
          className="h-full w-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[#05070a]/65 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070a]/90 via-[#05070a]/40 to-[#05070a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070a]/50 via-transparent to-[#05070a]/50" />
      </motion.div>

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-0 h-[500px] w-full max-w-[700px] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-xs sm:text-sm font-medium backdrop-blur-md shadow-2xl mb-8"
        >
          <Sparkles size={14} className="text-blue-400 animate-pulse" />
          <span className="tracking-wide text-slate-200">{hero.badge}</span>
        </motion.div>

        <h1 className="text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] font-black tracking-tight text-white leading-[1.05] max-w-4xl">
          <SplitText text={hero.title} />
        </h1>

        <p className="mt-8 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl font-normal leading-relaxed text-center drop-shadow-sm">
          {hero.description}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-colors duration-200"
          >
            Start Learning
            <ArrowUpRight size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, bg: "rgba(255, 255, 255, 0.06)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/courses")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.02] border border-white/10 text-white font-semibold backdrop-blur-xl hover:border-white/25 transition-all duration-200"
          >
            Explore Courses
          </motion.button>
        </div>

      </motion.div>
    </section>
  );
};

export default Hero;