import { useEffect, useState } from "react";
import API from "../../services/api";

const emptyHero = {
  title: "",
  description: "",
  badge: "",
  highlightText: "",
  primaryCTA: "",
  secondaryCTA: "",
  image: "",
};

const CMSAdmin = () => {
  /* ================= HERO STATE ================= */
  const [heroes, setHeroes] = useState([]);
  const [hero, setHero] = useState(emptyHero);
  const [editingId, setEditingId] = useState(null);

  /* ================= OTHER STATE ================= */
  const [cta, setCTA] = useState({ title: "", text: "" });
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    message: "",
  });

  /* ================= FETCH ================= */
  const fetchCMS = async () => {
    try {
      const heroRes = await API.get("/cms/hero");
      const ctaRes = await API.get("/cms/cta");
      const testRes = await API.get("/testimonials");

      setHeroes(heroRes.data.data || []);
      setCTA(ctaRes.data.data || {});
      setTestimonials(testRes.data.data || []);
    } catch (err) {
      console.error("FETCH CMS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchCMS();
  }, []);

  /* ================= HERO ACTIONS ================= */

  const resetHeroForm = () => {
    setHero(emptyHero);
    setEditingId(null);
  };

  const saveHero = async () => {
    try {
      if (!hero.title || !hero.description) {
        alert("Title and Description are required");
        return;
      }

      if (editingId) {
        await API.put(`/cms/hero/${editingId}`, hero);
        alert("Hero updated");
      } else {
        await API.post("/cms/hero", hero);
        alert("Hero created");
      }

      resetHeroForm();
      fetchCMS();
    } catch (err) {
      console.error("SAVE HERO ERROR:", err);
      alert(err.response?.data?.message || "Failed to save hero");
    }
  };

  const editHero = (h) => {
    setHero(h);
    setEditingId(h._id);
  };

  const deleteHero = async (id) => {
    try {
      if (!window.confirm("Delete this hero?")) return;
      await API.delete(`/cms/hero/${id}`);
      fetchCMS();
    } catch (err) {
      console.error("DELETE HERO ERROR:", err);
    }
  };

  /* ================= CTA ================= */
  const saveCTA = async () => {
    try {
      await API.put("/cms/cta", cta);
      alert("CTA updated");
      fetchCMS();
    } catch (err) {
      console.error("SAVE CTA ERROR:", err);
    }
  };

  /* ================= TESTIMONIALS ================= */
  const addTestimonial = async () => {
    try {
      await API.post("/testimonials", newTestimonial);
      setNewTestimonial({ name: "", role: "", message: "" });
      fetchCMS();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      if (!window.confirm("Delete testimonial?")) return;
      await API.delete(`/testimonials/${id}`);
      fetchCMS();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-semibold">CMS Manager</h1>

      {/* ================= HERO LIST ================= */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">All Heroes</h2>

        {heroes.length === 0 && <p>No heroes created yet.</p>}

        {heroes.map((h) => (
          <div
            key={h._id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{h.title}</p>
              <p className="text-sm text-gray-500">{h.description}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => editHero(h)}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => deleteHero(h._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= HERO FORM ================= */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Hero" : "Create Hero"}
        </h2>

        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Title"
          value={hero.title}
          onChange={(e) => setHero({ ...hero, title: e.target.value })}
        />

        <textarea
          className="w-full border px-4 py-2 rounded"
          placeholder="Description"
          value={hero.description}
          onChange={(e) =>
            setHero({ ...hero, description: e.target.value })
          }
        />

        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Badge"
          value={hero.badge}
          onChange={(e) => setHero({ ...hero, badge: e.target.value })}
        />

        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Highlight Text"
          value={hero.highlightText}
          onChange={(e) =>
            setHero({ ...hero, highlightText: e.target.value })
          }
        />

        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Primary CTA"
          value={hero.primaryCTA}
          onChange={(e) =>
            setHero({ ...hero, primaryCTA: e.target.value })
          }
        />

        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Secondary CTA"
          value={hero.secondaryCTA}
          onChange={(e) =>
            setHero({ ...hero, secondaryCTA: e.target.value })
          }
        />

        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Image URL"
          value={hero.image}
          onChange={(e) => setHero({ ...hero, image: e.target.value })}
        />

        <div className="flex gap-3">
          <button
            onClick={saveHero}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            {editingId ? "Update Hero" : "Create Hero"}
          </button>

          {editingId && (
            <button
              onClick={resetHeroForm}
              className="bg-gray-400 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">CTA Section</h2>

        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Title"
          value={cta.title}
          onChange={(e) => setCTA({ ...cta, title: e.target.value })}
        />

        <textarea
          className="w-full border px-4 py-2 rounded"
          placeholder="Text"
          value={cta.text}
          onChange={(e) => setCTA({ ...cta, text: e.target.value })}
        />

        <button
          onClick={saveCTA}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save CTA
        </button>
      </div>

      {/* ================= TESTIMONIALS ================= */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Testimonials</h2>

        <div className="grid md:grid-cols-3 gap-3">
          <input
            placeholder="Name"
            className="border px-3 py-2 rounded"
            value={newTestimonial.name}
            onChange={(e) =>
              setNewTestimonial({
                ...newTestimonial,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Role"
            className="border px-3 py-2 rounded"
            value={newTestimonial.role}
            onChange={(e) =>
              setNewTestimonial({
                ...newTestimonial,
                role: e.target.value,
              })
            }
          />

          <input
            placeholder="Message"
            className="border px-3 py-2 rounded"
            value={newTestimonial.message}
            onChange={(e) =>
              setNewTestimonial({
                ...newTestimonial,
                message: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={addTestimonial}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Add Testimonial
        </button>

        <div className="space-y-3">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="p-3 border rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-gray-500">{t.message}</p>
              </div>

              <button
                onClick={() => deleteTestimonial(t._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMSAdmin;