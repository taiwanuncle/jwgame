import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import AvatarIcon from "./AvatarIcon";
import "./ScoreBoard.css";

interface PlayerScore {
  id: string;
  nickname: string;
  avatarIndex: number;
  score: number;
  isHost: boolean;
  connected: boolean;
}

interface RoundHistoryEntry {
  round: number;
  clue: string;
  storytellerId: string;
  scoreChanges: { playerId: string; points: number; reason: string }[];
  allCorrect: boolean;
  noneCorrect: boolean;
}

interface ScoreBoardProps {
  players: PlayerScore[];
  isOpen: boolean;
  onClose: () => void;
  storytellerId?: string;
  currentPlayerId?: string;
  roundHistory?: RoundHistoryEntry[];
}

export default function ScoreBoard({
  players,
  isOpen,
  onClose,
  storytellerId,
  currentPlayerId,
  roundHistory = [],
}: ScoreBoardProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"summary" | "detail">("summary");

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="scoreboard-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="scoreboard-panel glass-card"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="scoreboard-header">
              <h2>{t("game.scores")}</h2>
              <button className="scoreboard-close" onClick={onClose}>
                ✕
              </button>
            </div>

            {/* Tabs */}
            {roundHistory.length > 0 && (
              <div className="scoreboard-tabs">
                <button
                  className={`scoreboard-tab ${tab === "summary" ? "scoreboard-tab--active" : ""}`}
                  onClick={() => setTab("summary")}
                >
                  {t("score.summary")}
                </button>
                <button
                  className={`scoreboard-tab ${tab === "detail" ? "scoreboard-tab--active" : ""}`}
                  onClick={() => setTab("detail")}
                >
                  {t("score.detail")}
                </button>
              </div>
            )}

            {/* Summary tab */}
            {tab === "summary" && (
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
                      <AvatarIcon index={player.avatarIndex} size={24} />
                    </div>
                    <div className="scoreboard-name">
                      <span>{player.nickname}</span>
                      {player.id === storytellerId && (
                        <span className="badge badge-accent">
                          {t("game.storyteller")}
                        </span>
                      )}
                    </div>
                    <div className="scoreboard-score">{player.score}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Detail tab */}
            {tab === "detail" && (
              <div className="scoreboard-detail">
                <div className="scoreboard-table-wrapper">
                  <table className="scoreboard-table">
                    <thead>
                      <tr>
                        <th className="scoreboard-th-round">R</th>
                        {players.map((p) => (
                          <th key={p.id} className="scoreboard-th-player">
                            <AvatarIcon index={p.avatarIndex} size={20} />
                            <span className="scoreboard-th-name">{p.nickname}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {roundHistory.map((rh) => (
                        <tr key={rh.round}>
                          <td className="scoreboard-td-round">
                            <div className="scoreboard-round-num">{rh.round}</div>
                            <div className="scoreboard-round-clue">{rh.clue}</div>
                          </td>
                          {players.map((p) => {
                            const sc = rh.scoreChanges.find(
                              (s) => s.playerId === p.id
                            );
                            const pts = sc ? sc.points : 0;
                            const isST = rh.storytellerId === p.id;
                            return (
                              <td
                                key={p.id}
                                className={`scoreboard-td-score ${
                                  pts > 0 ? "scoreboard-td-score--positive" : ""
                                } ${isST ? "scoreboard-td-score--storyteller" : ""}`}
                              >
                                {pts > 0 ? `+${pts}` : isST ? "📖" : "-"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      <tr className="scoreboard-total-row">
                        <td className="scoreboard-td-round"><strong>{t("score.total")}</strong></td>
                        {players.map((p) => (
                          <td key={p.id} className="scoreboard-td-total">
                            <strong>{p.score}</strong>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
