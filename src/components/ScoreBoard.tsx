import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AVATARS } from "./AvatarPicker";
import "./ScoreBoard.css";

interface PlayerScore {
  id: string;
  nickname: string;
  avatarIndex: number;
  score: number;
  isHost: boolean;
  connected: boolean;
}

interface ScoreBoardProps {
  players: PlayerScore[];
  isOpen: boolean;
  onClose: () => void;
  storytellerId?: string;
  currentPlayerId?: string;
}

export default function ScoreBoard({
  players,
  isOpen,
  onClose,
  storytellerId,
  currentPlayerId,
}: ScoreBoardProps) {
  const { t } = useTranslation();

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="scoreboard-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="scoreboard-panel glass-card"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="scoreboard-header">
              <h2>{t("game.scores")}</h2>
              <button className="scoreboard-close" onClick={onClose}>
                ✕
              </button>
            </div>
            <div className="scoreboard-list">
              {sorted.map((player, index) => (
                <motion.div
                  key={player.id}
                  className={`scoreboard-row ${
                    player.id === currentPlayerId ? "scoreboard-row--me" : ""
                  } ${!player.connected ? "scoreboard-row--disconnected" : ""}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="scoreboard-rank">
                    {index === 0 && sorted[0].score > 0
                      ? "🥇"
                      : index === 1 && sorted[1].score > 0
                      ? "🥈"
                      : index === 2 && sorted[2].score > 0
                      ? "🥉"
                      : `${index + 1}`}
                  </div>
                  <div className="scoreboard-avatar">
                    {AVATARS[player.avatarIndex] || "👤"}
                  </div>
                  <div className="scoreboard-name">
                    <span>{player.nickname}</span>
                    {player.id === storytellerId && (
                      <span className="badge badge-accent">
                        {t("game.storyteller")}
                      </span>
                    )}
                    {player.isHost && (
                      <span className="badge badge-warning">
                        {t("waiting.host")}
                      </span>
                    )}
                  </div>
                  <div className="scoreboard-score">{player.score}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
