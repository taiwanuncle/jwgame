import { useState } from "react";
import { motion } from "framer-motion";
import characters from "../data/characters";
import "./BibleCard.css";

interface BibleCardProps {
  cardId: number;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  faceDown?: boolean;
  highlight?: "correct" | "wrong" | "mine" | null;
  size?: "sm" | "md" | "lg";
  showVoteCount?: number;
}

export default function BibleCard({
  cardId,
  selected = false,
  onClick,
  disabled = false,
  faceDown = false,
  highlight = null,
  size = "md",
  showVoteCount,
}: BibleCardProps) {
  const [imgError, setImgError] = useState(false);
  const character = characters.find((c) => c.id === cardId);

  if (!character) return null;

  const sizeClass = `bible-card--${size}`;
  const selectedClass = selected ? "bible-card--selected" : "";
  const disabledClass = disabled ? "bible-card--disabled" : "";
  const highlightClass = highlight ? `bible-card--${highlight}` : "";

  if (faceDown) {
    return (
      <motion.div
        className={`bible-card bible-card--facedown ${sizeClass}`}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        <div className="bible-card__back">
          <div className="bible-card__back-pattern">
            <span className="bible-card__back-icon">✦</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`bible-card ${sizeClass} ${selectedClass} ${disabledClass} ${highlightClass}`}
      onClick={!disabled ? onClick : undefined}
      whileHover={!disabled ? { scale: 1.03, y: -4 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="bible-card__inner">
        <div className="bible-card__image-container">
          {imgError ? (
            <div className="bible-card__placeholder">
              <div className="bible-card__silhouette">
                <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="35" r="22" fill="#D1D5DB"/>
                  <ellipse cx="50" cy="95" rx="35" ry="35" fill="#D1D5DB"/>
                </svg>
              </div>
              <span className="bible-card__id">#{cardId}</span>
            </div>
          ) : (
            <img
              src={character.image}
              alt={character.nameEn}
              className="bible-card__image"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div className="bible-card__info">
          <span className="bible-card__name-ko">{character.nameKo}</span>
          <span className="bible-card__name-en">{character.nameEn}</span>
          <span className="bible-card__name-zh">{character.nameZh}</span>
        </div>
        {selected && (
          <motion.div
            className="bible-card__check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            ✓
          </motion.div>
        )}
        {showVoteCount !== undefined && showVoteCount > 0 && (
          <div className="bible-card__vote-count">{showVoteCount}</div>
        )}
        {highlight === "correct" && (
          <motion.div
            className="bible-card__highlight-badge bible-card__highlight-badge--correct"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            ★
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
