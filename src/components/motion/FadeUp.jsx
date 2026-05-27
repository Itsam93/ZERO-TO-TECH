import { motion } from "framer-motion";

const FadeUp = ({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  distance = 50,
  once = true,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: distance,
        scale: 0.98,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{
        once,
        amount: 0.2,
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;