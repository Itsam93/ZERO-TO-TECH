// 📄 Location: views/CMSAdmin.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";
import { Layout, Megaphone, MessageSquare, Edit3, Trash2, Save, Plus, X } from "lucide-react";

const emptyHero = {
  title: "", description: "", badge: "", highlightText: "", primaryCTA: "", secondaryCTA: "", image: "",
};

const CMSAdmin = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [heroes, setHeroes] = useState([]);
  const [hero, setHero] = useState(emptyHero);
  const [editingId, setEditingId] = useState(null);
  const [cta, setCTA] = useState({ title: "", text: "" });
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: "", role: "", message: "" });

  const fetchCMS = async () => {
    try {
      const [h, c, t] = await Promise.all([
        API.get("/cms/hero"), API.get("/cms/cta"), API.get("/testimonials")
      ]);
      setHeroes(h.data.data || []);
      setCTA(c.data.data || {});
      setTestimonials(t.data.data || []);
    } catch (err) { console.error("FETCH CMS ERROR:", err); }
  };

  useEffect(() => { fetchCMS(); }, []);

  /* ================= HERO ACTIONS (UNCHANGED) ================= */
  const resetHeroForm = () => { setHero(emptyHero); setEditingId(null); };
  const saveHero = async () => {
    if (!hero.title || !hero.description) return alert("Title and Description are required");
    try {
      if (editingId) await API.put(`/cms/hero/${editingId}`, hero);
      else await API.post("/cms/hero", hero);
      resetHeroForm(); fetchCMS();
    } catch (err) { alert(err.response?.data?.message || "Failed to save"); }
  };
  const deleteHero = async (id) => { if (window.confirm("Delete?")) { await API.delete(`/cms/hero/${id}`); fetchCMS(); } };

  /* ================= CTA & TESTIMONIALS (UNCHANGED) ================= */
  const saveCTA = async () => { await API.put("/cms/cta", cta); fetchCMS(); };
  const addTestimonial = async () => { await API.post("/testimonials", newTestimonial); setNewTestimonial({ name: "", role: "", message: "" }); fetchCMS(); };
  const deleteTestimonial = async (id) => { if (window.confirm("Delete?")) { await API.delete(`/testimonials/${id}`); fetchCMS(); } };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">CMS Management</h1>

      {/* TABS */}
      <div className="flex gap-4 border-b border-slate-200">
        {["hero", "cta", "testimonials"].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 px-2 font-medium border-b-2 transition ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* HERO TAB */}
      {activeTab === "hero" && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="font-bold text-lg">Manage Heroes</h2>
            {heroes.map((h) => (
              <div key={h._id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
                <div><p className="font-semibold">{h.title}</p><p className="text-xs text-gray-500">{h.description}</p></div>
                <div className="flex gap-2">
                  <button onClick={() => { setHero(h); setEditingId(h._id); }} className="text-blue-600"><Edit3 size={18}/></button>
                  <button onClick={() => deleteHero(h._id)} className="text-red-500"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-3">
            <h2 className="font-bold text-lg">{editingId ? "Edit" : "Create"} Hero</h2>
            {Object.keys(emptyHero).map((key) => (
              <input key={key} placeholder={key} value={hero[key]} onChange={(e) => setHero({...hero, [key]: e.target.value})} className="w-full border px-4 py-2 rounded-lg" />
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={saveHero} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">Save Hero</button>
              {editingId && <button onClick={resetHeroForm} className="bg-gray-200 px-6 py-2 rounded-lg font-medium">Cancel</button>}
            </div>
          </div>
        </div>
      )}

      {/* CTA TAB */}
      {activeTab === "cta" && (
        <div className="bg-white p-8 rounded-xl shadow-sm border max-w-xl space-y-4">
          <h2 className="font-bold text-lg">CTA Section</h2>
          <input value={cta.title} onChange={(e) => setCTA({...cta, title: e.target.value})} className="w-full border px-4 py-2 rounded-lg" placeholder="Title" />
          <textarea value={cta.text} onChange={(e) => setCTA({...cta, text: e.target.value})} className="w-full border px-4 py-2 rounded-lg h-24" placeholder="Text" />
          <button onClick={saveCTA} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"><Save size={18}/> Save CTA</button>
        </div>
      )}

      {/* TESTIMONIALS TAB */}
      {activeTab === "testimonials" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border grid md:grid-cols-3 gap-3">
            <input placeholder="Name" className="border px-4 py-2 rounded-lg" value={newTestimonial.name} onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})} />
            <input placeholder="Role" className="border px-4 py-2 rounded-lg" value={newTestimonial.role} onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})} />
            <input placeholder="Message" className="border px-4 py-2 rounded-lg" value={newTestimonial.message} onChange={(e) => setNewTestimonial({...newTestimonial, message: e.target.value})} />
            <button onClick={addTestimonial} className="md:col-span-3 bg-green-600 text-white py-2 rounded-lg font-medium flex justify-center items-center gap-2"><Plus size={18}/> Add Testimonial</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div key={t._id} className="p-4 bg-white border rounded-xl flex justify-between items-start">
                <div><p className="font-semibold">{t.name}</p><p className="text-sm text-gray-500 italic">"{t.message}"</p></div>
                <button onClick={() => deleteTestimonial(t._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSAdmin;