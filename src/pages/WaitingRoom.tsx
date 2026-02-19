import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import AvatarIcon from "../components/AvatarIcon";
import type { GameStateFromServer } from "../hooks/useSocket";
import "./WaitingRoom.css";

interface WaitingRoomProps {
  gameState: GameStateFromServer;
  onToggleReady: () => void;
  onSetRounds: (rounds: number) => void;
  onStartGame: () => void;
  onLeave: () => void;
  errorMsg: string;
}

export default function WaitingRoom({
  gameState,
  onToggleReady,
  onSetRounds,
  onStartGame,
  onLeave,
  errorMsg,
}: WaitingRoomProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const me = gameState.players.find((p) => p.id === gameState.myId);
  const isHost = me?.isHost || false;

  // Round options = multiples of player count (1x ~ 5x)
  const playerCount = gameState.players.length;
  const roundOptions = Array.from({ length: 5 }, (_, i) => playerCount * (i + 1));

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(gameState.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const allReady = gameState.players
    .filter((p) => !p.isHost)
    .every((p) => p.ready);
  const canStart = gameState.players.length >= 3 && allReady;

  return (
    <div className="page-container waiting-page">
      <motion.div
        className="card-container waiting-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="waiting-title">{t("waiting.waitingRoom")}</h2>

        <motion.div
          className="waiting-room-code"
          onClick={handleCopyCode}
          whileTap={{ scale: 0.96 }}
        >
          <span className="waiting-room-code-label">{t("waiting.roomCode")}</span>
          <span className="waiting-room-code-value">{gameState.roomCode}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={copied ? "copied" : "copy"}
              className={`waiting-room-code-copy ${copied ? "waiting-room-code-copy--done" : ""}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {copied ? "✓ " : ""}{copied ? t("waiting.copied") : t("waiting.copyCode")}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* 라운드 수 선택 */}
        <div className="waiting-rounds-section">
          <span className="waiting-rounds-label">{t("waiting.rounds")}</span>
          <div className="waiting-rounds-options">
            {roundOptions.map((r) => (
              <motion.button
                key={r}
                className={`waiting-rounds-btn ${
                  gameState.totalRounds === r ? "waiting-rounds-btn--active" : ""
                }`}
                onClick={() => isHost && onSetRounds(r)}
                disabled={!isHost}
                whileTap={isHost ? { scale: 0.9 } : {}}
              >
                {r}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="waiting-players-header">
          <span>
            {t("waiting.players")} ({gameState.players.length}/10)
          </span>
        </div>

        <div className="waiting-players-list">
          <AnimatePresence>
            {gameState.players.map((player, index) => {
              const isReady = player.isHost || player.ready;
              return (
                <motion.div
                  key={player.id}
                  className={`waiting-player ${
                    player.id === gameState.myId ? "waiting-player--me" : ""
                  }`}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                  layout
                >
                  <motion.span
                    className="waiting-player-avatar"
                    animate={{
                      rotate: isReady ? [0, -5, 5, -3, 3, 0] : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: isReady ? 0.1 : 0,
                    }}
                  >
                    <AvatarIcon index={player.avatarIndex} size={26} />
                  </motion.span>
                  <span className="waiting-player-name">
                    {player.nickname}
                    {player.isHost && (
                      <span className="badge badge-warning">{t("waiting.host")}</span>
                    )}
                  </span>
                  <AnimatePresence mode="wait">
                    {isReady ? (
                      <motion.span
                        key="ready"
                        className="waiting-player-status waiting-player-status--ready"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        {player.isHost ? (
                          <span className="waiting-host-star">✦</span>
                        ) : (
                          <span className="waiting-ready-check">✓</span>
                        )}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="waiting"
                        className="waiting-player-status"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className="waiting-dots">
                          <span className="waiting-dot" />
                          <span className="waiting-dot" />
                          <span className="waiting-dot" />
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {errorMsg && <div className="lobby-error">{errorMsg}</div>}

        <div className="waiting-actions">
          <button className="btn-ghost" onClick={onLeave}>
            {t("waiting.leave")}
          </button>

          {isHost ? (
            <motion.button
              className="btn-primary"
              onClick={onStartGame}
              disabled={!canStart}
              whileTap={canStart ? { scale: 0.95 } : {}}
              animate={canStart ? { boxShadow: ["0 4px 14px rgba(0, 122, 255, 0.3)", "0 4px 24px rgba(0, 122, 255, 0.5)", "0 4px 14px rgba(0, 122, 255, 0.3)"] } : {}}
              transition={canStart ? { duration: 2, repeat: Infinity } : {}}
            >
              {t("waiting.startGame")}
            </motion.button>
          ) : (
            <motion.button
              className={`btn-primary ${me?.ready ? "btn-ready-active" : ""}`}
              onClick={onToggleReady}
              whileTap={{ scale: 0.95 }}
            >
              {me?.ready ? `✓ ${t("waiting.ready")}` : t("waiting.notReady")}
            </motion.button>
          )}
        </div>

        {!isHost && (
          <p className="waiting-hint">{t("waiting.waitingForHost")}</p>
        )}
      </motion.div>
    </div>
  );
}
