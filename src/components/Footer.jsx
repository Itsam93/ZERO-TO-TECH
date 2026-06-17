import { useState } from "react";
import { Link } from "react-router-dom";
import PUBLIC_API from "@/services/publicApi";
import Logo from "../assets/Logo1.png";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaGlobe,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await PUBLIC_API.post("/contact/subscribe", { email });

      if (response.data?.success || response.status === 200) {
        setStatus("success");
        setEmail("");
      } else {
        throw new Error("Subscription entry rejected.");
      }
    } catch (error) {
      console.error("NEWSLETTER SUBSCRIPTION ERROR LOG:", error);
      setStatus("error");
      
      if (error.response?.status === 400) {
        setErrorMessage("This email is already subscribed or invalid. Please check and try again.");
      } else {
        setErrorMessage("Unable to complete subscription at this moment. Please check your connection and try again.");
      }
    }
  };

  return (
    <footer className="relative bg-gray-950 text-white pt-20 pb-10 px-6 overflow-hidden">
      
      {/* AMBIENT BACKGROUND ACCENTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-[var(--color-secondary)]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        <div className="pb-12 mb-16 border-b border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">
              Subscribe to our Newsletter
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stay updated with the newest tech modules, free learning resources, and upcoming community portal events.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className={`relative flex items-center bg-white/5 border rounded-xl transition-all duration-200 p-1 
                ${status === "error" ? "border-red-500/50 focus-within:ring-red-500/20" : "border-white/10 focus-within:border-blue-500/50 focus-within:ring-blue-500/20"} 
                focus-within:ring-2`}
              >
                <input
                  type="email"
                  required
                  disabled={status === "loading"}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  className="w-full bg-transparent outline-none border-none text-white text-sm px-4 py-2.5 placeholder-gray-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200 shrink-0 disabled:bg-blue-800 disabled:text-gray-400 flex items-center justify-center min-w-[70px]"
                >
                  {status === "loading" ? (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>

              {status === "success" && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-400 font-medium tracking-wide animate-fadeIn">
                  <p className="flex items-center gap-2">
                    <span>✓</span> Successfully Subscribed! Welcome to our tech community newsletter.
                  </p>
                </div>
              )}

              {status === "error" && (
                <p className="text-xs text-red-400 font-medium tracking-tight px-1 animate-fadeIn">
                  ⚠️ {errorMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-4">

          <div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <img
                  src={Logo}
                  alt="Zero-to-tech-africa logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h2 className="text-lg font-semibold leading-tight tracking-tight">
                Zero-to-tech-africa
              </h2>
            </div>

            <p className="mt-5 text-gray-400 text-sm leading-relaxed">
              Empowering individuals with practical digital skills in web development,
              marketing, and ICT tools for real-world impact.
            </p>

            <div className="mt-6 flex gap-3">
              <SocialIcon
                href="https://facebook.com/zerototechafrica"
                icon={<FaFacebook size={16} />}
                label="Facebook"
                accent="hover:text-[#1877F2]"
              />
              <SocialIcon
                href="https://instagram.com/zerototechafrica"
                icon={<FaInstagram size={16} />}
                label="Instagram"
                accent="hover:text-pink-400"
              />
              <SocialIcon
                href="https://twitter.com/zerototechafrica"
                icon={<FaTwitter size={16} />}
                label="Twitter"
                accent="hover:text-white"
              />
              <SocialIcon
                href="https://www.youtube.com/@Zerototechafricam"
                icon={<FaYoutube size={16} />}
                label="YouTube"
                accent="hover:text-red-500"
              />
            </div>
          </div>

          <div className="md:pl-6">
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Courses", "/courses"],
                ["Resources", "/resources"],
                ["Contact", "/contact"],
              ].map(([name, path]) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="hover:text-white transition duration-200"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
              Courses
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                "Web Development",
                "Social Media Marketing",
                "Video Editing",
                "Microsoft Office",
              ].map((course) => (
                <li
                  key={course}
                  className="hover:text-white transition duration-200 cursor-default"
                >
                  {course}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <FaEnvelope className="mt-1 text-[var(--color-primary)] shrink-0" />
                <span className="break-all">zerototechafrica@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="mt-1 text-[var(--color-primary)] shrink-0" />
                <span>+234 704 542 3336</span>
              </div>
              <div className="flex items-start gap-3">
                <FaGlobe className="mt-1 text-[var(--color-primary)] shrink-0" />
                <span>Kaduna, Nigeria</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER BOTTOM BAR */}
      <div className="relative z-10 max-w-7xl mx-auto mt-16 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} Zero-to-tech-africa. All rights reserved.
        </p>
        <p className="mt-3 md:mt-0 text-[var(--color-primary)]/80 font-medium">
          Built for digital empowerment
        </p>
      </div>
    </footer>
  );
};

const SocialIcon = ({ href, icon, accent, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`
      w-10 h-10
      flex items-center justify-center
      rounded-xl
      bg-white/5
      border border-white/10
      text-gray-300
      transition
      duration-300
      hover:scale-110
      hover:bg-white/10
      ${accent}
    `}
  >
    {icon}
  </a>
);

export default Footer;