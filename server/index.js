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

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on("create_room", ({ nickname, avatarIndex }) => {
    const roomCode = generateRoomCode();
    const player = {
      id: socket.id,
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
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.roomCode = roomCode;

    socket.emit("room_created", { roomCode, player });
    emitPersonalStates(room);
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

    const player = {
      id: socket.id,
      nickname,
      avatarIndex,
      ready: false,
      isHost: false,
      score: 0,
      hand: [],
      connected: true,
    };

    room.players.push(player);
    socket.join(roomCode);
    socket.roomCode = roomCode;

    socket.emit("room_joined", { roomCode, player });
    emitPersonalStates(room);
  });

  socket.on("toggle_ready", () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
    player.ready = !player.ready;
    emitPersonalStates(room);
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
    emitPersonalStates(room);
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
    emitPersonalStates(room);
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
      room.phase = "shuffle";
      room.shuffledCards = shuffleArray(
        room.submittedCards.map((s) => s.cardId)
      );
      emitPersonalStates(room);

      setTimeout(() => {
        room.phase = "voting";
        emitPersonalStates(room);
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
      const roundResult = calculateScores(room);
      room.phase = "round_result";
      io.to(room.roomCode).emit("round_result", roundResult);
      emitPersonalStates(room);
    } else {
      emitPersonalStates(room);
    }
  });

  socket.on("next_round", () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const storyteller = room.players[room.storytellerIndex];
    if (storyteller.id !== socket.id && !room.players.find(p => p.id === socket.id)?.isHost) return;

    if (room.currentRound >= room.totalRounds) {
      room.phase = "game_over";
      emitPersonalStates(room);
      return;
    }

    room.currentRound += 1;
    room.storytellerIndex =
      (room.storytellerIndex + 1) % room.players.length;

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

    emitPersonalStates(room);
  });

  socket.on("play_again", () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.isHost) return;

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

    io.to(room.roomCode).emit("game_started");
    emitPersonalStates(room);
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
      return;
    }
    if (!room.players.some((p) => p.isHost)) {
      room.players[0].isHost = true;
    }
  } else {
    room.players[playerIndex].connected = false;
  }

  socket.leave(roomCode);
  emitPersonalStates(room);
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
    votedCount: room.votes.length,
    storytellerCardId:
      room.phase === "round_result" ? room.storytellerCardId : null,
  };
}

function emitPersonalStates(room) {
  const broadcastState = sanitizeRoomForBroadcast(room);

  room.players.forEach((p) => {
    const personalState = {
      ...broadcastState,
      myHand: p.hand,
      myId: p.id,
      hasSubmitted: room.submittedCards.some((s) => s.playerId === p.id),
      hasVoted: room.votes.some((v) => v.voterId === p.id),
    };
    io.to(p.id).emit("game_state", personalState);
  });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
