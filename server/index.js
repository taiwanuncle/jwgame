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
const TOTAL_CARDS = 168;
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

  // Bots instantly acknowledge phase and schedule their actions
  if (typeof botPhaseReady === "function") {
    botPhaseReady(room);
  }
  if (typeof scheduleBotActions === "function") {
    scheduleBotActions(room);
  }
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

// --- Bot system ---
const BOT_ADJECTIVES = [
  "용감한", "지혜로운", "충실한", "온유한", "담대한",
  "겸손한", "신실한", "기쁜", "감사한", "인내하는",
  "사랑하는", "순결한", "정직한", "부지런한", "평화로운",
];
const BOT_NAMES = [
  "천사", "비둘기", "사자", "어린양", "독수리",
  "올리브", "무화과", "겨자씨", "포도", "백합",
];

// Pre-made clues per character (loaded from clues data)
// Each character has 5 clues: 2 words + 3 sentences
const BOT_CLUES = {
  1: ["에덴", "흙", "모든 인류의 시작이 된 사람", "동산에서 금지된 것을 먹었다", "아내의 이름을 직접 지어주었다"],
  2: ["뱀", "열매", "최초의 어머니라 불리는 여인", "동산에서 유혹에 넘어갔다", "살아 있는 모든 것의 어머니라는 뜻의 이름"],
  3: ["양", "제물", "형에게 목숨을 잃은 목자", "하느님이 기뻐하신 제물을 바쳤다", "성서에서 최초로 죽음을 맞은 사람"],
  4: ["농부", "표", "질투 때문에 돌이킬 수 없는 일을 저질렀다", "땅에서 떠돌아다니는 형벌을 받았다", "이마에 특별한 보호의 징표를 받았다"],
  5: ["걸음", "옮김", "하느님과 함께 걸었다고 기록된 사람", "죽음을 보지 않고 사라졌다", "365년을 살았다고 전해진다"],
  6: ["방주", "홍수", "거대한 배를 지어 가족을 구했다", "비둘기를 내보내 마른 땅을 확인했다", "무지개 약속을 받은 사람"],
  7: ["장막", "축복", "아버지의 벗은 몸을 덮어준 아들", "메시아의 혈통에 속하는 인물", "홍수 이후 새 시대를 연 삼형제 중 하나"],
  8: ["별", "약속", "고향을 떠나 약속의 땅으로 간 사람", "백 세에 아들을 얻었다", "믿음의 아버지라 불린다"],
  9: ["웃음", "장막", "나이 들어 아들을 낳고 웃었다", "남편의 고향 떠남에 함께했다", "천사의 약속을 듣고 처음엔 믿지 못했다"],
  10: ["소금", "동굴", "삼촌과 함께 여행하다 갈라선 사람", "두 도시가 멸망할 때 겨우 탈출했다", "아내가 뒤를 돌아보아 소금 기둥이 되었다"],
  11: ["광야", "우물", "여주인에게서 도망친 여종", "광야에서 천사를 만났다", "아들의 이름에 하느님이 들으셨다는 뜻이 담겼다"],
  12: ["활", "광야", "어머니와 함께 쫓겨난 소년", "광야에서 목마를 때 우물을 발견했다", "열두 족장의 아버지가 되었다"],
  13: ["제단", "우물", "아버지에게 묶여 제단에 올랐다", "이름 자체가 웃음을 뜻한다", "아내를 만나기 전 들판에서 명상하고 있었다"],
  14: ["물동이", "쌍둥이", "우물가에서 낙타에게 물을 주어 선택받았다", "한 아들에게 축복을 받게 해주려 계략을 꾸몄다", "머나먼 곳에서 시집을 왔다"],
  15: ["사냥", "붉은 죽", "배가 고파 소중한 것을 팔아버린 사람", "온몸이 털로 덮여 있었다", "축복을 동생에게 빼앗겼다"],
  16: ["사다리", "씨름", "천사와 밤새 겨루어 새 이름을 얻었다", "외삼촌 집에서 14년을 일했다", "꿈에서 하늘로 오르는 계단을 보았다"],
  17: ["양떼", "사랑", "우물가에서 처음 만나 사랑에 빠졌다", "남편이 그녀를 위해 7년을 더 일했다", "오랫동안 아이를 갖지 못해 슬퍼했다"],
  18: ["눈", "첫째", "아버지의 계략으로 결혼하게 된 여인", "사랑받지 못했지만 많은 아들을 낳았다", "동생보다 먼저 시집갔다"],
  19: ["꿈", "옷", "형들에게 팔려 종이 되었다가 총리가 됐다", "화려한 옷 때문에 미움을 샀다", "곡식을 저장해 온 나라를 기근에서 구했다"],
  20: ["지팡이", "사자", "왕의 혈통이 이 사람에게서 나왔다", "며느리에게 속아 넘어갔다", "동생을 죽이지 말고 팔자고 제안했다"],
  21: ["베일", "쌍둥이", "변장해서 시아버지를 속인 여인", "자기 권리를 지키기 위해 대담한 행동을 했다", "메시아 혈통에 이름이 올라 있다"],
  22: ["맏아들", "합력초", "동생을 구하려 했지만 실패했다", "장자권을 잃어버린 첫째 아들", "아버지의 침상에서 잘못을 저질렀다"],
  23: ["은잔", "늑대", "가장 어린 아들이라 아버지가 보내기 싫어했다", "형의 은잔이 짐에서 발견되었다", "어머니가 낳다가 세상을 떠났다"],
  24: ["인내", "재", "하루아침에 모든 것을 잃었지만 신앙을 지켰다", "온몸이 종기로 뒤덮였다", "세 친구의 위로가 오히려 고통이었다"],
  25: ["지팡이", "바다", "갈대 상자에 넣어져 강에 띄워진 아기", "불타는 떨기나무 앞에서 사명을 받았다", "백성을 이끌고 바다를 건넜다"],
  26: ["대제사장", "싹", "형으로서 동생의 대변자가 되었다", "금으로 동물 형상을 만들어 큰 잘못을 저질렀다", "지팡이에서 싹이 나 선택이 확인되었다"],
  27: ["소고", "나병", "동생을 강에서 지켜본 누나", "바다를 건넌 뒤 노래하며 춤췄다", "불평했다가 피부병에 걸렸다"],
  28: ["열 가지", "전차", "마음이 완고해져 백성을 놓아주지 않았다", "열 가지 재앙을 겪고도 끝까지 고집했다", "바다에서 군대를 잃었다"],
  29: ["음모", "밤", "삼촌의 목숨을 구한 젊은이", "암살 음모를 알아채고 지휘관에게 전했다", "이름이 기록되지 않은 용감한 소년"],
  30: ["재판관", "광야", "사위에게 지혜로운 조직 체계를 제안했다", "미디안의 제사장이자 장인", "사위가 떠나기 전 작별 인사를 나눴다"],
  31: ["땅", "반역", "하느님이 세운 지도자에게 반기를 들었다", "땅이 갈라져 삼켜 버린 사람", "250명과 함께 향을 바치며 도전했다"],
  32: ["당나귀", "축복", "돈을 받고 저주하러 갔다가 축복했다", "타고 가던 동물이 갑자기 말을 했다", "천사가 칼을 들고 길을 막고 있었다"],
  33: ["포도송이", "용기", "열두 정탐꾼 중 좋은 보고를 한 사람", "85세에 산지를 달라고 요청했다", "여호수아와 함께 약속의 땅에 들어갔다"],
  34: ["성벽", "태양", "모세의 뒤를 이어 백성을 이끈 지도자", "성을 돌며 함성을 질러 무너뜨렸다", "해가 멈추도록 기도한 사람"],
  35: ["빨간 줄", "창문", "정탐꾼을 숨겨주고 가족을 구한 여인", "성벽 위의 집에 살았다", "붉은 끈이 구원의 표시가 되었다"],
  36: ["종려나무", "재판관", "나무 아래에서 재판한 여성 지도자", "장군에게 전쟁에 나가라고 명했다", "승리의 노래를 불렀다"],
  37: ["번개", "전차", "여성 지도자 없이는 전쟁에 안 간다고 했다", "적장의 철 전차 900대를 물리쳤다", "승리는 여자의 손에 돌아갈 거라는 말을 들었다"],
  38: ["장막 말뚝", "우유", "도망친 적장을 자기 장막에 숨겨주었다", "우유를 주고 재운 뒤 결정적 행동을 했다", "여자의 손에 승리가 돌아갈 것이라는 예언을 성취했다"],
  39: ["횃불", "양털", "300명만으로 대군을 물리친 지도자", "양털에 이슬이 맺히는 표징을 구했다", "항아리를 깨고 횃불을 들어 적을 혼란에 빠뜨렸다"],
  40: ["서원", "딸", "이기면 바치겠다는 약속을 했다가 괴로워한 사람", "쫓겨났다가 위기 때 지도자로 돌아왔다", "집에서 첫 번째로 나온 사람이 딸이었다"],
  41: ["머리카락", "기둥", "초인적인 힘을 가졌지만 비밀을 빼앗겼다", "사자를 맨손으로 찢었다", "마지막 순간 기둥을 밀어 무너뜨렸다"],
  42: ["창문", "3층", "설교 중에 졸다가 창문에서 떨어졌다", "죽었다가 다시 살아난 청년", "밤늦게까지 이어진 긴 이야기 중에 사고가 났다"],
  43: ["이삭줍기", "충성", "시어머니를 따라 낯선 나라로 갔다", "밭에서 곡식을 주워 생계를 이었다", "당신의 하느님이 나의 하느님이라고 말했다"],
  44: ["쓰라림", "귀향", "남편과 두 아들을 잃고 고향으로 돌아온 여인", "이름을 쓰라린 여인으로 바꿔 달라고 했다", "며느리의 새 아기를 양육했다"],
  45: ["타작마당", "기업 무를 자", "밭에서 곡식 줍는 외국 여인에게 친절했다", "가까운 친족으로서 책임을 다한 사람", "다윗 왕의 증조할아버지"],
  46: ["기도", "서원", "아이를 간절히 원해 성전에서 울며 기도했다", "입술만 움직여 기도해서 취한 줄 오해받았다", "아들을 낳으면 하느님께 바치겠다고 약속했다"],
  47: ["부름", "기름", "밤에 자기 이름을 부르는 소리를 들었다", "이스라엘의 첫 두 왕에게 기름을 부었다", "어릴 때부터 성전에서 자란 소년"],
  48: ["대제사장", "소식", "아들들을 바로잡지 못한 제사장", "궤가 빼앗겼다는 소식을 듣고 의자에서 떨어졌다", "기도하는 여인을 취한 줄 알고 꾸짖었다"],
  49: ["창", "당나귀", "잃어버린 동물을 찾으러 갔다가 왕이 됐다", "질투 때문에 충신을 죽이려 했다", "전쟁터에서 스스로 목숨을 끊었다"],
  50: ["하프", "물맷돌", "거인을 쓰러뜨린 소년 목자", "양치기에서 왕이 된 인물", "시편을 많이 쓴 이스라엘의 왕"],
  51: ["거인", "투구", "40일 동안 이스라엘 군대를 모욕했다", "돌멩이 하나에 쓰러진 전사", "키가 약 3미터에 달했다고 전해지는 사람"],
  52: ["화살", "우정", "아버지의 뜻을 거슬러 친구를 도운 왕자", "옷과 칼과 활을 벗어 친구에게 주었다", "화살로 위험 신호를 보냈다"],
  53: ["빵", "지혜", "어리석은 남편 대신 왕에게 선물을 가져갔다", "분노한 왕의 마음을 지혜로 돌린 여인", "남편이 죽은 뒤 왕비가 되었다"],
  54: ["목욕", "지붕", "왕이 지붕에서 목욕하는 모습을 보았다", "남편이 전쟁터의 최전방에 배치되었다", "지혜로운 왕의 어머니"],
  55: ["비유", "어린 양", "왕에게 비유로 죄를 지적한 선지자", "가난한 사람의 어린 양 이야기를 들려주었다", "바로 당신이 그 사람이라고 선포했다"],
  56: ["머리카락", "반란", "아름다운 외모로 유명했던 왕의 아들", "아버지의 왕좌를 빼앗으려 반란을 일으켰다", "나무에 머리가 걸려 최후를 맞았다"],
  57: ["지혜", "성전", "두 여인의 아기 분쟁을 지혜로 해결한 왕", "하느님께 지혜를 구해 받은 사람", "화려한 성전을 건축한 왕"],
  58: ["보물", "수수께끼", "먼 나라에서 지혜를 시험하러 찾아온 여왕", "어려운 질문들을 가지고 왔다", "왕의 지혜를 보고 넋을 잃었다"],
  59: ["채찍", "분열", "백성의 요청을 거절해 나라가 둘로 갈라졌다", "아버지의 조언자 대신 젊은 친구들의 말을 들었다", "열두 지파 중 둘만 남았다"],
  60: ["금 송아지", "제단", "북쪽 왕국의 첫 번째 왕", "백성이 예루살렘에 가지 못하게 금 우상을 만들었다", "이스라엘이 죄를 짓게 한 왕으로 기록되었다"],
  61: ["불", "까마귀", "하늘에서 불이 내려와 제물을 태운 선지자", "까마귀가 음식을 가져다주었다", "회오리바람을 타고 하늘로 올라갔다"],
  62: ["화장", "포도원", "이웃의 밭을 빼앗기 위해 거짓 재판을 꾸몄다", "하느님의 선지자들을 죽이려 했다", "창문에서 떨어져 최후를 맞았다"],
  63: ["상아", "포도원", "이웃의 땅이 탐나 우울해진 왕", "아내의 부추김에 넘어간 이스라엘의 왕", "바알 숭배를 퍼뜨린 왕"],
  64: ["겉옷", "곰", "스승의 겉옷을 물려받은 선지자", "도끼 머리를 물 위에 뜨게 했다", "나아만의 병을 요르단 강에서 고쳤다"],
  65: ["요르단 강", "일곱 번", "강에서 일곱 번 씻고 피부병이 나은 장군", "처음에는 선지자의 지시를 거부했다", "적국의 어린 소녀 덕분에 치료법을 알게 되었다"],
  66: ["탐욕", "나병", "주인 몰래 선물을 받으러 뛰어간 종", "거짓말을 하고 피부병에 걸렸다", "선지자의 종이었지만 욕심에 넘어갔다"],
  67: ["해시계", "터널", "수명이 15년 연장된 왕", "적이 쳐들어왔을 때 기도로 구원받았다", "해 그림자가 뒤로 물러나는 표징을 받았다"],
  68: ["율법책", "8세", "여덟 살에 왕이 된 소년", "성전 수리 중 발견된 책을 읽고 옷을 찢었다", "우상을 철저히 파괴한 개혁의 왕"],
  69: ["숯불", "처녀", "입술을 숯불로 정결하게 한 선지자", "메시아에 대한 예언을 가장 많이 남겼다", "여기 있습니다 나를 보내소서라고 말했다"],
  70: ["눈물", "토기장이", "눈물의 선지자라 불린 사람", "진흙 웅덩이에 갇혀 구출된 적이 있다", "예루살렘의 멸망을 예언하고 슬퍼했다"],
  71: ["마른 뼈", "환상", "마른 뼈가 살아나는 환상을 본 선지자", "옆으로 누워 수백 일을 보냈다", "하느님의 보좌와 네 생물의 환상을 보았다"],
  72: ["사자굴", "해석", "왕의 꿈을 해석해 높은 자리에 오른 사람", "사자굴에 던져졌으나 해를 입지 않았다", "저녁마다 창문을 열고 기도한 사람"],
  73: ["풀무불", "네 번째 사람", "금 신상에 절하기를 거부한 세 청년", "불 속에서 네 번째 사람이 보였다", "불에 들어갔지만 머리카락 하나 타지 않았다"],
  74: ["벽", "잔치", "성전의 그릇으로 술잔치를 벌인 왕", "벽에 나타난 글씨를 아무도 읽지 못했다", "그날 밤 나라를 잃었다"],
  75: ["칙령", "사자굴", "자기가 내린 명령 때문에 괴로워한 왕", "충신을 사자굴에 넣을 수밖에 없었다", "다음 날 아침 서둘러 달려가 안부를 물었다"],
  76: ["금 신상", "풀", "거대한 금 신상을 세우고 절하라 명한 왕", "교만하여 들짐승처럼 풀을 먹게 되었다", "예루살렘 성전을 파괴한 바빌론의 왕"],
  77: ["결혼", "용서", "하느님의 명으로 특별한 여인과 결혼한 선지자", "배신한 아내를 다시 데려온 이야기", "이스라엘의 불충실을 자기 결혼으로 보여주었다"],
  78: ["웅변", "알렉산드리아", "열정적으로 말했지만 아직 배울 것이 있던 전도자", "부부에게서 더 정확한 가르침을 배웠다", "바울이 심고 이 사람이 물을 주었다"],
  79: ["뽕나무", "목자", "목자이자 뽕나무 재배자였던 선지자", "가난한 자를 압제하는 것을 꾸짖었다", "전문 선지자가 아니었지만 하느님께 부름받았다"],
  80: ["에돔", "심판", "에돔에 대한 심판을 예언한 사람", "성서에서 가장 짧은 예언서를 남겼다", "형제 민족의 배신을 질책했다"],
  81: ["물고기", "박넝쿨", "하느님의 명령을 피해 배를 탔다", "큰 물고기 뱃속에서 3일을 보냈다", "적국이 회개하자 오히려 화를 냈다"],
  82: ["베들레헴", "겸손", "메시아의 탄생지를 예언한 선지자", "공의를 행하고 인자를 사랑하라고 말했다", "작은 마을에서 위대한 통치자가 나올 것이라 했다"],
  83: ["포로", "종", "적국 장군의 아내에게 선지자를 알려준 아이", "포로로 잡혀갔지만 신앙을 잃지 않았다", "이름 없는 어린 종이 큰 기적의 계기가 되었다"],
  84: ["질문", "망대", "하느님께 왜 악을 허용하시냐고 물은 선지자", "망대에 서서 하느님의 대답을 기다렸다", "의인은 믿음으로 살 것이라는 말씀을 받았다"],
  85: ["심판의 날", "겸손", "여호와의 큰 날이 가깝다고 선포한 선지자", "겸손한 자를 찾으라고 호소했다", "요시야 왕 시대에 활동했다"],
  86: ["자주색", "강가", "강가에서 기도하다 복음을 받아들인 여인", "자주색 옷감을 파는 장사꾼이었다", "집을 열어 전도자들을 환대했다"],
  87: ["말", "등잔대", "성전 재건을 격려한 선지자", "여러 가지 색깔의 말 환상을 보았다", "금 등잔대와 올리브 나무의 환상을 기록했다"],
  88: ["십일조", "태양", "의의 태양이 떠오를 것이라 예언했다", "하느님을 속이고 있다며 백성을 꾸짖었다", "구약의 마지막 선지자"],
  89: ["율법", "서기관", "포로에서 돌아와 율법을 가르친 제사장", "이방인과의 결혼 문제로 옷을 찢고 슬퍼했다", "백성 앞에서 율법을 읽어주었다"],
  90: ["성벽", "술 관원", "왕의 술 시중을 들다가 고향의 성벽을 재건한 사람", "52일 만에 성벽을 완성했다", "한 손에 무기 한 손에 연장을 들고 일했다"],
  91: ["왕비", "금 홀", "부름받지 않고 왕 앞에 나선 용감한 여인", "자기 민족을 구하기 위해 목숨을 걸었다", "이때를 위해 왕비가 된 것이 아니겠느냐는 말을 들었다"],
  92: ["성문", "절하지 않음", "적에게 절하기를 거부한 유대인", "왕의 암살 음모를 고발했다", "조카딸에게 용기를 준 사람"],
  93: ["교수대", "제비", "자기가 만든 교수대에 매달린 관리", "한 민족을 멸절시키려는 계획을 세웠다", "제비를 뽑아 날짜를 정했다"],
  94: ["백부장", "환상", "기도와 구제로 하느님의 주목을 받은 이방인", "이방인 최초로 성령을 받았다", "베드로를 초대해 복음을 들었다"],
  95: ["바늘", "옷", "과부들을 위해 옷을 만들어 준 여인", "죽었다가 기도로 다시 살아났다", "선행과 자선으로 가득했던 제자"],
  96: ["구유", "십자가", "물을 포도주로 바꾼 첫 기적을 행했다", "목수의 아들로 자란 인류의 구원자", "죽은 자를 살리고 병든 자를 고쳤다"],
  97: ["구유", "천사", "천사의 방문을 받고 순종한 젊은 여인", "마구간에서 아기를 낳았다", "여호와의 종이라 자처한 믿음의 여인"],
  98: ["목수", "꿈", "꿈에서 천사의 지시를 받은 사람", "가족을 데리고 이집트로 피난했다", "의로운 사람으로 기록된 목수"],
  99: ["메뚜기", "요르단 강", "광야에서 회개를 외친 선구자", "메뚜기와 야생 꿀을 먹으며 살았다", "세상 죄를 지고 가는 어린 양이라 선포했다"],
  100: ["그물", "닭", "물 위를 걷다가 빠진 어부", "세 번 부인하고 닭이 울자 울었다", "교회의 반석이라 불린 사도"],
  101: ["무화과나무", "솔직", "나사렛에서 무슨 좋은 것이 나올 수 있느냐고 말했다", "무화과나무 아래에서 기도하던 것을 알아맞혔다", "거짓이 없는 사람이라는 칭찬을 받았다"],
  102: ["우레", "칼", "사도 중 첫 번째로 순교한 사람", "우레의 아들이라는 별명을 가졌다", "형제와 함께 예수의 가까운 제자였다"],
  103: ["사랑", "밧모 섬", "예수가 사랑한 제자라 불린 사람", "섬으로 유배되어 계시록을 기록했다", "십자가 아래서 예수의 어머니를 맡았다"],
  104: ["빵", "제자", "오천 명을 먹이기 전 비용을 계산하라는 질문을 받았다", "나다나엘에게 와서 보라고 초대한 사도", "주님 아버지를 보여주소서라고 요청했다"],
  105: ["춤", "접시", "생일잔치에서 끔찍한 약속을 한 왕", "선지자의 머리를 접시에 달라는 요청을 거절하지 못했다", "예수를 심문했지만 돌려보냈다"],
  106: ["세관", "잔치", "세금 걷는 자리에서 일어나 따라간 사람", "죄인과 세리를 초대해 큰 잔치를 베풀었다", "예수의 족보를 기록한 복음서 기자"],
  107: ["상처", "의심", "직접 보고 만져봐야 믿겠다고 했다", "나의 주 나의 하나님이라 고백했다", "못 자국을 확인한 뒤 믿음을 고백한 사도"],
  108: ["대제사장", "옷을 찢음", "한 사람이 백성을 위해 죽는 것이 낫다고 말했다", "예수 재판을 주도한 대제사장", "자기 옷을 찢으며 신성모독이라 선언했다"],
  109: ["열두", "질문", "우리에게만 나타내시고 세상에는 안 하시냐고 물은 사도", "열두 사도 목록에 이름이 있는 인물", "야고보의 아들이라고도 불린 제자"],
  110: ["열심", "열두", "열심당원이었던 사도", "정치적 열정을 가졌다가 예수의 제자가 됐다", "열두 사도 중 과격한 배경을 가진 사람"],
  111: ["은 서른", "입맞춤", "돈주머니를 관리하던 제자", "입맞춤으로 스승을 넘겨주었다", "후회하고 은전을 돌려주었지만 돌이킬 수 없었다"],
  112: ["향유", "부활", "부활하신 예수를 처음 만난 여인", "빈 무덤에서 울고 있을 때 이름을 불러주셨다", "일곱 귀신에서 해방된 여인"],
  113: ["접대", "부엌", "손님 접대에 분주했던 여인", "동생은 가만히 앉아 있는데 혼자 일한다고 불평했다", "주님이 말씀하시면 죽은 자도 살아난다고 고백했다"],
  114: ["발", "향유", "예수의 발치에 앉아 말씀을 들은 여인", "비싼 향유를 부어 장례를 준비했다", "좋은 편을 택했다는 칭찬을 받았다"],
  115: ["무덤", "나흘", "죽은 지 나흘 만에 무덤에서 나온 사람", "예수가 그의 이름을 부르자 살아났다", "붕대에 감긴 채 걸어나왔다"],
  116: ["뽕나무", "세리", "키가 작아 나무에 올라간 부자", "오늘 이 집에 구원이 왔다는 말씀을 들었다", "재산의 절반을 가난한 자에게 주겠다고 했다"],
  117: ["밤", "거듭남", "밤에 몰래 예수를 찾아온 바리새인", "어떻게 사람이 늙은 후에 다시 태어날 수 있느냐고 물었다", "예수의 장례 때 많은 향료를 가져왔다"],
  118: ["학살", "성전", "아기들을 죽이라 명한 잔인한 왕", "예루살렘 성전을 웅장하게 재건했다", "동방의 박사들에게 속았다며 분노했다"],
  119: ["손 씻기", "재판", "나는 이 사람의 피에 대해 무죄하다며 손을 씻었다", "진리가 무엇이냐고 물은 총독", "군중의 압력에 무죄한 사람을 넘겨주었다"],
  120: ["제비", "열두 번째", "제비뽑기로 사도가 된 사람", "배반한 제자의 빈자리를 채웠다", "처음부터 예수와 함께했던 제자 중 하나"],
  121: ["다마스쿠스", "서신", "그리스도인을 박해하다 극적으로 회심한 사람", "다마스쿠스 길에서 빛에 눈이 멀었다", "감옥에서도 편지를 써서 교회를 세웠다"],
  122: ["격려", "밭", "위로의 아들이라는 별명을 가진 사도", "밭을 팔아 그 값을 공동체에 바쳤다", "아무도 신뢰하지 않던 회심자를 소개해 주었다"],
  123: ["돌", "하늘", "돌에 맞아 죽으면서 용서를 빈 첫 순교자", "천사 같은 얼굴을 하고 있다고 묘사되었다", "하늘이 열리고 인자가 서 계신 것을 보았다"],
  124: ["전차", "사막길", "사막 길에서 외국 관리의 전차에 올라탔다", "성경 구절을 설명해주고 물에서 침례를 주었다", "일곱 봉사자 중 하나이자 네 딸의 아버지"],
  125: ["청년", "할머니", "할머니와 어머니에게서 믿음을 물려받은 젊은이", "바울이 아들처럼 사랑한 동역자", "청년의 때를 사람들이 업신여기지 못하게 하라는 격려를 받았다"],
  126: ["의사", "기록", "사랑하는 의사로 불린 복음서 기자", "바울과 함께 여행하며 기록을 남겼다", "이방인에게 복음을 전하기 위해 글을 썼다"],
  127: ["천막", "부부", "천막 만드는 일을 하며 바울과 함께 일한 부부", "열정적인 전도자에게 더 정확한 길을 가르쳐 주었다", "자기 집을 교회로 사용한 헌신적인 동역자"],
  128: ["감옥", "찬양", "한밤중 감옥에서 찬송가를 부른 사람", "지진이 일어나 감옥 문이 열렸다", "바울과 함께 전도 여행을 다닌 동역자"],
  129: ["장수", "969년", "성서에서 가장 오래 산 사람", "홍수가 나던 해에 세상을 떠났다", "아들의 이름에 심판에 대한 의미가 담겨 있었다"],
  130: ["섬나라", "넓히다", "노아의 세 아들 중 하나", "유럽과 소아시아 민족들의 조상", "형과 함께 아버지의 벗은 몸을 덮어주었다"],
  131: ["빵과 포도주", "제사장 왕", "왕이면서 동시에 제사장이었던 인물", "아브라함에게 축복하고 십일조를 받았다", "족보에 시작과 끝이 기록되지 않은 신비로운 사람"],
  132: ["부싯돌", "할례", "남편의 목숨을 구하기 위해 긴급한 행동을 한 아내", "미디안 제사장의 딸", "우물가에서 양에게 물을 먹이던 중 미래의 남편을 만났다"],
  133: ["창", "열심", "여호와를 향한 열심으로 재앙을 멈춘 제사장", "죄악을 즉각 처단해 전염병이 그쳤다", "영원한 제사장직의 계약을 받았다"],
  134: ["금", "장막 밑", "전리품을 몰래 숨긴 사람", "장막 밑에 보물을 감추었다가 들통났다", "한 사람의 죄 때문에 전체가 패배했다"],
  135: ["맷돌", "가시나무", "형제 70명을 죽이고 왕이 되려 한 사람", "가시나무 비유의 대상이 된 인물", "여자가 던진 맷돌에 머리가 부서졌다"],
  136: ["비밀", "무릎", "연인의 힘의 비밀을 캐내려 집요하게 물었다", "은을 받고 사랑하는 사람을 배신했다", "무릎 위에서 잠든 사이 머리카락을 잘랐다"],
  137: ["여덟 아들", "베들레헴", "베들레헴의 양 치는 집안의 가장", "가장 어린 아들이 왕으로 선택되었다", "선지자가 찾아왔을 때 막내를 부르러 보냈다"],
  138: ["전쟁터", "충성", "왕의 음모로 최전방에 배치된 충직한 군인", "동료가 싸우고 있는데 집에서 편히 쉴 수 없다고 했다", "자기 아내가 왕에게 빼앗긴 것을 모르고 있었다"],
  139: ["절뚝발이", "왕의 식탁", "어릴 때 떨어져 두 발을 쓰지 못하게 된 왕손", "아버지의 친구 덕분에 왕의 식탁에서 먹게 되었다", "죽은 개 같은 자가 무슨 은혜를 받으냐고 겸손히 말했다"],
  140: ["장군", "성문", "다윗의 군대 사령관이었던 조카", "왕의 명령으로 충직한 군인을 죽게 만든 공범", "전쟁에서는 유능했지만 권력 앞에서 잔인했다"],
  141: ["조언", "목맴", "하느님의 신탁처럼 여겨지던 지략가", "자기 조언이 받아들여지지 않자 스스로 목숨을 끊었다", "반란에 가담해 옛 주인을 배신한 모사꾼"],
  142: ["다락방", "아들", "선지자를 위해 방을 마련해 준 부유한 여인", "약속대로 아들을 얻었지만 아이가 죽었다", "선지자에게 달려가 아들을 다시 살려달라고 했다"],
  143: ["전차", "미친 듯이", "미친 듯이 전차를 몰아 쿠데타를 일으킨 왕", "바알 숭배자들을 속여 모아놓고 처단했다", "이세벨의 최후를 명한 사람"],
  144: ["왕좌", "학살", "왕의 씨를 모두 죽이고 스스로 왕이 된 여인", "손자 하나가 몰래 숨겨져 살아남았다", "6년간 통치하다 제사장의 반란으로 제거되었다"],
  145: ["성전", "대관식", "어린 왕자를 숨겨 키운 대제사장", "바알 신전을 허물고 참된 예배를 회복했다", "130세까지 살며 왕들의 무덤에 장사되었다"],
  146: ["화살", "수리", "일곱 살에 왕이 되어 성전을 수리한 왕", "은인인 제사장이 죽자 바로 타락했다", "헌금함을 만들어 성전 수리 기금을 모았다"],
  147: ["우상", "회개", "유다 역사상 가장 악한 왕이었다가 회개했다", "성전 안에 우상을 세운 왕", "포로로 잡혀간 뒤 겸손해져 하느님께 돌아왔다"],
  148: ["메뚜기", "성령", "메뚜기 떼의 재앙을 예언한 선지자", "내 영을 모든 사람에게 부어주겠다는 약속을 전했다", "여호와의 큰 날 전에 이루어질 일들을 예고했다"],
  149: ["니느웨", "멸망", "니느웨의 멸망을 예언한 선지자", "잔인한 제국의 종말을 선포했다", "여호와는 분노가 느리시지만 결코 무죄한 자로 여기지 않으신다고 했다"],
  150: ["성전", "총독", "포로 후 돌아와 성전 재건을 이끈 지도자", "큰 산아 네가 무엇이냐 평지가 되리라는 말씀을 받았다", "다윗 왕가의 후손으로 총독이 된 사람"],
  151: ["집", "영광", "자기 집만 돌보고 하느님의 집은 방치한다고 꾸짖은 선지자", "이 성전의 나중 영광이 이전보다 크리라 예언했다", "백성에게 성전 건축을 재개하라고 촉구했다"],
  152: ["태동", "늦은 나이", "나이 들어 아들을 낳은 제사장의 아내", "친족이 방문했을 때 뱃속의 아이가 뛰었다", "여인 중에 네가 복이 있다고 인사한 사람"],
  153: ["성전", "여선지자", "성전을 떠나지 않고 밤낮으로 기도한 여선지자", "84세에 아기 예수를 보고 구원을 전했다", "과부로 오랜 세월을 하느님께 봉사했다"],
  154: ["안다", "약속", "그리스도를 보기 전에는 죽지 않으리라는 약속을 받은 노인", "아기를 안고 이제 평안히 눈을 감겠다고 말했다", "이 아이는 많은 사람의 마음을 드러낼 것이라 예언했다"],
  155: ["물고기", "형제", "베드로의 동생이자 처음 부름받은 제자 중 하나", "보리떡 다섯 개와 물고기 두 마리를 가진 소년을 데려왔다", "먼저 형을 찾아가 메시아를 만났다고 전했다"],
  156: ["딸", "회당장", "딸이 죽어가자 예수의 발 앞에 엎드린 회당장", "아이가 죽은 게 아니라 잠자는 것이라는 말을 들었다", "두려워하지 말고 믿기만 하라는 격려를 받았다"],
  157: ["키스", "작별", "시어머니에게 작별 키스를 하고 돌아간 며느리", "함께 가겠다고 했지만 결국 고향으로 돌아갔다", "동서는 시어머니를 따라갔지만 이 사람은 떠났다"],
  158: ["꿈", "의인", "남편에게 그 의인에게 손을 대지 말라고 경고한 여인", "꿈에서 괴로움을 당해 남편에게 전갈을 보냈다", "재판 중에 급히 메시지를 전한 사람"],
  159: ["다락방", "젊은이", "바울과 바나바의 전도 여행에 동행했다가 돌아간 청년", "그의 어머니 집이 초대교회의 모임 장소였다", "나중에 바울에게도 인정받은 동역자가 되었다"],
  160: ["기둥", "무릎", "예수의 형제로 예루살렘 교회를 이끈 지도자", "기도를 너무 많이 해서 무릎이 낙타 가죽처럼 되었다고 전해진다", "행함이 없는 믿음은 죽은 것이라고 가르쳤다"],
  161: ["거짓말", "값", "밭을 팔고 값의 일부를 속여 바쳤다", "거짓말이 드러나자 그 자리에서 쓰러졌다", "아내와 함께 공동체를 속인 대가를 치렀다"],
  162: ["공모", "세 시간", "남편과 함께 거짓말한 사실이 세 시간 후 드러났다", "남편이 이미 죽은 줄 모르고 같은 거짓말을 했다", "부부가 함께 성령을 시험한 비극적인 사례"],
  163: ["관망", "바리새인", "만일 하느님에게서 난 것이면 무너뜨릴 수 없다고 충고했다", "사도들을 죽이려는 산헤드린을 말린 랍비", "바울의 스승으로 알려진 존경받는 율법학자"],
  164: ["벌레", "천사", "하느님의 영광을 자기 것으로 받아들이다 벌레에게 먹혀 죽은 왕", "야고보를 칼로 죽이고 베드로도 잡아 가둔 사람", "군중이 신의 소리라 외칠 때 거부하지 않았다"],
  165: ["편지", "주인", "바울에게 도망친 종을 다시 받아달라는 편지를 받은 사람", "종이 아니라 형제로 받아주라는 요청을 받았다", "집에서 교회 모임을 열었던 부유한 그리스도인"],
  166: ["도망", "유익한", "주인에게서 도망쳐 바울을 만나 그리스도인이 된 종", "이름이 유익한이라는 뜻이다", "편지 한 통과 함께 주인에게 돌아갔다"],
  167: ["그레데", "질서", "교회의 질서를 세우라는 사명을 받은 바울의 동역자", "그레데 섬에서 장로를 임명하는 일을 맡았다", "이방인이면서 할례를 강요받지 않은 모범적 사례"],
  168: ["골로새", "기도", "골로새 교회를 세운 것으로 알려진 전도자", "성도들을 위해 항상 기도하며 씨름했다", "바울과 함께 감옥에 갇힌 동역자"],
};

