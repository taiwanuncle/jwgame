import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { audioManager, ALL_TRACKS, type Track } from "../utils/audioManager";
import "./MusicPlayer.css";

interface MusicPlayerProps {
  isLobby: boolean;
  hide?: boolean;
  showPlaylist?: boolean;
  onClosePlaylist?: () => void;
}

export default function MusicPlayer({ isLobby, hide, showPlaylist, onClosePlaylist }: MusicPlayerProps) {
  const { t } = useTranslation();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsub = audioManager.subscribe(() => forceUpdate((n) => n + 1));
    return unsub;
  }, []);

  useEffect(() => {
    if (!isLobby && showPlaylist && onClosePlaylist) {
      onClosePlaylist();
      audioManager.exitPlaylistMode();
    }
  }, [isLobby, showPlaylist, onClosePlaylist]);

  const track = audioManager.currentTrack;
  const playing = audioManager.playing;
  const inPlaylistMode = audioManager.playlistMode;
  const shuffleOn = audioManager.shuffleOn;
  const repeatMode = audioManager.repeatMode;

  const handleClosePlaylist = () => {
    if (onClosePlaylist) onClosePlaylist();
    audioManager.exitPlaylistMode();
  };

  const trackDisplayName = (t2: Track) => {
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
      {/* Fixed toggle button — hidden during game (shown in game topbar instead) */}
      {!hide && (
        <button
          className="music-toggle-fab"
          onClick={() => audioManager.togglePlay()}
        >
          {playing ? "🔊" : "🔇"}
        </button>
      )}

      {/* Playlist modal */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            className="music-playlist-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePlaylist}
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
                <button className="music-playlist-close" onClick={handleClosePlaylist}>
                  ✕
                </button>
              </div>

              {/* Playback controls */}
              <div className="music-playlist-controls">
                <button
                  className={`music-ctrl-pill ${shuffleOn ? "music-ctrl-pill--active" : ""}`}
                  onClick={() => audioManager.toggleShuffle()}
                >
                  🔀 {shuffleOn ? "ON" : "OFF"}
                </button>
                <button
                  className={`music-ctrl-pill ${repeatMode !== "off" ? "music-ctrl-pill--active" : ""}`}
                  onClick={() => audioManager.cycleRepeat()}
                >
                  {repeatMode === "one" ? "🔂 1" : repeatMode === "all" ? "🔁 All" : "➡️ Off"}
                </button>
                <button
                  className="music-ctrl-pill"
                  onClick={() => { audioManager.togglePlay(); }}
                >
                  {playing ? "⏸" : "▶"}
                </button>
                <button
                  className="music-ctrl-pill"
                  onClick={() => audioManager.next()}
                >
                  ⏭
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
                          {track?.id === t2.id && inPlaylistMode && (
                            <span className="music-playlist-item-badge">Now</span>
                          )}
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
