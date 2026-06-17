import { useEffect, useState } from "react";
import API from "@/services/api";

const Checkout = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        setCourses(res.data.data || res.data || []);
      } catch (err) {
        console.error("FETCH COURSES ERROR:", err);
      }
    };

    fetchCourses();

    const savedEmail = localStorage.getItem("userEmail");

    if (savedEmail) {
      setForm((prev) => ({
        ...prev,
        email: savedEmail,
      }));
    }
  }, []);

  const selectedCourse = courses.find(
    (c) => c._id === selectedCourseId
  );

  const isFormValid =
    selectedCourseId &&
    selectedCourse &&
    form.fullName.trim() &&
    form.email.trim() &&
    form.phone.trim();

  const handlePay = async () => {
    try {
      if (!isFormValid) return;

      setLoading(true);

      const res = await API.post("/transactions/init", {
        email: form.email,
        productType: "course",
        productId: selectedCourse._id,
      });

      const url = res?.data?.data?.authorization_url;

      if (!url) {
        alert("Payment initialization failed");
        return;
      }

      localStorage.setItem("userEmail", form.email);

      window.location.href = url;

    } catch (err) {
      console.error("PAY ERROR:", err);

      alert(
        err?.response?.data?.message ||
          "Payment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-gray-500 mt-2">
          Complete your enrollment in a few steps
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* COURSE SELECT */}
          <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-100
                          hover:shadow-2xl transition transform hover:-translate-y-1">

            <div className="absolute -top-3 left-6 text-xs bg-green-600 text-white px-3 py-1 rounded-full shadow">
              Step 1
            </div>

            <h2 className="text-lg font-semibold mb-4">
              Choose Your Course
            </h2>

            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full p-3 rounded-xl border bg-gray-50 shadow-inner
                         focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a course</option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} — ₦{Number(course.price).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* USER FORM */}
          <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-100
                          hover:shadow-2xl transition transform hover:-translate-y-1">

            <div className="absolute -top-3 left-6 text-xs bg-blue-600 text-white px-3 py-1 rounded-full shadow">
              Step 2
            </div>

            <h2 className="text-lg font-semibold mb-4">
              Your Information
            </h2>

            <div className="space-y-4">

              <input
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="w-full p-3 rounded-xl border bg-gray-50 shadow-inner
                           focus:ring-2 focus:ring-green-500 outline-none"
              />

              <input
                placeholder="Email Address"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full p-3 rounded-xl border bg-gray-50 shadow-inner
                           focus:ring-2 focus:ring-green-500 outline-none"
              />

              <input
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full p-3 rounded-xl border bg-gray-50 shadow-inner
                           focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">

            <div className="relative bg-gradient-to-br from-white to-gray-50
                            rounded-2xl p-6 shadow-2xl border border-gray-100">

              <h3 className="text-lg font-semibold mb-4">
                Order Summary
              </h3>

              {selectedCourse ? (
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900">
                    {selectedCourse.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    {selectedCourse.description?.slice(0, 90)}...
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-500 text-sm">
                      Total
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      ₦{Number(selectedCourse.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Select a course to continue
                </p>
              )}

              {/* PAY BUTTON */}
              <button
                onClick={handlePay}
                disabled={!isFormValid || loading}
                className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition
                  ${
                    isFormValid && !loading
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                {loading ? "Processing..." : "Pay with Paystack"}
              </button>

              {!isFormValid && (
                <p className="text-xs text-center text-gray-500 mt-3">
                  Complete all steps to continue
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;