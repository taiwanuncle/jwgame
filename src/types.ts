export interface Player {
  id: string;
  nickname: string;
  avatarIndex: number;
  ready: boolean;
  isHost: boolean;
  score: number;
  hand: number[];
  connected: boolean;
}

export interface CardSubmission {
  playerId: string;
  cardId: number;
}

export interface Vote {
  voterId: string;
  cardId: number;
}

export type GamePhase =
  | "lobby"
  | "waiting"
  | "storyteller_turn"
  | "players_submit"
  | "shuffle"
  | "voting"
  | "reveal"
  | "round_result"
  | "game_over";

export interface GameState {
  roomCode: string;
  players: Player[];
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  storytellerIndex: number;
  clue: string;
  submittedCards: CardSubmission[];
  shuffledCards: number[];
  votes: Vote[];
  deck: number[];
  storytellerCardId: number | null;
}

export interface RoundResult {
  storytellerCardId: number;
  storytellerId: string;
  clue: string;
  submissions: { playerId: string; cardId: number }[];
  votes: { voterId: string; cardId: number }[];
  scoreChanges: { playerId: string; points: number; reason: string }[];
  allCorrect: boolean;
  noneCorrect: boolean;
}
