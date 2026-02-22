import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import AvatarIcon from "../components/AvatarIcon";
import ScoreBoard from "../components/ScoreBoard";
import type { GameStateFromServer } from "../hooks/useSocket";
import "./GameOverPage.css";

interface GameOverPageProps {
  gameState: GameStateFromServer;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

/** Counting animation hook */
function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = Date.now();
      const step = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return value;
}

function AnimatedScore({ target, delay = 0 }: { target: number; delay?: number }) {
  const count = useCountUp(target, 1200, delay);
  return <>{count}</>;
}

export default function GameOverPage({
  gameState,
  onPlayAgain,
  onBackToLobby,
}: GameOverPageProps) {
  const { t } = useTranslation();
  const [showScores, setShowScores] = useState(false);

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

  // Enhanced confetti — 3 waves
  useEffect(() => {
    const duration = 4000;
    const end = Date.now() + duration;
    let cancelled = false;
    let frameId = 0;

    // Wave 1: Side cannons
    const frame = () => {
      if (cancelled) return;
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#AF52DE", "#FFD700"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#AF52DE", "#FFD700"],
      });

      if (Date.now() < end && !cancelled) {
        frameId = requestAnimationFrame(frame);
      }
    };
    frameId = requestAnimationFrame(frame);

    // Wave 2: Center burst after 500ms
    const burst1 = setTimeout(() => {
      if (cancelled) return;
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors: ["#FFD700", "#FFA500", "#FF6B6B", "#7C4DFF"],
        startVelocity: 30,
      });
    }, 500);

    // Wave 3: Gold burst after 1.5s
    const burst2 = setTimeout(() => {
      if (cancelled) return;
      confetti({
        particleCount: 30,
        spread: 120,
        origin: { x: 0.5, y: 0.3 },
        colors: ["#FFD700", "#FFF176", "#FFE082"],
        startVelocity: 25,
        shapes: ["circle"],
      });
    }, 1500);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      clearTimeout(burst1);
      clearTimeout(burst2);
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
            {winners.map((w, i) => (
              <motion.div
                key={w.id}
                className="gameover-co-winner-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
              >
                <motion.span
                  className="gameover-co-winner-avatar"
                  animate={{ rotate: [0, -8, 8, -5, 5, 0] }}
                  transition={{ duration: 0.8, delay: 1 + i * 0.2 }}
                >
                  <AvatarIcon index={w.avatarIndex} size={36} />
                </motion.span>
                <span className="gameover-co-winner-name">{w.nickname}</span>
              </motion.div>
            ))}
          </div>
          <span className="gameover-winner-score">
            <AnimatedScore target={topScore} delay={1000} /> pts
          </span>
        </motion.div>
      ) : (
        <motion.div
          className="gameover-winner"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="gameover-winner-avatar"
            animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <AvatarIcon index={winners[0].avatarIndex} size={56} />
          </motion.div>
          <div className="gameover-winner-info">
            <span className="gameover-congrats">{t("result.congratulations")}</span>
            <span className="gameover-winner-name">{winners[0].nickname}</span>
            <span className="gameover-winner-score">
              <AnimatedScore target={topScore} delay={1000} /> pts
            </span>
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
              transition={{ delay: 1.1 + index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="gameover-rank-position">
                {getRankEmoji(rank)}
              </div>
              <div className="gameover-rank-avatar">
                <AvatarIcon index={player.avatarIndex} size={28} />
              </div>
              <div className="gameover-rank-name">{player.nickname}</div>
              <div className="gameover-rank-score">
                <AnimatedScore target={player.score} delay={1200 + index * 100} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="gameover-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <button className="btn-ghost gameover-score-btn" onClick={() => setShowScores(true)}>
          📊 {t("game.scores")}
        </button>
        {isHost && (
          <button className="btn-primary" onClick={onPlayAgain}>
            {t("result.playAgain")}
          </button>
        )}
        <button className="btn-secondary" onClick={onBackToLobby}>
          {t("result.backToLobby")}
        </button>
      </motion.div>

      <ScoreBoard
        players={gameState.players}
        isOpen={showScores}
        onClose={() => setShowScores(false)}
        currentPlayerId={gameState.myId}
        roundHistory={(gameState as any).roundHistory}
      />
    </div>
  );
}
