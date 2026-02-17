import { motion, AnimatePresence } from "framer-motion";
import "./InfoModal.css";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function InfoModal({
  isOpen,
  onClose,
  title,
  children,
}: InfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="info-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="info-modal glass-card"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="info-modal-header">
              <h2>{title}</h2>
              <button className="info-modal-close" onClick={onClose}>
                ✕
              </button>
            </div>
            <div className="info-modal-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
