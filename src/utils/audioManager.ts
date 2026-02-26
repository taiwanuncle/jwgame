/**
 * AudioManager — Background music player with categories, shuffle, auto-next.
 * Categories: "start" (lobby), "playing" (in-game), "celebration" (game over), "secret" (hidden tracks)
 *
 * Two modes:
 * 1. Auto mode (default): App.tsx switches category based on game phase.
 * 2. Playlist mode: User manually picks a track from playlist modal.
 *    In playlist mode, auto category switching is ignored.
 *    When playlist mode ends, auto mode resumes with the pending category.
 *
 * Repeat modes: "all" (loop queue), "one" (repeat single track), "off" (stop after queue)
 * Shuffle: toggle on/off
 */

export type MusicCategory = "start" | "playing" | "celebration" | "secret";
export type RepeatMode = "all" | "one" | "off";

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
function shuffleArray<T>(arr: T[]): T[] {
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
  private _userInteracted = false;
  private _userPaused = false;
  private _shuffle = true;
  private _repeat: RepeatMode = "all";

  constructor() {
    // Restore settings from localStorage
    try {
      const savedVol = localStorage.getItem("bgm_volume");
      const savedMuted = localStorage.getItem("bgm_muted");
      const savedShuffle = localStorage.getItem("bgm_shuffle");
      const savedRepeat = localStorage.getItem("bgm_repeat");
      if (savedVol !== null) this._volume = Number(savedVol);
      if (savedMuted !== null) this._muted = savedMuted === "true";
      if (savedShuffle !== null) this._shuffle = savedShuffle !== "false";
      if (savedRepeat === "all" || savedRepeat === "one" || savedRepeat === "off") {
        this._repeat = savedRepeat;
      }
    } catch { /* ignore */ }

    // Listen for first user interaction to unlock audio playback
    const onInteract = () => {
      this._userInteracted = true;
      window.removeEventListener("click", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("keydown", onInteract);
      if (this._pendingCategory && !this._playing && !this._playlistMode) {
        this._currentCategory = null;
        this.playCategory(this._pendingCategory);
      }
    };
    window.addEventListener("click", onInteract);
    window.addEventListener("touchstart", onInteract);
    window.addEventListener("keydown", onInteract);
  }

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
  get shuffleOn() { return this._shuffle; }
  get repeatMode() { return this._repeat; }

  toggleShuffle() {
    this._shuffle = !this._shuffle;
    try { localStorage.setItem("bgm_shuffle", String(this._shuffle)); } catch { /* */ }
    // Re-shuffle remaining queue if turning on
    if (this._shuffle && this.queue.length > 1) {
      const current = this.queue[this.queueIndex];
      const rest = this.queue.filter((_, i) => i !== this.queueIndex);
      this.queue = [current, ...shuffleArray(rest)];
      this.queueIndex = 0;
    }
    this.notify();
  }

  cycleRepeat() {
    if (this._repeat === "all") {
      this._repeat = "one";
    } else if (this._repeat === "one") {
      this._repeat = "off";
    } else {
      this._repeat = "all";
    }
    try { localStorage.setItem("bgm_repeat", this._repeat); } catch { /* */ }
    this.notify();
  }

  /**
   * Auto mode: play a category (shuffled).
   */
  playCategory(category: MusicCategory) {
    this._pendingCategory = category;
    if (this._playlistMode) return;
    if (!this._userInteracted) return;
    if (this._userPaused || this._muted) return;
    if (this._currentCategory === category && this._playing) return;

    const tracks = ALL_TRACKS.filter((t) => t.category === category);
    if (tracks.length === 0) return;
    this._currentCategory = category;
    this.queue = this._shuffle ? shuffleArray(tracks) : [...tracks];
    this.queueIndex = 0;
    this.playTrack(this.queue[0]);
  }

  /**
   * Playlist mode: user picks a track manually.
   */
  playFromPlaylist(track: Track) {
    this._playlistMode = true;
    this._currentCategory = track.category;
    const rest = ALL_TRACKS.filter((t) => t.id !== track.id);
    this.queue = [track, ...(this._shuffle ? shuffleArray(rest) : rest)];
    this.queueIndex = 0;
    this.playTrack(track);
  }

  exitPlaylistMode() {
    if (!this._playlistMode) return;
    this._playlistMode = false;
    this.stop();
    this.notify();
    if (this._pendingCategory) {
      const cat = this._pendingCategory;
      this._currentCategory = null;
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
      this._playing = false;
      this.notify();
    });
    this.notify();
  }

  private handleEnded = () => {
    if (this._repeat === "one") {
      // Repeat same track
      if (this._currentTrack) {
        this.playTrack(this._currentTrack);
      }
      return;
    }

    const nextIndex = this.queueIndex + 1;
    if (nextIndex >= this.queue.length) {
      if (this._repeat === "off") {
        // Stop after queue ends
        this._playing = false;
        this.notify();
        return;
      }
      // "all": loop — re-shuffle if needed
      this.queueIndex = 0;
      if (this._shuffle) {
        this.queue = shuffleArray(this.queue);
      }
    } else {
      this.queueIndex = nextIndex;
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
      this._userPaused = true;
      this.notify();
    }
  }

  resume() {
    if (this.audio && !this._playing) {
      this._userPaused = false;
      this.audio.play().then(() => {
        this._playing = true;
        this.notify();
      }).catch(() => { /* blocked */ });
    }
  }

  togglePlay() {
    if (this._playing) {
      this.pause();
    } else {
      this._userPaused = false;
      if (this._pendingCategory && this._pendingCategory !== this._currentCategory) {
        this._currentCategory = null;
        this.playCategory(this._pendingCategory);
      } else if (this.audio) {
        this.resume();
      } else if (this._pendingCategory) {
        this._currentCategory = null;
        this.playCategory(this._pendingCategory);
      }
    }
  }

  next() {
    if (this.queue.length === 0) return;
    this.queueIndex = (this.queueIndex + 1) % this.queue.length;
    if (this.queueIndex === 0 && this._shuffle) this.queue = shuffleArray(this.queue);
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
