import { useEffect, useState, useCallback } from "react";
import PUBLIC_API from "@/services/publicApi";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const normalizeTestimonials = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.testimonials)) return data.testimonials;
  return [];
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const card = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Testimonials = ({ fallback }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await PUBLIC_API.get("/testimonials");
      const normalized = normalizeTestimonials(res?.data);

      setTestimonials(normalized);
    } catch (err) {
      console.error("Testimonials fetch error:", err);
      setError("Failed to load testimonials");
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  if (loading) {
    return fallback ? (
      fallback
    ) : (
      <section className="py-32 px-4 sm:px-6 lg:px-8 text-center text-slate-400 bg-transparent animate-pulse">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-8 w-64 bg-white/5 rounded-lg mx-auto" />
          <div className="h-4 w-80 bg-white/5 rounded-md mx-auto" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-transparent text-center">
        <p className="text-red-400 font-medium mb-4">{error}</p>
        <button
          onClick={fetchTestimonials}
          className="
            px-6 py-2.5
            rounded-xl
            bg-red-600/20
            border border-red-500/30
            text-red-200
            hover:bg-red-600/30
            transition-all duration-200
          "
        >
          Retry Loading
        </button>
      </section>
    );
  }

  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];

  return (
    <section id="testimonials" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-950 text-white relative z-10 overflow-hidden">
      
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Soft, blurred branded ambiance */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-[var(--color-secondary)]/10 blur-3xl" />
        {/* Top-down crisp radial light flare */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
          What Our <span className="text-[var(--color-primary)]">Students Say</span>
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          Real feedback from independent professionals who scaled their target skillsets.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {safeTestimonials.length > 0 ? (
          safeTestimonials.map((t) => (
            <motion.div
              key={t?._id || t?.id}
              variants={card}
              className="
                relative
                bg-white/[0.005]
                border border-white/5
                backdrop-blur-md
                p-8
                rounded-2xl
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:bg-white/[0.03]
                hover:border-white/10
                hover:shadow-2xl hover:shadow-[var(--color-primary)]/5
              "
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />

              {/* RATING STARS */}
              <div className="flex gap-1 text-[var(--color-primary)]/90 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>

              <p className="text-slate-200 italic text-sm sm:text-base leading-relaxed min-h-[80px]">
                "{t?.message || "No message provided"}"
              </p>

              <div className="my-6 h-px bg-white/5" />

              <div>
                <h4 className="font-bold text-white text-base">
                  {t?.name || "Anonymous"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {t?.role || "Student"}
                </p>
              </div>

            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-slate-500 border border-dashed border-white/5 rounded-2xl py-12">
            No testimonials verified yet.
          </p>
        )}
      </motion.div>

    </section>
  );
};

export default Testimonials;