import { useEffect } from "react";
import "./i18n";
import "./styles/global.css";
import { useSocket } from "./hooks/useSocket";
import LobbyPage from "./pages/LobbyPage";
import WaitingRoom from "./pages/WaitingRoom";
import GamePage from "./pages/GamePage";
import GameOverPage from "./pages/GameOverPage";
import MusicPlayer from "./components/MusicPlayer";
import GlobalChat from "./components/GlobalChat";
import LanguageToggle from "./components/LanguageToggle";
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
    phaseReady,
    leaveRoom,
  } = useSocket();

  const isLobby = !gameState || !gameState.roomCode;
  const isWaiting = gameState?.phase === "waiting";
  const inRoom = !isLobby; // Show chat whenever player is in a room

  // Music: switch category based on game phase
  useEffect(() => {
    if (isLobby || isWaiting) {
      audioManager.playCategory("start");
    } else if (gameState?.phase === "game_over") {
      audioManager.playCategory("celebration");
    } else {
      audioManager.playCategory("playing");
    }
  }, [isLobby, isWaiting, gameState?.phase]);

  // When leaving lobby/waiting (entering game), exit playlist mode
  useEffect(() => {
    if (!isLobby && !isWaiting) {
      audioManager.exitPlaylistMode();
    }
  }, [isLobby, isWaiting]);

  let page: React.ReactNode;

  if (isLobby) {
    page = (
      <LobbyPage
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
        errorMsg={errorMsg}
        availableRooms={availableRooms}
      />
    );
  } else if (isWaiting) {
    page = (
      <WaitingRoom
        gameState={gameState}
        onToggleReady={toggleReady}
        onSetRounds={setRounds}
        onStartGame={startGame}
        onLeave={leaveRoom}
        errorMsg={errorMsg}
      />
    );
  } else if (gameState.phase === "game_over") {
    page = (
      <GameOverPage
        gameState={gameState}
        onPlayAgain={playAgain}
        onBackToLobby={leaveRoom}
      />
    );
  } else {
    page = (
      <GamePage
        gameState={gameState}
        roundResult={roundResult}
        onSubmitClue={submitClue}
        onSubmitCard={submitCard}
        onSubmitVote={submitVote}
        onNextRound={nextRound}
        onPhaseReady={phaseReady}
      />
    );
  }

  return (
    <>
      {page}
      <LanguageToggle hide={!isLobby && !isWaiting && gameState?.phase !== "game_over"} />
      <MusicPlayer isLobby={isLobby || isWaiting} />
      {inRoom && (
        <GlobalChat
          messages={chatMessages}
          onSend={sendChat}
          myId={gameState?.myId}
        />
      )}
    </>
  );
}

export default App;
