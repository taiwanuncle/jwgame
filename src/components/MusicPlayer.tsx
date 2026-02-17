import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { audioManager, ALL_TRACKS, type Track } from "../utils/audioManager";
import "./MusicPlayer.css";

export default function MusicPlayer() {
  const { t } = useTranslation();
  const [, forceUpdate] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Subscribe to audioManager state changes
  useEffect(() => {
    const unsub = audioManager.subscribe(() => forceUpdate((n) => n + 1));
    return unsub;
  }, []);

  const track = audioManager.currentTrack;
  const playing = audioManager.playing;
  const muted = audioManager.muted;
  const volume = audioManager.volume;

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    audioManager.setVolume(Number(e.target.value));
  }, []);

  const trackDisplayName = (t2: Track) => {
    // Show friendly names
    const names: Record<string, string> = {
      start1: "Start 1",
      start2: "Start 2",
      playing1: "Playing 1",
      playing2: "Playing 2",
      playing3: "Playing 3",
      playing4: "Playing 4",
      playing5: "Playing 5",
      playing6: "Playing 6",
      celebration1: "Celebration 1",
      celebration2: "Celebration 2",
      secret1: "빈 방을 가득 채운 고요의 무게가",
      secret2: "책장 위로 내려앉은 오후의 조각",
      secret3: "투명한 아침의 숨결이 방 안을 채우고",
    };
    return names[t2.id] || t2.name;
  };

  const categoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      start: t("music.catStart"),
      playing: t("music.catPlaying"),
      celebration: t("music.catCelebration"),
      secret: t("music.catSecret"),
    };
    return map[cat] || cat;
  };

  return (
    <>
      {/* Floating music button */}
      <motion.div
        className="music-fab"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
      >
        {playing ? "♪" : "♪"}
        {playing && <span className="music-fab-pulse" />}
      </motion.div>

      {/* Expanded mini-player */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="music-panel glass-card"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Track info */}
            <div className="music-track-info">
              <span className="music-track-name">
                {track ? trackDisplayName(track) : t("music.noTrack")}
              </span>
              {track && (
                <span className="music-track-category">
                  {categoryLabel(track.category)}
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="music-controls">
              <button
                className="music-ctrl-btn"
                onClick={(e) => { e.stopPropagation(); audioManager.togglePlay(); }}
                title={playing ? t("music.pause") : t("music.play")}
              >
                {playing ? "⏸" : "▶"}
              </button>
              <button
                className="music-ctrl-btn"
                onClick={(e) => { e.stopPropagation(); audioManager.next(); }}
                title={t("music.next")}
              >
                ⏭
              </button>
              <button
                className={`music-ctrl-btn ${muted ? "music-ctrl-btn--active" : ""}`}
                onClick={(e) => { e.stopPropagation(); audioManager.toggleMute(); }}
                title={muted ? t("music.unmute") : t("music.mute")}
              >
                {muted ? "🔇" : volume > 0.5 ? "🔊" : "🔉"}
              </button>
            </div>

            {/* Volume slider */}
            <div className="music-volume-row">
              <span className="music-volume-icon">🔈</span>
              <input
                type="range"
                className="music-volume-slider"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="music-volume-icon">🔊</span>
            </div>

            {/* Playlist button */}
            <button
              className="music-playlist-btn"
              onClick={(e) => { e.stopPropagation(); setShowPlaylist(true); setExpanded(false); }}
            >
              {t("music.playlist")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist modal */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            className="music-playlist-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPlaylist(false)}
          >
            <motion.div
              className="music-playlist-modal glass-card"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="music-playlist-header">
                <h2>{t("music.playlist")}</h2>
                <button className="music-playlist-close" onClick={() => setShowPlaylist(false)}>
                  ✕
                </button>
              </div>

              <div className="music-playlist-content">
                {(["start", "playing", "celebration", "secret"] as const).map((cat) => {
                  const tracks = ALL_TRACKS.filter((t2) => t2.category === cat);
                  if (tracks.length === 0) return null;
                  return (
                    <div key={cat} className="music-playlist-group">
                      <h3 className="music-playlist-group-title">{categoryLabel(cat)}</h3>
                      {tracks.map((t2) => (
                        <button
                          key={t2.id}
                          className={`music-playlist-item ${track?.id === t2.id ? "music-playlist-item--active" : ""}`}
                          onClick={() => audioManager.playFromPlaylist(t2)}
                        >
                          <span className="music-playlist-item-icon">
                            {track?.id === t2.id && playing ? "▶" : "♪"}
                          </span>
                          <span className="music-playlist-item-name">
                            {trackDisplayName(t2)}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
