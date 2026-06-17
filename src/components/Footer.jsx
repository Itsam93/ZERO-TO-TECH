import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaGlobe,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import Logo from "../assets/Logo1.png";

const Footer = () => {
  return (
    <footer className="relative bg-gray-950 text-white pt-24 pb-10 px-6 overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-[var(--color-secondary)]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid gap-14 md:grid-cols-4">

        <div className="md:col-span-1">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <img
                src={Logo}
                alt="Zero-to-tech-africa logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            <h2 className="text-lg font-semibold leading-tight">
              Zero-to-tech-africa
            </h2>
          </div>

          <p className="mt-5 text-gray-400 text-sm leading-relaxed max-w-xs">
            Empowering individuals with practical digital skills in web development,
            marketing, and ICT tools for real-world impact.
          </p>

          {/* SOCIAL */}
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

        <div>
          <h3 className="text-sm font-semibold text-white mb-5">
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
                  className="
                    hover:text-white
                    transition
                    duration-200
                  "
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-5">
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
          <h3 className="text-sm font-semibold text-white mb-5">
            Contact
          </h3>

          <div className="space-y-4 text-sm text-gray-400">

            <div className="flex items-start gap-3">
              <FaEnvelope className="mt-1 text-[var(--color-primary)]" />
              <span>zerototechafrica@gmail.com</span>
            </div>

            <div className="flex items-start gap-3">
              <FaPhone className="mt-1 text-[var(--color-primary)]" />
              <span>+234 704 542 3336</span>
            </div>

            <div className="flex items-start gap-3">
              <FaGlobe className="mt-1 text-[var(--color-primary)]" />
              <span>Kaduna, Nigeria</span>
            </div>

          </div>
        </div>
      </div>

      <div className="relative z-10 mt-16 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">

        <p>
          © {new Date().getFullYear()} Zero-to-tech-africa. All rights reserved.
        </p>

        <p className="mt-3 md:mt-0 text-[var(--color-primary)]/80">
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