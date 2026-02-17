import { motion } from "framer-motion";
import AvatarIcon, { AVATAR_COUNT } from "./AvatarIcon";
import "./AvatarPicker.css";

interface AvatarPickerProps {
  selected: number;
  onSelect: (index: number) => void;
}

export default function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="avatar-picker">
      {Array.from({ length: AVATAR_COUNT }, (_, index) => (
        <motion.button
          key={index}
          className={`avatar-item ${selected === index ? "avatar-item--selected" : ""}`}
          onClick={() => onSelect(index)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AvatarIcon index={index} size={40} />
        </motion.button>
      ))}
    </div>
  );
}
