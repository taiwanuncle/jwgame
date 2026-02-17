/**
 * AudioManager — Background music player with categories, shuffle, auto-next.
 * Categories: "start" (lobby), "playing" (in-game), "celebration" (game over), "secret" (hidden tracks)
 *
 * Two modes:
 * 1. Auto mode (default): App.tsx switches category based on game phase.
 * 2. Playlist mode: User manually picks a track from playlist modal.
 *    In playlist mode, auto category switching is ignored.
 *    When playlist mode ends, auto mode resumes with the pending category.
 */

export type MusicCategory = "start" | "playing" | "celebration" | "secret";

export interface Track {
  id: string;
  name: string;
  category: MusicCategory;
  src: string;
}

// All tracks available
export const ALL_TRACKS: Track[] = [
  // Lobby / start
  { id: "start1", name: "Start 1", category: "start", src: "/audio/start.mp3" },
  { id: "start2", name: "Start 2", category: "start", src: "/audio/start2.mp3" },
  // In-game / playing
  { id: "playing1", name: "Playing 1", category: "playing", src: "/audio/playing1.mp3" },
  { id: "playing2", name: "Playing 2", category: "playing", src: "/audio/playing2.mp3" },
  { id: "playing3", name: "Playing 3", category: "playing", src: "/audio/playing3.mp3" },
  { id: "playing4", name: "Playing 4", category: "playing", src: "/audio/playing4.mp3" },
  { id: "playing5", name: "Playing 5", category: "playing", src: "/audio/playing5.mp3" },
  { id: "playing6", name: "Playing 6", category: "playing", src: "/audio/playing6.mp3" },
  // Celebration / game over
  { id: "celebration1", name: "Celebration 1", category: "celebration", src: "/audio/celebration1.mp3" },
  { id: "celebration2", name: "Celebration 2", category: "celebration", src: "/audio/celebration2.mp3" },
  // Secret tracks
  { id: "secret1", name: "Secret 1", category: "secret", src: "/audio/1.빈 방을 가득 채운 고요의 무게가.mp3" },
  { id: "secret2", name: "Secret 2", category: "secret", src: "/audio/2.책장 위로 내려앉은 오후의 조각.mp3" },
  { id: "secret3", name: "Secret 3", category: "secret", src: "/audio/3.투명한 아침의 숨결이 방 안을 채우고.mp3" },
];

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Listener = () => void;

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private queue: Track[] = [];
  private queueIndex = 0;
  private _currentTrack: Track | null = null;
  private _volume = 0.5;
  private _muted = false;
  private _playing = false;
  private _currentCategory: MusicCategory | null = null;
  private _playlistMode = false;
  private _pendingCategory: MusicCategory | null = null;
  private listeners = new Set<Listener>();

  constructor() {
    // Restore volume & muted from localStorage
    try {
      const savedVol = localStorage.getItem("bgm_volume");
      const savedMuted = localStorage.getItem("bgm_muted");
      if (savedVol !== null) this._volume = Number(savedVol);
      if (savedMuted !== null) this._muted = savedMuted === "true";
    } catch { /* ignore */ }
  }

  /** Subscribe to state changes */
  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  get currentTrack() { return this._currentTrack; }
  get volume() { return this._volume; }
  get muted() { return this._muted; }
  get playing() { return this._playing; }
  get currentCategory() { return this._currentCategory; }
  get playlistMode() { return this._playlistMode; }

  /**
   * Auto mode: play a category (shuffled).
   * If same category already playing, do nothing.
   * If in playlist mode, just remember the pending category.
   */
  playCategory(category: MusicCategory) {
    // Always update pending so we know what to resume after playlist
    this._pendingCategory = category;

    // If in playlist mode, don't interrupt — just save pending
    if (this._playlistMode) return;

    // If same category already playing, skip
    if (this._currentCategory === category && this._playing) return;

    const tracks = ALL_TRACKS.filter((t) => t.category === category);
    if (tracks.length === 0) return;
    this._currentCategory = category;
    this.queue = shuffle(tracks);
    this.queueIndex = 0;
    this.playTrack(this.queue[0]);
  }

  /**
   * Playlist mode: user picks a track manually.
   * Stops auto music and plays selected track, then shuffles through all tracks.
   */
  playFromPlaylist(track: Track) {
    this._playlistMode = true;
    this._currentCategory = track.category;
    // Queue: selected first, then rest shuffled
    const rest = ALL_TRACKS.filter((t) => t.id !== track.id);
    this.queue = [track, ...shuffle(rest)];
    this.queueIndex = 0;
    this.playTrack(track);
  }

  /**
   * Exit playlist mode: stop playlist music, resume auto category.
   */
  exitPlaylistMode() {
    if (!this._playlistMode) return;
    this._playlistMode = false;
    this.stop();
    this.notify();
    // Resume the pending auto category
    if (this._pendingCategory) {
      const cat = this._pendingCategory;
      this._currentCategory = null; // reset so playCategory doesn't skip
      this.playCategory(cat);
    }
  }

  private playTrack(track: Track) {
    this.stop();
    this._currentTrack = track;
    this.audio = new Audio(track.src);
    this.audio.volume = this._muted ? 0 : this._volume;
    this.audio.addEventListener("ended", this.handleEnded);
    this.audio.addEventListener("error", this.handleEnded);
    this.audio.play().then(() => {
      this._playing = true;
      this.notify();
    }).catch(() => {
      // Autoplay blocked — mark not playing
      this._playing = false;
      this.notify();
    });
    this.notify();
  }

  private handleEnded = () => {
    // Auto-next: play next in queue (loop back if at end)
    this.queueIndex = (this.queueIndex + 1) % this.queue.length;
    // If we've looped, re-shuffle
    if (this.queueIndex === 0) {
      this.queue = shuffle(this.queue);
    }
    this.playTrack(this.queue[this.queueIndex]);
  };

  stop() {
    if (this.audio) {
      this.audio.removeEventListener("ended", this.handleEnded);
      this.audio.removeEventListener("error", this.handleEnded);
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    this._playing = false;
  }

  pause() {
    if (this.audio && this._playing) {
      this.audio.pause();
      this._playing = false;
      this.notify();
    }
  }

  resume() {
    if (this.audio && !this._playing) {
      this.audio.play().then(() => {
        this._playing = true;
        this.notify();
      }).catch(() => { /* blocked */ });
    }
  }

  togglePlay() {
    if (this._playing) {
      this.pause();
    } else if (this.audio) {
      this.resume();
    } else if (this._pendingCategory) {
      this._currentCategory = null;
      this.playCategory(this._pendingCategory);
    }
  }

  next() {
    if (this.queue.length === 0) return;
    this.queueIndex = (this.queueIndex + 1) % this.queue.length;
    if (this.queueIndex === 0) this.queue = shuffle(this.queue);
    this.playTrack(this.queue[this.queueIndex]);
  }

  setVolume(vol: number) {
    this._volume = Math.max(0, Math.min(1, vol));
    if (this.audio && !this._muted) {
      this.audio.volume = this._volume;
    }
    try { localStorage.setItem("bgm_volume", String(this._volume)); } catch { /* */ }
    this.notify();
  }

  toggleMute() {
    this._muted = !this._muted;
    if (this.audio) {
      this.audio.volume = this._muted ? 0 : this._volume;
    }
    try { localStorage.setItem("bgm_muted", String(this._muted)); } catch { /* */ }
    this.notify();
  }
}

/** Singleton instance */
export const audioManager = new AudioManager();
