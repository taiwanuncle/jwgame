import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Toast.css";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  duration?: number;
  type?: "info" | "warning" | "success";
}

export default function Toast({
  message,
  isVisible,
  onHide,
  duration = 2500,
  type = "info",
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onHide]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`toast toast--${type}`}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <span className="toast-icon">
            {type === "warning" ? "⚠️" : type === "success" ? "✅" : "💡"}
          </span>
          <span className="toast-message">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