let botCounter = 0;

function generateBotName() {
  const adj = BOT_ADJECTIVES[Math.floor(Math.random() * BOT_ADJECTIVES.length)];
  const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
  return `${adj} ${name}`;
}

function createBotPlayer(botIndex) {
  botCounter++;
  return {
    id: `bot-${botIndex}-${botCounter}`,
    persistentId: `bot-${botIndex}-${botCounter}`,
    nickname: generateBotName(),
    avatarIndex: Math.floor(Math.random() * 16),
    ready: true,
    isHost: false,
    isBot: true,
    score: 0,
    hand: [],
    connected: true,
  };
}

function addBotToRoom(room) {
  if (room.players.length >= MAX_PLAYERS) return null;
  const botIndex = room.players.filter((p) => p.isBot).length + 1;
  const bot = createBotPlayer(botIndex);
  room.players.push(bot);
  adjustRoundsForPlayerCount(room);
  return bot;
}

function removeBotFromRoom(room) {
  const botIndex = room.players.findLastIndex((p) => p.isBot);
  if (botIndex === -1) return false;
  room.players.splice(botIndex, 1);
  adjustRoundsForPlayerCount(room);
  return true;
}

// Schedule bot actions after phase changes
function scheduleBotActions(room) {
  const phase = room.phase;
  const storyteller = room.players[room.storytellerIndex];

  if (phase === "storyteller_turn" && storyteller && storyteller.isBot) {
    // Bot is storyteller: pick a card and clue
    const delay = 2000 + Math.random() * 2000; // 2~4 seconds
    setTimeout(() => {
      if (room.phase !== "storyteller_turn") return;
      if (storyteller.hand.length === 0) return;

      const cardId = storyteller.hand[Math.floor(Math.random() * storyteller.hand.length)];
      const clues = BOT_CLUES[cardId];
      const clue = clues
        ? clues[Math.floor(Math.random() * clues.length)]
        : "...";

      room.clue = clue;
      room.storytellerCardId = cardId;
      room.submittedCards = [{ playerId: storyteller.id, cardId }];
      storyteller.hand = storyteller.hand.filter((c) => c !== cardId);

      room.phase = "players_submit";
      startPhaseTimer(room);
      emitPersonalStates(room);
      scheduleBotActions(room);
      checkDisconnectAutoAdvance(room);
    }, delay);
  } else if (phase === "players_submit") {
    // Bot players submit cards
    const bots = room.players.filter(
      (p) => p.isBot && p.id !== storyteller.id && !room.submittedCards.some((s) => s.playerId === p.id)
    );
    bots.forEach((bot) => {
      const delay = 3000 + Math.random() * 5000; // 3~8 seconds
      setTimeout(() => {
        if (room.phase !== "players_submit") return;
        if (room.submittedCards.some((s) => s.playerId === bot.id)) return;
        if (bot.hand.length === 0) return;

        const cardId = bot.hand[Math.floor(Math.random() * bot.hand.length)];
        room.submittedCards.push({ playerId: bot.id, cardId });
        bot.hand = bot.hand.filter((c) => c !== cardId);

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
            scheduleBotActions(room);
            checkDisconnectAutoAdvance(room);
          }, 3000);
        } else {
          emitPersonalStates(room);
        }
      }, delay);
    });
  } else if (phase === "voting") {
    // Bot players vote
    const bots = room.players.filter(
      (p) => p.isBot && p.id !== storyteller.id && !room.votes.some((v) => v.voterId === p.id)
    );
    bots.forEach((bot) => {
      const delay = 3000 + Math.random() * 3000; // 3~6 seconds
      setTimeout(() => {
        if (room.phase !== "voting") return;
        if (room.votes.some((v) => v.voterId === bot.id)) return;

        const mySubmission = room.submittedCards.find((s) => s.playerId === bot.id);
        const votableCards = room.shuffledCards.filter(
          (cardId) => !mySubmission || mySubmission.cardId !== cardId
        );
        if (votableCards.length === 0) return;

        const randomCard = votableCards[Math.floor(Math.random() * votableCards.length)];
        room.votes.push({ voterId: bot.id, cardId: randomCard });

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
          scheduleBotActions(room);
        } else {
          emitPersonalStates(room);
        }
      }, delay);
    });
  } else if (phase === "round_result") {
    // If storyteller is bot (or host is bot), auto-advance after delay
    if (storyteller && storyteller.isBot) {
      // Check if room is solo mode (host is human, storyteller is bot)
      const humanPlayers = room.players.filter((p) => !p.isBot && p.connected);
      if (humanPlayers.length > 0) {
        // Don't auto-advance, let human player click next
        return;
      }
    }
  }
}

