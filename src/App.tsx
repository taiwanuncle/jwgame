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
    chatMessages,
    createRoom,
    joinRoom,
    toggleReady,
    setRounds,
    startGame,
    submitClue,
    submitCard,
    submitVote,
    nextRound,
    playAgain,
    sendChat,
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
        onSetRounds={setRounds}
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
        chatMessages={chatMessages}
        onSendChat={sendChat}
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
      chatMessages={chatMessages}
      onSendChat={sendChat}
    />
  );
}

export default App;
