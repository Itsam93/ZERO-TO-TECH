import { useState, useEffect } from "react";
import PUBLIC_API from "@/services/publicApi";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await PUBLIC_API.get("/courses");

        const data = res.data?.data || res.data || [];

        setCourses(data);
      } catch (err) {
        console.error("❌ Failed to fetch courses:", err);
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!form.course) {
      newErrors.course = "Please select a course";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message cannot be empty";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setSuccess(false);

    try {
      await PUBLIC_API.post("/contact", form);

      setSuccess(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        course: "",
        message: "",
      });
    } catch (err) {
      setErrors({
        api:
          err?.response?.data?.message ||
          err.message ||
          "Failed to send message. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <main className="pt-24 px-6 pb-20">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-semibold">
          Contact <span className="text-[var(--color-primary)]">Us</span>
        </h1>

        <p className="mt-4 text-gray-600">
          Have questions or ready to enroll? Fill out the form and we’ll get back to you.
        </p>
      </motion.div>

      {/* FORM */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
      >

        {/* ALERTS */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-sm"
            >
              ✅ Your message has been sent successfully!
            </motion.div>
          )}

          {errors.api && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm"
            >
              ❌ {errors.api}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="show"
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* NAME */}
          <motion.div variants={itemVariants}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </motion.div>

          {/* EMAIL */}
          <motion.div variants={itemVariants}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </motion.div>

          {/* PHONE */}
          <motion.div variants={itemVariants}>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </motion.div>

          {/* COURSE (FETCHED FROM BACKEND) */}
          <motion.div variants={itemVariants}>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="">
                {coursesLoading ? "Loading courses..." : "Select Course"}
              </option>

              {courses.map((course) => (
                <option key={course._id} value={course.title}>
                  {course.title}
                </option>
              ))}
            </select>

            {errors.course && <p className="text-red-500">{errors.course}</p>}
          </motion.div>

          {/* MESSAGE */}
          <motion.div variants={itemVariants}>
            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
            />
            {errors.message && <p className="text-red-500">{errors.message}</p>}
          </motion.div>

          {/* SUBMIT */}
          <motion.button
            variants={itemVariants}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-secondary)] text-white py-3 rounded-lg"
          >
            {loading ? "Sending..." : "Send Message"}
          </motion.button>

        </motion.form>
      </motion.div>

    </main>
  );
};

export default Contact;