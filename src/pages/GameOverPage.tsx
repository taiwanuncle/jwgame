import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import AvatarIcon from "../components/AvatarIcon";
import ChatOverlay from "../components/ChatOverlay";
import type { GameStateFromServer, ChatMessage } from "../hooks/useSocket";
import "./GameOverPage.css";

interface GameOverPageProps {
  gameState: GameStateFromServer;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
  chatMessages: ChatMessage[];
  onSendChat: (message: string) => void;
}

export default function GameOverPage({
  gameState,
  onPlayAgain,
  onBackToLobby,
  chatMessages,
  onSendChat,
}: GameOverPageProps) {
  const { t } = useTranslation();

  const me = gameState.players.find((p) => p.id === gameState.myId);
  const isHost = me?.isHost || false;

  const sorted = [...gameState.players].sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score ?? 0;
  const winners = sorted.filter((p) => p.score === topScore);
  const isCoWin = winners.length > 1;

  // Proper rank assignment (same score = same rank)
  const getRank = (index: number): number => {
    if (index === 0) return 1;
    if (sorted[index].score === sorted[index - 1].score) {
      return getRank(index - 1);
    }
    return index + 1;
  };

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    let cancelled = false;

    const frame = () => {
      if (cancelled) return;
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#AF52DE"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#AF52DE"],
      });

      if (Date.now() < end && !cancelled) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    return () => {
      cancelled = true;
      confetti.reset();
    };
  }, []);

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}${t("result.th")}`;
  };

  return (
    <div className="page-container gameover-page">
      <motion.div
        className="gameover-trophy"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      >
        🏆
      </motion.div>

      <motion.h1
        className="gameover-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {t("result.gameOver")}
      </motion.h1>

      {/* Winner section */}
      {isCoWin ? (
        <motion.div
          className="gameover-co-winners"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span className="gameover-congrats">{t("result.coWinners")}</span>
          <div className="gameover-co-winner-list">
            {winners.map((w) => (
              <div key={w.id} className="gameover-co-winner-item">
                <span className="gameover-co-winner-avatar">
                  <AvatarIcon index={w.avatarIndex} size={36} />
                </span>
                <span className="gameover-co-winner-name">{w.nickname}</span>
              </div>
            ))}
          </div>
          <span className="gameover-winner-score">{topScore} pts</span>
        </motion.div>
      ) : (
        <motion.div
          className="gameover-winner"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="gameover-winner-avatar">
            <AvatarIcon index={winners[0].avatarIndex} size={56} />
          </div>
          <div className="gameover-winner-info">
            <span className="gameover-congrats">{t("result.congratulations")}</span>
            <span className="gameover-winner-name">{winners[0].nickname}</span>
            <span className="gameover-winner-score">{topScore} pts</span>
          </div>
        </motion.div>
      )}

      {/* Rankings */}
      <motion.div
        className="card-container gameover-rankings"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {sorted.map((player, index) => {
          const rank = getRank(index);
          return (
            <motion.div
              key={player.id}
              className={`gameover-rank-row ${
                player.id === gameState.myId ? "gameover-rank-row--me" : ""
              }`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
            >
              <div className="gameover-rank-position">
                {getRankEmoji(rank)}
              </div>
              <div className="gameover-rank-avatar">
                <AvatarIcon index={player.avatarIndex} size={28} />
              </div>
              <div className="gameover-rank-name">{player.nickname}</div>
              <div className="gameover-rank-score">{player.score}</div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="gameover-chat"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <ChatOverlay
          messages={chatMessages}
          onSend={onSendChat}
          myId={gameState.myId}
        />
      </motion.div>

      <motion.div
        className="gameover-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {isHost && (
          <button className="btn-primary" onClick={onPlayAgain}>
            {t("result.playAgain")}
          </button>
        )}
        <button className="btn-secondary" onClick={onBackToLobby}>
          {t("result.backToLobby")}
        </button>
      </motion.div>
    </div>
  );
}
