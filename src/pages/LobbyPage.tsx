import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import AvatarPicker from "../components/AvatarPicker";
import "./LobbyPage.css";

interface LobbyPageProps {
  onCreateRoom: (nickname: string, avatarIndex: number) => void;
  onJoinRoom: (roomCode: string, nickname: string, avatarIndex: number) => void;
  errorMsg: string;
}

type Mode = "menu" | "create" | "join";

export default function LobbyPage({
  onCreateRoom,
  onJoinRoom,
  errorMsg,
}: LobbyPageProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("menu");
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);

  const handleCreate = () => {
    if (!nickname.trim()) return;
    onCreateRoom(nickname.trim(), avatarIndex);
  };

  const handleJoin = () => {
    if (!nickname.trim() || !roomCode.trim()) return;
    onJoinRoom(roomCode.trim().toUpperCase(), nickname.trim(), avatarIndex);
  };

  return (
    <div className="page-container lobby-page">
      <motion.div
        className="lobby-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="lobby-title">{t("app.title")}</h1>
        <p className="lobby-subtitle">{t("app.subtitle")}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === "menu" && (
          <motion.div
            key="menu"
            className="card-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="lobby-menu">
              <button
                className="btn-primary lobby-menu-btn"
                onClick={() => setMode("create")}
              >
                {t("lobby.createRoom")}
              </button>
              <button
                className="btn-secondary lobby-menu-btn"
                onClick={() => setMode("join")}
              >
                {t("lobby.joinRoom")}
              </button>
            </div>
          </motion.div>
        )}

        {mode === "create" && (
          <motion.div
            key="create"
            className="card-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="lobby-form">
              <h2 className="lobby-form-title">{t("lobby.createRoom")}</h2>

              <div className="lobby-form-section">
                <label className="lobby-label">{t("lobby.selectAvatar")}</label>
                <AvatarPicker selected={avatarIndex} onSelect={setAvatarIndex} />
              </div>

              <div className="lobby-form-section">
                <label className="lobby-label">{t("lobby.nickname")}</label>
                <input
                  className="input-field"
                  placeholder={t("lobby.enterNickname")}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={12}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>

              {errorMsg && <div className="lobby-error">{errorMsg}</div>}

              <div className="lobby-actions">
                <button className="btn-ghost" onClick={() => setMode("menu")}>
                  {t("lobby.back")}
                </button>
                <button
                  className="btn-primary"
                  onClick={handleCreate}
                  disabled={!nickname.trim()}
                >
                  {t("lobby.create")}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {mode === "join" && (
          <motion.div
            key="join"
            className="card-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="lobby-form">
              <h2 className="lobby-form-title">{t("lobby.joinRoom")}</h2>

              <div className="lobby-form-section">
                <label className="lobby-label">{t("lobby.selectAvatar")}</label>
                <AvatarPicker selected={avatarIndex} onSelect={setAvatarIndex} />
              </div>

              <div className="lobby-form-section">
                <label className="lobby-label">{t("lobby.nickname")}</label>
                <input
                  className="input-field"
                  placeholder={t("lobby.enterNickname")}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={12}
                />
              </div>

              <div className="lobby-form-section">
                <label className="lobby-label">{t("lobby.roomCode")}</label>
                <input
                  className="input-field lobby-room-code-input"
                  placeholder={t("lobby.enterRoomCode")}
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={5}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                />
              </div>

              {errorMsg && <div className="lobby-error">{errorMsg}</div>}

              <div className="lobby-actions">
                <button className="btn-ghost" onClick={() => setMode("menu")}>
                  {t("lobby.back")}
                </button>
                <button
                  className="btn-primary"
                  onClick={handleJoin}
                  disabled={!nickname.trim() || !roomCode.trim()}
                >
                  {t("lobby.join")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
