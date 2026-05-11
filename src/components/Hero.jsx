import { useEffect, useState } from "react";
import PUBLIC_API from "@/services/publicApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/auth/AuthContext";
import toast from "react-hot-toast";

import heroImage from "@/assets/hero.png";

import { ViewCoursesButton } from "@/components/buttons/ViewCoursesButton.jsx";

import {
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hero, setHero] = useState({
    title: "Learn High-Income Digital Skills That Matter",
    description:
      "Master Social Media Marketing, Web Development, Video Editing, and more. Build real-world skills and start earning.",
    badge: "Empowering Digital Skills",
    image: heroImage,
  });

  const [imageLoaded, setImageLoaded] = useState(false);

  /* ================= FETCH HERO ================= */
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await PUBLIC_API.get("/cms/hero");

        const heroes = res?.data?.data || [];

        if (heroes.length > 0) {
          setHero(heroes[0]);
        }
      } catch (err) {
        console.error("Hero fetch error:", err);
      }
    };

    fetchHero();
  }, []);

  /* ================= ENROLL ================= */
  const handleEnroll = () => {
    const payload = {
      source: "hero",
    };

    if (!user) {
      toast.error("Kindly register to proceed");
      return;
    }

    navigate("/checkout", {
      state: payload,
    });
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        px-6
        pt-24
        pb-16
        md:pt-32
        min-h-screen
        flex
        items-center
        bg-[#f5f7fa]
      "
    >
      {/* ================= LIGHTWEIGHT BACKGROUND ================= */}
      <div className="absolute inset-0 -z-10 bg-[#f5f7fa]" />

      {/* ================= SIMPLE DECORATIVE BLOBS ================= */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--color-primary)]/10 rounded-full blur-3xl -z-10" />

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[var(--color-secondary)]/10 rounded-full blur-3xl -z-10" />

      {/* ================= CONTAINER ================= */}
      <div
        className="
          relative
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          md:grid-cols-2
          gap-14
          items-center
          w-full
        "
      >
        {/* ================= IMAGE FIRST ON MOBILE ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="
            order-1
            md:order-2
            relative
            flex
            justify-center
            items-center
          "
        >
          {/* CARD CONTAINER */}
          <div
            className="
              relative
              w-full
              max-w-[520px]
              rounded-[32px]
              bg-white/70
              backdrop-blur-md
              border
              border-gray-200
              shadow-xl
              p-6
            "
          >
            {/* CORNER ACCENTS */}
            <span className="absolute top-0 left-0 w-20 h-[12px] bg-gradient-to-r from-blue-500 to-transparent rounded-full" />

            <span className="absolute top-0 left-0 w-[8px] h-20 bg-gradient-to-b from-blue-500 to-transparent rounded-full" />

            <span className="absolute bottom-0 right-0 w-20 h-[12px] bg-gradient-to-l from-blue-500 to-transparent rounded-full" />

            <span className="absolute bottom-0 right-0 w-[8px] h-20 bg-gradient-to-t from-blue-500 to-transparent rounded-full" />

            {/* IMAGE */}
            <div className="relative flex justify-center">
              {!imageLoaded && (
                <div
                  className="
                    absolute
                    inset-0
                    rounded-2xl
                    bg-gray-100
                    animate-pulse
                  "
                />
              )}

              <img
                src={hero.image}
                alt="Hero"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                className="
                  relative
                  z-10
                  w-full
                  max-w-[460px]
                  object-contain
                  drop-shadow-2xl
                  transition-opacity
                  duration-500
                  will-change-auto
                  select-none
                "
              />
            </div>
          </div>
        </motion.div>

        {/* ================= TEXT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="order-2 md:order-1"
        >
          {/* BADGE */}
          <div
            className="
              inline-flex
              items-center
              gap-2
              mb-6
              px-4
              py-2
              rounded-full
              bg-[var(--color-primary)]/10
              text-[var(--color-primary)]
              text-sm
              font-medium
              border
              border-[var(--color-primary)]/20
            "
          >
            <Sparkles size={14} />
            {hero.badge}
          </div>

          {/* HEADING */}
          <h1
            className="
              text-4xl
              md:text-6xl
              font-semibold
              tracking-tight
              leading-[1.05]
              text-gray-900
            "
          >
            Unlock Skills That{" "}
            <span className="text-[var(--color-primary)]">
              Build Income
            </span>{" "}
            in the Digital Economy
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              mt-6
              text-lg
              text-gray-600
              max-w-xl
              leading-relaxed
            "
          >
            {hero.description}
          </p>

          {/* VALUE POINTS */}
          <div className="mt-8 space-y-4 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={18}
                className="text-[var(--color-primary)] shrink-0"
              />

              <span>
                Beginner-friendly structured learning path
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck
                size={18}
                className="text-[var(--color-primary)] shrink-0"
              />

              <span>
                Industry-aligned practical projects
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck
                size={18}
                className="text-[var(--color-primary)] shrink-0"
              />

              <span>
                Skills built for freelancing & remote work
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ViewCoursesButton className="px-8 py-3" />

            <button
              onClick={handleEnroll}
              className="
                px-8
                py-3
                rounded-full
                bg-[var(--color-secondary)]
                text-white
                font-medium
                shadow-lg
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:opacity-95
                active:scale-[0.98]
                flex
                items-center
                gap-2
              "
            >
              Enroll Now
              <ArrowUpRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;