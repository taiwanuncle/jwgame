import { useState, useEffect, useCallback, useMemo } from "react";
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
  onPhaseReady: () => void;
}

/* Typing text effect component */
function TypingText({ text, className }: { text: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayedText}
      {!done && <span className="typing-cursor">|</span>}
    </span>
  );
}

/* Particle burst effect */
function ParticleBurst({ active }: { active: boolean }) {
  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (360 / 12) * i,
      distance: 40 + Math.random() * 30,
      size: 4 + Math.random() * 4,
      color: ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF3B30', '#FFD700'][i % 6],
      delay: Math.random() * 0.15,
    })), []);

  if (!active) return null;

  return (
    <div className="particle-burst">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{ duration: 0.6, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function GamePage({
  gameState,
  roundResult,
  onSubmitClue,
  onSubmitCard,
  onSubmitVote,
  onNextRound,
  onPhaseReady,
}: GamePageProps) {
  const { t, i18n } = useTranslation();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showLang, setShowLang] = useState(false);
  const [clue, setClue] = useState("");
  const [showScores, setShowScores] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false, type: "info" as "info" | "warning" | "success" });
  const [phaseGuideAcked, setPhaseGuideAcked] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [guideDisabledToday, setGuideDisabledToday] = useState(() => {
    try {
      const hideUntil = localStorage.getItem("guide_hide_today");
      if (hideUntil) {
        return new Date() < new Date(hideUntil);
      }
    } catch { /* */ }
    return false;
  });
  const [cardSize, setCardSize] = useState<"sm" | "md" | "lg">(() => {
    try {
      const saved = localStorage.getItem("card_size_pref");
      if (saved === "sm" || saved === "md" || saved === "lg") return saved;
    } catch { /* */ }
    return "md";
  });

  const cycleCardSize = () => {
    const next = cardSize === "sm" ? "md" : cardSize === "md" ? "lg" : "sm";
    setCardSize(next);
    try { localStorage.setItem("card_size_pref", next); } catch { /* */ }
    playClick();
  };

  const myId = gameState.myId;
  const me = gameState.players.find((p) => p.id === myId);
  const storyteller = gameState.players[gameState.storytellerIndex];
  const isStoryteller = storyteller?.id === myId;
  const myHand = gameState.myHand || [];

  // Determine current guide key (phase + role)
  const getGuideKey = (): string | null => {
    const phase = gameState.phase;
    if (phase === "storyteller_turn") return isStoryteller ? "storyteller_turn" : "storyteller_wait";
    if (phase === "players_submit") return isStoryteller ? "submit_wait" : "players_submit";
    if (phase === "shuffle") return "shuffle";
    if (phase === "voting") return isStoryteller ? "voting_wait" : "voting";
    if (phase === "round_result") return "round_result";
    return null;
  };
  const currentGuideKey = getGuideKey();
  const showGuide = currentGuideKey !== null && phaseGuideAcked !== currentGuideKey && !guideDisabledToday;

  // Reset guide on phase/round change
  useEffect(() => {
    setPhaseGuideAcked(null);
  }, [gameState.phase, gameState.currentRound]);

  // If guide is disabled today, auto-send phase_ready immediately
  useEffect(() => {
    if (guideDisabledToday && currentGuideKey !== null && currentGuideKey !== "shuffle") {
      onPhaseReady();
    }
  }, [guideDisabledToday, currentGuideKey, onPhaseReady]);

  // Auto-dismiss shuffle guide after 1.5s
  useEffect(() => {
    if (currentGuideKey === "shuffle" && showGuide) {
      const timer = setTimeout(() => setPhaseGuideAcked("shuffle"), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentGuideKey, showGuide]);

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
    setShowParticles(false);
  }, [gameState.phase, gameState.currentRound]);

  // Last round notification
  useEffect(() => {
    if (gameState.currentRound === gameState.totalRounds && gameState.phase === "storyteller_turn") {
      showToast(t("toast.lastRound"), "warning");
    }
  }, [gameState.currentRound, gameState.totalRounds, gameState.phase, showToast, t]);

  // Round result tips — show after guide is dismissed
  useEffect(() => {
    if (gameState.phase === "round_result" && roundResult && !showGuide) {
      if (roundResult.allCorrect) {
        showToast(t("toast.everyoneCorrectTip"), "warning");
      } else if (roundResult.noneCorrect) {
        showToast(t("toast.nobodyCorrectTip"), "warning");
      } else {
        showToast(t("toast.someCorrectTip"), "success");
      }
    }
  }, [gameState.phase, roundResult, showGuide, showToast, t]);

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
    // Particle burst on vote selection
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 700);
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

  // Phase transition variants
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
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
        <div className="game-topbar-actions">
          <div className="game-lang-wrap">
            <button className="game-lang-btn" onClick={() => setShowLang(!showLang)}>
              🌐 Lang
            </button>
            <AnimatePresence>
              {showLang && (
                <>
                  <div className="game-lang-backdrop" onClick={() => setShowLang(false)} />
                  <motion.div
                    className="game-lang-dropdown"
                    initial={{ opacity: 0, scale: 0.9, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -6 }}
                    transition={{ duration: 0.12 }}
                  >
                    {([
                      { code: "ko", label: "한국어" },
                      { code: "en", label: "English" },
                      { code: "zh", label: "简体中文" },
                      { code: "zh-TW", label: "繁體中文" },
                      { code: "my", label: "မြန်မာ" },
                      { code: "th", label: "ไทย" },
                    ] as const).map((lang) => (
                      <button
                        key={lang.code}
                        className={`game-lang-item ${i18n.language === lang.code ? "game-lang-item--active" : ""}`}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          try { localStorage.setItem("app_lang", lang.code); } catch { /* */ }
                          setShowLang(false);
                        }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <button className="game-size-btn" onClick={cycleCardSize}>
            Size {cardSize.toUpperCase()}
          </button>
          <button
            className="game-score-btn"
            onClick={() => setShowScores(true)}
          >
            {t("game.scores")}
          </button>
        </div>
      </div>

      {/* Timer bar */}
      <CountdownBar timerEnd={gameState.timerEnd} />

      {/* Clue display with typing effect */}
      {gameState.clue && gameState.phase !== "storyteller_turn" && (
        <motion.div
          className="game-clue-display"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="game-clue-label">{t("game.clue")}:</span>
          <TypingText text={gameState.clue} className="game-clue-text" />
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
              {...pageTransition}
            >
              <div className="game-phase-step">
                <span className="game-phase-step-num">{t("game.phase1")}</span>
                <span className="game-phase-step-label">{t("game.phase1Desc")}</span>
              </div>
              <div className="game-instruction">
                <h3>{t("game.yourTurn")}</h3>
                <p>{selectedCard === null ? t("game.selectCard") : t("game.enterClueHint")}</p>
              </div>

              {/* Clue input — above cards, highlighted */}
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
                {myHand.map((cardId, index) => (
                  <BibleCard
                    key={cardId}
                    cardId={cardId}
                    selected={selectedCard === cardId}
                    onClick={() => { playSelect(); setSelectedCard(cardId); }}
                    size={cardSize}
                    dealDelay={index * 0.08}
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
              {...pageTransition}
            >
              <div className="game-phase-step">
                <span className="game-phase-step-num">{t("game.phase1")}</span>
                <span className="game-phase-step-label">{t("game.phase1Desc")}</span>
              </div>
              <div className="game-waiting-icon">⏳</div>
              <p>{t("game.waitingForClue")}</p>
              <div className="game-hand game-hand--small">
                {myHand.map((cardId, index) => (
                  <BibleCard key={cardId} cardId={cardId} size="sm" disabled dealDelay={index * 0.06} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Players submit cards */}
          {gameState.phase === "players_submit" && !isStoryteller && (
            <motion.div
              key="submit"
              className="game-phase"
              {...pageTransition}
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
                    {myHand.map((cardId, index) => (
                      <BibleCard
                        key={cardId}
                        cardId={cardId}
                        selected={selectedCard === cardId}
                        onClick={() => { playSelect(); setSelectedCard(cardId); }}
                        size={cardSize}
                        dealDelay={index * 0.08}
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
              {...pageTransition}
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
              {...pageTransition}
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
              {...pageTransition}
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
                    {gameState.shuffledCards.map((cardId, index) => (
                      <div key={cardId} className="vote-card-wrapper" style={{ position: 'relative' }}>
                        <BibleCard
                          cardId={cardId}
                          selected={selectedCard === cardId}
                          onClick={() => handleVoteClick(cardId)}
                          size={cardSize}
                          dealDelay={index * 0.1}
                        />
                        {selectedCard === cardId && showParticles && (
                          <ParticleBurst active={true} />
                        )}
                      </div>
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
              {...pageTransition}
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

          {/* Round result — cards flip to reveal! */}
          {gameState.phase === "round_result" && roundResult && (
            <motion.div
              key="result"
              className="game-phase"
              {...pageTransition}
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
                  .map((sc, index) => {
                    const player = gameState.players.find(
                      (p) => p.id === sc.playerId
                    );
                    const isBonus = sc.reason === "bonus";
                    return (
                      <motion.div
                        key={`${sc.playerId}-${sc.reason}`}
                        className={`game-result-score-item ${isBonus ? "game-result-score-item--bonus" : ""}`}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 300 }}
                      >
                        <span>{player?.nickname}</span>
                        <span className={`game-result-points ${isBonus ? "game-result-points--bonus" : ""}`}>
                          +{sc.points}{isBonus ? ` ${t("score.bonus")}` : ""}
                        </span>
                      </motion.div>
                    );
                  })}
              </div>

              <div className="game-board">
                {gameState.shuffledCards.map((cardId, index) => {
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
                    <motion.div
                      key={cardId}
                      className="game-result-card-wrapper"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.15 }}
                    >
                      {/* Card label */}
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.6 }}
                      >
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
                        {!isStorytellerCard && !isMySubmission && (
                          <div className="game-result-card-label game-result-card-label--spacer" />
                        )}
                      </motion.div>
                      <BibleCard
                        cardId={cardId}
                        highlight={highlight}
                        showVoteCount={getVoteCountForCard(cardId)}
                        size={cardSize}
                        disabled
                        flipReveal
                        flipDelay={index * 0.15}
                      />
                      <motion.div
                        className="game-result-card-owner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.15 + 0.5 }}
                      >
                        {cardOwner?.nickname || ""}
                      </motion.div>
                    </motion.div>
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

      {/* Phase guide overlay */}
      <AnimatePresence>
        {showGuide && currentGuideKey !== "shuffle" && (
          <motion.div
            key="phase-guide"
            className="phase-guide-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="phase-guide-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="phase-guide-icon">
                {currentGuideKey === "storyteller_turn" && "🎨"}
                {currentGuideKey === "storyteller_wait" && "⏳"}
                {currentGuideKey === "players_submit" && "🃏"}
                {currentGuideKey === "submit_wait" && "📋"}
                {currentGuideKey === "voting" && "🗳️"}
                {currentGuideKey === "voting_wait" && "🗳️"}
                {currentGuideKey === "round_result" && "📊"}
              </div>
              <h3 className="phase-guide-title">
                {t(`guide.${currentGuideKey}_title`)}
              </h3>
              <p className="phase-guide-text">
                {t(`guide.${currentGuideKey}_desc`)}
              </p>
              {currentGuideKey !== "round_result" && (
                <p className="phase-guide-tip">
                  {t(`guide.${currentGuideKey}_tip`)}
                </p>
              )}
              <button
                className="btn-primary phase-guide-btn"
                onClick={() => {
                  playClick();
                  setPhaseGuideAcked(currentGuideKey);
                  onPhaseReady();
                }}
              >
                {t("guide.ok")}
              </button>
              <label className="phase-guide-hide-today">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setGuideDisabledToday(checked);
                    try {
                      if (checked) {
                        const eod = new Date();
                        eod.setHours(23, 59, 59, 999);
                        localStorage.setItem("guide_hide_today", eod.toISOString());
                      } else {
                        localStorage.removeItem("guide_hide_today");
                      }
                    } catch { /* */ }
                  }}
                />
                <span>{t("guide.hideToday")}</span>
              </label>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
