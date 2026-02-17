import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AVATARS } from "../components/AvatarPicker";
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

const ROUND_OPTIONS = [5, 7, 10, 15];

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

        <div className="waiting-room-code" onClick={handleCopyCode}>
          <span className="waiting-room-code-label">{t("waiting.roomCode")}</span>
          <span className="waiting-room-code-value">{gameState.roomCode}</span>
          <span className="waiting-room-code-copy">
            {copied ? t("waiting.copied") : t("waiting.copyCode")}
          </span>
        </div>

        {/* 라운드 수 선택 */}
        <div className="waiting-rounds-section">
          <span className="waiting-rounds-label">{t("waiting.rounds")}</span>
          <div className="waiting-rounds-options">
            {ROUND_OPTIONS.map((r) => (
              <button
                key={r}
                className={`waiting-rounds-btn ${
                  gameState.totalRounds === r ? "waiting-rounds-btn--active" : ""
                }`}
                onClick={() => isHost && onSetRounds(r)}
                disabled={!isHost}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="waiting-players-header">
          <span>
            {t("waiting.players")} ({gameState.players.length}/10)
          </span>
        </div>

        <div className="waiting-players-list">
          {gameState.players.map((player, index) => (
            <motion.div
              key={player.id}
              className={`waiting-player ${
                player.id === gameState.myId ? "waiting-player--me" : ""
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="waiting-player-avatar">
                {AVATARS[player.avatarIndex] || "👤"}
              </span>
              <span className="waiting-player-name">
                {player.nickname}
                {player.isHost && (
                  <span className="badge badge-warning">{t("waiting.host")}</span>
                )}
              </span>
              <span
                className={`waiting-player-status ${
                  player.isHost || player.ready
                    ? "waiting-player-status--ready"
                    : ""
                }`}
              >
                {player.isHost
                  ? "✦"
                  : player.ready
                  ? t("waiting.ready")
                  : "···"}
              </span>
            </motion.div>
          ))}
        </div>

        {errorMsg && <div className="lobby-error">{errorMsg}</div>}

        <div className="waiting-actions">
          <button className="btn-ghost" onClick={onLeave}>
            {t("waiting.leave")}
          </button>

          {isHost ? (
            <button
              className="btn-primary"
              onClick={onStartGame}
              disabled={!canStart}
            >
              {t("waiting.startGame")}
            </button>
          ) : (
            <button
              className={`btn-primary ${me?.ready ? "btn-ready-active" : ""}`}
              onClick={onToggleReady}
            >
              {me?.ready ? t("waiting.ready") : t("waiting.notReady")}
            </button>
          )}
        </div>

        {!isHost && (
          <p className="waiting-hint">{t("waiting.waitingForHost")}</p>
        )}
      </motion.div>
    </div>
  );
}
