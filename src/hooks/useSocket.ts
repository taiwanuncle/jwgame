import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { RoundResult } from "../types";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;

export interface GameStateFromServer {
  roomCode: string;
  players: {
    id: string;
    nickname: string;
    avatarIndex: number;
    ready: boolean;
    isHost: boolean;
    score: number;
    handCount: number;
    connected: boolean;
  }[];
  phase: string;
  currentRound: number;
  totalRounds: number;
  storytellerIndex: number;
  clue: string;
  shuffledCards: number[];
  submittedCount: number;
  votedCount: number;
  storytellerCardId: number | null;
  myHand?: number[];
  myId?: string;
  hasSubmitted?: boolean;
  hasVoted?: boolean;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameStateFromServer | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("game_state", (state: GameStateFromServer) => {
      setGameState(state);
    });

    socket.on("round_result", (result: RoundResult) => {
      setRoundResult(result);
    });

    socket.on("error_msg", ({ message }: { message: string }) => {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(""), 3000);
    });

    socket.on("room_created", () => {});
    socket.on("room_joined", () => {});
    socket.on("game_started", () => {
      setRoundResult(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = useCallback(
    (nickname: string, avatarIndex: number) => {
      socketRef.current?.emit("create_room", { nickname, avatarIndex });
    },
    []
  );

  const joinRoom = useCallback(
    (roomCode: string, nickname: string, avatarIndex: number) => {
      socketRef.current?.emit("join_room", { roomCode, nickname, avatarIndex });
    },
    []
  );

  const toggleReady = useCallback(() => {
    socketRef.current?.emit("toggle_ready");
  }, []);

  const startGame = useCallback(() => {
    socketRef.current?.emit("start_game");
  }, []);

  const submitClue = useCallback((cardId: number, clue: string) => {
    socketRef.current?.emit("submit_clue", { cardId, clue });
  }, []);

  const submitCard = useCallback((cardId: number) => {
    socketRef.current?.emit("submit_card", { cardId });
  }, []);

  const submitVote = useCallback((cardId: number) => {
    socketRef.current?.emit("submit_vote", { cardId });
  }, []);

  const nextRound = useCallback(() => {
    socketRef.current?.emit("next_round");
    setRoundResult(null);
  }, []);

  const playAgain = useCallback(() => {
    socketRef.current?.emit("play_again");
    setRoundResult(null);
  }, []);

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit("leave_room");
    setGameState(null);
    setRoundResult(null);
  }, []);

  return {
    connected,
    gameState,
    roundResult,
    errorMsg,
    socketId: socketRef.current?.id || "",
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
  };
}
