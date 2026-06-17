import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/Logo1.png";

const PageTransitionLoader = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setDisplayChildren(children);
    }, 3000); 

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (!isTransitioning) {
      setDisplayChildren(children);
    }
  }, [children, isTransitioning]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-gray-950 flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-[var(--color-secondary)]/10 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_60%)]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.95, 1.05, 0.95],
                  opacity: 1
                }}
                transition={{
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  opacity: { duration: 0.4 }
                }}
                className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl shadow-[var(--color-primary)]/10"
              >
                <img
                  src={Logo}
                  alt="Product Logo"
                  className="w-16 h-16 object-contain"
                />
              </motion.div>
              
              <div className="flex gap-1.5 mt-2">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={isTransitioning ? "pointer-events-none hidden" : ""}>
        {displayChildren}
      </div>
    </>
  );
};

export default PageTransitionLoader;