import { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import Logo from "../assets/Logo1.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, token, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Resources", path: "/resources" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 10) {
        setVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      if (currentY > lastScrollY.current) setVisible(false);
      if (currentY < lastScrollY.current) setVisible(true);

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav
        className={`
          fixed w-full top-0 z-50
          transition-transform duration-300 ease-in-out
          ${visible ? "translate-y-0" : "-translate-y-full"}
          backdrop-blur-md bg-white/70 border-b border-gray-200
        `}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <Link
            to="/"
            className="
              flex items-center gap-3
              px-3 py-2 rounded-full
              bg-gray-900/90 backdrop-blur-md
              shadow-md
            "
          >
            <img src={Logo} className="w-9 h-9 object-contain" />
            <span className="text-sm font-semibold text-white">
              Zero-to-Tech-Africa
            </span>
          </Link>

          {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center space-x-8">

        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`
                relative py-1 transition
                ${
                  isActive
                    ? "text-[var(--color-primary)] font-medium"
                    : "text-gray-700 hover:text-[var(--color-primary)]"
                }
              `}
            >
              {link.name}

              {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              )}
            </Link>
          );
        })}

        <div className="w-16" />

        {/* AUTH SECTION */}
        {!token ? (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-[var(--color-primary)]"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to={user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
              className="text-[var(--color-primary)] font-medium"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-500 hover:opacity-80"
            >
              Logout
            </button>
          </>
        )}
      </div>

          {/* MOBILE BUTTON (UNCHANGED UI) */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-gray-800"
          >
            <Menu />
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`
          fixed inset-0 z-50 md:hidden
          transition-all duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* BACKDROP */}
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        <div
          className={`
            absolute bottom-0 left-0 right-0
            bg-white
            rounded-t-3xl
            shadow-2xl
            p-6
            transform transition-transform duration-300
            ${isOpen ? "translate-y-0" : "translate-y-full"}
          `}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

          {/* NAV LINKS */}
          <div className="space-y-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center justify-between
                    px-4 py-3 rounded-2xl
                    transition
                    ${
                      isActive
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}

            {!token ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-[var(--color-primary)] font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={
                    user?.role === "admin"
                      ? "/admin/dashboard"
                      : "/user/dashboard"
                  }
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-[var(--color-primary)] font-medium"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link
              to="/courses"
              onClick={() => setIsOpen(false)}
              className="
                block text-center
                px-5 py-3
                rounded-2xl
                bg-[var(--color-secondary)]
                text-white
                font-medium
                shadow-lg
              "
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;