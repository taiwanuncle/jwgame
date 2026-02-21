const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

app.get("/", (req, res) => {
  res.json({ status: "ok", rooms: rooms.size });
});
const TOTAL_CARDS = 128;
const HAND_SIZE = 6;
const TOTAL_ROUNDS = 10;
const MAX_PLAYERS = 10;

// Timer durations (seconds)
const TIMER = {
  storyteller_turn: 60,
  players_submit: 30,
  voting: 20,
  // round_result: no timer - host manually proceeds (chat time)
};

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function createDeck() {
  const deck = [];
  for (let i = 1; i <= TOTAL_CARDS; i++) {
    deck.push(i);
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Auto-adjust totalRounds when player count changes (waiting phase only)
function adjustRoundsForPlayerCount(room) {
  if (room.phase !== "waiting") return;
  const count = room.players.length;
  if (count < 1) return;
  // If current totalRounds is not a multiple of player count, pick nearest multiple
  if (room.totalRounds % count !== 0) {
    const nearest = Math.round(room.totalRounds / count) * count;
    room.totalRounds = Math.max(count, Math.min(count * 5, nearest || count));
  }
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// --- Timer management ---
function clearRoomTimer(room) {
  if (room.timer) {
    clearTimeout(room.timer);
    room.timer = null;
  }
  if (room.guideTimeout) {
    clearTimeout(room.guideTimeout);
    room.guideTimeout = null;
  }
  room.timerEnd = null;
}

function startPhaseTimer(room) {
  clearRoomTimer(room);

  const phase = room.phase;
  const duration = TIMER[phase];
  if (!duration) return;

  // Defer timer start — wait for phase_ready from players
  room.timerPaused = true;
  room.phaseReadyPlayers = new Set();

  // Safety: auto-activate after 5 seconds if nobody sends phase_ready
  room.guideTimeout = setTimeout(() => {
    room.guideTimeout = null;
    if (room.timerPaused) {
      activatePhaseTimer(room);
    }
  }, 5000);
}

// Actually start the countdown (called when phase_ready condition met)
function activatePhaseTimer(room) {
  if (!room.timerPaused) return;
  room.timerPaused = false;

  // Clear guide safety timeout
  if (room.guideTimeout) {
    clearTimeout(room.guideTimeout);
    room.guideTimeout = null;
  }

  const phase = room.phase;
  const duration = TIMER[phase];
  if (!duration) return;

  room.timerEnd = Date.now() + duration * 1000;

  room.timer = setTimeout(() => {
    room.timer = null;
    room.timerEnd = null;
    handleTimerExpired(room);
  }, duration * 1000);

  emitPersonalStates(room);
}

function handleTimerExpired(room) {
  if (!room) return;
  const phase = room.phase;

  if (phase === "storyteller_turn") {
    // Auto-submit random card + default clue for storyteller
    const storyteller = room.players[room.storytellerIndex];
    if (storyteller.hand.length > 0) {
      const randomIndex = Math.floor(Math.random() * storyteller.hand.length);
      const cardId = storyteller.hand[randomIndex];
      room.clue = "...";
      room.storytellerCardId = cardId;
      room.submittedCards = [{ playerId: storyteller.id, cardId }];
      storyteller.hand = storyteller.hand.filter((c) => c !== cardId);
      room.phase = "players_submit";
      startPhaseTimer(room);
      emitPersonalStates(room);
      // Check if all non-storyteller players are disconnected
      checkDisconnectAutoAdvance(room);
    }
  } else if (phase === "players_submit") {
    // Auto-submit random card for players who haven't submitted
    const storyteller = room.players[room.storytellerIndex];
    room.players.forEach((p) => {
      if (p.id === storyteller.id) return;
      const alreadySubmitted = room.submittedCards.some(
        (s) => s.playerId === p.id
      );
      if (!alreadySubmitted && p.hand.length > 0) {
        const randomIndex = Math.floor(Math.random() * p.hand.length);
        const cardId = p.hand[randomIndex];
        room.submittedCards.push({ playerId: p.id, cardId });
        p.hand = p.hand.filter((c) => c !== cardId);
      }
    });

    // Move to shuffle -> voting
    room.phase = "shuffle";
    room.shuffledCards = shuffleArray(
      room.submittedCards.map((s) => s.cardId)
    );
    emitPersonalStates(room);

    setTimeout(() => {
      if (room.phase !== "shuffle") return; // guard
      room.phase = "voting";
      startPhaseTimer(room);
      emitPersonalStates(room);
      checkDisconnectAutoAdvance(room);
    }, 3000);
  } else if (phase === "voting") {
    // Auto-vote random for players who haven't voted
    const storyteller = room.players[room.storytellerIndex];
    room.players.forEach((p) => {
      if (p.id === storyteller.id) return;
      const alreadyVoted = room.votes.some((v) => v.voterId === p.id);
      if (!alreadyVoted) {
        const mySubmission = room.submittedCards.find(
          (s) => s.playerId === p.id
        );
        const votableCards = room.shuffledCards.filter(
          (cardId) => !mySubmission || mySubmission.cardId !== cardId
        );
        if (votableCards.length > 0) {
          const randomCard =
            votableCards[Math.floor(Math.random() * votableCards.length)];
          room.votes.push({ voterId: p.id, cardId: randomCard });
        }
      }
    });

    const roundResult = calculateScores(room);
    roundResult.round = room.currentRound;
    room.roundHistory.push(roundResult);
    room.phase = "round_result";
    io.to(room.roomCode).emit("round_result", roundResult);
    startPhaseTimer(room);
    emitPersonalStates(room);
  // round_result: no auto-advance, host clicks "next round"
  }
}

// Check if disconnected players are the only ones we're waiting on
function checkDisconnectAutoAdvance(room) {
  const phase = room.phase;
  const storyteller = room.players[room.storytellerIndex];

  if (phase === "storyteller_turn") {
    if (!storyteller.connected) {
      clearRoomTimer(room);
      handleTimerExpired(room);
      return true;
    }
  } else if (phase === "players_submit") {
    const waitingOn = room.players.filter((p) => {
      if (p.id === storyteller.id) return false;
      if (!p.connected) return false;
      return !room.submittedCards.some((s) => s.playerId === p.id);
    });
    if (waitingOn.length === 0) {
      clearRoomTimer(room);
      handleTimerExpired(room);
      return true;
    }
  } else if (phase === "voting") {
    const waitingOn = room.players.filter((p) => {
      if (p.id === storyteller.id) return false;
      if (!p.connected) return false;
      return !room.votes.some((v) => v.voterId === p.id);
    });
    if (waitingOn.length === 0) {
      clearRoomTimer(room);
      handleTimerExpired(room);
      return true;
    }
  }
  return false;
}

// --- Advance round ---
function advanceToNextRound(room) {
  clearRoomTimer(room);

  if (room.currentRound >= room.totalRounds) {
    room.phase = "game_over";
    emitPersonalStates(room);
    return;
  }

  room.currentRound += 1;

  // Find next connected storyteller (skip disconnected)
  let nextIndex = (room.storytellerIndex + 1) % room.players.length;
  let attempts = 0;
  while (!room.players[nextIndex].connected && attempts < room.players.length) {
    nextIndex = (nextIndex + 1) % room.players.length;
    attempts++;
  }
  room.storytellerIndex = nextIndex;

  room.players.forEach((p) => {
    if (room.deck.length > 0) {
      p.hand.push(room.deck.shift());
    }
  });

  room.clue = "";
  room.submittedCards = [];
  room.shuffledCards = [];
  room.votes = [];
  room.storytellerCardId = null;
  room.phase = "storyteller_turn";

  startPhaseTimer(room);
  emitPersonalStates(room);
}

function calculateScores(room) {
  const { players, submittedCards, votes, storytellerIndex } = room;
  const storyteller = players[storytellerIndex];
  const storytellerSubmission = submittedCards.find(
    (s) => s.playerId === storyteller.id
  );
  const storytellerCardId = storytellerSubmission.cardId;

  const correctVoters = votes.filter((v) => v.cardId === storytellerCardId);
  const otherPlayers = players.filter((p) => p.id !== storyteller.id);
  const allCorrect = correctVoters.length === otherPlayers.length;
  const noneCorrect = correctVoters.length === 0;

  const scoreChanges = [];

  if (allCorrect) {
    scoreChanges.push({
      playerId: storyteller.id,
      points: 0,
      reason: "everyone_correct",
    });
    otherPlayers.forEach((p) => {
      scoreChanges.push({
        playerId: p.id,
        points: 2,
        reason: "everyone_correct",
      });
      p.score += 2;
    });
  } else if (noneCorrect) {
    scoreChanges.push({
      playerId: storyteller.id,
      points: 0,
      reason: "nobody_correct",
    });
    otherPlayers.forEach((p) => {
      scoreChanges.push({
        playerId: p.id,
        points: 2,
        reason: "nobody_correct",
      });
      p.score += 2;
    });
  } else {
    storyteller.score += 3;
    scoreChanges.push({
      playerId: storyteller.id,
      points: 3,
      reason: "some_correct",
    });
    correctVoters.forEach((v) => {
      const player = players.find((p) => p.id === v.voterId);
      if (player) {
        player.score += 3;
        scoreChanges.push({
          playerId: player.id,
          points: 3,
          reason: "correct_guess",
        });
      }
    });
  }

  if (noneCorrect || !allCorrect) {
    const wrongVotes = noneCorrect
      ? votes
      : votes.filter((v) => v.cardId !== storytellerCardId);

    wrongVotes.forEach((v) => {
      const submission = submittedCards.find(
        (s) => s.cardId === v.cardId && s.playerId !== storyteller.id
      );
      if (submission) {
        const cardOwner = players.find((p) => p.id === submission.playerId);
        if (cardOwner) {
          cardOwner.score += 1;
          const existing = scoreChanges.find(
            (sc) => sc.playerId === cardOwner.id && sc.reason === "bonus"
          );
          if (existing) {
            existing.points += 1;
          } else {
            scoreChanges.push({
              playerId: cardOwner.id,
              points: 1,
              reason: "bonus",
            });
          }
        }
      }
    });
  }

  return {
    storytellerCardId,
    storytellerId: storyteller.id,
    clue: room.clue,
    submissions: submittedCards,
    votes,
    scoreChanges,
    allCorrect,
    noneCorrect,
  };
}

// --- Room listing for lobby ---
function getAvailableRooms() {
  const list = [];
  rooms.forEach((room) => {
    if (room.phase === "waiting" && room.players.length < MAX_PLAYERS) {
      const host = room.players.find((p) => p.isHost);
      list.push({
        roomCode: room.roomCode,
        hostNickname: host ? host.nickname : "???",
        playerCount: room.players.length,
        maxPlayers: MAX_PLAYERS,
        totalRounds: room.totalRounds,
      });
    }
  });
  return list;
}

function broadcastRoomsToLobby() {
  io.to("lobby").emit("rooms_updated", getAvailableRooms());
}

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);

  // Auto-join lobby room on connect (for room browsing)
  socket.join("lobby");

  socket.on("get_rooms", () => {
    socket.emit("rooms_updated", getAvailableRooms());
  });

  socket.on("create_room", ({ nickname, avatarIndex }) => {
    const roomCode = generateRoomCode();
    const persistentId = uuidv4();
    const player = {
      id: socket.id,
      persistentId,
      nickname,
      avatarIndex,
      ready: false,
      isHost: true,
      score: 0,
      hand: [],
      connected: true,
    };

    const room = {
      roomCode,
      players: [player],
      phase: "waiting",
      currentRound: 0,
      totalRounds: TOTAL_ROUNDS,
      storytellerIndex: 0,
      clue: "",
      submittedCards: [],
      shuffledCards: [],
      votes: [],
      deck: [],
      storytellerCardId: null,
      roundHistory: [],
      timer: null,
      timerEnd: null,
      timerPaused: false,
      guideTimeout: null,
      phaseReadyPlayers: new Set(),
    };

    rooms.set(roomCode, room);
    socket.leave("lobby");
    socket.join(roomCode);
    socket.roomCode = roomCode;

    socket.emit("room_created", { roomCode, player, persistentId });
    emitPersonalStates(room);
    broadcastRoomsToLobby();
  });

  socket.on("join_room", ({ roomCode, nickname, avatarIndex }) => {
    const room = rooms.get(roomCode);
    if (!room) {
      socket.emit("error_msg", { message: "방을 찾을 수 없습니다." });
      return;
    }
    if (room.players.length >= MAX_PLAYERS) {
      socket.emit("error_msg", { message: "방이 가득 찼습니다." });
      return;
    }
    if (room.phase !== "waiting") {
      socket.emit("error_msg", { message: "게임이 이미 진행 중입니다." });
      return;
    }

    const persistentId = uuidv4();
    const player = {
      id: socket.id,
      persistentId,
      nickname,
      avatarIndex,
      ready: false,
      isHost: false,
      score: 0,
      hand: [],
      connected: true,
    };

    room.players.push(player);
    socket.leave("lobby");
    socket.join(roomCode);
    socket.roomCode = roomCode;

    // Auto-adjust totalRounds to nearest valid multiple of new player count
    adjustRoundsForPlayerCount(room);

    socket.emit("room_joined", { roomCode, player, persistentId });
    emitPersonalStates(room);
    broadcastRoomsToLobby();
  });

  socket.on("toggle_ready", () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
    player.ready = !player.ready;
    emitPersonalStates(room);
  });

  socket.on("set_rounds", ({ rounds }) => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.isHost) return;
    if (room.phase !== "waiting") return;
    // Validate rounds: must be a multiple of player count, between playerCount and playerCount*5
    const playerCount = room.players.length;
    const minRounds = playerCount;
    const maxRounds = playerCount * 5;
    if (rounds < minRounds || rounds > maxRounds || rounds % playerCount !== 0) return;
    room.totalRounds = rounds;
    emitPersonalStates(room);
    broadcastRoomsToLobby();
  });

  socket.on("start_game", () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.isHost) return;

    if (room.players.length < 3) {
      socket.emit("error_msg", { message: "최소 3명이 필요합니다." });
      return;
    }

    const allReady = room.players
      .filter((p) => !p.isHost)
      .every((p) => p.ready);
    if (!allReady) {
      socket.emit("error_msg", {
        message: "모든 플레이어가 준비되지 않았습니다.",
      });
      return;
    }

    room.deck = createDeck();
    room.currentRound = 1;
    room.storytellerIndex = 0;

    room.players.forEach((p) => {
      p.score = 0;
      p.hand = room.deck.splice(0, HAND_SIZE);
    });

    room.phase = "storyteller_turn";
    room.clue = "";
    room.submittedCards = [];
    room.shuffledCards = [];
    room.votes = [];

    io.to(room.roomCode).emit("game_started");
    startPhaseTimer(room);
    emitPersonalStates(room);
    broadcastRoomsToLobby();
  });

  socket.on("submit_clue", ({ cardId, clue }) => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.phase !== "storyteller_turn") return;
    const storyteller = room.players[room.storytellerIndex];
    if (storyteller.id !== socket.id) return;

    if (!storyteller.hand.includes(cardId)) return;

    room.clue = clue;
    room.storytellerCardId = cardId;
    room.submittedCards = [{ playerId: socket.id, cardId }];

    storyteller.hand = storyteller.hand.filter((c) => c !== cardId);

    room.phase = "players_submit";
    startPhaseTimer(room);
    emitPersonalStates(room);

    checkDisconnectAutoAdvance(room);
  });

  socket.on("submit_card", ({ cardId }) => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.phase !== "players_submit") return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;

    const storyteller = room.players[room.storytellerIndex];
    if (storyteller.id === socket.id) return;

    if (!player.hand.includes(cardId)) return;

    const existing = room.submittedCards.find(
      (s) => s.playerId === socket.id
    );
    if (existing) return;

    room.submittedCards.push({ playerId: socket.id, cardId });
    player.hand = player.hand.filter((c) => c !== cardId);

    const expectedSubmissions = room.players.length;
    if (room.submittedCards.length === expectedSubmissions) {
      clearRoomTimer(room);
      room.phase = "shuffle";
      room.shuffledCards = shuffleArray(
        room.submittedCards.map((s) => s.cardId)
      );
      emitPersonalStates(room);

      setTimeout(() => {
        if (room.phase !== "shuffle") return;
        room.phase = "voting";
        startPhaseTimer(room);
        emitPersonalStates(room);
        checkDisconnectAutoAdvance(room);
      }, 3000);
    } else {
      emitPersonalStates(room);
    }
  });

  socket.on("submit_vote", ({ cardId }) => {
    const room = rooms.get(socket.roomCode);
    if (!room || room.phase !== "voting") return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;

    const storyteller = room.players[room.storytellerIndex];
    if (storyteller.id === socket.id) return;

    const mySubmission = room.submittedCards.find(
      (s) => s.playerId === socket.id
    );
    if (mySubmission && mySubmission.cardId === cardId) return;

    const existing = room.votes.find((v) => v.voterId === socket.id);
    if (existing) return;

    room.votes.push({ voterId: socket.id, cardId });

    const expectedVotes = room.players.length - 1;
    if (room.votes.length === expectedVotes) {
      clearRoomTimer(room);
      const roundResult = calculateScores(room);
      roundResult.round = room.currentRound;
      room.roundHistory.push(roundResult);
      room.phase = "round_result";
      io.to(room.roomCode).emit("round_result", roundResult);
      startPhaseTimer(room);
      emitPersonalStates(room);
    } else {
      emitPersonalStates(room);
    }
  });

  socket.on("next_round", () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    if (room.phase !== "round_result") return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
    const storyteller = room.players[room.storytellerIndex];
    if (storyteller.id !== socket.id && !player.isHost) return;

    clearRoomTimer(room);
    advanceToNextRound(room);
  });

  socket.on("play_again", () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.isHost) return;

    clearRoomTimer(room);

    room.deck = createDeck();
    room.currentRound = 1;
    room.storytellerIndex = 0;

    room.players.forEach((p) => {
      p.score = 0;
      p.hand = room.deck.splice(0, HAND_SIZE);
      p.ready = false;
    });

    room.phase = "storyteller_turn";
    room.clue = "";
    room.submittedCards = [];
    room.shuffledCards = [];
    room.votes = [];
    room.storytellerCardId = null;
    room.roundHistory = [];

    io.to(room.roomCode).emit("game_started");
    startPhaseTimer(room);
    emitPersonalStates(room);
  });

  // Phase ready: player acknowledged the phase guide popup
  socket.on("phase_ready", () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    if (!room.timerPaused) return;

    room.phaseReadyPlayers.add(socket.id);

    const phase = room.phase;
    const storyteller = room.players[room.storytellerIndex];
    let shouldStart = false;

    if (phase === "storyteller_turn") {
      // Storyteller must be ready
      shouldStart = room.phaseReadyPlayers.has(storyteller.id);
    } else if (phase === "players_submit" || phase === "voting") {
      // Any non-storyteller ready → start timer for everyone
      const nonStoryteller = room.players.filter(
        (p) => p.id !== storyteller.id && p.connected
      );
      shouldStart = nonStoryteller.some((p) => room.phaseReadyPlayers.has(p.id));
    }

    if (shouldStart) {
      activatePhaseTimer(room);
    }
  });

  // Rejoin: reconnect a disconnected player to an ongoing game
  socket.on("rejoin_room", ({ roomCode, persistentId }) => {
    const room = rooms.get(roomCode);
    if (!room) {
      socket.emit("error_msg", { message: "방을 찾을 수 없습니다." });
      return;
    }

    const player = room.players.find(
      (p) => p.persistentId === persistentId && !p.connected
    );
    if (!player) {
      socket.emit("error_msg", { message: "재접속할 수 없습니다." });
      return;
    }

    // Update socket references
    const oldId = player.id;
    player.id = socket.id;
    player.connected = true;

    // Update submittedCards references
    room.submittedCards.forEach((s) => {
      if (s.playerId === oldId) s.playerId = socket.id;
    });
    // Update votes references
    room.votes.forEach((v) => {
      if (v.voterId === oldId) v.voterId = socket.id;
    });
    // Update roundHistory references
    room.roundHistory.forEach((rr) => {
      if (rr.storytellerId === oldId) rr.storytellerId = socket.id;
      rr.submissions.forEach((s) => {
        if (s.playerId === oldId) s.playerId = socket.id;
      });
      rr.votes.forEach((v) => {
        if (v.voterId === oldId) v.voterId = socket.id;
      });
      rr.scoreChanges.forEach((sc) => {
        if (sc.playerId === oldId) sc.playerId = socket.id;
      });
    });

    socket.leave("lobby");
    socket.join(roomCode);
    socket.roomCode = roomCode;

    socket.emit("rejoin_success", { roomCode, persistentId });
    emitPersonalStates(room);

    // Notify others
    io.to(roomCode).emit("chat_message", {
      playerId: "system",
      nickname: "System",
      avatarIndex: 0,
      message: `${player.nickname} 님이 다시 접속했습니다!`,
      timestamp: Date.now(),
    });
  });

  socket.on("send_chat", ({ message }) => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
    // Allow chat in all phases except lobby (player must be in a room)
    if (!message || message.trim().length === 0) return;
    const trimmed = message.trim().slice(0, 100);
    io.to(room.roomCode).emit("chat_message", {
      playerId: player.id,
      nickname: player.nickname,
      avatarIndex: player.avatarIndex,
      message: trimmed,
      timestamp: Date.now(),
    });
  });

  socket.on("leave_room", () => {
    handleDisconnect(socket);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
    handleDisconnect(socket);
  });
});

