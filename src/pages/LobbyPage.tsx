import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import AvatarPicker from "../components/AvatarPicker";
import InfoModal from "../components/InfoModal";
import type { AvailableRoom } from "../hooks/useSocket";
import "./LobbyPage.css";

const LANGUAGES = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
] as const;

interface LobbyPageProps {
  onCreateRoom: (nickname: string, avatarIndex: number) => void;
  onJoinRoom: (roomCode: string, nickname: string, avatarIndex: number) => void;
  errorMsg: string;
  availableRooms: AvailableRoom[];
}

type Mode = "menu" | "create" | "join" | "join-code";

export default function LobbyPage({
  onCreateRoom,
  onJoinRoom,
  errorMsg,
  availableRooms,
}: LobbyPageProps) {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<Mode>("menu");
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const handleCreate = () => {
    if (!nickname.trim()) return;
    onCreateRoom(nickname.trim(), avatarIndex);
  };

  const handleJoin = () => {
    if (!nickname.trim() || !roomCode.trim()) return;
    onJoinRoom(roomCode.trim().toUpperCase(), nickname.trim(), avatarIndex);
  };

  const handleJoinSelected = () => {
    if (!nickname.trim() || !selectedRoom) return;
    onJoinRoom(selectedRoom, nickname.trim(), avatarIndex);
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
        <div className="lobby-lang-selector">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`lobby-lang-btn ${i18n.language === lang.code ? "lobby-lang-btn--active" : ""}`}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                try { localStorage.setItem("app_lang", lang.code); } catch { /* */ }
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
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
              <div className="lobby-info-btns">
                <button
                  className="btn-ghost lobby-info-btn"
                  onClick={() => setShowHowToPlay(true)}
                >
                  {t("info.howToPlay")}
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
      </AnimatePresence>

      {/* 게임 방법 모달 */}
      <InfoModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        title={t("info.howToPlay")}
      >
        <h3>게임 개요</h3>
        <p>
          성서인물게임은 성서 인물 카드를 사용하는 상상력 제시어 게임입니다.
          3~10명이 함께 즐길 수 있으며, 총 10라운드로 진행됩니다.
        </p>

        <h3>게임 진행 방법</h3>
        <ol>
          <li>각 플레이어에게 <span className="highlight">6장</span>의 카드가 배분됩니다.</li>
          <li>순서대로 한 명이 <strong>제시자</strong>가 됩니다.</li>
          <li>제시자는 자기 카드 중 1장을 고르고, 그 카드를 떠올리게 하는 <strong>제시어</strong>를 입력합니다.</li>
          <li>다른 플레이어들은 제시어를 보고, 자기 카드 중 가장 어울리는 카드 1장을 제출합니다.</li>
          <li>모든 카드가 섞여서 공개되면, 제시자를 제외한 플레이어들이 <strong>"이게 제시자의 카드다!"</strong>라고 생각하는 카드에 투표합니다.</li>
          <li>투표 결과에 따라 점수가 계산됩니다.</li>
          <li>새 카드 1장을 보충받고 다음 라운드로!</li>
        </ol>

        <h3>점수 계산</h3>
        <table className="score-table">
          <thead>
            <tr>
              <th>상황</th>
              <th>제시자</th>
              <th>나머지</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>모두 정답</strong></td>
              <td>0점</td>
              <td>각 2점</td>
            </tr>
            <tr>
              <td><strong>모두 오답</strong></td>
              <td>0점</td>
              <td>각 2점</td>
            </tr>
            <tr>
              <td><strong>일부 정답</strong></td>
              <td>3점</td>
              <td>맞춘 사람 3점</td>
            </tr>
          </tbody>
        </table>
        <p>
          추가로, 다른 플레이어의 카드가 선택될 때마다 그 카드의 주인에게 <span className="highlight">+1점</span>이 부여됩니다!
        </p>

        <h3>팁</h3>
        <p>
          제시어는 너무 쉬우면 모두가 맞춰서 0점, 너무 어려우면 아무도 못 맞춰서 0점!
          적절한 난이도의 제시어를 내는 것이 핵심입니다.
        </p>

        <p className="copyright-notice">
          ※ 사용되는 모든 그림은 AI로 제작되었습니다.
        </p>
      </InfoModal>

      {/* 제작계기 & 후원 모달 */}
      <InfoModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title={t("info.about")}
      >
        <h3>제작 계기</h3>
        <p>
          이 게임은 성서 인물들을 더 친숙하고 재미있게 알아가자는 취지에서 만들어졌습니다.
          모임이나 가족 숭배 시간에 함께 즐기면서 성서 인물들에 대해 생각해볼 수 있는 기회가 되길 바랍니다.
        </p>

        <h3>만든 사람</h3>
        <p>
          이 게임은 사랑하는 형제 자매들을 위해 제작되었습니다.
          개선 사항이나 건의가 있다면 언제든 연락해 주세요.
        </p>

        <h3>후원</h3>
        <div className="donate-section">
          <p>이 게임이 도움이 되셨다면 후원으로 응원해 주세요!</p>
          <a
            href="https://qr.kakaopay.com/FN0023EGr"
            target="_blank"
            rel="noopener noreferrer"
            className="donate-link"
          >
            💛 카카오페이로 후원하기
          </a>
        </div>

        <h3>저작권 안내</h3>
        <p>
          사용되는 모든 그림은 AI로 제작되었습니다.
          본 게임은 비영리 목적으로 제작되었습니다.
        </p>
      </InfoModal>
    </div>
  );
}