// Make bots instantly send phase_ready
function botPhaseReady(room) {
  if (!room.timerPaused) return;
  const bots = room.players.filter((p) => p.isBot);
  bots.forEach((bot) => {
    room.phaseReadyPlayers.add(bot.id);
  });

  const phase = room.phase;
  const storyteller = room.players[room.storytellerIndex];
  let shouldStart = false;

  if (phase === "storyteller_turn") {
    shouldStart = room.phaseReadyPlayers.has(storyteller.id);
  } else if (phase === "players_submit" || phase === "voting") {
    const nonStoryteller = room.players.filter(
      (p) => p.id !== storyteller.id && p.connected
    );
    shouldStart = nonStoryteller.some((p) => room.phaseReadyPlayers.has(p.id));
  }

  if (shouldStart) {
    activatePhaseTimer(room);
  }
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
      .every((p) => p.ready || p.isBot);
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
    // Allow: storyteller, host, or any human when storyteller is a bot
    if (storyteller.id !== socket.id && !player.isHost && !storyteller.isBot) return;

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

  // Solo mode: create room with bots and start immediately
  socket.on("create_solo_room", ({ nickname, avatarIndex, botCount }) => {
    const roomCode = generateRoomCode();
    const persistentId = uuidv4();
    const player = {
      id: socket.id,
      persistentId,
      nickname,
      avatarIndex,
      ready: true,
      isHost: true,
      score: 0,
      hand: [],
      connected: true,
    };

    const numBots = Math.max(2, Math.min(5, botCount || 3));

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
      isSoloMode: true,
    };

    rooms.set(roomCode, room);

    // Add bots
    for (let i = 0; i < numBots; i++) {
      addBotToRoom(room);
    }

    // Auto-adjust rounds
    adjustRoundsForPlayerCount(room);

    socket.leave("lobby");
    socket.join(roomCode);
    socket.roomCode = roomCode;

    socket.emit("room_created", { roomCode, player, persistentId });

    // Auto-start game
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

  // Add bot to waiting room
  socket.on("add_bot", () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.isHost) return;
    if (room.phase !== "waiting") return;

    const bot = addBotToRoom(room);
    if (!bot) {
      socket.emit("error_msg", { message: "방이 가득 찼습니다." });
      return;
    }
    emitPersonalStates(room);
    broadcastRoomsToLobby();
  });

  // Remove bot from waiting room
  socket.on("remove_bot", () => {
    const room = rooms.get(socket.roomCode);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.isHost) return;
    if (room.phase !== "waiting") return;

    if (!removeBotFromRoom(room)) {
      socket.emit("error_msg", { message: "제거할 봇이 없습니다." });
      return;
    }
    emitPersonalStates(room);
    broadcastRoomsToLobby();
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
      isBot: p.isBot || false,
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