function handleDisconnect(socket) {
  const roomCode = socket.roomCode;
  if (!roomCode) return;

  const room = rooms.get(roomCode);
  if (!room) return;

  const playerIndex = room.players.findIndex((p) => p.id === socket.id);
  if (playerIndex === -1) return;

  if (room.phase === "waiting") {
    room.players.splice(playerIndex, 1);
    if (room.players.length === 0) {
      rooms.delete(roomCode);
      socket.leave(roomCode);
      socket.join("lobby");
      broadcastRoomsToLobby();
      return;
    }
    if (!room.players.some((p) => p.isHost)) {
      room.players[0].isHost = true;
    }
    // Adjust rounds for new player count
    adjustRoundsForPlayerCount(room);
  } else {
    room.players[playerIndex].connected = false;

    // If all disconnected, clean up
    if (room.players.every((p) => !p.connected)) {
      clearRoomTimer(room);
      rooms.delete(roomCode);
      socket.leave(roomCode);
      socket.join("lobby");
      broadcastRoomsToLobby();
      return;
    }

    // Transfer host if host disconnected
    if (room.players[playerIndex].isHost) {
      room.players[playerIndex].isHost = false;
      const newHost = room.players.find((p) => p.connected);
      if (newHost) newHost.isHost = true;
    }

    // Check if we should auto-advance
    checkDisconnectAutoAdvance(room);
  }

  socket.leave(roomCode);
  socket.join("lobby");
  emitPersonalStates(room);
  broadcastRoomsToLobby();
}

