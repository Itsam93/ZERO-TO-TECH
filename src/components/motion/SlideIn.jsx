import { motion } from "framer-motion";

const directionOffset = {
  left: { x: -80, y: 0 },
  right: { x: 80, y: 0 },
  up: { x: 0, y: 80 },
  down: { x: 0, y: -80 },
};

const SlideIn = ({
  children,
  direction = "left",
  className = "",
  delay = 0,
  duration = 0.9,
  once = true,
}) => {
  const offset = directionOffset[direction] || directionOffset.left;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once,
        amount: 0.25,
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;