import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import AvatarPicker from "../components/AvatarPicker";
import InfoModal from "../components/InfoModal";
import InstallPrompt from "../components/InstallPrompt";
import CharacterGallery from "../components/CharacterGallery";
import { generateRandomName } from "../utils/randomName";
import type { AvailableRoom } from "../hooks/useSocket";
import "./LobbyPage.css";

interface LobbyPageProps {
  onCreateRoom: (nickname: string, avatarIndex: number, lang?: string) => void;
  onJoinRoom: (roomCode: string, nickname: string, avatarIndex: number) => void;
  onCreateSoloRoom: (nickname: string, avatarIndex: number, botCount: number, lang?: string) => void;
  errorMsg: string;
  availableRooms: AvailableRoom[];
  onShowPlaylist?: () => void;
}

type Mode = "menu" | "create" | "join" | "join-code" | "solo";

export default function LobbyPage({
  onCreateRoom,
  onJoinRoom,
  onCreateSoloRoom,
  errorMsg,
  availableRooms,
  onShowPlaylist,
}: LobbyPageProps) {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<Mode>("menu");
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showKakaoWarning, setShowKakaoWarning] = useState(false);
  const [kakaoHideToday, setKakaoHideToday] = useState(false);
  const [botCount, setBotCount] = useState(3);

  // Detect KakaoTalk in-app browser
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isKakao = ua.includes("kakaotalk") || ua.includes("kakao");
    if (isKakao) {
      const hideUntil = localStorage.getItem("kakao_warn_hide");
      if (hideUntil) {
        const hideDate = new Date(hideUntil);
        if (new Date() < hideDate) return; // still within "hide today" window
      }
      setShowKakaoWarning(true);
    }
  }, []);

  const handleKakaoClose = () => {
    if (kakaoHideToday) {
      // Set hide until end of today
      const tomorrow = new Date();
      tomorrow.setHours(23, 59, 59, 999);
      localStorage.setItem("kakao_warn_hide", tomorrow.toISOString());
    }
    setShowKakaoWarning(false);
  };

  const handleOpenExternal = () => {
    const url = window.location.href;
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);

    if (isIOS) {
      // iOS KakaoTalk in-app browser: use KakaoTalk's openExternal scheme
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
    } else {
      // Android: use intent scheme to open in Chrome
      window.location.href = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
    }
  };

  const handleRandom = () => {
    const result = generateRandomName(i18n.language);
    setAvatarIndex(result.avatarIndex);
    setNickname(result.nickname);
  };

  const handleCreate = () => {
    if (!nickname.trim()) return;
    onCreateRoom(nickname.trim(), avatarIndex, i18n.language);
  };

  const handleJoin = () => {
    if (!nickname.trim() || !roomCode.trim()) return;
    onJoinRoom(roomCode.trim().toUpperCase(), nickname.trim(), avatarIndex);
  };

  const handleJoinSelected = () => {
    if (!nickname.trim() || !selectedRoom) return;
    onJoinRoom(selectedRoom, nickname.trim(), avatarIndex);
  };

  const handleSoloStart = () => {
    if (!nickname.trim()) return;
    onCreateSoloRoom(nickname.trim(), avatarIndex, botCount, i18n.language);
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
              <button
                className="btn-ghost lobby-menu-btn"
                style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
                onClick={() => setMode("solo")}
              >
                🤖 {t("lobby.soloMode")}
              </button>
              <div className="lobby-info-btns">
                <button
                  className="btn-ghost lobby-info-btn"
                  onClick={() => setShowGallery(true)}
                >
                  {t("gallery.button")}
                </button>
                <button
                  className="btn-ghost lobby-info-btn"
                  onClick={() => setShowHowToPlay(true)}
                >
                  {t("info.howToPlay")}
                </button>
              </div>
              <div className="lobby-info-btns">
                <button
                  className="btn-ghost lobby-info-btn"
                  onClick={onShowPlaylist}
                >
                  {t("music.playlist")}
                </button>
                <button
                  className="btn-ghost lobby-info-btn"
                  onClick={() => setShowAbout(true)}
                >
                  {t("info.about")}
                </button>
              </div>
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
                <div className="lobby-nickname-row">
                  <input
                    className="input-field"
                    placeholder={t("lobby.enterNickname")}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={16}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  />
                  <motion.button
                    className="btn-random"
                    onClick={handleRandom}
                    whileTap={{ scale: 0.9, rotate: 180 }}
                    title={t("lobby.randomNickname")}
                  >
                    🎲
                  </motion.button>
                </div>
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
                <div className="lobby-nickname-row">
                  <input
                    className="input-field"
                    placeholder={t("lobby.enterNickname")}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={16}
                  />
                  <motion.button
                    className="btn-random"
                    onClick={handleRandom}
                    whileTap={{ scale: 0.9, rotate: 180 }}
                    title={t("lobby.randomNickname")}
                  >
                    🎲
                  </motion.button>
                </div>
              </div>

              <div className="lobby-form-section">
                <label className="lobby-label">{t("lobby.openRooms")}</label>
                <div className="lobby-room-list">
                  {availableRooms.length === 0 ? (
                    <div className="lobby-room-empty">
                      {t("lobby.noRooms")}
                    </div>
                  ) : (
                    availableRooms.map((room) => (
                      <motion.div
                        key={room.roomCode}
                        className={`lobby-room-item ${
                          selectedRoom === room.roomCode
                            ? "lobby-room-item--selected"
                            : ""
                        }`}
                        onClick={() => setSelectedRoom(room.roomCode)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="lobby-room-item-top">
                          <span className="lobby-room-item-code">
                            {room.roomCode}
                          </span>
                          <span className="lobby-room-item-count">
                            {room.playerCount}/{room.maxPlayers}
                          </span>
                        </div>
                        <div className="lobby-room-item-bottom">
                          <span className="lobby-room-item-host">
                            {t("lobby.host")}: {room.hostNickname}
                          </span>
                          <span className="lobby-room-item-rounds">
                            {room.totalRounds}{t("lobby.roundsSuffix")}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                <button
                  className="btn-ghost lobby-code-link"
                  onClick={() => { setMode("join-code"); setSelectedRoom(null); }}
                >
                  {t("lobby.joinByCode")} →
                </button>
              </div>

              {errorMsg && <div className="lobby-error">{errorMsg}</div>}

              <div className="lobby-actions">
                <button className="btn-ghost" onClick={() => { setMode("menu"); setSelectedRoom(null); }}>
                  {t("lobby.back")}
                </button>
                <button
                  className="btn-primary"
                  onClick={handleJoinSelected}
                  disabled={!nickname.trim() || !selectedRoom}
                >
                  {t("lobby.join")}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {mode === "join-code" && (
          <motion.div
            key="join-code"
            className="card-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="lobby-form">
              <h2 className="lobby-form-title">{t("lobby.joinByCode")}</h2>

              <div className="lobby-form-section">
                <label className="lobby-label">{t("lobby.roomCode")}</label>
                <input
                  className="input-field lobby-room-code-input"
                  placeholder={t("lobby.enterRoomCode")}
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={5}
                  inputMode="text"
                  autoCapitalize="characters"
                  autoComplete="off"
                  pattern="[A-Z0-9]*"
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                />
              </div>

              {errorMsg && <div className="lobby-error">{errorMsg}</div>}

              <div className="lobby-actions">
                <button className="btn-ghost" onClick={() => setMode("join")}>
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

        {mode === "solo" && (
          <motion.div
            key="solo"
            className="card-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="lobby-form">
              <h2 className="lobby-form-title">🤖 {t("lobby.soloMode")}</h2>

              <div className="lobby-form-section">
                <label className="lobby-label">{t("lobby.selectAvatar")}</label>
                <AvatarPicker selected={avatarIndex} onSelect={setAvatarIndex} />
              </div>

              <div className="lobby-form-section">
                <label className="lobby-label">{t("lobby.nickname")}</label>
                <div className="lobby-nickname-row">
                  <input
                    className="input-field"
                    placeholder={t("lobby.enterNickname")}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={16}
                    onKeyDown={(e) => e.key === "Enter" && handleSoloStart()}
                  />
                  <motion.button
                    className="btn-random"
                    onClick={handleRandom}
                    whileTap={{ scale: 0.9, rotate: 180 }}
                    title={t("lobby.randomNickname")}
                  >
                    🎲
                  </motion.button>
                </div>
              </div>

              <div className="lobby-form-section">
                <label className="lobby-label">{t("lobby.botCount")}</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
                  <button
                    className="btn-ghost"
                    style={{ width: 40, height: 40, padding: 0 }}
                    onClick={() => setBotCount((c) => Math.max(2, c - 1))}
                    disabled={botCount <= 2}
                  >
                    -
                  </button>
                  <span style={{ fontSize: 20, fontWeight: 700, minWidth: 40, textAlign: "center" }}>
                    {botCount}
                  </span>
                  <button
                    className="btn-ghost"
                    style={{ width: 40, height: 40, padding: 0 }}
                    onClick={() => setBotCount((c) => Math.min(5, c + 1))}
                    disabled={botCount >= 5}
                  >
                    +
                  </button>
                </div>
              </div>

              {errorMsg && <div className="lobby-error">{errorMsg}</div>}

              <div className="lobby-actions">
                <button className="btn-ghost" onClick={() => setMode("menu")}>
                  {t("lobby.back")}
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSoloStart}
                  disabled={!nickname.trim()}
                >
                  {t("lobby.startSolo")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 게임 방법 모달 */}
      <InfoModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        title={t("info.howToPlay")}
      >
        <h3>{t("info.overviewTitle")}</h3>
        <p style={{ whiteSpace: "pre-line" }}>{t("info.overviewDesc")}</p>

        <h3>{t("info.stepsTitle")}</h3>
        <ol>
          <li>{t("info.step1", { count: 6 })}</li>
          <li>{t("info.step2")}</li>
          <li>{t("info.step3")}</li>
          <li>{t("info.step4")}</li>
          <li>{t("info.step5")}</li>
          <li>{t("info.step6")}</li>
          <li>{t("info.step7")}</li>
        </ol>

        <h3>{t("info.scoringTitle")}</h3>
        <table className="score-table">
          <thead>
            <tr>
              <th>{t("info.scoreSituation")}</th>
              <th>{t("info.scoreStoryteller")}</th>
              <th>{t("info.scoreOthers")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>{t("info.scoreAllCorrect")}</strong></td>
              <td>{t("info.score0")}</td>
              <td>{t("info.score2each")}</td>
            </tr>
            <tr>
              <td><strong>{t("info.scoreAllWrong")}</strong></td>
              <td>{t("info.score0")}</td>
              <td>{t("info.score2each")}</td>
            </tr>
            <tr>
              <td><strong>{t("info.scoreSomeCorrect")}</strong></td>
              <td>{t("info.score3")}</td>
              <td>{t("info.score3correct")}</td>
            </tr>
          </tbody>
        </table>
        <p>{t("info.bonusNote")}</p>

        <h3>{t("info.tipsTitle")}</h3>
        <p style={{ whiteSpace: "pre-line" }}>{t("info.tipsDesc")}</p>

        <p className="copyright-notice">{t("info.aiNotice")}</p>
      </InfoModal>

      {/* 캐릭터 갤러리 */}
      <CharacterGallery isOpen={showGallery} onClose={() => setShowGallery(false)} />

      {/* PWA 홈 화면 추가 안내 */}
      <InstallPrompt />

      {/* 카카오톡 브라우저 경고 */}
      <AnimatePresence>
        {showKakaoWarning && (
          <motion.div
            className="kakao-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="kakao-popup"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="kakao-popup-icon">⚠️</div>
              <h3 className="kakao-popup-title">{t("info.kakaoTitle")}</h3>
              <p className="kakao-popup-text">
                {t("info.kakaoLine1")}<br />
                {t("info.kakaoLine2")}<br />
                <strong>{t("info.kakaoLine3")}</strong>
              </p>
              <button className="btn-primary kakao-popup-btn" onClick={handleOpenExternal}>
                {t("info.kakaoOpen")}
              </button>
              <div className="kakao-popup-bottom">
                <label className="kakao-popup-checkbox">
                  <input
                    type="checkbox"
                    checked={kakaoHideToday}
                    onChange={(e) => setKakaoHideToday(e.target.checked)}
                  />
                  <span>{t("info.kakaoHide")}</span>
                </label>
                <button className="btn-ghost kakao-popup-close" onClick={handleKakaoClose}>
                  {t("info.kakaoClose")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 제작계기 & 후원 모달 */}
      <InfoModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title={t("info.about")}
      >
        <h3>{t("info.motivationTitle")}</h3>
        <p style={{ whiteSpace: "pre-line" }}>{t("info.motivationDesc")}</p>

        <h3>{t("info.creatorTitle")}</h3>
        <p style={{ whiteSpace: "pre-line" }}>{t("info.creatorDesc")}</p>

        <h3>{t("info.contactTitle")}</h3>
        <div className="contact-section">
          <div className="contact-row">
            <span className="contact-label">{t("info.contactEmail")}</span>
            <a href="mailto:atshane81@gmail.com" className="contact-value">
              atshane81@gmail.com
            </a>
          </div>
          <a
            href="https://pf.kakao.com/_exghAX"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-kakao-btn"
          >
            {t("info.contactKakao")}
          </a>
        </div>

        <h3>{t("info.supportTitle")}</h3>
        <div className="donate-section">
          <p>{t("info.supportDesc")}</p>
          {/* Mobile: direct link / Desktop: QR code to scan */}
          <a
            href="https://qr.kakaopay.com/FN0023EGr"
            target="_blank"
            rel="noopener noreferrer"
            className="donate-link donate-link--mobile"
          >
            {t("info.supportBtn")}
          </a>
          <div className="donate-qr-desktop">
            <p className="donate-qr-label">{t("info.supportQr")}</p>
            <img
              className="donate-qr-img"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent("https://qr.kakaopay.com/FN0023EGr")}`}
              alt={t("info.supportQrAlt")}
              width={180}
              height={180}
            />
          </div>
        </div>

        <h3>{t("info.copyrightTitle")}</h3>
        <p style={{ whiteSpace: "pre-line" }}>{t("info.copyrightDesc")}</p>
      </InfoModal>
    </div>
  );
}