function sanitizeRoomForBroadcast(room) {
  return {
    roomCode: room.roomCode,
    players: room.players.map((p) => ({
      id: p.id,
      nickname: p.nickname,
      avatarIndex: p.avatarIndex,
      ready: p.ready,
      isHost: p.isHost,
      score: p.score,
      handCount: p.hand.length,
      connected: p.connected,
    })),
    phase: room.phase,
    currentRound: room.currentRound,
    totalRounds: room.totalRounds,
    storytellerIndex: room.storytellerIndex,
    clue: room.phase !== "storyteller_turn" ? room.clue : "",
    shuffledCards:
      room.phase === "voting" ||
      room.phase === "shuffle" ||
      room.phase === "round_result"
        ? room.shuffledCards
        : [],
    submittedCount: room.submittedCards.length,
    submittedPlayerIds: room.submittedCards.map((s) => s.playerId),
    votedCount: room.votes.length,
    votedPlayerIds: room.votes.map((v) => v.voterId),
    storytellerCardId:
      room.phase === "round_result" ? room.storytellerCardId : null,
    roundHistory: room.roundHistory || [],
    timerEnd: room.timerEnd || null,
  };
}

function emitPersonalStates(room) {
  const broadcastState = sanitizeRoomForBroadcast(room);

  room.players.forEach((p) => {
    const mySubmission = room.submittedCards.find((s) => s.playerId === p.id);
    const personalState = {
      ...broadcastState,
      myHand: p.hand,
      myId: p.id,
      hasSubmitted: !!mySubmission,
      mySubmittedCardId: mySubmission ? mySubmission.cardId : null,
      hasVoted: room.votes.some((v) => v.voterId === p.id),
    };
    io.to(p.id).emit("game_state", personalState);
  });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
