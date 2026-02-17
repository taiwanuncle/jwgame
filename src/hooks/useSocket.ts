import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { RoundResult } from "../types";

export interface ChatMessage {
  playerId: string;
  nickname: string;
  avatarIndex: number;
  message: string;
  timestamp: number;
}

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
  submittedPlayerIds: string[];
  votedCount: number;
  votedPlayerIds: string[];
  storytellerCardId: number | null;
  myHand?: number[];
  myId?: string;
  hasSubmitted?: boolean;
  mySubmittedCardId?: number | null;
  hasVoted?: boolean;
  timerEnd?: number | null;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const leavingRef = useRef(false);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameStateFromServer | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("game_state", (state: GameStateFromServer) => {
      // Ignore game_state updates after user chose to leave
      if (leavingRef.current) return;
      setGameState(state);
    });

    socket.on("round_result", (result: RoundResult) => {
      if (leavingRef.current) return;
      setRoundResult(result);
    });

    socket.on("error_msg", ({ message }: { message: string }) => {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(""), 3000);
    });

    socket.on("room_created", () => {
      leavingRef.current = false;
    });
    socket.on("room_joined", () => {
      leavingRef.current = false;
    });
    socket.on("game_started", () => {
      setRoundResult(null);
      setChatMessages([]);
    });

    socket.on("chat_message", (msg: ChatMessage) => {
      if (leavingRef.current) return;
      setChatMessages((prev) => [...prev.slice(-50), msg]);
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

  const setRounds = useCallback((rounds: number) => {
    socketRef.current?.emit("set_rounds", { rounds });
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
    setChatMessages([]);
  }, []);

  const playAgain = useCallback(() => {
    socketRef.current?.emit("play_again");
    setRoundResult(null);
  }, []);

  const sendChat = useCallback((message: string) => {
    socketRef.current?.emit("send_chat", { message });
  }, []);

  const leaveRoom = useCallback(() => {
    leavingRef.current = true;
    socketRef.current?.emit("leave_room");
    setGameState(null);
    setRoundResult(null);
    setChatMessages([]);
  }, []);

  return {
    connected,
    gameState,
    roundResult,
    errorMsg,
    chatMessages,
    socketId: socketRef.current?.id || "",
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
  };
}
