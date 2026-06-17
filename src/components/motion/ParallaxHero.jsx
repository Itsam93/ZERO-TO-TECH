import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

const ParallaxHero = ({
  children,
  className = "",
  background,
}) => {
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 800], [0, 220]);

  const opacity = useTransform(scrollY, [0, 500], [1, 0.4]);

  const scale = useTransform(scrollY, [0, 500], [1, 1.08]);

  return (
    <section
      className={`relative overflow-hidden ${className}`}
    >
      {/* BACKGROUND LAYER */}
      <motion.div
        style={{
          y,
          opacity,
          scale,
        }}
        className="
          absolute
          inset-0
          will-change-transform
        "
      >
        {background}
      </motion.div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/30" />

      {/* CONTENT */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};

export default ParallaxHero;