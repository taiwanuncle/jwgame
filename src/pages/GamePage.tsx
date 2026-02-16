import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import BibleCard from "../components/BibleCard";
import ScoreBoard from "../components/ScoreBoard";
import type { GameStateFromServer } from "../hooks/useSocket";
import type { RoundResult } from "../types";
import "./GamePage.css";

interface GamePageProps {
  gameState: GameStateFromServer;
  roundResult: RoundResult | null;
  onSubmitClue: (cardId: number, clue: string) => void;
  onSubmitCard: (cardId: number) => void;
  onSubmitVote: (cardId: number) => void;
  onNextRound: () => void;
}

export default function GamePage({
  gameState,
  roundResult,
  onSubmitClue,
  onSubmitCard,
  onSubmitVote,
  onNextRound,
}: GamePageProps) {
  const { t } = useTranslation();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [clue, setClue] = useState("");
  const [showScores, setShowScores] = useState(false);

  const myId = gameState.myId;
  const me = gameState.players.find((p) => p.id === myId);
  const storyteller = gameState.players[gameState.storytellerIndex];
  const isStoryteller = storyteller?.id === myId;
  const myHand = gameState.myHand || [];

  useEffect(() => {
    setSelectedCard(null);
    setClue("");
  }, [gameState.phase, gameState.currentRound]);

  const handleSubmitClue = () => {
    if (selectedCard === null || !clue.trim()) return;
    onSubmitClue(selectedCard, clue.trim());
    setSelectedCard(null);
    setClue("");
  };

  const handleSubmitCard = () => {
    if (selectedCard === null) return;
    onSubmitCard(selectedCard);
    setSelectedCard(null);
  };

  const handleSubmitVote = () => {
    if (selectedCard === null) return;
    onSubmitVote(selectedCard);
    setSelectedCard(null);
  };

  const getVoteCountForCard = (cardId: number): number => {
    if (!roundResult) return 0;
    return roundResult.votes.filter((v) => v.cardId === cardId).length;
  };

  const getCardHighlight = (
    cardId: number
  ): "correct" | "wrong" | "mine" | null => {
    if (!roundResult) return null;
    if (cardId === roundResult.storytellerCardId) return "correct";
    const mySubmission = roundResult.submissions.find(
      (s) => s.playerId === myId
    );
    if (mySubmission && mySubmission.cardId === cardId) return "mine";
    return null;
  };

  return (
    <div className="game-page">
      {/* Top bar */}
      <div className="game-topbar">
        <div className="game-round-info">
          <span className="game-round-badge">
            {t("game.round")} {gameState.currentRound}
            {t("game.of")}
            {gameState.totalRounds}
          </span>
        </div>
        <div className="game-storyteller-info">
          {storyteller && (
            <span className="game-storyteller-label">
              {t("game.storyteller")}: {storyteller.nickname}
            </span>
          )}
        </div>
        <button
          className="game-score-btn"
          onClick={() => setShowScores(true)}
        >
          {t("game.scores")}
        </button>
      </div>

      {/* Clue display */}
      {gameState.clue && gameState.phase !== "storyteller_turn" && (
        <motion.div
          className="game-clue-display"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="game-clue-label">{t("game.clue")}:</span>
          <span className="game-clue-text">{gameState.clue}</span>
        </motion.div>
      )}

      {/* Phase content */}
      <div className="game-content">
        <AnimatePresence mode="wait">
          {/* Storyteller turn */}
          {gameState.phase === "storyteller_turn" && isStoryteller && (
            <motion.div
              key="storyteller"
              className="game-phase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="game-instruction">
                <h3>{t("game.yourTurn")}</h3>
                <p>{t("game.selectCard")}</p>
              </div>

              <div className="game-hand">
                {myHand.map((cardId) => (
                  <BibleCard
                    key={cardId}
                    cardId={cardId}
                    selected={selectedCard === cardId}
                    onClick={() => setSelectedCard(cardId)}
                    size="md"
                  />
                ))}
              </div>

              {selectedCard !== null && (
                <motion.div
                  className="game-clue-input-area"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <input
                    className="input-field game-clue-input"
                    placeholder={t("game.enterClue")}
                    value={clue}
                    onChange={(e) => setClue(e.target.value)}
                    maxLength={50}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmitClue()}
                  />
                  <button
                    className="btn-primary"
                    onClick={handleSubmitClue}
                    disabled={!clue.trim()}
                  >
                    {t("game.submitClue")}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Waiting for storyteller */}
          {gameState.phase === "storyteller_turn" && !isStoryteller && (
            <motion.div
              key="waiting-clue"
              className="game-phase game-waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="game-waiting-icon">⏳</div>
              <p>{t("game.waitingForClue")}</p>
              <div className="game-hand game-hand--small">
                {myHand.map((cardId) => (
                  <BibleCard key={cardId} cardId={cardId} size="sm" disabled />
                ))}
              </div>
            </motion.div>
          )}

          {/* Players submit cards */}
          {gameState.phase === "players_submit" && !isStoryteller && (
            <motion.div
              key="submit"
              className="game-phase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {!gameState.hasSubmitted ? (
                <>
                  <div className="game-instruction">
                    <p>{t("game.selectMatchingCard")}</p>
                  </div>
                  <div className="game-hand">
                    {myHand.map((cardId) => (
                      <BibleCard
                        key={cardId}
                        cardId={cardId}
                        selected={selectedCard === cardId}
                        onClick={() => setSelectedCard(cardId)}
                        size="md"
                      />
                    ))}
                  </div>
                  {selectedCard !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="game-submit-area"
                    >
                      <button className="btn-primary" onClick={handleSubmitCard}>
                        {t("game.submitCard")}
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="game-waiting">
                  <div className="game-waiting-icon">✓</div>
                  <p>
                    {t("game.waitingForCards")} ({gameState.submittedCount}/
                    {gameState.players.length})
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Storyteller waits during submit */}
          {gameState.phase === "players_submit" && isStoryteller && (
            <motion.div
              key="st-wait-submit"
              className="game-phase game-waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="game-waiting-icon">📋</div>
              <p>
                {t("game.waitingForCards")} ({gameState.submittedCount}/
                {gameState.players.length})
              </p>
            </motion.div>
          )}

          {/* Shuffle animation */}
          {gameState.phase === "shuffle" && (
            <motion.div
              key="shuffle"
              className="game-phase game-shuffle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="shuffle-container">
                {gameState.shuffledCards.map((cardId, index) => (
                  <motion.div
                    key={`shuffle-${index}`}
                    className="shuffle-card-wrapper"
                    initial={{
                      x: Math.random() * 200 - 100,
                      y: Math.random() * 200 - 100,
                      rotate: Math.random() * 360,
                      scale: 0.5,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <BibleCard cardId={cardId} faceDown size="sm" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Voting */}
          {gameState.phase === "voting" && !isStoryteller && (
            <motion.div
              key="voting"
              className="game-phase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {!gameState.hasVoted ? (
                <>
                  <div className="game-instruction">
                    <p>{t("game.voteCard")}</p>
                  </div>
                  <div className="game-board">
                    {gameState.shuffledCards.map((cardId) => (
                      <BibleCard
                        key={cardId}
                        cardId={cardId}
                        selected={selectedCard === cardId}
                        onClick={() => setSelectedCard(cardId)}
                        size="md"
                      />
                    ))}
                  </div>
                  {selectedCard !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="game-submit-area"
                    >
                      <button className="btn-primary" onClick={handleSubmitVote}>
                        {t("game.vote")}
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="game-waiting">
                  <div className="game-waiting-icon">🗳️</div>
                  <p>
                    {t("game.waitingForVotes")} ({gameState.votedCount}/
                    {gameState.players.length - 1})
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Storyteller waits during voting */}
          {gameState.phase === "voting" && isStoryteller && (
            <motion.div
              key="st-wait-vote"
              className="game-phase game-waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="game-waiting-icon">🗳️</div>
              <p>{t("game.waitingForStoryteller")}</p>
              <p className="game-vote-progress">
                {gameState.votedCount}/{gameState.players.length - 1}{" "}
                {t("game.votesSubmitted")}
              </p>
            </motion.div>
          )}

          {/* Round result */}
          {gameState.phase === "round_result" && roundResult && (
            <motion.div
              key="result"
              className="game-phase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="game-result-header">
                {roundResult.allCorrect && (
                  <div className="game-result-message">
                    {t("score.everyoneCorrect")}
                  </div>
                )}
                {roundResult.noneCorrect && (
                  <div className="game-result-message">
                    {t("score.nobodyCorrect")}
                  </div>
                )}
                {!roundResult.allCorrect && !roundResult.noneCorrect && (
                  <div className="game-result-message">
                    {t("score.someCorrect")}
                  </div>
                )}
              </div>

              <div className="game-board">
                {gameState.shuffledCards.map((cardId) => (
                  <div key={cardId} className="game-result-card-wrapper">
                    <BibleCard
                      cardId={cardId}
                      highlight={getCardHighlight(cardId)}
                      showVoteCount={getVoteCountForCard(cardId)}
                      size="md"
                      disabled
                    />
                    <div className="game-result-card-owner">
                      {(() => {
                        const sub = roundResult.submissions.find(
                          (s) => s.cardId === cardId
                        );
                        if (!sub) return "";
                        const player = gameState.players.find(
                          (p) => p.id === sub.playerId
                        );
                        return player?.nickname || "";
                      })()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="game-result-scores">
                {roundResult.scoreChanges
                  .filter((sc) => sc.points > 0)
                  .map((sc) => {
                    const player = gameState.players.find(
                      (p) => p.id === sc.playerId
                    );
                    return (
                      <div key={`${sc.playerId}-${sc.reason}`} className="game-result-score-item">
                        <span>{player?.nickname}</span>
                        <span className="game-result-points">+{sc.points}</span>
                      </div>
                    );
                  })}
              </div>

              {(isStoryteller || me?.isHost) && (
                <button className="btn-primary" onClick={onNextRound}>
                  {t("game.nextRound")}
                </button>
              )}
              {!isStoryteller && !me?.isHost && (
                <p className="game-waiting-hint">
                  {t("game.waitingForStoryteller")}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Score board popup */}
      <ScoreBoard
        players={gameState.players}
        isOpen={showScores}
        onClose={() => setShowScores(false)}
        storytellerId={storyteller?.id}
        currentPlayerId={myId}
      />
    </div>
  );
}

