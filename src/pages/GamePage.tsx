import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import BibleCard from "../components/BibleCard";
import ScoreBoard from "../components/ScoreBoard";
import Toast from "../components/Toast";
import CountdownBar from "../components/CountdownBar";
import type { GameStateFromServer } from "../hooks/useSocket";
import type { RoundResult } from "../types";
import { playClick, playSelect, playSubmit, playError } from "../utils/sfx";
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
  const [toast, setToast] = useState({ message: "", visible: false, type: "info" as "info" | "warning" | "success" });

  const myId = gameState.myId;
  const me = gameState.players.find((p) => p.id === myId);
  const storyteller = gameState.players[gameState.storytellerIndex];
  const isStoryteller = storyteller?.id === myId;
  const myHand = gameState.myHand || [];

  const showToast = useCallback((message: string, type: "info" | "warning" | "success" = "info") => {
    setToast({ message, visible: true, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // Reset selection on phase change
  useEffect(() => {
    setSelectedCard(null);
    setClue("");
  }, [gameState.phase, gameState.currentRound]);

  // Last round notification
  useEffect(() => {
    if (gameState.currentRound === gameState.totalRounds && gameState.phase === "storyteller_turn") {
      showToast(t("toast.lastRound"), "warning");
    }
  }, [gameState.currentRound, gameState.totalRounds, gameState.phase, showToast, t]);

  // Round result tips
  useEffect(() => {
    if (gameState.phase === "round_result" && roundResult) {
      if (roundResult.allCorrect) {
        showToast(t("toast.everyoneCorrectTip"), "warning");
      } else if (roundResult.noneCorrect) {
        showToast(t("toast.nobodyCorrectTip"), "warning");
      } else {
        showToast(t("toast.someCorrectTip"), "success");
      }
    }
  }, [gameState.phase, roundResult, showToast, t]);

  const handleSubmitClue = () => {
    if (selectedCard === null || !clue.trim()) return;
    playSubmit();
    onSubmitClue(selectedCard, clue.trim());
    setSelectedCard(null);
    setClue("");
  };

  const handleSubmitCard = () => {
    if (selectedCard === null) return;
    playSubmit();
    onSubmitCard(selectedCard);
    setSelectedCard(null);
    showToast(t("toast.cardSubmitted"), "success");
  };

  // Voting: check if card belongs to this player
  const handleVoteClick = (cardId: number) => {
    if (gameState.mySubmittedCardId === cardId) {
      playError();
      showToast(t("toast.cannotVoteOwnCard"), "warning");
      return;
    }
    playClick();
    setSelectedCard(cardId);
  };

  const handleSubmitVote = () => {
    if (selectedCard === null) return;
    playSubmit();
    onSubmitVote(selectedCard);
    setSelectedCard(null);
    showToast(t("toast.voteSubmitted"), "success");
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

  // Who hasn't submitted/voted yet?
  const getWaitingNames = (): string[] => {
    const submittedIds = gameState.submittedPlayerIds || [];
    const votedIds = gameState.votedPlayerIds || [];

    if (gameState.phase === "players_submit") {
      return gameState.players
        .filter((p) => !submittedIds.includes(p.id))
        .map((p) => p.nickname);
    }
    if (gameState.phase === "voting") {
      return gameState.players
        .filter((p) => p.id !== storyteller?.id && !votedIds.includes(p.id))
        .map((p) => p.nickname);
    }
    return [];
  };
  const waitingNames = getWaitingNames();

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

      {/* Timer bar */}
      <CountdownBar timerEnd={gameState.timerEnd} />

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
              <div className="game-phase-step">
                <span className="game-phase-step-num">{t("game.phase1")}</span>
                <span className="game-phase-step-label">{t("game.phase1Desc")}</span>
              </div>
              <div className="game-instruction">
                <h3>{t("game.yourTurn")}</h3>
                <p>{selectedCard === null ? t("game.selectCard") : t("game.enterClueHint")}</p>
              </div>

              {/* Clue input — above cards for visibility */}
              {selectedCard !== null && (
                <motion.div
                  className="game-clue-input-area game-clue-input-area--highlight"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="game-clue-input-label">✏️ {t("game.enterClue")}</label>
                  <input
                    className="input-field game-clue-input"
                    placeholder={t("game.enterClue")}
                    value={clue}
                    onChange={(e) => setClue(e.target.value)}
                    maxLength={50}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmitClue()}
                    autoFocus
                  />
                </motion.div>
              )}

              <div className="game-hand">
                {myHand.map((cardId) => (
                  <BibleCard
                    key={cardId}
                    cardId={cardId}
                    selected={selectedCard === cardId}
                    onClick={() => { playSelect(); setSelectedCard(cardId); }}
                    size="md"
                  />
                ))}
              </div>
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
              <div className="game-phase-step">
                <span className="game-phase-step-num">{t("game.phase1")}</span>
                <span className="game-phase-step-label">{t("game.phase1Desc")}</span>
              </div>
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
              <div className="game-phase-step">
                <span className="game-phase-step-num">{t("game.phase2")}</span>
                <span className="game-phase-step-label">{t("game.phase2Desc")}</span>
              </div>
              {!gameState.hasSubmitted ? (
                <>
                  <div className="game-instruction">
                    <p>{t("game.phase2Sub", { name: storyteller?.nickname })}</p>
                  </div>
                  <div className="game-hand">
                    {myHand.map((cardId) => (
                      <BibleCard
                        key={cardId}
                        cardId={cardId}
                        selected={selectedCard === cardId}
                        onClick={() => { playSelect(); setSelectedCard(cardId); }}
                        size="md"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="game-waiting">
                  <div className="game-waiting-icon">✓</div>
                  <p>
                    {t("game.waitingForCards")} ({gameState.submittedCount}/
                    {gameState.players.length})
                  </p>
                  {waitingNames.length > 0 && (
                    <p className="game-waiting-names">
                      {t("game.waitingFor")} {waitingNames.join(", ")}
                    </p>
                  )}
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
              <div className="game-phase-step">
                <span className="game-phase-step-num">{t("game.phase2")}</span>
                <span className="game-phase-step-label">{t("game.phase2Desc")}</span>
              </div>
              <div className="game-waiting-icon">📋</div>
              <p>
                {t("game.waitingForCards")} ({gameState.submittedCount}/
                {gameState.players.length})
              </p>
              {waitingNames.length > 0 && (
                <p className="game-waiting-names">
                  {t("game.waitingFor")} {waitingNames.join(", ")}
                </p>
              )}
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
              <div className="game-phase-step">
                <span className="game-phase-step-num">{t("game.phase3")}</span>
                <span className="game-phase-step-label">{t("game.phase3Desc")}</span>
              </div>
              {!gameState.hasVoted ? (
                <>
                  <div className="game-instruction">
                    <p>{t("game.phase3Sub", { name: storyteller?.nickname })}</p>
                  </div>
                  <div className="game-board">
                    {gameState.shuffledCards.map((cardId) => (
                      <BibleCard
                        key={cardId}
                        cardId={cardId}
                        selected={selectedCard === cardId}
                        onClick={() => handleVoteClick(cardId)}
                        size="md"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="game-waiting">
                  <div className="game-waiting-icon">🗳️</div>
                  <p>
                    {t("game.waitingForVotes")} ({gameState.votedCount}/
                    {gameState.players.length - 1})
                  </p>
                  {waitingNames.length > 0 && (
                    <p className="game-waiting-names">
                      {t("game.waitingFor")} {waitingNames.join(", ")}
                    </p>
                  )}
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
              <div className="game-phase-step">
                <span className="game-phase-step-num">{t("game.phase3")}</span>
                <span className="game-phase-step-label">{t("game.phase3Desc")}</span>
              </div>
              <div className="game-waiting-icon">🗳️</div>
              <p className="game-vote-progress">
                {gameState.votedCount}/{gameState.players.length - 1}{" "}
                {t("game.votesSubmitted")}
              </p>
              {waitingNames.length > 0 && (
                <p className="game-waiting-names">
                  {t("game.waitingFor")} {waitingNames.join(", ")}
                </p>
              )}
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

              <div className="game-board">
                {gameState.shuffledCards.map((cardId) => {
                  const sub = roundResult.submissions.find(
                    (s) => s.cardId === cardId
                  );
                  const cardOwner = sub
                    ? gameState.players.find((p) => p.id === sub.playerId)
                    : null;
                  const isStorytellerCard = cardId === roundResult.storytellerCardId;
                  const isMySubmission = sub?.playerId === myId;
                  const highlight = getCardHighlight(cardId);

                  return (
                    <div key={cardId} className="game-result-card-wrapper">
                      {/* Card label */}
                      {isStorytellerCard && (
                        <div className="game-result-card-label game-result-card-label--correct">
                          {t("game.correct")}
                        </div>
                      )}
                      {!isStorytellerCard && isMySubmission && (
                        <div className="game-result-card-label game-result-card-label--mine">
                          {t("game.yourCard")}
                        </div>
                      )}
                      <BibleCard
                        cardId={cardId}
                        highlight={highlight}
                        showVoteCount={getVoteCountForCard(cardId)}
                        size="md"
                        disabled
                      />
                      <div className="game-result-card-owner">
                        {cardOwner?.nickname || ""}
                      </div>
                    </div>
                  );
                })}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed bottom action bar */}
      <AnimatePresence>
        {/* Storyteller: submit clue */}
        {gameState.phase === "storyteller_turn" && isStoryteller && selectedCard !== null && (
          <motion.div
            key="bar-clue"
            className="game-bottombar"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <button
              className="btn-primary game-bottombar-btn"
              onClick={handleSubmitClue}
              disabled={!clue.trim()}
            >
              {t("game.submitClue")}
            </button>
          </motion.div>
        )}

        {/* Players: submit card */}
        {gameState.phase === "players_submit" && !isStoryteller && !gameState.hasSubmitted && selectedCard !== null && (
          <motion.div
            key="bar-card"
            className="game-bottombar"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <button
              className="btn-primary game-bottombar-btn"
              onClick={handleSubmitCard}
            >
              {t("game.submitCard")}
            </button>
          </motion.div>
        )}

        {/* Players: vote */}
        {gameState.phase === "voting" && !isStoryteller && !gameState.hasVoted && selectedCard !== null && (
          <motion.div
            key="bar-vote"
            className="game-bottombar"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <button
              className="btn-primary game-bottombar-btn"
              onClick={handleSubmitVote}
            >
              {t("game.vote")}
            </button>
          </motion.div>
        )}

        {/* Next round - host only */}
        {gameState.phase === "round_result" && roundResult && me?.isHost && (
          <motion.div
            key="bar-next"
            className="game-bottombar"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <button
              className="btn-primary game-bottombar-btn"
              onClick={onNextRound}
            >
              {t("game.nextRound")} →
            </button>
          </motion.div>
        )}

        {/* Waiting for host to proceed */}
        {gameState.phase === "round_result" && roundResult && !me?.isHost && (
          <motion.div
            key="bar-wait"
            className="game-bottombar game-bottombar--waiting"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <span className="game-bottombar-wait-text">
              {t("game.waitingForStoryteller")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score board popup */}
      <ScoreBoard
        players={gameState.players}
        isOpen={showScores}
        onClose={() => setShowScores(false)}
        storytellerId={storyteller?.id}
        currentPlayerId={myId}
        roundHistory={(gameState as any).roundHistory}
      />

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onHide={hideToast}
        type={toast.type}
      />
    </div>
  );
}

