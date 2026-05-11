import { useEffect, useState, useCallback } from "react";
import PUBLIC_API from "@/services/publicApi";
import { Star } from "lucide-react";

/* ================= SAFE NORMALIZER ================= */
const normalizeTestimonials = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.testimonials)) return data.testimonials;

  return [];
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
      <section className="py-24 px-6 text-center text-gray-500">
        Loading testimonials...
      </section>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <section className="py-24 px-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>

        <button
          onClick={fetchTestimonials}
          className="px-6 py-2 bg-black text-white rounded-lg"
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
    <section className="py-24 px-6 bg-gray-50">

      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-semibold">
          What Our{" "}
          <span className="text-[var(--color-primary)]">
            Students Say
          </span>
        </h2>

        <p className="mt-4 text-gray-600">
          Real feedback from students who transformed their digital skills.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {safeTestimonials.length > 0 ? (
          safeTestimonials.map((t) => (
            <div
              key={t?._id || t?.id}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 
              hover:shadow-xl hover:-translate-y-2 transition"
            >

              {/* STARS */}
              <div className="flex gap-1 text-[var(--color-secondary)] mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              {/* MESSAGE */}
              <p className="text-gray-600 italic">
                "{t?.message || "No message provided"}"
              </p>

              <div className="my-6 h-px bg-gray-100" />

              {/* USER */}
              <h4 className="font-semibold">
                {t?.name || "Anonymous"}
              </h4>

              <p className="text-sm text-gray-500">
                {t?.role || "Student"}
              </p>

            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No testimonials available.
          </p>
        )}

      </div>
    </section>
  );
};

export default Testimonials;