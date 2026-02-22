import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import characters from "../data/characters";
import { getCardNames } from "../utils/cardNames";
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
  /** If true, card starts face-down and flips to reveal */
  flipReveal?: boolean;
  /** Delay before flip animation starts (seconds) */
  flipDelay?: number;
  /** Dealing animation delay (seconds) */
  dealDelay?: number;
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
  flipReveal = false,
  flipDelay = 0,
  dealDelay,
}: BibleCardProps) {
  const [imgError, setImgError] = useState(false);
  const { i18n } = useTranslation();
  const character = characters.find((c) => c.id === cardId);

  if (!character) return null;

  const sizeClass = `bible-card--${size}`;
  const selectedClass = selected ? "bible-card--selected" : "";
  const disabledClass = disabled ? "bible-card--disabled" : "";
  const highlightClass = highlight ? `bible-card--${highlight}` : "";

  // Deal animation variants
  const dealVariants = dealDelay !== undefined
    ? {
        initial: { opacity: 0, y: 60, rotateZ: -5 + Math.random() * 10, scale: 0.7 },
        animate: { opacity: 1, y: 0, rotateZ: 0, scale: 1 },
      }
    : {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
      };

  const dealTransition = dealDelay !== undefined
    ? { duration: 0.5, delay: dealDelay, type: "spring" as const, stiffness: 200, damping: 20 }
    : { type: "spring" as const, stiffness: 300, damping: 25 };

  // Flip reveal card: starts face-down, flips to face-up
  if (flipReveal) {
    return (
      <motion.div
        className={`bible-card bible-card--flip-container ${sizeClass} ${highlightClass}`}
        initial={{ rotateY: 180 }}
        animate={{ rotateY: 0 }}
        transition={{
          duration: 0.6,
          delay: flipDelay,
          type: "spring",
          stiffness: 150,
          damping: 20,
        }}
        style={{ perspective: 800 }}
      >
        <div className={`bible-card__flip-inner`}>
          {/* Front (face up) */}
          <div className={`bible-card__flip-front ${selectedClass} ${disabledClass}`}>
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
              {(() => {
                const { primaryName, secondaryNames } = getCardNames(character, i18n.language);
                return (
                  <div className="bible-card__info">
                    <span className="bible-card__name-primary">{primaryName}</span>
                    {secondaryNames.map((name, idx) => (
                      <span key={idx} className="bible-card__name-secondary">{name}</span>
                    ))}
                  </div>
                );
              })()}
              {showVoteCount !== undefined && showVoteCount > 0 && (
                <motion.div
                  className="bible-card__vote-count"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: flipDelay + 0.4, type: "spring", stiffness: 500 }}
                >
                  {showVoteCount}
                </motion.div>
              )}
              {highlight === "correct" && (
                <motion.div
                  className="bible-card__highlight-badge bible-card__highlight-badge--correct"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: flipDelay + 0.5, type: "spring", stiffness: 500 }}
                >
                  ★
                </motion.div>
              )}
            </div>
          </div>
          {/* Back (face down) */}
          <div className="bible-card__flip-back">
            <div className="bible-card__back">
              <div className="bible-card__back-pattern">
                <span className="bible-card__back-icon">✦</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (faceDown) {
    return (
      <motion.div
        className={`bible-card bible-card--facedown ${sizeClass}`}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        variants={dealVariants}
        initial="initial"
        animate="animate"
        transition={dealTransition}
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
      variants={dealVariants}
      initial="initial"
      animate="animate"
      transition={dealTransition}
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
        {(() => {
          const { primaryName, secondaryNames } = getCardNames(character, i18n.language);
          return (
            <div className="bible-card__info">
              <span className="bible-card__name-primary">{primaryName}</span>
              {secondaryNames.map((name, idx) => (
                <span key={idx} className="bible-card__name-secondary">{name}</span>
              ))}
            </div>
          );
        })()}
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
