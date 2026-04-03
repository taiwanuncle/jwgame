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

export interface AvailableRoom {
  roomCode: string;
  hostNickname: string;
  playerCount: number;
  maxPlayers: number;
  totalRounds: number;
}

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;

// Session persistence keys
const SESSION_KEY = "game_session";

interface SavedSession {
  roomCode: string;
  persistentId: string;
}

function saveSession(roomCode: string, persistentId: string) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ roomCode, persistentId }));
  } catch { /* ignore */ }
}

function loadSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

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
    isBot?: boolean;
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
  const rejoinAttemptedRef = useRef(false);
  // Keep session credentials in memory so we can re-save after "play again"
  const sessionRef = useRef<SavedSession | null>(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameStateFromServer | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);

  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);

      // Auto-rejoin on reconnect if we have a saved session
      if (!rejoinAttemptedRef.current) {
        rejoinAttemptedRef.current = true;
        const session = loadSession();
        if (session) {
          socket.emit("rejoin_room", {
            roomCode: session.roomCode,
            persistentId: session.persistentId,
          });
        }
      }
    });
    socket.on("disconnect", () => setConnected(false));

    socket.on("game_state", (state: GameStateFromServer) => {
      // Ignore game_state updates after user chose to leave
      if (leavingRef.current) return;
      setGameState(state);

      if (state.phase === "game_over") {
        // Clear localStorage so browser restart won't show celebration again,
        // but keep credentials in memory for "play again"
        clearSession();
      } else if (!loadSession() && sessionRef.current) {
        // New game started after game_over (e.g. "play again"):
        // re-save session so mid-game refresh can rejoin
        saveSession(sessionRef.current.roomCode, sessionRef.current.persistentId);
      }
    });

    socket.on("round_result", (result: RoundResult) => {
      if (leavingRef.current) return;
      setRoundResult(result);
    });

    socket.on("error_msg", ({ message }: { message: string }) => {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(""), 3000);
    });

    socket.on("room_created", ({ persistentId, roomCode }: { persistentId: string; roomCode: string }) => {
      leavingRef.current = false;
      sessionRef.current = { roomCode, persistentId };
      saveSession(roomCode, persistentId);
    });
    socket.on("room_joined", ({ persistentId, roomCode }: { persistentId: string; roomCode: string }) => {
      leavingRef.current = false;
      sessionRef.current = { roomCode, persistentId };
      saveSession(roomCode, persistentId);
    });
    socket.on("rejoin_success", ({ persistentId, roomCode }: { persistentId: string; roomCode: string }) => {
      leavingRef.current = false;
      sessionRef.current = { roomCode, persistentId };
      saveSession(roomCode, persistentId);
    });
    socket.on("game_started", () => {
      setRoundResult(null);
    });

    socket.on("chat_message", (msg: ChatMessage) => {
      if (leavingRef.current) return;
      setChatMessages((prev) => [...prev.slice(-50), msg]);
    });

    socket.on("rooms_updated", (rooms: AvailableRoom[]) => {
      setAvailableRooms(rooms);
    });

    // Request initial room list
    socket.emit("get_rooms");

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = useCallback(
    (nickname: string, avatarIndex: number, lang?: string) => {
      socketRef.current?.emit("create_room", { nickname, avatarIndex, lang });
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
  }, []);

  const playAgain = useCallback(() => {
    socketRef.current?.emit("play_again");
    setRoundResult(null);
  }, []);

  const sendChat = useCallback((message: string) => {
    socketRef.current?.emit("send_chat", { message });
  }, []);

  const refreshRooms = useCallback(() => {
    socketRef.current?.emit("get_rooms");
  }, []);

  const phaseReady = useCallback(() => {
    socketRef.current?.emit("phase_ready");
  }, []);

  const createSoloRoom = useCallback(
    (nickname: string, avatarIndex: number, botCount: number, lang?: string) => {
      socketRef.current?.emit("create_solo_room", { nickname, avatarIndex, botCount, lang });
    },
    []
  );

  const addBot = useCallback(() => {
    socketRef.current?.emit("add_bot");
  }, []);

  const removeBot = useCallback(() => {
    socketRef.current?.emit("remove_bot");
  }, []);

  const leaveRoom = useCallback(() => {
    leavingRef.current = true;
    socketRef.current?.emit("leave_room");
    setGameState(null);
    setRoundResult(null);
    setChatMessages([]);
    sessionRef.current = null;
    clearSession();
  }, []);

  return {
    connected,
    gameState,
    roundResult,
    errorMsg,
    chatMessages,
    availableRooms,
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
    refreshRooms,
    phaseReady,
    leaveRoom,
    createSoloRoom,
    addBot,
    removeBot,
  };
}
