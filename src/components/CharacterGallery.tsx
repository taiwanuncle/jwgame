import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import characters from "../data/characters";
import { getCardNames } from "../utils/cardNames";
import "./CharacterGallery.css";

interface CharacterGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CharacterGallery({ isOpen, onClose }: CharacterGalleryProps) {
  const { t, i18n } = useTranslation();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selected = selectedId !== null
    ? characters.find((c) => c.id === selectedId) ?? null
    : null;

  const handleCardClick = (id: number) => {
    setSelectedId(id);
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="gallery-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <div className="gallery-header">
            <button className="gallery-close-btn" onClick={selected ? handleBack : onClose}>
              {selected ? "←" : "✕"}
            </button>
            <h2 className="gallery-title">
              {selected
                ? getCardNames(selected, i18n.language).primaryName
                : t("gallery.title")}
            </h2>
            <div className="gallery-count">
              {!selected && `${characters.length}`}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div
                key="grid"
                className="gallery-grid-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="gallery-grid">
                  {characters.map((char) => {
                    const { primaryName } = getCardNames(char, i18n.language);
                    return (
                      <div
                        key={char.id}
                        className="gallery-thumb"
                        onClick={() => handleCardClick(char.id)}
                      >
                        <img
                          src={char.image}
                          alt={primaryName}
                          className="gallery-thumb-img"
                          loading="lazy"
                        />
                        <div className="gallery-thumb-name">{primaryName}</div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                className="gallery-detail"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
              >
                <div className="gallery-detail-img-wrap">
                  <img
                    src={selected.image}
                    alt={getCardNames(selected, i18n.language).primaryName}
                    className="gallery-detail-img"
                  />
                </div>
                <div className="gallery-detail-names">
                  <div className="gallery-detail-primary">
                    {getCardNames(selected, i18n.language).primaryName}
                  </div>
                  {getCardNames(selected, i18n.language).secondaryNames.map((name, i) => (
                    <div key={i} className="gallery-detail-secondary">{name}</div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
