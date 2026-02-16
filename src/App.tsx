import "./i18n";
import "./styles/global.css";
import { useSocket } from "./hooks/useSocket";
import LobbyPage from "./pages/LobbyPage";
import WaitingRoom from "./pages/WaitingRoom";
import GamePage from "./pages/GamePage";
import GameOverPage from "./pages/GameOverPage";

function App() {
  const {
    gameState,
    roundResult,
    errorMsg,
    createRoom,
    joinRoom,
    toggleReady,
    startGame,
    submitClue,
    submitCard,
    submitVote,
    nextRound,
    playAgain,
    leaveRoom,
  } = useSocket();

  // No game state = lobby
  if (!gameState || !gameState.roomCode) {
    return (
      <LobbyPage
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
        errorMsg={errorMsg}
      />
    );
  }

  // Waiting room
  if (gameState.phase === "waiting") {
    return (
      <WaitingRoom
        gameState={gameState}
        onToggleReady={toggleReady}
        onStartGame={startGame}
        onLeave={leaveRoom}
        errorMsg={errorMsg}
      />
    );
  }

  // Game over
  if (gameState.phase === "game_over") {
    return (
      <GameOverPage
        gameState={gameState}
        onPlayAgain={playAgain}
        onBackToLobby={leaveRoom}
      />
    );
  }

  // Game in progress
  return (
    <GamePage
      gameState={gameState}
      roundResult={roundResult}
      onSubmitClue={submitClue}
      onSubmitCard={submitCard}
      onSubmitVote={submitVote}
      onNextRound={nextRound}
    />
  );
}

export default App;
