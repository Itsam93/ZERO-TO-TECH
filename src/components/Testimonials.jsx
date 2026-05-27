import { useEffect, useState, useCallback } from "react";
import PUBLIC_API from "@/services/publicApi";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

/* ================= NORMALIZER ================= */
const normalizeTestimonials = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.testimonials)) return data.testimonials;
  return [];
};

/* ================= ANIMATION ================= */
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

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH ================= */
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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <section className="py-28 px-6 bg-[#F7F9FC] text-center text-gray-500">
        Loading testimonials...
      </section>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <section className="py-28 px-6 bg-[#F7F9FC] text-center">
        <p className="text-red-600 mb-4">{error}</p>

        <button
          onClick={fetchTestimonials}
          className="
            px-6 py-2
            rounded-full
            bg-blue-600
            text-white
            hover:bg-blue-700
            transition
          "
        >
          Retry
        </button>
      </section>
    );
  }

  const safeTestimonials = Array.isArray(testimonials)
    ? testimonials
    : [];

  return (
    <section className="py-28 px-6 bg-[#F7F9FC]">

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
          What Our{" "}
          <span className="text-blue-600">
            Students Say
          </span>
        </h2>

        <p className="mt-4 text-gray-600">
          Real feedback from students who transformed their digital skills.
        </p>
      </motion.div>

      {/* ================= GRID ================= */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >

        {safeTestimonials.length > 0 ? (
          safeTestimonials.map((t) => (
            <motion.div
              key={t?._id || t?.id}
              variants={card}
              className="
                relative
                bg-white
                p-8
                rounded-2xl
                border border-gray-100
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
                hover:border-blue-100
              "
            >

              {/* ACCENT TOP LINE */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-600/10" />

              {/* STARS */}
              <div className="flex gap-1 text-blue-600 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              {/* MESSAGE */}
              <p className="text-gray-600 italic leading-relaxed">
                "{t?.message || "No message provided"}"
              </p>

              {/* DIVIDER */}
              <div className="my-6 h-px bg-gray-100" />

              {/* USER */}
              <h4 className="font-semibold text-gray-900">
                {t?.name || "Anonymous"}
              </h4>

              <p className="text-sm text-gray-500">
                {t?.role || "Student"}
              </p>

            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No testimonials available.
          </p>
        )}

      </motion.div>

    </section>
  );
};

export default Testimonials;