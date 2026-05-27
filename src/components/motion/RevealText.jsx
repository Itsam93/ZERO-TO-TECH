import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const child = {
  hidden: {
    opacity: 0,
    y: "100%",
  },
  show: {
    opacity: 1,
    y: "0%",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const RevealText = ({
  text,
  className = "",
  once = true,
}) => {
  const words = text.split(" ");

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{
        once,
        amount: 0.8,
      }}
      className={`flex flex-wrap overflow-hidden ${className}`}
    >
      {words.map((word, index) => (
        <div
          key={index}
          className="overflow-hidden mr-2"
        >
          <motion.span
            variants={child}
            className="inline-block"
          >
            {word}
          </motion.span>
        </div>
      ))}
    </motion.div>
  );
};

export default RevealText;