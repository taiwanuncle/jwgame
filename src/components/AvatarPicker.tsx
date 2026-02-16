import { motion } from "framer-motion";
import "./AvatarPicker.css";

export const AVATARS = [
  "🕊️", "🐑", "🦁", "🐟", "🌿", "⭐", "🏔️", "🌊",
  "🔥", "🌈", "🕯️", "📜", "🏺", "⚓", "🗡️", "🛡️",
];

interface AvatarPickerProps {
  selected: number;
  onSelect: (index: number) => void;
}

export default function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="avatar-picker">
      {AVATARS.map((emoji, index) => (
        <motion.button
          key={index}
          className={`avatar-item ${selected === index ? "avatar-item--selected" : ""}`}
          onClick={() => onSelect(index)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="avatar-emoji">{emoji}</span>
        </motion.button>
      ))}
    </div>
  );
}
