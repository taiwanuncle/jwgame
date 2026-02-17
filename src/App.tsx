import { useEffect } from "react";
import "./i18n";
import "./styles/global.css";
import { useSocket } from "./hooks/useSocket";
import LobbyPage from "./pages/LobbyPage";
import WaitingRoom from "./pages/WaitingRoom";
import GamePage from "./pages/GamePage";
import GameOverPage from "./pages/GameOverPage";
import MusicPlayer from "./components/MusicPlayer";
import { audioManager } from "./utils/audioManager";

function App() {
  const {
    gameState,
    roundResult,
    errorMsg,
    chatMessages,
    availableRooms,
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

  // Music: switch category based on game phase
  useEffect(() => {
    if (!gameState || !gameState.roomCode) {
      audioManager.playCategory("start");
    } else if (gameState.phase === "game_over") {
      audioManager.playCategory("celebration");
    } else if (gameState.phase === "waiting") {
      // Keep lobby music during waiting
      audioManager.playCategory("start");
    } else {
      audioManager.playCategory("playing");
    }
  }, [gameState?.roomCode, gameState?.phase]);

  // No game state = lobby
  if (!gameState || !gameState.roomCode) {
    return (
      <LobbyPage
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
        errorMsg={errorMsg}
        availableRooms={availableRooms}
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

// Wrap with MusicPlayer
function AppWithMusic() {
  return (
    <>
      <App />
      <MusicPlayer />
    </>
  );
}

export default AppWithMusic;
