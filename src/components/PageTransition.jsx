import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
